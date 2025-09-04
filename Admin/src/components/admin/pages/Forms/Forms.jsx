import React, { useState, useEffect } from "react";
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  const itemsPerPage = 10;
  const token = localStorage.getItem("admin_token");
  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

  const navigate = useNavigate();

  const apiRequest = async (url, options = {}) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "API Error");
    return data;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`${API_URL}/api/forms/`);
      let data = Array.isArray(response.data) ? response.data : [];

      const role = localStorage.getItem("admin_role");
      const userId = localStorage.getItem("admin_id");

      if (role === "creator") {
        data = data.filter((f) => String(f.created_by) === String(userId));
      }

      setForms(data);
    } catch (err) {
      setError("Failed to fetch forms");
      toast.error("Failed to fetch forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = forms.filter((form) => {
    const title = form.title || "";
    const description = form.description || "";
    const createdBy = form.created_by || "";
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectItem = (id, checked) => {
    if (checked) setSelectedItems((prev) => [...prev, id]);
    else setSelectedItems((prev) => prev.filter((i) => i !== id));
  };

  const handleSelectAll = (checked) => {
    if (checked) setSelectedItems(currentItems.map((i) => i.id));
    else setSelectedItems([]);
  };

  const openImageModal = (imageUrl) => setModalImage(imageUrl);
  const closeImageModal = () => setModalImage(null);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Forms</h1>
          <p className="text-gray-500 text-sm">Manage all forms</p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, description, or created_by..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading forms...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500">
            {error}
            <button
              onClick={fetchData}
              className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && currentItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">No forms found</div>
        )}

        {/* Table Desktop */}
        {!loading && !error && currentItems.length > 0 && (
          <div className="hidden lg:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200 mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === currentItems.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Header Image</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentItems.map((form) => (
                  <tr key={form.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(form.id)}
                        onChange={(e) => handleSelectItem(form.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{form.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{form.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{form.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{form.created_by || "N/A"}</td>
                    <td className="px-6 py-4">
                      {form.header_image ? (
                        <img
                          src={`${API_URL}/uploads/${form.header_image}`}
                          alt="Header"
                          className="w-16 h-10 object-cover rounded cursor-pointer border border-gray-200"
                          onClick={() => openImageModal(`${API_URL}/uploads/${form.header_image}`)}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button onClick={() => navigate(`view/${form.id}`)}>
                        <Eye className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                      </button>
                      <button>
                        <Edit className="w-5 h-5 text-green-600 hover:text-green-800" />
                      </button>
                      <button>
                        <Trash2 className="w-5 h-5 text-red-600 hover:text-red-800" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {!loading && !error && currentItems.length > 0 && (
          <div className="lg:hidden space-y-4">
            {currentItems.map((form) => (
              <div key={form.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{form.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3">{form.description}</p>
                    <span className="text-gray-400 text-xs mt-1 block">Created by: {form.created_by || "N/A"}</span>
                  </div>
                  {form.header_image && (
                    <img
                      src={`${API_URL}/uploads/${form.header_image}`}
                      alt="Header"
                      className="w-20 h-12 object-cover rounded cursor-pointer border border-gray-200"
                      onClick={() => openImageModal(`${API_URL}/uploads/${form.header_image}`)}
                    />
                  )}
                </div>
                <div className="flex space-x-3 mt-2">
                  <button onClick={() => navigate(`view/${form.id}`)} className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button className="flex items-center space-x-1 text-green-600 hover:text-green-800 text-sm">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && currentItems.length > 0 && (
          <div className="flex justify-between items-center mt-4 px-4 sm:px-6 py-2 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length}
            </span>
            <div className="flex items-center space-x-1">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeImageModal}
          >
            <div className="relative max-w-3xl w-full">
              <img
                src={modalImage}
                alt="Full View"
                className="w-full h-auto rounded-xl shadow-2xl border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={closeImageModal}
                className="absolute top-2 right-2 bg-white text-gray-800 text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100 transition"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} theme="light" />
      </div>
    </div>
  );
};

export default Forms;
