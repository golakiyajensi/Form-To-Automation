import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
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
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading Slide...</p>
      </div>
    );

  if (!slide)
    return (
      <div className="p-6 text-center text-gray-500">
        No slide found
        <button
          onClick={() => navigate(-1)}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10 pb-20 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          ← Back
        </button>

        {/* Header Image */}
        {slide.header_image && (
          <img
            src={`${API_URL}/uploads/${slide.header_image}`}
            alt="Header"
            className="w-full h-56 object-cover rounded-xl mb-6 border border-gray-200"
          />
        )}

        {/* Slide Title & Description */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{slide.title}</h1>
        <p className="text-gray-600 mb-6">{slide.description}</p>

        {/* Fields */}
        {slide.fields && slide.fields.length > 0 ? (
          <div className="space-y-5">
            {slide.fields.map((field) => (
              <div
                key={field.field_id}
                className="p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <p className="text-gray-700 font-medium mb-2">{field.label}</p>

                {/* Field image (optional) */}
                {field.field_image && (
                  <img
                    src={`${API_URL}/uploads/${field.field_image}`}
                    alt="Field"
                    className="w-32 h-24 object-cover rounded mt-3 border border-gray-200"
                  />
                )}

                {/* Example: options for multiple choice / checkbox */}
                {field.options && Array.isArray(field.options) && (
                  <div className="mt-2 space-y-2">
                    {field.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type={field.type === "checkbox" ? "checkbox" : "radio"}
                          disabled
                          className="cursor-not-allowed"
                        />
                        <label className="text-gray-700">{opt}</label>
                      </div>
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
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default ViewSlides;
