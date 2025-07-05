/*
File:                 TimelineViewer.jsx
Path:                 /src/components/SimulationEngine/TimelineViewer.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for displaying a timeline of decisions in the Red Room Simulation application.
Changelog:
 - Initial setup for TimelineViewer component.
 - Added support for displaying a list of decisions with feedback.
 - Implemented dark mode styling.
 - Improved responsiveness for different screen sizes.
*/


import React from "react";

const TimelineViewer = ({ timeline }) => {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-3">Decision Timeline</h3>
      <ul className="space-y-2">
        {timeline.map((entry, idx) => (
          <li
            key={idx}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-gray-50 dark:bg-gray-700"
          >
            <p><b>Decision:</b> {entry.decision}</p>
            <p><b>Feedback:</b> {entry.feedback}</p>
            {/*<p className="text-sm text-gray-500 mt-1">⏱️ Time: {(entry.timeMs / 1000).toFixed(2)} seconds</p>*/}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimelineViewer;
