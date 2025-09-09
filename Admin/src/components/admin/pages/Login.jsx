import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [step, setStep] = useState("login"); // 'login' or 'otp'
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

  // Step 1: Handle Login (email + password)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, loginData);
      const { token, user, status } = response.data.data || {};

      if (status === "email_not_verified") {
        toast.info("OTP sent to your email. Please verify.", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        setStep("otp");
      } else if (token && user) {
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_username", user.name);
        localStorage.setItem("admin_email", user.email);
        localStorage.setItem("admin_id", user.user_id);
        localStorage.setItem("admin_role", user.role);

        toast.success("Login successful!", { position: "top-right", autoClose: 2000, theme: "dark" });
        navigate("/admin/dashboard/");
      } else {
        throw new Error("Login failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email: loginData.email,
        otp,
      });
      const { token, user } = response.data.data || {};

      if (token && user) {
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_username", user.name);
        localStorage.setItem("admin_email", user.email);
        localStorage.setItem("admin_id", user.user_id);
        localStorage.setItem("admin_role", user.role);

        toast.success("OTP verified! Logged in successfully.", { position: "top-right", autoClose: 2000, theme: "dark" });
        navigate("/admin/dashboard/");
      } else {
        throw new Error("OTP verification failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, {
        position: "top-right",
        autoClose: 3000,
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
            <h2 className="text-3xl font-bold text-white mb-2">{step === "login" ? "Sign In" : "Verify OTP"}</h2>
            <p className="text-green-200">
              {step === "login"
                ? "Sign in now to access your dashboard."
                : "Enter the OTP sent to your email."}
            </p>
          </div>

          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
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
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-green-800 border border-green-700 rounded-lg text-white placeholder-green-300 focus:outline-none focus:border-green-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-green-900 font-semibold rounded-lg transition duration-200"
              >
                Sign In
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-green-800 border border-green-700 rounded-lg text-white placeholder-green-300 focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-green-900 font-semibold rounded-lg transition duration-200"
              >
                Verify OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
