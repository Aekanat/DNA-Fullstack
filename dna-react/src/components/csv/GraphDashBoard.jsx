import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

function GraphDashboard({ filters }) {
  const [altTypeData, setAltTypeData] = useState([]);
  const [geneData, setGeneData] = useState([]);
  const [clnsigData, setClnsigData] = useState([]);
  const [chromData, setChromData] = useState([]);

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

  const buildQuery = () => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      const param = apiMapping[key];
      if (!param) continue;

      if (Array.isArray(value)) {
        value.forEach((v) => params.append(param, v));
      } else if (value !== "") {
        params.append(param, value);
      }
    }
    return params.toString();
  };

  useEffect(() => {
    const query = buildQuery();
    fetch(`/api/data/variant-counts/chromosomes?${query}`)
      .then((res) => res.json())
      .then((json) => setChromData(json.data))
      .catch((err) => console.error("Error fetching chrom data:", err));

    fetch(`/api/data/variant-counts/alt-type?${query}`)
      .then((res) => res.json())
      .then((json) => setAltTypeData(json.data))
      .catch((err) => console.error("Error fetching ALT type data:", err));

    fetch(`/api/data/variant-counts/genes?${query}`)
      .then((res) => res.json())
      .then((json) => setGeneData(json.data))
      .catch((err) => console.error("Error fetching gene data:", err));

    fetch(`/api/data/variant-counts/clinical-significance?${query}`)
      .then((res) => res.json())
      .then((json) => setClnsigData(json.data))
      .catch((err) => console.error("Error fetching clnsig data:", err));
  }, [filters]);

  const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Variant Data Dashboard</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          gap: "40px",
        }}
      >
        {/* ALT Type Distribution - Bar Chart */}
        <div style={{ width: "45%", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={altTypeData}>
              <XAxis dataKey="alt_type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Genes by Variant Count - Bar Chart */}
        <div style={{ width: "45%", height: "300px" }}>
          <h3>Top 10 Genes by Variant Count</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={geneData}>
              <XAxis dataKey="gene" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#547bc1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Clinical Significance Distribution - Pie Chart */}
        <div style={{ width: "45%", height: "300px" }}>
          <h3>Clinical Significance Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={clnsigData}
                dataKey="count"
                nameKey="clnsig"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {clnsigData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Variant Count per Chromosome - Bar Chart */}
        <div style={{ width: "45%", height: "300px" }}>
          <h3>Variant Count per Chromosome</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chromData}>
              <XAxis
                dataKey="chromosome"
                label={{
                  value: "Chromosome",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default GraphDashboard;
