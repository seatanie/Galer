"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/register-gsap";

interface IntroSectionProps {
  title?: string | null;
  subtitle?: string | null;
  text?: string | null;
}

export function IntroSection({ title, subtitle, text }: IntroSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-intro]", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="intro"
      ref={ref}
      className="flex min-h-screen items-center justify-center bg-black px-6"
    >
      <div className="mx-auto max-w-4xl text-center">
        {title && (
          <h2
            data-intro
            className="mb-8 font-serif text-4xl font-light leading-tight md:text-6xl"
          >
            {title}
          </h2>
        )}
        {subtitle && (
          <p
            data-intro
            className="mx-auto mb-6 max-w-2xl text-sm uppercase tracking-[0.28em] text-white/40"
          >
            {subtitle}
          </p>
        )}
        {text && (
          <p
            data-intro
            className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60"
          >
            {text}
          </p>
        )}
      </div>
    </section>
  );
}
