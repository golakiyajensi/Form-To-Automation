import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddCategory = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        detail_title: "",
        detail_description: "",
        statusFlag: 1,
    });
    const [files, setFiles] = useState({ icon: null, detail_image: null });
    const [previews, setPreviews] = useState({ icon: null, detail_image: null });
    const [errors, setErrors] = useState({});
    const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
    const token = localStorage?.getItem("admin_token");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, [fileType]: 'Please select a valid image file' }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, [fileType]: 'File size must be less than 5MB' }));
                return;
            }

            setFiles(prev => ({ ...prev, [fileType]: file }));

            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews(prev => ({ ...prev, [fileType]: e.target.result }));
            };
            reader.readAsDataURL(file);

            setErrors(prev => ({ ...prev, [fileType]: null }));
        }
    };

    const removeFile = (fileType) => {
        setFiles(prev => ({ ...prev, [fileType]: null }));
        setPreviews(prev => ({ ...prev, [fileType]: null }));
        const input = document.getElementById(`${fileType}-input`);
        if (input) input.value = '';
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Category name is required';
        if (!formData.detail_title.trim()) newErrors.detail_title = 'Detail title is required';
        if (!formData.detail_description.trim()) newErrors.detail_description = 'Detail description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('detail_title', formData.detail_title);
            formDataToSend.append('detail_description', formData.detail_description);
            formDataToSend.append('statusFlag', formData.statusFlag);
            if (files.icon) formDataToSend.append('iconImage', files.icon);
            if (files.detail_image) formDataToSend.append('detailImage', files.detail_image);

            const response = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || `HTTP error! status: ${response.status}`);
            if (data.status) {
                toast.success('Category created successfully!');
                setTimeout(() => navigate('/admin/dashboard/category'), 1500);
            } else {
                throw new Error(data.message || 'Failed to create category');
            }
        } catch (err) {
            console.error('Submit error:', err);
            toast.error(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 md:p-6">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        to="/admin/dashboard/category"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter category name"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>
                            </div>

                            {/* Detail Information */}
                            <div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Detail Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="detail_title"
                                            value={formData.detail_title}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.detail_title ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter detail title"
                                        />
                                        {errors.detail_title && (
                                            <p className="mt-1 text-sm text-red-600">{errors.detail_title}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Detail Description *
                                        </label>
                                        <textarea
                                            name="detail_description"
                                            value={formData.detail_description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.detail_description ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter detail description"
                                        />
                                        {errors.detail_description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.detail_description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Images */}
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Icon Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category Icon
                                        </label>
                                        <div className="space-y-4">
                                            {previews.icon ? (
                                                <div className="relative">
                                                    <img
                                                        src={previews.icon}
                                                        alt="Icon preview"
                                                        className="w-32 h-32 object-cover border border-gray-300 rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile('icon')}
                                                        className="absolute top-2 left-25 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <input
                                                    id="icon-input"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, 'icon')}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="icon-input"
                                                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    Upload Icon
                                                </label>
                                            </div>
                                            {errors.icon && (
                                                <p className="text-sm text-red-600">{errors.icon}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Detail Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Detail Image
                                        </label>
                                        <div className="space-y-4">
                                            {previews.detail_image ? (
                                                <div className="relative">
                                                    <img
                                                        src={previews.detail_image}
                                                        alt="Detail image preview"
                                                        className="w-48 h-32 object-cover border border-gray-300 rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile('detail_image')}
                                                        className="absolute top-2 left-40 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <input
                                                    id="detail-image-input"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, 'detail_image')}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="detail-image-input"
                                                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    Upload Detail Image
                                                </label>
                                            </div>
                                            {errors.detail_image && (
                                                <p className="text-sm text-red-600">{errors.detail_image}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="md:flex items-center  space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Category'
                                    )}
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

export default AddCategory;