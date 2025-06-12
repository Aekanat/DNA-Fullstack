import React, { useState } from "react";

export default function UploadPredictionForm({ onResult, onError }) {
  const [fastaFile, setFastaFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onError("");
    onResult(null);
    setLoading(true);
    try {
      if (!fastaFile) throw new Error("Please choose a FASTA file.");
      const fd = new FormData();
      fd.append("fasta_file", fastaFile);
      const res = await fetch("/api/model/predict/fasta", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        let detail;
        try {
          detail = (await res.json()).detail;
        } catch {
          detail = res.statusText;
        }
        const msg = Array.isArray(detail)
          ? detail.map((d) => d.msg).join("; ")
          : detail || res.statusText;
        throw new Error(msg);
      }
      const data = await res.json(); // This is a list of AttentionResponse objects
      onResult(data);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">FASTA file:</label>
        <input
          type="file"
          accept=".fasta,.fa"
          onChange={(e) => setFastaFile(e.target.files[0] || null)}
          required
        />
      </div>
      <button type="submit" className="btn btn-outline" disabled={loading || !fastaFile}>
        {loading ? "Predicting…" : "Predict via FASTA"}
      </button>
    </form>
  );
}
