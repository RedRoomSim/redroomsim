/*
File:                 ScenarioFilterPanel.jsx
Path:                 /src/components/ScenarioSelector/ScenarioFilterPanel.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for filtering scenarios in the Red Room Simulation application.
Changelog:
 - Initial setup for ScenarioFilterPanel component.
 - Added dropdowns for filtering scenarios by difficulty and type.
 - Implemented state management for filters.
 - Improved UI/UX for better user interaction.
 - Dark mode support added.
*/

import React from "react";

const ScenarioFilterPanel = ({ filters, onChange, scenarios }) => {
  if (!filters || !scenarios) return null;

  const difficulties = Array.from(new Set(scenarios.map(s => s.difficulty).filter(Boolean)));
  const types = Array.from(new Set(scenarios.map(s => s.type).filter(Boolean)));

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter Scenarios</h3>
      <div className="flex gap-4">
        <select
          value={filters.difficulty}
          onChange={(e) => onChange({ ...filters, difficulty: e.target.value })}
          className="p-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="">All Difficulties</option>
          {difficulties.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          className="p-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ScenarioFilterPanel;