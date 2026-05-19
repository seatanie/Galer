-- CMS completo en Supabase + Storage

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#8b5cf6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.galleries
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS order_index INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'image';

CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  video_url TEXT,
  poster_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  autoplay BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_title TEXT DEFAULT 'Galer',
  tagline TEXT DEFAULT 'Exposición digital cinematográfica',
  hero_title TEXT DEFAULT 'Experiencias inmersivas',
  hero_subtitle TEXT,
  sections TEXT[] DEFAULT ARRAY['hero','masonry','videos','webgl','featured'],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hero_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  accent_color TEXT DEFAULT '#8b5cf6',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- RLS nuevas tablas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories editors manage" ON public.categories FOR ALL USING (public.is_admin_or_editor());

CREATE POLICY "Videos public read published" ON public.videos FOR SELECT USING (published = true);
CREATE POLICY "Videos editors manage" ON public.videos FOR ALL USING (public.is_admin_or_editor());

CREATE POLICY "Site settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Site settings editors update" ON public.site_settings FOR UPDATE USING (public.is_admin_or_editor());

CREATE POLICY "Hero rooms public read" ON public.hero_rooms FOR SELECT USING (true);
CREATE POLICY "Hero rooms editors manage" ON public.hero_rooms FOR ALL USING (public.is_admin_or_editor());

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.videos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;

-- Storage bucket galer-media
INSERT INTO storage.buckets (id, name, public)
VALUES ('galer-media', 'galer-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read galer-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'galer-media');

CREATE POLICY "Editors upload galer-media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'galer-media'
    AND public.is_admin_or_editor()
  );

CREATE POLICY "Editors update galer-media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'galer-media' AND public.is_admin_or_editor());

CREATE POLICY "Editors delete galer-media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'galer-media' AND public.is_admin_or_editor());
