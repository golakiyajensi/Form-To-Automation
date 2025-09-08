import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ArrowLeft, Edit } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const EditSlide = () => {
  const { slideId, formId } = useParams();
  const navigate = useNavigate();

  const [slide, setSlide] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [headerImage, setHeaderImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("admin_token");
  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

  // ------------------ Fetch Slide ------------------
  const fetchSlide = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/slide/forms/${formId}/slides`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch slide");

      const singleSlide = data.data.find((s) => String(s.id) === String(slideId));
      if (!singleSlide) throw new Error("Slide not found");

      setSlide(singleSlide);
      setTitle(singleSlide.title || "");
      setDescription(singleSlide.description || "");
      setHeaderImage(singleSlide.header_image || null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slideId && formId) fetchSlide();
  }, [slideId, formId]);

  // ------------------ Handle File Upload ------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setHeaderImage(URL.createObjectURL(file)); // preview
    }
  };

  // ------------------ Save Slide ------------------
  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("order_no", slide.order_no);
      formData.append("title_formatted", JSON.stringify({ bold: true, color: "red" }));
      formData.append("description_formatted", JSON.stringify({ italic: true, color: "blue" }));
      if (newImage) formData.append("header_image", newImage);

      const res = await fetch(`${API_URL}/api/slide/slides/${slideId}`, {
        method: "PUT",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update slide");

      toast.success("Slide updated successfully");
      navigate(`/admin/dashboard/slides`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Loading State ------------------
  if (loading && !slide)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-3 text-gray-600">Loading slide details...</p>
      </div>
    );

  if (!slide) return null;

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
        {headerImage && (
          <div className="h-56 w-full overflow-hidden">
            <img
              src={newImage ? headerImage : `${API_URL}/uploads/${headerImage}`}
              alt="Slide Header"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          {/* Title */}
          <label className="block mb-4">
            <span className="text-gray-700 text-sm">Slide Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </label>

          {/* Description */}
          <label className="block mb-4">
            <span className="text-gray-700 text-sm">Slide Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </label>

          {/* Header Image Upload */}
          <label className="block mb-6">
            <span className="text-gray-700 text-sm">Header Image</span>
            <div className="flex flex-col gap-2 mt-1">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {headerImage && (
                <img
                  src={newImage ? headerImage : `${API_URL}/uploads/${headerImage}`}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              )}
            </div>
          </label>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Edit className="w-4 h-4" />
              {loading ? "Saving..." : "Save Slide"}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default EditSlide;
