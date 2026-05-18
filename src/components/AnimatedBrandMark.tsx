"use client";

/**
 * Footer lockup — short “line edit” beat: a few localized scale / rotate fixes on
 * locked geometry (not per-letter drags), then crossfade to the finished wordmark
 * centered on the same axis as the construction art.
 */

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useEffectiveReducedMotion } from "@/components/MotionPreference";

const VB_W = 720;
const VB_H = 188;

const EASE = [0.33, 1, 0.28, 1] as const;
/** Short timeline — only three edit beats */
const T = 5.2;

/** Shift construction so horizontal centroid (~414) lands on lockup center x = 360. */
const OFFSET_X = -54;

/** Three zones: cursor stops here while geometry eases (scale / rotate). */
const ZONES = [
  { id: "canvas", ox: 352, oy: 104, cx: 352, cy: 104, tArrive: 0.07, tDone: 0.22 },
  { id: "slash", ox: 475, oy: 95, cx: 475, cy: 74, tArrive: 0.26, tDone: 0.36 },
  { id: "bio", ox: 528, oy: 106, cx: 528, cy: 106, tArrive: 0.4, tDone: 0.58 },
] as const;

/** Cursor positions are in construction space (parent `<g>` applies `OFFSET_X`). */
function buildCursorKeyframes() {
  const xs: number[] = [620, 542];
  const ys: number[] = [44, 72];
  const times: number[] = [0, 0.038];
  let tPrev = times[times.length - 1]!;
  ZONES.forEach((z) => {
    const mid = (z.tArrive + z.tDone) / 2;
    const ta = Math.max(z.tArrive, tPrev + 0.004);
    const tm = Math.max(mid, ta + 0.004);
    const td = Math.max(z.tDone, tm + 0.004);
    tPrev = td;
    xs.push(z.cx + 8, z.cx, z.cx + 1);
    ys.push(z.cy - 6, z.cy, z.cy);
    times.push(ta, tm, td);
  });
  const cxLock = 360 - OFFSET_X;
  xs.push(cxLock, cxLock);
  ys.push(118, 118);
  times.push(Math.max(0.62, tPrev + 0.03), 1);
  return { xs, ys, times };
}

const CURSOR = buildCursorKeyframes();

function ConstructionNodes() {
  return (
    <g>
      {ZONES.map((z, i) => (
        <g key={z.id}>
          <rect x={z.cx - 3} y={z.cy - 3} width={6} height={6} rx={0.8} className="fill-background stroke-primary" strokeWidth={0.85} />
          <line x1={z.cx} y1={z.cy} x2={z.cx + (i === 1 ? 16 : -14)} y2={z.cy + (i === 0 ? -11 : i === 2 ? 12 : 10)} className="stroke-primary/35" strokeWidth={0.55} strokeDasharray="2 2" />
          <circle cx={z.cx + (i === 1 ? 16 : -14)} cy={z.cy + (i === 0 ? -11 : i === 2 ? 12 : 10)} r={2.2} className="fill-primary/45 stroke-primary/55" strokeWidth={0.45} />
        </g>
      ))}
    </g>
  );
}

/** Canvas letterforms — horizontal “tracking” read via scaleX from local origin (shape edit). */
function CanvasStrokes() {
  return (
    <>
      <path d="M 274 78 Q 242 78 242 118 Q 242 134 274 132" className="stroke-foreground/92" strokeWidth={1.35} />
      <path d="M 284 118 L 284 96 Q 284 88 296 88 Q 308 88 308 96 L 308 118 M 296 96 L 296 118" className="stroke-foreground/92" strokeWidth={1.35} />
      <path d="M 318 118 L 318 92 Q 318 86 328 86 Q 338 86 344 92 L 352 118" className="stroke-foreground/92" strokeWidth={1.35} />
      <path d="M 362 94 L 374 112 L 386 94" className="stroke-foreground/92" strokeWidth={1.35} />
      <path d="M 394 118 L 394 96 Q 394 88 406 88 Q 418 88 418 96 L 418 118 M 406 96 L 406 118" className="stroke-foreground/92" strokeWidth={1.35} />
      <path d="M 432 90 C 446 86 452 94 442 100 C 432 106 432 114 442 120 C 452 126 458 118 450 112" className="stroke-foreground/92" strokeWidth={1.35} />
    </>
  );
}

