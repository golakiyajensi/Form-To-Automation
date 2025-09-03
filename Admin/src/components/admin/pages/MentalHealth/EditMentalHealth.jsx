import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaSave, FaTimes } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

export default function EditWellbeing() {
    const [title, setTitle] = useState("");
    const [statusFlag, setStatusFlag] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [item, setItem] = useState(null);
    const [existingTitles, setExistingTitles] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem("admin_token");
    const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
    const axiosInstance = axios.create({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Fetch the item to edit and existing titles
    useEffect(() => {
        const fetchData = async () => {
            try {
                setPageLoading(true);
                
                // Fetch all wellbeing items to get existing titles and the item to edit
                const res = await axiosInstance.get(`${API_URL}/api/mental-health`);
                const items = Array.isArray(res.data.data) ? res.data.data : [];
                
                // Find the item to edit
                const itemToEdit = items.find(item => item.id === parseInt(id));
                
                if (!itemToEdit) {
                    toast.error("Wellbeing item not found");
                    navigate('/admin/dashboard/mental-health');
                    return;
                }

                // Set the item data with proper statusFlag handling
                setItem(itemToEdit);
                setTitle(itemToEdit.title || "");
                // Handle statusFlag properly - check if it exists and is a number, otherwise default to 1
                setStatusFlag(
                    itemToEdit.statusFlag !== undefined && itemToEdit.statusFlag !== null 
                        ? Number(itemToEdit.statusFlag) 
                        : 1
                );

                // Set existing titles (excluding current item's title)
                setExistingTitles(
                    items
                        .filter(item => item.id !== parseInt(id))
                        .map(item => item.title?.toLowerCase() || "")
                        .filter(title => title) // Remove empty titles
                );

            } catch (error) {
                console.error("Error fetching mental-health data:", error);
                toast.error("Failed to load mental-health item");
                navigate('/admin/dashboard/mental-health');
            } finally {
                setPageLoading(false);
            }
        };

        if (id && token) {
            fetchData();
        } else if (!token) {
            toast.error("Authentication required");
            navigate('/admin/login');
        }
    }, [id, token, navigate]);

    const validateForm = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = "Title is required";
        } else if (title.trim().length < 3) {
            newErrors.title = "Title must be at least 3 characters long";
        } else if (title.trim().length > 100) {
            newErrors.title = "Title must not exceed 100 characters";
        } else if (existingTitles.includes(title.trim().toLowerCase())) {
            newErrors.title = "This title already exists";
        }

        // Validate statusFlag
        if (statusFlag !== 0 && statusFlag !== 1) {
            newErrors.statusFlag = "Status must be either Active or Inactive";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    setLoading(true);

    try {
    const updateData = {
        title: title.trim(),
        statusFlag: Number(statusFlag),
    };

    const res = await axiosInstance.put(
        `${API_URL}/api/mental-health/${item.id}`,
        updateData
    );
    console.log("Update response:", res.data);

    if (res.data.status === true) { // <-- Corrected check
        toast.success(res.data.message || "mental-health item updated successfully");
        navigate('/admin/dashboard/mental-health');
    } else {
        toast.error(res.data.message || "Failed to update item");
    }
} catch (err) {
    const errorMessage = err?.response?.data?.message ||
        "Failed to edit item";
    toast.error(errorMessage);
    console.error('Edit error:', err);
} finally {
    setLoading(false);
}
};


    const handleCancel = () => {
        if (!item) return;
        
        // Proper comparison for statusFlag changes
        const hasChanges = 
            title.trim() !== (item.title || "").trim() || 
            Number(statusFlag) !== Number(item.statusFlag);
            
        if (hasChanges && !window.confirm("Are you sure you want to cancel? Your changes will be lost.")) {
            return;
        }
        navigate('/admin/dashboard/mental-health');
    };

    const handleBack = () => {
        navigate('/admin/dashboard/mental-health');
    };

    const handleStatusChange = (e) => {
        const value = Number(e.target.value);
        setStatusFlag(value);
        
        // Clear any statusFlag errors
        if (errors.statusFlag) {
            setErrors(prev => ({ ...prev, statusFlag: "" }));
        }
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // Show loading state while fetching data
    if (pageLoading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2">Loading mental-health item...</p>
                </div>
            </div>
        );
    }

    // Show error state if item not found
    if (!item) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center py-8">
                    <p className="text-red-500">MentalHealth item not found</p>
                    <button 
                        onClick={handleBack}
                        className="mt-4 px-4 py-2 bg-[#05583d] text-white rounded hover:bg-green-700"
                    >
                        Back to List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="md:p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className=" p-5 rounded-t-lg  border-b">
                    <div className="md:flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-green-700 rounded-full transition-colors"
                                title="Back to List"
                            >
                                <FaArrowLeft />
                            </button>
                            <h1 className="text-xl md:text-2xl font-bold">Edit MentalHealth Item</h1>
                        </div>
                        <div className="text-sm opacity-90">
                            ID: {item?.id}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (errors.title) {
                                        setErrors(prev => ({ ...prev, title: "" }));
                                    }
                                }}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="Enter wellbeing title"
                                maxLength={100}
                                disabled={loading}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                {title.length}/100 characters
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={statusFlag}
                                onChange={handleStatusChange}
                                disabled={loading}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    errors.statusFlag ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>
                            {errors.statusFlag && (
                                <p className="mt-1 text-sm text-red-600">{errors.statusFlag}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                {Number(statusFlag) === 1
                                    ? 'This item is currently active and visible to users.'
                                    : 'This item is currently inactive and hidden from users.'}
                            </p>
                        </div>

                                        {/* Item Info */}
                <div className="p-4 bg-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-600">Created:</span>
                            <span className="ml-2 text-gray-800">{formatDateOnly(item?.created_at)}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Last Updated:</span>
                            <span className="ml-2 text-gray-800">{formatDateOnly(item?.updated_at)}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Current Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                                Number(item?.statusFlag) === 1 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {Number(item?.statusFlag) === 1 ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading || !title.trim()}
                                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full  hover:bg-green-700"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Update Item
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="border border-gray-400 text-gray-700 px-6 py-1 rounded-full hover:bg-gray-100"
                            >   
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}