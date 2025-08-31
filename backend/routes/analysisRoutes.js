const express = require('express');
const router = express.Router();
const { analyzeMedicalReport } = require('../agents/mediAgent');

router.post('/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided for analysis.' });
  }

  try {
    const summary = await analyzeMedicalReport(text);
    res.json({ summary });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze medical report.' });
  }
});

module.exports = router;


// Import Express and create a router instance.

// This sets up routing for your analysis endpoints.
// Import your medical report analysis logic from the agent file.

// This function will handle the actual analysis of the report text.
// Define a POST route for analyzing medical reports.

// The route should accept a request body containing the report text.
// Validate the request body.

// If no text is provided, respond with a 400 error and a helpful message.
// Call your analysis function and handle the result.

// Use async/await to process the report and send back the summary.
// Add error handling for failed analysis.

// Log errors and respond with a 500 status and error message.
// Export the router for use in your main server file.

// This allows your server to use these routes under a specific path.