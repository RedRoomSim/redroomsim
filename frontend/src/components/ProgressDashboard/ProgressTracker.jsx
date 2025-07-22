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
import useTableSortResize from "../../hooks/useTableSortResize";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TimelineViewer from "../SimulationEngine/TimelineViewer";

const ProgressTracker = () => {
  const [data, setData] = useState([]);
  const [timelines, setTimelines] = useState({});
  const [scenarioMap, setScenarioMap] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    sortConfig,
    handleSort,
    columnWidths,
    handleMouseDown,
    sortData,
    getSortSymbol,
  } = useTableSortResize({
      name: 200,
      score: 120,
      status: 150,
      timeline: 120,
      resume: 120,
    });

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
      const scenarioExists = Boolean(scenarioMap[entry.scenario_id]);
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
        const map = {};
        res.data?.scenarios?.forEach((s) => {
          map[s.id] = s.name;
        });
        setScenarioMap(map);
      } catch (err) {
        console.error("Failed to fetch scenario list", err);
      }
    };
    fetchScenarios();
  }, []);

  const sortedData = sortData(data);

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Progress Dashboard</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-750 shadow-md rounded-lg overflow-hidden text-gray-900 dark:text-white table-fixed">
        <thead className="bg-[#111827] text-white">
          <tr>
            <th style={{ width: columnWidths.name }} className="py-3 px-6 text-left">
              <div className="flex items-center">
                <span
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Scenario {getSortSymbol('name')}
                </span>
                <span
                  className="ml-2 cursor-col-resize select-none px-1"
                  onMouseDown={(e) => handleMouseDown('name', e)}
                >|
                </span>
              </div>
            </th>
            <th style={{ width: columnWidths.score }} className="py-3 px-6 text-left">
              <div className="flex items-center">
                <span
                  className="cursor-pointer"
                  onClick={() => handleSort('score')}
                >
                  Score {getSortSymbol('score')}
                </span>
                <span
                  className="ml-2 cursor-col-resize select-none px-1"
                  onMouseDown={(e) => handleMouseDown('score', e)}
                >|
                </span>
              </div>
            </th>
            <th style={{ width: columnWidths.status }} className="py-3 px-6 text-left">
              <div className="flex items-center">
                <span
                  className="cursor-pointer"
                  onClick={() => handleSort('completed')}
                >
                  Status {getSortSymbol('status')}
                </span>
                <span
                  className="ml-2 cursor-col-resize select-none px-1"
                  onMouseDown={(e) => handleMouseDown('status', e)}
                >|
                </span>
              </div>
            </th>
            <th style={{ width: columnWidths.timeline }} className="py-3 px-6 text-left">
              <div className="flex items-center">
                <span
                  className="cursor-pointer"
                  onClick={() => handleSort('timeline')}
                >
                  Timeline {getSortSymbol('timeline')}
                </span>
                <span
                  className="ml-2 cursor-col-resize select-none px-1"
                  onMouseDown={(e) => handleMouseDown('timeline', e)}
                >|
                </span>
              </div>
            </th>
            <th style={{ width: columnWidths.resume }} className="py-3 px-6 text-left">
              <div className="flex items-center">
                <span
                  className="cursor-pointer"
                  onClick={() => handleSort('resume')}
                >
                  Resume {getSortSymbol('resume')}
                </span>
                <span
                  className="ml-2 cursor-col-resize select-none px-1"
                  onMouseDown={(e) => handleMouseDown('resume', e)}
                >|
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((entry) => (
            <React.Fragment key={entry.sim_uuid}>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td style={{ width: columnWidths.name }} className="py-3 px-6">{entry.name || scenarioMap[entry.scenario_id] || entry.scenario_id}</td>
              <td style={{ width: columnWidths.score }} className="py-3 px-6">{entry.score ?? "-"}</td>
              <td style={{ width: columnWidths.status }} className={`py-3 px-6 font-semibold ${entry.completed ? "text-green-600" : "text-red-600"}`}>
                {entry.completed ? "Completed" : "Incomplete"}
              </td>
              <td style={{ width: columnWidths.timeline }} className="py-3 px-6">
                <button onClick={() => toggleTimeline(entry.sim_uuid)} className="text-blue-600 dark:text-blue-400 underline">
                  {timelines[entry.sim_uuid] ? "Hide" : "Timeline"}
                </button>
              </td>
              <td style={{ width: columnWidths.resume }} className="py-3 px-6">
                {!entry.completed && scenarioMap[entry.scenario_id] ? (
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
