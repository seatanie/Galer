"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export interface SlotImage {
  id: string;
  url: string;
  title?: string | null;
}

interface SlotCarouselProps {
  images: SlotImage[];
  title?: string | null;
}

export function SlotCarousel({ images, title }: SlotCarouselProps) {
  const [current, setCurrent] = useState(0);
  const startX = useRef(0);
  const total = images.length;

  if (!total) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <span className="text-xs text-white/20">Sin fotos</span>
      </div>
    );
  }

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(total - 1, c + 1));

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl select-none">
      {/* Slider track */}
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{
          width: `${total * 100}%`,
          transform: `translateX(-${(current / total) * 100}%)`,
          touchAction: "pan-y",
        }}
        onPointerDown={(e) => {
          startX.current = e.clientX;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerUp={(e) => {
          const dx = e.clientX - startX.current;
          if (dx < -40) next();
          else if (dx > 40) prev();
        }}
      >
        {images.map((img) => (
          <div
            key={img.id}
            className="relative h-full flex-shrink-0"
            style={{ width: `${100 / total}%` }}
          >
            <Image
              src={img.url}
              alt={img.title ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Tap zones para navegar (como IG) */}
      {total > 1 && (
        <>
          <button
            className="absolute inset-y-0 left-0 z-10 w-1/3"
            onClick={prev}
            aria-label="Foto anterior"
          />
          <button
            className="absolute inset-y-0 right-0 z-10 w-1/3"
            onClick={next}
            aria-label="Foto siguiente"
          />
        </>
      )}

      {/* Título */}
      {title && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/70 to-transparent px-4 pb-8 pt-4">
          <p className="text-sm font-medium text-white">{title}</p>
        </div>
      )}

      {/* Dots indicadores */}
      {total > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-200 ${
                i === current ? "h-1.5 w-4 bg-white" : "h-1.5 w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Contador */}
      {total > 1 && (
        <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-black/40 px-2 py-0.5 text-xs text-white/80">
          {current + 1}/{total}
        </div>
      )}
    </div>
  );
}
