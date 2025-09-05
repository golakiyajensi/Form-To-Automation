import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ViewSlides = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
  const token = localStorage.getItem("admin_token");

  const apiRequest = async (url, options = {}) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "API Error");
    return data;
  };

  useEffect(() => {
    const fetchSlide = async () => {
      try {
        const response = await apiRequest(
          `${API_URL}/api/slide/forms/${formId}/slides`
        );
        if (response?.data?.length > 0) {
          setSlide(response.data[0]);
        }
      } catch (err) {
        toast.error("Failed to load slide details");
      } finally {
        setLoading(false);
      }
    };
    fetchSlide();
  }, [formId]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-3 text-gray-600">Loading Slide...</p>
      </div>
    );

  if (!slide)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 mb-4">No slide found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 border transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Image */}
        {slide.header_image && (
          <div className="h-56 w-full overflow-hidden">
            <img
              src={`${API_URL}/uploads/${slide.header_image}`}
              alt="Header"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Slide Content */}
        <div className="p-8">
          {/* Title & Description */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {slide.title}
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {slide.description}
          </p>

          {/* Fields */}
          {slide.fields && slide.fields.length > 0 ? (
            <div className="space-y-6">
              {slide.fields.map((field) => (
                <div
                  key={field.field_id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm"
                >
                  <p className="text-lg font-medium text-gray-800 mb-3">
                    {field.label}
                  </p>

                  {/* Field Image */}
                  {field.field_image && (
                    <img
                      src={`${API_URL}/uploads/${field.field_image}`}
                      alt="Field"
                      className="w-40 h-28 object-cover rounded mb-3 border"
                    />
                  )}

                  {/* Options (disabled for preview) */}
                  {field.options && Array.isArray(field.options) && (
                    <div className="space-y-2">
                      {field.options.map((opt, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-2 cursor-not-allowed"
                        >
                          <input
                            type={field.type === "checkbox" ? "checkbox" : "radio"}
                            disabled
                            className="cursor-not-allowed accent-blue-600"
                          />
                          <span className="text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No fields available for this slide.</p>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default ViewSlides;
