import React, { useState } from "react";
import { FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import "./index.css";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setText("");
    setSummary("");
    setError("");
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setFile(null);
    setSummary("");
    setError("");
  };

  const analyze = async () => {
    setIsAnalyzing(true);
    setSummary("");
    setError("");
    try {
      let inputText = text;
      if (file) {
        const fileContent = await file.text();
        inputText = fileContent;
      }
      const res = await fetch("http://localhost:3001/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Analysis failed");
      }
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setText("");
    setSummary("");
    setError("");
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError("Unable to retrieve your location.")
    );
  };

  const findHospitals = async () => {
    if (!location) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=hospital&limit=5&viewbox=${location.lng-0.1},${location.lat+0.1},${location.lng+0.1},${location.lat-0.1}`
      );
      const data = await res.json();
      setHospitals(data);
      if (data.length === 0) setError("No hospitals found nearby.");
    } catch {
      setError("Failed to fetch hospitals.");
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center px-4">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 max-w-lg w-full">
        <div className="flex items-center justify-center mb-4">
          <FileText size={32} className="text-blue-400 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">MedLoop</h1>
        </div>
        <p className="text-gray-500 mb-6 text-center">
          Securely Analyze Your Medical Reports
        </p>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="mb-3 block w-full"
        />
        <div className="relative mb-3">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white placeholder-gray-400"
            rows={5}
            placeholder="Or paste your medical report text here..."
            value={text}
            onChange={handleTextChange}
            disabled={!!file}
          />
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={analyze}
            disabled={isAnalyzing || (!file && !text.trim())}
            className={`flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-white transition ${
              isAnalyzing || (!file && !text.trim())
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Analyzing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2" /> Analyze
              </>
            )}
          </button>
          <button
            onClick={reset}
            disabled={isAnalyzing}
            className="flex items-center justify-center px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
        {summary && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-bold mb-2 flex items-center text-blue-700">
              <CheckCircle2 className="mr-2" /> Summary
            </h2>
            <pre className="whitespace-pre-wrap font-sans text-gray-800">{summary.summary}</pre>
            {summary.emergency && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <strong>⚠️ Emergency Detected!</strong> {summary.emergencyMsg}
                <button
                  onClick={() => {
                    getLocation();
                    setTimeout(findHospitals, 2000); // fetch hospitals after location
                  }}
                  className="ml-4 bg-red-600 text-white px-3 py-1 rounded"
                  disabled={isAnalyzing}
                >
                  Find Nearest Hospitals
                </button>
                <a href="tel:911" className="ml-4 bg-yellow-500 text-white px-3 py-1 rounded">Call Emergency</a>
              </div>
            )}
            {hospitals.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">Nearby Hospitals:</h3>
                <ul>
                  {hospitals.map((h, i) => (
                    <li key={i}>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lon}`} target="_blank" rel="noopener noreferrer">
                        {h.display_name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {location && hospitals.length === 0 && (
              <div className="mt-2 text-blue-600 flex items-center">
                <Loader2 className="animate-spin mr-2" /> Searching for hospitals near you...
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="flex items-center text-red-600 mb-4">
            <AlertCircle className="mr-2" /> {error}
          </div>
        )}
        <p className="mt-6 text-xs text-gray-500 text-center">
          <strong>Disclaimer:</strong> MedLoop provides AI-generated summaries and emergency detection for informational purposes only. Always consult a healthcare professional for medical advice or emergencies.
        </p>
      </div>
    </div>
  );
}

export default App;