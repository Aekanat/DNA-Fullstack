import re
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, field_validator
from typing import List, Optional
from Bio import SeqIO
from io import StringIO

from utils.modelHandler import (
    attention_predict_auto,
    label_map,
)

router = APIRouter()
TRAIN_CHROMS = {str(i) for i in range(1, 23)} | {"X"}


# attention‐based prediction
class AttentionResponseClassConf(BaseModel):
    """Single label + confidence."""
    label:      str
    confidence: float


class AttentionResponse(BaseModel):
    """
    Response for attention‐based prediction:
      - prediction_idx     (int)
      - prediction_label   (str)
      - confidence         (float)
      - confidences        (list of { label, confidence })
      - attention_weights  (list of floats, one α per time step)
    """
    prediction_idx:    int
    prediction_label:  str
    confidence:        float
    confidences:       List[AttentionResponseClassConf]
    attention_weights: List[float]


class PredictRequest(BaseModel):
    sequence:    str
    chromosome:  Optional[str] = None
    gene_info:   Optional[str] = None

    @field_validator("sequence")
    def only_atcg(cls, seq):
        seq = seq.strip().upper()
        if not re.fullmatch(r"[ATCG]+", seq):
            raise ValueError("Sequence may only contain A, T, C, or G.")
        return seq

    @field_validator("chromosome")
    def valid_chrom(cls, chrom):
        if chrom is None:
            return None
        c = chrom.strip().upper()
        if c not in TRAIN_CHROMS:
            raise ValueError(f"Chromosome must be one of {sorted(TRAIN_CHROMS)}")
        return c

    @field_validator("gene_info")
    def valid_gene(cls, gi):
        if gi is None:
            return None
        gi2 = gi.strip().upper()
        if not re.fullmatch(r"[A-Z0-9]+", gi2):
            raise ValueError("Gene info must be alphabet or numeric.")
        return gi2


@router.post(
    "/predict",
    response_model=AttentionResponse,
    summary="Predict on a DNA sequence (returns attention weights)",
)
def predict(req: PredictRequest) -> AttentionResponse:
    """
    This endpoint always returns both class probabilities and the raw attention weights.
    Internally, it calls `attention_predict_auto(...)` under the hood.
    """
    if not req.sequence:
        raise HTTPException(status_code=400, detail="Sequence cannot be empty.")

    try:
        idx, probs, alphas = attention_predict_auto(
            sequence=req.sequence,
            chromosome=req.chromosome,
            gene_info=req.gene_info,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Build a list of {label, confidence}
    confs = [
        AttentionResponseClassConf(label=label_map[str(i)], confidence=float(p))
        for i, p in enumerate(probs)
    ]

    attention_list = [float(a) for a in alphas]

    return AttentionResponse(
        prediction_idx=idx,
        prediction_label=label_map[str(idx)],
        confidence=float(probs[idx]),
        confidences=confs,
        attention_weights=attention_list,
    )


@router.post(
    "/predict/fasta",
    response_model=List[AttentionResponse],
    summary="Predict + return attention weights for each record in FASTA",
)
async def predict_fasta(
    fasta_file: UploadFile = File(...),
) -> List[AttentionResponse]:
    """
    Accepts a FASTA file, processes each valid ATCG record, and returns
    AttentionResponse for each sequence. Invalid or non‐ATCG records are skipped.
    """
    try:
        contents = fasta_file.file.read()
        text = contents.decode("utf-8-sig")
        records = list(SeqIO.parse(StringIO(text), "fasta"))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid FASTA format")

    results: List[AttentionResponse] = []
    for rec in records:
        seq = str(rec.seq).strip().upper()
        if not re.fullmatch(r"[ATCG]+", seq):
            # Skip any record whose sequence is not purely ATCG
            continue

        try:
            idx, probs, alphas = attention_predict_auto(sequence=seq)
        except ValueError:
            # Skip sequences that fail preprocessing/validation
            continue

        confs = [
            AttentionResponseClassConf(label=label_map[str(i)], confidence=float(p))
            for i, p in enumerate(probs)
        ]
        attention_list = [float(a) for a in alphas]

        results.append(
            AttentionResponse(
                prediction_idx=idx,
                prediction_label=label_map[str(idx)],
                confidence=float(probs[idx]),
                confidences=confs,
                attention_weights=attention_list,
            )
        )

    if not results:
        raise HTTPException(status_code=400, detail="No valid ATCG sequences found in FASTA")
    return results
