import React, { useState, useEffect } from "react";
import { FiBox, FiUserCheck, FiUsers, FiRefreshCw } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { jwtDecode } from "jwt-decode"; // correct import for v4+

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [formsCount, setFormsCount] = useState(0);
  const [slidesCount, setSlidesCount] = useState(0);
  const [responsesCount, setResponsesCount] = useState(0);
  const [formsData, setFormsData] = useState([]); // 🔹 store forms for filtering
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
  const adminToken = localStorage.getItem("admin_token");

  // 🔹 decode role + userId
  let role = null;
  let userId = null;
  if (adminToken) {
    try {
      const decoded = jwtDecode(adminToken);
      role = decoded?.role;
      userId = decoded?.userId;
    } catch (e) {
      console.error("Token decode error:", e);
    }
  }

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchUsers = async (headers) => {
    if (role !== "admin") return; // 👈 only admin
    const res = await fetch(`${API_URL}/api/user/`, { headers });
    if (!res.ok) throw new Error("Users API failed");
    const data = await res.json();
    setUsersCount(data?.data?.length || 0);
  };

  const fetchForms = async (headers) => {
    const res = await fetch(`${API_URL}/api/forms/`, { headers });
    if (!res.ok) throw new Error("Forms API failed");
    const data = await res.json();

    if (role === "creator") {
      const myForms = data?.data?.filter((f) => f.created_by === userId) || [];
      setFormsData(myForms);
      setFormsCount(myForms.length);
    } else {
      setFormsData(data?.data || []);
      setFormsCount(data?.data?.length || 0);
    }
  };

  const fetchSlides = async (headers) => {
    const res = await fetch(`${API_URL}/api/slide/slides`, { headers });
    if (!res.ok) throw new Error("Slides API failed");
    const data = await res.json();
    if (role === "creator") {
      const myslide = data?.data?.filter((f) => f.created_by === userId) || [];
      setSlidesCount(myslide.length);
    } else {
      setSlidesCount(data?.data?.length || 0);
    }
  };

  const fetchResponses = async (headers) => {
  const res = await fetch(`${API_URL}/api/form-responses/all`, { headers });
  if (!res.ok) throw new Error("Responses API failed");
  const data = await res.json();

  if (role === "creator") {
    // Pela creator na forms ni id leva
    const resForms = await fetch(`${API_URL}/api/forms/`, { headers });
    const formsData = await resForms.json();
    const myForms = formsData?.data?.filter(f => f.created_by === userId) || [];
    const myFormIds = myForms.map(f => f.form_id);

    // Responses filter kariye only aa forms na
    const myResponses = data?.data?.filter(r => myFormIds.includes(r.form_id)) || [];
    setResponsesCount(myResponses.length);
  } else {
    setResponsesCount(data?.data?.length || 0);
  }
};


  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!adminToken) throw new Error("Authentication token not found.");

      const headers = getAuthHeaders();

      // 🔹 fetch forms first so we can filter responses correctly
      await fetchForms(headers);
      await Promise.all([fetchUsers(headers), fetchSlides(headers)]);
      await fetchResponses(headers);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare chart data (only counts that exist for the role)
  const chartData = [];
  if (role === "admin") {
    chartData.push({ name: "Users", value: usersCount });
  }
  chartData.push(
    { name: "Forms", value: formsCount },
    { name: "Slides", value: slidesCount },
    { name: "Responses", value: responsesCount }
  );

  const COLORS = ["#3B82F6", "#10B981", "#6366F1", "#8B5CF6"];

  return (
    <div className="space-y-6 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="md:flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            {role === "admin"
              ? "Overview of Users, Forms, Slides & Responses"
              : "Overview of your Forms, Slides & Responses"}
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2 disabled:opacity-50"
        >
          <FiRefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users → only for admin */}
        {role === "admin" && (
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-600 text-sm">Users</h3>
                <p className="text-3xl font-bold mt-2 text-blue-600">
                  {isLoading ? "..." : usersCount}
                </p>
              </div>
              <FiUsers className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        )}

        {/* Forms */}
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 text-sm">Forms</h3>
              <p className="text-3xl font-bold mt-2 text-green-600">
                {isLoading ? "..." : formsCount}
              </p>
            </div>
            <FiBox className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Slides */}
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 text-sm">Slides</h3>
              <p className="text-3xl font-bold mt-2 text-indigo-600">
                {isLoading ? "..." : slidesCount}
              </p>
            </div>
            <FiBox className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        {/* Responses */}
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 text-sm">Responses</h3>
              <p className="text-3xl font-bold mt-2 text-purple-600">
                {isLoading ? "..." : responsesCount}
              </p>
            </div>
            <FiUserCheck className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Graph Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-4">Statistics Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-4">Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
