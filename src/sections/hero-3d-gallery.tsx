"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2 } from "lucide-react";

export interface ModelSlot {
  id: string;
  slotIndex: number;
  coverImageUrl?: string;
  title?: string;
  items: { id: string; image_url: string; caption: string | null }[];
}

export interface Hero3DRoom {
  title?: string;
  shortTitle?: string;
  description?: string;
  accentColor?: string;
  wallImageUrl?: string;
  modelImages?: { id: string; image_url: string; caption: string | null }[];
  modelAudio?: { id: string; audio_url: string; title: string | null } | null;
  modelSlots?: ModelSlot[];
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
  const [selectedModel, setSelectedModel] = useState<number | null>(rooms.length > 0 ? 0 : null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const modelosRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const radius = 300;

  function toggleAudio() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }

  function goNext() {
    setActiveIndex((i) => (i + 1) % displayRooms.length);
  }

  function goPrev() {
    setActiveIndex((i) => (i - 1 + displayRooms.length) % displayRooms.length);
  }

  function handleModelClick(index: number) {
    setActiveIndex(index);
    setSelectedModel(index);
    setTimeout(() => {
      modelosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const currentRoom = selectedModel !== null ? displayRooms[selectedModel] : null;
  const currentSlots = currentRoom?.modelSlots ?? [];

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
                    onClick={() => handleModelClick(i)}
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

                    {!isCenter && (
                      <p className="mt-3 text-center text-xs text-white/50">{room.title}</p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pointer-events-none absolute -bottom-4 left-0 right-0 text-center"
              >
                {displayRooms[activeIndex].shortTitle ? (
                  <>
                    <p className="font-serif text-4xl text-white drop-shadow-lg">
                      {displayRooms[activeIndex].shortTitle}
                    </p>
                    <p className="mt-2 text-sm text-white/60">
                      {displayRooms[activeIndex].title}
                    </p>
                  </>
                ) : (
                  <p className="font-serif text-4xl text-white drop-shadow-lg">
                    {displayRooms[activeIndex].title}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

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

          {displayRooms[activeIndex]?.modelAudio && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={toggleAudio}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                {playing ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
              <div className="text-left">
                <p className="text-sm text-white">
                  {displayRooms[activeIndex].modelAudio!.title ?? "Audio"}
                </p>
                {playing && (
                  <p className="text-xs text-white/50">Reproduciendo...</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-white/60" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    if (audioRef.current) audioRef.current.volume = v;
                  }}
                  className="h-1 w-24 cursor-pointer accent-violet-500"
                />
              </div>
              <audio
                ref={audioRef}
                src={displayRooms[activeIndex].modelAudio!.audio_url}
                onEnded={() => setPlaying(false)}
              />
            </div>
          )}

          {heroSubtitle && (
            <p className="mx-auto mt-12 max-w-xl text-center text-white/50">{heroSubtitle}</p>
          )}
        </div>
      </section>

      {/* Sección de portadas del modelo seleccionado */}
      <section
        ref={modelosRef}
        id="modelos-gallery"
        className="bg-gradient-to-b from-black via-zinc-950 to-black py-20"
      >
        {selectedModel === null ? (
          <div className="flex min-h-[60vh] items-center justify-center px-4">
            <p className="text-center text-white/40">
              Selecciona un modelo arriba para ver sus portadas
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-16 text-center">
              <h2 className="font-serif text-4xl text-white md:text-5xl">
                {currentRoom?.title}
              </h2>
              {currentRoom?.description && (
                <p className="mt-3 text-white/60">{currentRoom.description}</p>
              )}
            </div>

            {currentSlots.length === 0 ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-white/40">Este modelo no tiene portadas</p>
              </div>
            ) : (
              <div className="space-y-24">
                {currentSlots.map((slot) => (
                  <SlotSection
                    key={slot.id}
                    slot={slot}
                    accentColor={currentRoom?.accentColor ?? "#8b5cf6"}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

function SlotSection({
  slot,
  accentColor,
}: {
  slot: ModelSlot;
  accentColor: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const allImages = [
    ...(slot.coverImageUrl ? [{ id: `cover-${slot.id}`, image_url: slot.coverImageUrl, caption: slot.title ?? null }] : []),
    ...slot.items,
  ];

  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -460, behavior: "smooth" });
  }

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 460, behavior: "smooth" });
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function onScroll() {
      const itemWidth = 460;
      const idx = Math.round(el!.scrollLeft / itemWidth);
      setCurrentIndex(Math.min(idx, allImages.length - 1));
    }
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [allImages.length]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h3 className="font-serif text-3xl text-white md:text-4xl">
          {slot.title ?? `Portada ${slot.slotIndex + 1}`}
        </h3>
        <p className="mt-2 text-sm text-white/60">
          {currentIndex + 1} / {allImages.length}
        </p>
      </div>

      {allImages.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <p className="text-white/40">Sin imágenes en esta portada</p>
        </div>
      ) : (
        <div className="relative flex items-center gap-4">
          <button
            onClick={scrollLeft}
            className="rounded-full border border-white/20 p-3 backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
            style={{ maxWidth: "460px" }}
          >
            {allImages.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className="group relative flex-shrink-0 snap-center"
              >
                <div
                  className="relative h-[600px] w-[440px] overflow-hidden rounded-3xl border-2"
                  style={{ borderColor: accentColor + "66" }}
                >
                  <img
                    src={img.image_url}
                    alt={img.caption ?? ""}
                    className="h-full w-full object-cover"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <p className="text-sm text-white/90">{img.caption}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="rounded-full border border-white/20 p-3 backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>
      )}

      <div className="flex gap-1.5">
        {allImages.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
