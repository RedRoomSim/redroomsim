/*
File:                 topbar.jsx
Path:                 /src/components/Shared/Topbar.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Top navigation bar containing menu icons and profile access.
Changelog:
 - Initial setup for Topbar component.
 - Added support for dark mode styling.
 - Implemented responsive design for better user experience.
*/

// Import necessary libraries and components
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import userAvatar from "../../assets/user.png";
import logo from "../../assets/logo.png";
import logoutImage from "../../assets/logout.png";

const Topbar = ({ sidebarOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmLogout = () => setShowConfirm(true);

  const handleLogout = async () => {
    setShowConfirm(false);
    await logout();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/login", { state: { message: "You have been logged out." }, replace: true });
    }, 1500);
  };

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded shadow p-6 w-80 text-center text-gray-900 dark:text-white">
            <p className="mb-4 font-medium">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-black dark:text-white px-6 py-4 rounded shadow-lg border border-gray-300 dark:border-gray-600 z-50">
          <p className="mb-2 font-medium">You have been logged out.</p>
          <div className="flex justify-center">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded">
              OK
            </button>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white h-16 px-4 shadow-md transition-colors">
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" title="Go to Dashboard">
            <img src={logo} alt="Logo" className="h-10 w-10 transition-transform hover:scale-105" />
          </Link>
          <h1 className="text-xl font-bold hidden sm:block">Red Room Simulation</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/help" className="hover:text-red-600" title="Help">
            <span className="text-2xl">❓</span>
          </Link>
          <Link to="/contact" className="hover:text-red-600" title="Contact">
            <span className="text-2xl">📞</span>
          </Link>
          <Link to="/settings" className="hover:text-red-600" title="Settings">
            <span className="text-2xl">⚙️</span>
          </Link>
          <Link to="/profile" className="hover:text-red-600" title="My Profile">
            <img
              src={userAvatar}
              alt="User"
              className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
            />
          </Link>
          <button onClick={confirmLogout} title="Logout">
            <img src={logoutImage} alt="Logout" className="h-6 w-6" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Topbar;
