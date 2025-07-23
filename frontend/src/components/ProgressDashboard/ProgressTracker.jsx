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
    sortData,
    getSortSymbol,
  } = useTableSortResize({
      name: 200,
      score: 120,
      result: 120,
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

        if (Array.isArray(res.data?.scenarios)) {
          for (const s of res.data.scenarios) {
            try {
              const detail = await axios.get(
                `https://api.redroomsim.com/sim/${s.id}`
              );
              map[s.id] = {
                name: s.name,
                steps: Array.isArray(detail.data?.steps)
                  ? detail.data.steps.length
                  : 0,
              };
            } catch (err) {
              map[s.id] = { name: s.name, steps: 0 };
            }
          }
        }

        setScenarioMap(map);
      } catch (err) {
        console.error("Failed to fetch scenario list", err);
      }
    };
    fetchScenarios();
  }, []);

  const sortedData = sortData(data);

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Progress Dashboard</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
        <thead className="bg-gray-200 dark:bg-gray-700 text-left">
          <tr>
            <th style={{ width: columnWidths.name }} className="py-3 px-6 text-left">
              <div className="flex items-center">
                <span
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Scenario {getSortSymbol('name')}
                </span>
                {/* Resizer removed */}
              </div>
            </th>
            <th style={{ width: columnWidths.score }} className="py-3 px-6 text-left">
              <div className="flex items-center">
                <span
                  className="cursor-pointer"
                  onClick={() => handleSort('score')}
                >
                  Score (%) {getSortSymbol('score')}
                </span>
                {/* Resizer removed */}
              </div>
            </th>
            <th style={{ width: columnWidths.result }} className="py-3 px-6 text-left">
              <div className="flex items-center">
                <span
                  className="cursor-pointer"
                  onClick={() => handleSort('result')}
                >
                  Result {getSortSymbol('result')}
                </span>
                {/* Resizer removed */}
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
                {/* Resizer removed */}
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
                {/* Resizer removed */}
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
                {/* Resizer removed */}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((entry) => (
            <React.Fragment key={entry.sim_uuid}>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td style={{ width: columnWidths.name }} className="py-3 px-6">
                {entry.name || scenarioMap[entry.scenario_id]?.name || entry.scenario_id}
              </td>
              <td style={{ width: columnWidths.score }} className="py-3 px-6">
                {(() => {
                  const steps = scenarioMap[entry.scenario_id]?.steps;
                  if (!steps || (entry.score === null || entry.score === undefined)) return "-";
                  const pct = Math.round((entry.score / steps) * 100);
                  return `${pct}%`;
                })()}
              </td>
              <td
                style={{ width: columnWidths.result }}
                className={(() => {
                  if (!entry.completed) return "py-3 px-6 font-semibold text-gray-600";
                  const steps = scenarioMap[entry.scenario_id]?.steps;
                  if (!steps || (entry.score === null || entry.score === undefined))
                    return "py-3 px-6 font-semibold text-gray-600";
                  const pct = Math.round((entry.score / steps) * 100);
                  return `py-3 px-6 font-semibold ${pct >= 70 ? "text-green-600" : "text-red-600"}`;
                })()}
              >
                {(() => {
                  if (!entry.completed) return "-";
                  const steps = scenarioMap[entry.scenario_id]?.steps;
                  if (!steps || (entry.score === null || entry.score === undefined)) return "-";
                  const pct = Math.round((entry.score / steps) * 100);
                  return pct >= 70 ? "Pass" : "Fail";
                })()}
              </td>
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
              <td colSpan="6" className="py-3 px-6">
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
