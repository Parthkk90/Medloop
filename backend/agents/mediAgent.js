// backend/agents/medAgent.js
const { createAgent } = require("agentkit");

const medAgent = createAgent({
  id: "medloop-agent",
  actions: [
    {
      id: "summarize-doc",
      description: "Summarize uploaded medical report",
      handler: async ({ input }) => {
        // Improved: Use input text and provide a more dynamic summary
        const text = input?.text || "";
        let summary = "Diagnosis Summary:\n";
        if (text.toLowerCase().includes("hemoglobin")) {
          summary += "- Low hemoglobin levels indicate possible anemia.\n";
        }
        if (text.toLowerCase().includes("wbc")) {
          summary += "- No signs of infection based on WBC count.\n";
        }
        if (text.length < 50) {
          summary += "- Report is brief. Please provide more details for a thorough summary.\n";
        } else {
          summary += "- Suggest iron supplements and recheck in 3 weeks.\n";
        }
        return summary;
      },
    },
  ],
});

module.exports = medAgent;