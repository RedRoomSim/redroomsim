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
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import userAvatar from "../../assets/user.png";
import logo from "../../assets/logo.png";
import NotificationBell from "./NotificationBell";
import { Menu, HelpCircle, Phone, Settings as Cog, LogOut } from "lucide-react";

const Topbar = ({ sidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="w-full flex items-center justify-between bg-white/60 dark:bg-gray-800/60 backdrop-blur-md text-gray-900 dark:text-white h-16 px-4 shadow-md transition-colors">
        <div className="flex items-center space-x-2">
          <button onClick={toggleSidebar} className="sm:hidden mr-2 focus:outline-none" aria-label="Toggle menu">
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/dashboard" title="Go to Dashboard">
            <img src={logo} alt="Logo" className="h-10 w-10 transition-transform hover:scale-105" />
          </Link>
          <h1 className="text-xl font-bold hidden sm:block">Red Room Simulation</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:block font-mono text-sm accent-text accent-glow">{currentTime}</span>
          <Link to="/help" className="accent-text accent-glow opacity-80 hover:opacity-100" title="Help">
            <HelpCircle className="w-5 h-5" />
          </Link>
          <Link to="/contact" className="accent-text accent-glow opacity-80 hover:opacity-100" title="Contact">
            <Phone className="w-5 h-5" />
          </Link>
          <NotificationBell />
          <Link to="/settings" className="accent-text accent-glow opacity-80 hover:opacity-100" title="Settings">
            <Cog className="w-5 h-5" />
          </Link>
          <Link to="/profile" className="accent-text opacity-80 hover:opacity-100" title="My Profile">
            <img
              src={userAvatar}
              alt="User"
              className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
            />
          </Link>
          <button onClick={confirmLogout} title="Logout" className="accent-text accent-glow opacity-80 hover:opacity-100">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Topbar;
