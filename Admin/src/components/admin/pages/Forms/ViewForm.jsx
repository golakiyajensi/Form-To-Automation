import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  ClipboardList,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

const ViewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("admin_token");

  // -----------------------------
  // Fetch Form by ID
  // -----------------------------
  useEffect(() => {
    if (!id) return;

    const fetchForm = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/forms/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch form");
        setForm(data.data);
      } catch (err) {
        setError(err.message || "Something went wrong");
        toast.error(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id, API_URL, token]);

  // -----------------------------
  // Loading State
  // -----------------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-3 text-gray-600 text-sm sm:text-base">
          Loading form details...
        </p>
      </div>
    );
  }

  // -----------------------------
  // Error State
  // -----------------------------
  if (error || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
        <p className="text-red-500 font-medium mb-4 text-sm sm:text-base">
          {error || "Form not found"}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Go Back
        </button>
      </div>
    );
  }

  // -----------------------------
  // Main Layout
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed sm:absolute top-4 sm:top-6 left-4 sm:left-6 z-50 flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-gray-700 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 border border-gray-200 transition text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline font-medium">Back</span>
      </button>

      <div className="mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 max-w-4xl">
        {/* Header Image */}
        {form.header_image && (
          <div className="h-40 sm:h-56 w-full overflow-hidden">
            <img
              src={`${API_URL}/uploads/${form.header_image}`}
              alt="Form Header"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {form.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm">
              <User className="w-4 h-4" />
              <span>{form.created_by || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm">
              <Calendar className="w-4 h-4" />
              <span>
                {form.created_at
                  ? new Date(form.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs sm:text-sm">
              <ClipboardList className="w-4 h-4" />
              <span>{form.response_count || 0} Responses</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 flex items-start gap-3 mb-6">
            <FileText className="w-5 h-5 text-gray-500 mt-1 shrink-0" />
            <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line leading-relaxed">
              {form.description || "No description provided."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() =>
                navigate(`/admin/dashboard/form-responses/${form.id}`)
              }
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 bg-gray-100 text-gray-700 rounded-lg border hover:bg-gray-200 transition text-sm sm:text-base"
            >
              <ClipboardList className="w-4 h-4" />
              View Responses
            </button>
            <button
              onClick={() =>
                navigate(`/admin/dashboard/forms/public/${form.id}`)
              }
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 bg-gray-100 text-gray-700 rounded-lg border hover:bg-gray-200 transition text-sm sm:text-base"
            >
              <ClipboardList className="w-4 h-4" />
              Public Forms
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default ViewForm;
