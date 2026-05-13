"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Reveal } from "@/components/Reveal";
import { useEffectiveReducedMotion } from "@/components/MotionPreference";
import { cn } from "@/lib/utils";

function venueRevealRoot(reduced: boolean): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.048,
        delayChildren: reduced ? 0 : 0.045,
      },
    },
  };
}

function venueRevealItem(reduced: boolean): Variants {
  return {
    hidden: {
      opacity: reduced ? 1 : 0,
      filter: reduced ? "blur(0px)" : "blur(10px)",
      y: reduced ? 0 : 8,
      scale: reduced ? 1 : 0.986,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      scale: 1,
      transition: {
        duration: reduced ? 0 : 0.44,
        ease: [0.18, 0.94, 0.32, 1],
      },
    },
  };
}

/** Nested stagger inside a denser region (panels, milestones, slide figure stack). */
function venueRevealNest(reduced: boolean): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.068,
        delayChildren: reduced ? 0 : 0.04,
      },
    },
  };
}

/** Brief optimisation sweep — reads as recomputing layout / reprioritising regions */
function VenueOptimisationSweep({ reduced }: { reduced: boolean }) {
  const sid = useId().replace(/:/g, "");
  if (reduced) return null;
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.72, ease: [0.22, 0.94, 0.32, 1], times: [0, 0.08, 1] }}
      className="pointer-events-none absolute inset-0 z-[32] bg-neutral-950/[0.02]"
    >
      <svg className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id={`opt-grid-${sid}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(148,163,184,0.22)" strokeWidth="0.5" vectorEffect="nonScalingStroke" />
          </pattern>
          <linearGradient id={`opt-beam-${sid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(120,113,108)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(87,83,78)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="rgb(120,113,108)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill={`url(#opt-grid-${sid})`} />
        <motion.rect
          x="0%"
          width="100%"
          height="18%"
          fill={`url(#opt-beam-${sid})`}
          initial={{ y: "-20%" }}
          animate={{ y: "120%" }}
          transition={{ duration: 0.58, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
    </motion.div>
  );
}

type OutputId = "journal" | "poster" | "slides" | "grant";

const OUTPUTS: {
  id: OutputId;
  label: string;
  short: string;
  margin: string;
  examples: string;
}[] = [
  {
    id: "journal",
    label: "Journal figures",
    short: "Print production",
    margin: "Vol. 184 · Letter",
    examples: "Nature · Cell · Science · eLife",
  },
  {
    id: "poster",
    label: "Conference posters",
    short: "Field scale",
    margin: "A0 vector · hall legibility",
    examples: "ASCB · SfN · ESHG",
  },
  {
    id: "slides",
    label: "Slide decks",
    short: "Talk rhythm",
    margin: "16∶9 canvas · crisp type",
    examples: "Lab meetings · symposia",
  },
  {
    id: "grant",
    label: "Grant packages",
    short: "Reviewer skim",
    margin: "NIH Specific Aims",
    examples: "NIH · ERC · Wellcome · NSF",
  },
];

/**
 * Journal panel a — regulated exocytosis at the synaptic active zone (schematic).
 */
function ExocytosisActiveZoneSchematic({ className }: { className?: string }) {
  return (
    <svg viewBox="6 12 88 58" className={cn("text-neutral-900", className)} aria-hidden preserveAspectRatio="xMidYMid meet">
      <text x="50" y="21" fontSize="3.15" fontWeight="600" textAnchor="middle" fill="currentColor" opacity={0.44}>
        bouton · active zone cartoon
      </text>
      <circle cx="34" cy="34" r="10" fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.42} strokeWidth={1} vectorEffect="nonScalingStroke" />
      <circle cx="52" cy="30" r="9" fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.45} strokeWidth={1} vectorEffect="nonScalingStroke" />
      <circle cx="44" cy="44" r="8.5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.05} vectorEffect="nonScalingStroke" />
      <path d="M 46 40 L 46 48.5" stroke="currentColor" strokeOpacity={0.55} strokeWidth={1.35} strokeLinecap="square" vectorEffect="nonScalingStroke" />
      <polygon points="46,36 50,40 42,40" fill="currentColor" fillOpacity={0.35} />
      <line x1="14" x2="86" y1="50" y2="50" stroke="currentColor" strokeOpacity={0.78} strokeWidth={2.4} strokeLinecap="square" vectorEffect="nonScalingStroke" />
      <rect x="30" y="51" width="40" height="6.5" rx="1.2" fill="currentColor" fillOpacity={0.11} stroke="currentColor" strokeOpacity={0.5} strokeWidth={0.85} vectorEffect="nonScalingStroke" />
      <text x="50" y="55.5" fontSize="3.2" fontWeight="650" textAnchor="middle" fill="currentColor" opacity={0.62}>
        postsynaptic density
      </text>
      <path
        d="M 18 28 Q 30 22 40 28"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.2}
        strokeWidth={1}
        strokeDasharray="2 2.5"
        vectorEffect="nonScalingStroke"
      />
    </svg>
  );
}

/** Poster hero — perfusion loop tying reservoir, tissue chamber, and readout lane. */
function OrganChipPerfusionPosterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 120" className={cn("text-stone-900", className)} aria-hidden>
      <defs>
        <linearGradient id="poster-chip-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.07" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <rect x="16" y="28" width="88" height="78" rx="8" fill="url(#poster-chip-fill)" stroke="currentColor" strokeOpacity={0.4} strokeWidth={2.2} />
      <text x="60" y="48" fontSize="10" fontWeight="900" textAnchor="middle" fill="currentColor" opacity={0.78}>
        MEDIA
      </text>
      <path
        d="M 48 58 L 72 58 L 82 68 L 82 88 L 72 98 L 48 98 L 38 88 L 38 68 Z"
        fill="currentColor"
        fillOpacity={0.04}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={1.8}
      />
      {[52, 62, 72].map((cy) => (
        <circle key={cy} cx="60" cy={cy} r="3.2" fill="currentColor" fillOpacity={0.22} stroke="currentColor" strokeOpacity={0.35} strokeWidth={0.45} />
      ))}
      <polygon points="94,72 122,78 94,84" fill="currentColor" fillOpacity={0.32} stroke="none" />
      <text x="106" y="95" fontSize="9.5" fontWeight="850" fill="currentColor" opacity={0.58}>
        FLOW
      </text>
      <rect x="132" y="44" width="94" height="64" rx="7" fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.44} strokeWidth={2.6} />
      <line x1="144" y1="56" x2="214" y2="56" stroke="currentColor" strokeOpacity={0.33} strokeWidth={1.2} />
      <line x1="144" y1="68" x2="214" y2="68" stroke="currentColor" strokeOpacity={0.33} strokeWidth={1.2} />
      <line x1="144" y1="80" x2="214" y2="80" stroke="currentColor" strokeOpacity={0.33} strokeWidth={1.2} />
      <text x="179" y="54" fontSize="11" fontWeight="900" textAnchor="middle" fill="currentColor" opacity={0.74}>
        READOUT
      </text>
      <path d="M 104 76 L 132 76" stroke="currentColor" strokeOpacity={0.45} strokeWidth={4.5} strokeLinecap="square" />
      <rect x="96" y="102" width="110" height="14" rx="5" fill="currentColor" fillOpacity={0.07} stroke="currentColor" strokeOpacity={0.32} strokeWidth={1.35} />
      <text x="151" y="111.5" fontSize="10" fontWeight="900" textAnchor="middle" fill="currentColor" opacity={0.62}>
        PULSE · OCR · METABOLITES
      </text>
    </svg>
  );
}

