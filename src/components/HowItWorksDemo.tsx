"use client";

// Mirrors `/editor`: library ? search ? drag-drop; canvas labels match `EditorCanvas.addSvg` (italic caption under asset).
// Camera: no zoom during library (scale 1 in data); canvas uses modest zoom. Focal stays at stage center unless on canvas.

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate, useMotionValue, useTransform } from "motion/react";
import { useEffectiveReducedMotion } from "@/components/MotionPreference";
import { VectorMascot } from "@/components/VectorMascot";
import { HowItWorksDemoToolbar } from "@/components/HowItWorksDemoToolbar";

const VB_W = 1000;
const VB_H = 596;
/** Matches editor `h-14` toolbar */
const BAR = 56;
/** Matches `AssetLibrary` `w-60` */
const LIB_W = 240;
/** Right assistant column — keep narrow so zoomed canvas (membrane) stays above the panel. */
const ASSIST_W = 292;
const SPLIT_L = LIB_W;
const SPLIT_R = VB_W - ASSIST_W;
const CONTENT_H = VB_H - BAR;
const CONTENT_CY = BAR + CONTENT_H / 2;

/**
 * Library/search beats use zoom **1** (full stage — sidebar always readable). Canvas drags use small
 * steps (~1.22–1.34) so zoom/pan doesn’t jump sharply between phases.
 *
 * Save/Export live in **HTML** above the SVG, so after the ligand drop we **ease canvas zoom back
 * down** and drive closeness via `CHROME_ZOOM` (whole chrome scales from the top-right).
 */
const STAGE_SCALE: number[] = [
  1.06,
  1, 1, 1, 1, 1, 1, 1, 1, 1,
  1.22, 1.32, 1.26,
  1, 1, 1, 1, 1, 1, 1, 1,
  1.24, 1.34, 1.28,
  1, 1, 1, 1, 1,
  /** Ligand drag/drop, then toolbar — keep SVG modest; `CHROME_ZOOM` magnifies Save/Export */
  1.24, 1.32, 1.06, 1.04, 1.04,
];

/** Top-right so scale grows toward the library/canvas, not off the right edge (Export crops less). */
const CHROME_ZOOM_ORIGIN_X_PCT = 100;

/** Scales toolbar + SVG together so the real Save/Export buttons grow (they are outside the SVG) */
const CHROME_ZOOM: number[] = [
  ...Array.from({ length: 30 }, () => 1),
  1.38,
  1.5,
  1.58,
  1.62,
];

/** Phases where `CURSOR` clicks the library search field (`CURSOR[i].click` on `SEARCH_*`). */
const SEARCH_FIELD_CLICK_PHASES: number[] = [4, 13, 24];
const RECEPTOR_CAPTION_DY = 44;
/** Italic caption above ligand dot — clears “Receptor” text below without sitting on the symbols. */
const LIGAND_CAPTION_ABOVE_DY = 22;
/** Matches `EditorCanvas.addSvg`: caption under icon center (`top: cy + 70`) for cell-scale assets. */
const EDITOR_LABEL_BELOW_CENTER = 70;
/** Same as Fabric IText in addSvg (`fill: #475569`) */
const EDITOR_LABEL_FONT = "italic 13px var(--font-display), ui-serif, Georgia, serif";

/** Captions under membrane icons — tighter than the cell “Nucleus” offset so text sits near each symbol. */
const PHASE_MS: number[] = [
  760, 390, 400, 520, 400,
  /** nucleus — focus beat slightly longer before first letter */
  245, 165, 215, 265,
  430, /** pick */
  920, /** drag */
  520, /** drop */
  780, /** dwell */
  420, /** reopen search receptor */
  /** receptor — staggered keystrokes */
  185, 210, 175, 220, 190, 205,
  450, /** pick receptor */
  900, /** drag */
  530, /** anchor */
  720, /** dwell */
  400, /** lig search */
  215, 175, 195, /** lig type */
  430, /** pick */
  900, /** drag */
  520, /** drop */
  940, /** glide pointer to Save + punch zoom */
  740, /** save (spinner) */
  1_020, /** Export click + exported toast */
];

const TOTAL_PHASES = PHASE_MS.length;

const TERM_NUCLEUS = "nucleus";
const TERM_RECEPTOR = "receptor";
const TERM_LIGAND = "ligand";

/** Typewriter text in the search field (full words, not internal snippet keys). */
function demoSearchQuery(phase: number): string {
  if (phase >= 5 && phase <= 11) {
    const n = phase <= 8 ? Math.max(0, phase - 4) : TERM_NUCLEUS.length;
    return TERM_NUCLEUS.slice(0, n);
  }
  if (phase >= 14 && phase <= 22) {
    const n = phase <= 19 ? Math.max(0, phase - 13) : TERM_RECEPTOR.length;
    return TERM_RECEPTOR.slice(0, n);
  }
  if (phase >= 25 && phase <= 29) {
    const n = phase <= 27 ? Math.max(0, phase - 24) : TERM_LIGAND.length;
    return TERM_LIGAND.slice(0, n);
  }
  return "";
}

const RECEPTOR_FAMILY_IDS = new Set(["receptor", "gpcr", "channel"]);

