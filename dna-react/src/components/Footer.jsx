// src/components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-2">
      <div className="container mx-auto px-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} Silpakorn University – Bachelor’s
          Project
        </p>
      </div>
    </footer>
  );
}

export default Footer;