/** Slides focal — condensed mRNA-vaccination relay terminating on T-cell readout. */
function VaccineTCellPrimingLadder({ className }: { className?: string }) {
  const mid = useId().replace(/:/g, "");
  const steps = [
    { x: 6, label: "mRNA-LNP" },
    { x: 24, label: "RNP" },
    { x: 42, label: "MHC-I" },
    { x: 61, label: "CD8+" },
    { x: 79, label: "Recall" },
  ];
  const widths = [16, 14, 15, 16, 15];
  const h = 18;
  const markId = `vac-arr-${mid}`;
  const barY = 29;
  return (
    <svg viewBox="0 2 100 56" className={cn("text-neutral-100", className)} aria-hidden preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id={markId} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor" opacity="0.55" />
        </marker>
      </defs>
      <text x="50" y="12" fontSize="3.35" fontWeight="700" textAnchor="middle" fill="currentColor" opacity={0.55}>
        DELIVERY → PRESENTATION → EFFECTOR
      </text>
      {steps.map((s, i) => {
        const w = widths[i];
        return (
        <g key={s.label}>
          <rect
            x={s.x}
            y={barY}
            width={w}
            height={h}
            rx="3"
            className="fill-current stroke-current"
            fillOpacity={i === 3 ? 0.22 : 0.11}
            strokeOpacity={i === 3 ? 0.82 : 0.5}
            strokeWidth={i === 3 ? 1.15 : 0.85}
          />
          <text
            x={s.x + w / 2}
            y={barY + h / 2 + 1.05}
            fontSize={i === 3 ? 3.65 : 2.8}
            fontWeight="800"
            textAnchor="middle"
            fill="currentColor"
            opacity={i === 3 ? 0.95 : 0.72}
          >
            {s.label}
          </text>
          {i < steps.length - 1 && (
            <path
              d={`M ${s.x + w} ${barY + h / 2} L ${steps[i + 1].x} ${barY + h / 2}`}
              className="stroke-current"
              strokeOpacity={0.42}
              strokeWidth={1.05}
              fill="none"
              markerEnd={`url(#${markId})`}
              vectorEffect="nonScalingStroke"
            />
          )}
        </g>
        );
      })}
      <text x="50" y="53" fontSize="3.05" fontWeight="600" textAnchor="middle" fill="currentColor" opacity={0.45}>
        pause on checkpoint before advancing deck
      </text>
    </svg>
  );
}

/** Grant figure — brain microvessel transcytosis; overlays share viewBox `0 0 100 54`. */
function BBBTranscytosisSchematic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 54" className={cn("text-foreground", className)} aria-hidden preserveAspectRatio="xMidYMid meet">
      <rect x="6" y="16" width="26" height="28" rx="2" fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.38} strokeWidth={0.75} />
      <text x="18" y="13" fontSize="3" fontWeight="700" textAnchor="middle" fill="currentColor" opacity={0.48}>
        blood
      </text>
      <line x1="34" x2="34" y1="14" y2="46" stroke="currentColor" strokeOpacity={0.62} strokeWidth={1.35} vectorEffect="nonScalingStroke" />
      <line x1="40" x2="40" y1="14" y2="46" stroke="currentColor" strokeOpacity={0.56} strokeWidth={1.2} vectorEffect="nonScalingStroke" />
      <path d="M 32 17 L 42 17" stroke="currentColor" strokeOpacity={0.72} strokeWidth={1.1} strokeLinecap="square" vectorEffect="nonScalingStroke" />
      <circle cx="44" cy="30" r="5" fill="currentColor" fillOpacity={0.16} stroke="currentColor" strokeOpacity={0.48} strokeWidth={0.65} />
      <text x="37" y="52" fontSize="2.85" fontWeight="600" textAnchor="middle" fill="currentColor" opacity={0.42}>
        tight junction belt
      </text>
      <rect x="56" y="14" width="38" height="30" rx="2" fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.28} strokeWidth={0.55} strokeDasharray="3 2" />
      <text x="75" y="24" fontSize="3" fontWeight="600" textAnchor="middle" fill="currentColor" opacity={0.44}>
        tissue
      </text>
      <path
        d="M 69 17 Q 80 13 83 21 L 86 37 Q 76 43 62 39"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.28}
        strokeWidth={1.05}
      />
      <text x="78" y="44.5" fontSize="2.85" fontWeight="600" textAnchor="middle" fill="currentColor" opacity={0.4}>
        glial sheath
      </text>
    </svg>
  );
}

