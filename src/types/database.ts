export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "editor" | "viewer";

export interface User {
  id: string;
  username: string | null;
  email: string;
  avatar: string | null;
  role: UserRole;
  created_at: string;
}

export interface Gallery {
  id: string;
  title: string;
  slug: string;
  featured: boolean;
  sanity_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  gallery_id: string;
  image_url: string | null;
  sanity_asset_id: string | null;
  title: string | null;
  description: string | null;
  order_index: number;
  slot_id: string | null;
  created_at: string;
}

export interface GallerySlot {
  id: string;
  gallery_id: string;
  slot_index: number;
  cover_image_url: string | null;
  title: string | null;
  created_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  gallery_item_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  gallery_item_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  gallery_id: string | null;
  gallery_item_id: string | null;
  user_id: string | null;
  metadata: Json;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          avatar?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: Partial<Omit<User, "id">>;
        Relationships: [];
      };
      galleries: {
        Row: Gallery;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          featured?: boolean;
          sanity_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Gallery, "id">>;
        Relationships: [];
      };
      gallery_items: {
        Row: GalleryItem;
        Insert: {
          id?: string;
          gallery_id: string;
          image_url?: string | null;
          sanity_asset_id?: string | null;
          title?: string | null;
          description?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: Partial<Omit<GalleryItem, "id">>;
        Relationships: [];
      };
      likes: {
        Row: Like;
        Insert: {
          id?: string;
          user_id: string;
          gallery_item_id: string;
          created_at?: string;
        };
        Update: Partial<Omit<Like, "id">>;
        Relationships: [];
      };
      comments: {
        Row: Comment;
        Insert: {
          id?: string;
          user_id: string;
          gallery_item_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Comment, "id">>;
        Relationships: [];
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: {
          id?: string;
          event_type: string;
          gallery_id?: string | null;
          gallery_item_id?: string | null;
          user_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Omit<AnalyticsEvent, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
}
