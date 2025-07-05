/*
File:                 DecisionPrompt.jsx
Path:                 /src/components/SimulationEngine/DecisionPrompt.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for displaying decision prompts in the Red Room Simulation application.
Changelog:
 - Initial setup for DecisionPrompt component.
 - Added support for displaying a prompt with multiple options.
 - Implemented callback for handling user decisions.
 - Dark mode support added.
 */


import React from "react";

const DecisionPrompt = ({ prompt, options, onDecision }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{prompt}</h2>
      <div className="space-y-2">
        {options.map((opt, index) => (
          <button
            key={index}
            onClick={() => onDecision(opt)}
            className="w-full text-left p-3 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DecisionPrompt;
