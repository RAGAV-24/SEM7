import React from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

export default function GradcamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, result, gradcam } = location.state || {};

  // ✅ Map predicted class index to label (for custom model)
  const classLabels = ["Normal", "Cyst", "Stone", "Tumor"];
  const predictedLabel =
    result && typeof result.predicted_class === "number"
      ? classLabels[result.predicted_class] || "Unknown"
      : "N/A";

  if (!image || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>No result found. Please upload an image first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center px-6 py-16">
      {/* Title */}
      {/* <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
      >
        Classification & Grad-CAM Result
      </motion.h1>

      {/* Grid Layout: Image Left, Result Right */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-5xl w-full">
       \
        <motion.img
          src={image}
          alt="Uploaded"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-96 object-cover rounded-2xl border border-gray-700 shadow-lg"
        />


        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 bg-gray-800 rounded-2xl shadow-lg text-left"
        >
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            Predicted Class
          </h2>
          <p className="text-xl font-semibold text-white">{predictedLabel}</p>

          <p className="mt-6 text-gray-300">
            <span className="font-semibold text-cyan-300">Class Index:</span>{" "}
            {result.predicted_class}
          </p>


        </motion.div>
      </div> */}

      {/* Grad-CAM Section */}
      {gradcam && (
        <div className="mt-16 w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold text-cyan-400 mb-8">
            Explainability (Grad-CAM)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-6xl w-full">
            {/* Left - Original */}
            <motion.img
              src={image}
              alt="Uploaded"
              className="w-full h-96 object-cover rounded-2xl border border-gray-700 shadow-lg"
            />

            {/* Right - Grad-CAM Heatmap */}
            <motion.img
              src={`data:image/png;base64,${gradcam}`} // ✅ convert base64 to image
              alt="GradCAM Heatmap"
              className="w-full h-96 object-cover rounded-2xl border border-gray-700 shadow-lg"
            />
          </div>
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
