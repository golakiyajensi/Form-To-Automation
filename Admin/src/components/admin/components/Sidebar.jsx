import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  X,
} from "lucide-react";

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
  const links = [
    { to: "", label: "Dashboard", icon: LayoutDashboard },
    { to: "user", label: "User", icon: UserPlus },
    { to: "forms", label: "Forms", icon: UserPlus },
    { to: "slides", label: "Slides", icon: UserPlus },
    { to: "response", label: "Response", icon: UserPlus },
    { to: "template", label: "Template", icon: UserPlus },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-20 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar panel */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-[#2a3042] text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="relative h-16 flex items-center justify-between px-4 font-bold text-xl border-b border-gray-800">
          Admin Panel
          <button
            onClick={toggleSidebar}
            className="md:hidden hover:bg-gray-700 p-1 rounded"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Main Links */}
        <nav className="flex flex-col p-4 space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={`/admin/dashboard/${to}`}
              end={to === ""}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded transition font-medium ${
                  isActive
                    ? "bg-[#d4e6e0] text-black shadow-md"
                    : "hover:bg-[#3a4155] text-white hover:shadow-sm"
                }`
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
