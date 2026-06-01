"use client";

import { useState } from "react";
import Link from "next/link";
import { FullscreenMenu } from "./fullscreen-menu";

export function SiteHeader({ siteTitle = "Arte de la transformación" }: { siteTitle?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[8000] flex items-center justify-between px-6 py-6 mix-blend-difference">
        <Link href="/" data-cursor className="font-mono text-xs tracking-[0.4em] text-white">
          {siteTitle.toUpperCase()}
        </Link>
        <button
          data-cursor-label="MENU"
          onClick={() => setMenuOpen(true)}
          className="font-mono text-xs tracking-[0.3em] text-white/80 hover:text-white"
        >
          MENÚ
        </button>
      </header>
      <FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
