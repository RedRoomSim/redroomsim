/*
File:                 Dashboard.jsx
Path:                 /src/pages/Dashboard.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Default dashboard for authenticated users.
Changelog:
 - Initial setup for Dashboard component.
 - Integrated ProgressTracker for user activity monitoring.
 - Added responsive design for better user experience.
*/


// Import necessary libraries and components
import React from "react";
import ProgressTracker from "../components/ProgressDashboard/ProgressTracker";

/**
 * Dashboard landing page.
 */
const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ProgressTracker />
    </div>
  );
};

// Export the Dashboard component as default
export default Dashboard;
