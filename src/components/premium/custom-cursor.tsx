"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 30 });
  const springY = useSpring(y, { stiffness: 400, damping: 30 });
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);
  const scale = useSpring(1, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);

    const onEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      setHovering(true);
      scale.set(1.8);
      const customLabel = target.closest("[data-cursor-label]")?.getAttribute("data-cursor-label");
      setLabel(customLabel ?? (target.closest("a,button") ? "VIEW" : ""));
    };
    const onLeave = () => {
      setHovering(false);
      scale.set(1);
      setLabel("");
    };

    const els = document.querySelectorAll("a, button, [data-cursor], [data-cursor-label]");
    els.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    const observer = new MutationObserver(() => {
      document.querySelectorAll("a, button, [data-cursor], [data-cursor-label]").forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, [x, y, scale]);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden mix-blend-difference md:block"
        style={{ x: springX, y: springY }}
      >
        <motion.div
          style={{ scale }}
          className="relative -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className={`h-4 w-4 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.8)] transition-opacity ${
              hovering ? "opacity-100" : "opacity-90"
            }`}
          />
          {label && (
            <span className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.3em] text-white">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden md:block"
        style={{ x: springX, y: springY }}
      >
        <motion.div
          style={{ scale }}
          className="-translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-white/25"
        />
      </motion.div>
    </>
  );
}