/** Journal panel b — multiplex immunoblot bands (diagrammatic). */
function JournalPanelWesternBlot({ className }: { className?: string }) {
  const lanes = [11, 27, 43, 59, 75];
  const bands: { x: number; y: number; w: number; h: number; o: number }[] = [
    { x: 11, y: 15, w: 12, h: 3.2, o: 0.92 },
    { x: 11, y: 23, w: 12, h: 3.2, o: 0.85 },
    { x: 11, y: 34, w: 12, h: 3.2, o: 0.14 },
    { x: 27, y: 17, w: 12, h: 3.2, o: 0.88 },
    { x: 27, y: 30, w: 12, h: 3.2, o: 0.4 },
    { x: 43, y: 20, w: 12, h: 3.2, o: 0.78 },
    { x: 43, y: 32, w: 12, h: 3.2, o: 0.22 },
    { x: 59, y: 16, w: 12, h: 3.2, o: 0.9 },
    { x: 59, y: 28, w: 12, h: 3.2, o: 0.35 },
    { x: 75, y: 18, w: 12, h: 3.2, o: 0.55 },
    { x: 75, y: 27, w: 12, h: 3.2, o: 0.48 },
  ];
  return (
    <svg viewBox="0 4 100 56" className={cn("text-neutral-900", className)} aria-hidden preserveAspectRatio="xMidYMid meet">
      <rect x="8" y="10" width="84" height="38" rx="1" fill="none" stroke="currentColor" strokeOpacity={0.24} strokeWidth={0.75} vectorEffect="nonScalingStroke" />
      <text x="10" y="18" fontSize="3.6" fontWeight="700" fill="currentColor" opacity={0.42}>
        IB: pSYK · tSYK · GAPDH
      </text>
      {lanes.map((lx) => (
        <line key={lx} x1={lx} x2={lx} y1="22" y2="44" stroke="currentColor" strokeOpacity={0.12} strokeWidth={0.45} vectorEffect="nonScalingStroke" />
      ))}
      {bands.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="0.45" fill="currentColor" fillOpacity={b.o} />
      ))}
      <text x="8" y="54" style={{ font: "500 4.6px ui-sans-serif, system-ui, sans-serif" }} fill="currentColor" opacity={0.53}>
        DMSO (+/− ligand · 60 min chase) · representative of biologically independent lysates (Fig. S7)
      </text>
    </svg>
  );
}

/** Quant panel — cytokine secretion fold-change by genotype. */
function JournalPanelGroupedBars({ className }: { className?: string }) {
  const vals = [0.55, -0.15, -0.32, -0.48];
  const baseY = 30;
  return (
    <svg viewBox="6 10 88 42" className={cn("text-neutral-900", className)} aria-hidden preserveAspectRatio="xMidYMid meet">
      <text x="10" y="15" fontSize="4" fontWeight="700" fill="currentColor" opacity={0.46}>
        multiplex bead assay
      </text>
      <line x1="22" x2="86" y1={baseY} y2={baseY} stroke="currentColor" strokeOpacity={0.45} strokeWidth={0.75} vectorEffect="nonScalingStroke" />
      <line x1="22" x2="86" y1="18" y2="18" stroke="currentColor" strokeOpacity={0.15} strokeWidth={0.45} strokeDasharray="2 3" vectorEffect="nonScalingStroke" />
      {vals.map((v, gi) => {
        const gx = 28 + gi * 15;
        const h = Math.max(4, Math.abs(v * 60));
        const y = v >= 0 ? baseY - h : baseY;
        return (
          <g key={gi}>
            <rect
              x={gx}
              y={Math.min(y, baseY)}
              width="11"
              height={h}
              rx="1.1"
              fill="currentColor"
              opacity={gi === 0 ? 0.58 : gi === 3 ? 0.78 : 0.65}
            />
            <text x={gx + 5.5} y="38" fontSize="3.2" fontWeight="600" textAnchor="middle" fill="currentColor" opacity={0.45}>
              {["WT", "WT", "KO", "KO"][gi]}
            </text>
          </g>
        );
      })}
      <text x="10" y="44" fontSize="3.6" fill="currentColor" opacity={0.5}>
        delta log10 vs vehicle, IL-2 / TNF pairs
      </text>
    </svg>
  );
}

function JournalScaleBar({ reduced, className }: { reduced: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5 font-mono text-[4.5px] uppercase tracking-[0.14em] text-neutral-600", className)}>
      <motion.span
        className="h-px w-10 origin-left bg-neutral-800"
        aria-hidden
        initial={reduced ? undefined : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.42, delay: reduced ? 0 : 0.12, ease: [0.22, 0.94, 0.32, 1] }}
      />
      <span>500 nm</span>
    </div>
  );
}

/**
 * Publication plate: multi-panel, grayscale-safe, statistics-forward — editorial culture of Cell/Nature composite figures.
 */
