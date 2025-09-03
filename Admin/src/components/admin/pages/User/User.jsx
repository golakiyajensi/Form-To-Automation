import React, { useState, useEffect } from "react";
import { Search, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
  const navigate = useNavigate();
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

  // Inside your component
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean); // ["admin","dashboard","user"]
  const lastPart = pathParts[pathParts.length - 1]; // "user"
  const breadcrumbName = lastPart.charAt(0).toUpperCase() + lastPart.slice(1); // "User"

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

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`${API_URL}/api/user/`);
      const items = Array.isArray(response.data) ? response.data : [];
      setUsers(items);
    } catch (err) {
      setError("Failed to fetch users");
      toast.error("Failed to fetch users");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  // Function to open modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setRole(user.role); // prefill current role
    setShowEditModal(true);
  };

  // Function to close modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setRole("");
  };
  // Function to update role
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
      } else {
        throw new Error(response.message || "Failed to update role");
      }
    } catch (err) {
      toast.error(err.message || "Update failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      const response = await apiRequest(`${API_URL}/api/user/${userId}`, {
        method: "DELETE",
      });
      if (response.status) {
        await fetchData();
        toast.success("User deleted successfully");
      } else {
        throw new Error(response.message || "Failed to delete user");
      }
    } catch (err) {
      toast.error(err.message || "Delete failed");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(currentItems.map((item) => item.user_id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (userId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, userId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== userId));
    }
  };

  // Inside your Users component, before the return()
  const MobileCard = ({ user, index }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
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

      <div className="space-y-1">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Email:</span>
          <span className="text-gray-900">{user.email}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Role:</span>
          <span className="text-gray-900">{user.role}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Created:</span>
          <span className="text-gray-900">{formatDate(user.created_at)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Updated:</span>
          <span className="text-gray-900">{formatDate(user.updated_at)}</span>
        </div>
      </div>
    </div>
  );

  const PaginationComponent = () => {
    const getVisiblePages = () => {
      const delta = 2;
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
                USERS
              </h1>
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

          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Search and Controls */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or role..."
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
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {selectedItems.length} selected
                      </span>
                    </div>
                  )}

                  {/* <Link
                    to="/admin/dashboard/users/add"
                    className="px-4 sm:px-6 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Add New User</span>
                    <span className="sm:hidden">Add</span>
                  </Link> */}
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
                    <p className="text-gray-500">No users found</p>
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
                          {currentItems.map((user) => (
                            <tr key={user.user_id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300"
                                  checked={selectedItems.includes(user.user_id)}
                                  onChange={(e) =>
                                    handleSelectItem(
                                      user.user_id,
                                      e.target.checked
                                    )
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
                              <td className="px-6 py-4">{user.role}</td>
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

                      {currentItems.map((user, index) => (
                        <MobileCard
                          key={user.user_id}
                          user={user}
                          index={startIndex + index}
                        />
                      ))}
                    </div>

                    {/* Edit Role Modal */}
                    {showEditModal && selectedUser && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-50">
                          <h3 className="text-lg font-semibold mb-4">
                            Edit Role for {selectedUser.name}
                          </h3>
                          <div className="relative z-50">
                            <select
                              className="border border-gray-300 rounded px-3 py-2 w-full mb-4 relative z-50"
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                            >
                              <option value="admin">Admin</option>
                              <option value="viewer">Viewer</option>
                              <option value="creator">Creator</option>
                            </select>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={closeEditModal}
                              className="px-4 py-2 border rounded text-gray-600"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleRoleUpdate}
                              className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pagination */}
                    {filteredItems.length > 0 && <PaginationComponent />}
                  </>
                )}
              </>
            )}
          </div>
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

export default Users;
