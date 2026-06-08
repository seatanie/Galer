import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateSiteSettings } from "@/lib/supabase/content-actions";
import { VideoCreateForm } from "@/components/admin/video-create-form";
import { HeroRoomForm } from "@/components/admin/hero-room-form";
import { HeroSlidesWrapper } from "@/components/admin/hero-slides-wrapper";
import { ExternalLink, Images, Video, Settings, Database, Layers, Image as ImageIcon } from "lucide-react";

export default async function AdminContenidoPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const { data: rooms } = await supabase
    .from("hero_rooms")
    .select("*, model_images(*), model_audios(*), model_slots(*, model_images(*))")
    .order("order_index");
  const { data: slides } = await supabase.from("hero_slides").select("*").order("order_index");

  return (
    <div className="space-y-12">
      <div>
        <h1 className="mb-2 text-3xl font-light text-white">Contenido Supabase</h1>
        <p className="max-w-2xl text-white/50">
          Auth, base de datos, storage y realtime — todo en Supabase. Edita aquí y ve los cambios al instante en{" "}
          <Link href="/admin/preview" className="text-violet-400 hover:underline">
            Live Preview
          </Link>
          .
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/galerias"
          className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-violet-500/30"
        >
          <Images className="mb-2 h-5 w-5 text-violet-400" />
          <p className="text-white">Galerías</p>
        </Link>
        <Link
          href="/admin/preview"
          className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-violet-500/30"
        >
          <ExternalLink className="mb-2 h-5 w-5 text-violet-400" />
          <p className="text-white">Live Preview</p>
        </Link>
        <a
          href="https://supabase.com/dashboard/project/zlwhqazupmorbaednepq"
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-violet-500/30"
        >
          <Database className="mb-2 h-5 w-5 text-violet-400" />
          <p className="text-white">Dashboard Supabase</p>
        </a>
        <Link href="/" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-violet-500/30">
          <Settings className="mb-2 h-5 w-5 text-violet-400" />
          <p className="text-white">Ver sitio</p>
        </Link>
      </div>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg text-white">
          <ImageIcon className="h-5 w-5 text-violet-400" />
          Hero (Slideshow de inicio)
        </h2>
        <HeroSlidesWrapper slides={(slides ?? []) as any} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg text-white">
          <Settings className="h-5 w-5 text-violet-400" />
          Configuración del sitio
        </h2>
        <form action={updateSiteSettings as unknown as (formData: FormData) => void} className="grid max-w-2xl gap-4">
          <input
            name="site_title"
            defaultValue={settings?.site_title ?? ""}
            placeholder="Título del sitio"
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <input
            name="tagline"
            defaultValue={settings?.tagline ?? ""}
            placeholder="Tagline"
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <input
            name="hero_title"
            defaultValue={settings?.hero_title ?? ""}
            placeholder="Título hero"
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <textarea
            name="hero_subtitle"
            defaultValue={settings?.hero_subtitle ?? ""}
            placeholder="Subtítulo hero"
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <h3 className="mt-6 text-sm font-medium text-white/50">Subtítulo y texto</h3>
          <input
            name="intro_title"
            defaultValue={settings?.intro_title ?? ""}
            placeholder="Título principal"
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <input
            name="intro_subtitle"
            defaultValue={settings?.intro_subtitle ?? ""}
            placeholder="Subtítulo"
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <textarea
            name="intro_text"
            defaultValue={settings?.intro_text ?? ""}
            placeholder="Texto"
            rows={3}
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <h3 className="mt-6 text-sm font-medium text-white/50">Proyecto</h3>
          <textarea
            name="quienes_somos"
            defaultValue={settings?.quienes_somos ?? ""}
            placeholder="¿Quiénes Somos? (título)"
            rows={2}
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <textarea
            name="quienes_somos_desc1"
            defaultValue={settings?.quienes_somos_desc1 ?? ""}
            placeholder="Descripción 1"
            rows={2}
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <textarea
            name="quienes_somos_desc2"
            defaultValue={settings?.quienes_somos_desc2 ?? ""}
            placeholder="Descripción 2"
            rows={2}
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <textarea
            name="por_que"
            defaultValue={settings?.por_que ?? ""}
            placeholder="¿Por Qué? (título)"
            rows={2}
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <textarea
            name="por_que_desc1"
            defaultValue={settings?.por_que_desc1 ?? ""}
            placeholder="Descripción 1"
            rows={2}
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <textarea
            name="por_que_desc2"
            defaultValue={settings?.por_que_desc2 ?? ""}
            placeholder="Descripción 2"
            rows={2}
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <textarea
            name="para_que"
            defaultValue={settings?.para_que ?? ""}
            placeholder="¿Para Qué? (título)"
            rows={2}
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <textarea
            name="para_que_desc1"
            defaultValue={settings?.para_que_desc1 ?? ""}
            placeholder="Descripción 1"
            rows={2}
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <textarea
            name="para_que_desc2"
            defaultValue={settings?.para_que_desc2 ?? ""}
            placeholder="Descripción 2"
            rows={2}
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <input
            name="sections"
            defaultValue={settings?.sections?.join(",") ?? "hero,intro,proyecto,modelos,masonry,videos,webgl,featured"}
            placeholder="Secciones: hero,intro,proyecto,modelos,masonry,videos,webgl,featured"
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-violet-600 py-3 text-sm text-white hover:bg-violet-500"
          >
            Guardar configuración
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg text-white">
          <Layers className="h-5 w-5 text-violet-400" />
          Personajes
        </h2>
        <HeroRoomForm rooms={(rooms ?? []) as any} />
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg text-white">
          <Video className="h-5 w-5 text-violet-400" />
          Nuevo video
        </h2>
        <VideoCreateForm />
      </section>
    </div>
  );
}
