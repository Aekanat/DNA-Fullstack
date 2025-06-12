import React from "react";

function CsvTable({ data }) {
  return (
    <div
      className="overflow-x-auto border rounded"
      style={{
        maxHeight: "500px",       
        overflowY: "auto",        // vertical scroll
        overflowX: "auto",        // horizontal scroll
        whiteSpace: "nowrap",     
      }}
    >
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            {Object.keys(data[0]).map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {Object.values(row).map((cell, i) => (
                <td
                  key={i}
                  title={cell}
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "200px", 
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CsvTable;
