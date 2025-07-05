/*
File:                 Sidebar.jsx
Path:                 /src/components/Shared/Sidebar.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Sidebar component for navigation in the Red Room Simulation application.
Changelog:
 - Initial setup for Sidebar component.
 - Added support for dark mode styling.
 - Implemented responsive design for better user experience.
 - Added role-based menu items for admin users.
 - Improved accessibility with focus states and hover effects.
 - Added app logo and title with hover effects.
*/

// Import necessary libraries and components
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

// Sidebar component renders the navigation sidebar with links and user role-based menu items
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, role } = useAuth();

  return (
    <div
      className={`fixed top-0 left-0 h-full z-40 shadow-lg transition-all duration-300
        ${isOpen ? "w-64" : "w-20"}
        bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white`}
    >
      {/* Hamburger icon aligned left */}
      <div className="flex items-center justify-start mt-4 px-4">
        <button onClick={toggleSidebar} className="focus:outline-none">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* App logo and title displayed only when sidebar expanded */}
      {isOpen && (
        <div className="flex flex-col items-center mt-4">
          <Link to="/dashboard" title="Go to Dashboard">
            <img src={logo} alt="logo" className="h-12 w-12 transition-transform hover:scale-105" />
          </Link>
          <h1 className="font-bold text-lg mt-2">Red Room Simulation</h1>
        </div>
      )}

      {/* Sidebar navigation links */}
      <div className="mt-10 space-y-4 flex flex-col">
        <Link to="/dashboard" className="flex items-center space-x-3 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          <span className="text-2xl">📊</span>
          {isOpen && <span>Dashboard</span>}
        </Link>

        <Link to="/scenarios" className="flex items-center space-x-3 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          <span className="text-2xl">🧩</span>
          {isOpen && <span>Scenarios</span>}
        </Link>

        {role === "admin" && (
          <>
            <Link to="/admin" className="flex items-center space-x-3 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <span className="text-2xl">⚙️</span>
              {isOpen && <span>Admin Panel</span>}
            </Link>
            <Link to="/upload" className="flex items-center space-x-3 py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <span className="text-2xl">📤</span>
              {isOpen && <span>Upload Evidence</span>}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;


