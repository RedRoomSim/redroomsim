//MOCK DATA FOR SCENARIOS
export const scenarioList = [
  { id: 1, title: "Ransomware Attack", description: "Critical files encrypted.", difficulty: "Hard", type: "Ransomware" },
  { id: 2, title: "Insider Threat", description: "Suspicious privileged account activity.", difficulty: "Easy", type: "Data Breach" },
  { id: 3, title: "Hacktivism Defacement", description: "Website defaced by hacktivists.", difficulty: "Medium", type: "Hacktivism" },
  { id: 4, title: "Data Breach", description: "Sensitive customer data leaked.", difficulty: "Hard", type: "Data Breach" }
];

export const allScenarios = {
  1: {
    title: "Ransomware Attack",
    simulation: [
      {
        prompt: "You detect unusual file encryption activity on a critical server. What is your first action?",
        options: [
          { text: "Isolate the affected server", score: 10, feedback: "Excellent — limits spread.", sdlc: "Containment" },
          { text: "Shut down the server", score: 5, feedback: "Shutting down may cause loss of forensic evidence.", sdlc: "Response" },
          { text: "Notify senior management immediately", score: 0, feedback: "Not wrong, but operational response should happen first.", sdlc: "Communication" }
        ]
      }
    ]
  },
  2: {
    title: "Insider Threat",
    simulation: [
      {
        prompt: "Suspicious admin account activity is detected after hours. What do you do first?",
        options: [
          { text: "Disable the account", score: 10, feedback: "Good — prevents further misuse.", sdlc: "Containment" },
          { text: "Send email warning to staff", score: 0, feedback: "Does not directly address immediate threat.", sdlc: "Communication" },
          { text: "Ignore and monitor", score: 5, feedback: "Passive approach may delay containment.", sdlc: "Detection" }
        ]
      }
    ]
  },
  3: {
    title: "Hacktivism Defacement",
    simulation: [
      {
        prompt: "Your organization's website was defaced. What is your first step?",
        options: [
          { text: "Take website offline immediately", score: 10, feedback: "Good — prevents reputational damage.", sdlc: "Containment" },
          { text: "Contact media to issue statement", score: 5, feedback: "Public comms should wait until response initiated.", sdlc: "Communication" },
          { text: "Ignore temporarily and monitor", score: 0, feedback: "Delaying action worsens impact.", sdlc: "Detection" }
        ]
      }
    ]
  },
  4: {
    title: "Data Breach",
    simulation: [
      {
        prompt: "Large amount of customer data was found exposed online. What do you do?",
        options: [
          { text: "Begin breach investigation and root cause analysis", score: 10, feedback: "Correct approach to understand scope.", sdlc: "Detection" },
          { text: "Permanently delete exposed data immediately", score: 5, feedback: "Premature before understanding full scope.", sdlc: "Containment" },
          { text: "Notify customers immediately", score: 0, feedback: "Disclosure should follow after initial assessment.", sdlc: "Communication" }
        ]
      }
    ]
  }
};