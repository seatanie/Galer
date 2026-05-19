"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  className?: string;
}

export function StatCard({ label, value, trend, className }: StatCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md",
        className
      )}
    >
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-2 text-3xl font-light text-white">{value}</p>
      {trend && <p className="mt-1 text-xs text-violet-400">{trend}</p>}
    </motion.div>
  );
}
