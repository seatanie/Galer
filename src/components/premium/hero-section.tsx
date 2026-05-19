"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import Link from "next/link";
import { MagneticButton } from "./magnetic-button";

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(
      titleRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-black to-fuchsia-950/30"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 text-sm uppercase tracking-[0.4em] text-white/50"
        >
          Galería Cinematográfica
        </motion.p>
        <h1
          ref={titleRef}
          className="font-sans text-5xl font-light leading-[1.1] tracking-tight text-white md:text-8xl"
        >
          Experiencias
          <br />
          <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
            inmersivas
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mx-auto mt-8 max-w-xl text-lg text-white/60"
        >
          Portfolio premium con Sanity CMS, Supabase en tiempo real y animaciones cinematográficas.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/galerias" data-cursor>
            <MagneticButton>Explorar galerías</MagneticButton>
          </Link>
          <Link href="/admin" data-cursor>
            <MagneticButton className="border-white/10 bg-transparent">
              Panel admin
            </MagneticButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
