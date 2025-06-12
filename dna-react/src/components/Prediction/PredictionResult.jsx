import React from "react";
import PropTypes from "prop-types";
import AttentionChart from "./AttentionChart";

function humanizeLabel(label) {
  if (typeof label !== "string") return "";
  return label.split("_").join(" ");
}

function SingleResult({ result }) {
  return (
    <div className="space-y-6 border rounded p-4 shadow">
      {/* Top Prediction */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Top Prediction</h2>
        <p className="mb-4">
          <span className="font-bold">
            {humanizeLabel(result.prediction_label)}
          </span>{" "}
          <span>({(result.confidence * 100).toFixed(1)}%)</span>
        </p>
      </div>

      {/* All Class Confidences */}
      <div>
        <h3 className="text-xl font-semibold mb-2">All Class Confidences</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-3 py-1">Class</th>
                <th className="border px-3 py-1">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {result.confidences.map((c, i) => (
                <tr key={i}>
                  <td className="border px-3 py-1">{humanizeLabel(c.label)}</td>
                  <td className="border px-3 py-1">
                    {(c.confidence * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attention Chart */}
      <div>
        <h3 className="text-xl font-semibold mb-2">
          Attention Weights over k-mer Indices
        </h3>
        <AttentionChart attentionWeights={result.attention_weights} />
      </div>
    </div>
  );
}

export default function PredictionResult({ result }) {
  if (!result) return null;

  const resultsArray = Array.isArray(result) ? result : [result];

  return (
    <div className="space-y-8">
      {resultsArray.map((r, i) => (
        <SingleResult key={i} result={r} />
      ))}
    </div>
  );
}

PredictionResult.propTypes = {
  result: PropTypes.oneOfType([
    PropTypes.shape({
      prediction_idx: PropTypes.number.isRequired,
      prediction_label: PropTypes.string.isRequired,
      confidence: PropTypes.number.isRequired,
      confidences: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          confidence: PropTypes.number.isRequired,
        })
      ).isRequired,
      attention_weights: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        prediction_idx: PropTypes.number.isRequired,
        prediction_label: PropTypes.string.isRequired,
        confidence: PropTypes.number.isRequired,
        confidences: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string.isRequired,
            confidence: PropTypes.number.isRequired,
          })
        ).isRequired,
        attention_weights: PropTypes.arrayOf(PropTypes.number).isRequired,
      })
    ),
  ]),
};
