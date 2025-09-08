import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  ClipboardList,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ViewFormResponse = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [fieldsMap, setFieldsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch form info
        const formRes = await fetch(`${API_URL}/api/forms/${formId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const formData = await formRes.json();
        if (!formRes.ok)
          throw new Error(formData.message || "Failed to fetch form");
        setForm(formData.data);

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
        const responsesData = await responsesRes.json();
        if (!responsesRes.ok)
          throw new Error(responsesData.message || "Failed to fetch responses");
        setResponses(responsesData.data || []);

        // Fetch all field labels for this form
        const fieldMap = {};
        for (let res of responsesData.data) {
          for (let ans of res.answers) {
            if (!fieldMap[ans.field_id]) {
              const fieldRes = await fetch(
                `${API_URL}/api/forms-fields/field/${ans.field_id}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                  },
                }
              );
              const fieldData = await fieldRes.json();
              if (fieldRes.ok && fieldData.data) {
                fieldMap[ans.field_id] = fieldData.data.label;
              } else {
                fieldMap[ans.field_id] = `Field ${ans.field_id}`;
              }
            }
          }
        }
        setFieldsMap(fieldMap);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId, API_URL, token]);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-3 text-gray-600">Loading form and responses...</p>
      </div>
    );
  }

  if (error) {
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
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 border border-gray-200 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="mx-auto max-w-4xl space-y-8">
        {/* Form Details */}
        {form && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {form.title}
            </h1>
            <p className="text-gray-700">{form.description}</p>
          </div>
        )}

        {/* Responses */}
        {responses.length === 0 ? (
          <p className="text-gray-500">No responses found for this form.</p>
        ) : (
          responses.map((res) => (
            <div
              key={res.response_id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <User className="w-4 h-4" />
                  <span>{res.submitted_by || "Anonymous"}</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {res.created_at
                      ? new Date(res.created_at).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                  <ClipboardList className="w-4 h-4" />
                  <span>Response ID: {res.response_id}</span>
                </div>
              </div>

              {/* Answers */}
              <div className="p-6 space-y-4">
                {res.answers?.map((ans, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center gap-3"
                  >
                    <FileText className="w-5 h-5 text-gray-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-700 font-medium">
                        {fieldsMap[ans.field_id] || `Field ${ans.field_id}`}
                      </p>
                      <p className="text-gray-900 break-words">
                         {Array.isArray(ans.value) ? ans.value.join(", ") : ans.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default ViewFormResponse;
