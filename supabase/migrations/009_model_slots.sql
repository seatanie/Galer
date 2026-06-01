-- Slots de modelo: 3 slots por modelo, cada uno con su carrusel IG
CREATE TABLE IF NOT EXISTS public.model_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_room_id UUID NOT NULL REFERENCES public.hero_rooms(id) ON DELETE CASCADE,
  slot_index INT NOT NULL DEFAULT 0,
  cover_image_url TEXT,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(hero_room_id, slot_index)
);

-- Vincular model_images a un slot
ALTER TABLE public.model_images
  ADD COLUMN IF NOT EXISTS slot_id UUID REFERENCES public.model_slots(id) ON DELETE CASCADE;

ALTER TABLE public.model_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Model slots public read"
  ON public.model_slots FOR SELECT USING (true);

CREATE POLICY "Model slots editors manage"
  ON public.model_slots FOR ALL USING (public.is_admin_or_editor());

ALTER PUBLICATION supabase_realtime ADD TABLE public.model_slots;
