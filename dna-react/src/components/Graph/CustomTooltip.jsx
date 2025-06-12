import React from "react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { name } = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <p className="text-lg font-semibold text-primary">
          <strong>{name}</strong>
        </p>
        <p className="text-gray-600">Total Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
