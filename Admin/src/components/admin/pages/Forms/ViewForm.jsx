import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  ClipboardList,
  Edit,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ViewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("admin_token");
  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

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
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id, API_URL, token]);

  // ---------- UI States ----------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-3 text-gray-600">Loading form details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 mb-4">Form not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ---------- Main Layout ----------
  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 border border-gray-200 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 max-w-4xl">
        {/* Header Image */}
        {form.header_image && (
          <div className="h-56 w-full overflow-hidden">
            <img
              src={`${API_URL}/uploads/${form.header_image}`}
              alt="Form Header"
              className="w-full h-full"
            />
          </div>
        )}

        <div className="p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {form.title}
          </h1>

          {/* Meta Info Chips */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
              <User className="w-4 h-4" />
              <span>{form.created_by || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
              <Calendar className="w-4 h-4" />
              <span>
                {form.created_at
                  ? new Date(form.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
              <ClipboardList className="w-4 h-4" />
              <span>{form.response_count || 0} Responses</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-3 mb-6">
            <FileText className="w-5 h-5 text-gray-500 mt-1" />
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {form.description || "No description provided."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/admin/dashboard/form-responses/${form.id}`)}
              className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 rounded-lg border hover:bg-gray-200 transition"
            >
              <ClipboardList className="w-4 h-4" />
              View Responses
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default ViewForm;
