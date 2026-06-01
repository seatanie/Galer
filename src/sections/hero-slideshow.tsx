"use client";

import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { HeroSlide } from "@/types/supabase-content";

interface HeroSlideshowProps {
  slides: HeroSlide[];
  siteTitle?: string;
  tagline?: string;
}

export function HeroSlideshow({ slides, tagline }: HeroSlideshowProps) {
  const validSlides = slides.filter((s) => s.image_url && s.image_url.startsWith("http"));

  const [index, setIndex] = useState(0);

  const slide = validSlides[index];

  if (!validSlides.length) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6">
        <p className="text-center font-serif text-5xl font-light text-white/40 md:text-8xl">
          Arte de la transformación
        </p>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Imagen de fondo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.image_url}
            alt={slide.title ?? ""}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Contenido */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {tagline && (
          <p className="mb-6 font-mono text-xs tracking-[0.5em] text-white/40">
            {tagline}
          </p>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {slide.title && (
              <h1 className="mb-6 font-serif text-5xl font-light leading-tight text-white drop-shadow-2xl md:text-8xl">
                {slide.title}
              </h1>
            )}
            {slide.description && (
              <p className="mx-auto max-w-2xl text-lg text-white/70 drop-shadow-lg">
                {slide.description}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Indicadores con nombre */}
        {slides.length > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="rounded-full border border-white/20 p-2 backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <div className="flex items-end gap-4">
              {slides.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className="flex flex-col items-center gap-1 transition-all"
                >
                  {s.short_title && (
                    <span
                      className={`whitespace-nowrap text-[11px] font-medium leading-tight transition-all ${
                        i === index ? "text-white/80" : "text-white/30"
                      }`}
                    >
                      {s.short_title}
                    </span>
                  )}
                  <div
                    className={`rounded-full transition-all ${
                      i === index ? "h-2 w-8 bg-white" : "h-2 w-2 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                  {s.description && (
                    <span
                      className={`whitespace-nowrap text-[10px] leading-tight transition-all ${
                        i === index ? "text-white/50" : "text-white/20"
                      }`}
                    >
                      {s.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="rounded-full border border-white/20 p-2 backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
