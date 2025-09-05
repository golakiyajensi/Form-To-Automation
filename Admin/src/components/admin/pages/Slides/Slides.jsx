import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Slides = () => {
  const [slides, setSlides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  const itemsPerPage = 10;
  const token = localStorage.getItem("admin_token");
  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  const openImageModal = (url) => setModalImage(url);
  const closeImageModal = () => setModalImage(null);

  const navigate = useNavigate();
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

  const fetchSlides = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(`${API_URL}/api/slide/slides`);
      let data = Array.isArray(response.data) ? response.data : [];

      console.log("Fetched slides:", data);

      // ✅ Role-based filtering
      const role = localStorage.getItem("admin_role"); // e.g., 'creator' or 'admin'
      const userId = localStorage.getItem("admin_id"); // current user's ID

      if (role === "creator") {
        data = data.filter(
          (form) => String(form.created_by) === String(userId)
        );
      }

      // If role is admin, show all slides (no filter)

      setSlides(data);
    } catch (err) {
      setError("Failed to fetch slides");
      toast.error("Failed to fetch slides");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (slideId) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/slide/slides/${slideId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete slide");

      toast.success("Slide deleted successfully");

      // Remove deleted slide from state
      setSlides((prev) => prev.filter((slide) => slide.slide_id !== slideId));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) setSelectedItems(currentItems.map((item) => item.slide_id));
    else setSelectedItems([]);
  };

  const handleSelectItem = (id, checked) => {
    if (checked) setSelectedItems((prev) => [...prev, id]);
    else setSelectedItems((prev) => prev.filter((i) => i !== id));
  };

  const filteredItems = slides.filter((slide) => {
    const formTitle = slide?.form_title || "";
    const slideTitle = slide?.slide_title || "";
    const slideDesc = slide?.slide_description || "";
    return (
      formTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slideTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slideDesc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const PaginationComponent = () => {
    const getVisiblePages = () => {
      const delta = 2;
      const pages = [];
      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);
      pages.push(1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++)
        if (i !== 1 && i !== totalPages) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      if (totalPages > 1) pages.push(totalPages);
      return pages;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 px-4 sm:px-6 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredItems.length)} of{" "}
          {filteredItems.length} slides
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="hidden sm:flex items-center space-x-1">
            {getVisiblePages().map((page, idx) => (
              <button
                key={idx}
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

  const MobileCard = ({ slide, index }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-gray-900 font-medium text-sm">
            {slide.slide_title}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2">
            {slide.slide_description}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            <span className="font-semibold">Form:</span>{" "}
            {slide.form_title || "N/A"}
          </p>
        </div>
        {slide.header_image && (
          <img
            src={`${API_URL}/uploads/${slide.header_image}`}
            alt="Header"
            className="w-16 h-10 object-cover rounded cursor-pointer"
            onClick={() =>
              openImageModal(`${API_URL}/uploads/${slide.header_image}`)
            }
          />
        )}
      </div>
      <div className="mt-2 flex space-x-3 text-sm">
        <button
          className="flex items-center space-x-1 text-blue-500 hover:underline"
          onClick={() =>
            navigate(`/admin/dashboard/slides/view/${slide.slide_id}`)
          }
        >
          <Eye className="w-4 h-4" /> <span>View</span>
        </button>
        <button
          className="flex items-center space-x-1 text-green-500 hover:underline"
          onClick={() =>
            navigate(
              `/admin/dashboard/slides/edit/${slide.slide_id}/${slide.form_id}`
            )
          }
        >
          <Edit className="w-4 h-4" /> <span>Edit</span>
        </button>
        <button
          className="flex items-center space-x-1 text-red-500 hover:underline"
          onClick={() => handleDelete(slide.slide_id)}
        >
          <Trash2 className="w-4 h-4" /> <span>Delete</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Slides</h1>
              <p className="text-gray-500 text-sm">Manage all Slides</p>
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

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4 sm:p-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search by form or slide title..."
              className="pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Loading/Error/Empty */}
        {loading && <div className="text-center py-12">Loading...</div>}
        {error && <div className="text-center py-12">{error}</div>}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-12">No slides found</div>
        )}

        {/* Desktop Table */}
        {!loading && !error && filteredItems.length > 0 && (
          <>
            <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        checked={selectedItems.length === currentItems.length}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Slide ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Form Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Slide Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Slide Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Header Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((slide, idx) => (
                    <tr key={slide.slide_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedItems.includes(slide.slide_id)}
                          onChange={(e) =>
                            handleSelectItem(slide.slide_id, e.target.checked)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {slide.slide_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {slide.form_title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {slide.slide_title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {slide.slide_description}
                      </td>
                      <td className="px-6 py-4">
                        {slide.header_image ? (
                          <img
                            src={`${API_URL}/uploads/${slide.header_image}`}
                            alt="Header"
                            className="w-16 h-10 object-cover rounded cursor-pointer"
                            onClick={() =>
                              openImageModal(
                                `${API_URL}/uploads/${slide.header_image}`
                              )
                            }
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() =>
                            navigate(
                              `/admin/dashboard/slides/view/${slide.slide_id}`
                            )
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={() =>
                            navigate(
                              `/admin/dashboard/slides/edit/${slide.slide_id}/${slide.form_id}`
                            )
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(slide.slide_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {currentItems.map((slide, idx) => (
                <MobileCard key={slide.slide_id} slide={slide} index={idx} />
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

        <ToastContainer position="top-right" autoClose={3000} theme="light" />
      </div>
    </div>
  );
};

export default Slides;
