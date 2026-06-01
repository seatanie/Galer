-- Slots de galería: 3 imágenes principales por galería, cada una con carrusel IG
CREATE TABLE IF NOT EXISTS public.gallery_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES public.galleries(id) ON DELETE CASCADE,
  slot_index INT NOT NULL DEFAULT 0,
  cover_image_url TEXT,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(gallery_id, slot_index)
);

-- Vincular ítems existentes a un slot
ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS slot_id UUID REFERENCES public.gallery_slots(id) ON DELETE CASCADE;

ALTER TABLE public.gallery_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery slots public read"
  ON public.gallery_slots FOR SELECT USING (true);

CREATE POLICY "Gallery slots editors manage"
  ON public.gallery_slots FOR ALL USING (public.is_admin_or_editor());

ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_slots;
