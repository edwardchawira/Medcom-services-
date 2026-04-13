"use client";

import { useQuery } from "@tanstack/react-query";

type MeResponse =
  | { user: null }
  | {
      user: {
        id: string;
        email: string | null;
        fullName: string;
      };
    };

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<MeResponse> => {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load user");
      return (await res.json()) as MeResponse;
    },
  });
}

