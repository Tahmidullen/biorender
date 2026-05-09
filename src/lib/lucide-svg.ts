"use client";

import { createElement, type SVGProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as Lucide from "lucide-react";
import type { LucideName } from "@/lib/assets";

// Render lucide icons to SVG strings on demand. The same icon name that the
// AssetLibrary renders in the UI is the one rasterised onto the fabric
// canvas — single source of truth.

type Options = {
  size?: number;
  /** Stroke colour (also fills outline icons via currentColor). */
  color?: string;
  /** Optional inner fill colour, defaults to none (outline-only). */
  fill?: string;
  strokeWidth?: number;
};

type LucideComponent = React.FC<SVGProps<SVGSVGElement> & { color?: string; size?: number | string; strokeWidth?: number | string }>;

function getIcon(name: LucideName): LucideComponent {
  const Icon = (Lucide as unknown as Record<string, LucideComponent>)[name];
  return Icon ?? Lucide.HelpCircle as LucideComponent;
}

export function lucideToSvg(
  name: LucideName,
  { size = 96, color = "#0f172a", fill = "none", strokeWidth = 1.6 }: Options = {},
): string {
  const Icon = getIcon(name);
  // lucide forwards `color` to currentColor and accepts width/height directly.
  return renderToStaticMarkup(
    createElement(Icon, {
      width: size,
      height: size,
      color,
      strokeWidth,
      fill,
      // Slightly rounded joins read better when scaled up on canvas
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
  );
}
