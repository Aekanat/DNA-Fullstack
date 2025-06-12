// src/components/Prediction/PredictionForm.jsx

import React, { useState } from "react";

export default function PredictionForm({ onResult, onError }) {
  const [mode, setMode] = useState("text"); // "text" or "file"
  const [sequence, setSequence] = useState("");
  const [chromosome, setChromosome] = useState("");
  const [geneInfo, setGeneInfo] = useState("");
  const [fastaFile, setFastaFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onError("");
    onResult(null);
    setLoading(true);

    try {
      let res;
      if (mode === "file") {
        if (!fastaFile) throw new Error("Please choose a FASTA file.");
        const fd = new FormData();
        fd.append("fasta_file", fastaFile);
        res = await fetch("/api/model/predict/fasta", {
          method: "POST",
          body: fd,
        });
      } else {
        // Clean & uppercase the sequence (strip whitespace/newlines)
        const cleanSeq = sequence.replace(/\s+/g, "").trim().toUpperCase();
        if (!/^[ATCG]+$/.test(cleanSeq)) {
          throw new Error("Sequence may only contain A, T, C, or G.");
        }
        const payload = { sequence: cleanSeq };
        if (chromosome) payload.chromosome = chromosome;
        if (geneInfo) payload.gene_info = geneInfo;

        res = await fetch("/api/model/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        let detail;
        try {
          const errBody = await res.json();
          detail = errBody.detail;
        } catch {
          detail = res.statusText;
        }
        const msg = Array.isArray(detail)
          ? detail.map((d) => d.msg).join("; ")
          : detail || res.statusText;
        throw new Error(msg);
      }

      const data = await res.json();
      onResult(data);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Mode toggle: text & file */}
      <div>
        <label className="font-medium mr-4">
          <input
            type="radio"
            name="mode"
            value="text"
            checked={mode === "text"}
            onChange={() => {
              setMode("text");
              setFastaFile(null);        // clear file if switching back
            }}
          />{" "}
          Manually sequence
        </label>
        <label className="font-medium">
          <input
            type="radio"
            name="mode"
            value="file"
            checked={mode === "file"}
            onChange={() => {
              setMode("file");
              setSequence("");           // clear text inputs if switching
              setChromosome("");
              setGeneInfo("");
            }}
          />{" "}
          Upload FASTA
        </label>
      </div>

      {mode === "text" ? (
        <>
          {/* Text‐entry (single sequence + chromosome/gene) */}
          <div>
            <label className="block font-medium mb-1">Sequence:</label>
            <textarea
              className="w-full border rounded p-2"
              rows={4}
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              placeholder="e.g. ACTGACTG..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Chromosome (optional):
              </label>
              <select
                className="w-full border rounded p-2"
                value={chromosome}
                onChange={(e) => setChromosome(e.target.value)}
              >
                <option value="">-- Select Chromosome --</option>
                {[...Array(22).keys()].map((i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    Chromosome {i + 1}
                  </option>
                ))}
                <option value="X">Chromosome X</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Gene info (optional):</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={geneInfo}
                onChange={(e) => setGeneInfo(e.target.value)}
                placeholder="e.g. BRCA1"
              />
            </div>
          </div>
        </>
      ) : (
        // File‐upload branch when mode === "file"
        <div>
          <label className="block font-medium mb-1">FASTA file:</label>
          <input
            type="file"
            accept=".fasta,.fa"
            onChange={(e) => setFastaFile(e.target.files[0] || null)}
            required
          />
        </div>
      )}

      <button
        type="submit"
        className="btn btn-outline"
        disabled={
          loading ||
          (mode === "text"
            ? sequence.replace(/\s+/g, "").length < 3
            : fastaFile === null)
        }
      >
        {loading ? "Predicting…" : "Predict"}
      </button>
    </form>
  );
}
