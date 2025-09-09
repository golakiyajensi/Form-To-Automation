import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("admin_token");

  let decoded = null;
  let isExpired = false;
  let remaining = 0;

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  try {
    decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp < now) {
      isExpired = true;
    } else {
      remaining = (decoded.exp - now) * 1000;
    }
  } catch (err) {
    console.error("Token invalid:", err);
    localStorage.clear();
    return <Navigate to="/admin" replace />;
  }

  useEffect(() => {
    if (remaining > 0) {
      const timer = setTimeout(() => {
        localStorage.clear();
        window.location.href = "/admin";
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [remaining]);

  if (isExpired) {
    localStorage.clear();
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
