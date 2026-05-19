import { createClient } from "@/lib/supabase/server";
import type { AnalyticsEvent } from "@/types/database";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("analytics_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const eventList = (events ?? []) as AnalyticsEvent[];

  const eventCounts = eventList.reduce(
    (acc, e) => {
      acc[e.event_type] = (acc[e.event_type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      <h1 className="mb-2 text-3xl font-light text-white">Analytics</h1>
      <p className="mb-10 text-white/50">Eventos personalizados en tiempo real</p>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {eventCounts &&
          Object.entries(eventCounts).map(([type, count]) => (
            <div
              key={type}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-white/50">{type}</p>
              <p className="mt-2 text-2xl font-light text-white">{count}</p>
            </div>
          ))}
      </div>

      <h2 className="mb-4 text-lg text-white/70">Últimos eventos</h2>
      <div className="space-y-2">
        {eventList.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-3 text-sm"
          >
            <span className="text-violet-300">{e.event_type}</span>
            <span className="text-white/40">
              {new Date(e.created_at).toLocaleString("es-ES")}
            </span>
          </div>
        ))}
        {!eventList.length && (
          <p className="text-white/40">Sin eventos aún. El frontend registra page_view, gallery_view, like, etc.</p>
        )}
      </div>
    </div>
  );
}
