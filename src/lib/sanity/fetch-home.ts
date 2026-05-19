import { getSanityClient } from "./client";
import { HOME_PAGE_QUERY } from "./queries";
import type { HomePageData } from "./types";

export const defaultHomeData: HomePageData = {
  settings: {
    siteTitle: "Galer",
    tagline: "Exposición digital cinematográfica",
    heroTitle: "Experiencias inmersivas",
    heroSubtitle:
      "Una galería 3D premium donde el arte, el movimiento y la luz convergen en tiempo real.",
    heroRooms: [
      { title: "Sala I", description: "Luz y sombra", accentColor: "#8b5cf6" },
      { title: "Sala II", description: "Geometría viva", accentColor: "#d946ef" },
      { title: "Sala III", description: "Horizonte digital", accentColor: "#f59e0b" },
    ],
    sections: ["hero", "masonry", "videos", "webgl", "featured"],
  },
  galleries: [],
  videos: [],
  categories: [],
  sections: [],
};

export async function fetchHomeData(preview = false): Promise<HomePageData> {
  const client = getSanityClient(preview);
  if (!client) return defaultHomeData;

  try {
    const data = await client.fetch<HomePageData>(HOME_PAGE_QUERY);
    return {
      settings: data.settings ?? defaultHomeData.settings,
      galleries: data.galleries ?? [],
      videos: data.videos ?? [],
      categories: data.categories ?? [],
      sections: data.sections ?? [],
    };
  } catch {
    return defaultHomeData;
  }
}
