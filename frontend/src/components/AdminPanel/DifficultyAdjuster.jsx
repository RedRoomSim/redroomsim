/*
File:                DifficultyAdjuster.jsx
Path:                 /src/components/AdminPanel/DifficultyAdjuster.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component to adjust game difficulty.
Changelog:
 - Initial setup for Difficulty Adjuster component.
 - Uses a range input to adjust difficulty level.
*/

import React from "react";
import { useDifficulty } from "../../context/DifficultyContext";

const DifficultyAdjuster = () => {
  const { difficulty, setDifficulty } = useDifficulty();

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Difficulty Adjuster</h2>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <p className="mt-2">Current Difficulty: {difficulty}</p>
    </div>
  );
};

export default DifficultyAdjuster;