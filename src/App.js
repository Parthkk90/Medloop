// src/App.js
import React, { useState } from "react";

function App() {
  const [address, setAddress] = useState(null);
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      // Note: For Coinbase Wallet, you might need to import and use a library
      // like '@coinbase/wallet-sdk' instead of relying on window.coinbaseWalletSDK
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
      // The backend now handles the IPFS upload securely
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setIpfsHash(data.ipfsHash);
      alert("Document uploaded to IPFS!");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check the console for details.");
    }
  };

  const analyzeDocument = async () => {
    if (!ipfsHash) {
      alert("Please upload a document to IPFS first.");
      return;
    }
    setIsAnalyzing(true);
    setSummary("");

    try {
      // The backend now handles fetching from IPFS and analysis
      const analysisRes = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: JSON.stringify({ ipfsHash }),
        headers: { "Content-Type": "application/json" },
      });

      if (!analysisRes.ok) {
        const errorData = await analysisRes.json();
        throw new Error(errorData.error || "Analysis request failed");
      }

      const data = await analysisRes.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("Analysis failed:", err);
      alert(`Failed to analyze the document: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">🩺 MedLoop</h1>
      <p className="mb-6 text-gray-600">Your AI-Powered Medical Document Analyzer</p>
      {!address ? (
        <button onClick={connectWallet} className="bg-blue-500 text-white px-4 py-2 rounded">
          Connect Wallet
        </button>
      ) : (
        <p>Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Step 1: Upload Report</h2>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2"/>
          <button onClick={uploadToIPFS} disabled={!file} className="ml-2 bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400">
            Upload Document
          </button>
          {ipfsHash && (
            <p className="mt-2 text-sm text-gray-600">
              ✅ Uploaded to IPFS: <a href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}  target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{ipfsHash.slice(0,15)}...</a>
            </p>
          )}
        </div>

        <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Step 2: Analyze</h2>
          <button onClick={analyzeDocument} disabled={!ipfsHash || isAnalyzing} className="bg-purple-500 text-white px-4 py-2 rounded disabled:bg-gray-400">
            {isAnalyzing ? "Analyzing..." : "Analyze Report"}
          </button>
        </div>

        {isAnalyzing && <p className="mt-4 text-gray-700">Please wait, the agent is reading your document...</p>}

        {summary && !isAnalyzing && (
          <div className="mt-6 p-6 bg-white shadow-md rounded-lg text-left">
            <h2 className="text-2xl font-bold mb-3">Agent Summary:</h2>
            <pre className="whitespace-pre-wrap font-sans bg-gray-50 p-4 rounded">{summary}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;