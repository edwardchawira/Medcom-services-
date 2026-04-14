"use client";

import { useQuery } from "@tanstack/react-query";

type DashboardResponse = {
  user: { fullName: string };
  certificatesCount: number;
  continueCourse: null | { title: string; progress: number; resumePath: string };
  recentActivity: { kind: "started" | "completed"; title: string; updatedAt: string; badge: string }[];
};

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async (): Promise<DashboardResponse> => {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load dashboard");
      return (await res.json()) as DashboardResponse;
    },
  });
}

