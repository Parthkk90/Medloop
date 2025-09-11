const ReportService = require('../src/services/reportService');

describe('ReportService', () => {
    beforeEach(() => {
        // Clear memory store before each test
        ReportService.memoryStore.clear();
        ReportService.userReportsMap.clear();
    });

    describe('analyzeText', () => {
        test('should detect emergency in text with emergency keywords', () => {
            const text = "Patient experiencing severe chest pain and difficulty breathing";
            const result = ReportService.analyzeText(text);
            
            expect(result.emergency).toBe(true);
            expect(result.emergencyMsg).toContain('chest pain');
            expect(result.emergencyMsg).toContain('difficulty breathing');
            expect(result.summary).toBeDefined();
        });

        test('should not detect emergency in normal text', () => {
            const text = "Patient feeling better after rest. No major concerns.";
            const result = ReportService.analyzeText(text);
            
            expect(result.emergency).toBe(false);
            expect(result.emergencyMsg).toBe('');
            expect(result.summary).toBeDefined();
        });

        test('should generate appropriate summary', () => {
            const text = "Patient visited for routine checkup. Blood pressure normal. Heart rate steady. Overall health good.";
            const result = ReportService.analyzeText(text);
            
            expect(result.summary).toContain('Patient visited for routine checkup');
            expect(result.summary).toContain('Overall health good');
        });
    });

    describe('analyzeAndSaveReport', () => {
        test('should create and save a medical report', async () => {
            const wallet = "0x1234567890abcdef";
            const text = "Patient visited for routine checkup. No issues found.";
            
            const result = await ReportService.analyzeAndSaveReport(wallet, text);
            
            expect(result.reportId).toBeDefined();
            expect(result.wallet).toBe(wallet);
            expect(result.text).toBe(text);
            expect(result.summary).toBeDefined();
            expect(result.emergency).toBe(false);
            expect(result.createdAt).toBeDefined();
        });

        test('should create emergency report when emergency detected', async () => {
            const wallet = "0x1234567890abcdef";
            const text = "Patient brought in with severe chest pain and heart attack symptoms";
            
            const result = await ReportService.analyzeAndSaveReport(wallet, text);
            
            expect(result.emergency).toBe(true);
            expect(result.emergencyMsg).toContain('chest pain');
            expect(result.emergencyMsg).toContain('heart attack');
        });
    });

    describe('getReport and getUserReports', () => {
        test('should retrieve saved report by ID', async () => {
            const wallet = "0x1234567890abcdef";
            const text = "Test report";
            
            const savedReport = await ReportService.analyzeAndSaveReport(wallet, text);
            const retrievedReport = await ReportService.getReport(savedReport.reportId);
            
            expect(retrievedReport).toEqual(savedReport);
        });

        test('should retrieve all reports for a user', async () => {
            const wallet = "0x1234567890abcdef";
            
            await ReportService.analyzeAndSaveReport(wallet, "Report 1");
            await ReportService.analyzeAndSaveReport(wallet, "Report 2");
            
            const userReports = await ReportService.getUserReports(wallet);
            
            expect(userReports).toHaveLength(2);
            expect(userReports[0].text).toBe("Report 1");
            expect(userReports[1].text).toBe("Report 2");
        });

        test('should return empty array for user with no reports', async () => {
            const wallet = "0xnonexistent";
            
            const userReports = await ReportService.getUserReports(wallet);
            
            expect(userReports).toEqual([]);
        });
    });
});