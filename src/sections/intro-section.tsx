"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/register-gsap";

interface IntroSectionProps {
  title?: string | null;
  subtitle?: string | null;
  text?: string | null;
  quienesSomos?: string | null;
  quienesSomosDesc1?: string | null;
  quienesSomosDesc2?: string | null;
  porQue?: string | null;
  porQueDesc1?: string | null;
  porQueDesc2?: string | null;
  paraQue?: string | null;
  paraQueDesc1?: string | null;
  paraQueDesc2?: string | null;
}

export function IntroSection({
  title,
  subtitle,
  text,
  quienesSomos,
  quienesSomosDesc1,
  quienesSomosDesc2,
  porQue,
  porQueDesc1,
  porQueDesc2,
  paraQue,
  paraQueDesc1,
  paraQueDesc2,
}: IntroSectionProps) {
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

  const items = [
    {
      id: "quienes-somos",
      title: "¿Quiénes Somos?",
      text: quienesSomos,
      desc1: quienesSomosDesc1,
      desc2: quienesSomosDesc2,
    },
    {
      id: "por-que",
      title: "¿Por Qué?",
      text: porQue,
      desc1: porQueDesc1,
      desc2: porQueDesc2,
    },
    {
      id: "para-que",
      title: "¿Para Qué?",
      text: paraQue,
      desc1: paraQueDesc1,
      desc2: paraQueDesc2,
    },
  ];

  return (
    <section
      id="intro"
      ref={ref}
      className="flex min-h-screen items-center justify-center bg-black px-6"
    >
      <div className="mx-auto max-w-6xl text-center">
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
            className="mx-auto mb-16 max-w-2xl text-lg leading-relaxed text-white/60"
          >
            {text}
          </p>
        )}

        <div className="grid gap-12 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} id={item.id} data-intro className="text-center">
              <h3 className="mb-6 font-serif text-4xl font-light text-white/90 md:text-6xl">
                {item.title}
              </h3>
              {item.text && (
                <p className="mx-auto mb-4 max-w-sm text-base leading-relaxed text-white/70 md:text-lg">
                  {item.text}
                </p>
              )}
              {item.desc1 && (
                <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/40">
                  {item.desc1}
                </p>
              )}
              {item.desc2 && (
                <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/40">
                  {item.desc2}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
