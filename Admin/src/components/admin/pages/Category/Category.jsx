import React, { useState, useEffect } from "react";
import { Search, Edit2, Eye, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";

const Category = () => {
    const navigate = useNavigate();
    const [wellbeingItems, setWellbeingItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({ title: "", statusFlag: 1 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusLoading, setStatusLoading] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [imageErrors, setImageErrors] = useState({}); // Track image load errors
    const [imageLoadStates, setImageLoadStates] = useState({}); // Track image loading states

    const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
    const itemsPerPage = 10;
    const token = localStorage?.getItem("admin_token");

    // Create axios-like fetch function
    const apiRequest = async (url, options = {}) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };
        const response = await fetch(url, config);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`data.message || HTTP error! status: ${response.status}`);
        }
        return data;
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiRequest(`${API_URL}/api/categories`);
            const items = Array.isArray(response.data) ? response.data : [];
            setWellbeingItems(items);
            // Reset image errors and loading states when data is refreshed
            setImageErrors({});
            setImageLoadStates({});
        } catch (err) {
            setError("Failed to fetch data");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredItems = wellbeingItems.filter((item) => {
        const matchesSearch =
            (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.detail_title && item.detail_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.detail_description && item.detail_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.created_user && item.created_user.toLowerCase().includes(searchTerm.toLowerCase()));
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

    const getStatusBadge = (statusFlag) => {
        return statusFlag === 1 ? (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Active
            </span>
        ) : (
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Inactive
            </span>
        );
    };

    const openModal = (type, item = null) => {
        setModalType(type);
        setSelectedItem(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
        setFormData({ title: "", statusFlag: 1 });
    };

    const handleEdit = (item) => {
        navigate(`/admin/dashboard/category/edit/${item.id}`);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await apiRequest(
                `${API_URL}/api/categories/${selectedItem.id}`,
                {
                    method: "DELETE",
                }
            );
            if (response.status) {
                await fetchData(); // Refresh data
                showNotification("Category item deleted successfully", "success");
            } else {
                throw new Error(response.message || "Failed to delete item");
            }
            closeModal();
        } catch (err) {
            showNotification(err.message || "Delete failed", "error");
            console.error("Delete error:", err);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type) => {
        // For now, just using alert - you can implement a proper toast system
        if (type === "error") {
            alert(`Error: ${message}`);
        } else {
            alert(message);
        }
    };

    // Handle image load errors
    const handleImageError = (imageId, imageType, event) => {
        console.error(`Image load error for ${imageId}_${imageType}:, event`);
        setImageErrors(prev => ({
            ...prev,
            [`${imageId}_${imageType}`]: true
        }));
        setImageLoadStates(prev => ({
            ...prev,
            [`${imageId}_${imageType}`]: 'error'
        }));
    };

    // Handle image load success
    const handleImageLoad = (imageId, imageType) => {
        console.log(`Image loaded successfully for ${imageId}_${imageType}`);
        setImageLoadStates(prev => ({
            ...prev,
            [`${imageId}_${imageType}`]: 'loaded'
        }));
    };

    // Handle image load start
    const handleImageLoadStart = (imageId, imageType) => {
        setImageLoadStates(prev => ({
            ...prev,
            [`${imageId}_${imageType}`]: 'loading'
        }));
    };

    // Check if image has error
    const hasImageError = (imageId, imageType) => {
        return imageErrors[`${imageId}_${imageType}`];
    };

    // Get image load state
    const getImageLoadState = (imageId, imageType) => {
        return imageLoadStates[`${imageId}_${imageType}`] || 'pending';
    };

    // Image component with better error handling
    const ImageWithFallback = ({ src, alt, className, imageId, imageType }) => {
        if (!src || hasImageError(imageId, imageType)) {
            return (
                <div className={`${className} flex items-center justify-center text-gray-400 bg-gray-100`}>
                    <ImageIcon className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
            );
        }

        const loadState = getImageLoadState(imageId, imageType);

        return (
            <div className={`${className} relative`}>
                {loadState === 'loading' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-gray-400"></div>
                    </div>
                )}
                <img
                    src={src}
                    alt={alt}
                    className={`${className} ${loadState === 'loading' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                    onLoadStart={() => handleImageLoadStart(imageId, imageType)}
                    onLoad={() => handleImageLoad(imageId, imageType)}
                    onError={(e) => handleImageError(imageId, imageType, e)}
                    crossOrigin="anonymous" // Add this for CORS
                />
            </div>
        );
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8 flex flex-col items-start sm:items-center sm:flex-row sm:justify-between">
                        <h1 className="text-lg sm:text-xl font-bold text-gray-700 mb-2 sm:mb-0">CATEGORIES</h1>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                            <span>Admin</span>
                            <span className="mx-2">/</span>
                            <span>Categories</span>
                        </div>
                    </div>

                    {/* Search and Add Button */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="relative flex-1 md:max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, title, description..."
                                        className="pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full text-sm sm:text-base"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                                <div className="flex-shrink-0">
                                    <Link
                                        to="/admin/dashboard/category/add"
                                        className="px-4 sm:px-6 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base w-full md:w-auto whitespace-nowrap"
                                    >
                                        <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                                        Add New Category
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                                <p className="mt-2 text-sm sm:text-base">Loading...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="text-center py-8">
                                <p className="text-red-500 text-sm sm:text-base">{error}</p>
                                <button
                                    onClick={fetchData}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Table for larger screens */}
                        {!loading && !error && (
                            <>
                                {filteredItems.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-sm sm:text-base">
                                            {searchTerm || statusFilter !== "all"
                                                ? "No categories found matching your criteria."
                                                : "No categories found."}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table View */}
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
                                                            Icon
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                            Name
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                            Detail Title
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                            Created Date
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {currentItems.map((item ,index) => (
                                                        <tr key={item.id} className="hover:bg-gray-50">
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
                                                                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                                                                    <ImageWithFallback
                                                                        src={`${API_URL}/${item.icon}`}
                                                                        alt={item.name || 'Category icon'}
                                                                        className="w-full h-full object-cover"
                                                                        imageId={item.id}
                                                                        imageType="icon"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                                                <span
                                                                    className={
                                                                        item.statusFlag === 0
                                                                            ? "text-gray-500"
                                                                            : "text-gray-600"
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                                                {item.detail_title}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {getStatusBadge(item.statusFlag)}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                                                {formatDate(item.created_at)}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center space-x-2">
                                                                    <button
                                                                        onClick={() => handleEdit(item)}
                                                                        className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                                                                        title="Edit"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </button>

                                                                    {item.statusFlag !== 0 && (
                                                                        <button
                                                                            onClick={() => openModal("delete", item)}
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

                                        {/* Mobile Card View */}
                                        <div className="lg:hidden">
                                            {currentItems.map((item ,index) => (
                                                <div key={item.id} className="border-b border-gray-200 p-4">
                                                    <div className="flex items-start space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-gray-300 mt-1"
                                                        />
                                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            <ImageWithFallback
                                                                src={`${API_URL}/${item.icon}`}
                                                                alt={item.name || 'Category icon'}
                                                                className="w-full h-full object-cover"
                                                                imageId={item.id}
                                                                imageType="icon"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-xs font-bold text-gray-500">#{index+1}</span>
                                                                {getStatusBadge(item.statusFlag)}
                                                            </div>
                                                            <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                                                                {item.name}
                                                            </h3>
                                                            <p className="text-xs text-gray-600 mb-2 truncate">
                                                                {item.detail_title}
                                                            </p>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs text-gray-500">
                                                                    {formatDate(item.created_at)}
                                                                </span>
                                                                <div className="flex items-center space-x-2">
                                                                    <button
                                                                        onClick={() => handleEdit(item)}
                                                                        className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                                                                        title="Edit"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </button>

                                                                    {item.statusFlag !== 0 && (
                                                                        <button
                                                                            onClick={() => openModal("delete", item)}
                                                                            className="text-red-600 hover:text-red-800 transition-colors"
                                                                            title="Delete"
                                                                        >
                                                                            <FaTrash className="w-4 h-4" />
                                                                        </button>
                                                                    )}
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Pagination */}
                                {filteredItems.length > 0 && (
                                    <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
                                        <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                                            Showing {startIndex + 1} to{" "}
                                            {Math.min(startIndex + itemsPerPage, filteredItems.length)}{" "}
                                            of {filteredItems.length} entries
                                        </div>
                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                            <button
                                                onClick={() =>
                                                    setCurrentPage(Math.max(1, currentPage - 1))
                                                }
                                                disabled={currentPage === 1}
                                                className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>

                                            {/* Show fewer page numbers on mobile */}
                                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                .filter(page => {
                                                    // On mobile, show current page and 2 pages on each side
                                                    if (window.innerWidth < 640) {
                                                        return Math.abs(page - currentPage) <= 1;
                                                    }
                                                    return true;
                                                })
                                                .map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${currentPage === page
                                                            ? "bg-blue-500 text-white"
                                                            : "text-gray-600 hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}

                                            <button
                                                onClick={() =>
                                                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                                                }
                                                disabled={currentPage === totalPages}
                                                className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <h3 className="text-base sm:text-lg font-semibold mb-4">
                                    {modalType === "delete" && "Delete Category"}
                                    {modalType === "view" && "Category Details"}
                                </h3>

                                {modalType === "delete" && selectedItem && (
                                    <div>
                                        <p className="text-gray-600 mb-4 text-sm sm:text-base">
                                            Are you sure you want to delete "{selectedItem.name}"? This
                                            action cannot be undone.
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                                    <button
                                        onClick={closeModal}
                                        disabled={loading}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
                                    >
                                        {modalType === "view" ? "Close" : "Cancel"}
                                    </button>
                                    {modalType === "delete" && (
                                        <button
                                            onClick={handleDelete}
                                            disabled={loading}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </>
    );
};

export default Category;