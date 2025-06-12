import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CategoryGraph from "./CategoryGraph";
import bg from "../../assets/img/lightBl.png";

const GraphWrapper = ({ data, category }) => {
  const { ref, entry } = useInView({
    threshold: Array.from({ length: 101 }, (_, i) => i / 100),
  });
  const opacity = entry ? entry.intersectionRatio : 0;

  return (
    <div
      ref={ref}
      style={{
        opacity,
        transition: "opacity 0.5s ease-out",
      }}
    >
      <CategoryGraph data={data} category={category} />
    </div>
  );
};

const ScrollingGraph = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("/api/data/disease-counts")
      .then((response) => response.json())
      .then((data) => {
        const transformedData = Object.entries(data.data).map(
          ([category, diseases]) => ({
            category: category.replace(/_/g, " "),
            diseases: Object.entries(diseases).map(([disease, count]) => ({
              name: disease.replace(/_/g, " "),
              count,
            })),
          })
        );
        setChartData(transformedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div
      className="relative w-full bg-cover bg-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-0" />
      <div className="relative flex flex-col items-center justify-center w-full py-8">
        <h2 className="text-5xl font-bold mb-6 text-center font-cormorant bg-base-300 text-primary-content p-4 rounded-lg shadow-md">
          Hereditary Condition
        </h2>
        <div className="w-full">
          {chartData.map(({ category, diseases }) => (
            <GraphWrapper key={category} data={diseases} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingGraph;
