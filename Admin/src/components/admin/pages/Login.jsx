import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, loginData);
      console.log("Login Response:", response);

      const { token, user } = response?.data?.data || {};

      if (!token || !user) {
        throw new Error("Login response is missing token or user details.");
      }

      // Save to localStorage
      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_username", user.name);
      localStorage.setItem("admin_email", user.email);
      localStorage.setItem("admin_id", user.user_id);
      localStorage.setItem("admin_role", user.role);

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: true,
        theme: "dark",
      });

      navigate("/admin/dashboard/");
    } catch (error) {
      console.error("Login Error:", error);
      const message =
        error.response?.data?.StatusMessage ||
        error.message ||
        "Login failed. Please try again.";
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        theme: "dark",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07362E] px-4">
      <ToastContainer />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-2 sm:p-8">
        <div className="w-full max-w-md bg-[#0A4B3D] p-5 sm:p-8 rounded-4xl shadow-lg">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-green-200">
              Sign in now to access your exercises and saved music.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300 w-5 h-5" />
              <input
                type="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 bg-green-800 border border-green-700 rounded-lg text-white placeholder-green-300 focus:outline-none focus:border-green-500"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full pl-12 pr-12 py-3 bg-green-800 border border-green-700 rounded-lg text-white placeholder-green-300 focus:outline-none focus:border-green-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="text-right">
              <a href="#" className="text-green-300 hover:text-white text-sm">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-green-900 font-semibold rounded-lg transition duration-200"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
