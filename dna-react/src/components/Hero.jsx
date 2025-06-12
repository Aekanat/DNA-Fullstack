import React from "react";
import labImage from "../assets/img/lab.jpeg";

function Hero() {
  return (
    <div
      className="relative bg-cover bg-center h-[616px]"
      style={{ backgroundImage: `url(${labImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative flex items-center justify-center h-full text-center">
        <h1
          className="font-extrabold "
          style={{ fontFamily: "Agerola", fontSize: "150px", color: "#F3F4F6" }}
        >
          GeneTicS DiseAse ExPloRatiOn
        </h1>
      </div>
    </div>
  );
}

export default Hero;
