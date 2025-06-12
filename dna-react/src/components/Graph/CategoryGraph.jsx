import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const colorPalette = [
  "#D64B2E",
  "#D79C47",
  "#4B8C6E",
  "#4A77B4",
  "#9E6A92",
  "#D27D77",
  "#9E5F4B",
  "#7F6A9A",
];

const CustomBar = ({ x, y, width, height, index, fill }) => (
  <rect x={x} y={y} width={width} height={height} fill={fill} />
);

const CategoryGraph = ({ data, category }) => {
  const maxCount = Math.max(...data.map((d) => d.count));
  {/* round to nearest 1000 */}
  const roundedMax = Math.ceil(maxCount / 1000) * 1000;
  const containerHeight = data.length > 10 ? "h-[500px]" : "h-[400px]";

  return (
    <div className="p-6 flex flex-col items-center">
      <div
        className={`w-full ${containerHeight} bg-white/80 rounded-lg shadow-lg px-6 py-2 flex flex-col justify-center`}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 className="text-2xl font-semibold text-accent mb-4">{category}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 120, right: 50, top: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis
              type="number"
              stroke="#000"
              tickLine={false}
              tick={{ fill: "#374151", fontSize: 14, fontFamily: "sans-serif" }}
              domain={[0, roundedMax]}
            />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tick={false}
              label={{
                value: "Disease",
                angle: -90,
                position: "insideLeft",
                fill: "#374151",
                fontSize: 14,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ display: "none" }} />
            <Bar
              dataKey="count"
              isAnimationActive={false}
              shape={(props) => (
                <CustomBar
                  {...props}
                  fill={colorPalette[props.index % colorPalette.length]}
                />
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryGraph;
