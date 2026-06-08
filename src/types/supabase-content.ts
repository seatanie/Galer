export interface SiteSettings {
  id: number;
  site_title: string | null;
  tagline: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  intro_title: string | null;
  intro_subtitle: string | null;
  intro_text: string | null;
  quienes_somos: string | null;
  quienes_somos_desc1: string | null;
  quienes_somos_desc2: string | null;
  por_que: string | null;
  por_que_desc1: string | null;
  por_que_desc2: string | null;
  para_que: string | null;
  para_que_desc1: string | null;
  para_que_desc2: string | null;
  sections: string[] | null;
  updated_at: string;
}

export interface HeroRoom {
  id: string;
  title: string;
  short_title: string | null;
  description: string | null;
  image_url: string | null;
  accent_color: string | null;
  order_index: number;
}

export interface ModelImage {
  id: string;
  hero_room_id: string;
  image_url: string;
  caption: string | null;
  order_index: number;
}

export interface ModelAudio {
  id: string;
  hero_room_id: string;
  audio_url: string;
  title: string | null;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  color: string | null;
}

export interface GalleryRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  featured: boolean;
  cover_image_url: string | null;
  published: boolean;
  order_index: number;
  category_id: string | null;
  created_at: string;
  category?: Category | null;
  gallery_items?: GalleryItemRow[];
  gallery_slots?: GallerySlotRow[];
}

export interface GalleryItemRow {
  id: string;
  gallery_id: string;
  image_url: string | null;
  video_url: string | null;
  media_type: string;
  title: string | null;
  short_title: string | null;
  description: string | null;
  order_index: number;
  slot_id: string | null;
}

export interface GallerySlotRow {
  id: string;
  gallery_id: string;
  slot_index: number;
  cover_image_url: string | null;
  title: string | null;
  created_at: string;
  gallery_items?: GalleryItemRow[];
}

export interface VideoRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  video_url: string | null;
  poster_url: string | null;
  featured: boolean;
  autoplay: boolean;
  published: boolean;
}

/** Formato unificado para componentes de galería del frontend */
export interface DisplayGallery {
  id: string;
  title: string;
  slug: string;
  featured?: boolean;
  description?: string;
  coverUrl?: string;
  category?: { title: string; slug: string; color?: string };
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    caption?: string;
    type: "image" | "video";
    videoUrl?: string;
  }>;
}

export interface HeroSlide {
  id: string;
  image_url: string;
  title: string | null;
  short_title: string | null;
  description: string | null;
  order_index: number;
}

export interface HomePageData {
  settings: SiteSettings | null;
  heroRooms: HeroRoom[];
  heroSlides: HeroSlide[];
  galleries: DisplayGallery[];
  videos: VideoRow[];
  categories: Category[];
}
