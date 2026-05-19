"use client";

import { updateUserRole } from "@/lib/auth/actions";
import type { UserRole } from "@/types/database";

export function UserRoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  return (
    <select
      defaultValue={currentRole}
      className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-white"
      onChange={async (e) => {
        await updateUserRole(userId, e.target.value as UserRole);
      }}
    >
      <option value="admin">admin</option>
      <option value="editor">editor</option>
      <option value="viewer">viewer</option>
    </select>
  );
}
