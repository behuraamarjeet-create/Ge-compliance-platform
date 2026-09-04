"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export function AppShell({ children, title, breadcrumb }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("atc_user");
    if (!storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const developerRoute = pathname === "/audit" || pathname === "/settings";
      const officerRoute =
        pathname === "/search" ||
        pathname === "/tenders" ||
        pathname === "/verification" ||
        pathname.startsWith("/tender/") ||
        pathname.startsWith("/bidder/");
      const allowed =
        (user.role === "Developer" && developerRoute) ||
        (user.role === "Procurement Officer" && officerRoute);

      if (!allowed) {
        router.replace(user.role === "Developer" ? "/settings" : "/search");
        return;
      }
      setAuthorized(true);
    } catch {
      localStorage.removeItem("atc_user");
      router.replace("/login");
    }
  }, [pathname, router]);

  if (!authorized) return null;

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
