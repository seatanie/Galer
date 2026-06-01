import type {
  DisplayGallery,
  GalleryRow,
  HeroRoom,
  SiteSettings,
  ModelImage,
  ModelAudio,
} from "@/types/supabase-content";

export interface Hero3DRoomExtended extends HeroRoom {
  model_images?: ModelImage[];
  model_audios?: ModelAudio[];
  model_slots?: any[];
}

export function mapGalleryToDisplay(g: GalleryRow): DisplayGallery {
  const items = (g.gallery_items ?? [])
    .sort((a, b) => a.order_index - b.order_index)
    .map((item) => ({
      id: item.id,
      url: item.image_url ?? item.video_url ?? "",
      alt: item.title ?? undefined,
      caption: item.description ?? undefined,
      type: (item.media_type === "video" ? "video" : "image") as "image" | "video",
      videoUrl: item.video_url ?? undefined,
    }))
    .filter((i) => i.url);

  return {
    id: g.id,
    title: g.title,
    slug: g.slug,
    featured: g.featured,
    description: g.description ?? undefined,
    coverUrl: g.cover_image_url ?? items[0]?.url,
    category: g.category
      ? { title: g.category.title, slug: g.category.slug, color: g.category.color ?? undefined }
      : undefined,
    images: items,
  };
}

export function mapHeroRoomsFor3D(rooms: Hero3DRoomExtended[]) {
  return rooms.map((r) => ({
    title: r.title,
    shortTitle: r.short_title ?? undefined,
    description: r.description ?? undefined,
    accentColor: r.accent_color ?? "#8b5cf6",
    wallImageUrl: r.image_url ?? undefined,
    modelSlots: (r.model_slots ?? []).sort((a: any, b: any) => a.slot_index - b.slot_index).map((slot: any) => ({
      id: slot.id,
      slotIndex: slot.slot_index,
      coverImageUrl: slot.cover_image_url ?? undefined,
      title: slot.title ?? undefined,
      items: (slot.model_images ?? []).sort((a: any, b: any) => a.order_index - b.order_index).map((img: any) => ({
        id: img.id,
        image_url: img.image_url,
        caption: img.caption,
      })),
    })),
    modelImages: (r.model_images ?? []).map((img: any) => ({
      id: img.id,
      image_url: img.image_url,
      caption: img.caption,
    })),
    modelAudio: r.model_audios?.[0]
      ? { id: r.model_audios[0].id, audio_url: r.model_audios[0].audio_url, title: r.model_audios[0].title }
      : null,
  }));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function mapSettingsForHero(settings: SiteSettings | null) {
  return {
    siteTitle: settings?.site_title ?? "Arte de la transformación",
    tagline: settings?.tagline ?? undefined,
    heroTitle: settings?.hero_title ?? undefined,
    heroSubtitle: settings?.hero_subtitle ?? undefined,
    sections: settings?.sections ?? undefined,
  };
}
