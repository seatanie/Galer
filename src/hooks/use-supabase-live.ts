"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { HomePageData } from "@/types/supabase-content";

export function useSupabaseLive(initialData: HomePageData, enabled = true) {
  const [data, setData] = useState(initialData);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/supabase/home", { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!enabled) return;

    const supabase = createClient();
    const channel = supabase
      .channel("home-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "galleries" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "gallery_items" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "videos" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "hero_rooms" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "hero_slides" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "model_images" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "model_audios" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "model_slots" }, refresh)
      .subscribe();

    const onMessage = (e: MessageEvent) => {
      if (e.data === "supabase:refresh" || e.data === "sanity:refresh") refresh();
    };
    window.addEventListener("message", onMessage);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("message", onMessage);
    };
  }, [enabled, refresh]);

  return { data, refresh };
}
