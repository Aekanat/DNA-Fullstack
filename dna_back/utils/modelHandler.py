import joblib
import json
import tensorflow as tf
import numpy as np
from pathlib import Path
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model, Model

# Directories & Paths
BASE_DIR       = Path(__file__).resolve().parent.parent
MODEL_DIR      = BASE_DIR / "Model" / "Attention"

# Classification‐only models (output: softmax probabilities)
SEQ_ONLY_MODEL_PATH      = MODEL_DIR / "seq_only_model.keras"
SEQ_CHR_MODEL_PATH       = MODEL_DIR / "seq_chr_model.keras"
SEQ_GENE_MODEL_PATH      = MODEL_DIR / "seq_gene_model.keras"
SEQ_CHRGENE_MODEL_PATH   = MODEL_DIR / "seq_chr_gene_model.keras"

# Attention‐only models (output: α vector)
ATT_SEQ_MODEL_PATH       = MODEL_DIR / "attention_model_seq.keras"
ATT_CHR_MODEL_PATH       = MODEL_DIR / "attention_model_seq_chr.keras"
ATT_GENE_MODEL_PATH      = MODEL_DIR / "attention_model_seq_gene.keras"
ATT_CHRGENE_MODEL_PATH   = MODEL_DIR / "attention_model_seq_chr_gene.keras"

# Preprocessors (tokenizer, OHEs, label_map)
TOKENIZER_PATH   = MODEL_DIR / "tokenizer.pkl"
CHROM_OHE_PATH   = MODEL_DIR / "chrom_ohe.pkl"
GENE_OHE_PATH    = MODEL_DIR / "gene_ohe.pkl"
LABEL_MAP_PATH   = MODEL_DIR / "label_map.json"

# Hyperparameters
KMER_K           = 3
MAX_LEN_BILSTM   = 400


# Custom AttentionLayer
class AttentionLayer(tf.keras.layers.Layer):
    """
    Exactly the same implementation you already have.
    It returns (context_vector, alphas) in call(...)
    """
    def __init__(self, **kwargs):
        super(AttentionLayer, self).__init__(**kwargs)

    def build(self, input_shape):
        self.W = self.add_weight(
            name="att_weight",
            shape=(input_shape[-1], input_shape[-1]),
            initializer="glorot_uniform",
            trainable=True,
        )
        self.b = self.add_weight(
            name="att_bias",
            shape=(input_shape[-1],),
            initializer="zeros",
            trainable=True,
        )
        self.u = self.add_weight(
            name="att_u",
            shape=(input_shape[-1],),
            initializer="glorot_uniform",
            trainable=True,
        )
        super(AttentionLayer, self).build(input_shape)

    def call(self, inputs):
        # inputs shape: (batch_size, time_steps, hidden_dim)
        v = tf.tanh(tf.tensordot(inputs, self.W, axes=1) + self.b)  # (batch, time, hidden)
        vu = tf.tensordot(v, self.u, axes=1)                         # (batch, time)
        alphas = tf.nn.softmax(vu)                                   # (batch, time)
        # Weighted sum
        output = tf.reduce_sum(inputs * tf.expand_dims(alphas, -1), axis=1)  # (batch, hidden)
        return output, alphas


# Load Classification‐Only Models
seq_only_model      = load_model(SEQ_ONLY_MODEL_PATH,    custom_objects={'AttentionLayer': AttentionLayer})
seq_chr_model       = load_model(SEQ_CHR_MODEL_PATH,     custom_objects={'AttentionLayer': AttentionLayer})
seq_gene_model      = load_model(SEQ_GENE_MODEL_PATH,    custom_objects={'AttentionLayer': AttentionLayer})
seq_chrgene_model   = load_model(SEQ_CHRGENE_MODEL_PATH, custom_objects={'AttentionLayer': AttentionLayer})

# Load Attention‐Only Models 
att_seq_model       = load_model(ATT_SEQ_MODEL_PATH,      custom_objects={'AttentionLayer': AttentionLayer})
att_chr_model       = load_model(ATT_CHR_MODEL_PATH,      custom_objects={'AttentionLayer': AttentionLayer})
att_gene_model      = load_model(ATT_GENE_MODEL_PATH,     custom_objects={'AttentionLayer': AttentionLayer})
att_chrgene_model   = load_model(ATT_CHRGENE_MODEL_PATH,  custom_objects={'AttentionLayer': AttentionLayer})


# Load Tokenizer / OHEs / Label Map
with open(TOKENIZER_PATH, "rb") as f:
    tokenizer = joblib.load(f)

with open(CHROM_OHE_PATH, "rb") as f:
    chrom_ohe = joblib.load(f)

with open(GENE_OHE_PATH, "rb") as f:
    gene_ohe = joblib.load(f)

with open(LABEL_MAP_PATH, "r") as f:
    label_map = json.load(f)


# Utility Functions 
def _extract_kmers(seq: str, k: int) -> list[str]:
    return [seq[i : i + k] for i in range(len(seq) - k + 1)]


def preprocess_sequence(raw_seq: str, max_len: int) -> np.ndarray:
    """
    1) Upper‐case
    2) Extract K‐mers of size = KMER_K
    3) tokenizer.texts_to_sequences →  integer indices per k‐mer
    4) pad_sequences to length = max_len
    """
    seq = raw_seq.upper()
    kmers = _extract_kmers(seq, KMER_K)
    seqs = tokenizer.texts_to_sequences([kmers])  # → list of lists
    padded = pad_sequences(
        seqs,
        maxlen=max_len,
        padding="post",
        truncating="post",
        value=0,
    )
    return padded  # shape = (1, max_len)

def preprocess_chrom(chrom: str) -> np.ndarray:
    chrom_val = str(chrom).strip().upper()
    return chrom_ohe.transform([[chrom_val]])  # shape = (1, chrom_dim)


def preprocess_gene(gene: str) -> np.ndarray:
    gene_val = str(gene).strip().upper()
    return gene_ohe.transform([[gene_val]])    # shape = (1, gene_dim)

#  “Attention” Prediction
def attention_predict_auto(
    sequence: str,
    chromosome: str = None,
    gene_info: str = None,
) -> tuple[int, np.ndarray, np.ndarray]:
    """
    Returns:
      - idx   (int): argmax(probs)
      - probs (np.ndarray, shape=(num_classes,))
      - alphas(np.ndarray, shape=(time_steps,)): attention weights
    """
    padded_seq = preprocess_sequence(sequence, MAX_LEN_BILSTM)
    chrom_inp = preprocess_chrom(chromosome) if chromosome else None
    gene_inp  = preprocess_gene(gene_info)   if gene_info  else None

    if chromosome and gene_info:
        # 1) Classification model → softmax
        print(padded_seq, chrom_inp, gene_inp)
        probs  = seq_chrgene_model.predict([padded_seq, chrom_inp, gene_inp])[0]
        # 2) Attention‐only model → α vector
        alphas = att_chrgene_model.predict([padded_seq, chrom_inp, gene_inp])[0]

    elif chromosome:
        print("BiLSTM with chromosome")
        probs  = seq_chr_model.predict([padded_seq, chrom_inp])[0]
        alphas = att_chr_model.predict([padded_seq, chrom_inp])[0]

    elif gene_info:
        print("BiLSTM with gene")
        probs  = seq_gene_model.predict([padded_seq, gene_inp])[0]
        alphas = att_gene_model.predict([padded_seq, gene_inp])[0]

    else:
        probs  = seq_only_model.predict(padded_seq)[0]
        alphas = att_seq_model.predict(padded_seq)[0]

    idx = int(np.argmax(probs))
    return idx, probs, alphas
