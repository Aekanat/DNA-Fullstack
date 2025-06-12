import React from "react";
import FeatureCard from "./FeatureCard";

function FeatureSec({ theme }) {
  return (
    <section className="flex gap-8 p-8 bg-base-100 justify-center">
      <FeatureCard
        title="Data Exploration"
        description="Data Gathering from ClinVar & Ensembl"
        link="/data-exploration"
        color="bg-primary"
      />
      <FeatureCard
        title="Disease Prediction"
        description="Predict Disease from Gene"
        link="/disease-prediction"
        color="bg-secondary"
      />
    </section>
  );
}

export default FeatureSec;
