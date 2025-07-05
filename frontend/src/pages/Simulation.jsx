/*
File:                 Simulation.jsx
Path:                 /src/pages/Simulation.jsx
Author:               Umair Asad
Last Modified By:     Umair Asad
Last Modified Date:   2025-06-15
Version:              1.0.0
Project:              RedRoomSim
License:              MIT
Copyright (c) 2025 RedRoomSim Team
Description:          Page for running a simulation scenario.
Changelog:
 - Initial setup for Simulation page.
 - Integrated SimulationEngine components.
 - Added routing for different simulation scenarios.
 - Improved UI/UX for better user interaction.
 - Dark mode support added
*/

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ScoringBar from "../components/SimulationEngine/ScoringBar";
import TimelineViewer from "../components/SimulationEngine/TimelineViewer";

const Simulation = () => {
  const { scenarioId } = useParams();
  const [scenario, setScenario] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [analytics, setAnalytics] = useState({correct: 0, incorrect: 0, startTime: null, endTime: null});
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [lastStepTimestamp, setLastStepTimestamp] = useState(null);

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/sim/${scenarioId}`);
        setScenario(response.data);
        setAnalytics((prev) => ({ ...prev, startTime: Date.now() }));
      } catch (error) {
        console.error("Failed to load scenario", error);
      }
    };
    fetchScenario();
  }, [scenarioId]);

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return;

    const step = scenario.steps[currentStepIndex];
    const correct = step.correct_option;
    const isCorrect = index === correct;
    
    const currentTimestamp = Date.now();

    if (startTime === null) {
      setStartTime(currentTimestamp);
    }
    const stepTime = currentTimestamp - (lastStepTimestamp || startTime);
    setEndTime(currentTimestamp);
    setLastStepTimestamp(currentTimestamp);

    setSelectedOption(index);
    const stepFeedback = isCorrect
      ? "✅ Correct!"
      : `❌ Incorrect. The correct answer was: "${step.options[correct]}"`;

    setScore((prev) => (isCorrect ? prev + 1 : prev));
    setFeedback(stepFeedback);

    setAnalytics((prev) => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
    }));

    setTimeline((prev) => [
      ...prev,
      {
        decision: step.options[index],
        feedback: stepFeedback,
        timeMs: stepTime,
      },
    ]);
  };

  const handleNextStep = () => {
    setSelectedOption(null);
    setFeedback("");
    if (currentStepIndex + 1 < scenario.steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      setAnalytics((prev) => ({ ...prev, endTime: Date.now() }));
    }
  };

  if (!scenario) return <div className="p-6">Loading scenario...</div>;

  const step = scenario.steps[currentStepIndex];
  const scorePercent = Math.round((score / scenario.steps.length) * 100);
  const totalDurationSec = analytics.endTime
    ? Math.round((analytics.endTime - analytics.startTime) / 1000)
    : null;

  return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center mb-2">{scenario.name}</h2>
          <ScoringBar score={scorePercent} />

          {completed ? (
            <div className="text-center space-y-4">
              
                <p className="text-xl">🎉 Simulation Complete!</p>
                <p className="text-lg">Score: {score} / {scenario.steps.length}</p>
                <p className="text-md text-gray-600 dark:text-gray-300">
                  Duration: {totalDurationSec} seconds
                </p>
                <p className="text-md text-gray-600 dark:text-gray-300">
                  Correct: {analytics.correct} | Incorrect: {analytics.incorrect}
                </p>


              <TimelineViewer timeline={timeline} />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{step.description}</p>

                <div className="space-y-3">
                  {step.options.map((option, index) => (
                    <button
                      key={index}
                      disabled={selectedOption !== null}
                      onClick={() => handleOptionSelect(index)}
                      className={`w-full text-left p-3 rounded border transition
                        ${selectedOption === index ? "bg-blue-100 dark:bg-blue-700" : "bg-gray-50 dark:bg-gray-900"}
                      hover:bg-gray-200 dark:hover:bg-gray-700`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {feedback && (
                  <>
                    <div className="mt-4 text-lg font-medium">{feedback}</div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleNextStep}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        
  );
};

export default Simulation;
