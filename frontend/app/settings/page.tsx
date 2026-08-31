"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Brain, Database, Shield, Server, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Info
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

const AI_URL = process.env.NEXT_PUBLIC_AI_WORKER_URL || "http://localhost:8000";
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

type ConnStatus = "checking" | "connected" | "error" | "simulated";

interface DataSource {
  key: string;
  label: string;
  endpoint: string;
  mode: "simulated" | "live";
  status: ConnStatus;
}

const DATA_SOURCES: DataSource[] = [
  { key: "gst", label: "GST (GSTN)", endpoint: "gst-databases", mode: "simulated", status: "checking" },
  { key: "pan", label: "PAN (Income Tax)", endpoint: "pan-databases", mode: "simulated", status: "checking" },
  { key: "udyam", label: "Udyam / MSME", endpoint: "udyam-databases", mode: "simulated", status: "checking" },
  { key: "epfo", label: "EPFO", endpoint: "epfo-databases", mode: "simulated", status: "checking" },
  { key: "esic", label: "ESIC", endpoint: "esic-databases", mode: "simulated", status: "checking" },
  { key: "startup", label: "Startup India (DPIIT)", endpoint: "startup-india-databases", mode: "simulated", status: "checking" },
  { key: "nsic", label: "NSIC", endpoint: "nsic-databases", mode: "simulated", status: "checking" },
  { key: "blacklist", label: "Blacklist Registry", endpoint: "blacklist-databases", mode: "simulated", status: "checking" },
  { key: "gem", label: "GeM Portal", endpoint: "gem-portals", mode: "simulated", status: "checking" },
];

function StatusDot({ status }: { status: ConnStatus }) {
  if (status === "checking") return <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />;
  if (status === "connected" || status === "simulated") return <div className="w-2 h-2 rounded-full bg-green-500" />;
  return <div className="w-2 h-2 rounded-full bg-red-500" />;
}

function StatusLabel({ status }: { status: ConnStatus }) {
  const labels = {
    checking: "Checking…",
    connected: "Connected",
    simulated: "Simulated",
    error: "Unavailable",
  };
  const colors = {
    checking: "text-gray-400",
    connected: "text-green-600",
    simulated: "text-emerald-600",
    error: "text-red-500",
  };
  return <span className={cn("text-xs font-semibold", colors[status])}>{labels[status]}</span>;
}

export default function SettingsPage() {
  const [sources, setSources] = useState(DATA_SOURCES);
  const [aiStatus, setAiStatus] = useState<"checking" | "connected" | "error">("checking");
  const [aiModel, setAiModel] = useState("");
  const [strapiStatus, setStrapiStatus] = useState<"checking" | "connected" | "error">("checking");
  const [aiMode, setAiMode] = useState<"cloud" | "local" | "fallback">("cloud");

  const checkConnections = async () => {
    // Check AI Worker
    try {
      const res = await axios.get(`${AI_URL}/health`, { timeout: 3000 });
      setAiStatus("connected");
      setAiModel(res.data.ai_source || "Gemini Flash");
    } catch {
      setAiStatus("error");
    }

    // Check Strapi
    try {
      await axios.get(`${STRAPI}/api/tenders?pagination[limit]=1`, { timeout: 3000 });
      setStrapiStatus("connected");
    } catch {
      setStrapiStatus("error");
    }

    // Check each data source
    const updated = await Promise.all(
      DATA_SOURCES.map(async (src) => {
        try {
          await axios.get(`${STRAPI}/api/${src.endpoint}?pagination[limit]=1`, { timeout: 3000 });
          return { ...src, status: "simulated" as ConnStatus };
        } catch {
          return { ...src, status: "error" as ConnStatus };
        }
      })
    );
    setSources(updated);
  };

  useEffect(() => {
    checkConnections();
  }, []);

  const connectedSources = sources.filter((s) => s.status === "simulated" || s.status === "connected").length;

  return (
    <AppShell title="Settings" breadcrumb={[{ label: "Settings" }]}>
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Demo banner */}
        <div className="px-5 py-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-amber-800">Demo / Hackathon Mode</div>
            <div className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              This platform uses <strong>simulated government databases</strong> hosted within Strapi.
              No real GSTN, Income Tax, EPFO, ESIC, or Ministry data is accessed.
              This is a prototype for demonstration purposes only.
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-navy-700" />
              <h2 className="text-sm font-semibold text-gray-900">System Status</h2>
            </div>
            <button
              onClick={checkConnections}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Recheck
            </button>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            {[
              {
                label: "AI Worker (FastAPI)",
                status: aiStatus,
                sub: aiStatus === "connected" ? aiModel : aiStatus === "checking" ? "Checking…" : "Not reachable at " + AI_URL,
                icon: <Brain className="w-4 h-4 text-purple-500" />,
              },
              {
                label: "Strapi CMS / Database",
                status: strapiStatus,
                sub: strapiStatus === "connected" ? STRAPI : strapiStatus === "checking" ? "Checking…" : "Not reachable at " + STRAPI,
                icon: <Database className="w-4 h-4 text-blue-500" />,
              },
            ].map(({ label, status, sub, icon }) => (
              <div key={label} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <StatusDot status={status as ConnStatus} />
                    <span className="text-xs font-semibold text-gray-800">{label}</span>
                  </div>
                  <p className="text-2xs text-gray-400 mt-0.5 leading-relaxed">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Configuration */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-500" />
            <h2 className="text-sm font-semibold text-gray-900">AI Configuration</h2>
          </div>
          <div className="p-5">
            <div className="text-xs text-gray-600 mb-4">
              Select the AI mode used for document extraction and recommendation generation.
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(["cloud", "local", "fallback"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAiMode(mode)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all",
                    aiMode === mode
                      ? "border-navy-400 bg-navy-50 ring-1 ring-navy-400"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  )}
                >
                  <div className="text-xs font-bold text-gray-800 capitalize mb-0.5">{mode === "cloud" ? "Cloud AI" : mode === "local" ? "Local AI" : "Fallback"}</div>
                  <div className="text-2xs text-gray-400">
                    {mode === "cloud" ? "Gemini Flash API" : mode === "local" ? "Local LLM (Ollama)" : "Rule-only mode"}
                  </div>
                  {mode === "cloud" && (
                    <div className="mt-1.5 text-2xs text-green-600 font-semibold">● Active</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-navy-700" />
              <h2 className="text-sm font-semibold text-gray-900">Government Database Connectors</h2>
            </div>
            <span className="text-2xs text-gray-400">
              {connectedSources}/{sources.length} available
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {sources.map((src) => (
              <div key={src.key} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <StatusDot status={src.status} />
                  <div>
                    <div className="text-sm font-medium text-gray-800">{src.label}</div>
                    <div className="text-2xs text-gray-400">{src.mode === "simulated" ? "Simulated via Strapi" : "Live connection"} · /api/{src.endpoint}</div>
                  </div>
                </div>
                <StatusLabel status={src.status} />
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-2xs text-gray-400">
              All &quot;Simulated&quot; sources are served from Strapi CMS local database — no real government API calls are made.
            </p>
          </div>
        </div>

        {/* Officer Settings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-navy-700" />
            <h2 className="text-sm font-semibold text-gray-900">Officer Settings</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Officer Name</label>
              <input className="input-base" defaultValue="Procurement Officer" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Department</label>
              <input className="input-base" defaultValue="Dept. of Procurement" />
            </div>
            <button className="px-4 py-2 bg-navy-900 text-white text-sm font-semibold rounded-lg hover:bg-navy-800 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
