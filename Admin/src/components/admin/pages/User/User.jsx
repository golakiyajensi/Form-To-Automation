import React, { useState, useEffect } from "react";
import { Search, Edit2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");

  const itemsPerPage = 10;
  const token = localStorage?.getItem("admin_token");
  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  // API helper
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
    if (!response.ok) throw new Error(data.message || "API Error");
    return data;
  };

  // Fetch users
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`${API_URL}/api/user/`);
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Failed to fetch users");
      toast.error("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtering
  const filteredItems = users.filter((user) => {
    const name = user?.name || "";
    const email = user?.email || "";
    const role = user?.role || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
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

  // Edit role modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setRole(user.role);
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setRole("");
  };
  const handleRoleUpdate = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const response = await apiRequest(
        `${API_URL}/api/user/role/${selectedUser.user_id}`,
        {
          method: "PUT",
          body: JSON.stringify({ role }),
        }
      );
      if (response.status) {
        toast.success("User role updated successfully");
        fetchData();
        closeEditModal();
      } else throw new Error(response.message || "Update failed");
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
      const response = await apiRequest(`${API_URL}/api/user/${userId}`, {
        method: "DELETE",
      });
      if (response.status) {
        await fetchData();
        toast.success("User deleted successfully");
      } else throw new Error(response.message || "Delete failed");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // Select items
  const handleSelectAll = (checked) => {
    setSelectedItems(checked ? currentItems.map((i) => i.user_id) : []);
  };
  const handleSelectItem = (userId, checked) => {
    setSelectedItems((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  // Mobile Card
  const MobileCard = ({ user, index }) => (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={selectedItems.includes(user.user_id)}
            onChange={(e) => handleSelectItem(user.user_id, e.target.checked)}
          />
          <div>
            <span className="text-xs font-medium text-gray-500">
              #{index + 1}
            </span>
            <h3 className="font-medium text-gray-900 line-clamp-2">
              {user.name}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openEditModal(user)}
            className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(user.user_id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Email:</span>
          <span className="text-gray-900">{user.email}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Role:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              user.role === "admin"
                ? "bg-red-100 text-red-700"
                : user.role === "viewer"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {user.role}
          </span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Created:</span>
          <span className="text-gray-900">{formatDate(user.created_at)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Updated:</span>
          <span className="text-gray-900">{formatDate(user.updated_at)}</span>
        </div>
      </div>
    </div>
  );

  // Pagination
  const PaginationComponent = () => {
    const getVisiblePages = () => {
      const delta = 2;
      const pages = [];
      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);
      pages.push(1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      if (totalPages > 1) pages.push(totalPages);
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
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="hidden sm:flex items-center space-x-1">
            {getVisiblePages().map((page, idx) => (
              <button
                key={idx}
                onClick={() =>
                  typeof page === "number" && setCurrentPage(page)
                }
                disabled={page === "..."}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : page === "..."
                    ? "text-gray-400 cursor-default"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <div className="sm:hidden px-3 py-1 text-sm text-gray-600">
            {currentPage} / {totalPages}
          </div>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Users</h1>
              <p className="text-gray-500 text-sm">
                Manage all registered users and their roles
              </p>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              {pathParts.map((part, index) => {
                const name = part.charAt(0).toUpperCase() + part.slice(1);
                return (
                  <span key={index}>
                    {name}
                    {index < pathParts.length - 1 && (
                      <span className="mx-2">/</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          {/* Search */}
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-600">Loading...</p>
            </div>
          )}

          {/* Error */}
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
                <div className="text-center py-12 text-gray-500">
                  No users found
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              checked={
                                selectedItems.length === currentItems.length &&
                                currentItems.length > 0
                              }
                              onChange={(e) =>
                                handleSelectAll(e.target.checked)
                              }
                            />
                          </th>
                          {[
                            "ID",
                            "Name",
                            "Email",
                            "Role",
                            "Created Date",
                            "Updated Date",
                            "Actions",
                          ].map((heading) => (
                            <th
                              key={heading}
                              className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((user, idx) => (
                          <tr
                            key={user.user_id}
                            className={
                              idx % 2 === 0
                                ? "bg-gray-50 hover:bg-gray-100"
                                : "hover:bg-gray-100"
                            }
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={selectedItems.includes(user.user_id)}
                                onChange={(e) =>
                                  handleSelectItem(user.user_id, e.target.checked)
                                }
                              />
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-700">
                              {user.user_id}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-600">
                              {user.name}
                            </td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  user.role === "admin"
                                    ? "bg-red-100 text-red-700"
                                    : user.role === "viewer"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-600">
                              {formatDate(user.created_at)}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-600">
                              {formatDate(user.updated_at)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => openEditModal(user)}
                                  className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(user.user_id)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  title="Delete"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
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
                        <span className="text-sm text-gray-600">Select All</span>
                      </div>
                    </div>
                    {currentItems.map((user, idx) => (
                      <MobileCard
                        key={user.user_id}
                        user={user}
                        index={startIndex + idx}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Pagination */}
          {filteredItems.length > 0 && <PaginationComponent />}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Edit Role</h3>
              <p className="text-sm text-gray-500 mt-1">
                Update role for <span className="font-medium">{selectedUser.name}</span>
              </p>
            </div>
            <div className="p-6">
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Users;
