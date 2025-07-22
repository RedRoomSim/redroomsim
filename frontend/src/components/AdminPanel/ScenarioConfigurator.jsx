/*
File:                 ScenarioConfigurator.jsx
Path:                 /src/components/AdminPanel/ScenarioConfigurator.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component to display scenario configuration options.
Changelog:
 - Initial setup for Scenario Configurator component.
 - Placeholder content for future scenario configuration features.
*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import useTableSortResize from "../../hooks/useTableSortResize";

const ScenarioConfigurator = () => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const { sortConfig, handleSort, columnWidths, handleMouseDown, sortData } =
    useTableSortResize({ name: 200, type: 150, difficulty: 120 });

  const fetchScenarios = async () => {
    try {
      const res = await axios.get("https://api.redroomsim.com/sim/list");
      setScenarios(res.data.scenarios || []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to fetch scenarios", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  const deleteScenario = async (id) => {
    try {
      await axios.delete(
        `https://api.redroomsim.com/sim/delete-scenario/${id}`
      );
      setScenarios((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete scenario", err);
    }
  };

  const sortedScenarios = sortData(scenarios);

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Scenario Configurator</h2>
      {loading ? (
        <p>Loading...</p>
      ) : scenarios.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No scenarios found.</p>
      ) : (
        <table className="min-w-full border-collapse table-fixed text-gray-900 dark:text-white">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th
                style={{ width: columnWidths.name }}
                className="border dark:border-gray-600 px-4 py-2 text-left"
              >
                <div className="flex items-center">
                  <span className="cursor-pointer" onClick={() => handleSort('name')}>Name</span>
                  <span className="ml-1 w-2 cursor-col-resize" onMouseDown={(e) => handleMouseDown('name', e)} />
                </div>
              </th>
              <th
                style={{ width: columnWidths.type }}
                className="border dark:border-gray-600 px-4 py-2 text-left"
              >
                <div className="flex items-center">
                  <span className="cursor-pointer" onClick={() => handleSort('type')}>Type</span>
                  <span className="ml-1 w-2 cursor-col-resize" onMouseDown={(e) => handleMouseDown('type', e)} />
                </div>
              </th>
              <th
                style={{ width: columnWidths.difficulty }}
                className="border dark:border-gray-600 px-4 py-2 text-left"
              >
                <div className="flex items-center">
                  <span className="cursor-pointer" onClick={() => handleSort('difficulty')}>Difficulty</span>
                  <span className="ml-1 w-2 cursor-col-resize" onMouseDown={(e) => handleMouseDown('difficulty', e)} />
                </div>
              </th>
              <th className="border dark:border-gray-600 px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {sortedScenarios.map((sc) => (
              <tr key={sc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td style={{ width: columnWidths.name }} className="border dark:border-gray-600 px-4 py-2">{sc.name}</td>
                <td style={{ width: columnWidths.type }} className="border dark:border-gray-600 px-4 py-2">{sc.type}</td>
                <td style={{ width: columnWidths.difficulty }} className="border dark:border-gray-600 px-4 py-2">{sc.difficulty}</td>
                <td className="border dark:border-gray-600 px-4 py-2 text-center">
                  <button
                    onClick={() => deleteScenario(sc.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScenarioConfigurator;
