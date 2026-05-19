# Galer — Galería 3D Cinematográfica Premium

Exposición digital con **galería 3D CSS**, **WebGL**, **Sanity CMS** (edición sin código), **Supabase** (auth, realtime, analytics) y **panel admin** con live preview.

## Experiencia frontend

| Sección | Descripción |
|---------|-------------|
| **Hero 3D** | Salas con perspective CSS, tilt con mouse, navegación entre rooms |
| **Masonry** | Grid dinámica, filtros por categoría, reveal con ScrollTrigger |
| **Videos** | Cinema fullscreen, lightbox con soporte video |
| **WebGL** | Partículas + escultura wireframe (R3F) |
| **Destacadas** | Galerías curadas |
| **Cursor** | Glow, labels dinámicos (VIEW, OPEN, PLAY…) |
| **Scroll** | Lenis + GSAP ScrollTrigger |
| **Lightbox** | Blur, zoom, navegación, video |
| **Menú** | Fullscreen con timelines GSAP |
| **Footer** | Terminal ticker + sweep animado |

## Panel admin

| Ruta | Función |
|------|---------|
| `/admin/login` | Email, magic link, Google, GitHub |
| `/admin` | Dashboard + stats Supabase |
| `/admin/contenido` | Acceso rápido al CMS |
| `/admin/preview` | **Live preview** iframe (`?preview=true`) |
| `/admin/galerias` | Supabase + Sanity + **drag & drop** orden |
| `/admin/usuarios` | Roles admin/editor/viewer |
| `/admin/analytics` | Eventos personalizados |
| `/studio` | **Sanity Studio** embebido |

## CMS (Sanity)

Schemas en `sanity/schemas/`:

- `siteSettings` — hero 3D, tagline, secciones activas
- `gallery` — imágenes, categorías, orden
- `video` — videos inmersivos
- `category` — filtros masonry
- `section` — bloques dinámicos

## Inicio rápido

```bash
npm install
cp .env.example .env.local
# Configura Supabase + Sanity en .env.local
npm run dev
```

### Supabase

1. Ejecuta `supabase/migrations/001_initial_schema.sql`
2. Activa Auth providers + redirect `http://localhost:3000/auth/callback`
3. Promueve admin: `UPDATE public.users SET role = 'admin' WHERE email = 'tu@email.com';`

### Sanity

1. Crea proyecto en sanity.io
2. Añade variables en `.env.local`
3. Abre `/studio` para editar contenido
4. Usa `/admin/preview` para ver cambios en vivo (poll cada 8s + botón Refrescar)

### Variables

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
```

## Arquitectura

```
Admin → Sanity Studio (/studio) + Panel (/admin)
              ↓
        Sanity CMS (contenido visual)
              ↓
        Supabase (auth, likes, analytics, metadatos)
              ↓
        Next.js (3D, WebGL, animaciones, live preview)
```

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind 4 · GSAP · Framer Motion · Lenis · Three.js · Sanity · Supabase
