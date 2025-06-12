import React from "react";
import PropTypes from "prop-types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AttentionChart({ attentionWeights, height = 300 }) {
  const data = attentionWeights.map((w, i) => ({
    index: i,
    weight: w,
  }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          {/* Light grid */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* X axis: k-mer index */}
          <XAxis
            dataKey="index"
            label={{ value: "k-mer Index", position: "bottom", offset: 0 }}
            tick={{ fontSize: 12 }}
            tickLine={false}
          />

          {/* Y axis: attention weight */}
          <YAxis
            domain={[0, "dataMax"]}
            label={{
              value: "Attention Weight (α)",
              angle: -90,
              position: "left",
              offset: 0,
            }}
            tick={{ fontSize: 12 }}
            tickLine={false}
          />

          {/* Tooltip to show exact values */}
          <Tooltip
            formatter={(value) => value.toFixed(6)}
            labelFormatter={(label) => `Index: ${label}`}
          />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#1976d2"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

AttentionChart.propTypes = {
  attentionWeights: PropTypes.arrayOf(PropTypes.number).isRequired,
  height: PropTypes.number,
};

AttentionChart.defaultProps = {
  height: 300,
};
