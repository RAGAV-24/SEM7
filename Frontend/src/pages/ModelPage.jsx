import React from "react";
import { motion } from "framer-motion";
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom";
export default function ModelPage() {
  const navigate=useNavigate();
  const move=()=>{
     navigate("/execute");
  }
  return (
    <div className=" min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white flex flex-col items-center px-6 py-12">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent pb-10"
      >
        Our Kidney Disease Classification Model
      </motion.h1>

      {/* Intro */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg md:text-xl text-gray-300 max-w-3xl text-center leading-relaxed mb-12"
      >
        We built a custom <span className="text-blue-400 font-semibold">Convolutional Neural Network (CNN)</span>
        to classify kidney images into four categories:{" "}
        <span className="text-blue-400">Cyst</span>,{" "}
        <span className="text-blue-400">Kidney Stone</span>,{" "}
        <span className="text-blue-400">Normal</span>, and{" "}
        <span className="text-blue-400">Tumor</span>.
        The model leverages data augmentation, early stopping, and checkpointing to ensure accuracy and robustness.
      </motion.p>

      {/* Model Architecture */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="bg-gray-900/80 border border-blue-700 rounded-2xl shadow-lg p-10 max-w-4xl mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Model Architecture
        </h2>
        <div className="flex flex-col space-y-4">
          {[
            "Input: 224 × 224 RGB medical images",
            "Conv2D Layers: 3 convolutional layers (32, 64, 128 filters) with ReLU activation",
            "Pooling: MaxPooling after each convolutional block",
            "Dense Layer: 128 units with ReLU + Dropout (0.5)",
            "Output: Softmax layer with 4 classes",
            "Optimizer: Adam",
            "Loss Function: Categorical Crossentropy",
            "Metric: Accuracy",
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="p-4 bg-gray-800 rounded-xl shadow-md border border-gray-700"
            >
              <p className="text-gray-300 text-lg">🔹 {item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Training Process */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="bg-gray-900/80 border border-cyan-700 rounded-2xl shadow-lg p-10 max-w-4xl mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-300">
          Training Process
        </h2>
        <ol className="space-y-4 text-lg text-gray-300">
          <li>📂 <b>Dataset:</b> Split into train, validation, and test sets</li>
          <li>🔄 <b>Augmentation:</b> Rotation, zoom, shift, shear, and flip to reduce overfitting</li>
          <li>⏳ <b>Epochs:</b> Trained up to 30 epochs with early stopping</li>
          <li>💾 <b>Checkpoint:</b> Best model saved during training</li>
          <li>✅ <b>Final Accuracy:</b> Evaluated on the test set</li>
        </ol>
      </motion.div>

      {/* Next Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={move}

        className="px-10 py-4 cursor-pointer 
        bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-lg font-semibold rounded-2xl shadow-lg transition-all "
      >
      Continue
      </motion.div>
    </div>
  );
}
