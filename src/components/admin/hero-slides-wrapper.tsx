"use client";

import dynamic from "next/dynamic";
import type { HeroSlide } from "@/types/supabase-content";

const HeroSlidesFormClient = dynamic(
  () => import("@/components/admin/hero-slides-form").then((m) => m.HeroSlidesForm),
  { ssr: false }
);

interface HeroSlidesWrapperProps {
  slides: HeroSlide[];
}

export function HeroSlidesWrapper({ slides }: HeroSlidesWrapperProps) {
  return <HeroSlidesFormClient slides={slides} />;
}
