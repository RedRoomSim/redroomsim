/*
File:                 NotFound.jsx
Path:                 /src/pages/NotFound.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          404 Not Found page.
Changelog:
 - Initial setup for NotFound component.
*/

import React from "react";

/**
 * 404 not found page.
 */
const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-5xl font-bold text-red-600">404</h1>
      <p className="text-xl mt-4">Page Not Found</p>
    </div>
  );
};

export default NotFound;
