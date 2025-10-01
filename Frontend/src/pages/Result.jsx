import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Volume2, VolumeX, Pause } from "lucide-react";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, result, gradcam } = location.state || {};

  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const speechSynthesisRef = useRef(null);

  // Map predicted class index to label
  const classLabels = ["Normal", "Cyst", "Stone", "Tumor"];
  const predictedLabel =
    result && typeof result.predicted_class === "number"
      ? classLabels[result.predicted_class] || "Unknown"
      : "N/A";

  // API call to send result to backend and get suggestions
  useEffect(() => {
    if (result) {
      const fetchSuggestions = async () => {
        setLoading(true);
        try {
          const response = await fetch("http://localhost:5000/results", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              predicted_class: result.predicted_class,
              predicted_label: predictedLabel,
              raw_prediction: result.prediction,
              gradcam: gradcam,
              timestamp: new Date(),
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch suggestions from backend");
          }

          const data = await response.json();

          let parsedSuggestions = {};

          if (data.suggestions?.message) {
            // Extract the JSON inside the ```json ... ``` block
            const match = data.suggestions.message.match(/```json([\s\S]*?)```/);
            if (match && match[1]) {
              try {
                parsedSuggestions = JSON.parse(match[1]);
              } catch (err) {
                console.error("Failed to parse suggestions JSON:", err);
                parsedSuggestions = { message: data.suggestions.message };
              }
            } else {
              parsedSuggestions = { message: data.suggestions.message };
            }
          }

          setSuggestions(parsedSuggestions);
          console.log("Parsed Suggestions:", parsedSuggestions);

        } catch (error) {
          console.error("Error fetching suggestions:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSuggestions();
    }
  }, [result, predictedLabel, gradcam]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Function to generate speech text from results
  const generateSpeechText = () => {
    let text = `Classification Result: The predicted class is ${predictedLabel}. `;

    if (suggestions) {
      if (suggestions.symptoms && suggestions.symptoms.length > 0) {
        text += `Symptoms include: ${suggestions.symptoms.join(", ")}. `;
      }

      if (suggestions.remedies && suggestions.remedies.length > 0) {
        text += `Recommended remedies and treatments are: `;
        suggestions.remedies.forEach((r, i) => {
          if (typeof r === "string") {
            text += `${r}. `;
          } else {
            text += `${r.type}: ${r.description}. `;
          }
        });
      }

      if (suggestions.avoid && suggestions.avoid.length > 0) {
        text += `Things to avoid: `;
        suggestions.avoid.forEach((a, i) => {
          if (typeof a === "string") {
            text += `${a}. `;
          } else {
            text += `${a.category}: ${a.description}. `;
          }
        });
      }

      text += `Please note: This information should not be considered as a substitute for medical advice. Patients should consult their healthcare provider for personalized guidance and treatment.`;
    }

    return text;
  };

  // Text-to-Speech functionality
  const handleTextToSpeech = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    // If already playing, stop it
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    // If paused, resume
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // Start new speech
    const text = generateSpeechText();
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

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
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
      >
        Classification Result
      </motion.h1>

      {/* Audio Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex gap-3 mb-8"
      >
        <button
          onClick={handleTextToSpeech}
          disabled={loading || !suggestions}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
            loading || !suggestions
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : isPlaying && !isPaused
              ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          }`}
        >
          {isPlaying && !isPaused ? (
            <>
              <Pause size={20} />
              Pause Audio
            </>
          ) : isPaused ? (
            <>
              <Volume2 size={20} />
              Resume Audio
            </>
          ) : (
            <>
              <Volume2 size={20} />
              Play Results Audio
            </>
          )}
        </button>

        {isPlaying && (
          <button
            onClick={stopSpeech}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-xl font-semibold shadow-lg transition-all duration-300"
          >
            <VolumeX size={20} />
            Stop
          </button>
        )}
      </motion.div>

      {/* Grid Layout: Image Left, Result Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-5xl w-full">
        {/* Left - Uploaded Image */}
        <motion.img
          src={image}
          alt="Uploaded"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-96 object-cover rounded-2xl border border-gray-700 shadow-lg"
        />

        {/* Right - Prediction Details */}
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

          <p className="mt-2 text-gray-400 text-sm break-all">
            <span className="font-semibold text-cyan-300">Raw Prediction:</span>{" "}
            {JSON.stringify(result.prediction)}
          </p>
        </motion.div>
      </div>

      {/* Suggestions Container */}
      <div className="mt-12 max-w-5xl w-full p-6 bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Suggestions</h2>
        {loading ? (
          <p className="text-gray-300">Loading suggestions...</p>
        ) : suggestions ? (
          <div className="text-gray-200 space-y-6">

            {/* Symptoms */}
            {suggestions.symptoms && suggestions.symptoms.length > 0 && (
              <div>
                <h3 className="font-semibold text-cyan-300 mb-2">Symptoms:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {suggestions.symptoms.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Remedies / Treatments */}
            {suggestions.remedies && suggestions.remedies.length > 0 && (
              <div>
                <h3 className="font-semibold text-cyan-300 mb-2">Remedies / Treatments:</h3>
                <ul className="list-disc list-inside space-y-2">
                  {suggestions.remedies.map((r, i) => (
                    <li key={i}>
                      {typeof r === "string" ? r : (
                        <>
                          <span className="font-semibold">{r.type}:</span> {r.description}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Things to Avoid */}
            {suggestions.avoid && suggestions.avoid.length > 0 && (
              <div>
                <h3 className="font-semibold text-cyan-300 mb-2">Things to Avoid:</h3>
                <ul className="list-disc list-inside space-y-2">
                  {suggestions.avoid.map((a, i) => (
                    <li key={i}>
                      {typeof a === "string" ? a : (
                        <>
                          <span className="font-semibold">{a.category}:</span> {a.description}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Note */}
            <div className="mt-4 text-sm text-gray-400">
              <p>
                <strong>Note:</strong> This information should not be considered as a substitute for medical advice. Patients should consult their healthcare provider for personalized guidance and treatment. Kidney tumor symptoms and remedies may vary depending on individual cases and medical history.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No suggestions available.</p>
        )}
      </div>

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