/*
File:                 layout.jsx
Path:                 /src/components/Shared/Layout.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Layout component wrapping the main application structure.
Changelog:
 - Initial setup for Layout component.
 - Integrated responsive design for better user experience.
 - Added support for dark mode styling.
 - Implemented dynamic sidebar toggle.
 - Improved accessibility features.
*/

// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import lightBg from "../../assets/light-mode.png";
import darkBg from "../../assets/dark-mode.png";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ResponsiveContainer from "./ResponsiveContainer";

/**
* Layout component wraps the main content with Sidebar and Topbar.  It manages the sidebar state and applies appropriate styles for responsiveness.
**/
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 640);
  const { theme } = useTheme();

  // Close sidebar on small screens and handle resize events
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="min-h-screen w-full overflow-x-auto text-gray-900 dark:text-white bg-no-repeat bg-cover bg-fixed bg-center"
      style={{ backgroundImage: `url(${theme === 'dark' ? darkBg : lightBg})` }}
    >
      <div className="flex h-full">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm animate-fade z-30 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className={`flex flex-col flex-1 ml-0 transition-all duration-300 ${sidebarOpen ? 'sm:ml-64' : 'sm:ml-20'}`}>
          <Topbar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <div className="relative z-10 flex-1 overflow-auto bg-white/25 dark:bg-gray-900/25 backdrop-blur-sm p-6">
            <ResponsiveContainer>
              {children}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};


// Export the Layout component for use in other parts of the application.
export default Layout;
