import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
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

  if (loading)
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading Form...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        {error}
        <button
          onClick={() => navigate(-1)}
          className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );

  if (!form)
    return (
      <div className="p-6 text-center text-gray-500">
        Form not found
        <button
          onClick={() => navigate(-1)}
          className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-4 text-gray-800">{form.title}</h1>

        {form.header_image && (
          <img
            src={`${API_URL}/uploads/${form.header_image}`}
            alt="Header"
            className="w-full h-52 object-cover rounded-lg mb-4 border border-gray-200"
          />
        )}

        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Description:</strong> {form.description}
          </p>
          <p>
            <strong>Created By:</strong> {form.created_by || "N/A"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {form.created_at
              ? new Date(form.created_at).toLocaleString()
              : "N/A"}
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default ViewForm;