function JournalFigurePlate({ reduced }: { reduced: boolean }) {
  const vItem = () => venueRevealItem(reduced);

  return (
    <motion.div
      variants={venueRevealRoot(reduced)}
      initial="hidden"
      animate="visible"
      className="pointer-events-none flex h-full min-h-0 flex-col bg-[#f7f7f5] p-[2.75%] text-neutral-900"
    >
      <motion.div variants={vItem()} className="mb-1 flex flex-wrap items-baseline justify-between gap-2 border-b border-neutral-300 pb-1">
        <p className="font-sans text-[6px] font-bold tracking-tight text-neutral-900">
          Fig. 2<span className="font-normal text-neutral-500"> | Synaptic release probability couples to proximal immune signaling.</span>
        </p>
        <p className="max-w-[55%] text-right font-mono text-[4.5px] leading-snug text-neutral-500">
          Source Data Fig. 2 · Proteomics repository · lysate blot methods (ChemiDoc)
        </p>
      </motion.div>

      <motion.div
        variants={venueRevealNest(reduced)}
        initial="hidden"
        animate="visible"
        className="grid min-h-0 flex-1 grid-cols-12 grid-rows-6 gap-[3px] bg-neutral-900/[0.04] p-[3px]"
      >
        {/* Panel a — mechanistic schematic (distinct role: hypothesis diagram) */}
        <motion.div
          variants={vItem()}
          className="relative col-span-7 row-span-4 rounded-[1px] border border-neutral-400/95 bg-white p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,1)]"
        >
          <span className="absolute left-1 top-0.5 font-sans text-[11px] font-black leading-none text-neutral-900">a</span>
          <div className="grid h-[calc(100%-10px)] min-h-0 grid-rows-[1fr_auto] pt-6">
            <div className="relative flex min-h-0 items-center justify-center px-2">
              <motion.div
                className="relative max-h-full w-full max-w-[min(210px,94%)]"
                initial={reduced ? undefined : { scale: 0.88, opacity: 0, filter: "blur(6px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.05, ease: [0.22, 0.94, 0.32, 1] }}
              >
                <ExocytosisActiveZoneSchematic className="mx-auto h-full w-full text-neutral-800" />
              </motion.div>
            </div>
            <div className="flex shrink-0 justify-end pt-0.5">
              <JournalScaleBar reduced={reduced} />
            </div>
          </div>
          <p className="pointer-events-none absolute bottom-1 left-9 right-2 text-[5px] leading-snug text-neutral-600">
            Diagram highlights vesicle docking and PSD placement; membranes not to scale.
          </p>
        </motion.div>

        {/* Panel b — quantitative evidence channel */}
        <motion.div variants={vItem()} className="relative col-span-5 row-span-4 rounded-[1px] border border-neutral-400/95 bg-white p-1">
          <span className="absolute left-1 top-0.5 font-sans text-[11px] font-black leading-none text-neutral-900">b</span>
          <motion.div
            className="flex h-[calc(100%-10px)] min-h-0 flex-col justify-center pt-6 pb-7"
            initial={reduced ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.08, ease: [0.22, 0.94, 0.32, 1] }}
          >
            <JournalPanelWesternBlot className="mx-auto h-auto w-full max-w-[200px] max-h-[min(100%,140px)] object-contain" />
          </motion.div>
          <p className="absolute bottom-1 left-7 right-1 text-[5px] leading-snug text-neutral-600">
            Panel b multiplex blots quantify signaling adapters; panel c multiplex cytokines quantify secretion loss.
          </p>
        </motion.div>

        {/* Panel c — population / time-course channel */}
        <motion.div variants={vItem()} className="relative col-span-12 row-span-2 rounded-[1px] border border-neutral-400/95 bg-white p-1">
          <span className="absolute left-1 top-0.5 font-sans text-[11px] font-black leading-none text-neutral-900">c</span>
          <motion.div
            variants={venueRevealNest(reduced)}
            initial="hidden"
            animate="visible"
            className="flex h-full min-h-0 items-center justify-center gap-4 pt-9 pb-6 md:gap-6"
          >
            <motion.div
              className="min-w-0 flex-1 overflow-hidden [&>svg]:mx-auto [&>svg]:block [&>svg]:h-auto [&>svg]:max-h-[min(72px,45%)] [&>svg]:w-full [&>svg]:max-w-[240px]"
              initial={reduced ? undefined : { clipPath: "inset(0 18% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: reduced ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <JournalPanelGroupedBars className="w-full" />
            </motion.div>
            <motion.div
              variants={vItem()}
              className="w-[38%] max-w-[120px] shrink-0 self-center border-l border-dotted border-neutral-300 pl-2.5"
            >
              <p className="font-mono text-[4.5px] uppercase tracking-[0.1em] text-neutral-500">Statistics</p>
              <p className="mt-1 font-mono text-[5px] leading-snug text-neutral-700">
                RM two-way ANOVA · Holm–Šídák
                <br />
                <span className="text-neutral-900">*</span>P &lt; 0.05 · <span className="text-neutral-900">***</span>P &lt; 0.001
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div variants={vItem()} className="mt-1 font-sans text-[5.5px] leading-snug text-neutral-700">
        <span className="font-semibold text-neutral-900">Extended metadata.</span>{" "}
        Live-imaging suite + paired electrophysiology stacks · blot quant pipelines aligned with publisher vector specs.
      </motion.div>
    </motion.div>
  );
}

/**
 * Hall-poster grammar: oversized type, heroic diagram, ruthless compression — culturally distinct from print peer review.
 */
function ConferencePosterPlate({ reduced }: { reduced: boolean }) {
  const vItem = () => venueRevealItem(reduced);
  const pid = useId().replace(/:/g, "");
  return (
    <motion.div
      variants={venueRevealRoot(reduced)}
      initial="hidden"
      animate="visible"
      className="pointer-events-none relative flex h-full min-h-0 flex-col overflow-hidden bg-gradient-to-b from-[#10100e] via-[#1f1c18] to-[#121211] font-sans text-white"
    >
      <motion.svg variants={vItem()} className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.15]" aria-hidden>
        <defs>
          <pattern id={`pst-${pid}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#e7e5e4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#pst-${pid})`} opacity="0.5" />
      </motion.svg>

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col px-[3.5%] pb-[10%] pt-[1.75%]">
        <motion.div variants={vItem()} className="shrink-0 px-0.5 pb-2 text-center">
          <motion.p
            className="text-[clamp(10px,3.2vw,18px)] font-black uppercase leading-[0.95] tracking-[0.04em] text-white drop-shadow-sm"
            initial={reduced ? undefined : { letterSpacing: "0.14em", filter: "blur(4px)" }}
            animate={{ letterSpacing: "0.04em", filter: "blur(0px)" }}
            transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 0.94, 0.32, 1] }}
          >
            Perfusion first
            <br />
            physiology second
          </motion.p>
          <p className="mt-1.5 text-[clamp(6px,2vw,10px)] font-semibold tracking-wide text-stone-200/95">
            Media loop · shear field · oxygen trace · telemetry lanes
          </p>
        </motion.div>

        <motion.div variants={vItem()} className="flex min-h-0 flex-1 items-center justify-center py-2">
          <motion.div
            variants={vItem()}
            className="flex max-h-[min(78%,304px)] w-full max-w-[min(520px,94%)] flex-col overflow-hidden rounded-lg border-2 border-stone-400/45 bg-[#fdfcfa] shadow-[0_12px_40px_rgba(0,0,0,0.32)]"
            initial={reduced ? undefined : { scale: 0.96, borderColor: "rgba(168,162,158,0.15)" }}
            animate={{ scale: 1, borderColor: "rgba(120,113,104,0.45)" }}
            transition={{ duration: reduced ? 0 : 0.5, ease: [0.18, 0.94, 0.28, 1] }}
          >
            <div className="flex shrink-0 items-center justify-center border-b-[3px] border-stone-700 bg-stone-900 px-2 py-2">
              <span className="text-center text-[clamp(8px,2.4vw,13px)] font-black uppercase leading-tight tracking-[0.14em] text-white">
                Microfluidics · one loop · hall legibility baked in
              </span>
            </div>
            <motion.div
              variants={venueRevealNest(reduced)}
              initial="hidden"
              animate="visible"
              className="flex min-h-0 flex-1 flex-col items-stretch justify-center gap-1 px-[3%] py-2.5 text-stone-900"
            >
              <motion.div
                variants={vItem()}
                className="mx-auto flex w-full max-w-[min(100%,300px)] flex-1 items-center justify-center"
                initial={reduced ? undefined : { scale: 0.94, rotate: -1 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: reduced ? 0 : 0.52, ease: [0.22, 0.94, 0.32, 1] }}
              >
                <OrganChipPerfusionPosterIcon className="h-auto w-full max-h-[min(148px,48svh)] object-contain object-center" />
              </motion.div>
              <motion.p
                variants={vItem()}
                className="shrink-0 px-1 text-center text-[clamp(5.5px,1.65vw,8.5px)] font-bold uppercase leading-snug tracking-[0.1em] text-stone-700"
              >
                Read from 8 feet · captions burned into layout
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Trio of narrative beats — slogan density, not paragraphs */}
      <motion.div
        variants={venueRevealNest(reduced)}
        initial="hidden"
        animate="visible"
        className="pointer-events-none absolute bottom-[2.25%] left-[4%] right-[4%] z-[2] flex justify-between gap-2 text-center sm:gap-3"
      >
        {[
          ["Gap", "2D assays miss shear + exchange"],
          ["Lever", "Chips + online sensors"],
          ["So what", "Sharper toxicity priors"],
        ].map(([k, v]) => (
          <motion.div
            key={k}
            variants={vItem()}
            className="flex-1 rounded-md border border-white/15 bg-black/35 px-2 py-1.5 backdrop-blur-[2px]"
            initial={reduced ? undefined : { scale: 0.92, borderColor: "rgba(255,255,255,0.06)" }}
            animate={{ scale: 1, borderColor: "rgba(255,255,255,0.15)" }}
          >
            <p className="text-[clamp(8px,2.6vw,12px)] font-black uppercase tracking-widest text-amber-200">{k}</p>
            <p className="mt-0.5 text-[clamp(6px,1.9vw,9px)] font-semibold text-white/90">{v}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/** Presenter culture: widescreen beat, glare-safe field, staged disclosure — not instructional poster or journal plate. */
function SlideDeckPlate({ reduced }: { reduced: boolean }) {
  const vItem = () => venueRevealItem(reduced);

  return (
    <motion.div
      variants={venueRevealRoot(reduced)}
      initial="hidden"
      animate="visible"
      className="pointer-events-none relative h-full min-h-0 bg-gradient-to-br from-[#09090b] via-[#18181b] to-[#0a0a0b] text-white"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[5%] bg-black/80" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[5%] bg-black/70" />

      <motion.div variants={vItem()} className="absolute left-[4%] top-[8%] max-w-[38%]">
        <p className="font-mono text-[5px] uppercase tracking-[0.2em] text-stone-400/95">Translational vaccines · Slide 07</p>
        <motion.p
          className="mt-3 text-[clamp(10px,2.9vw,16px)] font-bold leading-[1.05] tracking-tight text-white"
          initial={reduced ? undefined : { y: 10, fontWeight: 500 }}
          animate={{ y: 0, fontWeight: 700 }}
          transition={{ duration: reduced ? 0 : 0.45 }}
        >
          Frame the
          <br />
          choke point
        </motion.p>
        <p className="mt-2 text-[6.5px] leading-snug text-slate-400">Compressed relay from delivery to antigen display — linger on presentation before sequencing the next cue.</p>
      </motion.div>

      <motion.div variants={vItem()} className="absolute right-[4%] top-[9%] text-right font-mono text-[5px] text-slate-500">
        16∶9 keynote safe
      </motion.div>

      {/* Figure field: blurred context + illuminated focal band = progressive disclosure */}
      <motion.div
        variants={vItem()}
        className="absolute inset-y-[17%] right-[5%] w-[58%] overflow-hidden rounded-md border border-white/10 bg-zinc-900/80"
        initial={reduced ? undefined : { scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.48, ease: [0.2, 0.9, 0.26, 1] }}
      >
        <motion.div
          variants={venueRevealNest(reduced)}
          initial="hidden"
          animate="visible"
          className="absolute inset-0"
        >
          <motion.div
            variants={vItem()}
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden
            initial={reduced ? undefined : { opacity: 0.12, scale: 1.04 }}
            animate={{ opacity: 0.35, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.62 }}
          >
            <VaccineTCellPrimingLadder className="h-[78%] w-[88%] blur-[1.8px] text-slate-200" />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_48%_55%_at_58%_45%,transparent_20%,rgba(24,24,27,0.82)_72%)]"
            initial={reduced ? undefined : { opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.08 }}
          />
          <motion.div
            variants={vItem()}
            className="absolute left-1/2 top-[48%] w-[74%] -translate-x-1/2 -translate-y-1/2"
            initial={reduced ? undefined : { opacity: 0, scale: 0.92, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            <VaccineTCellPrimingLadder className="relative z-10 mx-auto h-auto w-[min(100%,200px)] text-stone-100 drop-shadow-[0_0_16px_rgba(250,250,249,0.14)]" />
          </motion.div>
          {/* Callout choreography — presenter laser-pointer grammar */}
          <motion.div
            variants={vItem()}
            className="absolute left-[8%] top-[62%] z-10 max-w-[46%] rounded border-l-4 border-amber-400 bg-amber-400/18 px-2 py-1 backdrop-blur-sm"
            initial={reduced ? undefined : { x: -8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.26 }}
          >
            <p className="font-mono text-[5px] font-bold uppercase tracking-[0.16em] text-amber-200">Say:</p>
            <motion.p
              className="text-[6.5px] font-semibold leading-tight text-white"
              initial={reduced ? undefined : { letterSpacing: "0.06em", lineHeight: 1.15 }}
              animate={{ letterSpacing: "0", lineHeight: 1.25 }}
              transition={{ duration: reduced ? 0 : 0.42, delay: reduced ? 0 : 0.3 }}
            >
              “Xa bursts here — fibrin formation is deterministic, not random.”
            </motion.p>
          </motion.div>
          <motion.svg
            variants={vItem()}
            className="pointer-events-none absolute left-[38%] top-[52%] z-10 h-16 w-24 text-amber-300"
            viewBox="0 0 60 48"
            aria-hidden
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.32 }}
          >
            <motion.path
              d="M4 42 Q 24 36 54 31"
              fill="none"
              stroke="currentColor"
              strokeDasharray="3 2.5"
              strokeWidth="1.4"
              initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.85 }}
              transition={{ duration: reduced ? 0 : 0.52, delay: reduced ? 0 : 0.34, ease: [0.33, 0, 0.2, 1] }}
            />
            <motion.circle
              cx="54"
              cy="31"
              r="2.4"
              fill="currentColor"
              initial={reduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.28, delay: reduced ? 0 : 0.72 }}
            />
          </motion.svg>
        </motion.div>
      </motion.div>

      <motion.div variants={vItem()} className="absolute bottom-[7%] left-[4%] right-[4%] flex items-center justify-between border-t border-white/10 pt-2">
        <p className="font-mono text-[5px] uppercase tracking-[0.14em] text-slate-500">Presenter notes</p>
        <p className="max-w-[78%] text-right text-[6px] italic leading-snug text-slate-400">
          14s dwell · trace delivery→presentation · teaser slide: germinal-center recall assay.
        </p>
      </motion.div>
    </motion.div>
  );
}

