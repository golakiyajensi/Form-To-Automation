import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaSave, FaTimes, FaImage, FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

export default function EditEmotions() {
    const [title, setTitle] = useState("");
    const [statusFlag, setStatusFlag] = useState(1);
    const [icon, setIcon] = useState(null); // File object for new upload
    const [currentIcon, setCurrentIcon] = useState(""); // Current icon URL/path
    const [iconPreview, setIconPreview] = useState(""); // Preview URL for new upload
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [item, setItem] = useState(null);
    const [existingTitles, setExistingTitles] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [removeCurrentIcon, setRemoveCurrentIcon] = useState(false);

    const fileInputRef = useRef(null);
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
                
                // Fetch all emotion items to get existing titles and the item to edit
                const res = await axiosInstance.get(`${API_URL}/api/emotion-masters/admin/all`)
                const items = Array.isArray(res.data.data) ? res.data.data : [];
                
                // Find the item to edit
                const itemToEdit = items.find(item => item.id === parseInt(id));
                
                if (!itemToEdit) {
                    toast.error("Emotion item not found");
                    navigate('/admin/dashboard/emotions');
                    return;
                }

                // Set the item data with proper statusFlag handling
                setItem(itemToEdit);
                setTitle(itemToEdit.title || "");
                setCurrentIcon(itemToEdit.icon || "");
                
                // Handle statusFlag properly
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
                console.error("Error fetching emotion data:", error);
                toast.error("Failed to load emotion item");
                navigate('/admin/dashboard/emotions');
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

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP)");
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error("File size should not exceed 5MB");
            return;
        }

        setIcon(file);
        setRemoveCurrentIcon(false);

        // Create preview URL
        const previewURL = URL.createObjectURL(file);
        setIconPreview(previewURL);

        // Clear any icon errors
        if (errors.icon) {
            setErrors(prev => ({ ...prev, icon: "" }));
        }
    };

    // Remove selected file
    const handleRemoveNewIcon = () => {
        setIcon(null);
        setIconPreview("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Toggle removal of current icon
    const handleToggleRemoveCurrentIcon = () => {
        setRemoveCurrentIcon(!removeCurrentIcon);
        if (!removeCurrentIcon) {
            // If we're marking for removal, also clear any new icon
            handleRemoveNewIcon();
        }
    };

    // Get icon display URL
    const getIconDisplayUrl = (iconPath) => {
        if (!iconPath) return "";
        
        // If it's already a full URL, return as is
        if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
            return iconPath;
        }
        
        // If it's a relative path, prepend the API URL
        return `${API_URL}${iconPath.startsWith('/') ? iconPath : '/' + iconPath}`;
    };

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
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('statusFlag', Number(statusFlag));
            
            // Handle icon
            if (icon) {
                // New icon selected
                formData.append('icon', icon);
            } else if (removeCurrentIcon) {
                // Mark current icon for removal
                formData.append('removeIcon', 'true');
            }

            const res = await axiosInstance.put(
                `${API_URL}/api/emotion-masters/${item.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (res.data.status === true) {
                toast.success(res.data.message || "Emotion item updated successfully");
                navigate('/admin/dashboard/emotions');
            } else {
                toast.error(res.data.message || "Failed to update item");
            }
        } catch (err) {
            const errorMessage = err?.response?.data?.message || "Failed to update item";
            toast.error(errorMessage);
            console.error('Update error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (!item) return;
        
        // Check for changes
        const hasChanges = 
            title.trim() !== (item.title || "").trim() || 
            Number(statusFlag) !== Number(item.statusFlag) ||
            icon !== null ||
            removeCurrentIcon;
            
        if (hasChanges && !window.confirm("Are you sure you want to cancel? Your changes will be lost.")) {
            return;
        }
        
        // Clean up preview URL
        if (iconPreview) {
            URL.revokeObjectURL(iconPreview);
        }
        
        navigate('/admin/dashboard/emotions');
    };

    const handleBack = () => {
        // Clean up preview URL
        if (iconPreview) {
            URL.revokeObjectURL(iconPreview);
        }
        navigate('/admin/dashboard/emotions');
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

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (iconPreview) {
                URL.revokeObjectURL(iconPreview);
            }
        };
    }, [iconPreview]);

    // Show loading state while fetching data
    if (pageLoading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2">Loading emotion item...</p>
                </div>
            </div>
        );
    }

    // Show error state if item not found
    if (!item) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center py-8">
                    <p className="text-red-500">Emotion item not found</p>
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
                <div className="p-5 rounded-t-lg border-b">
                    <div className="md:flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-green-700 rounded-full transition-colors"
                                title="Back to List"
                            >
                                <FaArrowLeft />
                            </button>
                            <h1 className="text-xl md:text-2xl md:font-bold">Edit Emotions</h1>
                        </div>
                        <div className="text-sm opacity-90">
                            ID: {item?.id}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Field */}
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
                                placeholder="Enter emotion title"
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

                        {/* Icon Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Icon
                            </label>
                            
                            {/* Current Icon Display */}
                            {currentIcon && !removeCurrentIcon && (
                                <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <p className="text-sm text-gray-600 mb-2">Current Icon:</p>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={getIconDisplayUrl(currentIcon)}
                                            alt="Current icon"
                                            className="w-16 h-16 object-cover rounded-lg border"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="hidden w-16 h-16 bg-gray-200 rounded-lg border items-center justify-center">
                                            <FaImage className="text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 mb-2">
                                                {currentIcon.split('/').pop()}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleToggleRemoveCurrentIcon}
                                                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                                            >
                                                <FaTrash className="text-xs" />
                                                Mark for removal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Icon marked for removal */}
                            {removeCurrentIcon && (
                                <div className="mb-4 p-4 border border-red-200 rounded-lg bg-red-50">
                                    <p className="text-sm text-red-600 mb-2">Current icon will be removed</p>
                                    <button
                                        type="button"
                                        onClick={handleToggleRemoveCurrentIcon}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Keep current icon
                                    </button>
                                </div>
                            )}

                            {/* New Icon Preview */}
                            {iconPreview && (
                                <div className="mb-4 p-4 border border-green-200 rounded-lg bg-green-50">
                                    <p className="text-sm text-green-600 mb-2">New Icon Preview:</p>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={iconPreview}
                                            alt="New icon preview"
                                            className="w-16 h-16 object-cover rounded-lg border"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 mb-2">
                                                {icon?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mb-2">
                                                Size: {(icon?.size / 1024).toFixed(1)} KB
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleRemoveNewIcon}
                                                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                                            >
                                                <FaTimes className="text-xs" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* File Input */}
                            <div className="mt-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    className="hidden"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FaImage />
                                    {icon || (currentIcon && !removeCurrentIcon) ? 'Change Icon' : 'Upload Icon'}
                                </button>
                                <p className="mt-1 text-sm text-gray-500">
                                    Supported formats: JPEG, PNG, GIF, WebP (Max: 5MB)
                                </p>
                            </div>
                            
                            {errors.icon && (
                                <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
                            )}
                        </div>

                        {/* Status Field */}
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
                        <div className="p-4 bg-gray-100 rounded-lg">
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
                                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                className="border border-gray-400 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
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