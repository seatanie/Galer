import { createClient } from "@/lib/supabase/server";
import type { HomePageData, GalleryRow } from "@/types/supabase-content";
import { mapGalleryToDisplay } from "./mappers";

export const defaultHomeData: HomePageData = {
  settings: {
    id: 1,
    site_title: "Galer",
    tagline: "Exposición digital cinematográfica",
    hero_title: "Experiencias inmersivas",
    hero_subtitle:
      "Galería 3D premium con Supabase Auth, Storage y Realtime.",
    intro_title: "Una galería cinematográfica",
    intro_text:
      "Explora una colección curada de modelos, imágenes y videos en un espacio digital inmersivo. Cada pieza cuenta una historia.",
    sections: ["hero", "intro", "modelos", "masonry", "videos", "webgl", "featured"],
    updated_at: new Date().toISOString(),
  },
  heroRooms: [
    {
      id: "1",
      title: "Sala I",
      description: "Luz y sombra",
      image_url: null,
      accent_color: "#8b5cf6",
      order_index: 0,
    },
    {
      id: "2",
      title: "Sala II",
      description: "Geometría viva",
      image_url: null,
      accent_color: "#d946ef",
      order_index: 1,
    },
  ],
  heroSlides: [],
  galleries: [],
  videos: [],
  categories: [],
};

export async function fetchHomeFromSupabase(): Promise<HomePageData> {
  try {
    const supabase = await createClient();

    const [
      { data: settings },
      { data: heroRooms },
      { data: heroSlides },
      { data: galleriesRaw },
      { data: videos },
      { data: categories },
    ] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("hero_rooms").select("*, model_images(*), model_audios(*)").order("order_index"),
      supabase.from("hero_slides").select("*").order("order_index"),
      supabase
        .from("galleries")
        .select(
          `
          *,
          category:categories(id, title, slug, color),
          gallery_items(*)
        `
        )
        .eq("published", true)
        .order("order_index"),
      supabase.from("videos").select("*").eq("published", true).order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("title"),
    ]);

    const galleries = ((galleriesRaw ?? []) as GalleryRow[]).map(mapGalleryToDisplay);

    return {
      settings: settings ?? defaultHomeData.settings,
      heroRooms: heroRooms?.length ? heroRooms : defaultHomeData.heroRooms,
      heroSlides: heroSlides ?? [],
      galleries,
      videos: videos ?? [],
      categories: categories ?? [],
    };
  } catch {
    return defaultHomeData;
  }
}
