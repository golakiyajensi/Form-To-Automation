import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../components/common/Pagination";
import "react-toastify/dist/ReactToastify.css";
import ActionButtons from "../../components/common/ActionButtons";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const token = localStorage.getItem("admin_token");
  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  // ✅ API helper
  const apiRequest = async (url, options = {}) => {
    try {
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
    } catch (err) {
      toast.error(err.message || "Something went wrong");
      throw err;
    }
  };

  // ✅ Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`${API_URL}/api/user/`);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Filter + Pagination
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u?.name?.toLowerCase().includes(term) ||
      u?.email?.toLowerCase().includes(term) ||
      u?.role?.toLowerCase().includes(term)
    );
  });

  const totalItems = filteredUsers.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  // ✅ Edit Modal Logic
  const openEditModal = (user) => {
    setSelectedUser(user);
    setRole(user.role);
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setSelectedUser(null);
    setRole("");
    setShowEditModal(false);
  };
  const handleRoleUpdate = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const res = await apiRequest(
        `${API_URL}/api/user/role/${selectedUser.user_id}`,
        {
          method: "PUT",
          body: JSON.stringify({ role }),
        }
      );
      if (res.status) {
        toast.success("User role updated successfully");
        fetchUsers();
        closeEditModal();
      }
    } catch {
      toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
      const res = await apiRequest(`${API_URL}/api/user/${id}`, {
        method: "DELETE",
      });
      if (res.status) {
        toast.success("User deleted successfully");
        fetchUsers();
      }
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* ✅ Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Users</h1>
            <p className="text-sm text-gray-500">
              Manage all registered users and their roles
            </p>
          </div>
          <div className="text-xs text-gray-500 flex flex-wrap gap-1">
            {pathParts.map((part, i) => (
              <span key={i}>
                {part.charAt(0).toUpperCase() + part.slice(1)}
                {i < pathParts.length - 1 && " / "}
              </span>
            ))}
          </div>
        </div>

        {/* ✅ Search */}
        <div className="p-3 sm:p-4 border rounded-lg bg-white mb-4 flex items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, email, or role..."
              className="pl-10 pr-4 py-2 w-full border rounded-full text-sm focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ✅ Loading */}
        {loading && (
          <div className="py-12 text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        )}

        {/* ✅ Users Table */}
        {!loading && (
          <div className="bg-white rounded-lg shadow border border-gray-200">
            {filteredUsers.length === 0 ? (
              <p className="py-12 text-center text-gray-500">No users found</p>
            ) : (
              <>
                {/* ✅ Responsive Table */}
                <div className="overflow-x-auto">
                  <table className="w-full hidden sm:table">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "ID",
                          "Name",
                          "Email",
                          "Role",
                          "Created",
                          "Updated",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-600"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentItems.map((u) => (
                        <tr key={u.user_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-bold text-gray-700">
                            {u.user_id}
                          </td>
                          <td className="px-6 py-4">{u.name}</td>
                          <td className="px-6 py-4">{u.email}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                u.role === "admin"
                                  ? "bg-red-100 text-red-700"
                                  : u.role === "viewer"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {formatDate(u.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            {formatDate(u.updated_at)}
                          </td>
                          <td className="px-6 py-4">
                            <ActionButtons
                              onEdit={() => openEditModal(u)}
                              onDelete={() => handleDelete(u.user_id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* ✅ Mobile List View */}
                  <div className="sm:hidden divide-y divide-gray-200">
                    {currentItems.map((u) => (
                      <div
                        key={u.user_id}
                        className="p-4 flex flex-col gap-2 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-800">
                            {u.name}
                          </span>
                          <ActionButtons
                            onEdit={() => openEditModal(u)}
                            onDelete={() => handleDelete(u.user_id)}
                          />
                        </div>
                        <p className="text-sm text-gray-600">{u.email}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              u.role === "admin"
                                ? "bg-red-100 text-red-700"
                                : u.role === "viewer"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {u.role}
                          </span>
                          <span>{formatDate(u.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ✅ Pagination */}
                <div className="p-4 border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(n) => {
                      setItemsPerPage(n);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ✅ Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Edit Role</h3>
              <p className="text-sm text-gray-500">
                Update role for <b>{selectedUser.name}</b>
              </p>
            </div>
            <div className="p-6">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
                <option value="creator">Creator</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 p-4 border-t">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Users;
