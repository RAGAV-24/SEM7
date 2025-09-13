import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">

        {/* Left Section */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold">Kidney Disease Prediction</h2>
          <p className="text-sm text-gray-400">
            Empowering health insights through AI
          </p>
        </div>

        {/* Middle Section - Links */}
        <div className="flex space-x-6 text-gray-300">
          <a href="#" className="hover:text-amber-300">Home</a>
          <a href="#" className="hover:text-amber-300">Model</a>
          <a href="#" className="hover:text-amber-300">Login</a>
        </div>

        {/* Right Section - Disclaimer */}
        <div className="text-xs text-gray-400 text-center md:text-right mt-4 md:mt-0 max-w-xs">
          Disclaimer: This project is for educational and research purposes only.
          It should not be used as a substitute for professional medical advice.
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-gray-500 text-xs mt-6 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Kidney Disease Prediction Project. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
