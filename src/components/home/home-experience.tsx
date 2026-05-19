"use client";

import { SiteHeader } from "@/components/premium/site-header";
import { FooterTerminal } from "@/components/premium/footer-terminal";
import { HeroSlideshow } from "@/sections/hero-slideshow";
import { Hero3DGallery } from "@/sections/hero-3d-gallery";
import { IntroSection } from "@/sections/intro-section";
import { useSupabaseLive } from "@/hooks/use-supabase-live";
import { mapHeroRoomsFor3D } from "@/lib/supabase/mappers";
import type { HomePageData } from "@/types/supabase-content";

interface HomeExperienceProps {
  initialData: HomePageData;
  livePreview?: boolean;
}

export function HomeExperience({ initialData, livePreview = false }: HomeExperienceProps) {
  const { data } = useSupabaseLive(initialData, livePreview || true);
  const sections = ["hero", "intro", "modelos"];
  const heroRooms = mapHeroRoomsFor3D(data.heroRooms);

  return (
    <>
      <SiteHeader siteTitle={data.settings?.site_title ?? undefined} />
      <main>
        {sections.includes("hero") && (
          <section id="hero">
            <HeroSlideshow
              slides={(data as any).heroSlides ?? []}
              siteTitle={data.settings?.site_title ?? undefined}
              tagline={data.settings?.tagline ?? undefined}
            />
          </section>
        )}
        {sections.includes("intro") && (
          <IntroSection
            title={data.settings?.intro_title}
            text={data.settings?.intro_text}
          />
        )}
        {sections.includes("modelos") && (
          <section id="modelos">
            <Hero3DGallery
              siteTitle={data.settings?.site_title ?? undefined}
              tagline={data.settings?.tagline ?? undefined}
              heroTitle={data.settings?.hero_title ?? undefined}
              heroSubtitle={data.settings?.hero_subtitle ?? undefined}
              rooms={heroRooms}
            />
          </section>
        )}
      </main>
      <FooterTerminal />
    </>
  );
}
