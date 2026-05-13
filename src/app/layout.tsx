import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EnvironmentalAtmosphere } from "@/components/EnvironmentalAtmosphere";
import { MotionPreferenceProvider } from "@/components/MotionPreference";
import { ReducedMotionToggle } from "@/components/ReducedMotionToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Display sans — sharp, editorial contrast with Geist body copy (no script italics).
const outfitDisplay = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Canvas — Scientific figures, beautifully made",
  description:
    "A modern editor for publication-ready scientific figures. Drag, drop, and ship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfitDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-transparent font-sans text-foreground">
        <MotionPreferenceProvider>
          <EnvironmentalAtmosphere />
          <TooltipProvider>
            <div className="relative z-[1] min-h-full flex flex-col">{children}</div>
            <ReducedMotionToggle />
          </TooltipProvider>
        </MotionPreferenceProvider>
        <Analytics />
      </body>
    </html>
  );
}
