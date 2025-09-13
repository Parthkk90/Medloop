const express = require("express");
const router = express.Router();
const medAgent = require("../agents/mediAgent");
const Report = require("../models/Report");

// POST /api/analysis
router.post("/", async (req, res) => {
  try {
    const { text, wallet } = req.body;
    if (!text || !wallet) {
      return res.status(400).json({ error: "Text and wallet address are required." });
    }

    const result = await medAgent.runAction("summarize-doc", { input: { text } });

    if (!result || !result.summary) {
      console.error("MedAgent analysis failed or returned incomplete data:", result);
      return res.status(500).json({ error: "Failed to analyze document due to agent error." });
    }

    const report = new Report({
      wallet,
      text,
      summary: result.summary,
      emergency: result.emergency,
      emergencyMsg: result.emergencyMsg
    });    

    await report.save()
    .catch(err => {
      console.error("Error saving report:", err);
      return res.status(500).json({ error: "Failed to save the analysis report." });
    });

    res.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Failed to analyze document." });
  }
});

// GET /api/analysis/:wallet
router.get("/:wallet", async (req, res) => {
  try {
    const reports = await Report.find({ wallet: req.params.wallet }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch reports." });
  }
});

module.exports = router;