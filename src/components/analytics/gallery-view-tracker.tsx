"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function GalleryViewTracker({
  galleryId,
  slug,
}: {
  galleryId?: string;
  slug: string;
}) {
  useEffect(() => {
    trackEvent("gallery_view", { galleryId, metadata: { slug } });
  }, [galleryId, slug]);
  return null;
}
