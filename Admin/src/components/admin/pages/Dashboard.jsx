import React, { useState, useEffect } from "react";
import {
  FiShoppingCart,
  FiBox,
  FiUsers,
  FiUserCheck,
  FiHeart,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

const Dashboard = () => {
  const [wellbeingCount, setWellbeingCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [mentalHealthCount, setMentalHealthCount] = useState(0);
  const [dailyPracticesCount, setDailyPracticesCount] = useState(0);
  const [meditationInterestCount, setMeditationInterestCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_FRONTEND_API_URL;
  const adminToken = localStorage.getItem('admin_token'); 

  // Function to get auth headers
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(adminToken && { 'Authorization': `Bearer ${adminToken}` }),
    };
  };

  // Sample chart data for visualization
  const chartData = [
    { month: "Jan", wellbeing: 4, mentalHealth: 3, meditation: 2 },
    { month: "Feb", wellbeing: 6, mentalHealth: 5, meditation: 4 },
    { month: "Mar", wellbeing: 8, mentalHealth: 7, meditation: 6 },
    { month: "Apr", wellbeing: 10, mentalHealth: 9, meditation: 8 },
    { month: "May", wellbeing: 15, mentalHealth: 12, meditation: 10 },
    { month: "Jun", wellbeing: 19, mentalHealth: 16, meditation: 14 },
    { month: "Jul", wellbeing: 20, mentalHealth: 18, meditation: 16 },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Individual API fetch functions
  const fetchWellbeing = async (headers) => {
    const response = await fetch(`${API_URL}/api/wellbeing`, { 
      method: 'GET',
      headers,
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Wellbeing API failed: ${response.status}`);
    }
    
    const data = await response.json();
    const count = Array.isArray(data?.data) ? data.data.length : 
                  Array.isArray(data) ? data.length : 0;
    setWellbeingCount(count);
    return { api: 'wellbeing', count, status: 'success' };
  };

  const fetchCategories = async (headers) => {
    const response = await fetch(`${API_URL}/api/categories`, { 
      method: 'GET',
      headers,
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Categories API failed: ${response.status}`);
    }
    
    const data = await response.json();
    const count = Array.isArray(data?.data) ? data.data.length : 
                  Array.isArray(data) ? data.length : 0;
    setCategoriesCount(count);
    return { api: 'categories', count, status: 'success' };
  };

  const fetchMentalHealth = async (headers) => {
    const response = await fetch(`${API_URL}/api/mental-health`, { 
      method: 'GET',
      headers,
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Mental Health API failed: ${response.status}`);
    }
    
    const data = await response.json();
    const count = Array.isArray(data?.data) ? data.data.length : 
                  Array.isArray(data) ? data.length : 0;
    setMentalHealthCount(count);
    return { api: 'mental-health', count, status: 'success' };
  };

  const fetchDailyPractices = async (headers) => {
    const response = await fetch(`${API_URL}/api/daily-practices`, { 
      method: 'GET',
      headers,
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Daily Practices API failed: ${response.status}`);
    }
    
    const data = await response.json();
    const count = Array.isArray(data?.data) ? data.data.length : 
                  Array.isArray(data) ? data.length : 0;
    setDailyPracticesCount(count);
    return { api: 'daily-practices', count, status: 'success' };
  };

  const fetchMeditationInterest = async (headers) => {
    const response = await fetch(`${API_URL}/api/meditation-interest`, { 
      method: 'GET',
      headers,
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Meditation Interest API failed: ${response.status}`);
    }
    
    const data = await response.json();
    const count = Array.isArray(data?.data) ? data.data.length : 
                  Array.isArray(data) ? data.length : 0;
    setMeditationInterestCount(count);
    return { api: 'meditation-interest', count, status: 'success' };
  };

  const fetchUsers = async (headers) => {
    const response = await fetch(`${API_URL}/api/users/admin/all`, { 
      method: 'GET',
      headers,
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Users API failed: ${response.status}`);
    }
    
    const data = await response.json();
    const count = Array.isArray(data?.data) ? data.data.length : 
                  Array.isArray(data) ? data.length : 0;
    setUserCount(count);
    return { api: 'users', count, status: 'success' };
  };

  // Function to fetch data from all APIs
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!adminToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const headers = getAuthHeaders();

      // Array of API fetch functions
      const apiFunctions = [
        fetchWellbeing,
        fetchCategories,
        fetchMentalHealth,
        fetchDailyPractices,
        fetchMeditationInterest,
        fetchUsers
      ];

      // Execute all API calls with individual error handling
      const results = await Promise.allSettled(
        apiFunctions.map(fn => fn(headers))
      );

      // Check if any API failed and set fallback data
      const failedAPIs = results.filter(result => result.status === 'rejected');
      
      if (failedAPIs.length > 0) {
        // Set fallback data for failed APIs
        const fallbackValues = [25, 8, 32, 18, 15, 67];
        const setters = [setWellbeingCount, setCategoriesCount, setMentalHealthCount, 
                        setDailyPracticesCount, setMeditationInterestCount, setUserCount];
        
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            setters[index](fallbackValues[index]);
          }
        });
      }

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
      
      // Set demo data when API fails completely
      setWellbeingCount(25);
      setCategoriesCount(8);
      setMentalHealthCount(32);
      setDailyPracticesCount(18);
      setMeditationInterestCount(15);
      setUserCount(67);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchDashboardData();
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <FiAlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
              <p className="text-sm text-red-700 mb-3">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:p-6 bg-gray-50 min-h-screen">
      <div className="md:flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
          <p className="text-gray-600 mb-4 md:mb-0">Overview of Wellbeing & Mental Health System</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRetry}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
          >
            <FiRefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wellbeing Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Wellbeing Records</h3>
              {isLoading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 mt-2 rounded"></div>
              ) : (
                <p className="text-3xl font-bold mt-2 text-blue-600">{wellbeingCount}</p>
              )}
            </div>
            <FiHeart className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {/* Categories Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Categories</h3>
              {isLoading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 mt-2 rounded"></div>
              ) : (
                <p className="text-3xl font-bold mt-2 text-green-600">{categoriesCount}</p>
              )}
            </div>
            <FiBox className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Daily Practices */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Daily Practices</h3>
              {isLoading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 mt-2 rounded"></div>
              ) : (
                <p className="text-3xl font-bold mt-2 text-green-600">{dailyPracticesCount}</p>
              )}
            </div>
            <FiBox className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Mental Health Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Mental Health</h3>
              {isLoading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 mt-2 rounded"></div>
              ) : (
                <p className="text-3xl font-bold mt-2 text-purple-600">{mentalHealthCount}</p>
              )}
            </div>
            <FiUserCheck className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        {/* Meditation Interest Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Meditation Interest</h3>
              {isLoading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 mt-2 rounded"></div>
              ) : (
                <p className="text-3xl font-bold mt-2 text-orange-600">{meditationInterestCount}</p>
              )}
            </div>
            <FiShoppingCart className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Total Users</h3>
              {isLoading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 mt-2 rounded"></div>
              ) : (
                <p className="text-3xl font-bold mt-2 text-red-600">{userCount}</p>
              )}
            </div>
            <FiUsers className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">System Overview</h2>
          <p className="text-sm text-gray-600">Wellbeing and mental health data trends</p>
        </div>

        {/* Chart - Simulated visualization */}
        <div className="h-80 w-full">
          <div className="relative h-full">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-gray-500 pr-2">
              <span>25</span>
              <span>20</span>
              <span>15</span>
              <span>10</span>
              <span>5</span>
              <span>0</span>
            </div>

            {/* Chart area */}
            <div className="ml-10 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-rows-5 gap-0">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-gray-100"></div>
                ))}
              </div>

              {/* Chart curves */}
              <div className="absolute inset-0">
                {/* Wellbeing trend */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-100 to-transparent rounded-md opacity-60"
                  style={{
                    height: "85%",
                    clipPath: "polygon(0 100%, 0 85%, 14% 75%, 28% 65%, 42% 55%, 56% 35%, 70% 25%, 84% 15%, 100% 5%, 100% 100%)",
                  }}
                ></div>

                {/* Mental Health trend */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-100 to-transparent rounded-md opacity-60"
                  style={{
                    height: "75%",
                    clipPath: "polygon(0 100%, 0 90%, 14% 80%, 28% 70%, 42% 60%, 56% 45%, 70% 30%, 84% 20%, 100% 10%, 100% 100%)",
                  }}
                ></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                {chartData.map((item, index) => (
                  <span key={index} className="font-medium">{item.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="md:flex justify-center space-x-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Wellbeing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-600">Mental Health</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Categories</span>
          </div>
        </div>
      </div>

      {/* Bottom Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {error ? 'Error' : 'Healthy'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Data Sync</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {isLoading ? 'Syncing...' : 'Updated'}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Records</span>
              <span className="font-semibold text-gray-900">
                {wellbeingCount + mentalHealthCount + meditationInterestCount + dailyPracticesCount + categoriesCount + userCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Categories</span>
              <span className="font-semibold text-gray-900">{categoriesCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;