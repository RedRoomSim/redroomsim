/*
File:                 SimulationSummaryCard.jsx
Path:                 /src/components/ProgressDashboard/SimulationSummaryCard.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for displaying simulation summary in the Red Room Simulation application.
Changelog:
 - Initial setup for SimulationSummaryCard component.
 - Added support for dark mode styling.
 - Implemented responsive design for better user experience.
*/

import React from "react";

const SimulationSummaryCard = ({ simulation }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow p-4 text-gray-900 dark:text-white">
      <h3 className="text-lg font-bold mb-2">{simulation.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Date: {simulation.date}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Score: {simulation.score}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300">Takeaway: {simulation.takeaway}</p>
    </div>
  );
};

export default SimulationSummaryCard;
