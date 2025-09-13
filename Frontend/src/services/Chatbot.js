// src/api.js

const BASE_URL = "http://127.0.0.1:5000"; // your backend URL

export const sendMessageToBot = async (message) => {
  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply || "Sorry, I couldn't understand that.";
  } catch (error) {
    console.error("Error sending message to bot:", error);
    return "Connection error. Please try again.";
  }
};
