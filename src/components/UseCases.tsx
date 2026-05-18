"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/Reveal";
import { useEffectiveReducedMotion } from "@/components/MotionPreference";
import { cn } from "@/lib/utils";

type OutputId = "journal" | "poster" | "slides" | "grant";

const OUTPUTS: {
  id: OutputId;
  headline: string;
  examples: string;
}[] = [
  {
    id: "journal",
    headline: "Journal figures",
    examples: "Nature · Cell · Science · eLife",
  },
  {
    id: "poster",
    headline: "Conference posters",
    examples: "ASCB · SfN · ESHG",
  },
  {
    id: "slides",
    headline: "Presentation slides",
    examples: "Lab meetings · Symposia · Project presentations",
  },
  {
    id: "grant",
    headline: "Grant proposals",
    examples: "NIH · ERC · Wellcome · NSF",
  },
];

/** Inline schematic — MAPK relay ending at nuclear ERK (journal / slide reuse). */
function MapkCascadeMini({ className }: { className?: string }) {
  const gid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 88" className={cn("text-neutral-800", className)} aria-hidden preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id={`mk-arr-${gid}`} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor" opacity="0.45" />
        </marker>
      </defs>
      <text x="100" y="14" fontSize="8" fontWeight="600" textAnchor="middle" fill="currentColor" opacity="0.42">
        MAPK signalling cascade
      </text>
      <line x1="14" x2="186" y1="42" y2="42" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.1" strokeDasharray="3 3" />
      <text x="22" y="38" fontSize="6.5" opacity="0.48">
        plasma membrane
      </text>
      {[
        { x: 26, lab: "RTK" },
        { x: 62, lab: "RAS" },
        { x: 98, lab: "RAF→MEK" },
        { x: 138, lab: "ERK" },
        { x: 172, lab: "nucleus" },
      ].map((s, i, arr) => (
        <g key={s.lab}>
          <circle cx={s.x} cy="62" r="11" fill="currentColor" fillOpacity={i === 4 ? 0.07 : 0.09} stroke="currentColor" strokeOpacity={0.42} strokeWidth="1" />
          <text x={s.x} y="65" fontSize="7" fontWeight="700" textAnchor="middle" fill="currentColor" opacity={0.82}>
            {s.lab}
          </text>
          {i < arr.length - 1 && (
            <path
              d={`M ${s.x + 11} 62 L ${arr[i + 1].x - 11} 62`}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.38}
              strokeWidth="1.2"
              markerEnd={`url(#mk-arr-${gid})`}
              vectorEffect="nonScalingStroke"
            />
          )}
        </g>
      ))}
    </svg>
  );
}

/** Compact western-style strip — four lanes. */
function WesternStripMini({ className }: { className?: string }) {
  const lanes = [22, 58, 94, 130];
  const bands = [
    { x: 22, y: 28, w: 28, h: 6.5, o: 0.88 },
    { x: 22, y: 38, w: 28, h: 6.5, o: 0.72 },
    { x: 58, y: 30, w: 28, h: 6.5, o: 0.81 },
    { x: 58, y: 41, w: 28, h: 6.5, o: 0.36 },
    { x: 94, y: 32, w: 28, h: 6.5, o: 0.76 },
    { x: 94, y: 43, w: 28, h: 6.5, o: 0.28 },
    { x: 130, y: 29, w: 28, h: 6.5, o: 0.69 },
    { x: 130, y: 40, w: 28, h: 6.5, o: 0.52 },
  ];
  return (
    <svg viewBox="0 0 180 76" className={cn("text-neutral-900", className)} aria-hidden preserveAspectRatio="xMidYMid meet">
      <text x="10" y="16" fontSize="8" fontWeight="700" fill="currentColor" opacity="0.48">
        IB: pERK · tERK · GAPDH
      </text>
      <rect x="12" y="22" width="156" height="40" rx="1.5" fill="none" stroke="currentColor" strokeOpacity={0.22} strokeWidth="0.9" />
      {lanes.map((lx) => (
        <line key={lx} x1={lx} x2={lx} y1="28" y2="58" stroke="currentColor" strokeOpacity={0.14} strokeWidth="0.75" vectorEffect="nonScalingStroke" />
      ))}
      {bands.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="0.8" fill="currentColor" fillOpacity={b.o} />
      ))}
      <text x="12" y="72" fontSize="7" fill="currentColor" opacity="0.45">
        serum-starved ± PMA · N = 6 mice per group
      </text>
    </svg>
  );
}

