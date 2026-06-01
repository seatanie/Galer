import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GalleryCreateForm } from "@/components/admin/gallery-create-form";
import { DeleteGalleryButton } from "@/components/admin/delete-gallery-button";
import { Pencil, Images } from "lucide-react";

export default async function AdminGalleriesPage() {
  const supabase = await createClient();

  const { data: galleries } = await supabase
    .from("galleries")
    .select("id, title, slug, featured, cover_image_url")
    .order("order_index", { ascending: true });

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <h1 className="mb-2 text-3xl font-light text-white">Galerías</h1>
        <p className="mb-8 text-white/50">
          Cada galería tiene 3 fotos principales con carrusel propio.
        </p>

        <div className="space-y-3">
          {galleries?.length ? (
            galleries.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center gap-3">
                  {g.cover_image_url ? (
                    <img
                      src={g.cover_image_url}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                      <Images className="h-4 w-4 text-white/30" />
                    </div>
                  )}
                  <div>
                    <p className="text-white">{g.title}</p>
                    <p className="text-xs text-white/40">/galerias/{g.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {g.featured && (
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-300">
                      ★
                    </span>
                  )}
                  <Link
                    href={`/admin/galerias/${g.id}`}
                    className="flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300 hover:bg-violet-500/20"
                  >
                    <Pencil className="h-3 w-3" />
                    Editar slots
                  </Link>
                  <DeleteGalleryButton id={g.id} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/40">Sin galerías aún.</p>
          )}
        </div>
      </div>

      <GalleryCreateForm />
    </div>
  );
}
