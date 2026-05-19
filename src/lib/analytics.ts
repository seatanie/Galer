import { createClient } from "@/lib/supabase/client";

export type AnalyticsEventType =
  | "page_view"
  | "gallery_view"
  | "item_view"
  | "like"
  | "share"
  | "fullscreen";

export async function trackEvent(
  eventType: AnalyticsEventType,
  options?: {
    galleryId?: string;
    galleryItemId?: string;
    metadata?: Record<string, unknown>;
  }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("analytics_events").insert({
    event_type: eventType,
    gallery_id: options?.galleryId ?? null,
    gallery_item_id: options?.galleryItemId ?? null,
    user_id: user?.id ?? null,
    metadata: options?.metadata ?? {},
  });
}
