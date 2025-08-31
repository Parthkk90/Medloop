// backend/agents/medAgent.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const medAgent = {
  id: "medloop-agent",
  actions: [
    {
      id: "summarize-doc",
      description: "Summarize uploaded medical report and detect emergencies",
      handler: async ({ input }) => {
        const text = input?.text || "";
        if (!text) return { summary: "No text provided.", emergency: false };

        // Simple emergency detection (expand as needed)
        const emergencies = [
          { keyword: "heart attack", message: "Possible heart attack detected!" },
          { keyword: "stroke", message: "Possible stroke detected!" },
          { keyword: "severe anemia", message: "Severe anemia detected!" },
        ];
        let emergency = false;
        let emergencyMsg = "";

        for (const e of emergencies) {
          if (text.toLowerCase().includes(e.keyword)) {
            emergency = true;
            emergencyMsg = e.message;
            break;
          }
        }

        // Demo summary
        let summary = `Summary: ${text.slice(0, 100)}...`;
        if (emergency) summary += `\n\n⚠️ EMERGENCY: ${emergencyMsg}`;

        return { summary, emergency, emergencyMsg };
      },
    },
  ],
  runAction: async function (actionId, payload) {
    const action = this.actions.find((a) => a.id === actionId);
    if (!action) throw new Error("Action not found.");
    return await action.handler(payload);
  },
};

module.exports = medAgent;