"use client";

import { useState } from "react";
import NextImage from "next/image";
import {
  X, ZoomIn, ZoomOut, RotateCw, Download, Maximize2, Database, Clock, CheckCircle2, XCircle, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  doc: any;
  verificationResult?: any;
}

export default function DocumentViewer({ isOpen, onClose, doc, verificationResult }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  if (!isOpen || !doc) return null;

  const attr = doc.attributes;
  const fileUrl = `${STRAPI}${attr.url}`;
  const isPdf = attr.mime?.includes("pdf") || attr.ext === ".pdf";
  const isImage = attr.mime?.startsWith("image/");

  // Try to extract evidence from verificationResult for this document
  const vr = verificationResult || {};
  const checks = vr.checks || {};
  const evidenceItems = Object.entries(checks)
    .filter(([, check]: [string, any]) => check?.submitted || check?.verified)
    .map(([key, check]: [string, any]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
      status: check.status,
      submitted: check.submitted || {},
      verified: check.verified || {},
      reason: check.reason,
      source: check.source,
    }));

  const getStatusIcon = (status: string) => {
    if (status === "PASS") return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
    if (status === "FAIL") return <XCircle className="w-3.5 h-3.5 text-red-500" />;
    return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-stretch backdrop-blur-sm animate-fade-in">
      <div className={cn(
        "bg-white flex flex-col w-full",
        fullscreen ? "" : "m-4 rounded-2xl shadow-elevated overflow-hidden"
      )}>
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center">
              <span className="text-navy-700 text-sm">{isPdf ? "PDF" : "IMG"}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 leading-tight">{attr.name}</h3>
              <p className="text-2xs text-gray-400">{attr.mime} · Document Viewer</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Zoom controls (images only) */}
            {isImage && (
              <>
                <button
                  onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                  title="Reset zoom"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-gray-200 mx-1" />
              </>
            )}
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              title="Toggle fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body: document + evidence panel */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Document area */}
          <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-4">
            {isImage ? (
              <div
                className="relative shadow-elevated rounded overflow-hidden"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: "transform 0.2s ease",
                  width: "100%",
                  maxWidth: "800px",
                  aspectRatio: "4/3",
                }}
              >
                <NextImage
                  src={fileUrl}
                  alt={attr.name}
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </div>
            ) : isPdf ? (
              <iframe
                src={`${fileUrl}#toolbar=0`}
                className="w-full h-full border-0 rounded-lg shadow-card"
                title="Document Viewer"
              />
            ) : (
              <div className="text-center text-gray-500">
                <p className="text-sm">Preview not available for this file type.</p>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-navy-700 text-sm underline mt-2 inline-block">
                  Open in new tab
                </a>
              </div>
            )}
          </div>

          {/* Evidence panel */}
          <div className="w-80 border-l border-gray-100 flex flex-col flex-shrink-0 overflow-hidden bg-white">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 flex-shrink-0">
              <Database className="w-4 h-4 text-navy-700" />
              <h4 className="text-sm font-semibold text-gray-900">Document Verification</h4>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {evidenceItems.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="w-7 h-7 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 text-center">
                    No verification data yet.<br />Run verification first.
                  </p>
                </div>
              ) : (
                evidenceItems.map((item) => (
                  <div key={item.key} className="border border-gray-100 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(item.status)}
                        <span className={cn(
                          "text-2xs font-bold",
                          item.status === "PASS" ? "text-green-600" :
                          item.status === "FAIL" ? "text-red-600" : "text-amber-600"
                        )}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Submitted vs Verified */}
                    {Object.keys(item.submitted).length > 0 && (
                      <div className="mb-2">
                        <div className="text-2xs text-gray-400 mb-1 font-semibold">Submitted</div>
                        {Object.entries(item.submitted).map(([k, v]) => (
                          <div key={k} className="flex gap-1.5 text-2xs">
                            <span className="text-gray-400 capitalize w-16 flex-shrink-0">{k}:</span>
                            <span className="font-mono text-gray-700 break-all">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {Object.keys(item.verified).length > 0 && (
                      <div className="mb-2">
                        <div className="text-2xs text-gray-400 mb-1 font-semibold">Verified (Database)</div>
                        {Object.entries(item.verified).map(([k, v]) => (
                          <div key={k} className="flex gap-1.5 text-2xs">
                            <span className="text-gray-400 capitalize w-16 flex-shrink-0">{k}:</span>
                            <span className="font-mono text-gray-700 break-all">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.reason && (
                      <div className="mt-2 pt-2 border-t border-gray-100 text-2xs text-gray-500">
                        {item.reason}
                      </div>
                    )}

                    {item.source && (
                      <div className="mt-1.5 flex items-center gap-1 text-2xs text-gray-400">
                        <Database className="w-2.5 h-2.5" />
                        {item.source}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
              <p className="text-2xs text-gray-400 text-center leading-relaxed">
                ⚡ Simulated government database · Not real GOI data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}