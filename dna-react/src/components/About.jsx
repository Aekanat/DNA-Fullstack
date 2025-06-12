import React from "react";

function About() {
  return (
    <section className="bg-offwhite-200 py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold text-red-800">Disclaimer</h2>
        <p className="mt-4 text-gray-600">
          This dataset contains only a portion of data from the ClinVar and Ensembl databases, focusing specifically on cancer, cardiovascular diseases, and genetic disorders.
        </p>
      </div>
    </section>
  );
}

export default About;
