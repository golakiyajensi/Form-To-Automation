import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ArrowLeft, User, Calendar, FileText } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const ViewResponse = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
  const token = localStorage.getItem("admin_token");

  const apiRequest = async (url, options = {}) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "API Error");
    return data;
  };

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        // Fetch the response
        const res = await apiRequest(
          `${API_URL}/api/form-responses/response/${responseId}`
        );
        const responseData = res.data;

        // Fetch form info
        const formRes = await apiRequest(
          `${API_URL}/api/forms/${responseData.form_id}`
        );
        setForm(formRes.data);

        // Fetch field labels for answers if missing
        const updatedAnswers = await Promise.all(
          responseData.answers.map(async (a) => {
            if (!a.label) {
              try {
                const fieldRes = await apiRequest(
                  `${API_URL}/api/forms-fields/field/${a.field_id}`
                );
                a.label = fieldRes.data?.label || `Field ${a.field_id}`;
                a.field_image = fieldRes.data?.field_image || null;
              } catch {
                a.label = `Field ${a.field_id}`;
              }
            }
            return a;
          })
        );

        setResponse({ ...responseData, answers: updatedAnswers });
      } catch (err) {
        toast.error("Failed to load response details");
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [responseId]);

  // Inside your component, before return statement
  const handleOpenPublicLink = async () => {
    if (!response || !response.form_id) return;

    try {
      const res = await apiRequest(
        `${API_URL}/api/forms/public/${response.form_id}`
      );

      console.log("Public Form Data:", res.data);
      toast.success("Public form data loaded!");

      // Navigate to the public form page
      if (res.data?.form?.share_url) {
        window.open(res.data.form.share_url, "_blank"); // Opens in a new tab
      }
    } catch (err) {
      console.error("Failed to fetch public form:", err);
      toast.error("Failed to load public form");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-3 text-gray-600">Loading Response...</p>
      </div>
    );

  if (!response)
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

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Floating Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 border transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="mx-auto w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {/* Form Title & Description */}
        {form && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-gray-700">{form.description}</p>
            )}
          </div>
        )}

        {/* Response Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Response {response.response_id}
          </h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
              <User className="w-4 h-4" />
              <span>{response.submitted_by || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
              <Calendar className="w-4 h-4" />
              <span>{new Date(response.created_at).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
              <FileText className="w-4 h-4" />
              <span>Form ID: {response.form_id}</span>
            </div>
          </div>
          {response.link && (
            <button
              onClick={handleOpenPublicLink}
              className="inline-block mt-3 text-blue-600 hover:underline text-sm"
            >
              Open Public Link
            </button>
          )}
        </div>

        {/* Answers Section */}
        <div className="space-y-5">
          {response.answers.map((a, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              {/* Question Label */}
              <p className="text-lg font-medium text-gray-800 mb-3">
                {a.label || `Field ${a.field_id}`}
              </p>

              {/* Answer */}
              {Array.isArray(a.value) ? (
                <div className="space-y-2">
                  {a.value.map((val, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 bg-white border rounded-lg text-gray-700"
                    >
                      {val}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-2 bg-white border rounded-lg text-gray-700">
                  {a.value || "-"}
                </div>
              )}

              {/* Optional Field Image */}
              {a.field_image && (
                <img
                  src={`${API_URL}/uploads/fields/${a.field_image}`}
                  alt="Field"
                  className="w-40 h-28 object-cover rounded mt-3 border"
                />
              )}  
            </div>
          ))}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default ViewResponse;
