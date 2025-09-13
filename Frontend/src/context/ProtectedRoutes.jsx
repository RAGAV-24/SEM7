import React from "react";
import { Navigate } from "react-router-dom";

// Checks for JWT token in localStorage
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Optionally: you can check token expiry here
  // const expiry = localStorage.getItem("tokenExpiry");
  // if (expiry && new Date() > new Date(expiry)) {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("tokenExpiry");
  //   return <Navigate to="/login" replace />;
  // }

  return children;
};

export default ProtectedRoute;
