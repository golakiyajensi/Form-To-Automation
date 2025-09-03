import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const EditCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        detail_title: "",
        detail_description: "",
        statusFlag: 1,
    });
    const [files, setFiles] = useState({
        iconImage: null,
        detailImage: null,
    });
    const [previews, setPreviews] = useState({
        iconImage: null,
        detailImage: null,
    });
    const [existingImages, setExistingImages] = useState({
        icon: null,
        detail_image: null,
    });
    const [errors, setErrors] = useState({});
    const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
    const token = localStorage?.getItem("admin_token");

    const getImageUrl = useCallback((imagePath) => {
        if (!imagePath) return null;

        // If already a full URL, return as is
        if (imagePath.startsWith("http")) {
            return imagePath;
        }

        // Remove leading slash if present
        const cleanPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;

        // Prepend API base URL (make sure API_URL ends without a trailing slash)
        return `${API_URL}/${cleanPath}`;
    }, [API_URL]);


    // Fetch existing category data
    const fetchCategory = useCallback(async () => {
        setInitialLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/categories/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            if (data.status && data.data) {
                const category = data.data;
                setFormData({
                    name: category.name || "",
                    detail_title: category.detail_title || "",
                    detail_description: category.detail_description || "",
                    statusFlag: category.statusFlag || 1,
                });

                // Set existing images directly from API response
                setExistingImages({
                    icon: category.icon,
                    detail_image: category.detail_image,
                });

                console.log("Icon path:", category.icon);
                console.log("Detail image path:", category.detail_image);
            } else {
                throw new Error(data.message || "Category not found");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error(`Error: ${err.message}`);
            navigate("/admin/dashboard/category");
        } finally {
            setInitialLoading(false);
        }
    }, [API_URL, id, navigate, token]);

    useEffect(() => {
        if (id) {
            fetchCategory();
        }
    }, [id, fetchCategory]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                setErrors((prev) => ({
                    ...prev,
                    [fileType]: "Please select a valid image file",
                }));
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    [fileType]: "File size must be less than 5MB",
                }));
                return;
            }

            setFiles((prev) => ({
                ...prev,
                [fileType]: file,
            }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews((prev) => ({
                    ...prev,
                    [fileType]: e.target.result,
                }));
            };
            reader.readAsDataURL(file);

            // Clear error
            setErrors((prev) => ({
                ...prev,
                [fileType]: null,
            }));
        }
    };

    const removeFile = (fileType) => {
        setFiles((prev) => ({
            ...prev,
            [fileType]: null,
        }));
        setPreviews((prev) => ({
            ...prev,
            [fileType]: null,
        }));

        // Reset the file input
        const inputId = fileType === "iconImage" ? "icon-input" : "detail-image-input";
        const input = document.getElementById(inputId);
        if (input) input.value = "";
    };

    const removeExistingImage = (imageType) => {
        setExistingImages((prev) => ({
            ...prev,
            [imageType]: null,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Category name is required";
        }

        if (!formData.detail_title.trim()) {
            newErrors.detail_title = "Detail title is required";
        }

        if (!formData.detail_description.trim()) {
            newErrors.detail_description = "Detail description is required";
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
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("detail_title", formData.detail_title);
            formDataToSend.append("detail_description", formData.detail_description);
            formDataToSend.append("statusFlag", formData.statusFlag);

            // Only send image files if new ones are selected
            if (files.iconImage) {
                formDataToSend.append("iconImage", files.iconImage);
            }

            if (files.detailImage) {
                formDataToSend.append("detailImage", files.detailImage);
            }

            //Log FormData contents for debugging
            for (let pair of formDataToSend.entries()) {
                console.log(pair[0] + ": " + pair[1]);
            }

            const response = await fetch(`${API_URL}/api/categories/${id}`, {
                method: "PUT",
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            if (data.status) {
                toast.success('Category updated successfully!');
                setTimeout(() => navigate('/admin/dashboard/category'), 1500);
            } else {
                throw new Error(data.message || "Failed to update category");
            }
        } catch (err) {
            console.error("Submit error:", err);
            toast.error(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Enhanced image component with better error handling
    const ImageDisplay = ({ src, alt, className, onError }) => {
        const [imageError, setImageError] = useState(false);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            setImageError(false);
            setIsLoading(true);
        }, [src]);

        const handleImageError = (e) => {
            console.error("Image failed to load:", src);
            console.error("Error details:", e);
            setImageError(true);
            setIsLoading(false);
            if (onError) onError();
        };

        const handleImageLoad = () => {
            console.log("Image loaded successfully:", src);
            setIsLoading(false);
            setImageError(false);
        };

        if (!src) {
            return (
                <div className={`${className} bg-gray-100 flex items-center justify-center`}>
                    <div className="text-center text-gray-500">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xs">No image</p>
                    </div>
                </div>
            );
        }

        if (imageError) {
            return (
                <div className={`${className} bg-gray-100 flex items-center justify-center`}>
                    <div className="text-center text-gray-500">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xs">Image not found</p>
                        <p className="text-xs text-red-500 mt-1">Path: {src}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="relative">
                {isLoading && (
                    <div className={`${className} bg-gray-100 flex items-center justify-center absolute inset-0 z-10`}>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                )}
                <img
                    src={src}
                    alt={alt}
                    className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    crossOrigin="anonymous"
                />
            </div>
        );
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2">Loading category...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link
                            to="/admin/dashboard/category"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Categories
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"
                                                }`}
                                            placeholder="Enter category name"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            name="statusFlag"
                                            value={formData.statusFlag}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Detail Title *</label>
                                        <input
                                            type="text"
                                            name="detail_title"
                                            value={formData.detail_title}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.detail_title ? "border-red-500" : "border-gray-300"
                                                }`}
                                            placeholder="Enter detail title"
                                        />
                                        {errors.detail_title && <p className="mt-1 text-sm text-red-600">{errors.detail_title}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Detail Description *</label>
                                        <textarea
                                            name="detail_description"
                                            value={formData.detail_description}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.detail_description ? "border-red-500" : "border-gray-300"
                                                }`}
                                            placeholder="Enter detail description"
                                            rows="4"
                                        />
                                        {errors.detail_description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.detail_description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Image Uploads */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Image Uploads</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon Image</label>

                                        <div className="mb-3">
                                            {/* Existing Image Display */}
                                            {existingImages.icon && (
                                                <div className="relative">
                                                    <ImageDisplay
                                                        src={getImageUrl(existingImages.icon)}
                                                        alt="Existing Icon"
                                                        className="w-32 h-32 rounded-lg object-cover border border-gray-300"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage("icon")}
                                                        className="absolute top-2 left-25 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            )}
                                            {/* New Image Preview */}
                                            {previews.iconImage && (
                                                <div className="relative">
                                                    <img
                                                        src={previews.iconImage}
                                                        alt="New Icon Preview"
                                                        className="w-32 h-32 rounded-lg object-cover border border-gray-300"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile("iconImage")}
                                                        className="absolute top-2 left-25 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {!previews.iconImage && !existingImages.icon && (
                                            <>
                                                <label
                                                    htmlFor="icon-input"
                                                    className="relative cursor-pointer bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-4 block text-center"
                                                >
                                                    <input
                                                        type="file"
                                                        id="icon-input"
                                                        className="sr-only"
                                                        onChange={(e) => handleFileChange(e, "iconImage")}
                                                        accept="image/*"
                                                    />
                                                    <div className="flex items-center justify-center text-gray-600">
                                                        <Upload className="w-5 h-5 mr-2" />
                                                        <span>Upload Icon</span>
                                                    </div>
                                                </label>
                                                {errors.iconImage && <p className="mt-1 text-sm text-red-600">{errors.iconImage}</p>}
                                            </>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Detail Image</label>

                                        <div className="mb-3">
                                            {/* Existing Image Display */}
                                            {existingImages.detail_image && (
                                                <div className="relative">
                                                    <ImageDisplay
                                                        src={getImageUrl(existingImages.detail_image)}
                                                        alt="Existing Detail Image"
                                                        className="w-32 h-32 rounded-lg object-cover border border-gray-300"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage("detail_image")}
                                                        className="absolute top-2 left-25 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            )}
                                            {/* New Image Preview */}
                                            {previews.detailImage && (
                                                <div className="relative">
                                                    <img
                                                        src={previews.detailImage}
                                                        alt="New Detail Image Preview"
                                                        className="w-32 h-32 rounded-lg object-cover border border-gray-300"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile("detailImage")}
                                                        className="absolute top-2 left-25 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {!previews.detailImage && !existingImages.detail_image && (
                                            <>
                                                <label
                                                    htmlFor="detail-image-input"
                                                    className="relative cursor-pointer bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-4 block text-center"
                                                >
                                                    <input
                                                        type="file"
                                                        id="detail-image-input"
                                                        className="sr-only"
                                                        onChange={(e) => handleFileChange(e, "detailImage")}
                                                        accept="image/*"
                                                    />
                                                    <div className="flex items-center justify-center text-gray-600">
                                                        <Upload className="w-5 h-5 mr-2" />
                                                        <span>Upload Detail Image</span>
                                                    </div>
                                                </label>
                                                {errors.detailImage && <p className="mt-1 text-sm text-red-600">{errors.detailImage}</p>}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="md:flex items-center  space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Updating..." : "Update Category"}
                                </button>
                                <div className="my-5 md:my-0">
                                    <Link
                                        to="/admin/dashboard/category"
                                        className="px-6 py-2 text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCategory;