function tilePassesSearch(tile: DemoTile, qTrim: string, phaseBracket: "nucle" | "recep" | "lig" | null): boolean {
  if (!qTrim) return true;
  const ql = qTrim.toLowerCase();
  const nm = tile.name.toLowerCase();

  if (phaseBracket === "nucle") {
    // Only nucleus is shown once you start hunting ? ?nucl?? still maps to nucleus via substring overlap
    if (tile.id !== "nucleus") return false;
    if (!ql.length) return true;
    const word = "nucleus";
    return word.startsWith(ql) || word.includes(ql);
  }

  if (phaseBracket === "recep") {
    if (!RECEPTOR_FAMILY_IDS.has(tile.id)) return false;
    if (ql.length <= 1) return true;
    if (ql.length <= 2) return nm.includes(ql);
    return nm.includes(ql) || tile.id === "receptor";
  }

  if (phaseBracket === "lig") return tile.id === "ligand" && (!ql.length || "ligand".includes(ql));
  return nm.includes(ql);
}

/** Sorted order inside receptor family once filter is active */
function sortReceptorFamily(a: DemoTile, b: DemoTile): number {
  const rank = (t: DemoTile) => {
    if (t.id === "receptor") return 0;
    if (t.id === "gpcr") return 1;
    if (t.id === "channel") return 2;
    return 9;
  };
  return rank(a) - rank(b);
}

function searchBracket(phase: number): "nucle" | "recep" | "lig" | null {
  if (phase >= 5 && phase <= 11) return "nucle";
  if (phase >= 14 && phase <= 22) return "recep";
  if (phase >= 25 && phase <= 29) return "lig";
  return null;
}

type DemoGlyph = "circ" | "nuc" | "yshape" | "gpcr" | "ligdot" | "mito";

type DemoTile = {
  id: string;
  name: string;
  glyph: DemoGlyph;
  category: string;
};

/** Library layout: search sits under the ?Library? title; categories start below the search field (no overlap). */
const SEARCH_Y = BAR + 30;
const SEARCH_H = 30;
const CATEGORY_TOP = SEARCH_Y + SEARCH_H + 12;
/** Category list + library grid geometry */
const CAT_Y0 = CATEGORY_TOP;
const CAT_GAP = 26;
/** First category row top + 5 rows (26px stride, 26px-tall chips) + spacer before the icon grid */
const GRID_TOP = CAT_Y0 + 5 * CAT_GAP + 14;
const CELL_W = 64;
const CELL_H = 72;
const CELL_PAD = 12;
const CELL_STRIDE_X = CELL_W + 10;
const CELL_STRIDE_Y = CELL_H + 18;
const CELL_HALF = CELL_W / 2;
const CELL_HALF_Y = CELL_H / 2 - 12;

/** Vertical center of search field (below Library title). */
const SEARCH_CY = SEARCH_Y + SEARCH_H / 2;

/** Horizontal center of the search field (click target). */
const SEARCH_CX = Math.round(12 + (LIB_W - 22) / 2);

/** Canvas illustration — anchor kept left of `SPLIT_R`. */
const DEMO_CELL_GROUP = { x: 498, y: 304 };

/** Membrane patch on upper-right (extracellular along +angle from center). */
const CELL_RX = 132;
const CELL_RY = 100;
const MEMB_T = -0.48;
const MEMB_COS = Math.cos(MEMB_T);
const MEMB_SIN = Math.sin(MEMB_T);
const MEMB_EDGE_X = CELL_RX * MEMB_COS;
const MEMB_EDGE_Y = CELL_RY * MEMB_SIN;
const RECEPTOR_RADIAL = 15;
/** Y-shaped receptor sits just outside the bilayer, stem pointed into the cell. */
const RECEPTOR_LX = MEMB_EDGE_X + MEMB_COS * RECEPTOR_RADIAL;
const RECEPTOR_LY = MEMB_EDGE_Y + MEMB_SIN * RECEPTOR_RADIAL;
const LIGAND_RADIAL = 18;
/** Ligand sits farther along the same axis, docking on the extracellular pocket. */
const LIGAND_LX = RECEPTOR_LX + MEMB_COS * LIGAND_RADIAL;
const LIGAND_LY = RECEPTOR_LY + MEMB_SIN * LIGAND_RADIAL;

const RECEPTOR_WORLD = {
  x: DEMO_CELL_GROUP.x + RECEPTOR_LX,
  y: DEMO_CELL_GROUP.y + RECEPTOR_LY,
};
const LIGAND_WORLD = {
  x: DEMO_CELL_GROUP.x + LIGAND_LX,
  y: DEMO_CELL_GROUP.y + LIGAND_LY,
};

/** Rotate default receptor art so its stem aims toward the cell center. */
const RECEPTOR_ROT_DEG = (Math.atan2(-RECEPTOR_LY, -RECEPTOR_LX) * 180) / Math.PI - 90;

