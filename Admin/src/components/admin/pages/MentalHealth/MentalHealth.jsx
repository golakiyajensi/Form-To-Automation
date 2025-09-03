import React, { useState, useEffect } from "react";
import { Search, Edit2, ChevronLeft, ChevronRight, Filter, MoreVertical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MentalHealth = () => {
    const navigate = useNavigate();
    const [mentalItems, setMentalItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({ title: "", statusFlag: 1 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
    const itemsPerPage = 10;
    const token = localStorage?.getItem("admin_token");

    // API request function
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
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        return data;
    };

    // Fetch data from backend
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiRequest(`${API_URL}/api/mental-health`);
            const items = Array.isArray(response.data) ? response.data : [];
            setMentalItems(items);
        } catch (err) {
            setError("Failed to fetch data");
            toast.error("Failed to fetch data");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter data based on search and status
    const filteredItems = mentalItems.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.created_user && item.created_user.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesSearch;
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Active
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
        navigate(`/admin/dashboard/mental-health/edit/${item.id}`);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await apiRequest(
                `${API_URL}/api/mental-health/${selectedItem.id}`,
                { method: "DELETE" }
            );

            if (response.status) {
                await fetchData();
                toast.success("Item deleted successfully");
            } else {
                throw new Error(response.message || "Failed to delete item");
            }
            closeModal();
        } catch (err) {
            toast.error(err.message || "Delete failed");
            console.error("Delete error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Handle selection
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedItems(currentItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (itemId, checked) => {
        if (checked) {
            setSelectedItems(prev => [...prev, itemId]);
        } else {
            setSelectedItems(prev => prev.filter(id => id !== itemId));
        }
    };

    // Mobile Card Component
    const MobileCard = ({ item, index }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                    />
                    <div>
                        <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                        <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2">{item.title}</h3>
                    </div>
                </div>
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

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    {getStatusBadge(item.statusFlag)}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Created</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(item.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Updated</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(item.updated_at)}</span>
                </div>
            </div>
        </div>
    );

    // Enhanced Pagination
    const PaginationComponent = () => {
        const getVisiblePages = () => {
            const delta = 1;
            const pages = [];
            const rangeStart = Math.max(2, currentPage - delta);
            const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

            pages.push(1);

            if (rangeStart > 2) pages.push("...");

            for (let i = rangeStart; i <= rangeEnd; i++) {
                if (i !== 1 && i !== totalPages) pages.push(i);
            }

            if (rangeEnd < totalPages - 1) pages.push("...");
            if (totalPages > 1) pages.push(totalPages);

            return pages;
        };

        return (
            <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                    <div className="text-sm text-gray-700">
                        Showing {startIndex + 1}to{" "}
                        {Math.min(startIndex + itemsPerPage, filteredItems.length)}{" "}
                        of {filteredItems.length} results
                    </div>

                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="hidden sm:flex">
                            {getVisiblePages().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                    disabled={page === "..."}
                                    className={`px-3 py-1 rounded text-sm ${currentPage === page
                                        ? "bg-blue-500 text-white"
                                        : page === "..."
                                            ? "text-gray-400 cursor-default"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <div className="sm:hidden px-4 py-2 text-sm text-gray-700 bg-white border-t border-b border-gray-300">
                            {currentPage}
                        </div>

                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-700">MENTAL HEALTH</h1>
                            <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                <span>Admin</span>
                                <span className="mx-2">/</span>
                                <span>Mental Health</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        {/* Toolbar */}
                        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 rounded-t-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search by title..."
                                            className="pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full sm:w-72 text-sm"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    {selectedItems.length > 0 && (
                                        <span className="text-sm text-gray-700">
                                            {selectedItems.length} selected
                                        </span>
                                    )}

                                    <Link
                                        to="/admin/dashboard/mental-health/add"
                                        className="px-4 sm:px-6 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors flex items-center space-x-2 text-sm"
                                    >
                                        <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="hidden sm:inline">Add New Item</span>
                                        <span className="sm:hidden">Add</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="mt-2 text-sm text-gray-600">Loading...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="text-center py-12">
                                <div className="mx-auto h-12 w-12 text-red-400">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading data</h3>
                                <p className="mt-1 text-sm text-gray-500">{error}</p>
                                <div className="mt-6">
                                    <button
                                        onClick={fetchData}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Try again
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        {!loading && !error && (
                            <>
                                {filteredItems.length === 0 ? (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table */}
                                        <div className="hidden lg:block overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                                                            <input
                                                                type="checkbox"
                                                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                                                                checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                                            />
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                                            ID
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                                            Title
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                                            Created
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                                            Updated
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {currentItems.map((item ,index) => (
                                                        <tr key={item.id} className="hover:bg-gray-50">
                                                            <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                                                                <input
                                                                    type="checkbox"
                                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                                                                    checked={selectedItems.includes(item.id)}
                                                                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                #{index+1}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={item.statusFlag === 0 ? "text-gray-400" : "text-gray-600"}>
                                                                    {item.title}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {getStatusBadge(item.statusFlag)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatDate(item.created_at)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatDate(item.updated_at)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

                                        {/* Mobile Cards */}
                                        <div className="lg:hidden p-4 space-y-4">
                                            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                                    />
                                                    <span className="text-sm text-gray-700">Select All</span>
                                                </div>
                                                {selectedItems.length > 0 && (
                                                    <span className="text-sm font-medium text-blue-600">
                                                        {selectedItems.length} selected
                                                    </span>
                                                )}
                                            </div>

                                            {currentItems.map((item ,index) => (
                                                <MobileCard key={item.id} item={item}
                                                index={startIndex + index}/>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {filteredItems.length > 0 && <PaginationComponent />}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Delete Modal */}
                {showModal && modalType === "delete" && (
                    <div className="fixed inset-0 bg-black/50 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-50 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3 text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <FaTrash className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Item</h3>
                                <div className="mt-2 px-7 py-3">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
                                    </p>
                                </div>
                                <div className="items-center px-4 py-3 space-y-2 sm:space-y-0 sm:space-x-3 sm:flex sm:flex-row-reverse">
                                    <button
                                        onClick={handleDelete}
                                        disabled={loading}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                    >
                                        {loading ? "Deleting..." : "Delete"}
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
            />
        </>
    );
};

export default MentalHealth;