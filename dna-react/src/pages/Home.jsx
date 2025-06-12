import React from "react";
import Hero from "../components/Hero";
import FeaturesSection from "../components/Feature/FeatureSec";
import About from "../components/About";
import ScrollingGraph from "../components/Graph/ScrollingGraph";
import DataOrigin from "../components/DataOrigin";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <About />
      <DataOrigin />
      <ScrollingGraph />
      <Footer />
    </>
  );
}

export default Home;
