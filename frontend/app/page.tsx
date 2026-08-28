"use client";

import { useState } from "react";
import axios from "axios";

export default function VerifyPage() {
  const [gstin, setGstin] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AI_WORKER_URL}/verify`,
        { gstin: gstin }
      );
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to verify. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Bidder Compliance Check</h1>
        
        {/* Input Form */}
        <form onSubmit={handleVerify} className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter GSTIN (e.g., 27AABCU9603R1Z5)"
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
            className="flex-1 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="space-y-4">
            <div className="border p-4 rounded bg-slate-50">
              <h2 className="text-xl font-semibold text-gray-800">{result.company_name}</h2>
              <p className="text-gray-600">GSTIN: {result.gstin}</p>
              <p className="text-sm text-gray-500">Source: {result.source}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded text-center ${result.risk_level === "Low" ? "bg-green-100 text-green-800" : result.risk_level === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                <div className="text-3xl font-bold">{result.compliance_score}</div>
                <div className="text-sm uppercase font-bold">Compliance Score</div>
              </div>
              
              <div className="p-4 rounded text-center bg-blue-50 text-blue-800">
                <div className="text-2xl font-bold">{result.status}</div>
                <div className="text-sm">Risk Level: {result.risk_level}</div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-bold mb-2">Details:</h3>
              <ul className="space-y-1 text-sm">
                <li>✅ GST Check: {result.details.gst_check}</li>
                <li>✅ PAN Check: {result.details.pan_check}</li>
                <li>✅ Udyam Check: {result.details.udyam_check}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}