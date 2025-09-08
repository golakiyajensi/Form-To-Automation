import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [headerImage, setHeaderImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("admin_token");

  // -----------------------------
  // Fetch Form By ID
  // -----------------------------
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
      setTitle(data.data.title || "");
      setDescription(data.data.description || "");
      setHeaderImage(data.data.header_image || null);
    } catch (err) {
      toast.error(err.message || "Failed to fetch form");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForm();
  }, [id]);

  // -----------------------------
  // Handle File Input
  // -----------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setHeaderImage(URL.createObjectURL(file)); // Preview
    }
  };

  // -----------------------------
  // Save Updates
  // -----------------------------
  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning("Title cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (newImage) formData.append("header_image", newImage);

      const res = await fetch(`${API_URL}/api/forms/${id}`, {
        method: "PUT",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update form");

      toast.success("Form updated successfully");
      navigate("/admin/dashboard/forms");
    } catch (err) {
      toast.error(err.message || "Failed to update form");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Loading / Not Found States
  // -----------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Form not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Form</h2>

        {/* Title */}
        <label className="block mb-5">
          <span className="text-gray-700 text-sm font-medium">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          />
        </label>

        {/* Description */}
        <label className="block mb-5">
          <span className="text-gray-700 text-sm font-medium">Description</span>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          />
        </label>

        {/* Header Image */}
        <label className="block mb-6">
          <span className="text-gray-700 text-sm font-medium">Header Image</span>
          {headerImage && (
            <img
              src={newImage ? headerImage : `${API_URL}/uploads/${headerImage}`}
              alt="Header Preview"
              className="w-full h-48 rounded-lg border mb-3 shadow-sm object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
          />
        </label>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={() => navigate("/admin/dashboard/forms")}
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default EditForm;
