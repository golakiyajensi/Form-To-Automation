import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

  // Fetch form by ID
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
      setTitle(data.data.title);
      setDescription(data.data.description);
      setHeaderImage(data.data.header_image); // ✅ store existing image
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForm();
  }, [id]);

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setHeaderImage(URL.createObjectURL(file)); // preview
    }
  };

  // Save updates
  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (newImage) {
        formData.append("header_image", newImage);
      }

      const res = await fetch(`${API_URL}/api/forms/${id}`, {
        method: "PUT",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData, // ✅ send FormData, not JSON
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update form");

      toast.success("Form updated successfully");
      navigate("/admin/dashboard/forms"); // redirect back to forms list
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!form) return <div className="p-6">Form not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Form</h2>

      {/* Title */}
      <label className="block mb-2">
        <span className="text-gray-700 text-sm">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
        />
      </label>

      {/* Description */}
      <label className="block mb-4">
        <span className="text-gray-700 text-sm">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
        />
      </label>

      {/* Header Image */}
      <label className="block mb-4">
        <span className="text-gray-700 text-sm">Header Image</span>
        {headerImage && (
          <img
            src={
              newImage
                ? headerImage // preview
                : `${API_URL}/uploads/${headerImage}`
            }
            alt="Header Preview"
            className="w-full h-48 object-cover rounded mb-2 border"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2 block w-full text-sm text-gray-500"
        />
      </label>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => navigate("/admin/dashboard/forms")}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditForm;
