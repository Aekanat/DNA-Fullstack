import React, { useState, useEffect } from "react";
import FilterBar from "../components/Filter/FilterBar";
import CsvTable from "../components/csv/CsvTable";
import GraphDashboard from "../components/csv/GraphDashBoard";

function DataExploration() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 100;

  const apiMapping = {
    GENEINFO: "geneinfo",
    CHROM: "chrom",
    ALT_TYPE: "alt_type",
    REF: "ref",
    ALT_VALUE: "alt_value",
    CLNSIG: "clnsig",
    CLNDN: "clndn",
    Category: "category",
    position_start: "position_start",
    position_stop: "position_stop",
  };

  const fetchData = (page = currentPage, currentFilters = filters) => {
    const url = new URL(window.location.origin + "/api/data/advanced-search");
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", itemsPerPage);

    for (const [colKey, value] of Object.entries(currentFilters)) {
      const apiParam = apiMapping[colKey];
      if (apiParam) {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((val) => params.append(apiParam, val));
        } else if (typeof value === "string" && value.trim() !== "") {
          params.append(apiParam, value);
        } else if (!isNaN(value) && value !== "") {
          params.append(apiParam, value);
        }
      }
    }
    url.search = params.toString();

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setData(json.data.data);
        setTotalPages(json.data.total_pages);
        setCurrentPage(json.data.page);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchData(currentPage, filters);
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex pt-4">
      {/* Sidebar */}
      <div className="w-1/4 p-2">
        <div className="sticky top-4">
          <FilterBar onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* Content Area */}

      <div className=" p-4 flex-1 flex-col items-center justify-start overflow-hidden">
        <div className="w-full max-w-7xl flex flex-col gap-4">
          <GraphDashboard filters={filters} />

          <h1 className="text-2xl font-bold mb-4 text-center">
            Data Exploration
          </h1>

          <div className="flex-1">
            {data.length > 0 ? (
              <CsvTable data={data} />
            ) : (
              <p>No data available</p>
            )}
          </div>

          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              className="btn btn-outline"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}

export default DataExploration;
