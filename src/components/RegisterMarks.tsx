// RegisterMarks — corner crosshair marks for figure plates.
// ──────────────────────────────────────────────────────────────────────────
// The four-position printer's register marks (small ⊕ symbols) that appear
// at the corners of every figure plate on the site. They serve two
// purposes:
//
//   1. Recurring system motif. They tie any "plate" element to the
//      scientific-drafting language we're using.
//   2. A subtle visual anchor — the plate's bounding rect is announced
//      without a heavy border.
//
// Pure SVG, no client JS, no animation. Drop into any positioned parent.

import { cn } from "@/lib/utils";

type Props = {
  /** Size of each register mark in pixels. */
  size?: number;
  /** Distance of each mark from the corner, in pixels. */
  inset?: number;
  /** Override the ink colour with a CSS colour value. */
  color?: string;
  className?: string;
};

function Mark({ size, color }: { size: number; color: string }) {
  const half = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      style={{ color }}
    >
      {/* Outer ring */}
      <circle
        cx={half}
        cy={half}
        r={half - 1}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      {/* Crosshair, extending slightly past the ring */}
      <line x1={half} y1="0"    x2={half} y2={size} stroke="currentColor" strokeWidth="0.6" />
      <line x1="0"    y1={half} x2={size} y2={half} stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

export function RegisterMarks({
  size = 10,
  inset = 8,
  color = "color-mix(in oklab, var(--ink) 38%, transparent)",
  className,
}: Props) {
  // Common style for each corner — absolutely placed at `inset` distance.
  const style = (corner: "tl" | "tr" | "bl" | "br"): React.CSSProperties => {
    const pos: React.CSSProperties = { position: "absolute" };
    if (corner === "tl" || corner === "bl") pos.left = inset;
    if (corner === "tr" || corner === "br") pos.right = inset;
    if (corner === "tl" || corner === "tr") pos.top = inset;
    if (corner === "bl" || corner === "br") pos.bottom = inset;
    pos.pointerEvents = "none";
    return pos;
  };

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none", className)}
    >
      <div style={style("tl")}><Mark size={size} color={color} /></div>
      <div style={style("tr")}><Mark size={size} color={color} /></div>
      <div style={style("bl")}><Mark size={size} color={color} /></div>
      <div style={style("br")}><Mark size={size} color={color} /></div>
    </div>
  );
}
