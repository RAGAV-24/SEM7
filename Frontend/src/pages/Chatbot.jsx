import React from "react";
import { useState, useEffect } from "react";
import { TbMessageChatbot, TbLoader, TbPlayerStop } from "react-icons/tb";
import { FaUserCircle } from "react-icons/fa";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBotReply, setCurrentBotReply] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Typing effect logic
  useEffect(() => {
    if (!currentBotReply) return;

    const fullText = currentBotReply;
    const typingSpeed = 15; // faster speed
    let index = 0;
    let isStopped = false;

    const typeCharacter = () => {
      if (index < fullText.length && !isStopped) {
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.sender === "bot" && lastMsg.isTyping) {
            updated[updated.length - 1] = {
              ...lastMsg,
              text: fullText.slice(0, index + 1),
            };
          }
          return updated;
        });
        index++;
        const timeoutId = setTimeout(typeCharacter, typingSpeed);
        setTypingTimeout(timeoutId);
      } else {
        // Typing done
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.sender === "bot" && lastMsg.isTyping) {
            updated[updated.length - 1] = {
              ...lastMsg,
              text: fullText,
              isTyping: false,
            };
          }
          return updated;
        });
        setIsTyping(false);
        setCurrentBotReply("");
      }
    };

    setIsTyping(true);
    typeCharacter(); // Start typing

    return () => {
      isStopped = true;
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [currentBotReply]);

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage) return;

    const userMsg = { sender: "user", text: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:5000/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      const botReply = data.reply || "Sorry, I couldn't understand that.";

      // Add bot message with placeholder for typing
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "", isTyping: true },
      ]);

      setCurrentBotReply(botReply);
    } catch (error) {
      console.error("Error fetching bot reply:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Connection error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopTyping = () => {
    // Just stop the typing — don't clear the current text
    setIsTyping(false);
    setCurrentBotReply(""); // Stop the effect loop

    // Update the last message to keep what was typed so far
    setMessages((prev) => {
      const updated = [...prev];
      const lastMsg = updated[updated.length - 1];
      if (lastMsg.sender === "bot" && lastMsg.isTyping) {
        updated[updated.length - 1] = {
          ...lastMsg,
          isTyping: false,
          // Keep whatever has been typed so far
        };
      }
      return updated;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[32rem] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 transition-all duration-300 ease-in-out">

          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl font-medium flex items-center space-x-2">
            <TbMessageChatbot size={20} />
            <span>Bot Assistant</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  msg.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div className={`mt-1 ${msg.sender === "user" ? "text-blue-600" : "text-gray-600"}`}>
                  {msg.sender === "user" ? (
                    <FaUserCircle size={28} />
                  ) : (
                    <TbMessageChatbot size={28} />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-lg shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-ss-lg rounded-se-none"
                      : "bg-white text-gray-800 rounded-ee-lg rounded-es-none shadow"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2">
                <TbMessageChatbot className="mt-1 text-gray-600" size={28} />
                <div className="bg-white px-4 py-3 rounded-lg shadow animate-pulse">
                  <TbLoader className="animate-spin text-gray-500" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 flex gap-2 bg-white items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            {isTyping ? (
              <button
                onClick={handleStopTyping}
                className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-colors"
                title="Stop Typing"
              >
                <TbPlayerStop size={18} />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md hover:from-blue-600 hover:to-indigo-700 active:scale-95 disabled:opacity-50 transition-all duration-200"
              >
                Send
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 active:scale-95 transition-all duration-200 flex items-center justify-center"
      >
        <TbMessageChatbot size={28} />
      </button>
    </div>
  );
}

export default Chatbot;