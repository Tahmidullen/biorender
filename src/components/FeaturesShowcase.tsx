"use client";

// FeaturesShowcase — a pinned, scroll-orchestrated feature presentation.
// ──────────────────────────────────────────────────────────────────────────
// Replaces the previous 6-row features grid (a generic SaaS pattern). The
// section is ~5× the viewport tall; inside it, a single figure plate
// stays pinned at the centre of the screen and morphs as the user scrolls,
// demonstrating one feature at a time:
//
//   00  Manipulate a shape   — drag handles + alignment guides + nudge
//   01  The library          — a grid of vetted shapes ticking in
//   02  Recolour anything    — a palette transforms a single figure
//   03  Publication exports  — file-type chips emit from the plate
//
// Each phase has its own SVG group. We cross-fade between groups based on
// scroll progress, and each phase's group plays its own micro-animation
// once it becomes active. The feature copy column on the left moves with
// the same scroll position so the user feels they're operating the plate.
//
// Performance notes:
//   - All transforms are GPU-friendly (opacity, transform).
//   - We use useScroll(target: container, offset) so the calculation is
//     scoped to the section, not the whole page.
//   - SVG geometry is small (under 200 nodes total across all phases).

import { useId, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { useEffectiveReducedMotion } from "@/components/MotionPreference";
import { RegisterMarks } from "@/components/RegisterMarks";

// ─── Phase metadata ───────────────────────────────────────────────────────
const PHASES = [
  {
    n: "00",
    title: "Snap & drag",
    body: "Guides and handles show up when you need them — less hunting through menus.",
    plateLabel: "Fig. 02a · Move · drag · snap",
  },
  {
    n: "01",
    title: "Icons galore",
    body: "Cells, microbes, lab gear — pick from the strip and drop them on the canvas.",
    plateLabel: "Fig. 02b · Library plate",
  },
  {
    n: "02",
    title: "Recolor in one go",
    body: "Try a new palette; outlines, fills, and labels move together.",
    plateLabel: "Fig. 02c · Palette transform",
  },
  {
    n: "03",
    title: "Export the way they want",
    body: "PNG for slides, SVG or PDF when someone asks for vectors.",
    plateLabel: "Fig. 02d · Export · 300 dpi",
  },
] as const;

// ─── The section ──────────────────────────────────────────────────────────
export function FeaturesShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useEffectiveReducedMotion();

  // Track scroll progress within the showcase section: 0 when the top of
  // the section hits the top of the viewport, 1 when the bottom of the
  // section hits the bottom.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // We use 4 "windows" of 1/4 each, with slight overlap for the crossfade.
  // The active index is whatever phase has the most weight at the current
  // progress.
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 4 phases evenly distributed: 0 → 0.25, 0.25 → 0.5, etc.
    // We bias slightly toward the *current* phase so the title doesn't
    // flicker at boundaries.
    const idx = Math.min(
      PHASES.length - 1,
      Math.max(0, Math.floor(latest * PHASES.length)),
    );
    if (idx !== activeIndex) setActiveIndex(idx);
  });

  // Reduced motion: skip the pinning and just lay the four blocks out
  // sequentially.
  if (reducedMotion) {
    return (
      <section className="hairline-t bg-paper-grain-veil px-6 py-24" id="features">
        <div className="mx-auto max-w-[1240px] space-y-20">
          <header className="grid grid-cols-12 gap-x-6 items-end pb-8 hairline-b">
            <div className="col-span-12 md:col-span-8">
              <h2 className="font-display text-[44px] leading-[1.02] tracking-[-0.02em] text-foreground md:text-[60px]">
                Built for the figure
                <br />
                <span className="font-medium text-primary">you actually hand in.</span>
              </h2>
            </div>
          </header>
          {PHASES.map((p) => (
            <div key={p.n} className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-5">
                <h3 className="font-display text-[28px] leading-tight text-foreground">{p.title}</h3>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-muted-foreground">{p.body}</p>
              </div>
              <div className="col-span-12 md:col-span-7">
                <FeaturePlateFrame label={p.plateLabel}>
                  <DemoStatic index={PHASES.indexOf(p)} />
                </FeaturePlateFrame>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="hairline-t bg-paper-grain-veil px-6"
      id="features"
      style={{
        // The section is tall enough that the user spends ~4 viewport
        // heights inside it; each phase gets ~1 viewport of scroll.
        height: `${PHASES.length * 100}vh`,
      }}
    >
      <div className="mx-auto max-w-[1240px] h-full">
        {/* Sticky stage. top-16 leaves room for the sticky Masthead
            above; height is the viewport minus that strip. */}
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] min-h-0 flex-col">
          {/* Section masthead — compact so phase title + plate fit one viewport */}
          <header className="grid grid-cols-12 gap-x-6 gap-y-2 items-end hairline-b pb-3 pt-4 md:pb-4 md:pt-6">
            <div className="col-span-12 md:col-span-8">
              <h2 className="font-display text-[28px] leading-[1.08] tracking-[-0.02em] text-foreground md:text-[40px]">
                Built for the figure
                <span className="font-medium text-primary"> you actually hand in.</span>
              </h2>
            </div>
            <PhaseTabs
              active={activeIndex}
              count={PHASES.length}
              progress={scrollYProgress}
            />
          </header>

          {/* Fill viewport: big preview, short copy */}
          <div className="grid min-h-0 flex-1 grid-cols-12 gap-x-6 gap-y-3 py-2 md:gap-y-4 md:py-3 items-stretch">
            <CopyColumn active={activeIndex} reduced={reducedMotion} />
            <div className="col-span-12 flex min-h-[min(48svh,480px)] flex-col md:col-span-7 md:min-h-[min(52svh,560px)]">
              <FeaturePlateFrame label={PHASES[activeIndex].plateLabel}>
                <Demos active={activeIndex} progress={scrollYProgress} reduced={reducedMotion} />
              </FeaturePlateFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Phase tabs (top-right of section header) ─────────────────────────────
function PhaseTabs({
  active,
  count,
  progress,
}: {
  active: number;
  count: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Hoist the hook call so React-hooks lint is unambiguous.
  const barWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="col-span-12 md:col-span-4 mt-4 md:mt-0 md:text-right">
      <div className="inline-flex items-baseline gap-2 colophon">
        <span className="tnum">{String(active + 1).padStart(2, "0")}</span>
        <span>/ {String(count).padStart(2, "0")}</span>
      </div>
      {/* A tiny progress bar — section-local scroll progress for this plate. */}
      <div className="mt-2 h-px w-32 ml-auto bg-border relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-ink"
          style={{ width: barWidth }}
        />
      </div>
    </div>
  );
}

// ─── Left copy column (4 stacked blocks, crossfading) ─────────────────────
function CopyColumn({ active, reduced }: { active: number; reduced: boolean }) {
  return (
    <div className="col-span-12 mt-1 md:col-span-5 md:mt-0 relative min-h-0" style={{ minHeight: "min(36vh, 200px)" }}>
      {PHASES.map((p, i) => {
        const isActive = i === active;
        return (
          <motion.div
            key={p.n}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              y: isActive ? 0 : reduced ? 0 : 14,
              letterSpacing: isActive ? "-0.015em" : "-0.005em",
            }}
            transition={{
              duration: reduced ? 0.06 : 0.55,
              ease: [0.22, 0.61, 0.36, 1],
            }}
            style={{ pointerEvents: isActive ? "auto" : "none" }}
          >
            <h3 className="font-display text-[24px] leading-[1.08] tracking-[-0.02em] text-foreground md:text-[30px]">
              {p.title}
            </h3>
            <p className="mt-2 max-w-[38ch] text-[14px] leading-[1.5] text-muted-foreground md:text-[15px]">
              {p.body}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── The figure plate frame ───────────────────────────────────────────────
// A reusable wrapper that gives any child the editor-window chrome and
// register marks. The label is shown below as a figcaption.
function FeaturePlateFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <figure className="flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden hairline-box bg-surface">
        <RegisterMarks size={9} inset={6} />
        <div className="flex shrink-0 items-center gap-2 hairline-b bg-muted/40 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="ml-3 font-mono text-[10.5px] text-muted-foreground">
            canvas.bio · scratch
          </span>
        </div>
        <div className="relative min-h-[260px] flex-1 bg-background md:min-h-[320px]">
          {children}
        </div>
      </div>
      <figcaption className="mt-1.5 flex shrink-0 items-baseline justify-between border-t border-border pt-1.5 colophon text-[11px] sm:text-[12px]">
        <span>{label}</span>
        <span className="hidden sm:inline tnum">300 dpi</span>
      </figcaption>
    </figure>
  );
}

// ─── The four demo SVGs, animated based on which is active ────────────────
function Demos({
  active,
  progress,
  reduced,
}: {
  active: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduced: boolean;
}) {
  return (
    <div className="absolute inset-0">
      {PHASES.map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === active ? 1 : 0 }}
          transition={{ duration: reduced ? 0.05 : 0.45, ease: "easeOut" }}
          style={{ pointerEvents: i === active ? "auto" : "none" }}
        >
          {i === 0 && <DemoMove progress={progress} />}
          {i === 1 && <DemoLibrary progress={progress} />}
          {i === 2 && <DemoRecolour progress={progress} />}
          {i === 3 && <DemoExport progress={progress} reduced={reduced} />}
        </motion.div>
      ))}
    </div>
  );
}

// A static fallback used in reduced-motion mode (no animations).
function DemoStatic({ index }: { index: number }) {
  if (index === 0) return <DemoMoveStatic />;
  if (index === 1) return <DemoLibraryStatic />;
  if (index === 2) return <DemoRecolourStatic />;
  return <DemoExportStatic />;
}

// ─── Phase 00 — Direct manipulation ───────────────────────────────────────
// A draggable shape moves horizontally across the canvas while alignment
// guides (dotted lines) materialise from the page margins.
function DemoMove({
  progress,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Map global scrollProgress within the *first quarter* into a local 0..1.
  // We map this to an x-position for the shape.
  const local = useTransform(progress, [0, 0.25], [0, 1], { clamp: true });
  const cx = useTransform(local, [0, 1], [110, 270]);
  const guideOpacity = useTransform(local, [0.3, 0.5, 0.9], [0, 1, 1]);

  // Coordinate readout that follows the shape — tabular nums.
  const coordX = useTransform(cx, (v) => `${Math.round(v * 4)}`);
  const coordY = useTransform(local, () => "184");

  return (
    <svg
      viewBox="0 0 400 250"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <pattern id="featuresDots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" className="text-foreground/10" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill="url(#featuresDots)" />

      {/* Alignment guides (centre column / row) */}
      <motion.line
        x1="200" y1="20" x2="200" y2="230"
        className="stroke-primary"
        strokeWidth="1"
        strokeDasharray="3 4"
        style={{ opacity: guideOpacity }}
      />
      <motion.line
        x1="40" y1="125" x2="360" y2="125"
        className="stroke-primary"
        strokeWidth="1"
        strokeDasharray="3 4"
        style={{ opacity: guideOpacity }}
      />

      {/* The shape (an ellipse with a small handle nub) */}
      <motion.g style={{ x: cx }}>
        <g transform="translate(-110 0)">
          <ellipse cx="0" cy="125" rx="44" ry="32"
                   className="fill-primary/15 stroke-primary"
                   strokeWidth="1.6" />
          {/* Selection handles — small squares at the four bounding corners */}
          {[
            [-44, 93], [44, 93], [-44, 157], [44, 157],
          ].map(([dx, dy], i) => (
            <rect key={i} x={dx - 2.5} y={dy - 2.5} width={5} height={5}
                  className="fill-background stroke-primary" strokeWidth="1" />
          ))}
        </g>
      </motion.g>

      {/* Live coordinate badge that follows the shape */}
      <motion.g style={{ x: cx }}>
        <g transform="translate(-100 0)">
          <rect x="-22" y="60" width="56" height="14" rx="1"
                className="fill-background stroke-ink" strokeWidth="0.6" />
          <motion.text x="-18" y="70"
                        className="fill-ink"
                        style={{ font: "10px ui-monospace, monospace", letterSpacing: "0.04em" }}>
            <motion.tspan>{coordX}</motion.tspan>
            <tspan>, </tspan>
            <motion.tspan>{coordY}</motion.tspan>
          </motion.text>
        </g>
      </motion.g>
    </svg>
  );
}

function DemoMoveStatic() {
  const patternId = `featuresDots-rm-${useId().replace(/:/g, "")}`;
  const cx = 270;

  return (
    <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <pattern id={patternId} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" className="text-foreground/10" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill={`url(#${patternId})`} />

      <line
        x1="200"
        y1="20"
        x2="200"
        y2="230"
        className="stroke-primary"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity={1}
      />
      <line
        x1="40"
        y1="125"
        x2="360"
        y2="125"
        className="stroke-primary"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity={1}
      />

      <g transform={`translate(${cx} 0)`}>
        <g transform="translate(-110 0)">
          <ellipse
            cx="0"
            cy="125"
            rx="44"
            ry="32"
            className="fill-primary/15 stroke-primary"
            strokeWidth="1.6"
          />
          {[
            [-44, 93],
            [44, 93],
            [-44, 157],
            [44, 157],
          ].map(([dx, dy], i) => (
            <rect
              key={i}
              x={dx - 2.5}
              y={dy - 2.5}
              width={5}
              height={5}
              className="fill-background stroke-primary"
              strokeWidth="1"
            />
          ))}
        </g>
      </g>

      <g transform={`translate(${cx} 0)`}>
        <g transform="translate(-100 0)">
          <rect x="-22" y="60" width="56" height="14" rx="1" className="fill-background stroke-ink" strokeWidth="0.6" />
          <text
            x="-18"
            y="70"
            className="fill-ink"
            style={{ font: "10px ui-monospace, monospace", letterSpacing: "0.04em" }}
          >
            {`${Math.round(cx * 4)}, 184`}
          </text>
        </g>
      </g>
    </svg>
  );
}

// ─── Phase 01 — Shape library ─────────────────────────────────────────────
// A 6×4 grid of tiny science shapes that tick in one at a time. The
// stagger is driven by motion variants (delay-per-index) rather than by
// scroll — once the demo is on screen, the reveal plays on its own. This
// keeps the hooks count constant (no useTransform inside a .map) and
// reads as a *placement choreography*, not a scroll scrubber.
function DemoLibrary({
  progress: _progress,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  void _progress;
  const cells = 24;
  const cols = 6;
  const cellW = 56;
  const cellH = 44;
  const startX = (400 - cellW * cols) / 2;
  const startY = (250 - cellH * 4) / 2;

  const container = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.045, delayChildren: 0.15 },
    },
  };
  const item = {
    initial: { opacity: 0, scale: 0.86 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.32, ease: [0.22, 0.61, 0.36, 1] as const } },
  };

  return (
    <motion.svg
      viewBox="0 0 400 250"
      className="absolute inset-0 h-full w-full"
      aria-hidden
      variants={container}
      initial="initial"
      animate="animate"
    >
      {Array.from({ length: cells }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * cellW;
        const y = startY + row * cellH;
        return (
          <motion.g key={i} variants={item}>
            <rect x={x} y={y} width={cellW - 4} height={cellH - 4}
                  className="fill-background stroke-border" strokeWidth="0.8" />
            <LibraryGlyph cx={x + (cellW - 4) / 2} cy={y + (cellH - 4) / 2} variant={i % 8} />
          </motion.g>
        );
      })}
    </motion.svg>
  );
}

