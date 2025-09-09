import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../components/common/Pagination";
import "react-toastify/dist/ReactToastify.css";
import ActionButtons from "../../components/common/ActionButtons";

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const token = localStorage.getItem("admin_token");
  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
  const navigate = useNavigate();

  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  // -----------------------------
  // Reusable API request function
  // -----------------------------
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

  // -----------------------------
  // Fetch forms
  // -----------------------------
  const fetchForms = async () => {
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
    fetchForms();
  }, []);

  // -----------------------------
  // Delete form
  // -----------------------------
  const handleDelete = async (formId) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;

    try {
      setLoading(true);
      await apiRequest(`${API_URL}/api/forms/${formId}`, { method: "DELETE" });

      toast.success("Form deleted successfully");

      setForms((prev) => prev.filter((form) => form.id !== formId));
      setSelectedItems((prev) => prev.filter((id) => id !== formId));
    } catch (err) {
      toast.error(err.message || "Failed to delete form");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Filter & Pagination
  // -----------------------------
  const filteredForms = forms.filter(({ title, description, created_by }) => {
    const search = searchTerm.toLowerCase();
    const titleStr = title ? title.toString().toLowerCase() : "";
    const descriptionStr = description
      ? description.toString().toLowerCase()
      : "";
    const createdByStr = created_by ? created_by.toString().toLowerCase() : "";

    return (
      titleStr.includes(search) ||
      descriptionStr.includes(search) ||
      createdByStr.includes(search)
    );
  });

  const totalItems = filteredForms.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredForms.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // -----------------------------
  // Modal handlers
  // -----------------------------

  const openImageModal = (url) => setModalImage(url);
  const closeImageModal = () => setModalImage(null);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Forms</h1>
            <p className="text-gray-500 text-sm">Manage all forms</p>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            {pathParts.map((part, index) => (
              <span key={index}>
                {part.charAt(0).toUpperCase() + part.slice(1)}
                {index < pathParts.length - 1 && (
                  <span className="mx-2">/</span>
                )}
              </span>
            ))}
          </div>
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
              onClick={fetchForms}
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
                  {[
                    "ID",
                    "Title",
                    "Description",
                    "Created By",
                    "Header Image",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentItems.map((form) => (
                  <tr key={form.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {form.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {form.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {form.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {form.created_by || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {form.header_image ? (
                        <img
                          src={`${API_URL}/uploads/${form.header_image}`}
                          alt="Header"
                          className="w-16 h-10 object-cover rounded cursor-pointer border border-gray-200"
                          onClick={() =>
                            openImageModal(
                              `${API_URL}/uploads/${form.header_image}`
                            )
                          }
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <ActionButtons
                        onView={() => navigate(`view/${form.id}`)}
                        onEdit={() => navigate(`edit/${form.id}`)}
                        onDelete={() => handleDelete(form.id)}
                      />
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
              <div
                key={form.id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                      {form.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3">
                      {form.description}
                    </p>
                    <span className="text-gray-400 text-xs mt-1 block">
                      Created by: {form.created_by || "N/A"}
                    </span>
                  </div>
                  {form.header_image && (
                    <img
                      src={`${API_URL}/uploads/${form.header_image}`}
                      alt="Header"
                      className="w-20 h-12 object-cover rounded cursor-pointer border border-gray-200"
                      onClick={() =>
                        openImageModal(
                          `${API_URL}/uploads/${form.header_image}`
                        )
                      }
                    />
                  )}
                </div>
                <div className="flex space-x-3 mt-2">
                  <ActionButtons
                    onView={() => navigate(`view/${form.id}`)}
                    onEdit={() => navigate(`edit/${form.id}`)}
                    onDelete={() => handleDelete(form.id)}
                    showLabels={true}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(n) => {
              setItemsPerPage(n);
              setCurrentPage(1); // reset to page 1 when perPage changes
            }}
          />
        </div>

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
