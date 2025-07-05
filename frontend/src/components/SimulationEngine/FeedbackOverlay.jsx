/*
File:                 FeedbackOverlay.jsx
Path:                 /src/components/SimulationEngine/FeedbackOverlay.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Component for displaying feedback messages in the Red Room Simulation application.
Changelog:
 - Initial setup for FeedbackOverlay component.
 - Added support for displaying feedback messages with color coding.
 - Dark mode support added.
 */


import React from "react";

const FeedbackOverlay = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div
      className={`border p-4 rounded shadow bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
        feedback.color || ""
      }`}
    >
      <h3 className="font-semibold mb-2">Feedback</h3>
      <p>{feedback.message}</p>
      <p className="mt-1 text-sm italic text-gray-700 dark:text-gray-300">
        SDLC Phase: {feedback.sdlc}
      </p>
    </div>
  );
};

export default FeedbackOverlay;
