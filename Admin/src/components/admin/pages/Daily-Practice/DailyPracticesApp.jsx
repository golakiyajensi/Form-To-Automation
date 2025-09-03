
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Eye, ArrowLeft, Play, Pause, X, Search, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

// API Base URL - Replace with your actual backend URL
const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

// Helper function to get full image URL
const getFullImageUrl = (relativePath) => {
    if (!relativePath) return null;
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }
    return `${API_URL}${relativePath}`;
};

// API Service
const apiService = {
    // Get all categories
    getCategories: async () => {
        try {
            const response = await fetch(`${API_URL}/api/categories`);
            const data = await response.json();
            return data.status ? data.data : [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    // Get all daily practices
    getDailyPractices: async () => {
        try {
            const response = await fetch(`${API_URL}/api/daily-practices`);
            const data = await response.json();
            return data.status ? data.data : [];
        } catch (error) {
            console.error('Error fetching daily practices:', error);
            return [];
        }
    },

    // Get daily practice by ID
    getDailyPracticeById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/daily-practices/${id}`);
            const data = await response.json();
            return data.status ? data.data : null;
        } catch (error) {
            console.error('Error fetching daily practice:', error);
            return null;
        }
    },

    // Delete daily practice
    deleteDailyPractice: async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/daily-practices/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting daily practice:', error);
            return { status: false, message: 'Network error' };
        }
    },

    // Increment view count
    incrementViewCount: async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/daily-practices/${id}/view`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error incrementing view count:', error);
            return { status: false };
        }
    }
};

// Show Daily Practices Component with Category-style Design
const ShowDailyPracticesPage = ({ onAdd, onEdit, onView }) => {
    const [practices, setPractices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [viewDetails, setViewDetails] = useState(null);

    const itemsPerPage = 10;

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch both practices and categories simultaneously
            const [practicesData, categoriesData] = await Promise.all([
                apiService.getDailyPractices(),
                apiService.getCategories()
            ]);

            setPractices(practicesData);
            setCategories(categoriesData);
        } catch (error) {
            setError('Failed to load data');
            console.error('Error fetching initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPractices = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await apiService.getDailyPractices();
            setPractices(data);
        } catch (error) {
            setError('Failed to load daily practices');
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = practices.filter((item) => {
        const matchesSearch =
            (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.media_type && item.media_type.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown';
    };

    // Image error handler
    const handleImageError = (e) => {
        e.target.style.display = 'none';
        const fallback = e.target.nextSibling;
        if (fallback) {
            fallback.style.display = 'flex';
        }
    };

    // Image load handler
    const handleImageLoad = (e) => {
        e.target.style.display = 'block';
        const fallback = e.target.nextSibling;
        if (fallback) {
            fallback.style.display = 'none';
        }
    };

    const openModal = (type, item = null) => {
        setModalType(type);
        setSelectedItem(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
        setViewDetails(null);
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const result = await apiService.deleteDailyPractice(selectedItem.id);
            if (result.status) {
                await fetchPractices();
                showNotification("Daily practice deleted successfully", "success");
            } else {
                throw new Error(result.message || 'Failed to delete practice');
            }
            closeModal();
        } catch (error) {
            showNotification(error.message || "Delete failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (id) => {
        try {
            const practice = await apiService.getDailyPracticeById(id);
            if (practice) {
                setViewDetails(practice);
                // Increment view count
                await apiService.incrementViewCount(id);
            }
        } catch (error) {
            setError('Failed to load practice details');
        }
    };

    const showNotification = (message, type) => {
        if (type === "error") {
            alert(`Error: ${message}`);
        } else {
            alert(message);
        }
    };

    // Render media preview based on media type
    const renderMediaPreview = (practice, size = 'small') => {
        const imageUrl = getFullImageUrl(practice.cover_image);
        const mediaUrl = getFullImageUrl(practice.media_url);
        
        const sizeClasses = {
            small: 'w-12 h-12',
            medium: 'w-16 h-16',
            large: 'w-24 h-24'
        };

        const iconSizes = {
            small: 'w-4 h-4',
            medium: 'w-6 h-6',
            large: 'w-8 h-8'
        };

        if (practice.media_type === 'image') {
            const displayUrl = imageUrl || mediaUrl;
            if (displayUrl) {
                return (
                    <div className={`${sizeClasses[size]} rounded-lg overflow-hidden bg-gray-200`}>
                        <img
                            src={displayUrl}
                            alt={practice.title}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                        />
                        <div className="w-full h-full bg-gray-200 items-center justify-center hidden">
                            <ImageIcon className={`${iconSizes[size]} text-gray-400`} />
                        </div>
                    </div>
                );
            }
        } else if (imageUrl) {
            return (
                <div className={`${sizeClasses[size]} rounded-lg overflow-hidden bg-gray-200`}>
                    <img
                        src={imageUrl}
                        alt={practice.title}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                    />
                    <div className="w-full h-full bg-gray-200 items-center justify-center hidden">
                        <ImageIcon className={`${iconSizes[size]} text-gray-400`} />
                    </div>
                </div>
            );
        }

        return (
            <div className={`${sizeClasses[size]} rounded-lg bg-gray-200 flex items-center justify-center`}>
                <ImageIcon className={`${iconSizes[size]} text-gray-400`} />
            </div>
        );
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8 flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-lg sm:text-xl font-bold text-gray-700">DAILY PRACTICES</h1>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                            <span>Admin</span>
                            <span className="mx-2">/</span>
                            <span>Daily Practices</span>
                        </div>
                    </div>

                    {/* Search and Add Button */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-3 sm:p-4 lg:p-6">
                            <div className="flex flex-col space-y-3 sm:space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between md:gap-4">
                                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-3 md:gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search practices..."
                                            className="pl-8 sm:pl-9 lg:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-full w-full sm:w-64 md:w-72 lg:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto">
                                    <Link
                                        to="/admin/dashboard/daily-practices/add"
                                        className="w-full sm:w-auto px-3 sm:px-4 lg:px-6 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-sm font-medium"
                                    >
                                        <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <span className="hidden xs:inline">Add New Practice</span>
                                        <span className="xs:hidden">Add</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mx-4 sm:mx-6 mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                                <p className="mt-2 text-sm">Loading...</p>
                            </div>
                        )}

                        {/* Content */}
                        {!loading && !error && (
                            <>
                                {filteredItems.length === 0 ? (
                                    <div className="text-center py-8 px-4">
                                        <p className="text-gray-500 text-sm sm:text-base">
                                            {searchTerm
                                                ? "No daily practices found matching your criteria."
                                                : "No daily practices found."}
                                        </p>
                                        {!searchTerm && (
                                            <Link
                                                to="/admin/dashboard/daily-practices/add"
                                                className="mt-4 inline-block px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                            >
                                                Create your first practice
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Mobile Card View - Hidden on larger screens */}
                                        <div className="block lg:hidden">
                                            <div className="space-y-4 p-4">
                                                {currentItems.map((practice, index) => (
                                                    <div key={practice.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                        <div className="flex items-start space-x-3 mb-3">
                                                            {/* Cover Image */}
                                                            {renderMediaPreview(practice, 'medium')}
                                                            
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-xs font-bold text-gray-500">#{index+1}</span>
                                                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                                            {getCategoryName(practice.category_id)}
                                                                        </span>
                                                                    </div>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rounded border-gray-300 flex-shrink-0"
                                                                    />
                                                                </div>
                                                                <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                                                                    {practice.title}
                                                                </h3>
                                                                <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                                                                    {practice.description}
                                                                </p>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                                                                        {practice.media_type}
                                                                    </span>
                                                                    {practice.total_length && (
                                                                        <span className="text-xs text-gray-600">
                                                                            {practice.total_length} min
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <button
                                                                onClick={() => handleViewDetails(practice.id)}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200"
                                                            >
                                                                View Details
                                                            </button>
                                                            <div className="flex items-center space-x-3">
                                                                <button
                                                                    onClick={() => onEdit(practice.id)}
                                                                    className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                {practice.statusFlag !== 0 && (
                                                                <button
                                                                    onClick={() => openModal("delete", practice)}
                                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <FaTrash className="w-3 h-3" />
                                                                </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Desktop Table View - Hidden on mobile */}
                                        <div className="hidden lg:block overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 border-t border-gray-200">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded border-gray-300"
                                                            />
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                            ID
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                            Image
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                            Title
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                            Category
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                            Media Type
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                            Duration
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                            View Details
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {currentItems.map((practice, index) => (
                                                        <tr key={practice.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4">
                                                                <input
                                                                    type="checkbox"
                                                                    className="rounded border-gray-300"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                                                #{index+1}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {renderMediaPreview(practice, 'small')}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {practice.title}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 max-w-xs truncate">
                                                                        {practice.description}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-1 py-4">
                                                                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                                    {getCategoryName(practice.category_id)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                                                                    {practice.media_type}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center">
                                                                {practice.total_length ? `${practice.total_length} ` : 'N/A'}
                                                            </td>

                                                            <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                                                <div>
                                                                    <button
                                                                        onClick={() => handleViewDetails(practice.id)}
                                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-full text-xs font-medium transition-colors duration-200 flex items-center space-x-1"
                                                                        title="View Details"
                                                                    >
                                                                        View Details
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center space-x-2">
                                                                    <button
                                                                        onClick={() => onEdit(practice.id)}
                                                                        className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                                                                        title="Edit"
                                                                    >
                                                                        <Edit2 className="w-5 h-5" />
                                                                    </button>
                                                                    {practice.statusFlag !== 0 && (
                                                                    <button
                                                                        onClick={() => openModal("delete", practice)}
                                                                        className="text-red-600 hover:text-red-800 transition-colors"
                                                                        title="Delete"
                                                                    >
                                                                        <FaTrash className="w-4 h-4" />
                                                                    </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                {/* Pagination */}
                                {filteredItems.length > 0 && (
                                    <div className="px-4 sm:px-6 py-4 flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200">
                                        <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                                            Showing {startIndex + 1} to{" "}
                                            {Math.min(startIndex + itemsPerPage, filteredItems.length)}{" "}
                                            of {filteredItems.length} entries
                                        </div>
                                        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                            <button
                                                onClick={() =>
                                                    setCurrentPage(Math.max(1, currentPage - 1))
                                                }
                                                disabled={currentPage === 1}
                                                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>

                                            {/* Show fewer page numbers on mobile */}
                                            {(() => {
                                                const maxVisiblePages = window.innerWidth < 640 ? 3 : 7;
                                                const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

                                                if (totalPages <= maxVisiblePages) {
                                                    return pages.map((page) => (
                                                        <button
                                                            key={page}
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${currentPage === page
                                                                    ? "bg-blue-500 text-white"
                                                                    : "text-gray-600 hover:bg-gray-100"
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    ));
                                                }

                                                // Show truncated pagination for many pages
                                                const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                                                const end = Math.min(totalPages, start + maxVisiblePages - 1);
                                                const visiblePages = pages.slice(start - 1, end);

                                                return visiblePages.map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${currentPage === page
                                                                ? "bg-blue-500 text-white"
                                                                : "text-gray-600 hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ));
                                            })()}

                                            <button
                                                onClick={() =>
                                                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                                                }
                                                disabled={currentPage === totalPages}
                                                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>


                    {/* Delete Confirmation Modal */}
                    {showModal && modalType === "delete" && selectedItem && (
                        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                                <h3 className="text-lg font-semibold mb-4">Delete Daily Practice</h3>
                                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                                    Are you sure you want to delete "{selectedItem.title}"? This action cannot be undone.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                                    <button
                                        onClick={closeModal}
                                        disabled={loading}
                                        className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={loading}
                                        className="w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}



                    {/* View Details Modal - Enhanced responsiveness */}
                    {viewDetails && (
                        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-1 sm:p-4">
                            <div className="bg-white rounded-none sm:rounded-lg max-w-5xl w-full h-full sm:h-auto sm:max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-2 sm:p-4 md:p-6 flex justify-between items-center z-10">
                                    <h2 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800 truncate pr-2">Practice Details</h2>
                                    <button
                                        onClick={() => setViewDetails(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 min-w-[44px]"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
                                    {/* Header Info */}
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                {viewDetails.category_name || getCategoryName(viewDetails.category_id)}
                                            </span>
                                            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-100 text-gray-800 text-xs rounded-full capitalize">
                                                {viewDetails.media_type}
                                            </span>
                                            {viewDetails.emotion_title && (
                                                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                    {viewDetails.emotion_title}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight break-words">
                                            {viewDetails.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 gap-2 sm:gap-4">
                                            <span className="flex items-center">
                                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                                <span className="truncate">{viewDetails.total_view_count} views</span>
                                            </span>
                                            {viewDetails.total_length > 0 && (
                                                <span className="whitespace-nowrap">{viewDetails.total_length} minutes</span>
                                            )}
                                            {viewDetails.singer_name && (
                                                <span className="whitespace-nowrap">by {viewDetails.singer_name}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Cover Image & Media Player */}
                                    <div className="bg-gray-50 rounded-lg p-1 sm:p-2 md:p-4">
                                        {/* Cover Image */}
                                        {viewDetails.cover_image && (
                                            <div className="mb-3 sm:mb-4">
                                                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Cover Image</h4>
                                                <div className="bg-black rounded-lg overflow-hidden">
                                                    <img
                                                        src={getFullImageUrl(viewDetails.cover_image)}
                                                        alt="Cover"
                                                        className="w-full h-32 sm:h-48 md:h-64 object-cover"
                                                        onError={handleImageError}
                                                        onLoad={handleImageLoad}
                                                    />
                                                    <div className="w-full h-32 sm:h-48 md:h-64 bg-gray-200 items-center justify-center hidden">
                                                        <ImageIcon className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Media Player */}
                                        {viewDetails.media_url && (
                                            <div>
                                                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Media Content</h4>
                                                <div className="bg-black rounded-lg overflow-hidden">
                                                    {viewDetails.media_type === 'video' ? (
                                                        <video
                                                            controls
                                                            className="w-full h-32 sm:h-48 md:h-64 lg:h-80 xl:h-96"
                                                            poster={getFullImageUrl(viewDetails.cover_image)}
                                                        >
                                                            <source src={getFullImageUrl(viewDetails.media_url)} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    ) : viewDetails.media_type === 'audio' ? (
                                                        <div className="flex items-center justify-center h-32 sm:h-48 md:h-64 bg-gradient-to-br from-purple-600 to-blue-600">
                                                            <div className="text-center px-2 sm:px-4 w-full">
                                                                <div className="mb-2 sm:mb-4 p-2 sm:p-3 md:p-4 bg-white bg-opacity-20 rounded-full mx-auto w-fit">
                                                                    <Play className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                                                                </div>
                                                                <audio controls className="w-full max-w-[240px] sm:max-w-xs md:max-w-md">
                                                                    <source src={getFullImageUrl(viewDetails.media_url)} type="audio/mpeg" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-black rounded-lg overflow-hidden">
                                                            <img
                                                                src={getFullImageUrl(viewDetails.media_url)}
                                                                alt="Media"
                                                                className="w-full h-32 sm:h-48 md:h-64 lg:h-80 object-cover"
                                                                onError={handleImageError}
                                                                onLoad={handleImageLoad}
                                                            />
                                                            <div className="w-full h-32 sm:h-48 md:h-64 lg:h-80 bg-gray-200 items-center justify-center hidden">
                                                                <ImageIcon className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {!viewDetails.media_url && !viewDetails.cover_image && (
                                            <div className="bg-gray-200 rounded-lg h-32 sm:h-48 md:h-64 flex items-center justify-center">
                                                <p className="text-gray-500 text-xs sm:text-sm text-center px-2">No media available</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h4 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                                            About this practice
                                        </h4>
                                        <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                            {viewDetails.description}
                                        </p>
                                    </div>

                                    {/* Goals Section */}
                                    {viewDetails.goals && viewDetails.goals.length > 0 && (
                                        <div>
                                            <h4 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                                                Goals
                                            </h4>
                                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                                {viewDetails.goals.map((goal) => (
                                                    <span 
                                                        key={goal.id} 
                                                        className="px-2 py-1 sm:px-3 sm:py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                                    >
                                                        {goal.title}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Practice Details Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                        {/* Statistics Card */}
                                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                            <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Statistics</h5>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-600">Views:</span>
                                                    <span className="text-xs font-bold text-blue-600">{viewDetails.total_view_count}</span>
                                                </div>
                                                {viewDetails.total_length > 0 && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-600">Duration:</span>
                                                        <span className="text-xs font-bold text-green-600">{viewDetails.total_length} min</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-600">Type:</span>
                                                    <span className="text-xs font-bold text-purple-600 capitalize">{viewDetails.media_type}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category & Emotion Card */}
                                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                            <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Category & Emotion</h5>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-600">Category:</span>
                                                    <span className="text-xs font-bold text-blue-600">
                                                        {viewDetails.category_name || getCategoryName(viewDetails.category_id)}
                                                    </span>
                                                </div>
                                                {viewDetails.emotion_title && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-600">Emotion:</span>
                                                        <span className="text-xs font-bold text-purple-600">{viewDetails.emotion_title}</span>
                                                    </div>
                                                )}
                                                {viewDetails.singer_name && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-600">Singer:</span>
                                                        <span className="text-xs font-bold text-indigo-600">{viewDetails.singer_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Metadata Card */}
                                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
                                            <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Metadata</h5>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-600">Created:</span>
                                                    <span className="text-xs font-bold text-gray-700">
                                                        {formatDate(viewDetails.created_at)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-600">Updated:</span>
                                                    <span className="text-xs font-bold text-gray-700">
                                                        {formatDate(viewDetails.updated_at)}
                                                    </span>
                                                </div>
                                                {viewDetails.created_user && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-600">Created by:</span>
                                                        <span className="text-xs font-bold text-gray-700 truncate max-w-[120px]" title={viewDetails.created_user}>
                                                            {viewDetails.created_user}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Information */}
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs sm:text-sm font-medium text-gray-700">Status:</span>
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    viewDetails.statusFlag === 1 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {viewDetails.statusFlag === 1 ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                ID: #{viewDetails.id}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

const ViewDailyPracticePage = ({ practiceId, onBack }) => {
    const [practice, setPractice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const fetchPractice = async () => {
            try {
                const data = await apiService.getDailyPracticeById(practiceId);
                if (data) {
                    setPractice(data);
                    // Increment view count
                    await apiService.incrementViewCount(practiceId);
                } else {
                    setError('Practice not found');
                }
            } catch (error) {
                setError('Failed to load practice');
            } finally {
                setLoading(false);
            }
        };

        if (practiceId) {
            fetchPractice();
        }
    }, [practiceId]);

    const getCategoryName = (categoryId) => {
        const category = MOCK_CATEGORIES.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown';
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !practice) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <p className="text-red-600 text-lg">{error || 'Practice not found'}</p>
                    <button
                        onClick={onBack}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        
        <div className="max-w-4xl mx-auto p-3 sm:p-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center mb-3 sm:mb-4">
                        <button
                            onClick={onBack}
                            className="mr-3 sm:mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full">
                            {getCategoryName(practice.category_id)}
                        </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 leading-tight">
                        {practice.title}
                    </h1>
                    <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 gap-2 sm:gap-4">
                        <span className="flex items-center">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {practice.total_view_count} views
                        </span>
                        {practice.total_length && (
                            <span>{practice.total_length} minutes</span>
                        )}
                        <span className="capitalize">{practice.media_type}</span>
                    </div>
                </div>

                {/* Media Player */}
                <div className="p-4 sm:p-6 bg-gray-50">
                    {practice.media_url ? (
                        <div className="bg-black rounded-lg overflow-hidden">
                            {practice.media_type === 'video' ? (
                                <video
                                    controls
                                    className="w-full h-48 sm:h-64 md:h-96"
                                    poster="/api/placeholder/800/400"
                                >
                                    <source src={practice.media_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="flex items-center justify-center h-48 sm:h-64 bg-gradient-to-br from-purple-600 to-blue-600">
                                    <div className="text-center px-4">
                                        <button
                                            onClick={handlePlayPause}
                                            className="mb-3 sm:mb-4 p-3 sm:p-4 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                                        >
                                            {isPlaying ? (
                                                <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                            ) : (
                                                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                            )}
                                        </button>
                                        <audio controls className="w-full max-w-xs sm:max-w-md">
                                            <source src={practice.media_url} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-200 rounded-lg h-48 sm:h-64 flex items-center justify-center">
                            <p className="text-gray-500 text-sm sm:text-base">No media available</p>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                        About this practice
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                        {practice.description}
                    </p>
                </div>

                {/* Practice Info */}
                <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        <div className="text-center p-2 sm:p-0">
                            <div className="text-xl sm:text-2xl font-bold text-blue-600">
                                {practice.total_view_count}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">Total Views</div>
                        </div>
                        {practice.total_length && (
                            <div className="text-center p-2 sm:p-0">
                                <div className="text-xl sm:text-2xl font-bold text-green-600">
                                    {practice.total_length}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">Minutes</div>
                            </div>
                        )}
                        <div className="text-center p-2 sm:p-0 sm:col-span-2 md:col-span-1">
                            <div className="text-xl sm:text-2xl font-bold text-purple-600 capitalize">
                                {practice.media_type}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">Media Type</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

// Main App Component
const DailyPracticesApp = () => {
    const [currentPage, setCurrentPage] = useState('list');
    const [selectedPracticeId, setSelectedPracticeId] = useState(null);
    const navigate = useNavigate();

    const handleAddPractice = () => {
        navigate('/admin/dashboard/daily-practices/add');
    };

    const handleEditPractice = (id) => {
        navigate(`/admin/dashboard/daily-practices/edit/${id}`);
    };

    const handleViewPractice = (id) => {
        setSelectedPracticeId(id);
        setCurrentPage('view');
    };

    const handleBackToList = () => {
        setCurrentPage('list');
        setSelectedPracticeId(null);
    };

    const handleSuccess = () => {
        setCurrentPage('list');
        setSelectedPracticeId(null);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {currentPage === 'list' && (
                <ShowDailyPracticesPage
                    onAdd={handleAddPractice}
                    onEdit={handleEditPractice}
                    onView={handleViewPractice}
                />
            )}

            {currentPage === 'view' && (
                <ViewDailyPracticePage
                    practiceId={selectedPracticeId}
                    onBack={handleBackToList}
                />
            )}
        </div>
    );
};

export default DailyPracticesApp;