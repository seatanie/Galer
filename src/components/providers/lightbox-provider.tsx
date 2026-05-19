"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { PremiumLightbox } from "@/components/premium/lightbox";

export interface LightboxItem {
  src: string;
  alt?: string;
  caption?: string;
  type?: "image" | "video";
  videoUrl?: string;
}

interface LightboxContextValue {
  open: (items: LightboxItem[], index?: number) => void;
  close: () => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LightboxItem[]>([]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const openLightbox = useCallback((newItems: LightboxItem[], start = 0) => {
    setItems(newItems);
    setIndex(start);
    setOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setOpen(false), []);

  return (
    <LightboxContext.Provider value={{ open: openLightbox, close: closeLightbox }}>
      {children}
      <PremiumLightbox
        items={items}
        index={index}
        open={open}
        onClose={closeLightbox}
        onIndexChange={setIndex}
      />
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox debe usarse dentro de LightboxProvider");
  return ctx;
}
