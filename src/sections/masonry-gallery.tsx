"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/animations/register-gsap";
import { useLightbox } from "@/components/providers/lightbox-provider";
import type { Category, DisplayGallery } from "@/types/supabase-content";
import { cn } from "@/lib/utils";

interface MasonryGalleryProps {
  galleries: DisplayGallery[];
  categories: Category[];
}

export function MasonryGallery({ galleries, categories }: MasonryGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<string | "all">("all");
  const { open } = useLightbox();

  const filtered =
    filter === "all"
      ? galleries
      : galleries.filter((g) => g.category?.slug === filter);

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      cards,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      }
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [filtered]);

  const openGallery = (g: DisplayGallery, imageIndex = 0) => {
    const items = g.images.map((img) => ({
      src: img.url,
      alt: img.alt,
      caption: img.caption,
      type: img.type,
      videoUrl: img.videoUrl,
    }));
    if (g.coverUrl && !items.length) {
      items.push({ src: g.coverUrl, alt: g.title, caption: undefined, type: "image" as const, videoUrl: undefined });
    }
    if (items.length) open(items, imageIndex);
  };

  return (
    <section ref={sectionRef} id="galerias" className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-center font-mono text-xs tracking-[0.4em] text-white/40">COLECCIÓN</p>
        <h2 className="mb-12 text-center font-serif text-4xl font-light md:text-6xl">Masonry Gallery</h2>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-full border px-5 py-2 font-mono text-xs tracking-widest transition-colors",
              filter === "all"
                ? "border-violet-500/50 bg-violet-500/20 text-violet-300"
                : "border-white/10 text-white/50 hover:text-white"
            )}
          >
            TODAS
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.slug)}
              className={cn(
                "rounded-full border px-5 py-2 font-mono text-xs tracking-widest transition-colors",
                filter === c.slug
                  ? "border-violet-500/50 bg-violet-500/20 text-violet-300"
                  : "border-white/10 text-white/50 hover:text-white"
              )}
            >
              {c.title.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {filtered.map((g, i) => {
            const cover = g.coverUrl ?? g.images[0]?.url;
            const heightClass =
              i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]";
            return (
              <article
                key={g.id}
                data-reveal
                data-cursor-label="OPEN"
                onClick={() => openGallery(g)}
                className="group mb-6 break-inside-avoid cursor-none overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-transform hover:scale-[1.02]"
              >
                {cover ? (
                  <div className={`relative ${heightClass} overflow-hidden`}>
                    <Image
                      src={cover}
                      alt={g.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-90" />
                  </div>
                ) : (
                  <div className={`${heightClass} bg-gradient-to-br from-violet-900/40 to-fuchsia-900/20`} />
                )}
                <div className="p-5">
                  <h3 className="font-serif text-xl">{g.title}</h3>
                  {g.category && (
                    <span className="mt-2 inline-block font-mono text-[10px] tracking-widest text-violet-400">
                      {g.category.title}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {!filtered.length && (
          <p className="text-center text-white/40">
            Crea galerías desde el panel admin → Galerías
          </p>
        )}
      </div>
    </section>
  );
}
