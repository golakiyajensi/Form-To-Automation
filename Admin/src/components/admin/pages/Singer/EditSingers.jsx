import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaSave, FaTimes, FaImage, FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

export default function EditSingers() {
    const [name, setname] = useState("");
    const [statusFlag, setStatusFlag] = useState(1);
    const [image, setimage] = useState(null); // File object for new upload
    const [currentimage, setCurrentimage] = useState(""); // Current image URL/path
    const [imagePreview, setimagePreview] = useState(""); // Preview URL for new upload
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [item, setItem] = useState(null);
    const [existingnames, setExistingnames] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [removeCurrentimage, setRemoveCurrentimage] = useState(false);

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

    // Fetch the item to edit and existing names
    useEffect(() => {
        const fetchData = async () => {
            try {
                setPageLoading(true);
                
                // Fetch all singer items to get existing names and the item to edit
                const res = await axiosInstance.get(`${API_URL}/api/singer-masters/admin/all`)
                const items = Array.isArray(res.data.data) ? res.data.data : [];
                
                // Find the item to edit
                const itemToEdit = items.find(item => item.id === parseInt(id));
                
                if (!itemToEdit) {
                    toast.error("Singer not found");
                    navigate('/admin/dashboard/singers');
                    return;
                }

                // Set the item data with proper statusFlag handling
                setItem(itemToEdit);
                setname(itemToEdit.name || "");
                setCurrentimage(itemToEdit.image || "");
                
                // Handle statusFlag properly
                setStatusFlag(
                    itemToEdit.statusFlag !== undefined && itemToEdit.statusFlag !== null 
                        ? Number(itemToEdit.statusFlag) 
                        : 1
                );

                // Set existing names (excluding current item's name)
                setExistingnames(
                    items
                        .filter(item => item.id !== parseInt(id))
                        .map(item => item.name?.toLowerCase() || "")
                        .filter(name => name) // Remove empty names
                );

            } catch (error) {
                console.error("Error fetching singer data:", error);
                toast.error("Failed to load singer");
                navigate('/admin/dashboard/singers');
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

        setimage(file);
        setRemoveCurrentimage(false);

        // Create preview URL
        const previewURL = URL.createObjectURL(file);
        setimagePreview(previewURL);

        // Clear any image errors
        if (errors.image) {
            setErrors(prev => ({ ...prev, image: "" }));
        }
    };

    // Remove selected file
    const handleRemoveNewimage = () => {
        setimage(null);
        setimagePreview("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Toggle removal of current image
    const handleToggleRemoveCurrentimage = () => {
        setRemoveCurrentimage(!removeCurrentimage);
        if (!removeCurrentimage) {
            // If we're marking for removal, also clear any new image
            handleRemoveNewimage();
        }
    };

    // Get image display URL
    const getimageDisplayUrl = (imagePath) => {
        if (!imagePath) return "";
        
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        
        // If it's a relative path, prepend the API URL
        return `${API_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "name is required";
        } else if (name.trim().length < 3) {
            newErrors.name = "name must be at least 3 characters long";
        } else if (name.trim().length > 100) {
            newErrors.name = "name must not exceed 100 characters";
        } else if (existingnames.includes(name.trim().toLowerCase())) {
            newErrors.name = "This name already exists";
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
            formData.append('name', name.trim());
            formData.append('statusFlag', Number(statusFlag));
            
            // Handle image
            if (image) {
                // New image selected
                formData.append('image', image);
            } else if (removeCurrentimage) {
                // Mark current image for removal
                formData.append('removeImage', 'true');
            }

            // FIXED: Use correct endpoint for singers
            const res = await axiosInstance.put(
                `${API_URL}/api/singer-masters/${item.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (res.data.status === true) {
                toast.success(res.data.message || "Singer updated successfully");
                navigate('/admin/dashboard/singers');
            } else {
                toast.error(res.data.message || "Failed to update singer");
            }
        } catch (err) {
            const errorMessage = err?.response?.data?.message || "Failed to update singer";
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
            name.trim() !== (item.name || "").trim() || 
            Number(statusFlag) !== Number(item.statusFlag) ||
            image !== null ||
            removeCurrentimage;
            
        if (hasChanges && !window.confirm("Are you sure you want to cancel? Your changes will be lost.")) {
            return;
        }
        
        // Clean up preview URL
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        
        navigate('/admin/dashboard/singers');
    };

    const handleBack = () => {
        // Clean up preview URL
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        navigate('/admin/dashboard/singers');
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
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Show loading state while fetching data
    if (pageLoading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2">Loading singer...</p>
                </div>
            </div>
        );
    }

    // Show error state if item not found
    if (!item) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center py-8">
                    <p className="text-red-500">Singer not found</p>
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
                                name="Back to List"
                            >
                                <FaArrowLeft />
                            </button>
                            <h1 className="text-xl md:text-2xl md:font-bold">Edit Singer</h1>
                        </div>
                        <div className="text-sm opacity-90">
                            ID: {item?.id}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* name Field */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setname(e.target.value);
                                    if (errors.name) {
                                        setErrors(prev => ({ ...prev, name: "" }));
                                    }
                                }}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="Enter singer name"
                                maxLength={100}
                                disabled={loading}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                {name.length}/100 characters
                            </p>
                        </div>

                        {/* image Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                               Image
                            </label>
                            
                            {/* Current image Display */}
                            {currentimage && !removeCurrentimage && (
                                <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={getimageDisplayUrl(currentimage)}
                                            alt="Current image"
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
                                                {currentimage.split('/').pop()}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleToggleRemoveCurrentimage}
                                                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                                            >
                                                <FaTrash className="text-xs" />
                                                Mark for removal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* image marked for removal */}
                            {removeCurrentimage && (
                                <div className="mb-4 p-4 border border-red-200 rounded-lg bg-red-50">
                                    <p className="text-sm text-red-600 mb-2">Current image will be removed</p>
                                    <button
                                        type="button"
                                        onClick={handleToggleRemoveCurrentimage}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Keep current image
                                    </button>
                                </div>
                            )}

                            {/* New image Preview */}
                            {imagePreview && (
                                <div className="mb-4 p-4 border border-green-200 rounded-lg bg-green-50">
                                    <p className="text-sm text-green-600 mb-2">New image Preview:</p>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={imagePreview}
                                            alt="New image preview"
                                            className="w-16 h-16 object-cover rounded-lg border"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 mb-2">
                                                {image?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mb-2">
                                                Size: {(image?.size / 1024).toFixed(1)} KB
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleRemoveNewimage}
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
                                    {image || (currentimage && !removeCurrentimage) ? 'Change image' : 'Upload image'}
                                </button>
                                <p className="mt-1 text-sm text-gray-500">
                                    Supported formats: JPEG, PNG, GIF, WebP (Max: 5MB)
                                </p>
                            </div>
                            
                            {errors.image && (
                                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
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
                                    ? 'This singer is currently active and visible to users.'
                                    : 'This singer is currently inactive and hidden from users.'}
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
                                disabled={loading || !name.trim()}
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
                                        Update Singer
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