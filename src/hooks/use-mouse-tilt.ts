"use client";

import { useCallback, useRef } from "react";

export function useMouseTilt(intensity = 12) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg)`;
    },
    [intensity]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "rotateY(0deg) rotateX(0deg)";
  }, []);

  return { ref, onMove, onLeave };
}
