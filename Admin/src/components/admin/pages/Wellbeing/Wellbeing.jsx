import React, { useState, useEffect } from "react";
import {
  Search,
  Edit2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wellbeing = () => {
  const navigate = useNavigate();
  const [wellbeingItems, setWellbeingItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'add', 'edit', 'view', 'delete'
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ title: "", statusFlag: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const itemsPerPage = 10;
  const token = localStorage?.getItem("admin_token");
  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

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
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  };

  // Fetch data from backend
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`${API_URL}/api/user/`);
      const items = Array.isArray(response.data) ? response.data : [];
      setWellbeingItems(items);
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
  const filteredItems = wellbeingItems.filter((item) => {
    const title = item?.title || item?.name || "";
    const createdUser = item?.created_user || "";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      createdUser.toLowerCase().includes(searchTerm.toLowerCase());

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
      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Active
      </span>
    ) : (
      <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  };

  const handleEdit = (item) => {
    navigate(`/admin/dashboard/wellbeing/edit/${item.user_id}`);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(
        `${API_URL}/api/wellbeing/${selectedItem.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status) {
        await fetchData(); // Refresh data
        toast.success("Delete successful");
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

  // Handle checkbox selection
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(currentItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Mobile Card Component - Fixed to show incremented ID
  const MobileCard = ({ item, index }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={selectedItems.includes(item.id)}
            onChange={(e) => handleSelectItem(item.id, e.target.checked)}
          />
          <div>
            <span className="text-xs font-medium text-gray-500">
              #{index + 1}
            </span>
            <h3 className="font-medium text-gray-900 line-clamp-2">
              {item.title}
            </h3>
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Status:</span>
          {getStatusBadge(item.statusFlag)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Created:</span>
          <span className="text-sm text-gray-900">
            {formatDate(item.created_at)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Updated:</span>
          <span className="text-sm text-gray-900">
            {formatDate(item.updated_at)}
          </span>
        </div>
      </div>
    </div>
  );

  // Pagination component with responsive design
  const PaginationComponent = () => {
    const getVisiblePages = () => {
      const delta = 2;
      const pages = [];
      const rangeStart = Math.max(2, currentPage - delta);
      const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

      pages.push(1);

      if (rangeStart > 2) {
        pages.push("...");
      }

      for (let i = rangeStart; i <= rangeEnd; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (rangeEnd < totalPages - 1) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }

      return pages;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 px-4 sm:px-6 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 order-2 sm:order-1">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredItems.length)} of{" "}
          {filteredItems.length} entries
        </div>
        <div className="flex items-center space-x-1 order-1 sm:order-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="hidden sm:flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={page === "..."}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === page
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

          {/* Mobile pagination - show current page info */}
          <div className="sm:hidden px-3 py-1 text-sm text-gray-600">
            {currentPage} / {totalPages}
          </div>

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-700">
                WELLBEING
              </h1>
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <span>Admin</span>
                <span className="mx-2">/</span>
                <span>Wellbeing</span>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Search and Controls */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
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

                {/* Add Button */}
                <div className="flex items-center space-x-3">
                  {selectedItems.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {selectedItems.length} selected
                      </span>
                    </div>
                  )}

                  <Link
                    to="/admin/dashboard/wellbeing/add"
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
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Content */}
            {!loading && !error && (
              <>
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No items found</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={
                                  selectedItems.length ===
                                    currentItems.length &&
                                  currentItems.length > 0
                                }
                                onChange={(e) =>
                                  handleSelectAll(e.target.checked)
                                }
                              />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                              Email
                            </th>
                             <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                              Created Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                              Updated Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentItems.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300"
                                  checked={selectedItems.includes(item.id)}
                                  onChange={(e) =>
                                    handleSelectItem(item.id, e.target.checked)
                                  }
                                />
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                {item.user_id}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                {item.name}
                              </td>
                              <td className="px-6 py-4">
                                {item.email}
                              </td>
                              <td className="px-6 py-4">
                                {item.role}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                {formatDate(item.created_at)}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                {formatDate(item.updated_at)}
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
                    <div className="lg:hidden p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={
                              selectedItems.length === currentItems.length &&
                              currentItems.length > 0
                            }
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                          <span className="text-sm text-gray-600">
                            Select All
                          </span>
                        </div>
                        {selectedItems.length > 0 && (
                          <span className="text-sm text-blue-600">
                            {selectedItems.length} selected
                          </span>
                        )}
                      </div>

                      {currentItems.map((item, index) => (
                        <MobileCard
                          key={item.id}
                          item={item}
                          index={startIndex + index}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {filteredItems.length > 0 && <PaginationComponent />}
                  </>
                )}
              </>
            )}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">
                  {modalType === "delete" && "Delete Wellbeing Item"}
                </h3>
                {modalType === "delete" && selectedItem && (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Are you sure you want to delete "{selectedItem.title}"?
                      This action cannot be undone.
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                  <button
                    onClick={closeModal}
                    disabled={loading}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {modalType === "view" ? "Close" : "Cancel"}
                  </button>
                  {modalType === "delete" && (
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </button>
                  )}
                  {(modalType === "add" || modalType === "edit") && (
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !formData.title.trim()}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading
                        ? "Saving..."
                        : modalType === "add"
                        ? "Add Item"
                        : "Update Item"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
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
        className="mt-16 sm:mt-0"
      />
    </>
  );
};

export default Wellbeing;
