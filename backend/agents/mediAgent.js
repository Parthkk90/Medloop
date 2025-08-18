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
      description: "Summarize uploaded medical report",
      handler: async ({ input }) => {
        const text = input?.text || "";
        if (!text) {
          return "No text provided to summarize.";
        }

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful medical assistant. Summarize the following medical document, focusing on key diagnoses, metrics, and recommended actions. Present it in a clear, structured format.",
              },
              { role: "user", content: text },
            ],
          });
          return completion.choices[0].message.content;
        } catch (error) {
          console.error("OpenAI API Error:", error);
          throw new Error("Failed to generate summary from OpenAI.");
        }
      },
    },
  ],
};

module.exports = medAgent;