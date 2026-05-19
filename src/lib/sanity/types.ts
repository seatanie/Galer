import type { SanityImageSource } from "@sanity/image-url";

export interface SanityCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface SanityGallery {
  _id: string;
  title: string;
  slug: string;
  featured?: boolean;
  description?: string;
  coverImage?: SanityImageSource;
  order?: number;
  published?: boolean;
  category?: { title: string; slug: string; color?: string };
  images?: Array<{
    _key: string;
    asset: SanityImageSource;
    alt?: string;
    caption?: string;
  }>;
}

export interface SanityVideo {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  videoUrl?: string;
  poster?: SanityImageSource;
  featured?: boolean;
  autoplay?: boolean;
}

export interface HeroRoom {
  title?: string;
  description?: string;
  wallImage?: SanityImageSource;
  accentColor?: string;
}

export interface SiteSettings {
  siteTitle?: string;
  tagline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroRooms?: HeroRoom[];
  sections?: string[];
}

export interface SanitySection {
  _id: string;
  title: string;
  key: string;
  enabled: boolean;
  headline?: string;
  body?: string;
  image?: SanityImageSource;
  order: number;
}

export interface HomePageData {
  settings: SiteSettings | null;
  galleries: SanityGallery[];
  videos: SanityVideo[];
  categories: SanityCategory[];
  sections: SanitySection[];
}
