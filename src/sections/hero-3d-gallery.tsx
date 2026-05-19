"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ModelDetail } from "@/components/model-detail";

export interface Hero3DRoom {
  title?: string;
  description?: string;
  accentColor?: string;
  wallImageUrl?: string;
  modelImages?: { id: string; image_url: string; caption: string | null }[];
  modelAudio?: { id: string; audio_url: string; title: string | null } | null;
}

interface Hero3DGalleryProps {
  siteTitle?: string;
  tagline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  rooms: Hero3DRoom[];
}

export function Hero3DGallery({
  siteTitle,
  tagline,
  heroTitle = "Experiencias inmersivas",
  heroSubtitle,
  rooms,
}: Hero3DGalleryProps) {
  const displayRooms =
    rooms.length > 0
      ? rooms
      : [
          { title: "Sala I", description: "Luz y sombra", accentColor: "#8b5cf6" },
          { title: "Sala II", description: "Geometría viva", accentColor: "#d946ef" },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);

  const radius = 300;
  const angleStep = (2 * Math.PI) / displayRooms.length;

  function goNext() {
    setActiveIndex((i) => (i + 1) % displayRooms.length);
  }

  function goPrev() {
    setActiveIndex((i) => (i - 1 + displayRooms.length) % displayRooms.length);
  }

  return (
    <>
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 pt-24">
      <div className="absolute inset-0 bg-black" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <p className="mb-4 text-center font-mono text-xs tracking-[0.5em] text-white/40">
          {tagline ?? siteTitle ?? "Exposición digital"}
        </p>
        <h1 className="mb-20 text-center font-serif text-5xl font-light leading-tight md:text-8xl">
          {heroTitle}
        </h1>

        <div className="relative mx-auto flex h-[520px] items-center justify-center">
          {/* Círculos en carrusel orbital */}
          <AnimatePresence mode="popLayout">
            {displayRooms.map((room, i) => {
              const relativeIndex =
                ((i - activeIndex) % displayRooms.length + displayRooms.length) %
                displayRooms.length;
              const half = Math.floor(displayRooms.length / 2);
              const position = relativeIndex <= half ? relativeIndex : relativeIndex - displayRooms.length;

              const angle = (position / half) * (Math.PI / 2.2);
              const x = Math.sin(angle) * radius;
              const z = Math.cos(angle) * radius - radius * 0.5;
              const isCenter = i === activeIndex;
              const s = isCenter ? 1 : 0.55 - Math.abs(position) * 0.1;

              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    x,
                    scale: Math.max(0.35, s),
                    opacity: isCenter ? 1 : 0.5 - Math.abs(position) * 0.12,
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 180, damping: 26, mass: 0.8 }}
                  className="absolute cursor-pointer"
                  style={{ zIndex: isCenter ? 20 : 10 - Math.abs(position) }}
                  onClick={() => {
                    if (isCenter) setDetailOpen(true);
                    else setActiveIndex(i);
                  }}
                >
                  <div
                    className="relative overflow-hidden rounded-full border-2 shadow-2xl"
                    style={{
                      width: isCenter ? 280 : 180,
                      height: isCenter ? 280 : 180,
                      borderColor: room.accentColor ?? "#8b5cf6",
                      boxShadow: isCenter
                        ? `0 0 100px ${room.accentColor ?? "#8b5cf6"}88`
                        : "none",
                    }}
                  >
                    {room.wallImageUrl ? (
                      <Image
                        src={room.wallImageUrl}
                        alt={room.title ?? ""}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="h-full w-full"
                        style={{
                          background: `linear-gradient(135deg, ${room.accentColor ?? "#8b5cf6"}88, #111)`,
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  </div>

                  {/* Título en los laterales */}
                  {!isCenter && (
                    <p className="mt-3 text-center text-xs text-white/50">{room.title}</p>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Info central */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pointer-events-none absolute -bottom-4 left-0 right-0 text-center"
            >
              <p className="font-serif text-4xl text-white drop-shadow-lg">
                {displayRooms[activeIndex].title}
              </p>
              {displayRooms[activeIndex].description && (
                <p className="mt-2 text-sm text-white/60">
                  {displayRooms[activeIndex].description}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Flechas + indicadores */}
        <div className="mt-32 flex items-center justify-center gap-6">
          <button
            onClick={goPrev}
            className="rounded-full border border-white/20 p-3 backdrop-blur-md transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex gap-2">
            {displayRooms.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === activeIndex
                    ? "w-8 bg-violet-400"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
          <button
            onClick={goNext}
            className="rounded-full border border-white/20 p-3 backdrop-blur-md transition-colors hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>

        {heroSubtitle && (
          <p className="mx-auto mt-12 max-w-xl text-center text-white/50">{heroSubtitle}</p>
        )}
      </div>
    </section>

    <ModelDetail
      open={detailOpen}
      onClose={() => setDetailOpen(false)}
      title={displayRooms[activeIndex].title}
      description={displayRooms[activeIndex].description}
      images={displayRooms[activeIndex].modelImages ?? []}
      audio={displayRooms[activeIndex].modelAudio ?? null}
    />
  </>
);
}
