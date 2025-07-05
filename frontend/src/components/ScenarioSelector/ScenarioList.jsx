/*
File:                 ScenarioList.jsx
Path:                 /src/components/ScenarioSelector/ScenarioList.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for displaying a list of scenarios in the Red Room Simulation application.
Changelog:
 - Initial setup for ScenarioList component.
 - Integrated ScenarioCard component for individual scenario display.
 - Added support for dark mode styling.
*/
import React from "react";
import ScenarioCard from "./ScenarioCard";

const ScenarioList = ({ scenarios, onSelect }) => {
  if (!scenarios || scenarios.length === 0) {
    return <p className="p-6 text-gray-600 dark:text-gray-300">No scenarios found.</p>;
  }

  return (
    <div className="px-4">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="break-inside-avoid">
            <ScenarioCard scenario={scenario} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScenarioList;
