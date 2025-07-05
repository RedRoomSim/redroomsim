/*
File:                 ScenarioSelectorPage.jsx
Path:                 /src/pages/ScenarioSelectorPage.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Scenario selection screen.
Changelog:
 - Initial setup for ScenarioSelectorPage component.
 - Integrated scenario filtering and selection features.
 - Implemented responsive design for better user experience.
 - Added dark mode support for better user experience.
*/

// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import ScenarioList from "../components/ScenarioSelector/ScenarioList";
import ScenarioFilterPanel from "../components/ScenarioSelector/ScenarioFilterPanel";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ScenarioSelectorPage = () => {
  const [scenarios, setScenarios] = useState([]);
  const [filters, setFilters] = useState({ difficulty: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/sim/list");
        setScenarios(response.data.scenarios || []);
      } catch (err) {
        console.error("Failed to fetch scenarios", err);
      }
    };

    fetchScenarios();
  }, []);

  const filteredScenarios = scenarios.filter((s) => {
    const diffMatch = filters.difficulty ? s.difficulty === filters.difficulty : true;
    const typeMatch = filters.type ? s.type === filters.type : true;
    return diffMatch && typeMatch;
  });

  const handleScenarioSelect = (scenarioId) => {
    navigate(`/simulation/${scenarioId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Select a Scenario</h1>
      <ScenarioFilterPanel filters={filters} onChange={setFilters} scenarios={scenarios} />
      <ScenarioList scenarios={filteredScenarios} onSelect={handleScenarioSelect} />
    </div>
  );
};

export default ScenarioSelectorPage;