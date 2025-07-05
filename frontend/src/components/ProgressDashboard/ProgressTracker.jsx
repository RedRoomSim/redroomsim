/*
File:                 progressTracker.jsx
Path:                 /src/components/ProgressDashboard/ProgressTracker.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for displaying progress tracking in the Red Room Simulation application.
Changelog:
 - Initial setup for ProgressTracker component.
 - Added support for dark mode styling.
 - Improved layout and responsiveness.
 - Enhanced accessibility features.
*/


import React, { useState } from "react";

const mockData = [
  {
    id: 1,
    scenario: "Phishing Attack Response",
    date: "2025-06-01",
    score: 85,
    status: "Passed",
  },
  {
    id: 2,
    scenario: "Insider Threat Detection",
    date: "2025-06-02",
    score: 72,
    status: "Passed",
  },
  {
    id: 3,
    scenario: "Ransomware Containment",
    date: "2025-06-03",
    score: 48,
    status: "Failed",
  },
];

const ProgressTracker = () => {
  const [data] = useState(mockData);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Progress Dashboard</h2>

      <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden text-gray-900 dark:text-white">
        <thead className="bg-[#111827] text-white">
          <tr>
            <th className="py-3 px-6 text-left">Scenario</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Score</th>
            <th className="py-3 px-6 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.id} className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-3 px-6">{entry.scenario}</td>
              <td className="py-3 px-6">{entry.date}</td>
              <td className="py-3 px-6">{entry.score}%</td>
              <td className={`py-3 px-6 font-semibold ${entry.status === "Passed" ? "text-green-600" : "text-red-600"}`}>
                {entry.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgressTracker;
