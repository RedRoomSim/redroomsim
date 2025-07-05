/*
File:                 ProgressDashboardPage.jsx
Path:                 /src/pages/ProgressDashboardPage.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          User progress tracking dashboard.
Changelog:
 - Initial setup for ProgressDashboardPage component.
*/


import React from "react";
import ProgressTracker from "../components/ProgressDashboard/ProgressTracker";

const ProgressDashboardPage = () => {
  return (
    <div className="p-6">
      <ProgressTracker />
    </div>
  );
};

export default ProgressDashboardPage;
