// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const medAgent = require("./agents/mediagent");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  try {
    const result = await medAgent.runAction("summarize-doc", { input: { text } });
    res.json({ summary: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze document." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Agent server running on http://localhost:${PORT}`);
});