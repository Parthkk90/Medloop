class ReportService {
    // Simulated AI analysis - in production this would call actual AI services
    static analyzeText(text) {
        const lowerText = text.toLowerCase();
        
        // Simple emergency detection keywords
        const emergencyKeywords = [
            'chest pain', 'heart attack', 'stroke', 'seizure', 'emergency',
            'urgent', 'critical', 'severe pain', 'difficulty breathing',
            'unconscious', 'blood loss', 'accident', 'trauma'
        ];
        
        const emergency = emergencyKeywords.some(keyword => 
            lowerText.includes(keyword)
        );
        
        let emergencyMsg = '';
        if (emergency) {
            const foundKeywords = emergencyKeywords.filter(keyword => 
                lowerText.includes(keyword)
            );
            emergencyMsg = `Emergency detected: ${foundKeywords.join(', ')}`;
        }
        
        // Simple summarization - in production this would use actual AI
        const summary = this.generateSummary(text);
        
        return {
            summary,
            emergency,
            emergencyMsg
        };
    }
    
    static generateSummary(text) {
        // Simple summarization logic - in production use actual AI
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        if (sentences.length <= 2) {
            return text;
        }
        
        // Return first sentence plus last sentence for basic summary
        const firstSentence = sentences[0].trim();
        const lastSentence = sentences[sentences.length - 1].trim();
        
        return `${firstSentence}. ${lastSentence}.`;
    }
    
    static async analyzeAndSaveReport(wallet, text) {
        try {
            // Analyze the text
            const analysis = this.analyzeText(text);
            
            // In a real implementation, this would save to blockchain
            // For now, we'll simulate the save operation
            const reportId = this.generateReportId();
            const createdAt = new Date().toISOString();
            
            const report = {
                reportId,
                wallet,
                text,
                summary: analysis.summary,
                emergency: analysis.emergency,
                emergencyMsg: analysis.emergencyMsg,
                createdAt
            };
            
            // Store in memory for demo (in production: save to blockchain)
            this.saveToMemoryStore(report);
            
            return report;
        } catch (error) {
            throw new Error(`Failed to analyze and save report: ${error.message}`);
        }
    }
    
    static generateReportId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
    
    // In-memory storage for demo purposes
    static memoryStore = new Map();
    static userReportsMap = new Map();
    
    static saveToMemoryStore(report) {
        this.memoryStore.set(report.reportId, report);
        
        // Add to user reports
        if (!this.userReportsMap.has(report.wallet)) {
            this.userReportsMap.set(report.wallet, []);
        }
        this.userReportsMap.get(report.wallet).push(report.reportId);
    }
    
    static async getReport(reportId) {
        return this.memoryStore.get(reportId);
    }
    
    static async getUserReports(wallet) {
        const reportIds = this.userReportsMap.get(wallet) || [];
        return reportIds.map(id => this.memoryStore.get(id)).filter(Boolean);
    }
}

module.exports = ReportService;