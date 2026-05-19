import { createClient } from "@/lib/supabase/server";
import type { User } from "@/types/database";
import { UserRoleSelect } from "@/components/admin/user-role-select";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: usersRaw } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  const users = (usersRaw ?? []) as User[];

  return (
    <div>
      <h1 className="mb-2 text-3xl font-light text-white">Usuarios</h1>
      <p className="mb-10 text-white/50">Gestión de roles: admin, editor, viewer</p>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-6 py-4 font-medium text-white/70">Usuario</th>
              <th className="px-6 py-4 font-medium text-white/70">Email</th>
              <th className="px-6 py-4 font-medium text-white/70">Rol</th>
              <th className="px-6 py-4 font-medium text-white/70">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-white/5">
                <td className="px-6 py-4 text-white">{user.username ?? "—"}</td>
                <td className="px-6 py-4 text-white/60">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-300">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <UserRoleSelect userId={user.id} currentRole={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!users.length && (
          <p className="p-8 text-center text-white/40">No hay usuarios registrados.</p>
        )}
      </div>
    </div>
  );
}
