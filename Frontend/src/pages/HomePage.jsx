import React from "react";
import { motion } from "framer-motion";
import {Link} from "react-router-dom"
export default function HomePage() {
  const diseases = [
    {
      name: "Cyst",
      description:
        "A fluid-filled sac that can develop in the kidneys. Most cysts are harmless but may require monitoring if they grow or cause symptoms.",
    },
    {
      name: "Kidney Stone",
      description:
        "Hard deposits made of minerals and salts that form inside the kidneys. They can cause severe pain, nausea, and urinary issues.",
    },
    {
      name: "Normal",
      description:
        "A healthy kidney without abnormalities. Early detection of issues helps in maintaining normal kidney function.",
    },
    {
      name: "Tumor",
      description:
        "An abnormal mass of tissue in the kidney. Tumors can be benign or malignant (cancerous) and require proper medical evaluation.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white flex flex-col items-center justify-center px-6">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold text-center mb-6 pb-5"
      >
        Kidney Disease Classification
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-lg md:text-xl text-gray-300 max-w-2xl text-center mb-10"
      >
        This project uses Artificial Intelligence to classify kidney conditions
        based on medical images. It helps in early detection and diagnosis of
        different kidney abnormalities.
      </motion.p>

      {/* Classes with Explanation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-4xl"
      >
        {diseases.map((disease, idx) => (
          <div
            key={idx}
            className="bg-gray-800 rounded-2xl shadow-lg p-6 text-center hover:scale-105 transition-transform"
          >
            <h3 className="text-2xl font-semibold mb-3 text-blue-400">
              {disease.name}
            </h3>
            <p className="text-gray-300 text-base">{disease.description}</p>
          </div>
        ))}
      </motion.div>

      {/* Get Started Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}

        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-lg font-semibold rounded-2xl shadow-lg"
      >
       <Link to ="/execute">Get Started</Link>
      </motion.button>
    </div>
  );
}
