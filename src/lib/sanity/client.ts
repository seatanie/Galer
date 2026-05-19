import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

let _client: SanityClient | null = null;

export function getSanityClient(preview = false): SanityClient | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return null;

  if (!_client || preview) {
    _client = createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2024-01-01",
      useCdn: !preview && process.env.NODE_ENV === "production",
      token: preview ? process.env.SANITY_API_TOKEN : process.env.SANITY_API_TOKEN,
      perspective: preview ? "previewDrafts" : "published",
    });
  }
  return _client;
}

export function urlFor(source: SanityImageSource) {
  const client = getSanityClient();
  if (!client) throw new Error("Sanity no configurado");
  return imageUrlBuilder(client).image(source);
}

export * from "./queries";
export * from "./types";
