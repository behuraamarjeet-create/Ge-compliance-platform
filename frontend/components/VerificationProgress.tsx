"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: "fetch", label: "Fetching bidder information" },
  { id: "docs", label: "Reading submitted documents" },
  { id: "extract", label: "Extracting identity information" },
  { id: "gst", label: "Checking GST Registration (GSTN)" },
  { id: "pan", label: "Verifying PAN (Income Tax Dept.)" },
  { id: "udyam", label: "Checking Udyam / MSME Status" },
  { id: "epfo", label: "Checking EPFO Compliance" },
  { id: "esic", label: "Checking ESIC Compliance" },
  { id: "blacklist", label: "Checking Blacklist / Debarment" },
  { id: "cross", label: "Cross-referencing records" },
  { id: "score", label: "Calculating compliance score" },
  { id: "ai", label: "Generating AI recommendation" },
  { id: "save", label: "Saving verification result" },
] as const;

type StageId = typeof STAGES[number]["id"];
type StageStatus = "pending" | "processing" | "done" | "error";

interface BidderProgress {
  id: number;
  name: string;
  status: "pending" | "processing" | "done" | "error";
}

interface VerificationProgressProps {
  isOpen: boolean;
  total: number;
  current: number;
  currentBidderName: string;
  currentStage: StageId | null;
  stageStatuses: Partial<Record<StageId, StageStatus>>;
  bidders: BidderProgress[];
  onClose?: () => void;
}

export function VerificationProgress({
  isOpen,
  total,
  current,
  currentBidderName,
  currentStage,
  stageStatuses,
  bidders,
  onClose,
}: VerificationProgressProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen) return null;

  const progressPct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-elevated w-full max-w-2xl overflow-hidden animate-slide-up">

        {/* Header */}
        <div className="sidebar-gradient px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">AI Verification Running</h2>
              <p className="text-white/50 text-xs">
                Checking against simulated government databases
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-900">
              Verifying bidder {current} of {total}
            </div>
            <div className="text-sm font-semibold text-navy-700">{progressPct}%</div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-navy-700 to-navy-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Current bidder */}
          {currentBidderName && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Currently processing: <span className="font-semibold text-gray-800">{currentBidderName}</span>
            </div>
          )}

          {/* Stages */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {STAGES.map((stage, i) => {
              const status = stageStatuses[stage.id] ?? "pending";
              const isActive = stage.id === currentStage;

              return (
                <div
                  key={stage.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-xs transition-colors",
                    i > 0 && "border-t border-gray-50",
                    isActive && "bg-blue-50",
                    status === "done" && "opacity-70"
                  )}
                >
                  {status === "done" && <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />}
                  {status === "error" && <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                  {status === "processing" && <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin flex-shrink-0" />}
                  {status === "pending" && <Clock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
                  <span className={cn(
                    "font-medium",
                    status === "done" ? "text-gray-500" : status === "processing" ? "text-gray-900" : "text-gray-400"
                  )}>
                    {stage.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto text-2xs text-blue-600 font-semibold">In progress</span>
                  )}
                  {status === "done" && (
                    <span className="ml-auto text-2xs text-green-600 font-semibold">Done</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bidder summary list */}
        {bidders.length > 0 && (
          <div className="px-6 pb-5">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-navy-700 font-semibold hover:underline flex items-center gap-1 mb-2"
            >
              {showDetails ? "Hide" : "Show"} bidder list ({bidders.length})
            </button>
            {showDetails && (
              <div className="border border-gray-100 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                {bidders.map((b) => (
                  <div key={b.id} className="flex items-center gap-2.5 px-3 py-2 text-xs border-b border-gray-50 last:border-0">
                    {b.status === "done" && <CheckCircle className="w-3 h-3 text-green-500" />}
                    {b.status === "error" && <AlertTriangle className="w-3 h-3 text-red-500" />}
                    {b.status === "processing" && <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />}
                    {b.status === "pending" && <Clock className="w-3 h-3 text-gray-300" />}
                    <span className={cn(
                      "font-medium",
                      b.status === "done" ? "text-gray-500" : b.status === "processing" ? "text-gray-900" : "text-gray-400"
                    )}>{b.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer note */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-2xs text-gray-400 text-center">
            ⚡ Data sourced from simulated government databases · This is a demonstration system
          </p>
        </div>
      </div>
    </div>
  );
}

// Utility hook for running verification and tracking progress
export type { StageId, BidderProgress };
export { STAGES };
