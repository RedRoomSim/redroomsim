import React, { createContext, useContext, useState } from "react";

const DifficultyContext = createContext();

export const DifficultyProvider = ({ children }) => {
  const [difficulty, setDifficultyState] = useState(() => {
    return localStorage.getItem("difficulty") || "Easy";
  });

  const setDifficulty = (level) => {
    setDifficultyState(level);
    localStorage.setItem("difficulty", level);
  };

  return (
    <DifficultyContext.Provider value={{ difficulty, setDifficulty }}>
      {children}
    </DifficultyContext.Provider>
  );
};

export const useDifficulty = () => useContext(DifficultyContext);
