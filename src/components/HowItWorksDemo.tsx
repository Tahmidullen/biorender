"use client";

// HowItWorksDemo
// ────────────────────────────────────────────────────────────────────────────
// A scripted, looping animation that mimics a real user composing a figure
// in the editor. The cursor moves between the library on the left and the
// canvas on the right, picking up shapes and dropping them into place:
//
//   1. pick a cell shape   →  place it on the canvas
//   2. pick a receptor     →  anchor it to the cell membrane
//   3. pick a ligand       →  drift it onto the receptor's binding pocket
//   4. switch to text tool →  type "receptor" beside the receptor
//                          →  type "ligand"   beside the ligand
//   5. hit Export PNG      →  the button glows and a "saved" pill appears
//
// The end frame is a labelled cell-surface receptor binding diagram. The
// whole sequence loops while the section is on screen and pauses while
// off-screen so it doesn't waste CPU.

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useEffectiveReducedMotion } from "@/components/MotionPreference";

// ── Choreography ───────────────────────────────────────────────────────────

const PHASE_DURATION_MS = 1200;
const TOTAL_PHASES = 11;

// Captions shown beneath the mockup, one per phase.
const PHASE_LABELS = [
  "Open the editor",
  "Pick the cell shape",
  "Place the cell on the canvas",
  "Pick a receptor",
  "Anchor it to the membrane",
  "Pick a ligand",
  "Bind it to the receptor",
  "Switch to the text tool",
  "Label the receptor",
  "Label the ligand",
  "Export at 300 dpi",
];

// Cursor positions in the SVG's viewBox coordinate system (800 × 460).
// `click` is true on phases where the cursor visibly clicks something —
// it triggers the click-pulse ring around the cursor tip.
const CURSOR: { x: number; y: number; click?: boolean }[] = [
  { x: 480, y: 250 },                    // 0  idle
  { x: 36,  y: 86,  click: true },       // 1  hover Cell library item
  { x: 500, y: 260, click: true },       // 2  drop cell at canvas centre
  { x: 36,  y: 122, click: true },       // 3  hover Receptor library item
  { x: 610, y: 158, click: true },       // 4  anchor receptor on membrane
  { x: 36,  y: 158, click: true },       // 5  hover Ligand library item
  { x: 610, y: 122, click: true },       // 6  drop ligand into binding pocket
  { x: 36,  y: 242, click: true },       // 7  hover Text tool
  { x: 700, y: 158, click: true },       // 8  type receptor label
  { x: 700, y: 124, click: true },       // 9  type ligand label
  { x: 738, y: 22,  click: true },       // 10 hit Export button
];

