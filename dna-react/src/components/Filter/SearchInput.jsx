import React from "react";

function SearchInput({ filters, columns, selectedFilters, onInputChange }) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      {filters.map((key) => (
        <div key={key}>
          <label className="block text-sm font-medium">
            {columns[key] || key}
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder={`Search ${columns[key] || key}`}
            value={selectedFilters[key] || ""}
            onChange={(e) => onInputChange(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default SearchInput;
