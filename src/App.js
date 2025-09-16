import { useState, useRef } from "react";
import NavBar from "./NavBar";
import { Heart, Loader2, CheckCircle2, AlertCircle, UploadCloud } from "lucide-react";
import "./index.css";
import "./App.css"; // Ensure both CSS files are imported

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setText("");
    setSummary("");
    setError("");
  };


  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setText("");
      setSummary("");
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a40] to-[#23234f]">
  <div className="bg-pixels" style={{ backgroundImage: "url('/pixel-art.svg')" }}></div>
      <NavBar />
      <main className="flex flex-col items-center justify-center w-full pt-32 z-10">
        <div className="bg-[#23234f] bg-opacity-95 rounded-2xl shadow-2xl p-12 max-w-xl w-full flex flex-col items-center border border-pink-400">
          <Heart size={48} className="mb-4 text-pink-400" />
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2 font-mono">Donate</h1>
          <h2 className="text-2xl font-bold text-pink-300 mb-8 font-mono">Securely Analyze Your Medical Reports</h2>
          <div
            className="upload-area w-full mb-4 p-6 border-2 border-dashed border-pink-300 rounded-xl flex flex-col items-center justify-center cursor-pointer transition hover:border-pink-500 bg-pink-50"
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <UploadCloud size={32} className="text-pink-400 mb-2" />
            <span className="text-pink-500 font-semibold">Drag & drop your .txt file here, or click to select</span>
            <input
              type="file"
              accept=".txt"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload medical report file"
            />
            {file && <span className="mt-2 text-gray-700">{file.name}</span>}
          </div>
          <textarea
            className="w-full p-4 rounded-xl bg-[#1a1a40] text-white border border-pink-400 focus:ring-2 focus:ring-pink-400 mb-4"
            rows={7}
          />
          <div className="flex gap-4 mb-6 w-full">
            <button
              onClick={analyze}
              disabled={isAnalyzing || (!file && !text.trim())}
              className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition w-1/2 ${
                isAnalyzing || (!file && !text.trim())
                  ? "bg-pink-300 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
              aria-label="Analyze medical report"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Analyzing...
                </>
              ) : (
                <button className="bg-pink-400 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-pink-500 transition flex items-center gap-2">
                  <CheckCircle2 /> Analyze
                </button>
              )}
            </button>
            <button
              onClick={reset}
              disabled={isAnalyzing}
              className="flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition w-1/2"
              aria-label="Reset form"
            >
              <AlertCircle className="mr-2" /> Reset
            </button>
          </div>
          {error && (
            <div className="flex items-center text-red-600 mb-4">
              <AlertCircle className="mr-2" /> {error}
            </div>
          )}
          {summary && (
            <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-lg w-full">
              <h2 className="text-xl font-bold mb-2 flex items-center text-pink-700">
                <CheckCircle2 className="mr-2" /> Summary
              </h2>
              <pre className="whitespace-pre-wrap font-sans text-gray-800">{summary?.summary}</pre>
            </div>
          )}
          <p className="mt-6 text-xs text-gray-500 text-center">
            <strong>Disclaimer:</strong> MedLoop provides AI-generated summaries and emergency detection for informational purposes only. Always consult a healthcare professional for medical advice or emergencies.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;