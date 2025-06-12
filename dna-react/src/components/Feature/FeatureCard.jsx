import { Link } from "react-router-dom";

function FeatureCard({ title, description, link, color }) {
  return (
    <Link to={link} className="block w-full font-cormorant">
      <div
        className={`p-6 rounded-lg shadow-lg transition transform cursor-pointer h-full text-center ${color} 
        hover:scale-105 hover:shadow-xl hover:bg-opacity-80`}
      >
        <h2
          className="font-style-italic mb-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary-content" // Always text-primary
          style={{ fontFamily: "Old Standard TT", fontSize: "40px" }}
        >
          {title}
        </h2>
        <p
          className="mb-4 text-xl sm:text-2xl lg:text-3xl text-primary-content" // Always text-primary
          style={{ fontFamily: "Old Standard TT", fontSize: "20px" }}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}

export default FeatureCard;
