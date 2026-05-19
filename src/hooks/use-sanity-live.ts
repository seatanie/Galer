"use client";

import { useCallback, useEffect, useState } from "react";
import type { HomePageData } from "@/lib/sanity/types";

export function useSanityLive(initialData: HomePageData, enabled = true) {
  const [data, setData] = useState<HomePageData>(initialData);
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/sanity/home", { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as HomePageData;
        setData(json);
        setRevision((r) => r + 1);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!enabled) return;

    const onMessage = (e: MessageEvent) => {
      if (e.data === "sanity:refresh") refresh();
    };
    window.addEventListener("message", onMessage);

    const interval = setInterval(refresh, 8000);

    return () => {
      window.removeEventListener("message", onMessage);
      clearInterval(interval);
    };
  }, [enabled, refresh]);

  return { data, revision, refresh };
}
