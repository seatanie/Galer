"use client";

import { SmoothScroll } from "@/components/premium/smooth-scroll";
import { LightboxProvider } from "@/components/providers/lightbox-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LightboxProvider>
      <SmoothScroll>
        {children}
      </SmoothScroll>
    </LightboxProvider>
  );
}
