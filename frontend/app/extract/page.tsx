"use client";
import { useState } from "react";
import axios from "axios";

export default function ExtractPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/extract", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-2xl text-blue-800 font-bold mb-6">
        Cloud AI Document Extraction Test
      </h1>

      <div className="w-full max-w-2xl bg-white p-6 rounded shadow">
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            disabled={loading || !file}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Extracting via Cloud AI..." : "Upload & Extract"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4 text-black">
            {/* Extraction Data */}
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-bold mb-2 text-black">Extracted Data:</h3>
              <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(result.extracted_data, null, 2)}
              </pre>
            </div>

            {/* Verification Result */}
            <div
              className={`p-4 rounded border-2 text-black${
                result.verification_result.risk_level === "Low"
                  ? "border-green-500 bg-green-50"
                  : result.verification_result.risk_level === "Medium"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-red-500 bg-red-50"
              }`}
            >
              <h3 className="font-bold text-lg mb-2 text-black">
                Verification Result: {result.verification_result.status}
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">
                  {result.verification_result.compliance_score}/100
                </div>
                <div>
                  <div className="text-sm">
                    Risk Level:{" "}
                    <strong>{result.verification_result.risk_level}</strong>
                  </div>
                  <div className="text-sm">
                    Matched Bidder:{" "}
                    <strong>
                      {result.verification_result.matched_bidder || "None"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div
                  className={`p-2 rounded text-center ${result.verification_result.details.gst_check.includes("Pass") ? "bg-green-200" : "bg-red-200"}`}
                >
                  GST: {result.verification_result.details.gst_check}
                </div>
                <div
                  className={`p-2 rounded text-center ${result.verification_result.details.pan_check.includes("Pass") ? "bg-green-200" : "bg-red-200"}`}
                >
                  PAN: {result.verification_result.details.pan_check}
                </div>
                <div
                  className={`p-2 rounded text-center ${result.verification_result.details.udyam_check.includes("Pass") ? "bg-green-200" : "bg-red-200"}`}
                >
                  Udyam: {result.verification_result.details.udyam_check}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
