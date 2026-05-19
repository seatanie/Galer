-- Galer: schema inicial Supabase
-- Ejecutar en SQL Editor de Supabase o con supabase db push

CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'viewer');

-- Perfiles vinculados a auth.users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  email TEXT NOT NULL,
  avatar TEXT,
  role public.user_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Galerías (metadatos; imágenes principales en Sanity)
CREATE TABLE public.galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sanity_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES public.galleries(id) ON DELETE CASCADE,
  image_url TEXT,
  sanity_asset_id TEXT,
  title TEXT,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  gallery_item_id UUID NOT NULL REFERENCES public.gallery_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, gallery_item_id)
);

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  gallery_item_id UUID NOT NULL REFERENCES public.gallery_items(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  gallery_id UUID REFERENCES public.galleries(id) ON DELETE SET NULL,
  gallery_item_id UUID REFERENCES public.gallery_items(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_galleries_slug ON public.galleries(slug);
CREATE INDEX idx_gallery_items_gallery ON public.gallery_items(gallery_id);
CREATE INDEX idx_likes_item ON public.likes(gallery_item_id);
CREATE INDEX idx_comments_item ON public.comments(gallery_item_id);
CREATE INDEX idx_analytics_created ON public.analytics_events(created_at DESC);

-- Trigger: crear perfil al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, avatar, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'viewer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at en galleries
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER galleries_updated_at
  BEFORE UPDATE ON public.galleries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- users
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON public.users FOR SELECT USING (public.is_admin_or_editor());

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- galleries: lectura pública
CREATE POLICY "Galleries are viewable by everyone"
  ON public.galleries FOR SELECT USING (true);

CREATE POLICY "Editors can manage galleries"
  ON public.galleries FOR ALL USING (public.is_admin_or_editor());

-- gallery_items
CREATE POLICY "Gallery items are viewable by everyone"
  ON public.gallery_items FOR SELECT USING (true);

CREATE POLICY "Editors can manage gallery items"
  ON public.gallery_items FOR ALL USING (public.is_admin_or_editor());

-- likes
CREATE POLICY "Likes are viewable by everyone"
  ON public.likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like"
  ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own likes"
  ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- comments
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment"
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit own comments"
  ON public.comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- analytics: insert público (anon), lectura admin
CREATE POLICY "Anyone can insert analytics"
  ON public.analytics_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read analytics"
  ON public.analytics_events FOR SELECT USING (public.is_admin_or_editor());

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.galleries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_items;
