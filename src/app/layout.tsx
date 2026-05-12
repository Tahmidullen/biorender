import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
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

// Editorial serif used for display headings (hero, section titles).
// Pairs with Geist Sans for a modern scientific-publishing feel.
const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
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
