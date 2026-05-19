"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { registerGsap, ScrollTrigger } from "@/animations/register-gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGsap();

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    ScrollTrigger.refresh();

    // Exponer lenis globalmente para pausar/reanudar desde el modal
    (window as any).__lenis = lenis;

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      delete (window as any).__lenis;
    };
  }, []);

  return <>{children}</>;
}
