"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Code2, Database, GitBranch } from "lucide-react";

export default function DeveloperPage() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("atc_user");
    if (!storedUser) {
      router.replace("/login");
      return;
    }
    try {
      const user = JSON.parse(storedUser);
      if (user.role !== "Developer") router.replace("/search");
    } catch {
      localStorage.removeItem("atc_user");
      router.replace("/login");
    }
  }, [router]);

  return (
    <AppShell title="Developer Dashboard">
      <div className="mb-6">
        <p className="section-label mb-2">Platform workspace</p>
        <h1 className="text-2xl font-semibold text-gray-950">Developer tools</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor integrations and platform services.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "API integrations", icon: GitBranch, value: "6 active" },
          { label: "Data services", icon: Database, value: "All operational" },
          { label: "Environment", icon: Code2, value: "Demo mode" },
        ].map(({ label, icon: Icon, value }) => (
          <div key={label} className="card p-5">
            <Icon className="mb-5 h-5 w-5 text-navy-700" />
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
