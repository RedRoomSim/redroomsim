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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TimelineViewer from "../SimulationEngine/TimelineViewer";

const ProgressTracker = () => {
  const [data, setData] = useState([]);
  const [timelines, setTimelines] = useState({});
  const [availableScenarios, setAvailableScenarios] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleTimeline = async (simId) => {
    if (timelines[simId]) {
      setTimelines((prev) => ({ ...prev, [simId]: undefined }));
      return;
    }
    try {
      const res = await axios.get(
        `https://api.redroomsim.com/progress/timeline/${simId}`
      );
      setTimelines((prev) => ({ ...prev, [simId]: res.data }));
    } catch (err) {
      console.error("Failed to fetch timeline", err);
    }
  };

  const handleResume = async (entry) => {
    try {
      const scenarioExists = availableScenarios.includes(entry.scenario_id);
      if (!scenarioExists) return;
      const res = await axios.get(
        `https://api.redroomsim.com/progress/timeline/${entry.sim_uuid}`
      );
      const nextStep = Array.isArray(res.data) ? res.data.length : 0;
      navigate(
        `/simulation/${entry.scenario_id}?simId=${entry.sim_uuid}&step=${nextStep}`
      );
    } catch (err) {
      console.error("Failed to resume simulation", err);
    }
  };

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          `https://api.redroomsim.com/progress/user/${user.email}`
        );
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    };
    fetchProgress();
  }, [user]);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const res = await axios.get("https://api.redroomsim.com/sim/list");
        const ids = res.data?.scenarios?.map((s) => s.id) || [];
        setAvailableScenarios(ids);
      } catch (err) {
        console.error("Failed to fetch scenario list", err);
      }
    };
    fetchScenarios();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Progress Dashboard</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-750 shadow-md rounded-lg overflow-hidden text-gray-900 dark:text-white">
        <thead className="bg-[#111827] text-white">
          <tr>
            <th className="py-3 px-6 text-left">Scenario</th>
            <th className="py-3 px-6 text-left">Score</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Timeline</th>
            <th className="py-3 px-6 text-left">Resume</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <React.Fragment key={entry.sim_uuid}>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-3 px-6">{entry.scenario_id}</td>
              <td className="py-3 px-6">{entry.score ?? "-"}</td>
              <td className={`py-3 px-6 font-semibold ${entry.completed ? "text-green-600" : "text-red-600"}`}>
                {entry.completed ? "Completed" : "Incomplete"}
              </td>
              <td className="py-3 px-6">
                <button onClick={() => toggleTimeline(entry.sim_uuid)} className="text-blue-600 dark:text-blue-400 underline">
                  {timelines[entry.sim_uuid] ? "Hide" : "Timeline"}
                </button>
              </td>
              <td className="py-3 px-6">
                {!entry.completed && availableScenarios.includes(entry.scenario_id) ? (
                  <button
                    onClick={() => handleResume(entry)}
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    Resume
                  </button>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
            </tr>
            {timelines[entry.sim_uuid] && (
              <tr>
                <td colSpan="5" className="py-3 px-6">
                  <TimelineViewer timeline={timelines[entry.sim_uuid]} />
                </td>
              </tr>
            )}
            </React.Fragment>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressTracker;
