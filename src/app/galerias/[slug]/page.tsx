import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { mapGalleryToDisplay } from "@/lib/supabase/mappers";
import type { GalleryRow } from "@/types/supabase-content";
import { LikeButton } from "@/components/gallery/like-button";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { GalleryViewTracker } from "@/components/analytics/gallery-view-tracker";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GaleriaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: raw } = await supabase
    .from("galleries")
    .select(`*, category:categories(id, title, slug, color), gallery_items(*)`)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!raw) notFound();

  const gallery = mapGalleryToDisplay(raw as GalleryRow);

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <PageViewTracker />
      <GalleryViewTracker galleryId={gallery.id} slug={slug} />

      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-5xl font-light">{gallery.title}</h1>
        {gallery.description && (
          <p className="mb-16 max-w-2xl text-white/60">{gallery.description}</p>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {gallery.images.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              {item.url && (
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  {item.type === "video" ? (
                    <video src={item.videoUrl ?? item.url} controls className="h-full w-full object-cover" />
                  ) : (
                    <Image src={item.url} alt={item.alt ?? ""} fill className="object-cover" />
                  )}
                </div>
              )}
              {item.alt && <h3 className="text-lg">{item.alt}</h3>}
              <LikeButton galleryItemId={item.id} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
