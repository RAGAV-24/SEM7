import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ for navigation

export default function Execution() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // ✅ Common upload function
  const uploadToAPI = async (endpoint) => {
    if (!file) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to call ${endpoint} API`);
      }

      const result = await response.json();
      console.log(`${endpoint} API Response:`, result);

      // ✅ Pass both prediction and gradcam (if available)
    if(endpoint=="predict")
    {
      navigate("/result", {
        state: {
          image: URL.createObjectURL(file),
          result: result,
          gradcam: result.gradcam || null, // only exists if endpoint is gradcam
        },
      });
    }
    else{
        navigate("/gradresult", {
        state: {
          image: URL.createObjectURL(file),
          result: result,
          gradcam: result.gradcam || null, // only exists if endpoint is gradcam
        },
      });
    }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white flex flex-col items-center px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r pb-10 from-blue-400 to-cyan-300 bg-clip-text text-transparent"
      >
        Upload Kidney Scan for Classification
      </motion.h1>

      {/* Upload Box */}
      <motion.label
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="cursor-pointer border-2 border-dashed border-blue-500 rounded-2xl p-10 w-full max-w-lg flex flex-col items-center justify-center bg-gray-900/60 hover:border-cyan-400 transition"
      >
        <Upload className="w-16 h-16 text-blue-400 mb-4" />
        <p className="text-gray-300 text-lg mb-2">
          Drag & Drop or <span className="text-blue-400">Browse</span> to Upload
        </p>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </motion.label>

      {/* Preview */}
      {preview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 flex flex-col items-center"
        >
          <img
            src={preview}
            alt="Preview"
            className="w-64 h-64 object-cover rounded-2xl border border-gray-700 shadow-lg"
          />
          <p className="mt-4 text-gray-400">{file?.name}</p>
        </motion.div>
      )}

      {/* Upload Buttons */}
      <div className="flex gap-6 mt-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => uploadToAPI("predict")}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300"
        >
          Classify Image
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => uploadToAPI("gradcam")}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300"
        >
        Grad-CAM
        </motion.button>
      </div>
    </div>
  );
}
