import React from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { getPredictedLabel } from "../services/GradcamResult"; // import helper

export default function GradcamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, result, gradcam } = location.state || {};

  const predictedLabel = getPredictedLabel(result);

  if (!image || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>No result found. Please upload an image first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center px-6 py-16">
      {/* Grad-CAM Section */}
      {gradcam && (
        <div className="mt-8 w-full flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-cyan-400 mb-4"
          >
            Explainability (Grad-CAM)
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-300 text-center mb-8 max-w-3xl"
          >
            Predicted Class: <span className="font-bold text-cyan-300">{predictedLabel}</span>
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start max-w-6xl w-full">
            {/* Left - Original */}
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4 text-center">
                Original Image
              </h3>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                src={image}
                alt="Uploaded"
                className="w-full h-96 object-cover rounded-2xl border border-gray-700 shadow-lg"
              />
            </div>

            {/* Right - Grad-CAM Heatmap */}
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4 text-center">
                Grad-CAM Heatmap
              </h3>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                src={`data:image/png;base64,${gradcam}`}
                alt="GradCAM Heatmap"
                className="w-full h-96 object-cover rounded-2xl border border-gray-700 shadow-lg"
              />
            </div>
          </div>

          {/* Color Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 w-full max-w-4xl bg-gray-800 rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
              Heatmap Color Legend
            </h2>

            <div className="space-y-4">
              {/* Color Gradient Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 h-12 rounded-lg" style={{
                  background: 'linear-gradient(to right, #3b82f6, #06b6d4, #10b981, #fbbf24, #f59e0b, #ef4444)'
                }}></div>
              </div>

              {/* Legend Items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Red - High */}
                <div className="flex items-center space-x-4 bg-gray-700 p-4 rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-red-500 shadow-lg flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-red-400 text-lg">Red</h3>
                    <p className="text-gray-300 text-sm">High Concentration</p>
                    <p className="text-gray-400 text-xs mt-1">Model's primary focus area</p>
                  </div>
                </div>

                {/* Yellow/Orange - Medium */}
                <div className="flex items-center space-x-4 bg-gray-700 p-4 rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500 shadow-lg flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-yellow-400 text-lg">Yellow/Orange</h3>
                    <p className="text-gray-300 text-sm">Medium Concentration</p>
                    <p className="text-gray-400 text-xs mt-1">Secondary importance areas</p>
                  </div>
                </div>

                {/* Blue - Low */}
                <div className="flex items-center space-x-4 bg-gray-700 p-4 rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-blue-500 shadow-lg flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-blue-400 text-lg">Blue</h3>
                    <p className="text-gray-300 text-sm">Low Concentration</p>
                    <p className="text-gray-400 text-xs mt-1">Less relevant regions</p>
                  </div>
                </div>
              </div>

              {/* Explanation Text */}
              <div className="mt-6 p-4 bg-gray-700 rounded-xl border border-cyan-600">
                <p className="text-gray-200 text-sm leading-relaxed">
                  <span className="font-semibold text-cyan-300">What does this mean?</span> The Grad-CAM heatmap highlights which regions of the image the AI model focused on when making its prediction.
                  <span className="text-red-400 font-semibold"> Red areas</span> indicate the highest concentration where the model paid the most attention,
                  <span className="text-yellow-400 font-semibold"> yellow/orange areas</span> show moderate attention, and
                  <span className="text-blue-400 font-semibold"> blue areas</span> represent regions with lower relevance to the classification decision.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/execute")}
        className="mt-12 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300"
      >
        Upload Another Image
      </motion.button>
    </div>
  );
}