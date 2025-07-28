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
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import ScoringBar from "../components/SimulationEngine/ScoringBar";
import TimelineViewer from "../components/SimulationEngine/TimelineViewer";
import { useAuth } from "../context/AuthContext";

const Simulation = () => {
  const { scenarioId } = useParams();
  const [searchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get("step")) || 0;
  const initialSimId = searchParams.get("simId");
  const [scenario, setScenario] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [analytics, setAnalytics] = useState({correct: 0, incorrect: 0, startTime: null, endTime: null});
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [lastStepTimestamp, setLastStepTimestamp] = useState(null);
  const [simulationId, setSimulationId] = useState(initialSimId || null);
  const [endedEarly, setEndedEarly] = useState(false);
  const [showHint, setShowHint] = useState(false); // toggle visibility of hints
  const [nextStep, setNextStep] = useState(null); // store id of next step when branching
  const [stepMap, setStepMap] = useState({}); // lookup of step id to index
  const [retry, setRetry] = useState(false); // flag to retry when option leads to null
  const [mitreScores, setMitreScores] = useState({}); // cumulative MITRE ATT&CK counts
  const { user } = useAuth();

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const response = await axios.get(`https://api.redroomsim.com/sim/${scenarioId}`);
        setScenario(response.data);
        const map = {}; // build a map of step id to index for quick lookup
        response.data.steps.forEach((s, idx) => {
          map[s.id] = idx; // store mapping for branch navigation
        });
        setStepMap(map); // save map in state
        const now = Date.now();
        setAnalytics((prev) => ({ ...prev, startTime: now }));
        setStartTime(now); // track when the scenario was first loaded
      } catch (error) {
        console.error("Failed to load scenario", error);
      }
    };
    fetchScenario();
  }, [scenarioId]);

  // initialize progress record when scenario and user are available
  useEffect(() => {
    const createProgress = async () => {
      if (!user || !scenario || simulationId) return;
      try {
        const response = await axios.post("https://api.redroomsim.com/progress/save", {
          scenario_id: scenarioId,
          name: scenario.name,
          username: user.email,
          score: 0,
          completed: false,
        });
        const simId = response.data.simulation_id;
        setSimulationId(simId);
        const existing = JSON.parse(localStorage.getItem("simulationIds") || "[]");
        if (!existing.includes(simId)) {
          localStorage.setItem("simulationIds", JSON.stringify([...existing, simId]));
        }
      } catch (err) {
        console.error("Failed to init progress", err);
      }
    };
    createProgress();
  }, [user, scenario, scenarioId, simulationId]);

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return;

    const step = scenario.steps[currentStepIndex];
    const optionObj = step.options[index]; // may be string or object
    const optionText = optionObj.text || optionObj; // normalize to text
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
    const correctText = step.options[correct].text || step.options[correct]; // show correct text even when objects
    const stepFeedback = isCorrect
      ? "✅ Correct!"
      : `❌ Incorrect. The correct answer was: "${correctText}"`;

    setScore((prev) => (isCorrect ? prev + 1 : prev));
    if (isCorrect && step.mitre_attack) {
      // tally MITRE techniques for scoring display
      setMitreScores((prev) => ({
        ...prev,
        [step.mitre_attack]: (prev[step.mitre_attack] || 0) + 1,
      }));
    }
    setFeedback(stepFeedback);

    setAnalytics((prev) => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
    }));

    setTimeline((prev) => [
      ...prev,
      {
        decision: optionText, // record the actual option text selected
        feedback: stepFeedback,
        timeMs: stepTime,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (simulationId) {
      axios
        .post("https://api.redroomsim.com/progress/step", {
          sim_uuid: simulationId,
          step_index: currentStepIndex,
          decision: optionText,
          feedback: stepFeedback,
          time_ms: stepTime,
        })
        .catch((err) => {
          console.error("Failed to save step", err);
        });
    }

    const nextId = optionObj.next_step; // branch target id if specified
    if (nextId === null) {
      setRetry(true); // null means allow retry instead of progressing
    } else {
      setRetry(false);
    }
    if (nextId !== undefined && nextId !== null && stepMap[nextId] !== undefined) {
      setNextStep(stepMap[nextId]); // jump to mapped step if valid
    } else {
      setNextStep(currentStepIndex + 1); // default to next sequential step
    }
  };

  const handleNextStep = () => {
    setSelectedOption(null); // clear previous selection
    setFeedback(""); // reset feedback message
    setShowHint(false); // hide hint when moving on
    if (retry) {
      setRetry(false); // user opted to retry current step
      return;
    }
    if (nextStep !== null && nextStep < scenario.steps.length) {
      setCurrentStepIndex(nextStep); // jump to branched step
    } else if (currentStepIndex + 1 < scenario.steps.length) {
      setCurrentStepIndex((prev) => prev + 1); // proceed sequentially
    } else {
      setCompleted(true); // simulation finished
      setAnalytics((prev) => ({ ...prev, endTime: Date.now() }));
    }
  };

  const handleEndSimulation = async () => {
    if (!user || !scenario) return;
    setEndedEarly(true);
    setCompleted(true);
    setAnalytics((prev) => ({ ...prev, endTime: Date.now() }));
    try {
      await axios.post("https://api.redroomsim.com/progress/save", {
        scenario_id: scenarioId,
        name: scenario.name,
        username: user.email,
        score: score,
        completed: false,
        sim_uuid: simulationId,
      });
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  useEffect(() => {
    const saveProgress = async () => {
      if (!completed || endedEarly || !user || !scenario) return;
      try {
        await axios.post("https://api.redroomsim.com/progress/save", {
          scenario_id: scenarioId,
          name: scenario.name,
          username: user.email,
          score: score,
          completed: true,
          sim_uuid: simulationId,
        });
      } catch (err) {
        console.error("Failed to save progress", err);
      }
    };
    saveProgress();
  }, [completed, user, scenario, scenarioId, score, simulationId]);

  useEffect(() => {
    return () => {
      if (!completed && user && scenario) {
        axios
          .post("https://api.redroomsim.com/progress/save", {
            scenario_id: scenarioId,
            name: scenario.name,
            username: user.email,
            score: score,
            completed: false,
            sim_uuid: simulationId,
          })
          .catch((err) => {
            console.error("Failed to save progress", err);
          });
      }
    };
  }, [completed, user, scenario, scenarioId, score, simulationId]);

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
              
                <p className="text-xl">
                  {endedEarly ? "Simulation Ended" : "🎉 Simulation Complete!"}
                </p>
                <p className="text-lg">Score: {score} / {scenario.steps.length}</p>
                <p className="text-md text-gray-600 dark:text-gray-300">
                  Duration: {totalDurationSec} seconds
                </p>
                <p className="text-md text-gray-600 dark:text-gray-300">
                  Correct: {analytics.correct} | Incorrect: {analytics.incorrect}
                </p>
                {simulationId && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {/*Simulation ID: {simulationId}*/}
                  </p>
                )}

                {Object.keys(mitreScores).length > 0 && (
                  <div className="text-left mt-4">
                    {/* display counts per MITRE technique */}
                    <h4 className="font-semibold">MITRE ATT&CK Score</h4>
                    <ul className="text-sm">
                      {Object.entries(mitreScores).map(([tech, val]) => (
                        <li key={tech}>{tech}: {val}</li>
                      ))}
                    </ul>
                  </div>
                )}

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
                      {option.text || option} {/* render option text whether string or object */}
                    </button>
                  ))}
                </div>
                {step.hint && !feedback && (
                  <button
                    className="mt-2 text-sm text-blue-600"
                    onClick={() => setShowHint(!showHint)}
                  >
                    {showHint ? "Hide Hint" : "Show Hint"} {/* hint toggle */}
                  </button>
                )}
                {showHint && step.hint && (
                  <p className="mt-2 italic text-sm">{step.hint}</p> /* show hint text */
                )}

                {feedback && (
                  <>
                    <div className="mt-4 text-lg font-medium">{feedback}</div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleNextStep}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {retry ? "Retry" : "Next"} {/* show Retry when option allowed */}
                      </button>
                    </div>
                  </>
                )}
                <div className="justify-top mt-4">
                  <button
                    onClick={handleEndSimulation}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    End Simulation
                  </button>
                </div>
              </div>
            )}
          </div>
        
  );
};

export default Simulation;
