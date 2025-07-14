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


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SimulationSummaryCard from "./SimulationSummaryCard";

const ProgressTracker = () => {
  const [data, setData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      const ids = JSON.parse(localStorage.getItem("simulationIds") || "[]");
      try {
        const responses = await Promise.all(
          ids.map((id) =>
            axios.get(`https://api.redroomsim.com/progress/${user.email}/${id}`)
          )
        );
        setData(responses.map((r) => r.data));
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    };
    fetchProgress();
  }, [user]);

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Progress Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {data.map((entry) => (
          <SimulationSummaryCard key={entry.simulation_id} simulation={entry} />
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
