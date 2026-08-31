"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export function AppShell({ children, title, breadcrumb }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-25">
      <Sidebar />
      <TopBar title={title} breadcrumb={breadcrumb} />
      <main
        className="min-h-screen"
        style={{
          marginLeft: "var(--sidebar-width)",
          paddingTop: "var(--topbar-height)",
        }}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
