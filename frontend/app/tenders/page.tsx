"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// /tenders just redirects to search — the search IS the tender discovery workflow
export default function TendersPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/search");
  }, [router]);
  return null;
}
