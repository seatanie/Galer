import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { GalleryViewTracker } from "@/components/analytics/gallery-view-tracker";
import { SlotCarousel } from "@/components/gallery/slot-carousel";
import type { SlotImage } from "@/components/gallery/slot-carousel";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GaleriaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: gallery } = await supabase
    .from("galleries")
    .select(`
      id, title, description, slug,
      category:categories(title, slug, color),
      gallery_slots(
        id, slot_index, cover_image_url, title,
        gallery_items(id, image_url, title, order_index)
      )
    `)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!gallery) notFound();

  type RawSlot = {
    id: string;
    slot_index: number;
    cover_image_url: string | null;
    title: string | null;
    gallery_items: { id: string; image_url: string | null; title: string | null; order_index: number }[] | null;
  };

  const slots: { id: string; slot_index: number; title: string | null; images: SlotImage[] }[] =
    ((gallery.gallery_slots as RawSlot[] | null) ?? [])
      .sort((a, b) => a.slot_index - b.slot_index)
      .map((slot) => {
        const images: SlotImage[] = [];
        if (slot.cover_image_url) {
          images.push({ id: `cover-${slot.id}`, url: slot.cover_image_url, title: slot.title });
        }
        const sub = ((slot.gallery_items ?? []) as { id: string; image_url: string | null; title: string | null; order_index: number }[])
          .sort((a, b) => a.order_index - b.order_index)
          .filter((i) => i.image_url)
          .map((i) => ({ id: i.id, url: i.image_url!, title: i.title }));
        images.push(...sub);
        return { id: slot.id, slot_index: slot.slot_index, title: slot.title, images };
      })
      .filter((s) => s.images.length > 0);

  const hasSlots = slots.length > 0;

  return (
    <main className="min-h-screen bg-black px-4 py-24 text-white sm:px-6">
      <PageViewTracker />
      <GalleryViewTracker galleryId={gallery.id} slug={slug} />

      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-4xl font-light sm:text-5xl">{gallery.title}</h1>
        {gallery.description && (
          <p className="mb-12 max-w-2xl text-white/50">{gallery.description}</p>
        )}

        {hasSlots ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {slots.map((slot) => (
              <SlotCarousel key={slot.id} images={slot.images} title={slot.title} />
            ))}
          </div>
        ) : (
          <p className="text-center text-white/30">Esta galería no tiene fotos aún.</p>
        )}
      </div>
    </main>
  );
}