function SlashStroke({ run }: { run: boolean }) {
  const z = ZONES[1]!;
  return (
    <g transform={`translate(${z.ox} ${z.oy})`}>
      <motion.g
        initial={{ rotate: 11 }}
        animate={run ? { rotate: [11, 11, 0, 0] } : { rotate: 11 }}
        transition={{ duration: T, times: [0, z.tArrive, z.tDone, 1], ease: EASE }}
      >
        <g transform={`translate(${-z.ox} ${-z.oy})`}>
          <line x1={468} y1={72} x2={482} y2={118} className="stroke-primary" strokeWidth={1.45} strokeLinecap="round" />
        </g>
      </motion.g>
    </g>
  );
}

/** bio — slight vertical squash/relax read as contour edit */
function BioStrokes({ run }: { run: boolean }) {
  const z = ZONES[2]!;
  return (
    <g transform={`translate(${z.ox} ${z.oy})`}>
      <motion.g
        initial={{ scaleY: 0.86 }}
        animate={run ? { scaleY: [0.86, 0.86, 1, 1] } : { scaleY: 0.86 }}
        transition={{ duration: T, times: [0, z.tArrive, z.tDone, 1], ease: EASE }}
      >
        <g transform={`translate(${-z.ox} ${-z.oy})`}>
          <path d="M 492 74 L 492 118" className="stroke-primary" strokeWidth={1.45} />
          <path d="M 492 102 Q 492 96 508 96 Q 526 96 532 108 Q 526 118 508 118 Q 492 118 492 106" className="stroke-primary" strokeWidth={1.45} />
          <line x1={544} y1={92} x2={544} y2={118} className="stroke-primary" strokeWidth={1.45} />
          <circle cx={544} cy={84} r={2.5} className="fill-primary" />
          <ellipse cx={572} cy={106} rx={11} ry={10} className="stroke-primary" strokeWidth={1.45} />
        </g>
      </motion.g>
    </g>
  );
}

