import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewResponse = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
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
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "API Error");
    return data;
  };

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const res = await apiRequest(
          `${API_URL}/api/form-responses/response/${responseId}`
        );
        setResponse(res.data);
      } catch (err) {
        toast.error("Failed to load response details");
      } finally {
        setLoading(false);
      }
    };
    fetchResponse();
  }, [responseId]);

  if (loading)
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading Response...</p>
      </div>
    );

  if (!response)
    return (
      <div className="p-6 text-center text-gray-500">
        No response found
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
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          ← Back
        </button>

        {/* Response Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-800">
            Response #{response.response_id}
          </h1>
          <p className="text-gray-600">
            <strong>Form ID:</strong> {response.form_id}
          </p>
          <p className="text-gray-600">
            <strong>Submitted By:</strong> {response.submitted_by || "Anonymous"}
          </p>
          <p className="text-gray-600">
            <strong>Date:</strong> {new Date(response.created_at).toLocaleString()}
          </p>
          {response.link && (
            <a
              href={response.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm hover:underline"
            >
              Open Public Link
            </a>
          )}
        </div>

        {/* Answers Section */}
        <div className="mt-6 space-y-4">
          {response.answers.map((a, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg bg-gray-50 shadow-sm"
            >
              <p className="text-gray-700 font-medium mb-2">{a.label || `Field ${a.field_id}`}</p>
              {Array.isArray(a.value) ? (
                a.value.map((val, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 border rounded-lg bg-white text-gray-700 mb-2"
                  >
                    {val}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 border rounded-lg bg-white text-gray-700">
                  {a.value || "-"}
                </div>
              )}
              {a.field_image && (
                <img
                  src={`${API_URL}/uploads/${a.field_image}`}
                  alt="Field"
                  className="w-32 h-24 object-cover rounded mt-2 border border-gray-200"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default ViewResponse;
