import { fetchHomeFromSupabase } from "@/lib/supabase/fetch-home";
import { HomeExperience } from "@/components/home/home-experience";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";

export default async function HomePage() {
  const data = await fetchHomeFromSupabase();

  return (
    <>
      <PageViewTracker />
      <HomeExperience initialData={data} livePreview />
    </>
  );
}
