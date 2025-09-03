import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  const itemsPerPage = 10;
  const token = localStorage?.getItem("admin_token");
  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  const openImageModal = (imageUrl) => setModalImage(imageUrl);
  const closeImageModal = () => setModalImage(null);

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

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`${API_URL}/api/forms/`);
      setForms(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Failed to fetch forms");
      toast.error("Failed to fetch forms");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = forms.filter((form) => {
    const title = form?.title || "";
    const description = form?.description || "";
    const createdBy = form?.created_by?.toString() || "";
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Mobile Card Component
  const MobileCard = ({ form }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-gray-900 font-medium text-sm">{form.title}</h3>
          <p className="text-gray-500 text-xs line-clamp-2">
            {form.description}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            <span className="font-semibold">Created By:</span>{" "}
            {form.created_by || "N/A"}
          </p>
        </div>
        {form.header_image && (
          <img
            src={`${API_URL}/uploads/${form.header_image}`}
            alt="Header"
            className="w-16 h-10 object-cover rounded cursor-pointer"
            onClick={() =>
              openImageModal(`${API_URL}/uploads/${form.header_image}`)
            }
          />
        )}
      </div>
    </div>
  );

  // Pagination Component
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
                onClick={() =>
                  typeof page === "number" && setCurrentPage(page)
                }
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
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-700">
              FORMS
            </h1>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              {pathParts.map((part, index) => (
                <span key={index}>
                  {part.charAt(0).toUpperCase() + part.slice(1)}
                  {index < pathParts.length - 1 && <span className="mx-2">/</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by title, description, or created_by..."
                className="pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
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
        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No forms found</p>
          </div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Header Image
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-bold text-gray-700">
                        {form.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-600">
                        {form.title}
                      </td>
                      <td className="px-6 py-4">{form.description}</td>
                      <td className="px-6 py-4">{form.created_by || "N/A"}</td>
                      <td className="px-6 py-4">
                        {form.header_image ? (
                          <img
                            src={`${API_URL}/uploads/${form.header_image}`}
                            alt="Header"
                            className="w-16 h-10 object-cover rounded cursor-pointer"
                            onClick={() =>
                              openImageModal(`${API_URL}/uploads/${form.header_image}`)
                            }
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {currentItems.map((form) => (
                <MobileCard key={form.id} form={form} />
              ))}
            </div>

            {/* Pagination */}
            <PaginationComponent />
          </>
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
                className="w-full h-auto rounded-lg shadow-2xl border border-gray-200"
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
      </div>
    </div>
  );
};

export default Forms;
