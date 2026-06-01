-- Agregar slot_index a model_images para organización en carruseles
ALTER TABLE public.model_images ADD COLUMN IF NOT EXISTS slot_index INT DEFAULT 0;
