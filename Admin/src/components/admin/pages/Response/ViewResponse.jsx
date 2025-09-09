import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ArrowLeft, User, Calendar, FileText, Download } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ViewResponse = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [formData, setFormData] = useState(null); // contains form, slides, unassignedFields
  const [fieldsMap, setFieldsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
  const token = localStorage.getItem("admin_token");

  const apiRequest = async (url, options = {}) => {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "API Error");
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch response
        const resResp = await apiRequest(`${API_URL}/api/form-responses/response/${responseId}`);
        const respData = resResp.data;

        // Fetch public form info
        const formRes = await apiRequest(`${API_URL}/api/forms/public/${respData.form_id}`);
        setFormData(formRes.data);

        // Map field info
        const fieldsRes = await apiRequest(`${API_URL}/api/forms-fields/${respData.form_id}`);
        if (fieldsRes.data) {
          const map = {};
          for (let f of fieldsRes.data) {
            map[f.field_id] = { label: f.label, field_image: f.field_image || null, slide_id: f.slide_id };
          }
          setFieldsMap(map);
        }

        setResponse(respData);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [responseId]);

  const isImageUrl = (val) =>
    typeof val === "string" &&
    (val.startsWith("data:image") || /\.(jpg|jpeg|png|gif|webp)$/i.test(val) || val.startsWith("http://") || val.startsWith("https://"));

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-3 text-gray-600">Loading Response...</p>
      </div>
    );

  if (!response || !formData)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 mb-4">No response found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );

  // Organize slides including unassigned fields
  const allSlides = [
    { slide_id: null, title: "", description: "", fields: formData.unassignedFields || [] },
    ...(formData.slides || [])
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

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Form Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{formData.form.title}</h1>
          {formData.form.description && <p className="text-gray-700">{formData.form.description}</p>}
        </div>

        {/* Response Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
            <User className="w-4 h-4" />
            <span>{response.submitted_by || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            <Calendar className="w-4 h-4" />
            <span>{new Date(response.created_at)?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
            <FileText className="w-4 h-4" />
            <span>Response ID: {response.response_id}</span>
          </div>
        </div>

        {/* Slides & Answers */}
        {allSlides.map((slide) => {
          // Match answers to fields in this slide
          const slideAnswers = slide.fields
            .map((f) => response.answers.find((ans) => ans.field_id === f.field_id))
            .filter(Boolean);

          if (!slideAnswers.length) return null;

          return (
            <div key={slide.slide_id || "unassigned"}>
              {slide.slide_id && (
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <h2 className="text-xl font-semibold text-purple-800">{slide.title}</h2>
                  {slide.description && <p className="text-purple-700">{slide.description}</p>}
                </div>
              )}

              <div className="space-y-4">
                {slideAnswers.map((ans) => {
                  const fieldMeta = fieldsMap[ans.field_id] || {};
                  return (
                    <div key={ans.field_id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
                      <p className="text-gray-700 font-medium">{fieldMeta.label || `Field ${ans.field_id}`}</p>
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
                              <p key={i} className="px-4 py-2 bg-white border rounded-lg text-gray-700">{val}</p>
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
                        <p className="text-gray-900 break-words">{ans.value}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default ViewResponse;