/** Scripted pointer path (declared after CAT_Y0 / GRID_TOP so layouts stay coherent). */
const CURSOR: { x: number; y: number; click?: boolean }[] = (() => {
  const pickY = GRID_TOP + CELL_PAD + CELL_HALF_Y;
  const midList = Math.round((CAT_Y0 + 5 * CAT_GAP + GRID_TOP) / 2);
  return [
    { x: DEMO_CELL_GROUP.x + 10, y: DEMO_CELL_GROUP.y },
    { x: 128, y: 118 },
    { x: 124, y: CAT_Y0 + 13, click: true },
    { x: 124, y: midList },
    { x: SEARCH_CX, y: SEARCH_CY, click: true },
    { x: 116, y: SEARCH_CY },
    { x: 117, y: SEARCH_CY },
    { x: 119, y: SEARCH_CY },
    { x: 120, y: SEARCH_CY },
    { x: 48, y: pickY, click: true },
    { x: DEMO_CELL_GROUP.x + 2, y: DEMO_CELL_GROUP.y },
    { x: DEMO_CELL_GROUP.x + 2, y: DEMO_CELL_GROUP.y, click: true },
    { x: DEMO_CELL_GROUP.x + 12, y: DEMO_CELL_GROUP.y - 12 },
    { x: SEARCH_CX, y: SEARCH_CY, click: true },
    { x: 115, y: SEARCH_CY },
    { x: 116, y: SEARCH_CY },
    { x: 118, y: SEARCH_CY },
    { x: 119, y: SEARCH_CY },
    { x: 121, y: SEARCH_CY },
    { x: 120, y: SEARCH_CY },
    { x: 48, y: pickY, click: true },
    { x: RECEPTOR_WORLD.x, y: RECEPTOR_WORLD.y },
    { x: RECEPTOR_WORLD.x, y: RECEPTOR_WORLD.y, click: true },
    { x: DEMO_CELL_GROUP.x + 18, y: DEMO_CELL_GROUP.y - 14 },
    { x: SEARCH_CX, y: SEARCH_CY, click: true },
    { x: 116, y: SEARCH_CY },
    { x: 118, y: SEARCH_CY },
    { x: 121, y: SEARCH_CY },
    { x: 48, y: pickY, click: true },
    { x: LIGAND_WORLD.x, y: LIGAND_WORLD.y },
    { x: LIGAND_WORLD.x, y: LIGAND_WORLD.y, click: true },
    { x: 805, y: 30 },
    { x: 805, y: 30, click: true },
    { x: 895, y: 30, click: true },
    { x: 895, y: 30 },
  ];
})();

/** Keep the synthetic pointer inside the demo frame (full artboard includes toolbar). */
function clampCursorPoint(p: { x: number; y: number }) {
  return {
    x: Math.min(972, Math.max(26, p.x)),
    y: Math.min(576, Math.max(22, p.y)),
  };
}

/** When zoom is 1, focal is irrelevant — keep at stage center; on canvas, bias toward action (cursor). */
function clampStageFocal(p: { x: number; y: number }, phaseIndex: number) {
  const libraryPhase =
    (phaseIndex >= 1 && phaseIndex <= 9) ||
    (phaseIndex >= 13 && phaseIndex <= 20) ||
    (phaseIndex >= 24 && phaseIndex <= 28);
  if (libraryPhase) {
    return { x: VB_W / 2, y: CONTENT_CY };
  }
  let x = p.x;
  let y = p.y;
  const canvasAction = [10, 11, 12, 21, 22, 23, 29].includes(phaseIndex);
  const toolbar = phaseIndex >= 30;
  if (canvasAction) {
    x += 36;
    y += 4;
  }
  if (toolbar) {
    x += 32;
    /** Toolbar targets sit above the SVG; using cursor Y (~30) skews pan toward the library/canvas */
    y = CONTENT_CY;
  }
  return {
    x: Math.min(968, Math.max(52, x)),
    y: Math.min(542, Math.max(52, y)),
  };
}

const STAGE_FOCAL: { x: number; y: number }[] = CURSOR.map((c, i) => clampStageFocal(c, i));

/** Pointer glide duration moving `CURSOR[from]` ? `CURSOR[to]`. */
function cursorTravelBetween(from: number, to: number): number {
  const a = CURSOR[from];
  const b = CURSOR[to];
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  if (d < 5) return 0.32;
  if (d < 70) return 0.42;
  if (d < 170) return 0.52;
  if (d < 320) return 0.6;
  if (d < 520) return 0.76;
  return 0.88;
}
const categories = [
  { slug: "cell", label: "Cell Biology" },
  { slug: "mol", label: "Molecules" },
  { slug: "micro", label: "Microbiology" },
  { slug: "organ", label: "Organs" },
  { slug: "charts", label: "Processes" },
] as const;

const CELL_BIO_TILES: DemoTile[] = [
  { id: "mitochondria", name: "Mitochondria", glyph: "mito", category: "Cell Biology" },
  { id: "nucleus", name: "Nucleus", glyph: "nuc", category: "Cell Biology" },
  { id: "er", name: "ER mesh", glyph: "circ", category: "Cell Biology" },
  { id: "vesicle", name: "Vesicle", glyph: "circ", category: "Cell Biology" },
  { id: "receptor", name: "Receptor", glyph: "yshape", category: "Cell Biology" },
  { id: "gpcr", name: "GPCR receptor", glyph: "gpcr", category: "Cell Biology" },
  { id: "channel", name: "Ion channel", glyph: "circ", category: "Cell Biology" },
  { id: "ligand", name: "Ligand", glyph: "ligdot", category: "Cell Biology" },
  { id: "nano", name: "Vesicle tag", glyph: "circ", category: "Cell Biology" },
];

