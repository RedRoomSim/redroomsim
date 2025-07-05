/*
File:                 ScoreBreakdownChart.jsx
Path:                 /src/components/ProgressDashboard/ScoreBreakdownChart.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for displaying score breakdown in the Red Room Simulation application.
Changelog:
 - Initial setup for ScoreBreakdownChart component.
 - Added support for dark mode styling.
 - Implemented responsive design for better user experience.
*/


import React from "react";

const ScoreBreakdownChart = ({ score }) => {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Score Breakdown</h2>
      <p className="text-gray-600 dark:text-gray-300">Your current score is {score}/100</p>
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mt-2">
        <div
          className="h-4 bg-green-500 rounded"
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ScoreBreakdownChart;

