/*
File:                 MilestoneBadges.jsx
Path:                 /src/components/ProgressDashboard/MilestoneBadges.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for displaying milestone badges in the Red Room Simulation application.
Changelog:
 - Initial setup for MilestoneBadges component.
 - Added support for dark mode styling.
 - Improved badge layout and responsiveness.
 - Enhanced accessibility features.
*/

import React from "react";

const MilestoneBadges = ({ badges }) => {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Milestones</h2>
      <div className="flex flex-wrap gap-3">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold rounded-full"
          >
            {badge}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneBadges;
