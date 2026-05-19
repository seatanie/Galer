import Link from "next/link";
import Image from "next/image";
import { fetchHomeFromSupabase } from "@/lib/supabase/fetch-home";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";

export default async function GaleriasPage() {
  const { galleries } = await fetchHomeFromSupabase();

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <PageViewTracker />
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-5xl font-light">Galerías</h1>
        <p className="mb-16 text-white/50">Contenido desde Supabase</p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((g) => (
            <Link
              key={g.id}
              href={`/galerias/${g.slug}`}
              data-cursor
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              {g.coverUrl && (
                <div className="relative aspect-[4/3]">
                  <Image src={g.coverUrl} alt={g.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-light">{g.title}</h2>
              </div>
            </Link>
          ))}
        </div>

        {!galleries.length && (
          <p className="text-center text-white/40">Crea galerías en /admin/galerias</p>
        )}
      </div>
    </main>
  );
}
