
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminLayout() {
   
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
                <Navbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}