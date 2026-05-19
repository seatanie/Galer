"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function PageViewTracker() {
  useEffect(() => {
    trackEvent("page_view", { metadata: { path: window.location.pathname } });
  }, []);
  return null;
}
