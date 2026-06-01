"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateUserRole } from "@/lib/auth/actions";
import type { UserRole } from "@/types/database";

const roles: { value: UserRole; label: string }[] = [
  { value: "admin", label: "admin" },
  { value: "editor", label: "editor" },
  { value: "viewer", label: "viewer" },
];

export function UserRoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(currentRole);
  const [pending, setPending] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function select(value: UserRole) {
    setPending(true);
    setSelected(value);
    setOpen(false);
    await updateUserRole(userId, value);
    setPending(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={pending}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white/80 transition-all hover:border-white/20 active:scale-95"
      >
        <motion.span
          key={selected}
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: 0, opacity: pending ? 0.4 : 1 }}
          transition={{ duration: 0.15 }}
        >
          {roles.find((r) => r.value === selected)?.label}
        </motion.span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/40"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-black/95 backdrop-blur-2xl shadow-2xl shadow-violet-500/5"
          >
            {roles.map((role, i) => (
              <motion.button
                key={role.value}
                type="button"
                onClick={() => select(role.value)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, type: "spring", stiffness: 300, damping: 24 }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  selected === role.value
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex h-4 w-4 items-center justify-center">
                  {selected === role.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="h-2 w-2 rounded-full bg-violet-400"
                    />
                  )}
                </div>
                <span>{role.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
