// src/services/gradcamUtils.js

export const classLabels = ["Normal", "Cyst", "Stone", "Tumor"];

/**
 * Get label from predicted class index
 * @param {Object} result - result object from API
 * @returns {string} label
 */
export const getPredictedLabel = (result) => {
  if (!result || typeof result.predicted_class !== "number") return "N/A";
  return classLabels[result.predicted_class] || "Unknown";
};
