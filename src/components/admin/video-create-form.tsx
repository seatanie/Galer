"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVideo } from "@/lib/supabase/content-actions";
import { MediaUpload } from "./media-upload";

export function VideoCreateForm() {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    if (videoUrl) formData.set("video_url", videoUrl);
    if (posterUrl) formData.set("poster_url", posterUrl);
    const result = await createVideo(formData);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  return (
    <form action={handleSubmit} className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
      <input
        name="title"
        required
        placeholder="Título del video"
        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
      />
      <input
        name="video_url"
        placeholder="URL del video (o sube abajo)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
      />
      <MediaUpload folder="videos" accept="video/*" onUploaded={setVideoUrl} label="Subir video → Storage" />
      <MediaUpload folder="videos/posters" onUploaded={setPosterUrl} label="Poster" />
      <textarea
        name="description"
        placeholder="Descripción"
        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
      />
      <button type="submit" className="w-full rounded-lg bg-violet-600 py-3 text-sm text-white">
        Publicar video
      </button>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </form>
  );
}
