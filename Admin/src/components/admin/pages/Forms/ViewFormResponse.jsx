import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  ArrowLeft,
  User,
  Calendar,
  ClipboardList,
  Download,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ViewFormResponse = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [responses, setResponses] = useState([]);
  const [fieldsMap, setFieldsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch form data
        const formRes = await fetch(`${API_URL}/api/forms/public/${formId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const formJson = await formRes.json();
        if (!formRes.ok)
          throw new Error(formJson.message || "Failed to fetch form");
        setFormData(formJson.data);

        // Fetch responses
        const responsesRes = await fetch(
          `${API_URL}/api/form-responses/${formId}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        const responsesJson = await responsesRes.json();
        if (!responsesRes.ok)
          throw new Error(responsesJson.message || "Failed to fetch responses");
        setResponses(responsesJson.data || []);

        // Fetch fields map
        const fieldsRes = await fetch(`${API_URL}/api/forms-fields/${formId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const fieldsJson = await fieldsRes.json();
        if (fieldsRes.ok && fieldsJson.data) {
          const map = {};
          fieldsJson.data.forEach((f) => {
            map[f.field_id] = {
              label: f.label,
              field_image: f.field_image || null,
              slide_id: f.slide_id,
            };
          });
          setFieldsMap(map);
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId, API_URL, token]);

  const handleDownload = async (type) => {
    try {
      const url = `${API_URL}/api/form-responses/export/${type}/${formId}`;
      const res = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error("Failed to download file");

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${formData.form.title}.${type}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success(`${type.toUpperCase()} downloaded successfully`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const isImageUrl = (val) =>
    typeof val === "string" &&
    (val.startsWith("data:image") ||
      /\.(jpg|jpeg|png|gif|webp)$/i.test(val) ||
      val.startsWith("http://") ||
      val.startsWith("https://"));

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-3 text-gray-600">Loading form and responses...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );

  if (!formData) return null;

  const currentResponse = responses[currentIndex];

  // Organize slides: unassigned fields first as pseudo-slide
  const allSlides = [
    ...(formData.unassignedFields?.length > 0
      ? [
          {
            slide_id: null,
            title: "",
            description: "",
            fields: formData.unassignedFields,
          },
        ]
      : []),
    ...(formData.slides || []),
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="mx-auto max-w-4xl space-y-8">
        {/* Form Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {formData.form.title}
          </h1>
          <p className="text-gray-700">{formData.form.description}</p>
        </div>

        {/* Current Response */}
        {responses.length === 0 ? (
          <p className="text-gray-500">No responses found for this form.</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                <User className="w-4 h-4" />
                <span>{currentResponse.submitted_by || "Anonymous"}</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <Calendar className="w-4 h-4" />
                <span>
                  {currentResponse.created_at
                    ? new Date(currentResponse.created_at).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                <ClipboardList className="w-4 h-4" />
                <span>Response ID: {currentResponse.response_id}</span>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {allSlides.map((slide) => {
                const slideFields = slide.fields
                  .map((f) =>
                    currentResponse.answers?.find(
                      (ans) => ans.field_id === f.field_id
                    )
                  )
                  .filter(Boolean);

                if (!slideFields.length) return null;

                return (
                  <div key={slide.slide_id || `unassigned-${Math.random()}`}>
                    {/* Only show slide title if exists */}
                    {slide.title && (
                      <div className="bg-purple-50 p-4 rounded-lg mb-4">
                        <h2 className="text-xl font-semibold text-purple-800">
                          {slide.title}
                        </h2>
                        {slide.description && (
                          <p className="text-purple-700">{slide.description}</p>
                        )}
                      </div>
                    )}

                    {/* Slide fields */}
                    <div className="space-y-4">
                      {slideFields.map((ans) => {
                        const fieldMeta = fieldsMap[ans.field_id] || {};
                        return (
                          <div
                            key={ans.field_id}
                            className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-3"
                          >
                            <p className="text-gray-700 font-medium">
                              {fieldMeta.label || `Field ${ans.field_id}`}
                            </p>
                            {fieldMeta.field_image && (
                              <img
                                src={`${API_URL}/uploads/fields/${fieldMeta.field_image}`}
                                alt="Field"
                                className="w-40 h-28 object-cover rounded border"
                              />
                            )}
                            {Array.isArray(ans.value) ? (
                              <div className="space-y-2">
                                {ans.value.map((val, i) =>
                                  isImageUrl(val) ? (
                                    <img
                                      key={i}
                                      src={val}
                                      alt={`Uploaded-${i}`}
                                      className="mt-2 max-h-48 rounded-lg border border-gray-300 object-contain"
                                    />
                                  ) : (
                                    <p
                                      key={i}
                                      className="px-4 py-2 bg-white border rounded-lg text-gray-700"
                                    >
                                      {val}
                                    </p>
                                  )
                                )}
                              </div>
                            ) : isImageUrl(ans.value) ? (
                              <img
                                src={ans.value}
                                alt="Uploaded"
                                className="mt-2 max-h-48 rounded-lg border border-gray-300 object-contain"
                              />
                            ) : (
                              <p className="text-gray-900 break-words">
                                {ans.value}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {responses.length > 1 && (
          <div className="flex justify-between pt-6">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              className={`px-6 py-2 rounded-full transition ${
                currentIndex === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Back
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(prev + 1, responses.length - 1)
                )
              }
              disabled={currentIndex === responses.length - 1}
              className={`px-6 py-2 rounded-full transition ${
                currentIndex === responses.length - 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Download Buttons */}
        {responses.length > 0 && (
          <div className="flex justify-center gap-4 pt-6">
            <button
              onClick={() => handleDownload("csv")}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Download className="w-5 h-5" /> Download CSV
            </button>
            <button
              onClick={() => handleDownload("pdf")}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Download className="w-5 h-5" /> Download PDF
            </button>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default ViewFormResponse;
