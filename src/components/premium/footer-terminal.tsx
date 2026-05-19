"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/animations/register-gsap";

const tickerText = "";

export function FooterTerminal() {
  const sweepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sweepRef.current) return;
    gsap.to(sweepRef.current, {
      xPercent: 100,
      duration: 3,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black py-16">
      <div
        ref={sweepRef}
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/10 to-transparent"
      />
      <div className="overflow-hidden border-b border-white/5 py-3">
        <div className="flex whitespace-nowrap font-mono text-xs tracking-widest text-white/40">
          <span className="animate-ticker inline-block">{tickerText.repeat(4)}</span>
        </div>
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-6 pt-12 md:flex-row">
        <p className="font-mono text-xs text-white/30">
          © {new Date().getFullYear()} GALER — Exposición digital
        </p>
        <nav className="flex gap-8 font-mono text-xs tracking-widest">
          <Link href="/admin" data-cursor className="text-white/50 hover:text-violet-300">
            ADMIN
          </Link>
        </nav>
      </div>
    </footer>
  );
}
