import { createClient } from "@/lib/supabase/server";
import type { Gallery, GalleryItem } from "@/types/database";
import { GalleryItemsReorder } from "@/components/admin/gallery-items-reorder";
import { GalleryCreateForm } from "@/components/admin/gallery-create-form";
import { DeleteGalleryButton } from "@/components/admin/delete-gallery-button";

export default async function AdminGalleriesPage() {
  const supabase = await createClient();

  const { data: dbGalleriesRaw } = await supabase
    .from("galleries")
    .select("*")
    .order("order_index", { ascending: true });

  const dbGalleries = (dbGalleriesRaw ?? []) as Gallery[];
  const firstGallery = dbGalleries[0];
  let galleryItems: GalleryItem[] = [];

  if (firstGallery) {
    const { data: items } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("gallery_id", firstGallery.id)
      .order("order_index");
    galleryItems = (items ?? []) as GalleryItem[];
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <h1 className="mb-2 text-3xl font-light text-white">Galerías</h1>
        <p className="mb-8 text-white/50">PostgreSQL + Storage + Realtime (Supabase)</p>

        <div className="space-y-3">
          {dbGalleries.length ? (
            dbGalleries.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div>
                  <p className="text-white">{g.title}</p>
                  <p className="text-sm text-white/40">/galerias/{g.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  {g.featured && (
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-300">
                      ★
                    </span>
                  )}
                  <DeleteGalleryButton id={g.id} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/40">Sin galerías. Ejecuta las migraciones SQL en Supabase.</p>
          )}
        </div>

        {firstGallery && (
          <section className="mt-10">
            <h2 className="mb-4 text-lg text-white/70">Reordenar — {firstGallery.title}</h2>
            <GalleryItemsReorder galleryId={firstGallery.id} initialItems={galleryItems} />
          </section>
        )}
      </div>

      <GalleryCreateForm />
    </div>
  );
}


