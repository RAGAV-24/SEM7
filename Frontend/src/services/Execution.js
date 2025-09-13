// src/services/kidneyApi.js

const BASE_URL = "http://localhost:5000"; // backend URL

export const uploadFile = async (file, endpoint) => {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to call ${endpoint} API`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error uploading file to ${endpoint}:`, error);
    throw error;
  }
};
