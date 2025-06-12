import React from "react";

function formatFilterLabel(rawLabel) {
  if (!rawLabel) {
    return "Unknown"; 
  }
  return (
    rawLabel
      .replace(/[_-]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
}

function CheckboxFilter({
  filters,
  columns,
  expanded,
  uniqueValues,
  selectedFilters,
  onCheckboxChange,
  onToggle,
}) {
  return (
    <div className="flex flex-col gap-2">
      {filters.map((colKey) => {
        const isExpanded = expanded[colKey];
        const columnName = columns[colKey] || colKey;
        const values = uniqueValues[colKey] || [];

        return (
          <div key={colKey} className="border border-base-300 rounded-md">
            {/* Header with arrow icon on the left */}
            <div
              onClick={() => onToggle(colKey)}
              className="flex items-center bg-accent text-white px-4 py-2 cursor-pointer"
            >
              <svg
                className={`mr-2 h-5 w-5 transform transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              {columnName}
            </div>

            {/* Expanded toggle filters */}
            {isExpanded && (
              <div className="p-4 gap-2 bg-base-100 flex flex-col">
                {values.length > 0 ? (
                  values.map((val) => {
                    const isToggled =
                      selectedFilters[colKey] &&
                      selectedFilters[colKey].includes(val);

                    return (
                      <label
                        key={val}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-full px-3 py-1 cursor-pointer"
                        title={formatFilterLabel(val)} // Tooltip for full label
                      >
                        {/* Use the truncate class and set a maximum width */}
                        <span className="truncate max-w-[150px]">
                          {formatFilterLabel(val)}
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={isToggled || false}
                          onChange={(e) =>
                            onCheckboxChange(colKey, val, e.target.checked)
                          }
                        />
                      </label>
                    );
                  })
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CheckboxFilter;
