import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

const FormPublic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`${API_URL}/api/forms/public/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = await res.json();
        if (!data.status) throw new Error(data.message || "Failed to fetch form");
        setFormData(data.data);
      } catch (err) {
        toast.error(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading form...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Form not found</p>
      </div>
    );
  }

  const { form, theme, slides } = formData;

  const themeStyles = {
    fontFamily: theme?.body_font_family || "Roboto, Arial, sans-serif",
    backgroundColor: theme?.background_color || "#f0ebf8", // light google forms bg
    color: theme?.body_color || "#202124",
  };

  const renderField = (field) => {
    switch (field.field_type) {
      case "short_text":
        return (
          <input
            type="text"
            placeholder="Your answer"
            required={field.is_required}
            className="w-full border-b border-gray-300 focus:border-purple-600 outline-none py-2 bg-transparent"
          />
        );
      case "paragraph":
        return (
          <textarea
            rows="3"
            placeholder="Your answer"
            required={field.is_required}
            className="w-full border-b border-gray-300 focus:border-purple-600 outline-none py-2 bg-transparent"
          />
        );
      default:
        return (
          <input
            type="text"
            placeholder="Your answer"
            className="w-full border-b border-gray-300 focus:border-purple-600 outline-none py-2 bg-transparent"
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-10 px-3" style={themeStyles}>
      <div className="w-full max-w-2xl">
        {/* Back to Forms */}
        <button
          onClick={() => navigate("/admin/dashboard/forms")}
          className="mb-6 text-sm text-purple-700 hover:underline"
        >
          ← Back to Forms
        </button>

        {/* Form Header */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6 border-t-8 border-purple-600">
          {form.header_image && (
            <div className="mb-4">
              <img
                src={`${API_URL}/uploads/${form.header_image}`}
                alt="Header"
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          )}
          <h1
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: theme?.header_font_family || "Google Sans, Roboto",
              fontSize: theme?.header_font_size || "24px",
              color: theme?.header_color || "#202124",
            }}
          >
            {form.title}
          </h1>
          <p className="text-gray-600">{form.description}</p>
        </div>

        {/* Current Slide */}
        {slides.length > 0 && (
          <div className="bg-white shadow-md rounded-xl p-6 mb-6">
            <h2
              className="text-lg font-medium mb-2"
              style={{
                fontFamily: theme?.question_font_family || "Roboto",
                fontSize: theme?.question_font_size || "18px",
              }}
            >
              {slides[currentSlide].title}
            </h2>
            {slides[currentSlide].description && (
              <p className="text-gray-600 mb-4">{slides[currentSlide].description}</p>
            )}
            <div className="space-y-6">
              {slides[currentSlide].fields.map((field) => (
                <div key={field.field_id}>
                  <label className="block font-medium mb-1 text-gray-800">
                    {field.label}
                    {field.is_required ? <span className="text-red-500"> *</span> : ""}
                  </label>
                  {field.field_image && (
                    <img
                      src={`${API_URL}/uploads/fields/${field.field_image}`}
                      alt="Field"
                      className="mb-2 w-32 rounded"
                    />
                  )}
                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {currentSlide > 0 ? (
            <button
              onClick={() => setCurrentSlide(currentSlide - 1)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {currentSlide < slides.length - 1 ? (
            <button
              onClick={() => setCurrentSlide(currentSlide + 1)}
              className="ml-auto px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
            >
              Next
            </button>
          ) : (
            <button className="ml-auto px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
              Submit
            </button>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default FormPublic;