/** Poster column miniature diagram placeholder. */
function PosterMiniDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 72" className={cn("text-neutral-700", className)} aria-hidden preserveAspectRatio="xMidYMid meet">
      <rect x="10" y="18" width="100" height="46" rx="3" fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.35} strokeWidth="1" />
      <path d="M 28 52 L 52 34 L 74 46 L 92 30" fill="none" stroke="currentColor" strokeOpacity={0.45} strokeWidth="2" strokeLinecap="round" />
      <circle cx="52" cy="34" r="5" fill="currentColor" fillOpacity={0.18} />
      <circle cx="74" cy="46" r="5" fill="currentColor" fillOpacity={0.14} />
      <text x="60" y="14" fontSize="7" fontWeight="700" textAnchor="middle" fill="currentColor" opacity="0.55">
        dose–response schematic
      </text>
    </svg>
  );
}

/** Grant inset — tight BBB cartoon for floated figure. */
function GrantInsetMicrograph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 72" className={cn("text-neutral-900", className)} aria-hidden preserveAspectRatio="xMidYMid meet">
      <rect x="8" y="22" width="22" height="34" rx="2" fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.4} strokeWidth="0.9" />
      <text x="19" y="18" fontSize="6.5" fontWeight="700" textAnchor="middle" fill="currentColor" opacity="0.55">
        lumen
      </text>
      <line x1="34" x2="34" y1="18" y2="58" stroke="currentColor" strokeOpacity={0.55} strokeWidth="1.6" vectorEffect="nonScalingStroke" />
      <circle cx="46" cy="40" r="8" fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeOpacity={0.45} strokeWidth="0.85" />
      <rect x="60" y="24" width="28" height="30" rx="2" fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.28} strokeWidth="0.7" strokeDasharray="3 2.5" />
      <text x="74" y="41" fontSize="6.5" fontWeight="600" textAnchor="middle" fill="currentColor" opacity={0.42}>
        parenchyma
      </text>
      <text x="48" y="68" fontSize="6" textAnchor="middle" fill="currentColor" opacity="0.48">
        transcytosis route (Fig. 1)
      </text>
    </svg>
  );
}

function JournalFigurePlate() {
  return (
    <div className="pointer-events-none flex h-full min-h-0 w-full bg-[#fafaf8] text-neutral-900">
      {/* Column rule — implies two-column journal page */}
      <div className="flex min-h-0 flex-1 border-l border-neutral-300/90 pl-[7%] pr-[8%] pt-[6%] pb-[5%]">
        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-4">
          <div className="flex min-h-0 flex-1 gap-[3%] lg:min-h-[260px]">
            <div className="relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[2px] border border-neutral-400/55 bg-white px-2 pb-2 pt-7 shadow-[inset_0_0_0_1px_rgba(255,255,255,1)] sm:px-3 sm:pb-3 sm:pt-8">
              <span className="absolute left-2 top-2 font-sans text-[clamp(12px,2.2vw,15px)] font-black leading-none sm:left-3 sm:top-2.5">
                a
              </span>
              <div className="flex min-h-0 flex-1 items-stretch justify-center py-1 sm:py-2">
                <MapkCascadeMini className="h-full w-full max-h-none min-h-[140px] object-contain object-center sm:min-h-[180px] lg:min-h-[220px]" />
              </div>
            </div>
            <div className="relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[2px] border border-neutral-400/55 bg-white px-2 pb-2 pt-7 sm:px-3 sm:pb-3 sm:pt-8">
              <span className="absolute left-2 top-2 font-sans text-[clamp(12px,2.2vw,15px)] font-black leading-none sm:left-3 sm:top-2.5">
                b
              </span>
              <div className="flex min-h-0 flex-1 items-stretch justify-center py-1 sm:py-2">
                <WesternStripMini className="h-full w-full max-h-none min-h-[140px] object-contain object-center sm:min-h-[180px] lg:min-h-[220px]" />
              </div>
            </div>
          </div>
          <p
            className="max-w-[92%] shrink-0 font-[Georgia,Cambria,'Times_New_Roman',Times,serif] text-[clamp(11px,1.85vw,13px)] leading-[1.45] italic text-neutral-700"
            style={{ fontFeatureSettings: '"liga" 1' }}
          >
            Fig. 2 | MAPK signalling downstream of RAS anchors stimulus-dependent ERK phosphorylation in lung epithelial spheroids.
            Immunoblots representative of three biological replicates (N = 6 mice per group; Holm–Šídák vs vehicle).
          </p>
        </div>
      </div>
    </div>
  );
}

