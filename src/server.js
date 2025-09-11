const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ReportService = require('./services/reportService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/reports', async (req, res) => {
    try {
        const { wallet, text } = req.body;
        
        if (!wallet || !text) {
            return res.status(400).json({ 
                error: 'Wallet address and report text are required' 
            });
        }
        
        const result = await ReportService.analyzeAndSaveReport(wallet, text);
        
        res.status(201).json({
            success: true,
            reportId: result.reportId,
            summary: result.summary,
            emergency: result.emergency,
            emergencyMsg: result.emergencyMsg,
            createdAt: result.createdAt
        });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ 
            error: 'Failed to create report',
            details: error.message 
        });
    }
});

app.get('/api/reports/:reportId', async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await ReportService.getReport(reportId);
        
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        
        res.json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ 
            error: 'Failed to fetch report',
            details: error.message 
        });
    }
});

app.get('/api/reports/user/:wallet', async (req, res) => {
    try {
        const { wallet } = req.params;
        const reports = await ReportService.getUserReports(wallet);
        
        res.json({ reports });
    } catch (error) {
        console.error('Error fetching user reports:', error);
        res.status(500).json({ 
            error: 'Failed to fetch user reports',
            details: error.message 
        });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`MedLoop server running on port ${PORT}`);
});

module.exports = app;