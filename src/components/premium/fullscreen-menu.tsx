"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/animations/register-gsap";

const links = [
  { href: "/#hero", label: "Home" },
  { href: "/#intro", label: "Proyecto" },
  { href: "/#modelos", label: "Modelos" },
  { href: "/admin", label: "Admin" },
];

interface FullscreenMenuProps {
  open: boolean;
  onClose: () => void;
}

export function FullscreenMenu({ open, onClose }: FullscreenMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  const animateOut = useCallback(() => {
    if (!panelRef.current || !linksRef.current || !bgRef.current) return;
    if (timeline.current) timeline.current.kill();

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => gsap.set(panelRef.current!, { display: "none" }),
    });

    tl.to(linksRef.current.children, {
      y: -40,
      opacity: 0,
      stagger: 0.04,
      duration: 0.4,
    })
      .to(
        bgRef.current,
        { scaleY: 0, transformOrigin: "top center", duration: 0.6 },
        "-=0.2"
      )
      .to(panelRef.current, { opacity: 0, duration: 0.15 }, "-=0.3");
  }, []);

  useEffect(() => {
    if (!panelRef.current || !linksRef.current || !bgRef.current) return;
    if (timeline.current) timeline.current.kill();

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    timeline.current = tl;

    if (open) {
      gsap.set(bgRef.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(panelRef.current, { display: "flex" });

      tl.to(panelRef.current, { opacity: 1, duration: 0.15 })
        .to(bgRef.current, { scaleY: 1, duration: 0.7, ease: "power4.inOut" }, "-=0.05")
        .fromTo(
          linksRef.current.children,
          { y: 80, opacity: 0, rotateX: -15 },
          { y: 0, opacity: 1, rotateX: 0, stagger: 0.06, duration: 0.7, ease: "power3.out" },
          "-=0.3"
        );
    } else {
      animateOut();
    }
  }, [open, animateOut]);

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[9000] hidden items-center justify-center"
      style={{ display: open ? "flex" : "none" }}
    >
      {/* Fondo con animación de persiana */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-black will-change-transform"
      />

      {/* Cerrar */}
      <button
        onClick={() => {
          animateOut();
          setTimeout(onClose, 600);
        }}
        data-cursor-label="CLOSE"
        className="absolute right-8 top-8 z-10 font-mono text-sm tracking-widest text-white/50 transition-colors hover:text-white"
      >
        CERRAR
      </button>

      {/* Links */}
      <nav ref={linksRef} className="relative z-10 flex flex-col items-center gap-5 perspective-[1000px]">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => {
              animateOut();
              setTimeout(onClose, 600);
            }}
            data-cursor
            className="group relative font-serif text-5xl font-light text-white/80 transition-all duration-500 hover:text-violet-300 md:text-7xl"
          >
            <span className="relative inline-block transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_30px_rgba(196,181,253,0.3)]">
              {link.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