function ConferencePosterPlate() {
  return (
    <div className="pointer-events-none flex h-full min-h-0 w-full items-center justify-center bg-[#e9e6df] p-[4%] font-sans text-neutral-900">
      {/* ISO A-series landscape ratio (~√2 wide); pinned to artboard height */}
      <div className="flex max-h-full w-full max-w-[calc(100%-8px)] flex-col overflow-hidden rounded-[3px] border border-neutral-900/15 bg-white shadow-[0_12px_28px_rgba(28,25,23,0.14)] aspect-[1000/707]">
        <header className="shrink-0 border-b-[3px] border-primary px-[4%] py-[3.5%]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="hidden h-9 w-9 shrink-0 rounded-sm border border-neutral-800/25 bg-muted/60 sm:block" aria-hidden />
                <div className="min-w-0">
                  <p className="text-[clamp(11px,2.4vw,18px)] font-black uppercase leading-[1.05] tracking-[0.04em] text-neutral-950">
                    Spatial cytokine gradients in airway-on-a-chip
                  </p>
                  <p className="mt-[1.5%] text-[clamp(9px,1.9vw,12px)] font-semibold leading-snug text-neutral-700">
                    J. Okonkwo · M. Reyes · Pulmonary Engineering Laboratory · Midwest ASM Satellite 2026
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden h-10 w-[72px] shrink-0 rounded-sm border border-dashed border-neutral-400 bg-muted/40 text-[8px] font-bold uppercase leading-tight tracking-wider text-muted-foreground sm:flex sm:items-center sm:justify-center">
              logo
            </div>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-3 gap-[3%] px-[4%] py-[4%]">
          {[
            {
              title: "Introduction",
              body: "Patient-derived airway epithelia retain innate immune signalling when perfused under physiologic shear.",
              hint: "Hypothesis: IL-8 folds correlate with mucus plaque geometry.",
            },
            {
              title: "Methods",
              body: "Microfabricated wells · air–liquid interface · multiplex bead assay every 12 h.",
              hint: "N = 9 donors · paired chips · blinded imaging.",
            },
            {
              title: "Results",
              body: "Steep IL-8 fronts precede ciliary dysfunction measured by particle clearance videos.",
              hint: "Peak gradient precedes MCC drop by ~36 h.",
            },
          ].map((col) => (
            <div key={col.title} className="flex min-h-0 flex-col gap-[3%] border-r border-neutral-200 pr-[4%] last:border-r-0 last:pr-0">
              <h3 className="border-b border-primary/35 pb-[2%] text-[clamp(10px,2vw,13px)] font-extrabold uppercase tracking-[0.06em] text-primary">
                {col.title}
              </h3>
              <p className="text-[clamp(8px,1.65vw,11px)] leading-[1.38] text-neutral-800">{col.body}</p>
              <div className="mt-auto flex min-h-0 flex-1 items-center justify-center rounded-[2px] border border-neutral-300/90 bg-neutral-50/90 p-[4%]">
                <PosterMiniDiagram className="max-h-[min(108px,28svh)] w-full" />
              </div>
              <p className="text-[clamp(7px,1.45vw,10px)] leading-snug text-neutral-600">{col.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideDeckPlate() {
  return (
    <div className="pointer-events-none flex h-full min-h-0 w-full items-center justify-center bg-neutral-950/92 p-[5%]">
      <div className="relative flex aspect-video w-full max-h-full flex-col overflow-hidden rounded-md border border-white/12 bg-[linear-gradient(165deg,oklch(0.22_0.06_146)_0%,oklch(0.14_0.03_260)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="pointer-events-none h-1 w-full shrink-0 bg-primary/85" aria-hidden />

        <div className="shrink-0 px-[6%] pb-1 pt-[5%] sm:pt-[6%]">
          <h2 className="font-display text-[clamp(14px,3.6vw,26px)] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
            Checkpoint holds before ERK commits
          </h2>
        </div>

        {/* Figure region: consumes middle space only; bullets sit in footer row so they never collide */}
        <div className="flex min-h-0 flex-1 items-center px-[8%] pb-2 pt-1">
          <div className="flex h-full max-h-[min(100%,320px)] w-full items-center justify-center rounded-sm border border-white/14 bg-white/[0.04] px-[4%] py-[3%] sm:max-h-[min(100%,380px)]">
            <MapkCascadeMini className="h-full w-full text-white opacity-[0.92]" />
          </div>
        </div>

        <div className="flex shrink-0 items-end justify-between gap-4 border-t border-white/[0.07] px-[6%] pb-[4%] pt-3 sm:pb-[5%] sm:pt-3.5">
          <ul className="max-w-[58%] space-y-1.5 text-[clamp(9px,1.85vw,12px)] leading-relaxed text-white/80">
            <li className="flex gap-2">
              <span className="shrink-0 font-semibold text-primary/95">•</span>
              <span>Single-branch MAPK schematic keeps the story legible from the back row.</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 font-semibold text-primary/95">•</span>
              <span>N = 6 mice per group for phospho-ERK time-course.</span>
            </li>
          </ul>
          <span className="shrink-0 self-end font-mono text-[clamp(9px,1.8vw,11px)] tabular-nums text-white/55">3 / 12</span>
        </div>
      </div>
    </div>
  );
}

function GrantPackagePlate() {
  return (
    <div
      className="pointer-events-none relative h-full min-h-0 w-full overflow-hidden bg-[#fcfcfb] px-[8%] pb-[7%] pt-[8%] text-neutral-950"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <header className="border-b border-neutral-900 pb-[3%]">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-900">Research Strategy — Significance</p>
      </header>

      <div className="flow-root pt-[4%]">
        <figure className="float-right mb-[3%] ml-[5%] mt-[1%] w-[38%] max-w-[220px] rounded-sm border border-neutral-900/25 bg-white p-[3%] shadow-sm">
          <GrantInsetMicrograph className="mx-auto h-auto w-full" />
          <figcaption className="mt-[4%] text-center text-[9px] leading-snug text-neutral-700">
            Fig. 1 · Blood–brain barrier transcytosis axis referenced in Aim 2.
          </figcaption>
        </figure>

        <p className="text-[11px] leading-[1.38] text-neutral-950">
          Specific Aim 1: Establish how inflammatory signalling reshapes transcytosis rates across cortical vs cerebellar microvessels using
          tracer PET paired with single-vessel RNA maps from archival cohorts (N = 6 mice per group per region).
        </p>
        <p className="mt-[3.5%] text-[11px] leading-[1.38] text-neutral-950">
          Aim 2 tests whether pharmacologic tightening of junction belts lowers macromolecule penetrance without collapsing baseline perfusion —
          reviewers asked for this distinction explicitly during the prior submission cycle.
        </p>
        <p className="mt-[3.5%] text-[11px] leading-[1.38] text-neutral-950">
          Preliminary data show divergent uptake fingerprints between laminar arterioles and capillary beds; the significance paragraph ties those
          curves to clinically observed dosing plateaus for CNS biologics.
        </p>
      </div>

      <p className="pointer-events-none absolute bottom-[5%] left-0 right-0 text-center text-[11px] tabular-nums text-neutral-700">
        6
      </p>
    </div>
  );
}

function FormatPreviewPlate({ mode }: { mode: OutputId }) {
  switch (mode) {
    case "journal":
      return <JournalFigurePlate />;
    case "poster":
      return <ConferencePosterPlate />;
    case "slides":
      return <SlideDeckPlate />;
    case "grant":
      return <GrantPackagePlate />;
  }
}

function FormatPreviewLayer({ display, reduced }: { display: OutputId; reduced: boolean }) {
  const morph = useMemo(
    () => ({
      duration: reduced ? 0.06 : 0.18,
      ease: [0.4, 0, 0.2, 1] as readonly [number, number, number, number],
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
          initial={reduced ? false : { opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
          transition={{
            duration: morph.duration,
            ease: [...morph.ease] as unknown as [number, number, number, number],
          }}
        >
          <FormatPreviewPlate mode={display} />
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

  const tabMotion = useMemo(
    () => ({ duration: reduced ? 0.06 : 0.18, ease: [0.4, 0, 0.2, 1] as const }),
    [reduced],
  );

  const meta = OUTPUTS.find((o) => o.id === display)!;

  const lockFormat = (id: OutputId) => {
    setActive(id);
    setHover(null);
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8" onMouseLeave={() => setHover(null)}>
      {/* Mobile: horizontal scroll tabs above artboard */}
      <div
        className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain pb-1 pt-0.5 [scrollbar-width:none] sm:[scrollbar-width:thin] lg:hidden [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border"
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
                "flex min-w-[180px] shrink-0 flex-col items-center rounded-md border border-border/70 bg-background/80 py-2.5 pl-3 pr-3 text-center shadow-sm backdrop-blur-[2px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                preview ? "border-l-[3px] border-l-primary bg-primary/[0.07]" : "border-l-[3px] border-l-transparent",
              )}
            >
              <span
                className={cn(
                  "meta-mono block text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-primary",
                )}
              >
                {o.headline}
              </span>
              <span className="mt-1 block font-sans text-[11px] leading-snug text-muted-foreground">{o.examples}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-x-12 lg:gap-y-0">
        {/* Desktop left rail — format labels */}
        <aside className="relative hidden shrink-0 lg:flex lg:w-[min(340px,34%)] lg:flex-col lg:justify-center">
          <div role="radiogroup" aria-label="Publishing output formats" className="flex flex-col gap-0">
            {OUTPUTS.map((o) => {
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
                    "group relative border-0 bg-transparent py-5 pl-5 pr-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "border-l-[3px]",
                    preview ? "border-l-primary" : "border-l-transparent hover:border-l-border",
                  )}
                >
                  <motion.div animate={{ opacity: preview ? 1 : 0.52 }} transition={tabMotion} className="pb-0.5">
                    <span
                      className={cn(
                        "font-display text-[17px] tracking-[-0.02em] text-foreground md:text-lg",
                        preview ? "font-semibold" : "font-medium",
                      )}
                    >
                      {o.headline}
                    </span>
                    <span className="mt-2 block text-[13px] leading-snug text-muted-foreground">{o.examples}</span>
                  </motion.div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right — artboard */}
        <div className="relative min-w-0 flex-1 lg:sticky lg:top-24 lg:z-10 lg:self-start">
          <div
            id={`${uid}-artboard`}
            aria-label={`Layout preview for ${meta.headline}`}
            className="relative mx-auto w-full overflow-hidden rounded-2xl border border-border/65 bg-muted/25 shadow-[0_28px_55px_-18px_rgba(28,25,23,0.28)]"
          >
            <div className="relative h-[min(280px,52svh)] w-full overflow-hidden sm:h-[380px] lg:h-[520px]">
              <FormatPreviewLayer display={display} reduced={reduced} />
            </div>
          </div>
        </div>
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
              <p className="meta-mono mb-3 text-primary">WHERE CAN I APPLY MY FIGURES?</p>
              <h2 className="font-display text-[44px] font-semibold leading-[1.03] tracking-[-0.02em] text-foreground md:text-[56px]">
                Same canvas.
                <br />
                <span className="text-primary">Different homework.</span>
              </h2>
            </div>
            <div className="col-span-12 mt-8 max-w-md text-[14px] leading-relaxed text-muted-foreground lg:col-span-5 xl:col-span-4 lg:mt-0 lg:justify-self-end">
              The editor is suited for everything from journal figures to grant applications.
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
