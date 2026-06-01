import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GallerySlotsEditor } from "@/components/admin/gallery-slots-editor";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminGalleryEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: gallery } = await supabase
    .from("galleries")
    .select("id, title, slug")
    .eq("id", id)
    .single();

  if (!gallery) notFound();

  const { data: rawSlots } = await supabase
    .from("gallery_slots")
    .select("id, slot_index, cover_image_url, title, gallery_items(id, image_url, title, order_index)")
    .eq("gallery_id", id)
    .order("slot_index");

  const slots = (rawSlots ?? []).map((s) => ({
    id: s.id,
    slot_index: s.slot_index,
    cover_image_url: s.cover_image_url,
    title: s.title,
    items: ((s.gallery_items as { id: string; image_url: string | null; title: string | null; order_index: number }[] | null) ?? [])
      .sort((a, b) => a.order_index - b.order_index),
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/galerias"
          className="flex items-center gap-1 text-sm text-white/50 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Galerías
        </Link>
        <h1 className="text-2xl font-light text-white">{gallery.title}</h1>
        <Link
          href={`/galerias/${gallery.slug}`}
          target="_blank"
          className="ml-auto text-xs text-violet-400 hover:underline"
        >
          Ver galería →
        </Link>
      </div>

      <div>
        <p className="mb-6 text-sm text-white/50">
          Cada galería tiene 3 fotos principales. Cada foto principal tiene su propio carrusel
          de imágenes que el visitante puede deslizar (estilo Instagram).
        </p>
        <GallerySlotsEditor galleryId={gallery.id} slots={slots} />
      </div>
    </div>
  );
}
