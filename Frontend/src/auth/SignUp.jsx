import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [animationData, setAnimationData] = useState(null);
  const [name, setName] = useState(""); // optional if you want to store
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetch("/Auth/SignUp.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("✅ Signup successful!");
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong, please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white px-6 py-12">
      {/* Left: Lottie Animation */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center">
        {animationData && (
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-3/4 max-w-md"
          />
        )}
      </div>

      {/* Right: SignUp Form */}
      <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Sign Up
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        {/* Links */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
