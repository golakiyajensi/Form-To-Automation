import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddMeditationInterest() {
    const [title, setTitle] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [existingTitles, setExistingTitles] = useState([]);

    const navigate = useNavigate();
    const token = localStorage.getItem("admin_token");
    const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
    const LIST_ROUTE = "/admin/dashboard/meditation-interests";

    const axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
    });

    useEffect(() => {
        const fetchExistingTitles = async () => {
            try {
                const res = await axiosInstance.get(`${API_URL}/api/meditation-interest`);
                const items = Array.isArray(res.data.Result) ? res.data.Result : [];
                setExistingTitles(items.map(item => item.title.toLowerCase()));
            } catch (err) {
                console.error("Failed to fetch titles", err);
                toast.error("Unable to fetch existing titles.");
            }
        };

        fetchExistingTitles();
    }, []);

    const validate = () => {
        const trimmed = title.trim();
        const validationErrors = {};

        if (!trimmed) validationErrors.title = "Title is required";
        else if (trimmed.length < 3) validationErrors.title = "Minimum 3 characters";
        else if (trimmed.length > 100) validationErrors.title = "Max 100 characters";
        else if (existingTitles.includes(trimmed.toLowerCase())) validationErrors.title = "Title already exists";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please correct the highlighted fields.");
            return;
        }

        setLoading(true);
        try {
            const res = await axiosInstance.post(`${API_URL}/api/meditation-interest`, {
                title: title.trim(),
                statusFlag: 1,
            });

            if (res.data.status) {
                toast.success("Item added successfully!");
                navigate(LIST_ROUTE);
            } else {
                toast.error(res.data.message || "Failed to add item");
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "Server error";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (title.trim() && !confirm("Discard changes?")) return;
        navigate(LIST_ROUTE);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="flex items-center mb-6 gap-3">
                <button
                    onClick={() => navigate(LIST_ROUTE)}
                    className="text-green-700 hover:text-green-900"
                    title="Go back"
                >
                    <FaArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-semibold text-gray-800">
                    Add Meditation Interest
                </h2>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-3 md:p-6 rounded-lg shadow space-y-6"
            >
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) setErrors(prev => ({ ...prev, title: "" }));
                        }}
                        maxLength={100}
                        disabled={loading}
                        placeholder="Enter title"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
                        }`}
                    />
                    {errors.title && (
                        <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
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
                        {loading ? "Adding..." : "Add Item"}
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
