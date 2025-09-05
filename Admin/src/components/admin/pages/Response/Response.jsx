import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Eye, Edit, Trash2, Search } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const FormResponses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  const itemsPerPage = 10;
  const token = localStorage.getItem("admin_token");
  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

  const navigate = useNavigate();

  const fetchResponses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/form-responses/all`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setResponses(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError("Failed to fetch responses");
      toast.error("Failed to fetch responses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  // Selection
  const handleSelectAll = (checked) => {
    if (checked) setSelectedItems(currentItems.map((r) => r.response_id));
    else setSelectedItems([]);
  };
  const handleSelectItem = (id, checked) => {
    if (checked) setSelectedItems((prev) => [...prev, id]);
    else setSelectedItems((prev) => prev.filter((i) => i !== id));
  };

  const filteredResponses = responses.filter((resp) => {
    const search = searchTerm.toLowerCase();

    const submittedBy = (resp.submitted_by || "Anonymous")
      .toString()
      .toLowerCase();

    const formId = resp.form_id ? resp.form_id.toString().toLowerCase() : "";
    const responseId = resp.response_id
      ? resp.response_id.toString().toLowerCase()
      : "";

    // ✅ Normalize all answers into one string
    const answersText = (resp.answers || [])
      .map((a) => {
        if (!a || a.value == null) return "";
        if (Array.isArray(a.value)) {
          return a.value.join(" ");
        }
        return a.value.toString();
      })
      .join(" ")
      .toLowerCase();

    return (
      submittedBy.includes(search) ||
      formId.includes(search) ||
      responseId.includes(search) ||
      answersText.includes(search)
    );
  });

  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredResponses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const Pagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 border-t border-gray-200 space-y-2 sm:space-y-0">
        <span className="text-sm text-gray-500">
          {window.innerWidth >= 640
            ? `Showing ${startIndex + 1} to ${Math.min(
                startIndex + itemsPerPage,
                filteredResponses.length
              )} of ${filteredResponses.length} responses`
            : `Page ${currentPage} / ${totalPages}`}
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div className="hidden sm:flex items-center space-x-1">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const MobileCard = ({ resp }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-900 font-medium text-sm">
            <strong>Response ID:</strong> {resp.response_id}
          </p>
          <p className="text-gray-700 text-xs">
            <strong>Form ID:</strong> {resp.form_id}
          </p>
          <p className="text-gray-700 text-xs">
            <strong>Submitted By:</strong> {resp.submitted_by || "Anonymous"}
          </p>
          <p className="text-gray-700 text-xs">
            <strong>Date:</strong> {new Date(resp.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2 mt-1">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() =>
              navigate(
                `/admin/dashboard/form-responses/response/${resp.response_id}`
              )
            }
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="text-red-500 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-gray-700 text-xs mt-2">
        <strong>Answers:</strong>
        {resp.answers.map((a, idx) => (
          <div key={idx}>
            Field {a.field_id}:{" "}
            {Array.isArray(a.value) ? a.value.join(", ") : a.value}
          </div>
        ))}
      </div>
      {resp.link && (
        <a
          href={resp.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-xs mt-2 inline-block hover:underline"
        >
          View Response Link
        </a>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Response</h1>
              <p className="text-gray-500 text-sm">Manage all Response</p>
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
              placeholder="Search by response..."
              className="pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {loading && <div className="text-center py-12">Loading...</div>}
        {error && (
          <div className="text-center py-12 text-red-500">
            {error}
            <button
              onClick={fetchResponses}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && currentItems.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow border border-gray-200 mb-4">
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
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                      Response ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                      Form ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                      Answers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((resp) => (
                    <tr key={resp.response_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedItems.includes(resp.response_id)}
                          onChange={(e) =>
                            handleSelectItem(resp.response_id, e.target.checked)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {resp.response_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {resp.form_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {resp.submitted_by || "Anonymous"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(resp.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {resp.answers.map((a, idx) => (
                          <div key={idx}>
                            Field {a.field_id}:{" "}
                            {Array.isArray(a.value)
                              ? a.value.join(", ")
                              : a.value}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() =>
                            navigate(
                              `/admin/dashboard/form-responses/response/${resp.response_id}`
                            )
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
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
              {currentItems.map((resp) => (
                <MobileCard key={resp.response_id} resp={resp} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination />
          </>
        )}

        {!loading && !error && currentItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No responses found
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default FormResponses;
