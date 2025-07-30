// backend/agents/medAgent.js
const { createAgent } = require("agentkit");

const medAgent = createAgent({
  id: "medloop-agent",
  actions: [
    {
      id: "summarize-doc",
      description: "Summarize uploaded medical report",
      handler: async ({ input }) => {
        // Simulate real LLM call
        return `
          Diagnosis Summary:
          - Low hemoglobin levels indicate possible anemia.
          - Suggest iron supplements and recheck in 3 weeks.
          - No signs of infection based on WBC count.
        `;
      },
    },
  ],
});

module.exports = medAgent;