function DemoLibraryStatic() {
  const cells = 24;
  const cols = 6;
  const cellW = 56;
  const cellH = 44;
  const startX = (400 - cellW * cols) / 2;
  const startY = (250 - cellH * 4) / 2;

  return (
    <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" aria-hidden>
      {Array.from({ length: cells }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * cellW;
        const y = startY + row * cellH;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={cellW - 4}
              height={cellH - 4}
              className="fill-background stroke-border"
              strokeWidth="0.8"
            />
            <LibraryGlyph cx={x + (cellW - 4) / 2} cy={y + (cellH - 4) / 2} variant={i % 8} />
          </g>
        );
      })}
    </svg>
  );
}

function LibraryGlyph({ cx, cy, variant }: { cx: number; cy: number; variant: number }) {
  const stroke = "var(--ink)";
  const fill = "color-mix(in oklab, var(--ink) 8%, transparent)";
  switch (variant) {
    case 0: // cell
      return <ellipse cx={cx} cy={cy} rx="11" ry="8" fill={fill} stroke={stroke} strokeWidth="1" />;
    case 1: // nucleus
      return (
        <g>
          <ellipse cx={cx} cy={cy} rx="12" ry="9" fill={fill} stroke={stroke} strokeWidth="1" />
          <circle cx={cx - 2} cy={cy - 1} r="3" fill={fill} stroke={stroke} strokeWidth="0.8" />
        </g>
      );
    case 2: // hexagon
      return (
        <polygon
          points={`${cx-9},${cy-5} ${cx-9},${cy+5} ${cx},${cy+10} ${cx+9},${cy+5} ${cx+9},${cy-5} ${cx},${cy-10}`}
          fill={fill} stroke={stroke} strokeWidth="1"
        />
      );
    case 3: // receptor (Y-shape)
      return (
        <g stroke={stroke} strokeWidth="1.6" strokeLinecap="round" fill="none">
          <line x1={cx} y1={cy + 8} x2={cx} y2={cy - 2} />
          <line x1={cx} y1={cy - 2} x2={cx - 6} y2={cy - 8} />
          <line x1={cx} y1={cy - 2} x2={cx + 6} y2={cy - 8} />
        </g>
      );
    case 4: // arrow
      return (
        <g stroke={stroke} strokeWidth="1.2" strokeLinecap="round" fill="none">
          <line x1={cx - 9} y1={cy} x2={cx + 9} y2={cy} />
          <polyline points={`${cx + 5},${cy - 3} ${cx + 9},${cy} ${cx + 5},${cy + 3}`} />
        </g>
      );
    case 5: // flask
      return (
        <g stroke={stroke} strokeWidth="1" fill={fill}>
          <path d={`M ${cx - 4} ${cy - 9} L ${cx - 4} ${cy - 2} L ${cx - 9} ${cy + 8} L ${cx + 9} ${cy + 8} L ${cx + 4} ${cy - 2} L ${cx + 4} ${cy - 9} Z`} />
        </g>
      );
    case 6: // dna helix
      return (
        <g stroke={stroke} strokeWidth="1" fill="none">
          <path d={`M ${cx - 7} ${cy - 8} Q ${cx} ${cy} ${cx - 7} ${cy + 8}`} />
          <path d={`M ${cx + 7} ${cy - 8} Q ${cx} ${cy} ${cx + 7} ${cy + 8}`} />
        </g>
      );
    case 7: // microscope (lens + base)
    default:
      return (
        <g stroke={stroke} strokeWidth="1" fill={fill}>
          <circle cx={cx} cy={cy - 2} r="5" />
          <rect x={cx - 4} y={cy + 4} width="8" height="5" />
        </g>
      );
  }
}

