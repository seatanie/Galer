import type { Metadata } from "next";
import { Instrument_Serif, Inter, Source_Code_Pro } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { CursorParticles } from "@/components/premium/cursor-particles";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceCode = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Galer — Galería Cinematográfica 3D",
  description:
    "Exposición digital premium con galería 3D, Sanity CMS, Supabase realtime y experiencia Awwwards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${instrumentSerif.variable} ${inter.variable} ${sourceCode.variable} h-full`}
    >
      <body className="min-h-full bg-black font-sans text-white antialiased">
        <CursorParticles />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
