import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  const [
    { count: galleriesCount },
    { count: usersCount },
    { count: likesCount },
    { count: eventsCount },
  ] = await Promise.all([
    supabase.from("galleries").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("likes").select("*", { count: "exact", head: true }),
    supabase.from("analytics_events").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <h1 className="mb-2 text-3xl font-light text-white">Dashboard</h1>
      <p className="mb-10 text-white/50">
        Bienvenido, {user?.username ?? user?.email}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Galerías" value={galleriesCount ?? 0} />
        <StatCard label="Usuarios" value={usersCount ?? 0} />
        <StatCard label="Likes totales" value={likesCount ?? 0} />
        <StatCard label="Eventos analytics" value={eventsCount ?? 0} trend="Tiempo real" />
      </div>
    </div>
  );
}
