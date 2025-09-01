const express = require("express");
const router = express.Router();
const medAgent = require("../agents/mediAgent");
const Report = require("../models/Report");

router.post("/", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required for analysis." });
  }
  try {
    const result = await medAgent.runAction("summarize-doc", { input: { text } });
    // Save to MongoDB
    const report = new Report({
      text,
      summary: result.summary,
      emergency: result.emergency,
      emergencyMsg: result.emergencyMsg
    });
    await report.save();
    res.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Failed to analyze document." });
  }
});

module.exports = router;