export function HowItWorksDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [phase, setPhase] = useState(0);
  const reduced = useEffectiveReducedMotion();

  useEffect(() => {
    if (reduced) {
      setPhase(TOTAL_PHASES - 1);
    } else {
      setPhase(0);
    }
  }, [reduced]);

  // Advance phases on a fixed cadence — only while in view and motion is allowed.
  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => {
      setPhase((p) => (p + 1) % TOTAL_PHASES);
    }, PHASE_DURATION_MS);
    return () => clearInterval(id);
  }, [inView, reduced]);

  // Visibility flags. Each shape stays placed once the cursor has put it
  // there (>=N) and disappears at phase 0 again on loop.
  const cellShown       = phase >= 2;
  const receptorShown   = phase >= 4;
  const ligandShown     = phase >= 6;
  const receptorLabelOn = phase >= 8;
  const ligandLabelOn   = phase >= 9;
  const exporting       = phase === 10;

  const cursor = CURSOR[phase];

  return (
    <div ref={ref} className="mx-auto max-w-5xl">
      <div className="hairline-box overflow-hidden bg-surface">
        <svg
          viewBox="0 0 800 460"
          className="block w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          {/* ─── Window chrome ────────────────────────────────────── */}
          <rect width="800" height="40" className="fill-muted/40" />
          <line x1="0" y1="40" x2="800" y2="40" className="stroke-border" />
          <circle cx="16" cy="20" r="4" className="fill-foreground/15" />
          <circle cx="32" cy="20" r="4" className="fill-foreground/15" />
          <circle cx="48" cy="20" r="4" className="fill-foreground/15" />
          <text
            x="80" y="25"
            className="fill-muted-foreground"
            style={{ font: "11px ui-monospace, monospace" }}
          >
            canvas.bio · receptor-binding.draft
          </text>

          {/* Export button in the top-right of the chrome */}
          <motion.rect
            x="700" y="11" width="78" height="22" rx="4"
            initial={false}
            animate={{
              fill:   exporting ? "var(--primary)" : "rgba(0,0,0,0)",
              stroke: exporting ? "var(--primary)" : "var(--border)",
            }}
            transition={{ duration: 0.3 }}
            strokeWidth={1}
          />
          <motion.text
            x="739" y="26"
            initial={false}
            animate={{
              fill: exporting ? "var(--primary-foreground)" : "var(--muted-foreground)",
            }}
            transition={{ duration: 0.3 }}
            textAnchor="middle"
            style={{ font: "10px ui-monospace, monospace" }}
          >
            Export PNG
          </motion.text>

          {/* ─── Sidebar (library + tools) ─────────────────────────── */}
          <rect x="0" y="40" width="200" height="420" className="fill-muted/15" />
          <line x1="200" y1="40" x2="200" y2="460" className="stroke-border" />

          <text
            x="20" y="64"
            className="fill-muted-foreground"
            style={{ font: "600 10px ui-monospace, monospace", letterSpacing: "0.16em" }}
          >
            LIBRARY
          </text>

          <LibraryItem y={86}  label="Cell"     active={phase === 1}>
            <CellIcon cx={28} cy={86} />
          </LibraryItem>
          <LibraryItem y={122} label="Receptor" active={phase === 3}>
            <ReceptorIcon cx={28} cy={122} />
          </LibraryItem>
          <LibraryItem y={158} label="Ligand"   active={phase === 5}>
            <LigandIcon cx={28} cy={158} />
          </LibraryItem>

          <text
            x="20" y="216"
            className="fill-muted-foreground"
            style={{ font: "600 10px ui-monospace, monospace", letterSpacing: "0.16em" }}
          >
            TOOLS
          </text>

          <LibraryItem y={242} label="Text" active={phase === 7}>
            <TextIcon cx={28} cy={242} />
          </LibraryItem>

          {/* ─── Canvas background ─────────────────────────────────── */}
          <defs>
            <pattern id="demoGrid2" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle
                cx="1" cy="1" r="1"
                fill="currentColor" className="text-foreground/8"
              />
            </pattern>
          </defs>
          <rect x="200" y="40" width="600" height="420" fill="url(#demoGrid2)" />

          {/* ─── Cell ──────────────────────────────────────────────── */}
          <g transform="translate(500 260)">
            <motion.g
              initial={false}
              animate={{
                opacity: cellShown ? 1 : 0,
                scale:   cellShown ? 1 : 0.55,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* membrane */}
              <ellipse cx="0" cy="0" rx="160" ry="120"
                       className="fill-primary/8 stroke-primary"
                       strokeWidth={2} />
              {/* nucleus */}
              <ellipse cx="-30" cy="-10" rx="36" ry="28"
                       className="fill-primary/15 stroke-primary"
                       strokeWidth={1.4} />
              <circle cx="-36" cy="-14" r="3" className="fill-primary/55" />
            </motion.g>
          </g>

          {/* ─── Receptor (Y-shaped transmembrane protein) ─────────── */}
          {/* Anchored at (610, 158): stem crosses the cell membrane
              (the membrane sits at y≈164 at x=610 on this ellipse). */}
          <g transform="translate(610 158)">
            <motion.g
              initial={false}
              animate={{
                opacity: receptorShown ? 1 : 0,
                scale:   receptorShown ? 1 : 0.4,
                y:       receptorShown ? 0 : -14,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              {/* intracellular stem — crosses the membrane line */}
              <line x1="0" y1="-2" x2="0" y2="22"
                    className="stroke-chart-2" strokeWidth={4} strokeLinecap="round" />
              {/* extracellular Y-fork = ligand-binding pocket */}
              <line x1="0" y1="-2" x2="-12" y2="-18"
                    className="stroke-chart-2" strokeWidth={4} strokeLinecap="round" />
              <line x1="0" y1="-2" x2="12"  y2="-18"
                    className="stroke-chart-2" strokeWidth={4} strokeLinecap="round" />
            </motion.g>
          </g>

          {/* ─── Ligand (drifts in from upper right and snaps into the pocket) */}
          <g transform="translate(610 130)">
            <motion.g
              initial={false}
              animate={{
                opacity: ligandShown ? 1 : 0,
                x:       ligandShown ? 0 : 30,
                y:       ligandShown ? 0 : -28,
                scale:   ligandShown ? 1 : 0.5,
              }}
              transition={{ type: "spring", stiffness: 230, damping: 22 }}
            >
              <circle cx="0" cy="0" r="11"
                      className="fill-chart-3/30 stroke-chart-3" strokeWidth={2} />
              <circle cx="0" cy="0" r="3" className="fill-chart-3" />
            </motion.g>
          </g>

          {/* ─── Labels (typewriter via clip-path) ─────────────────── */}
          <defs>
            <clipPath id="receptorLabelClip">
              <motion.rect
                x="660" y="146" height="22"
                initial={false}
                animate={{ width: receptorLabelOn ? 110 : 0 }}
                transition={{ duration: 0.7, ease: "linear" }}
              />
            </clipPath>
            <clipPath id="ligandLabelClip">
              <motion.rect
                x="660" y="112" height="22"
                initial={false}
                animate={{ width: ligandLabelOn ? 80 : 0 }}
                transition={{ duration: 0.55, ease: "linear" }}
              />
            </clipPath>
          </defs>

          {/* Subtle leader line to receptor label, fades in with the label */}
          <motion.path
            d="M 624 158 L 656 158"
            className="stroke-muted-foreground"
            strokeWidth={1} strokeDasharray="2 3"
            initial={false}
            animate={{ opacity: receptorLabelOn ? 0.6 : 0 }}
            transition={{ duration: 0.3, delay: receptorLabelOn ? 0.2 : 0 }}
          />
          <text
            x="664" y="163"
            clipPath="url(#receptorLabelClip)"
            className="fill-foreground"
            style={{ font: "italic 14px var(--font-display, serif)" }}
          >
            receptor
          </text>

          {/* Leader line to ligand label */}
          <motion.path
            d="M 624 124 L 656 124"
            className="stroke-muted-foreground"
            strokeWidth={1} strokeDasharray="2 3"
            initial={false}
            animate={{ opacity: ligandLabelOn ? 0.6 : 0 }}
            transition={{ duration: 0.3, delay: ligandLabelOn ? 0.2 : 0 }}
          />
          <text
            x="664" y="129"
            clipPath="url(#ligandLabelClip)"
            className="fill-foreground"
            style={{ font: "italic 14px var(--font-display, serif)" }}
          >
            ligand
          </text>

          {/* ─── "Saved" pill that flashes in during export ─────────── */}
          <AnimatePresence>
            {exporting && (
              <motion.g
                key="saved-pill"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
              >
                <rect
                  x="270" y="60" width="200" height="28" rx="14"
                  className="fill-accent stroke-primary/40"
                  strokeWidth={1}
                />
                <text
                  x="370" y="78" textAnchor="middle"
                  className="fill-primary"
                  style={{ font: "11px ui-monospace, monospace" }}
                >
                  ✓ saved figure-01.png
                </text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* ─── Cursor ────────────────────────────────────────────── */}
          <motion.g
            initial={false}
            animate={{ x: cursor.x, y: cursor.y }}
            transition={{ duration: 0.85, ease: [0.32, 0, 0.32, 1] }}
          >
            {/* Click-pulse ring — re-keyed by phase so it fires fresh */}
            {cursor.click && (
              <motion.circle
                key={`pulse-${phase}`}
                cx={0} cy={0}
                initial={{ r: 0, opacity: 0.5 }}
                animate={{ r: 22, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="fill-none stroke-primary"
                strokeWidth={1.5}
              />
            )}
            {/* Arrow shape (a stylised lucide cursor). Tip is at (0,0). */}
            <path
              d="M 0 0 L 0 18 L 5 14 L 8 21 L 11 19 L 8 13 L 13 12 Z"
              className="fill-foreground stroke-background"
              strokeWidth={1.2}
              strokeLinejoin="round"
            />
          </motion.g>
        </svg>
      </div>

      {/* Editorial folio under the plate — like a figure caption set by
          hand: "№ 03 / 11   ·   Place the cell on the canvas". */}
      <figcaption className="mt-3 flex items-baseline gap-4 border-t border-border pt-2">
        <span className="colophon tnum shrink-0">
          № {String(phase + 1).padStart(2, "0")} / {String(TOTAL_PHASES).padStart(2, "0")}
        </span>
        <span className="text-[13px] text-foreground">
          {PHASE_LABELS[phase]}
        </span>
        <span className="ml-auto hidden colophon sm:inline">
          Fig. 02 &nbsp;·&nbsp; receptor-binding.draft
        </span>
      </figcaption>
    </div>
  );
}

// ─── Sidebar items ──────────────────────────────────────────────────────────

function LibraryItem({
  y, label, active, children,
}: {
  y: number;
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <g>
      {/* Motion can interpolate rgba but not color-mix() expressions, so
          we feed the primary teal as a literal rgba here. These map to
          --primary at 18% / 50% alpha respectively. */}
      <motion.rect
        x={12} y={y - 14} width={176} height={28} rx={5}
        initial={false}
        animate={{
          fill:   active ? "rgba(58, 109, 124, 0.18)" : "rgba(58, 109, 124, 0)",
          stroke: active ? "rgba(58, 109, 124, 0.50)" : "rgba(58, 109, 124, 0)",
        }}
        transition={{ duration: 0.25 }}
        strokeWidth={1}
      />
      {children}
      <text
        x={50}
        y={y}
        dy=".35em"
        dominantBaseline="middle"
        className="fill-foreground"
        style={{ font: "12px var(--font-sans), system-ui" }}
      >
        {label}
      </text>
    </g>
  );
}

// ─── Tiny inline SVG icons for the library and tools panel ─────────────────

function CellIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <circle
      cx={cx} cy={cy} r="9"
      className="fill-primary/15 stroke-primary"
      strokeWidth={1.5}
    />
  );
}

function ReceptorIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <line x1={cx} y1={cy + 8} x2={cx} y2={cy - 4}
            className="stroke-chart-2" strokeWidth={2} strokeLinecap="round" />
      <line x1={cx} y1={cy - 4} x2={cx - 5} y2={cy - 10}
            className="stroke-chart-2" strokeWidth={2} strokeLinecap="round" />
      <line x1={cx} y1={cy - 4} x2={cx + 5} y2={cy - 10}
            className="stroke-chart-2" strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

function LigandIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <circle
      cx={cx} cy={cy} r="6"
      className="fill-chart-3/30 stroke-chart-3"
      strokeWidth={1.5}
    />
  );
}

function TextIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <text
      x={cx}
      y={cy}
      dy=".35em"
      textAnchor="middle"
      dominantBaseline="middle"
      className="fill-foreground"
      style={{ font: "bold 14px var(--font-display, serif)" }}
    >
      T
    </text>
  );
}
