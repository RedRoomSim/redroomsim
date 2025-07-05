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

import React, { useState } from "react";

const DifficultyAdjuster = () => {
  const [difficulty, setDifficulty] = useState(3);

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Difficulty Adjuster</h2>
      <input
        type="range"
        min="1"
        max="5"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="w-full accent-red-600"
      />
      <p className="mt-2">Current Difficulty: {difficulty}</p>
    </div>
  );
};

export default DifficultyAdjuster;