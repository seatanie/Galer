"use client";

import Link from "next/link";
import Image from "next/image";
import type { DisplayGallery } from "@/types/supabase-content";

interface FeaturedGalleriesProps {
  galleries: DisplayGallery[];
}

export function FeaturedGalleries({ galleries }: FeaturedGalleriesProps) {
  const featured = galleries.filter((g) => g.featured).slice(0, 3);
  if (!featured.length) return null;

  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 font-mono text-xs tracking-[0.4em] text-white/40">DESTACADAS</p>
        <h2 className="mb-16 font-serif text-4xl font-light">Selección curada</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {featured.map((g, i) => (
            <Link
              key={g.id}
              href={`/galerias/${g.slug}`}
              data-cursor-label="VIEW"
              className="group relative overflow-hidden rounded-2xl border border-white/10"
            >
              {g.coverUrl && (
                <div className="relative aspect-[3/4]">
                  <Image
                    src={g.coverUrl}
                    alt={g.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <span className="font-mono text-[10px] text-amber-400">0{i + 1}</span>
                <h3 className="mt-2 font-serif text-2xl">{g.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
