"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause } from "lucide-react";
import { playModelOpen, playModelClose, playModelChange } from "@/components/premium/ambient-sounds";

interface ModelImage {
  id: string;
  image_url: string;
  caption: string | null;
}

interface ModelAudio {
  id: string;
  audio_url: string;
  title: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  images: ModelImage[];
  audio: ModelAudio | null;
}

export function ModelDetail({
  open,
  onClose,
  title,
  description,
  images,
  audio,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  // Reset audio al cerrar
  useEffect(() => {
    if (!open) {
      setPlaying(false);
      playModelClose();

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      playModelOpen();
    }
  }, [open]);

  // Sonido al cambiar de modelo
  useEffect(() => {
    if (title) {
      playModelChange();
    }
  }, [title]);

  // Bloquear scroll global
  useEffect(() => {
    const lenis = (window as any).__lenis;

    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/95 p-4 md:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-10 text-white/50 transition-colors hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Contenedor principal */}
          <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden py-16">
            {/* Header */}
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between flex-shrink-0">
              <div className="max-w-2xl">
                {title && (
                  <h2 className="font-serif text-4xl text-white md:text-5xl">
                    {title}
                  </h2>
                )}

                {description && (
                  <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-white/60">
                    {description}
                  </p>
                )}
              </div>

              {/* Audio */}
              {audio && (
                <div className="flex flex-shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3">
                  <button
                    onClick={toggleAudio}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    {playing ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>

                  <div>
                    <p className="text-sm text-white">
                      {audio.title ?? "Audio"}
                    </p>

                    {playing && (
                      <p className="text-xs text-white/50">
                        Reproduciendo...
                      </p>
                    )}
                  </div>

                  <audio
                    ref={audioRef}
                    src={audio.audio_url}
                    onEnded={() => setPlaying(false)}
                  />
                </div>
              )}
            </div>

            {/* Galería */}
            <div className="relative mt-6 flex-1 min-h-0 overflow-hidden">
              {images.length > 0 ? (
                <div
                  className="h-full overflow-y-auto overflow-x-hidden overscroll-contain pr-2"
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor:
                      "rgba(255,255,255,0.15) transparent",
                  }}
                >
                  <div className="grid grid-cols-2 gap-3 pb-4 md:grid-cols-4 md:gap-4">
                    {images.map((img) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl border border-white/5"
                      >
                        <img
                          src={img.image_url}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {img.caption && (
                          <div className="absolute inset-0 flex items-end bg-black/50 p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <p className="text-sm leading-tight text-white/90">
                              {img.caption}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-white/30">Sin imágenes</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}