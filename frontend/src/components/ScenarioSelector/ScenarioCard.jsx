import React from "react";

const typeColors = {
  "Ransomware": "bg-red-200 text-red-800",
  "Data Breach": "bg-blue-200 text-blue-800",
  "Hacktivism": "bg-yellow-200 text-yellow-800",
  "Insider Threat": "bg-green-200 text-green-800",
  "Phishing": "bg-orange-200 text-orange-800",
  "Foreign Adversary": "bg-purple-200 text-purple-800",
};

const ScenarioCard = ({ scenario, onSelect }) => {
  const handleStart = () => {
    if (typeof onSelect === "function") {
      onSelect(scenario.id);
    } else {
      console.warn("onSelect is not a function");
    }
  };

  return (
    <div className={`p-6 rounded-xl shadow ${typeColors[scenario.type] || "bg-gray-100 text-gray-800"}`}>
      <h3 className="text-lg font-bold mb-2">{scenario.name}</h3>
      <p className="mb-3">{scenario.description}</p>
      <p className="text-sm mb-4">
        <span className="font-semibold">Type:</span> {scenario.type} |{" "}
        <span className="font-semibold">Difficulty:</span> {scenario.difficulty}
      </p>
      <button
        onClick={handleStart}
        className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
      >
        Start Simulation
      </button>
    </div>
  );
};

export default ScenarioCard;
