// FilterBar.jsx
import { useState, useEffect, useCallback } from "react";
import SearchInputs from "./SearchInput";
import PositionRangeInput from "./RangeInput";
import CheckboxFilters from "./CheckboxFilter";

function FilterBar({ onFilterChange }) {
  const [columns, setColumns] = useState({});
  const [expanded, setExpanded] = useState({});
  const [uniqueValues, setUniqueValues] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});

  const searchFilters = ["GENEINFO", "REF", "ALT_VALUE"];
  const positionFilters = ["position_start", "position_stop"];
  const checkboxFilters = ["CHROM", "ALT_TYPE", "CLNSIG", "CLNDN", "Category"];

  useEffect(() => {
    fetch("/api/metadata/columns")
      .then((res) => res.json())
      .then((data) => setColumns(data.columns))
      .catch(console.error);
  }, []);

  const handleInputChange = (key, value) => {
    const newFilters = { ...selectedFilters, [key]: value };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCheckboxChange = useCallback(
    (colKey, value, checked) => {
      const current = selectedFilters[colKey] || [];
      const updated = checked
        ? [...current, value]
        : current.filter((v) => v !== value);

      const newFilters = { ...selectedFilters };

      if (updated.length === 0) {
        delete newFilters[colKey];
      } else {
        newFilters[colKey] = updated;
      }

      setSelectedFilters(newFilters);
      onFilterChange(newFilters);
    },
    [selectedFilters, onFilterChange]
  );

  const toggleColumn = (colKey) => {
    setExpanded((prev) => ({ ...prev, [colKey]: !prev[colKey] }));
    if (!uniqueValues[colKey]) {
      fetch(`/api/metadata/unique-values?column=${colKey}`)
        .then((res) => res.json())
        .then((data) =>
          setUniqueValues((prev) => ({ ...prev, [colKey]: data.values }))
        )
        .catch(console.error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      {/* Increase width and adjust font sizes with Tailwind classes */}
      <div className="p-4 bg-company-100 flex flex-col h-full rounded-xl shadow-lg w-full max-w-6xl text-sm">
        <h2 className="text-xl font-bold text-company-secondary border-b-2 border-company-primary pb-2 mb-4">
          Search Filters
        </h2>
        <SearchInputs
          filters={searchFilters}
          columns={columns}
          selectedFilters={selectedFilters}
          onInputChange={handleInputChange}
        />
        <PositionRangeInput
          filters={positionFilters}
          selectedFilters={selectedFilters}
          onInputChange={handleInputChange}
        />

        <h2 className="mt-6 text-xl font-bold text-company-secondary border-b-2 border-company-primary pb-2 mb-4">
          Filter by Options
        </h2>
        <CheckboxFilters
          filters={checkboxFilters}
          columns={columns}
          expanded={expanded}
          uniqueValues={uniqueValues}
          selectedFilters={selectedFilters}
          onCheckboxChange={handleCheckboxChange}
          onToggle={toggleColumn}
        />
      </div>
    </div>
  );
}

export default FilterBar;
