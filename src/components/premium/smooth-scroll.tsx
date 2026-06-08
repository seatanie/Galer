"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { registerGsap, ScrollTrigger } from "@/animations/register-gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGsap();

    const lenis = new Lenis({
      duration: 0.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      try {
        lenis.raf(time);
      } catch {
        // Si hay error, el loop sigue vivo
      }
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    ScrollTrigger.refresh();

    // Exponer lenis globalmente
    (window as any).__lenis = lenis;

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      delete (window as any).__lenis;
    };
  }, []);

  return <>{children}</>;
}
