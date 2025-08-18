// backend/server.js
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");
const cors = require("cors");
const medAgent = require("./agents/mediAgent");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Health check endpoint for GET /
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const formData = new FormData();
  formData.append("file", req.file.buffer, req.file.originalname);

  try {
    const pinataRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: process.env.PINATA_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET,
        },
      }
    );
    res.json({ ipfsHash: pinataRes.data.IpfsHash });
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    res.status(500).json({ error: "Failed to upload file to IPFS." });
  }
});

app.post("/analyze", async (req, res) => {
  const { ipfsHash } = req.body;

  if (!ipfsHash) {
    return res.status(400).json({ error: "IPFS hash is required." });
  }

  try {
    // 1. Fetch content from IPFS
    // Note: This assumes the uploaded file is text-based. For PDFs or images,
    // an OCR step would be needed here.
    const fileUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    const fileRes = await axios.get(fileUrl);
    const textToAnalyze =
      typeof fileRes.data === "object"
        ? JSON.stringify(fileRes.data)
        : fileRes.data.toString();

    if (!textToAnalyze) {
      return res.status(400).json({ error: "Could not read content from IPFS hash." });
    }

    // 2. Run the agent with the fetched text
    const result = await medAgent.runAction("summarize-doc", { input: { text: textToAnalyze } });
    res.json({ summary: result });
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze document." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Agent server running on http://localhost:${PORT}`);
});