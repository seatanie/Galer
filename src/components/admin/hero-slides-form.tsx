"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHeroSlide, deleteHeroSlide } from "@/lib/supabase/content-actions";
import { MediaUpload } from "./media-upload";
import { Trash2, Image as ImageIcon } from "lucide-react";
import type { HeroSlide } from "@/types/supabase-content";

interface Props {
  slides: HeroSlide[];
}

export function HeroSlidesForm({ slides }: Props) {
  const router = useRouter();
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setUploadedUrl("");
    setLinkUrl("");
    setError(null);
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    const finalUrl = uploadedUrl || linkUrl;
    if (!finalUrl) {
      setError("Pon una URL o sube un archivo");
      return;
    }
    formData.set("image_url", finalUrl);
    const result = await createHeroSlide(formData);
    if (result?.error) setError(result.error);
    else {
      resetForm();
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este slide?")) return;
    await deleteHeroSlide(id);
    router.refresh();
  }

  const previewUrl = uploadedUrl || linkUrl;

  return (
    <div className="space-y-6">
      <form action={handleSubmit} className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="flex items-center gap-2 text-sm font-medium text-white/70">
          <ImageIcon className="h-4 w-4 text-violet-400" />
          Nuevo slide
        </h3>

        <div className="space-y-2">
          <label className="text-xs text-white/50">URL de imagen (Pinterest, Unsplash...)</label>
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://i.pinimg.com/..."
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#050505] px-2 text-xs text-white/30">o sube desde tu PC</span>
          </div>
        </div>

        <MediaUpload folder="hero-slides" onUploaded={setUploadedUrl} label="Subir imagen → Storage" />

        <input
          name="title"
          placeholder="Título (opcional)"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30"
        />
        <textarea
          name="description"
          placeholder="Descripción (opcional)"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30"
        />
        <input
          name="order_index"
          type="number"
          defaultValue={slides.length}
          placeholder="Orden"
          className="w-24 rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30"
        />
        {previewUrl && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
          </div>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-violet-600 py-3 text-sm font-medium text-white hover:bg-violet-500"
        >
          Agregar slide
        </button>
        {error && <p className="text-sm text-rose-400">{error}</p>}
      </form>

      {slides.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/50">Slides del Hero</h3>
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
            >
              <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                <img src={slide.image_url} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">{slide.title ?? "Sin título"}</p>
                {slide.description && (
                  <p className="truncate text-xs text-white/40">{slide.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(slide.id)}
                className="rounded-lg p-2 text-white/40 hover:bg-rose-500/20 hover:text-rose-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
