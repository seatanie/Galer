"use client";

import { useEffect } from "react";
import { registerGsap, ScrollTrigger } from "@/animations/register-gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGsap();
    ScrollTrigger.refresh();
  }, []);

  return <>{children}</>;
}
