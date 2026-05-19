-- Slides del Hero (Home)
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero slides public read" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Hero slides editors manage" ON public.hero_slides FOR ALL USING (public.is_admin_or_editor());
