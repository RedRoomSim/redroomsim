/*
File:                 UnderConstruction.jsx
Path:                 /src/pages/UnderConstruction.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Under construction page.
Changelog:
 - Initial setup for UnderConstruction component.
*/

import React from "react";
import underconstruction from "../assets/uc.png";

const UnderConstruction = () => {
  return (
   
      
      <div className="flex flex-col items-center mt-4">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <img src={underconstruction} alt="underconstruction" className="h-80 w-80" />
      </div>

  );
};

export default UnderConstruction;