/** Reviewer exhaustion culture: skim rails, clustered evidence pointers, bureaucratic linkage. */
function GrantPackagePlate({ reduced }: { reduced: boolean }) {
  const vItem = () => venueRevealItem(reduced);

  return (
    <motion.div
      variants={venueRevealRoot(reduced)}
      initial="hidden"
      animate="visible"
      className="pointer-events-none flex h-full min-h-0 flex-col bg-[#fcfcfb] font-sans text-neutral-900"
    >
      <motion.header variants={vItem()} className="flex items-start justify-between border-b-[3px] border-neutral-800 px-[3.5%] pb-2 pt-[3.5%]">
        <div>
          <p className="font-mono text-[5px] uppercase tracking-[0.16em] text-neutral-500">National Institutes of Health · Research Project Grant (R01)</p>
          <motion.h3
            className="mt-1 text-[8px] font-bold uppercase tracking-wide"
            initial={reduced ? undefined : { letterSpacing: "0.06em", color: "#737373" }}
            animate={{ letterSpacing: "0.035em", color: "#171717" }}
            transition={{ duration: reduced ? 0 : 0.45 }}
          >
            Research Strategy — Specific Aims (excerpt)
          </motion.h3>
          <p className="mt-0.5 font-mono text-[4.75px] text-neutral-500">Abbreviated plate for review; pagination continuous with Human Subjects attachment.</p>
        </div>
        <div className="rounded-sm border border-neutral-900/30 bg-neutral-100 px-1.5 py-1 text-right font-mono text-[5px] leading-tight tabular-nums text-neutral-800">
          <span className="block text-neutral-500">CRS routing</span>
          <span>Panel B · Nov cycle</span>
          <span className="mt-0.5 block text-[4.5px] text-neutral-500">Jump: p.6 budget · p.9 rigor</span>
        </div>
      </motion.header>

      <motion.div variants={venueRevealNest(reduced)} initial="hidden" animate="visible" className="grid min-h-0 flex-1 grid-cols-[1fr_minmax(88px,26%)] gap-2 px-[3.5%] pt-2">
        <motion.div variants={vItem()} className="min-w-0 space-y-2">
          <div className="border-l-[3px] border-neutral-800 bg-neutral-50/95 pl-2 pr-1 py-1">
            <p className="font-mono text-[4.75px] font-bold uppercase tracking-[0.12em] text-neutral-900">Preliminary data (commitment)</p>
            <p className="mt-0.5 text-[5.75px] leading-snug text-neutral-900">
              Fig. 2B answers CSR critique on “whole-brain vs. vessel-level uptake” by anchoring hypotheses to cortical microvessel anatomy.
            </p>
          </div>

          <p className="text-[6.75px] font-bold text-neutral-900">Specific Aim 3 — Parcel transcytosis risk across cortex vs. niche vessels.</p>
          <motion.div variants={venueRevealNest(reduced)} initial="hidden" animate="visible" className="space-y-1 border border-neutral-200 bg-white px-2 py-1.5">
            {[100, 97, 88, 91, 84, 79, 93, 76].map((w, idx) => (
              <motion.div key={idx} variants={vItem()} className="flex items-center gap-2">
                <span className="w-12 shrink-0 font-mono text-[4.5px] uppercase tracking-[0.04em] text-neutral-500">
                  Aim 3.{idx + 1}
                </span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-200">
                  <motion.div
                    className="h-full origin-left rounded-full bg-neutral-900/70"
                    style={{ width: `${w}%` }}
                    initial={reduced ? undefined : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: reduced ? 0 : 0.48,
                      delay: reduced ? 0 : 0.04 + idx * 0.036,
                      ease: [0.22, 0.94, 0.28, 1],
                    }}
                  />
                </div>
              </motion.div>
            ))}
            <p className="font-mono text-[4.5px] uppercase tracking-[0.1em] text-neutral-500">Milestones · pass/fail · annual report alignment</p>
          </motion.div>
        </motion.div>

        <motion.aside variants={vItem()} className="flex flex-col gap-1 rounded-sm border border-neutral-900/15 bg-neutral-100/95 p-1.5 text-[5px] leading-snug shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          <span className="border-b border-neutral-950/35 pb-0.5 font-mono text-[5px] font-bold uppercase tracking-[0.12em] text-neutral-950">Reviewer map</span>
          <div className="rounded-[2px] border border-neutral-800/55 bg-white p-1">
            <span className="font-bold text-neutral-900">Significance</span>
            <p className="mt-0.5 text-neutral-700">Explains how microvessel class changes macromolecule exposure—not bulk perfusion averages.</p>
          </div>
          <div className="rounded-[2px] border border-neutral-800/55 bg-white p-1">
            <span className="font-bold text-neutral-900">Innovation</span>
            <p className="mt-0.5 text-neutral-700">Pairs tracer PET with single-vessel expression maps.</p>
          </div>
          <div className="rounded-[2px] border border-neutral-800/55 bg-white p-1">
            <span className="font-bold text-neutral-900">Feasibility</span>
            <p className="mt-0.5 text-neutral-700">ISO-tracked human samples + archived mouse cohort already IRB-linked.</p>
          </div>
          <div className="mt-auto rounded-[2px] border border-dashed border-neutral-800/65 bg-yellow-300/65 p-1 font-mono text-[4.75px] text-neutral-900">
            <span className="font-bold">Flag for PO:</span>
            IP briefing if Aim 3.2 (carrier library screen) survives interim review.
          </div>
        </motion.aside>
      </motion.div>

      <motion.figure
        variants={vItem()}
        className="relative mx-[3.5%] mb-[3.5%] mt-2 border-2 border-neutral-900 bg-white px-3 pb-5 pt-2 shadow-[2px_4px_0_0_rgba(0,0,0,0.14)]"
        initial={reduced ? undefined : { y: 6 }}
        animate={{ y: 0 }}
        transition={{ duration: reduced ? 0 : 0.42, ease: [0.2, 0.9, 0.26, 1] }}
      >
        <motion.div variants={venueRevealNest(reduced)} initial="hidden" animate="visible" className="">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <figcaption className="font-mono text-[6px] font-bold uppercase tracking-[0.04em] text-neutral-900">Figure 2B — BBB routing tied to Aim 3</figcaption>
            <span className="rounded-sm bg-neutral-100 px-1 py-px font-mono text-[5px] text-neutral-700">Vessel checkpoints · hypotheses H₃a–H₃c</span>
          </div>
          <motion.p
            variants={vItem()}
            className="mt-1 font-sans text-[5.25px] italic leading-snug text-neutral-700"
          >
            Numbered overlays tie milestones (junction belt → vesicle corridor → glial sheath); wording mirrors NIH expectation blocks.
          </motion.p>
          <motion.div
            variants={vItem()}
            className="relative mx-auto mt-3 max-w-[280px]"
            initial={reduced ? undefined : { clipPath: "inset(0 0 8% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div initial={reduced ? undefined : { opacity: 0.86 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.4 }}>
              <BBBTranscytosisSchematic className="relative z-[1] h-auto w-full text-neutral-900" />
            </motion.div>
            <motion.svg
              className="pointer-events-none absolute inset-0 z-[2] text-amber-950"
              viewBox="0 0 100 54"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden
              initial={reduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.18 }}
            >
              <line x1="37" y1="15" x2="49" y2="22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.8" opacity="0.72" vectorEffect="nonScalingStroke" />
              <circle cx="37" cy="15" r="4.2" fill="white" stroke="currentColor" strokeWidth="1" vectorEffect="nonScalingStroke" />
              <text x="37" y="16.8" fontSize="4.75" fontWeight="700" textAnchor="middle" fill="currentColor">
                1
              </text>
              <line x1="44" y1="31" x2="60" y2="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.8" opacity="0.68" vectorEffect="nonScalingStroke" />
              <circle cx="44" cy="31" r="4.2" fill="white" stroke="currentColor" strokeWidth="1" />
              <text x="44" y="32.8" fontSize="4.75" fontWeight="700" textAnchor="middle" fill="currentColor">
                2
              </text>
              <line x1="83" y1="20" x2="68" y2="33" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" opacity="0.55" vectorEffect="nonScalingStroke" />
              <circle cx="83" cy="20" r="3.9" fill="white" stroke="currentColor" strokeWidth="1" />
              <text x="83" y="21.6" fontSize="4.75" fontWeight="700" textAnchor="middle" fill="currentColor">
                3
              </text>
            </motion.svg>
          </motion.div>
          <motion.div
            variants={venueRevealNest(reduced)}
            initial="hidden"
            animate="visible"
            role="presentation"
            className="mt-4 grid gap-2 border-t border-neutral-950/85 pt-2 font-mono text-[4.85px] text-neutral-800"
          >
            {[
              ["① Tight junction belt", "Stress-test junctional vs paracellular critiques (Aim 3.1)."],
              ["② Transcytosis hub", "Keeps CRS language aligned with Aim 3.3 pharmacokinetics appendix."],
              ["③ Glial sheath", "Coverage statistic overlays collaborator fluorescence atlas anchor."],
            ].map(([dt, dd]) => (
              <motion.div key={dt} variants={vItem()} className="flex gap-3">
                <span className="w-24 shrink-0 font-bold uppercase tracking-[0.08em] text-neutral-950">{dt}</span>
                <span className="text-neutral-700">{dd}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.figure>
    </motion.div>
  );
}

function FormatPreviewPlate({ mode, reduced }: { mode: OutputId; reduced: boolean }) {
  switch (mode) {
    case "journal":
      return <JournalFigurePlate reduced={reduced} />;
    case "poster":
      return <ConferencePosterPlate reduced={reduced} />;
    case "slides":
      return <SlideDeckPlate reduced={reduced} />;
    case "grant":
      return <GrantPackagePlate reduced={reduced} />;
  }
}

function FormatPreviewLayer({ display, reduced }: { display: OutputId; reduced: boolean }) {
  const morph = useMemo(
    () => ({
      duration: reduced ? 0.08 : 0.42,
      ease: [0.22, 0.08, 0.26, 1] as readonly [number, number, number, number],
    }),
    [reduced],
  );

  return (
    <div className="relative isolate h-full min-h-0 w-full overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={display}
          layout={false}
          className="pointer-events-none absolute inset-0 min-h-0 overflow-hidden"
          initial={reduced ? false : { opacity: 0, scale: 0.985, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.992, filter: "blur(10px)" }}
          transition={{
            duration: morph.duration,
            ease: [...morph.ease] as unknown as [number, number, number, number],
          }}
        >
          <VenueOptimisationSweep reduced={reduced} />
          <FormatPreviewPlate mode={display} reduced={reduced} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PublishingWorkspace() {
  const reduced = useEffectiveReducedMotion();
  const uid = useId().replace(/:/g, "");
  const [active, setActive] = useState<OutputId>("journal");
  const [hover, setHover] = useState<OutputId | null>(null);
  const display = hover ?? active;

  const opacityTween = useMemo(
    () => ({ duration: reduced ? 0.06 : 0.26, ease: [0.25, 0.1, 0.25, 1] as const }),
    [reduced],
  );

  const meta = OUTPUTS.find((o) => o.id === display)!;

  const lockFormat = (id: OutputId) => {
    setActive(id);
    setHover(null);
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8" onMouseLeave={() => setHover(null)}>
      {/* Small viewports: formats sit directly above the plate so preview stays on-screen */}
      <div
        className="-mx-1 flex gap-1 overflow-x-auto overscroll-x-contain pb-1 pt-0.5 [scrollbar-width:thin] lg:hidden"
        role="radiogroup"
        aria-label="Publishing output formats — compact"
      >
        {OUTPUTS.map((o) => {
          const selected = active === o.id;
          const preview = display === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-controls={`${uid}-artboard`}
              tabIndex={0}
              onMouseEnter={() => setHover(o.id)}
              onFocus={() => setHover(o.id)}
              onBlur={() => setHover(null)}
              onClick={() => lockFormat(o.id)}
              className={cn(
                "shrink-0 rounded-none border-y border-r border-border bg-transparent py-2 pl-3 pr-3.5 text-left transition-colors duration-150 first:border-l focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                preview ? "border-l-2 border-l-primary bg-primary/[0.07]" : "border-l border-l-transparent",
              )}
            >
              <span className="meta-mono block text-[9px] text-primary/90">{o.short}</span>
              <span className="font-display text-[13px] font-semibold tracking-[-0.02em] text-foreground">{o.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-x-10 lg:gap-y-0">
        {/* Sticky on large screens: rail can scroll while the plate stays in view */}
        <div className="relative min-w-0 flex-1 pb-2 lg:sticky lg:top-24 lg:z-10 lg:w-[58%] lg:self-start">
          <div
            id={`${uid}-artboard`}
            aria-label={`Layout preview for ${meta.label}`}
            className="relative mx-auto w-full overflow-hidden rounded-[2px] border border-border/80 bg-[linear-gradient(165deg,var(--card)_0%,color-mix(in_oklab,var(--muted)_65%,var(--card))_48%,var(--card)_100%)] shadow-[12px_18px_0_0_color-mix(in_oklab,var(--foreground)_6%,transparent)]"
          >
            <div className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l border-t border-foreground/20" aria-hidden />
            <div className="pointer-events-none absolute right-3 top-3 h-5 w-5 border-r border-t border-foreground/20" aria-hidden />
            <div className="pointer-events-none absolute bottom-[2.55rem] left-3 h-5 w-5 border-b border-l border-foreground/20" aria-hidden />
            <div className="pointer-events-none absolute bottom-[2.55rem] right-3 h-5 w-5 border-b border-r border-foreground/20" aria-hidden />

            {/* Fixed-height stage — concrete venue plates crossfade */}
            <div className="relative h-[min(300px,40svh)] w-full overflow-hidden sm:h-[min(340px,42svh)] lg:h-[min(380px,44svh)]">
              <FormatPreviewLayer display={display} reduced={reduced} />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 border-t border-border/50 bg-muted/25 px-2.5 py-1.5 font-mono text-[5.5px] uppercase tracking-[0.12em] text-muted-foreground">
              <span className="tabular-nums text-foreground/50">{meta.short}</span>
            </div>
          </div>

          <p className="mt-4 max-w-xl font-mono text-[0.65rem] leading-relaxed text-muted-foreground lg:max-w-none">
            <span className="text-foreground/70">{meta.margin}</span>
            <span className="mx-2 text-border">·</span>
            Hover a format for a live preview; click to lock. On narrow screens formats sit directly above so the artboard stays visible.
          </p>
        </div>

        <aside className="relative mt-2 hidden shrink-0 flex-col justify-center lg:mt-0 lg:flex lg:w-[34%]">
          <div
            className="pointer-events-none absolute -left-6 top-1/2 hidden h-px w-12 -translate-y-1/2 bg-gradient-to-r from-transparent to-border lg:block"
            aria-hidden
          />
          <div role="radiogroup" aria-label="Publishing output formats" className="flex flex-col gap-0">
            {OUTPUTS.map((o, i) => {
              const selected = active === o.id;
              const preview = display === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  id={`${uid}-tab-${o.id}`}
                  aria-controls={`${uid}-artboard`}
                  tabIndex={0}
                  onMouseEnter={() => setHover(o.id)}
                  onFocus={() => setHover(o.id)}
                  onBlur={() => setHover(null)}
                  onClick={() => lockFormat(o.id)}
                  className={cn(
                    "group relative border-0 bg-transparent text-left transition-colors duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "py-5 pl-0 pr-2 md:py-[1.35rem]",
                    i === 1 && "md:pl-6",
                    i === 2 && "md:pl-2",
                    i === 3 && "md:pl-10",
                  )}
                >
                  <span
                    className="pointer-events-none absolute left-0 top-1/2 hidden w-3 -translate-y-1/2 font-mono text-[9px] text-muted-foreground/50 md:block"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <motion.div
                    animate={{
                      x: preview ? 4 : 0,
                      opacity: preview ? 1 : 0.55,
                    }}
                    transition={opacityTween}
                    className="border-b border-transparent pb-1"
                    style={{
                      borderColor: preview ? "color-mix(in oklab, var(--primary) 45%, transparent)" : "transparent",
                    }}
                  >
                    <span className="meta-mono text-[10px] text-primary/90">{o.short}</span>
                    <span className="mt-1 block font-display text-lg font-semibold tracking-[-0.02em] text-foreground md:text-xl">
                      {o.label}
                    </span>
                    <span className="mt-1.5 block max-w-[28ch] text-[13px] leading-snug text-muted-foreground">{o.examples}</span>
                  </motion.div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export function UseCases() {
  return (
    <section className="hairline-t bg-gradient-to-b from-secondary/55 via-background to-background px-6 py-24">
      <div className="relative mx-auto max-w-[1240px] overflow-visible">
        <div
          className="pointer-events-none absolute -left-[12%] top-0 h-[min(520px,70vh)] w-[min(520px,55vw)] rounded-full opacity-90 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, oklch(0.4 0.09 146 / 0.18), transparent 62%)",
          }}
        />
        <div
          className="pointer-events-none absolute -right-[8%] bottom-0 h-[min(420px,55vh)] w-[min(440px,48vw)] rounded-full opacity-90 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 55% 55%, oklch(0.62 0.2 35 / 0.15), transparent 65%)",
          }}
        />

        <Reveal>
          <div className="relative grid grid-cols-12 items-end gap-x-8 pb-12 hairline-b">
            <div className="col-span-12 lg:col-span-7 xl:col-span-6">
              <p className="meta-mono mb-3 text-primary">Looks good where?</p>
              <h2 className="font-display text-[44px] font-semibold leading-[1.03] tracking-[-0.02em] text-foreground md:text-[56px]">
                Same canvas.
                <br />
                <span className="text-primary">Different homework.</span>
              </h2>
            </div>
            <div className="col-span-12 mt-8 max-w-md text-[14px] leading-relaxed text-muted-foreground lg:col-span-5 xl:col-span-4 lg:mt-0 lg:justify-self-end">
              One editor for journal figures, posters, slides, and grants. Each preview matches the format label beside it.
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="relative mt-4 lg:mt-10">
            <PublishingWorkspace />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