export function AnimatedBrandMark() {
  const reduced = useEffectiveReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.42 });
  const run = inView && !reduced;

  const z0 = ZONES[0]!;

  if (reduced) {
    return (
      <div className="pb-4 md:pb-6" aria-label="Canvas bio">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="mx-auto h-auto w-full max-w-[720px] text-foreground" role="img">
          <title>Canvas/bio</title>
          <ReducedMotionStill />
        </svg>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative pb-4 md:pb-6" aria-label="Canvas bio brand animation">
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="mx-auto h-auto w-full max-w-[720px] overflow-visible text-foreground" xmlns="http://www.w3.org/2000/svg" role="img">
        <title>Localized line tweaks resolve into Canvas slash bio</title>
        <defs>
          <pattern id="brand-dot-grid" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="0.85" className="fill-primary/28" />
          </pattern>
          <linearGradient id="brand-scan-wash" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.rect
          x="0"
          y="0"
          width={VB_W}
          height={VB_H}
          fill="url(#brand-dot-grid)"
          initial={{ opacity: 0.12 }}
          animate={run ? { opacity: [0.12, 1, 1, 0.36] } : { opacity: 0.12 }}
          transition={run ? { duration: T, times: [0, 0.05, 0.62, 1], ease: EASE } : { duration: 0.35 }}
        />
        <motion.rect
          x="0"
          y="0"
          width={VB_W}
          height={VB_H}
          fill="url(#brand-scan-wash)"
          initial={{ opacity: 0 }}
          animate={run ? { opacity: [0, 1, 1, 0.28] } : { opacity: 0 }}
          transition={{ duration: T, times: [0, 0.06, 0.62, 1], ease: EASE }}
        />

        <motion.line x1={120} y1={126} x2={600} y2={126} className="stroke-primary/42" strokeWidth={0.75} strokeDasharray="4 5" initial={{ pathLength: 0 }} animate={run ? { pathLength: [0, 1, 1, 0.35] } : { pathLength: 0 }} transition={{ duration: T, times: [0, 0.12, 0.52, 1], ease: EASE }} />

        <motion.g initial={{ opacity: 0 }} animate={run ? { opacity: [0, 1, 1, 0] } : { opacity: 0 }} transition={{ duration: T, times: [0, 0.04, 0.56, 0.68], ease: EASE }}>
          <g transform={`translate(${OFFSET_X} 0)`}>
            <ConstructionNodes />
            <g strokeLinecap="round" strokeLinejoin="round" fill="none">
              <g transform={`translate(${z0.ox} ${z0.oy})`}>
                <motion.g
                  initial={{ scaleX: 0.91 }}
                  animate={run ? { scaleX: [0.91, 0.91, 1, 1] } : { scaleX: 0.91 }}
                  transition={{ duration: T, times: [0, z0.tArrive, z0.tDone, 1], ease: EASE }}
                >
                  <g transform={`translate(${-z0.ox} ${-z0.oy})`}>
                    <CanvasStrokes />
                  </g>
                </motion.g>
              </g>
              <SlashStroke run={run} />
              <BioStrokes run={run} />
            </g>
          </g>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={run ? { opacity: [0, 1, 1, 0] } : { opacity: 0 }} transition={{ duration: T, times: [0, 0.03, 0.56, 0.66], ease: EASE }}>
          <g transform={`translate(${OFFSET_X} 0)`}>
            <motion.g initial={{ x: CURSOR.xs[0], y: CURSOR.ys[0] }} animate={run ? { x: CURSOR.xs, y: CURSOR.ys } : { x: CURSOR.xs[0], y: CURSOR.ys[0] }} transition={{ duration: T, times: CURSOR.times, ease: EASE }}>
              <line x1={-10} y1={0} x2={10} y2={0} className="stroke-primary/92" strokeWidth={0.85} />
              <line x1={0} y1={-10} x2={0} y2={10} className="stroke-primary/92" strokeWidth={0.85} />
              <circle cx={0} cy={0} r={2} className="fill-primary" />
            </motion.g>
          </g>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={run ? { opacity: [0, 0, 1, 1] } : { opacity: 0 }} transition={{ duration: T, times: [0, 0.62, 0.72, 1], ease: EASE }}>
          <text x={360} y={118} textAnchor="middle" style={{ fontFamily: "var(--font-display), ui-sans-serif, system-ui", fontSize: 56, fontWeight: 600, letterSpacing: "-0.038em" }}>
            <tspan className="fill-foreground">Canvas</tspan>
            <tspan className="fill-primary" style={{ fontWeight: 700, letterSpacing: "-0.032em" }}>
              /bio
            </tspan>
          </text>
        </motion.g>

        <motion.line x1={230} y1={138} x2={490} y2={138} className="stroke-primary/48" strokeWidth={1.12} initial={{ pathLength: 0 }} animate={run ? { pathLength: [0, 0, 1, 1] } : { pathLength: 0 }} transition={{ duration: T, times: [0, 0.66, 0.88, 1], ease: EASE }} />
      </svg>

      <p className="sr-only">Three localized edits on the line sketch resolve into the Canvas slash bio wordmark.</p>
    </div>
  );
}

function ReducedMotionStill() {
  return (
    <g>
      <defs>
        <pattern id="brand-dot-static" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r={0.85} className="fill-primary/24" />
        </pattern>
      </defs>
      <rect width={VB_W} height={VB_H} fill="url(#brand-dot-static)" opacity={0.45} />
      <text x={360} y={118} textAnchor="middle" className="fill-foreground" style={{ fontFamily: "var(--font-display), sans-serif", fontSize: 48, fontWeight: 600, letterSpacing: "-0.035em" }}>
        Canvas<tspan className="fill-primary">/bio</tspan>
      </text>
      <line x1={210} y1={134} x2={510} y2={134} className="stroke-primary/45" strokeWidth={1} />
    </g>
  );
}
