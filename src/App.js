// src/App.js
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [address, setAddress] = useState(null);
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install Coinbase Wallet");
      return;
    }
    const provider = new window.coinbaseWalletSDK.Provider({
      appName: "MedLoop",
    });
    await provider.enable();
    const accounts = await provider.request({ method: "eth_accounts" });
    setAddress(accounts[0]);
  };

  const uploadToIPFS = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS",  formData, {
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET,
          "Content-Type": "multipart/form-data",
        },
      });
      setIpfsHash(res.data.IpfsHash);
      alert("Document uploaded to IPFS!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  const analyzeDocument = async () => {
    if (!ipfsHash) {
      alert("Please upload a document to IPFS first.");
      return;
    }

    try {
      // 1. Fetch the document content from IPFS via the Pinata gateway
      // Note: This assumes the uploaded file is text-based. For PDFs or images,
      // a text extraction step (OCR) would be needed on the backend.
      const fileRes = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      const textToAnalyze = typeof fileRes.data === 'object' ? JSON.stringify(fileRes.data) : fileRes.data.toString();

      if (!textToAnalyze) {
        alert("Could not read content from the uploaded file.");
        return;
      }

      // 2. Send the actual file content to your analysis server
      // Note: The frontend calls port 5000, while your MCP server is on 3001.
      // This assumes a separate analysis server is running on 5000 for now.
      const analysisRes = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: JSON.stringify({ text: textToAnalyze }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await analysisRes.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("Analysis failed:", err);
      alert("Failed to analyze the document.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">🩺 MedLoop</h1>
      {!address ? (
        <button onClick={connectWallet} className="bg-blue-500 text-white px-4 py-2 rounded">
          Connect Wallet
        </button>
      ) : (
        <p>Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
      )}

      <div className="mt-6">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={uploadToIPFS} className="ml-2 bg-green-500 text-white px-4 py-2 rounded">
          Upload Document
        </button>
      </div>

      {ipfsHash && (
        <p className="mt-2 text-sm text-gray-600">
          IPFS Hash: <a href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}  target="_blank" rel="noopener noreferrer">{ipfsHash}</a>
        </p>
      )}

      <button onClick={analyzeDocument} className="mt-4 bg-purple-500 text-white px-4 py-2 rounded">
        Analyze Report
      </button>

      {summary && (
        <div className="mt-4 p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Agent Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;