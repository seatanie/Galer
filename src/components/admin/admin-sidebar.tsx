"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Users,
  BarChart3,
  LogOut,
  PenLine,
  Eye,
} from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/contenido", label: "Contenido CMS", icon: PenLine },
  { href: "/admin/preview", label: "Live Preview", icon: Eye },
  { href: "/admin/galerias", label: "Galerías", icon: Images },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-white/10 bg-black/40 p-6 backdrop-blur-xl">
      <Link href="/admin" className="mb-10 text-xl font-light tracking-widest text-white">
        GALER<span className="text-violet-400">.</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors",
              pathname === href
                ? "bg-violet-500/20 text-violet-300"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
