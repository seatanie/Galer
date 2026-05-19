"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import type { LightboxItem } from "@/components/providers/lightbox-provider";

interface PremiumLightboxProps {
  items: LightboxItem[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

export function PremiumLightbox({
  items,
  index,
  open,
  onClose,
  onIndexChange,
}: PremiumLightboxProps) {
  const current = items[index];

  const prev = () => onIndexChange((index - 1 + items.length) % items.length);
  const next = () => onIndexChange((index + 1) % items.length);

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center"
        >
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            onClick={onClose}
          />
          <motion.button
            data-cursor-label="CLOSE"
            onClick={onClose}
            className="absolute right-6 top-6 z-10 rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-md"
          >
            <X className="h-5 w-5" />
          </motion.button>

          {items.length > 1 && (
            <>
              <button
                data-cursor-label="PREV"
                onClick={prev}
                className="absolute left-6 z-10 rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-md"
              >
                <ChevronLeft />
              </button>
              <button
                data-cursor-label="NEXT"
                onClick={next}
                className="absolute right-20 z-10 rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-md"
              >
                <ChevronRight />
              </button>
            </>
          )}

          <motion.div
            key={index}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-[1] mx-auto max-h-[85vh] max-w-[90vw]"
          >
            {current.type === "video" && current.videoUrl ? (
              <video
                src={current.videoUrl}
                controls
                autoPlay
                className="max-h-[85vh] rounded-2xl shadow-2xl"
              />
            ) : (
              <Image
                src={current.src}
                alt={current.alt ?? ""}
                width={1600}
                height={1200}
                className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl"
              />
            )}
            {(current.caption || current.alt) && (
              <p className="mt-6 text-center font-serif text-lg text-white/80">
                {current.caption ?? current.alt}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