const GHOST_X = 6;
const GHOST_Y = 13;

export function HowItWorksDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.28 });
  const [phase, setPhase] = useState(0);
  const [toolbarScale, setToolbarScale] = useState(1);
  const [searchFieldPulse, setSearchFieldPulse] = useState(0);
  const [savePressPulse, setSavePressPulse] = useState(0);
  const [exportPressPulse, setExportPressPulse] = useState(0);
  const reduced = useEffectiveReducedMotion();

  const prevDemoInteractPhaseRef = useRef<number | null>(null);
  useEffect(() => {
    if (reduced) {
      prevDemoInteractPhaseRef.current = phase;
      return;
    }
    const prev = prevDemoInteractPhaseRef.current;
    let raf = 0;
    if (prev !== phase) {
      raf = requestAnimationFrame(() => {
        if (SEARCH_FIELD_CLICK_PHASES.includes(phase)) setSearchFieldPulse((n) => n + 1);
        if (phase === 31) setSavePressPulse((n) => n + 1);
        if (phase === 32) setExportPressPulse((n) => n + 1);
      });
    }
    prevDemoInteractPhaseRef.current = phase;
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [phase, reduced]);

  const cx = useMotionValue(clampCursorPoint(CURSOR[0]).x);
  const cy = useMotionValue(clampCursorPoint(CURSOR[0]).y);
  const zoom = useMotionValue(1);
  const chromeZoom = useMotionValue(1);
  const focalX = useMotionValue(STAGE_FOCAL[0].x);
  const focalY = useMotionValue(STAGE_FOCAL[0].y);
  const panCompX = useTransform([zoom, focalX], ([z, fx]) => (1 - Number(z)) * (Number(fx) - VB_W / 2));
  const panCompY = useTransform([zoom, focalY], ([z, fy]) => (1 - Number(z)) * (Number(fy) - CONTENT_CY));
  const cursorLeftPct = useTransform(cx, (x) => `${(x / VB_W) * 100}%`);
  const cursorTopPct = useTransform(cy, (y) => `${(y / VB_H) * 100}%`);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setToolbarScale(Math.min(1, el.clientWidth / VB_W));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** Tracks last scripted phase so beat 0 doesn?t animate ?from Export? on first paint, and wraps 35?0 correctly. */
  const prevPhaseForCursorRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) setPhase(TOTAL_PHASES - 1);
    else setPhase(0);
  }, [reduced]);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setTimeout(() => {
      setPhase((p) => (p + 1) % TOTAL_PHASES);
    }, PHASE_MS[phase]);
    return () => window.clearTimeout(id);
  }, [phase, inView, reduced]);

  useEffect(() => {
    if (reduced) {
      const t = clampCursorPoint(CURSOR[TOTAL_PHASES - 1]);
      cx.set(t.x);
      cy.set(t.y);
      prevPhaseForCursorRef.current = TOTAL_PHASES - 1;
      return;
    }
    const dest = clampCursorPoint(CURSOR[phase]);
    const fromPh = prevPhaseForCursorRef.current;
    prevPhaseForCursorRef.current = phase;

    if (fromPh === null) {
      cx.set(dest.x);
      cy.set(dest.y);
      return;
    }

    const travel = cursorTravelBetween(fromPh, phase);
    const ease = [0.22, 0.85, 0.32, 1] as const;
    const opts = { duration: travel, ease };
    const ax = animate(cx, dest.x, opts);
    const ay = animate(cy, dest.y, opts);
    return () => {
      ax.stop();
      ay.stop();
    };
  }, [phase, reduced, cx, cy]);

  useEffect(() => {
    if (reduced) {
      focalX.set(VB_W / 2);
      focalY.set(CONTENT_CY);
      zoom.set(1);
      chromeZoom.set(1);
      return;
    }
    const f = STAGE_FOCAL[phase] ?? STAGE_FOCAL[0];
    const targetZ = STAGE_SCALE[phase] ?? 1;
    const ease = [0.22, 0.85, 0.32, 1] as const;
    const beatSec = PHASE_MS[phase] / 1000;
    /** Finale (ligand drop ? toolbar): finish zoom/pan in step with each beat */
    const dur = phase >= 29 ? Math.min(0.92, beatSec * 0.78) : 0.92;
    const targetChrome = CHROME_ZOOM[phase] ?? 1;
    const cFx = animate(focalX, f.x, { duration: dur, ease });
    const cFy = animate(focalY, f.y, { duration: dur, ease });
    const cZoom = animate(zoom, targetZ, { duration: dur, ease });
    const cChrome = animate(chromeZoom, targetChrome, { duration: dur, ease });
    return () => {
      cFx.stop();
      cFy.stop();
      cZoom.stop();
      cChrome.stop();
    };
  }, [phase, reduced, zoom, focalX, focalY, chromeZoom]);

  const cursor = CURSOR[phase];
  const cellCategoryPicked = phase >= 3;
  const q = demoSearchQuery(phase).trim();

  /** Icons only after picking Cell Biology ? before that editor shows chips, not icons */
  let visibleTiles: DemoTile[] = [];
  if (cellCategoryPicked) {
    const pool = CELL_BIO_TILES.filter((t) => t.category === "Cell Biology");
    const bracket = searchBracket(phase);
    const qEff = bracket ? q.trim() : "";
    if (!qEff) visibleTiles = pool;
    else {
      visibleTiles = pool.filter((t) => tilePassesSearch(t, qEff, bracket));
      if (bracket === "recep") visibleTiles.sort(sortReceptorFamily);
    }
  }

  const cellShown = phase >= 12;
  const receptorShown = phase >= 22;
  const ligandShown = phase >= 30;

  const ghostKind =
    phase === 10 ? "cell" : phase === 21 ? "receptor" : phase === 29 || phase === 30 ? "ligand" : null;

  const cellLabelOn = phase >= 12;
  const receptorLabelOn = phase >= 22;
  const ligandLabelOn = phase >= 30;
  const exporting = phase === 33;
  const exportToolbarHighlight = phase === 32 || phase === 33;

  const vectorSpeaking = !reduced && [11, 22, 29].includes(phase);

  const pickOutline = {
    nucleus: phase === 9,
    receptor: phase === 20,
    ligand: phase === 28,
  };

  const toolbarSlotH = BAR * toolbarScale;

  return (
    <div ref={ref} className="mx-auto w-full max-w-5xl">
      <div
        ref={stageRef}
        className="pointer-events-none relative flex aspect-[1000/596] w-full flex-col overflow-hidden rounded-md border border-border bg-surface px-1.5 select-none sm:px-2"
      >
        <motion.div
          className="relative flex min-h-0 w-full flex-1 flex-col"
          style={{
            scale: chromeZoom,
            transformOrigin: `${CHROME_ZOOM_ORIGIN_X_PCT}% 0%`,
          }}
        >
        <div className="shrink-0 overflow-x-visible overflow-y-clip" style={{ height: toolbarSlotH }}>
          <div
            className="origin-top-left"
            style={{ width: VB_W, height: BAR, transform: `scale(${toolbarScale})` }}
          >
            <HowItWorksDemoToolbar
              isSaved={phase >= 32}
              isSaving={phase === 31}
              exportHighlight={exportToolbarHighlight}
              savePressPulse={savePressPulse}
              exportPressPulse={exportPressPulse}
            />
          </div>
        </div>
        <div className="relative min-h-0 flex-1">
        <svg
          viewBox={`0 ${BAR} ${VB_W} ${CONTENT_H}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          overflow="hidden"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <pattern id="howGrid" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" className="text-foreground/9" />
            </pattern>
            <clipPath id="howDemoStageClip">
              <rect x="0" y={BAR} width={VB_W} height={CONTENT_H} />
            </clipPath>
          </defs>

          <g clipPath="url(#howDemoStageClip)">
            <g transform={`translate(${VB_W / 2} ${CONTENT_CY})`}>
              <motion.g style={{ x: panCompX, y: panCompY }}>
                <motion.g style={{ scale: zoom }}>
                  <g transform={`translate(${-VB_W / 2} ${-CONTENT_CY})`}>
                <rect x="0" y={BAR} width={VB_W} height={CONTENT_H} className="fill-muted/20" />
                <line x1="0" y1={BAR} x2={VB_W} y2={BAR} className="stroke-border/90" />

                {/* Library */}
                <rect x="0" y={BAR} width={LIB_W} height={VB_H - BAR} className="fill-surface stroke-border/60" strokeWidth={0} />
                <line x1={LIB_W} y1={BAR} x2={LIB_W} y2={VB_H} className="stroke-border/90" />

                <text x="14" y={BAR + 22} className="fill-muted-foreground font-mono text-[9px] uppercase tracking-[0.12em]">
                  Library
                </text>

                <rect x="12" y={SEARCH_Y} width={LIB_W - 22} height={SEARCH_H} rx="6" className="fill-muted/45 stroke-border/80" strokeWidth={1} />
                {SEARCH_FIELD_CLICK_PHASES.includes(phase) && !reduced && (
                  <>
                    <motion.rect
                      key={`library-search-fill-${searchFieldPulse}`}
                      x="12"
                      y={SEARCH_Y}
                      width={LIB_W - 22}
                      height={SEARCH_H}
                      rx="6"
                      className="fill-primary/25"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.65, 0] }}
                      transition={{ duration: 0.48, ease: [0.22, 0.85, 0.32, 1] }}
                    />
                    <motion.rect
                      key={`library-search-ring-${searchFieldPulse}`}
                      x="12"
                      y={SEARCH_Y}
                      width={LIB_W - 22}
                      height={SEARCH_H}
                      rx="6"
                      fill="none"
                      className="stroke-primary"
                      strokeWidth={2.25}
                      vectorEffect="nonScalingStroke"
                      initial={{ opacity: 0.88, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.045 }}
                      transition={{ duration: 0.5, ease: [0.22, 0.85, 0.32, 1] }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    />
                  </>
                )}
                <circle cx="24" cy={SEARCH_CY} r="5" className="fill-none stroke-muted-foreground" strokeWidth={1.8} />

                <text x="34" y={SEARCH_Y + 20} className="fill-foreground font-sans text-[12px]">
                  {q ? q : <tspan className="fill-muted-foreground">Search shapes?</tspan>}
                </text>

                {[5, 6, 7, 8, 14, 15, 16, 17, 18, 19, 25, 26, 27].includes(phase) && !reduced && (
                  <motion.rect
                    x={34 + Math.min(102, 6.85 * q.length)}
                    y={SEARCH_Y + 6}
                    width="1.8"
                    height="15"
                    className="fill-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                  />
                )}

                {[0, 1, 2, 3, 4].map((i) => {
                  const cellBio = categories[i]?.slug === "cell";
                  const active = cellCategoryPicked && cellBio && i === 0;
                  const hoveredPick = phase === 2 && i === 0;
                  return (
                    <g key={categories[i]?.slug ?? i}>
                      <rect
                        x="10"
                        y={CAT_Y0 + i * CAT_GAP}
                        width={LIB_W - 18}
                        height="26"
                        rx="5"
                        className={
                          active || hoveredPick
                            ? "fill-primary/22 stroke-primary"
                            : "fill-muted/25 stroke-border/70"
                        }
                        strokeWidth={active || hoveredPick ? 1.25 : 0.55}
                      />
                      <circle
                        cx={24}
                        cy={CAT_Y0 + i * CAT_GAP + 13}
                        r="7"
                        fill={active || hoveredPick ? "var(--primary)" : "transparent"}
                        stroke="currentColor"
                        className={
                          active || hoveredPick
                            ? "stroke-primary stroke-[2px]"
                            : "text-muted-foreground stroke-[2px]"
                        }
                      />
                      <text x="36" y={CAT_Y0 + i * CAT_GAP + 17} className="fill-foreground text-[11px] font-semibold tracking-tight">
                        {categories[i]?.label ?? ""}
                      </text>
                    </g>
                  );
                })}

                {(() => {
                  const bracketNow = searchBracket(phase);
                  const showBadge = Boolean(cellCategoryPicked && bracketNow && q.length >= 2);
                  if (!showBadge) return null;
                  return (
                    <g transform={`translate(10 ${GRID_TOP - 16})`}>
                      <rect width={LIB_W - 18} height="18" rx="4" className="fill-secondary/90 stroke-primary/35" strokeWidth={0.5} />
                      <text x={10} y="13" className="fill-muted-foreground font-sans text-[9px]">
                        {visibleTiles.length === 0
                          ? "No shapes found"
                          : `${visibleTiles.length} shape${visibleTiles.length !== 1 ? "s" : ""}`}
                      </text>
                    </g>
                  );
                })()}

                {/* Grid */}
                {!cellCategoryPicked ? (
                  <g transform={`translate(0 ${GRID_TOP})`}>
                    <rect
                      x={15}
                      y={40}
                      width={LIB_W - 34}
                      height={190}
                      rx="12"
                      className="fill-muted/15 stroke-border/60 stroke-dashed stroke-[1.2]"
                    />
                    <text x={LIB_W / 2} y="130" textAnchor="middle" className="fill-muted-foreground text-[11px]" style={{ font: "500 ui-sans-serif, system-ui" }}>
                      Choose Cell Biology above
                      <tspan x={LIB_W / 2} dy="16" className="fill-muted-foreground text-[11px]" textAnchor="middle">
                        icons appear here
                      </tspan>
                    </text>
                  </g>
                ) : visibleTiles.length === 0 ? (
                  <g transform={`translate(0 ${GRID_TOP + 72})`}>
                    <circle cx={LIB_W / 2} cy="0" r="22" fill="transparent" stroke="currentColor" className="text-muted-foreground/45" strokeWidth={1} />
                    <path
                      d={`M ${LIB_W / 2 - 8} 6 L ${LIB_W / 2 + 11} ${6 + 13}`}
                      className="stroke-muted-foreground/45"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    />
                    <text x={LIB_W / 2} y="54" textAnchor="middle" className="fill-muted-foreground text-[11px]" style={{ font: "500 ui-sans-serif, system-ui" }}>
                      No shapes found
                    </text>
                  </g>
                ) : (
                  <g transform={`translate(0 ${GRID_TOP})`}>
                    {visibleTiles.map((t, idx) => {
                      const gridCol = idx % 3;
                      const gridRow = Math.floor(idx / 3);
                      const px = CELL_PAD + gridCol * CELL_STRIDE_X + CELL_HALF;
                      const py = CELL_PAD + gridRow * CELL_STRIDE_Y + CELL_HALF_Y;
                      const outlined =
                        (pickOutline.nucleus && t.id === "nucleus") ||
                        (pickOutline.receptor && t.id === "receptor") ||
                        (pickOutline.ligand && t.id === "ligand");
                      return (
                        <g key={t.id}>
                          <motion.rect
                            x={px - CELL_HALF}
                            y={py - CELL_HALF_Y}
                            width={CELL_W}
                            height={CELL_H}
                            rx="7"
                            initial={false}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 280, damping: 24 }}
                            className={`stroke-border fill-muted/[0.14] stroke-[0.95px] ${outlined ? "stroke-primary stroke-[1.35px]" : ""}`}
                          />
                          {t.glyph === "circ" && <circle cx={px} cy={py - 2} r="12" className="fill-primary/15 stroke-primary" strokeWidth={1.35} />}
                          {t.glyph === "nuc" && <ellipse cx={px} cy={py - 2} rx="14" ry="10" className="fill-primary/18 stroke-primary" strokeWidth={1.35} />}
                          {(t.glyph === "yshape" || t.glyph === "gpcr") && (
                            <>
                              <line x1={px} y1={py + 6} x2={px} y2={py - 6} className="stroke-chart-2" strokeWidth={2.8} strokeLinecap="round" />
                              <line x1={px} y1={py - 6} x2={px - 8} y2={py - 16} className="stroke-chart-2" strokeWidth={2.8} strokeLinecap="round" />
                              <line x1={px} y1={py - 6} x2={px + 8} y2={py - 16} className="stroke-chart-2" strokeWidth={2.8} strokeLinecap="round" />
                            </>
                          )}
                          {t.glyph === "ligdot" && <circle cx={px} cy={py - 2} r="9" className="fill-chart-3/28 stroke-chart-3" strokeWidth={1.5} />}
                          {t.glyph === "mito" && <ellipse cx={px} cy={py - 2} rx="16" ry="8" className="fill-chart-5/35 stroke-chart-5" strokeWidth={1.2} />}
                          <text x={px} y={py + CELL_HALF_Y + 14} textAnchor="middle" className="fill-muted-foreground font-sans text-[8px] font-medium">
                            {t.name}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                <rect x="0" y={VB_H - 36} width={LIB_W} height="36" className="fill-muted/38" />
                <text x={LIB_W / 2} y={VB_H - 14} textAnchor="middle" className="fill-muted-foreground font-mono text-[10px]">
                  click to add to canvas
                </text>

                <rect x={SPLIT_L} y={BAR} width={SPLIT_R - SPLIT_L} height={VB_H - BAR} fill="url(#howGrid)" />
                {!reduced && (
                  <motion.rect
                    x={SPLIT_L}
                    y={BAR}
                    width={SPLIT_R - SPLIT_L}
                    height={VB_H - BAR}
                    fill="none"
                    className="pointer-events-none stroke-primary/[0.04]"
                    animate={{ opacity: [0.25, 0.45, 0.28] }}
                    transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                <g transform={`translate(${DEMO_CELL_GROUP.x} ${DEMO_CELL_GROUP.y})`}>
                  <motion.g
                    initial={false}
                    animate={{ opacity: cellShown ? 1 : 0, scale: cellShown ? 1 : 0.5 }}
                    transition={{ type: "spring", stiffness: 205, damping: 21 }}
                  >
                    <motion.ellipse
                      cx="0"
                      cy="0"
                      rx={CELL_RX}
                      ry={CELL_RY}
                      className="fill-primary/10 stroke-primary"
                      strokeWidth={2}
                      animate={reduced ? {} : { rx: [CELL_RX, CELL_RX + 2, CELL_RX], ry: [CELL_RY, CELL_RY + 2, CELL_RY] }}
                      transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <ellipse cx="-26" cy="-8" rx="32" ry="24" className="fill-primary/13 stroke-primary" strokeWidth={1.4} />
                    <circle cx="-32" cy="-12" r="2.8" className="fill-primary/55" />

                    <g transform={`translate(${RECEPTOR_LX} ${RECEPTOR_LY}) rotate(${RECEPTOR_ROT_DEG})`}>
                      <motion.g
                        initial={false}
                        animate={{
                          opacity: receptorShown ? 1 : 0,
                          x: receptorShown ? 0 : -MEMB_COS * 12,
                          y: receptorShown ? 0 : -MEMB_SIN * 12,
                          scale: receptorShown ? 1 : 0.38,
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 19 }}
                      >
                        <line x1="0" y1="10" x2="0" y2="26" className="stroke-chart-2" strokeWidth={3.8} strokeLinecap="round" />
                        <line x1="0" y1="10" x2="-12" y2="-4" className="stroke-chart-2" strokeWidth={3.8} strokeLinecap="round" />
                        <line x1="0" y1="10" x2="12" y2="-4" className="stroke-chart-2" strokeWidth={3.8} strokeLinecap="round" />
                      </motion.g>
                    </g>

                    <g transform={`translate(${LIGAND_LX} ${LIGAND_LY})`}>
                      <motion.g
                        initial={false}
                        animate={{
                          opacity: ligandShown ? 1 : 0,
                          x: ligandShown ? 0 : MEMB_COS * 46,
                          y: ligandShown ? 0 : MEMB_SIN * 46,
                          scale: ligandShown ? 1 : 0.42,
                        }}
                        transition={{ type: "spring", stiffness: 226, damping: 22 }}
                      >
                        <circle cx="0" cy="0" r="10" className="fill-chart-3/33 stroke-chart-3" strokeWidth={2} />
                        <circle cx="0" cy="0" r="3.2" className="fill-chart-3" />
                      </motion.g>
                    </g>

                    <motion.text
                      x={0}
                      y={EDITOR_LABEL_BELOW_CENTER}
                      textAnchor="middle"
                      fill="#475569"
                      stroke="var(--background)"
                      strokeWidth={2.75}
                      paintOrder="stroke fill"
                      initial={false}
                      animate={{ opacity: cellLabelOn ? 1 : 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ font: EDITOR_LABEL_FONT }}
                    >
                      Nucleus
                    </motion.text>

                    <motion.text
                      x={RECEPTOR_LX}
                      y={RECEPTOR_LY + RECEPTOR_CAPTION_DY}
                      textAnchor="middle"
                      fill="#475569"
                      stroke="var(--background)"
                      strokeWidth={2.75}
                      paintOrder="stroke fill"
                      initial={false}
                      animate={{ opacity: receptorLabelOn ? 1 : 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ font: EDITOR_LABEL_FONT }}
                    >
                      Receptor
                    </motion.text>

                    <motion.text
                      x={LIGAND_LX}
                      y={LIGAND_LY - LIGAND_CAPTION_ABOVE_DY}
                      textAnchor="middle"
                      fill="#475569"
                      stroke="var(--background)"
                      strokeWidth={2.75}
                      paintOrder="stroke fill"
                      initial={false}
                      animate={{ opacity: ligandLabelOn ? 1 : 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ font: EDITOR_LABEL_FONT }}
                    >
                      Ligand
                    </motion.text>
                  </motion.g>
                </g>

                <foreignObject x={SPLIT_R} y={BAR} width={VB_W - SPLIT_R} height={VB_H - BAR}>
                  <div
                    className="flex h-full max-h-full flex-col overflow-hidden bg-surface"
                    style={{
                      boxSizing: "border-box",
                      height: "100%",
                      borderLeftWidth: 1,
                      borderLeftStyle: "solid",
                      borderColor: "var(--border)",
                      boxShadow: "inset 1px 0 0 rgb(148 163 184 / 0.15)",
                    }}
                  >
                    <div className="flex shrink-0 items-center gap-1.5 border-b border-border/80 px-2 py-1">
                      <VectorMascot assistantMode="creator" size={28} tone="editor" busy={false} speaking={vectorSpeaking} interactive={false} />
                      <div className="min-w-0">
                        <p className="font-mono text-[7px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Vector</p>
                        <p className="font-display text-[10px] leading-tight text-foreground">Your ideas on canvas</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 border-b border-border/60 px-2 py-1.5">
                      <span className="rounded border border-primary bg-primary/12 px-1 py-0.5 font-sans text-[7px] font-medium text-primary">Creator</span>
                      <span className="rounded border border-border bg-muted/40 px-1 py-0.5 font-sans text-[7px] text-muted-foreground">Consultant</span>
                    </div>
                    <div className="min-h-0 flex-1 overflow-hidden px-2 py-1">
                      <p className="line-clamp-2 text-[8px] leading-snug text-muted-foreground">
                        {vectorSpeaking
                          ? "Nice ? keep placing icons from the library."
                          : "Describe a pathway or ask for a quick review."}
                      </p>
                    </div>
                  </div>
                </foreignObject>

                {exporting && (
                  <g transform={`translate(${SPLIT_L + 118} ${BAR + 48})`}>
                    <motion.g initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                      <rect width="260" height="30" rx="15" className="fill-accent stroke-primary/55" strokeWidth={1} />
                      <text x="130" y="21" textAnchor="middle" className="fill-primary font-mono text-[11px]">
                        ? figure-02.png exported
                      </text>
                    </motion.g>
                  </g>
                )}

                  </g>
                </motion.g>
              </motion.g>
            </g>
          </g>
        </svg>
        </div>

        <motion.div
          className="pointer-events-none absolute inset-0 z-20 -translate-x-0.5 -translate-y-0.5"
          style={{ left: cursorLeftPct, top: cursorTopPct }}
        >
          {ghostKind && (
            <div className="absolute" style={{ left: GHOST_X, top: GHOST_Y }}>
              <svg width="32" height="32" viewBox="-16 -16 32 32" className="overflow-visible" aria-hidden>
                {ghostKind === "cell" && (
                  <ellipse rx="12" ry="9" className="fill-primary/25 stroke-primary" strokeWidth={1.5} strokeDasharray="3 2" />
                )}
                {ghostKind === "receptor" && (
                  <g className="stroke-chart-2" strokeWidth={2.2} strokeLinecap="round" strokeDasharray="3 2" fill="none">
                    <line x1="0" y1="6" x2="0" y2="-4" />
                    <line x1="0" y1="-4" x2="-5" y2="-11" />
                    <line x1="0" y1="-4" x2="5" y2="-11" />
                  </g>
                )}
                {ghostKind === "ligand" && (
                  <circle r="8" className="fill-chart-3/35 stroke-chart-3" strokeWidth={1.5} strokeDasharray="3 2" />
                )}
              </svg>
            </div>
          )}
          {cursor.click && (
            <motion.span
              key={`cursor-click-pulse-${phase}`}
              className="pointer-events-none absolute left-0 top-0 block h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary"
              initial={{ scale: 0.2, opacity: 0.55 }}
              animate={{ scale: 1.45, opacity: 0 }}
              transition={{ duration: 0.48, delay: 0.06, ease: [0.22, 0.85, 0.32, 1] }}
            />
          )}
          <svg width="16" height="22" viewBox="0 0 16 22" className="relative block" aria-hidden>
            <path
              d="M 0 0 L 0 18 L 5 14 L 8 21 L 11 19 L 8 13 L 13 12 Z"
              className="fill-foreground stroke-background"
              strokeWidth={1.1}
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
