"use client";

import dynamic from "next/dynamic";

const WebGLCanvas = dynamic(() => import("@/components/gallery/webgl-particles").then((m) => m.WebGLParticles), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center font-mono text-xs text-white/30">
      Cargando WebGL…
    </div>
  ),
});

export function WebGLSculpture() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-center font-mono text-xs tracking-[0.4em] text-white/40">WEBGL</p>
        <h2 className="mb-12 text-center font-serif text-4xl font-light md:text-5xl">
          Partículas & profundidad
        </h2>
        <WebGLCanvas />
      </div>
    </section>
  );
}
