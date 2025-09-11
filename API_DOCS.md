# Medical Reports API

## Overview

The Medical Reports API allows users to submit medical reports for AI analysis and secure storage on the blockchain. The system automatically analyzes reports for emergency conditions and generates summaries.

## Data Model

Each medical report contains the following fields:

- **wallet**: The user's wallet address (string) - Links the report to the user who owns it
- **text**: The original medical report text (string)
- **summary**: The AI-generated summary of the report (string)
- **emergency**: A boolean indicating if an emergency was detected in the report
- **emergencyMsg**: A message describing the detected emergency (string)
- **createdAt**: The timestamp when the report was created (defaults to the current date/time)

## API Endpoints

### Create Report
```
POST /api/reports
```

**Request Body:**
```json
{
  "wallet": "0x1234567890abcdef",
  "text": "Patient experiencing chest pain..."
}
```

**Response:**
```json
{
  "success": true,
  "reportId": "1757607426994",
  "summary": "Generated summary...",
  "emergency": true,
  "emergencyMsg": "Emergency detected: chest pain",
  "createdAt": "2025-09-11T16:17:06.994Z"
}
```

### Get Report by ID
```
GET /api/reports/:reportId
```

**Response:**
```json
{
  "reportId": "1757607426994",
  "wallet": "0x1234567890abcdef",
  "text": "Original report text...",
  "summary": "Generated summary...",
  "emergency": true,
  "emergencyMsg": "Emergency detected: chest pain",
  "createdAt": "2025-09-11T16:17:06.994Z"
}
```

### Get User Reports
```
GET /api/reports/user/:wallet
```

**Response:**
```json
{
  "reports": [
    {
      "reportId": "1757607426994",
      "wallet": "0x1234567890abcdef",
      "text": "Original report text...",
      "summary": "Generated summary...",
      "emergency": true,
      "emergencyMsg": "Emergency detected: chest pain",
      "createdAt": "2025-09-11T16:17:06.994Z"
    }
  ]
}
```

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-09-11T16:17:06.994Z"
}
```

## Emergency Detection

The system automatically scans report text for emergency keywords including:
- chest pain
- heart attack
- stroke
- seizure
- emergency
- urgent
- critical
- severe pain
- difficulty breathing
- unconscious
- blood loss
- accident
- trauma

When emergency conditions are detected, the `emergency` field is set to `true` and a descriptive message is provided in `emergencyMsg`.

## Installation and Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Run tests:
```bash
npm test
```

The server runs on port 3000 by default.

## Smart Contract

The project includes a Solidity smart contract (`contracts/MedicalReports.sol`) for storing medical reports on the blockchain. The contract provides functions to:

- Create new medical reports
- Retrieve reports by ID
- Get all reports for a specific user
- Track total number of reports

## Development

For development with auto-reload:
```bash
npm run dev
```

## Future Enhancements

- Integration with actual AI/ML services for more sophisticated text analysis
- Blockchain deployment and integration
- Enhanced security and authentication
- Real-time notifications for emergency reports
- IPFS integration for secure file storage