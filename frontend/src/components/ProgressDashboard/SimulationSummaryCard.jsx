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

import React, { useState } from "react";
import axios from "axios";
import TimelineViewer from "../SimulationEngine/TimelineViewer";

const SimulationSummaryCard = ({ simulation }) => {
  const [open, setOpen] = useState(false);
  const [timeline, setTimeline] = useState([]);

  const toggleTimeline = async () => {
    if (open) {
      setOpen(false);
      return;
    }
    try {
      const res = await axios.get(
        `https://api.redroomsim.com/progress/timeline/${simulation.simulation_id}`
      );
      setTimeline(res.data);
    } catch (err) {
      console.error("Failed to load timeline", err);
    }
    setOpen(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow p-4 text-gray-900 dark:text-white">
      <h3 className="text-lg font-bold mb-2">{simulation.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Score: {simulation.score ?? "-"}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Status: {simulation.completed ? "Completed" : "Incomplete"}</p>
      <button onClick={toggleTimeline} className="mt-2 text-sm text-blue-600 hover:underline">
        {open ? "Hide Timeline" : "View Timeline"}
      </button>
      {open && (
        <div className="mt-3">
          <TimelineViewer timeline={timeline} />
        </div>
      )}
    </div>
  );
};

export default SimulationSummaryCard;
