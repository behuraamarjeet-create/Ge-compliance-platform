"use client";

import { Bell, ChevronDown } from "lucide-react";

interface TopBarProps {
  title?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export function TopBar({ title, breadcrumb }: TopBarProps) {
  return (
    <header
      className="fixed top-0 right-0 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-30 shadow-[0_1px_0_0_#f0f0f0]"
      style={{
        left: "var(--sidebar-width)",
        height: "var(--topbar-height)",
      }}
    >
      {/* Left: breadcrumb / title */}
      <div>
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav className="flex items-center gap-1.5 text-xs">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300">/</span>}
                <span className={i === breadcrumb.length - 1 ? "text-gray-800 font-semibold" : "text-gray-400 hover:text-gray-600 cursor-pointer"}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        ) : (
          <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Notification */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200" />

        {/* Officer */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-6 h-6 rounded-full bg-navy-900 flex items-center justify-center text-white text-2xs font-bold">
            PO
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-gray-900 leading-tight">Procurement Officer</div>
            <div className="text-2xs text-gray-400 leading-tight">Dept. of Procurement</div>
          </div>
          <ChevronDown className="w-3 h-3 text-gray-400 ml-0.5" />
        </button>
      </div>
    </header>
  );
}
