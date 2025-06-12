import React from "react";
import { FadeSlideFromLeft, FadeSlideFromRight } from "./FadeinSection";
import equipment from "../assets/img/equipment.jpeg";
import dnaData from "../assets/img/dnaData.jpeg";
import { FadeSlideFromBottom } from "./FadeinSection";

const dataSections = [
  {
    id: 1,
    image: equipment,
    text: "Our dataset is built on the integration of genomic data from Ensembl and clinical information from ClinVar. We designed the process to systematically merge DNA sequence data with variant details so that both sequence changes and their clinical significance are clearly captured.",
    imageLeft: true,
    bgColor: "#F9FAFB",
  },
  {
    id: 2,
    image: dnaData,
    text: "We start by retrieving reference DNA sequences from Ensembl. These sequences are the foundation on which we build our variant datasets, ensuring that our starting point is both accurate and comprehensive.",
    imageLeft: false,
    bgColor: "#EEF2FF",
  },
];

const DataOrigin = () => {
  return (
    <div className="w-full flex flex-col space-y-8">
      {dataSections.map((section) => (
        <div
          key={section.id}
          className="w-full flex flex-col md:flex-row items-center justify-center"
          style={{ backgroundColor: section.bgColor }}
        >
          {section.imageLeft ? (
            <>
              <FadeSlideFromLeft>
                <div
                  className="flex-shrink-0 bg-cover bg-center"
                  style={{
                    width: "600px",
                    height: "400px",
                    backgroundImage: `url(${section.image})`,
                  }}
                />
              </FadeSlideFromLeft>
              <FadeSlideFromRight>
                <div className="md:p-8">
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    {section.text}
                  </p>
                </div>
              </FadeSlideFromRight>
            </>
          ) : (
            <>
              <FadeSlideFromRight>
                <div className="md:p-8">
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    {section.text}
                  </p>
                </div>
              </FadeSlideFromRight>
              <FadeSlideFromLeft>
                <div
                  className="flex-shrink-0 bg-cover bg-center"
                  style={{
                    width: "600px",
                    height: "400px",
                    backgroundImage: `url(${section.image})`,
                  }}
                />
              </FadeSlideFromLeft>
            </>
          )}
        </div>
      ))}
      {/* About Section */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <FadeSlideFromBottom>
            <div className="mx-auto w-full max-w-4xl">
              <div className="aspect-video rounded-lg overflow-hidden shadow-md">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/CA8r06-6yFE"
                  title="YouTube video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </FadeSlideFromBottom>

          <FadeSlideFromBottom>
            <div className="mt-10 max-w-3xl mx-auto text-center md:text-left">
              <p className="text-white text-base md:text-lg leading-relaxed">
                Using a multi-threaded approach with{" "}
                <span className="font-medium">ThreadPoolExecutor</span>, we
                apply various genetic changes such as single nucleotide
                variants (SNVs), insertions, and deletions to the reference
                sequences.
                <br className="hidden md:block" />
                <br className="hidden md:block" />
                This step generates both the{" "}
                <span className="font-medium">
                  normal and altered sequences
                </span>{" "}
                for each entry in our dataset, forming a powerful foundation for
                genomic analysis.
              </p>
            </div>
          </FadeSlideFromBottom>
        </div>
      </section>
    </div>
  );
};

export default DataOrigin;
