/*
File:                 ScoringBar.jsx
Path:                 /src/components/SimulationEngine/ScoringBar.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for displaying a scoring bar in the Red Room Simulation application.
Changelog:
 - Initial setup for ScoringBar component.
 - Added support for dynamic scoring updates.
 - Implemented visual feedback for scoring changes.
 - Dark mode support added.
*/

import React from "react";

const ScoringBar = ({ score }) => {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 mb-4">
      <div
        className="bg-red-600 h-6 rounded-full text-white text-center text-sm"
        style={{ width: `${score}%` }}
      >
        {score}%
      </div>
    </div>
  );
};

export default ScoringBar;
