# Medloop

HealthChain: Decentralized Health Records - A blockchain-based platform that enables individuals to own, control, and share their health data securely with healthcare providers. Utilizing smart contracts, HealthChain ensures data privacy and interoperability across the healthcare ecosystem, facilitating personalized care and efficient diagnostics.

## Features

- **Medical Report Management**: Submit and analyze medical reports with AI-powered emergency detection
- **Blockchain Storage**: Secure storage of medical data using smart contracts
- **Emergency Detection**: Automatic identification of emergency conditions in medical reports
- **AI Summarization**: Intelligent summarization of medical reports
- **User-Centric**: Reports are linked to user wallet addresses for ownership and privacy

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

## API Usage

Submit a medical report:
```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{"wallet": "0x1234567890abcdef", "text": "Patient experiencing chest pain..."}'
```

## Documentation

See [API_DOCS.md](API_DOCS.md) for complete API documentation.

## Medical Report Data Structure

Each report includes:
- `wallet`: User's wallet address
- `text`: Original medical report text  
- `summary`: AI-generated summary
- `emergency`: Boolean indicating emergency detection
- `emergencyMsg`: Emergency description if detected
- `createdAt`: Timestamp of report creation

## Technology Stack

- **Backend**: Node.js with Express
- **Smart Contracts**: Solidity
- **Testing**: Jest
- **AI Analysis**: Built-in emergency detection and summarization
