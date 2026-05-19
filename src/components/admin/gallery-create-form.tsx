"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGallery, addGalleryItem } from "@/lib/supabase/content-actions";
import { MediaUpload } from "./media-upload";

export function GalleryCreateForm() {
  const router = useRouter();
  const [coverUrl, setCoverUrl] = useState("");
  const [itemUrl, setItemUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setError(null);
    setMessage(null);
    if (coverUrl) formData.set("cover_image_url", coverUrl);

    const result = await createGallery(formData);
    if (result?.error) {
      setError(result.error);
      return;
    }

    if (itemUrl && result?.id) {
      const fd = new FormData();
      fd.set("gallery_id", result.id);
      fd.set("image_url", itemUrl);
      await addGalleryItem(fd);
    }

    setMessage("Galería creada");
    router.refresh();
  }

  return (
    <form action={handleCreate} className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg text-white">Nueva galería (Supabase Storage)</h2>
      <input
        name="title"
        required
        placeholder="Título"
        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
      />
      <input
        name="slug"
        placeholder="slug-opcional"
        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
      />
      <textarea
        name="description"
        placeholder="Descripción"
        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
      />
      <label className="flex items-center gap-2 text-sm text-white/70">
        <input type="checkbox" name="featured" className="rounded" />
        Destacada
      </label>
      <MediaUpload folder="galleries" onUploaded={setCoverUrl} label="Portada → Storage" />
      {coverUrl && <p className="truncate text-xs text-emerald-400">{coverUrl}</p>}
      <MediaUpload folder="galleries/items" onUploaded={setItemUrl} label="Primera imagen" />
      {itemUrl && <p className="truncate text-xs text-emerald-400">{itemUrl}</p>}
      <button
        type="submit"
        className="w-full rounded-lg bg-violet-600 py-3 text-sm font-medium text-white hover:bg-violet-500"
      >
        Crear galería
      </button>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {message && <p className="text-sm text-emerald-400">{message}</p>}
    </form>
  );
}
