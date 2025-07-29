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
    black: "#000000",
    cyan: "#00ffff",
    teal: "#0dffc9",
    purple: "#bf00ff",
    aqua: "#00ffff",
    magenta: "#ff00ff",
    orange: "#ff7f00",
    red: "#ff0000", 
    yellow: "#ffff00",
    green: "#00ff00",
    blue: "#0000ff",
    pink: "#ff1493",
    gray: "#808080",
    brown: "#a52a2a",
    lime: "#00ff00",
    indigo: "#4b0082",
    violet: "#ee82ee",
    gold: "#ffd700",
    silver: "#c0c0c0",
    bronze: "#cd7f32",
    navy: "#000080",
    olive: "#808000",
    maroon: "#800000",
    coral: "#ff7f50",
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

  const updateAccent = (color) => {
    if (accentMap[color]) {
      setAccent(color);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, accent, accentMap, toggleTheme, cycleAccent, updateAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
