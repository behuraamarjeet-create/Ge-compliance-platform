"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Search,
  FileText,
  ShieldCheck,
  ClipboardList,
  Settings,
  ChevronRight,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/search", icon: LayoutDashboard, label: "Home", roles: ["Procurement Officer"] },
  { href: "/search", icon: Search, label: "Tender Search", exact: false, roles: ["Procurement Officer"] },
  { href: "/tenders", icon: FileText, label: "Tenders", roles: ["Procurement Officer"] },
  { href: "/verification", icon: ShieldCheck, label: "Verification", roles: ["Procurement Officer"] },
  { href: "/audit", icon: ClipboardList, label: "Audit Logs", roles: ["Developer"] },
  { href: "/settings", icon: Settings, label: "Settings", roles: ["Developer"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState("Procurement Officer");

  useEffect(() => {
    const storedUser = localStorage.getItem("atc_user");
    if (!storedUser) return;
    try {
      const user = JSON.parse(storedUser);
      if (user.role === "Developer" || user.role === "Procurement Officer") {
        setRole(user.role);
      }
    } catch {
      localStorage.removeItem("atc_user");
    }
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact === false) return pathname.startsWith(href);
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="sidebar-gradient fixed left-0 top-0 h-full flex flex-col z-40"
      style={{ width: "var(--sidebar-width)" }}>

      {/* Logo / Brand */}
      <div className="px-4 py-5 border-b border-white/8 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white text-sm font-bold leading-tight">AI Tender</div>
            <div className="text-white/50 text-2xs leading-tight">Compliance Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <div className="section-label text-white/30 px-3 mb-2">Navigation</div>

        {navItems.filter((item) => item.roles.includes(role)).map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link key={item.label + item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer group",
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/50 hover:bg-white/8 hover:text-white/80"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-white" : "text-white/40 group-hover:text-white/60")} />
                <span>{item.label}</span>
                {active && <ChevronRight className="w-3 h-3 ml-auto text-white/40" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Demo Notice */}
      <div className="px-3 py-2 mx-3 mb-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <div className="text-amber-400 text-2xs font-semibold uppercase tracking-wide">
          ⚡ Demo Mode
        </div>
        <div className="text-amber-400/70 text-2xs mt-0.5 leading-relaxed">
          Simulated government databases
        </div>
      </div>

      {/* Officer Profile */}
      <div className="border-t border-white/8 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-navy-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {role === "Developer" ? "DE" : "PO"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold truncate">{role}</div>
            <div className="text-white/40 text-2xs truncate">
              {role === "Developer" ? "developer@example.com" : "officer@gov.in"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
