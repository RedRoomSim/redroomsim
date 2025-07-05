/**
 * File: SDLCAnnotationLabel.jsx
 * Path: /src/components/Shared/SDLCAnnotationLabel.jsx
 * Author: Umair Asad
 * Last Modified: 2025-06-07
 * Version: 1.0.0
 * Project: RedRoomSim
 * License: MIT
 * Copyright (c) 2025 RedRoomSim Team
 * Description: SDLCAnnotationLabel component to display the current phase of the Software Development Life Cycle (SDLC).
 * Last Updated: Added styling for the label to indicate the current SDLC phase.
 */

// Import necessary libraries and components
import React from "react";

// SDLCAnnotationLabel component renders a label indicating the current phase of the SDLC
const SDLCAnnotationLabel = ({ phase }) => {
  return (
    <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
      {phase}
    </div>
  );
};


export default SDLCAnnotationLabel;
