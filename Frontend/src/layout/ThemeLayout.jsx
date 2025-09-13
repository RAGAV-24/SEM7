import React from 'react';
import Navbar from "../ui/NavBar";
import Footer from "../ui/Footer";
import HomePage from "../pages/HomePage";
import Login from "../auth/Login";
import SignUp from "../auth/SignUp";
import Model from "../pages/ModelPage";
import Execute from "../pages/Execution";
import Result from "../pages/Result";
import GradCam from "../pages/GradcamResult";
import Chatbot from '../pages/Chatbot';
import { Routes, Route } from "react-router-dom";

const ThemeLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Main content with padding for navbar & footer */}
      <main className="flex-1 pt-20 pb-30">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/model" element={<Model />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/execute" element={<Execute />} />
          <Route path="/result" element={<Result />} />
          <Route path="/gradresult" element={<GradCam />} />
        </Routes>
      </main>

      {/* Floating Chatbot */}
      <div className="fixed bottom-0 right-6 z-50">
        <Chatbot />
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 w-full z-40">
        <Footer />
      </div>
    </div>
  );
};

export default ThemeLayout;
