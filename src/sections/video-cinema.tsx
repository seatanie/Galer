"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useLightbox } from "@/components/providers/lightbox-provider";
import type { VideoRow } from "@/types/supabase-content";

interface VideoCinemaProps {
  videos: VideoRow[];
}

export function VideoCinema({ videos }: VideoCinemaProps) {
  const { open } = useLightbox();
  const [active, setActive] = useState(0);
  const video = videos[active];

  if (!videos.length) {
    return (
      <section id="videos" className="relative min-h-[50vh] px-6 py-32">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-16 text-center backdrop-blur-xl">
          <p className="font-mono text-sm text-white/40">
            Sube videos desde Admin → Contenido → Videos
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="videos" className="relative min-h-screen px-6 py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-violet-950/20 to-black" />
      <div className="relative mx-auto max-w-6xl">
        <p className="mb-4 font-mono text-xs tracking-[0.4em] text-white/40">CINEMA</p>
        <h2 className="mb-16 font-serif text-4xl font-light md:text-6xl">Videos inmersivos</h2>

        <div
          className="relative aspect-video cursor-none overflow-hidden rounded-3xl border border-white/10 glass"
          data-cursor-label="PLAY"
          onClick={() => {
            if (video.video_url) {
              open(
                [
                  {
                    src: video.poster_url ?? "",
                    type: "video",
                    videoUrl: video.video_url,
                    caption: video.title,
                  },
                ],
                0
              );
            }
          }}
        >
          {video.poster_url ? (
            <Image src={video.poster_url} alt={video.title} fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-violet-900/50 to-black" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md">
              <Play className="ml-1 h-8 w-8 fill-white text-white" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 glass">
            <h3 className="font-serif text-3xl">{video.title}</h3>
            {video.description && (
              <p className="mt-2 max-w-xl text-white/60">{video.description}</p>
            )}
          </div>
        </div>

        {videos.length > 1 && (
          <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
            {videos.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setActive(i)}
                className={`shrink-0 rounded-xl border px-6 py-3 font-mono text-xs tracking-widest ${
                  i === active
                    ? "border-violet-500/50 bg-violet-500/20 text-violet-300"
                    : "border-white/10 text-white/50"
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
