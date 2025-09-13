import { useState, useRef } from "react";
import { FileText, Loader2, CheckCircle2, AlertCircle, UploadCloud } from "lucide-react";
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

  const handleTextChange = (e) => {
    setText(e.target.value);
    setFile(null);
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
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4 relative">
      <div className="bg-icons">
        <svg style={{ top: "10%", left: "5%", position: "absolute" }} width="48" height="48" fill="#fff" opacity="0.08">
          <rect width="48" height="48" rx="12" />
        </svg>
        <svg style={{ top: "60%", left: "80%", position: "absolute" }} width="48" height="48" fill="#fff" opacity="0.08">
          <circle cx="24" cy="24" r="20" />
        </svg>
      </div>
      <div className="relative z-10 bg-white bg-opacity-95 rounded-3xl shadow-2xl p-12 max-w-xl w-full flex flex-col items-center card-animate">
        <div className="flex items-center justify-center mb-6">
          <FileText size={40} className="text-pink-500 mr-3" />
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">MedLoop</h1>
        </div>
        <p className="text-gray-600 mb-8 text-center text-lg font-medium">Securely Analyze Your Medical Reports</p>
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
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4 bg-pink-50"
          rows={7}
          value={text}
          onChange={handleTextChange}
          aria-label="Paste medical report text here"
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
              <>
                <CheckCircle2 className="mr-2" /> Analyze
              </>
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
    </div>
  );
}

export default App;