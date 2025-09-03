import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddEmotions() {
    const [title, setTitle] = useState("");
    const [icon, setIcon] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [existingTitles, setExistingTitles] = useState([]);

    const navigate = useNavigate();
    const token = localStorage.getItem("admin_token");
    const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
    const EMOTIONS_LIST_ROUTE = "/admin/dashboard/emotions";

    const axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
    });

    useEffect(() => {
        const fetchExistingTitles = async () => {
            try {
                const res = await axiosInstance.get(`${API_URL}/api/emotion-masters/admin/all`);
                const list = Array.isArray(res.data.Result) ? res.data.Result : [];
                setExistingTitles(list.map(item => item.title.toLowerCase()));
            } catch (error) {
                toast.error("Error fetching titles");
                console.error("Fetch error:", error);
            }
        };
        fetchExistingTitles();
    }, []);

    const validate = () => {
        const trimmed = title.trim();
        const validationErrors = {};

        if (!trimmed) validationErrors.title = "Title is required";
        else if (trimmed.length < 3) validationErrors.title = "Minimum 3 characters";
        else if (trimmed.length > 100) validationErrors.title = "Maximum 100 characters";
        else if (existingTitles.includes(trimmed.toLowerCase())) validationErrors.title = "Title already exists";

        if (!icon) validationErrors.icon = "Icon is required";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("icon", icon);

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/emotion-masters`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.status) {
                toast.success("Emotion added successfully!");
                navigate(EMOTIONS_LIST_ROUTE);
            } else {
                toast.error(res.data.message || "Submission failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if ((title.trim() || icon) && !confirm("Are you sure you want to discard changes?")) return;
        navigate(EMOTIONS_LIST_ROUTE);
    };

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIcon(file);
            setPreview(URL.createObjectURL(file));
            if (errors.icon) setErrors({ ...errors, icon: "" });
        }
    };

    return (
        <div className="max-w-2xl mx-auto sm:p-6">
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={handleCancel}
                    className="text-green-700 hover:text-green-900 text-lg"
                    title="Back"
                >
                    <FaArrowLeft />
                </button>
                <h1 className="text-2xl font-semibold text-gray-800">Add Emotions</h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md space-y-6"
            >
                {/* Title Field */}
                <div>
                    <label className="block font-medium mb-1 text-gray-700">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) setErrors({ ...errors, title: "" });
                        }}
                        maxLength={100}
                        disabled={loading}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
                        }`}
                        placeholder="Enter emotion title"
                    />
                    {errors.title && (
                        <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                    )}
                </div>

                {/* Icon Upload */}
                <div>
                    <label className="block font-medium mb-1 text-gray-700">
                        Icon <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                        disabled={loading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-green-50 file:text-green-700
                            hover:file:bg-green-100"
                    />
                    {errors.icon && (
                        <p className="text-sm text-red-600 mt-1">{errors.icon}</p>
                    )}
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-3 h-20 w-20 object-cover rounded-md border"
                        />
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                        ) : (
                            <FaSave />
                        )}
                        {loading ? "Saving..." : "Add Item"}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-6 py-2 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