// Colourways shared by scroll-driven DemoRecolour and the reduced-motion static frame.
const RECOLOUR_PALETTES = [
  { primary: "oklch(0.34 0.086 146)", accent: "oklch(0.68 0.16 58)", ligand: "oklch(0.42 0.14 18)" },
  { primary: "oklch(0.46 0.13 22)", accent: "oklch(0.50 0.13 95)", ligand: "oklch(0.38 0.08 320)" },
  { primary: "oklch(0.38 0.03 52)", accent: "oklch(0.55 0.15 38)", ligand: "oklch(0.74 0.14 92)" },
  { primary: "oklch(0.35 0.06 146)", accent: "oklch(0.55 0.18 38)", ligand: "oklch(0.62 0.12 138)" },
] as const;

// ─── Phase 02 — Recolour ──────────────────────────────────────────────────
// A single figure (cell + receptor + ligand) sits in the centre. A
// horizontal palette below cycles through 4 colourways as you scroll;
// the figure repaints in sync.
function DemoRecolour({
  progress,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const local = useTransform(progress, [0.5, 0.75], [0, 1], { clamp: true });

  const palettes = RECOLOUR_PALETTES;

  // Step indicator (0..3).
  const step = useTransform(local, (v) => Math.min(3, Math.floor(v * 4)));
  const [stepIndex, setStepIndex] = useState(0);
  useMotionValueEvent(step, "change", (v) => setStepIndex(Math.round(v as number)));

  const p = palettes[stepIndex];

  return (
    <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <pattern id="recolourDots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" className="text-foreground/10" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill="url(#recolourDots)" />

      {/* Figure — cell + receptor + ligand */}
      <motion.ellipse
        cx="200" cy="110" rx="80" ry="58"
        initial={false}
        animate={{ fill: p.primary + "20", stroke: p.primary }}
        transition={{ duration: 0.5 }}
        strokeWidth="1.6"
      />
      <motion.circle
        cx="180" cy="105" r="20"
        initial={false}
        animate={{ fill: p.primary + "35", stroke: p.primary }}
        transition={{ duration: 0.5 }}
        strokeWidth="1.2"
      />
      <g transform="translate(248 90)">
        <motion.line x1="0" y1="0" x2="0" y2="20"
                     initial={false}
                     animate={{ stroke: p.accent }}
                     transition={{ duration: 0.5 }}
                     strokeWidth="4" strokeLinecap="round" />
        <motion.line x1="0" y1="0" x2="-8" y2="-12"
                     initial={false}
                     animate={{ stroke: p.accent }}
                     transition={{ duration: 0.5 }}
                     strokeWidth="4" strokeLinecap="round" />
        <motion.line x1="0" y1="0" x2="8" y2="-12"
                     initial={false}
                     animate={{ stroke: p.accent }}
                     transition={{ duration: 0.5 }}
                     strokeWidth="4" strokeLinecap="round" />
      </g>
      <motion.circle
        cx="248" cy="70" r="8"
        initial={false}
        animate={{ fill: p.ligand + "44", stroke: p.ligand }}
        transition={{ duration: 0.5 }}
        strokeWidth="1.6"
      />

      {/* Palette swatches strip */}
      {palettes.map((pal, i) => (
        <g key={i} transform={`translate(${85 + i * 60} 200)`}>
          <motion.rect
            x="-22" y="-10" width="44" height="20"
            initial={false}
            animate={{
              stroke: i === stepIndex ? "var(--ink)" : "var(--border)",
              strokeWidth: i === stepIndex ? 1.4 : 1,
            }}
            fill="var(--background)"
            rx="1"
          />
          <rect x="-18" y="-6"  width="8" height="12" fill={pal.primary} />
          <rect x="-8"  y="-6"  width="8" height="12" fill={pal.accent} />
          <rect x="2"   y="-6"  width="8" height="12" fill={pal.ligand} />
          <text x="0" y="22"
                textAnchor="middle"
                className="fill-muted-foreground"
                style={{ font: "9px ui-monospace, monospace", letterSpacing: "0.06em" }}>
            {String(i + 1).padStart(2, "0")}
          </text>
        </g>
      ))}
    </svg>
  );
}

function DemoRecolourStatic() {
  const patternId = `recolourDots-rm-${useId().replace(/:/g, "")}`;
  const palettes = RECOLOUR_PALETTES;
  const stepIndex = 0;
  const p = palettes[stepIndex];

  return (
    <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <pattern id={patternId} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" className="text-foreground/10" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill={`url(#${patternId})`} />

      <ellipse
        cx="200"
        cy="110"
        rx="80"
        ry="58"
        fill={`${p.primary}20`}
        stroke={p.primary}
        strokeWidth="1.6"
      />
      <circle cx="180" cy="105" r="20" fill={`${p.primary}35`} stroke={p.primary} strokeWidth="1.2" />
      <g transform="translate(248 90)">
        <line x1="0" y1="0" x2="0" y2="20" stroke={p.accent} strokeWidth="4" strokeLinecap="round" />
        <line x1="0" y1="0" x2="-8" y2="-12" stroke={p.accent} strokeWidth="4" strokeLinecap="round" />
        <line x1="0" y1="0" x2="8" y2="-12" stroke={p.accent} strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="248" cy="70" r="8" fill={`${p.ligand}44`} stroke={p.ligand} strokeWidth="1.6" />

      {palettes.map((pal, i) => (
        <g key={i} transform={`translate(${85 + i * 60} 200)`}>
          <rect
            x="-22"
            y="-10"
            width="44"
            height="20"
            stroke={i === stepIndex ? "var(--ink)" : "var(--border)"}
            strokeWidth={i === stepIndex ? 1.4 : 1}
            fill="var(--background)"
            rx="1"
          />
          <rect x="-18" y="-6" width="8" height="12" fill={pal.primary} />
          <rect x="-8" y="-6" width="8" height="12" fill={pal.accent} />
          <rect x="2" y="-6" width="8" height="12" fill={pal.ligand} />
          <text
            x="0"
            y="22"
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ font: "9px ui-monospace, monospace", letterSpacing: "0.06em" }}
          >
            {String(i + 1).padStart(2, "0")}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Phase 03 — Export ────────────────────────────────────────────────────
// A small thumbnail of a figure sits in the centre; three file-type
// chips (PNG / SVG / PDF) emerge from it one after another.
function DemoExport({
  progress,
  reduced,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduced: boolean;
}) {
  const local = useTransform(progress, [0.68, 0.96], [0, 1], { clamp: true });

  const pngOpacity = useTransform(local, [0.04, 0.10, 0.38], [0, 1, 1], { clamp: true });
  const pngX       = useTransform(local, [0.04, 0.48], [0, -90], { clamp: true });
  const pngY       = useTransform(local, [0.04, 0.48], [0, -30], { clamp: true });

  const svgOpacity = useTransform(local, [0.28, 0.34, 0.52], [0, 1, 1], { clamp: true });
  const svgX       = useTransform(local, [0.28, 0.72], [0, 95], { clamp: true });
  const svgY       = useTransform(local, [0.28, 0.72], [0, -10], { clamp: true });

  const pdfOpacity = useTransform(local, [0.48, 0.54, 0.72], [0, 1, 1], { clamp: true });
  const pdfX       = useTransform(local, [0.48, 0.92], [0, -50], { clamp: true });
  const pdfY       = useTransform(local, [0.48, 0.92], [0, 85], { clamp: true });

  const png = { opacity: pngOpacity, x: pngX, y: pngY };
  const svg = { opacity: svgOpacity, x: svgX, y: svgY };
  const pdf = { opacity: pdfOpacity, x: pdfX, y: pdfY };

  return (
    <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <pattern id="exportDots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" className="text-foreground/10" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill="url(#exportDots)" />

      <g transform="translate(200 125)">
        {reduced ? (
          <g>
            <rect x="-32" y="-44" width="64" height="88" rx="1"
                  className="fill-background stroke-ink" strokeWidth="1.2" />
            <ellipse cx="-8" cy="-10" rx="14" ry="10"
                     className="fill-primary/20 stroke-primary" strokeWidth="1" />
            <line x1="10" y1="-10" x2="22" y2="-10"
                  className="stroke-foreground/55" strokeWidth="1" />
            <circle cx="24" cy="-10" r="5"
                    className="fill-chart-2/30 stroke-chart-2" strokeWidth="1" />
            <line x1="-26" y1="12" x2="26" y2="12" className="stroke-foreground/25" strokeWidth="0.6" />
            <line x1="-26" y1="20" x2="22" y2="20" className="stroke-foreground/25" strokeWidth="0.6" />
            <line x1="-26" y1="28" x2="20" y2="28" className="stroke-foreground/25" strokeWidth="0.6" />
          </g>
        ) : (
          <motion.g
            animate={{ scale: [1, 1.018, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="-32" y="-44" width="64" height="88" rx="1"
                  className="fill-background stroke-ink" strokeWidth="1.2" />
            <ellipse cx="-8" cy="-10" rx="14" ry="10"
                     className="fill-primary/20 stroke-primary" strokeWidth="1" />
            <line x1="10" y1="-10" x2="22" y2="-10"
                  className="stroke-foreground/55" strokeWidth="1" />
            <circle cx="24" cy="-10" r="5"
                    className="fill-chart-2/30 stroke-chart-2" strokeWidth="1" />
            <line x1="-26" y1="12" x2="26" y2="12" className="stroke-foreground/25" strokeWidth="0.6" />
            <line x1="-26" y1="20" x2="22" y2="20" className="stroke-foreground/25" strokeWidth="0.6" />
            <line x1="-26" y1="28" x2="20" y2="28" className="stroke-foreground/25" strokeWidth="0.6" />
          </motion.g>
        )}
      </g>

      {/* Chips */}
      <FileChip motion={png} center={[200, 125]} label="PNG" sub="300dpi"  />
      <FileChip motion={svg} center={[200, 125]} label="SVG" sub="vector"  />
      <FileChip motion={pdf} center={[200, 125]} label="PDF" sub="print"   />
    </svg>
  );
}

function FileChip({
  motion: m,
  center,
  label,
  sub,
}: {
  motion: { opacity: MotionValue<number>; x: MotionValue<number>; y: MotionValue<number> };
  center: [number, number];
  label: string;
  sub: string;
}) {
  return (
    <g transform={`translate(${center[0]} ${center[1]})`}>
      <motion.g style={{ opacity: m.opacity, x: m.x, y: m.y }}>
        <rect x="-22" y="-12" width="44" height="24" rx="2"
              className="fill-background stroke-ink" strokeWidth="1" />
        <text x="0" y="0"
              textAnchor="middle"
              className="fill-ink"
              style={{ font: "700 10px ui-monospace, monospace", letterSpacing: "0.1em" }}>
          {label}
        </text>
        <text x="0" y="9"
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ font: "500 7.5px ui-sans-serif, system-ui, sans-serif" }}>
          {sub}
        </text>
      </motion.g>
    </g>
  );
}

function DemoExportStatic() {
  const patternId = `exportDots-rm-${useId().replace(/:/g, "")}`;

  return (
    <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <pattern id={patternId} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" className="text-foreground/10" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill={`url(#${patternId})`} />

      <g transform="translate(200 125)">
        <rect x="-32" y="-44" width="64" height="88" rx="1" className="fill-background stroke-ink" strokeWidth="1.2" />
        <ellipse cx="-8" cy="-10" rx="14" ry="10" className="fill-primary/20 stroke-primary" strokeWidth="1" />
        <line x1="10" y1="-10" x2="22" y2="-10" className="stroke-foreground/55" strokeWidth="1" />
        <circle cx="24" cy="-10" r="5" className="fill-chart-2/30 stroke-chart-2" strokeWidth="1" />
        <line x1="-26" y1="12" x2="26" y2="12" className="stroke-foreground/25" strokeWidth="0.6" />
        <line x1="-26" y1="20" x2="22" y2="20" className="stroke-foreground/25" strokeWidth="0.6" />
        <line x1="-26" y1="28" x2="20" y2="28" className="stroke-foreground/25" strokeWidth="0.6" />
      </g>

      <g transform="translate(108 82)">
        <rect x="-22" y="-12" width="44" height="24" rx="2" className="fill-background stroke-ink" strokeWidth="1" />
        <text
          x="0"
          y="1"
          textAnchor="middle"
          className="fill-ink"
          style={{ font: "700 10px ui-monospace, monospace", letterSpacing: "0.1em" }}
        >
          PNG
        </text>
        <text
          x="0"
          y="9"
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ font: "500 7.5px ui-sans-serif, system-ui, sans-serif" }}
        >
          300dpi
        </text>
      </g>
      <g transform="translate(298 104)">
        <rect x="-22" y="-12" width="44" height="24" rx="2" className="fill-background stroke-ink" strokeWidth="1" />
        <text
          x="0"
          y="1"
          textAnchor="middle"
          className="fill-ink"
          style={{ font: "700 10px ui-monospace, monospace", letterSpacing: "0.1em" }}
        >
          SVG
        </text>
        <text
          x="0"
          y="9"
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ font: "500 7.5px ui-sans-serif, system-ui, sans-serif" }}
        >
          vector
        </text>
      </g>
      <g transform="translate(154 212)">
        <rect x="-22" y="-12" width="44" height="24" rx="2" className="fill-background stroke-ink" strokeWidth="1" />
        <text
          x="0"
          y="1"
          textAnchor="middle"
          className="fill-ink"
          style={{ font: "700 10px ui-monospace, monospace", letterSpacing: "0.1em" }}
        >
          PDF
        </text>
        <text
          x="0"
          y="9"
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ font: "500 7.5px ui-sans-serif, system-ui, sans-serif" }}
        >
          print
        </text>
      </g>
    </svg>
  );
}
