/*
File:                 ThemeContext.jsx
Path:                 /src/context/ThemeContext.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Managing theme state in the Red Room Simulation application.
Changelog:
 - Initial setup for ThemeContext.
 - Added support for dark mode.
 - Implemented theme toggling functionality.
 - Improved responsiveness for different screen sizes.
*/

import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [accent, setAccent] = useState(() => localStorage.getItem("accent") || "cyan");

  const accentMap = {
    cyan: "#00ffff",
    teal: "#0dffc9",
    purple: "#bf00ff",
  };

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accentMap[accent]);
    localStorage.setItem("accent", accent);
  }, [accent]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const cycleAccent = () => {
    const colors = Object.keys(accentMap);
    const idx = colors.indexOf(accent);
    setAccent(colors[(idx + 1) % colors.length]);
  };

  return (
    <ThemeContext.Provider value={{ theme, accent, toggleTheme, cycleAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
