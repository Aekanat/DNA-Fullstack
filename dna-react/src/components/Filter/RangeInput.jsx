import React from "react";

function RangeInput({ filters, selectedFilters, onInputChange }) {
  return (
    <div>
      <label className="block text-sm font-medium">Position Range</label>
      <div className="flex gap-2">
        {filters.map((key, idx) => (
          <input
            key={idx}
            type="number"
            className="input input-bordered w-1/2"
            placeholder={key === "position_start" ? "Start" : "End"}
            min={1}
            max={5000000}
            value={selectedFilters[key] || ""}
            onChange={(e) => {
              const val = e.target.value;
              const parsed = val ? parseInt(val, 10) : "";
              if (parsed === "" || (parsed >= 1 && parsed <= 5000000)) {
                onInputChange(key, parsed);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default RangeInput;
