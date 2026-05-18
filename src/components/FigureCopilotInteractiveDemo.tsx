"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useEffectiveReducedMotion } from "@/components/MotionPreference";
import { VectorMascot } from "@/components/VectorMascot";

export type DemoMode = "creator" | "consultant";

type DemoProps = {
  /** Fires whenever the demo mode changes (tabs, prompts, hover on supported devices). */
  onModeChange?: (mode: DemoMode) => void;
};

function ModeButton({
  active,
  label,
  mode,
  onPick,
  onHoverPick,
}: {
  active: boolean;
  label: string;
  mode: DemoMode;
  onPick: (m: DemoMode) => void;
  onHoverPick: (m: DemoMode) => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      id={`vector-demo-tab-${mode}`}
      onClick={() => onPick(mode)}
      onMouseEnter={() => onHoverPick(mode)}
      onFocus={() => onHoverPick(mode)}
      className={cn(
        "rounded-md border px-2.5 py-1.5 text-center font-sans text-[11px] font-medium leading-tight transition-colors sm:text-[12px]",
        active
          ? "border-primary bg-primary/14 text-foreground shadow-[inset_0_0_0_1px_theme(colors.primary/0.35)]"
          : "border-border/90 bg-background/80 text-muted-foreground hover:border-primary/40 hover:bg-muted/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

/** Staggered pathway build: prompt → status → shapes appear in reading order. */
function CreatorFlow({
  patternId,
  reduced,
}: {
  patternId: string;
  reduced: boolean;
}) {
  const stagger = reduced ? 0 : 0.11;
  const child = reduced
    ? { opacity: 1, y: 0, scale: 1 }
    : { opacity: 0, y: 5, scale: 0.97 };

  return (
    <motion.div
      className="flex min-h-[280px] flex-1 flex-col bg-background px-4 pb-4 pt-4 sm:min-h-[300px]"
      initial={false}
    >
      <div className="mb-3 space-y-2 text-center">
        <motion.p
          className="meta-mono text-[11px] text-muted-foreground"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
        >
          Creator preview
        </motion.p>
        <motion.div
          className="mx-auto max-w-[280px] rounded-md border border-border/80 bg-muted/25 px-3 py-2 font-mono text-[10px] leading-snug text-foreground/85 sm:text-[11px]"
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.12 }}
        >
          <span className="text-primary">→ </span>
          Draw the MAPK signalling pathway.
        </motion.div>
        <motion.p
          className="text-[11px] font-medium text-primary"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.28, delay: reduced ? 0 : 0.45 }}
        >
          Adding shapes to canvas…
        </motion.p>
        <motion.p
          className="text-[12px] leading-snug text-muted-foreground"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 1.48 }}
        >
          Each piece lands as an object you can drag and edit.
        </motion.p>
      </div>

      <div className="flex flex-1 items-center justify-center px-2 pb-2">
        <motion.svg
          viewBox="0 0 280 206"
          className="mx-auto h-auto w-full max-w-[280px]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          initial={false}
        >
          <defs>
            <pattern id={patternId} width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" className="text-foreground/10" />
            </pattern>
          </defs>
          <motion.rect
            width="280"
            height="206"
            fill={`url(#${patternId})`}
            initial={{ opacity: reduced ? 1 : 0.35 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.55 }}
          />

          {/* Plasma membrane (lipid bilayer bands) */}
          <motion.g
            initial={child}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.62 + stagger * 0 }}
          >
            <rect x="48" y="14" width="184" height="5" rx="1" className="fill-amber-300/90 stroke-amber-500/50" strokeWidth="0.6" />
            <rect x="48" y="21" width="184" height="5" rx="1" className="fill-amber-200/85 stroke-amber-500/40" strokeWidth="0.6" />
          </motion.g>

          {/* EGFR + ligand */}
          <motion.g
            initial={child}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.62 + stagger * 1 }}
          >
            <path
              d="M 136 8 L 140 14 L 144 8 M 140 14 V 18"
              className="stroke-foreground/70"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <rect x="118" y="28" width="44" height="22" rx="9" className="fill-pink-400/35 stroke-pink-500/70" strokeWidth="1.2" />
            <text x="140" y="43" textAnchor="middle" className="fill-muted-foreground" style={{ font: "700 8px ui-sans-serif, system-ui" }}>
              EGFR
            </text>
          </motion.g>

          {/* Ras */}
          <motion.g
            initial={child}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.62 + stagger * 2 }}
          >
            <line x1="140" y1="52" x2="140" y2="58" className="stroke-foreground/65" strokeWidth="1.6" strokeLinecap="round" />
            <polygon points="140,62 136,56 144,56" className="fill-foreground/65" />
            <rect x="118" y="64" width="44" height="14" rx="3" className="fill-muted/90 stroke-border" strokeWidth="1" />
            <text x="140" y="74" textAnchor="middle" className="fill-muted-foreground" style={{ font: "600 7px ui-monospace, monospace" }}>
              Ras
            </text>
          </motion.g>

          {/* B-Raf */}
          <motion.g
            initial={child}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.62 + stagger * 3 }}
          >
            <line x1="140" y1="80" x2="140" y2="86" className="stroke-foreground/65" strokeWidth="1.6" strokeLinecap="round" />
            <polygon points="140,90 136,84 144,84" className="fill-foreground/65" />
            <rect x="114" y="92" width="52" height="15" rx="3" className="fill-sky-500/35 stroke-sky-600/65" strokeWidth="1" />
            <text x="140" y="103" textAnchor="middle" className="fill-muted-foreground" style={{ font: "600 7px ui-monospace, monospace" }}>
              B-Raf
            </text>
          </motion.g>

          {/* MEK1/2 */}
          <motion.g
            initial={child}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.62 + stagger * 4 }}
          >
            <line x1="140" y1="109" x2="140" y2="114" className="stroke-foreground/65" strokeWidth="1.6" strokeLinecap="round" />
            <polygon points="140,118 136,112 144,112" className="fill-foreground/65" />
            <ellipse cx="140" cy="128" rx="26" ry="11" className="fill-orange-400/45 stroke-orange-600/70" strokeWidth="1.1" />
            <text x="140" y="131" textAnchor="middle" className="fill-muted-foreground" style={{ font: "600 6px ui-monospace, monospace" }}>
              MEK1/2
            </text>
          </motion.g>

          {/* ERK1/2 + curved activation */}
          <motion.g
            initial={child}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.62 + stagger * 5 }}
          >
            <path
              d="M 164 130 Q 182 136 190 124"
              className="stroke-foreground/65"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
            <polygon points="192,122 188,127 194,128" className="fill-foreground/65" />
            <ellipse cx="208" cy="118" rx="24" ry="11" className="fill-yellow-300/55 stroke-yellow-600/65" strokeWidth="1.1" />
            <text x="208" y="121" textAnchor="middle" className="fill-muted-foreground" style={{ font: "600 6px ui-monospace, monospace" }}>
              ERK1/2
            </text>
          </motion.g>

          {/* Dashed translocation toward nucleus */}
          <motion.g
            initial={child}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.62 + stagger * 6 }}
          >
            <path
              d="M 208 132 V 148 Q 208 158 200 164"
              className="stroke-foreground/55"
              strokeWidth="1.6"
              strokeDasharray="3 3"
              fill="none"
              strokeLinecap="round"
            />
            <polygon points="198,166 202,160 204,166" className="fill-foreground/55" />
          </motion.g>

          {/* Nucleus + TF outputs */}
          <motion.g
            initial={child}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.62 + stagger * 7 }}
          >
            <circle cx="182" cy="172" r="34" className="fill-sky-400/18 stroke-sky-500/55" strokeWidth="1.2" />
            <path
              d="M 162 158 Q 168 154 174 158 Q 180 162 186 158 Q 192 154 198 158"
              className="stroke-violet-500/55"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 164 162 Q 170 158 176 162 Q 182 166 188 162 Q 194 158 200 162"
              className="stroke-violet-400/45"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse cx="166" cy="178" rx="12" ry="6" className="fill-emerald-400/40 stroke-emerald-700/45" strokeWidth="0.8" />
            <text x="166" y="180" textAnchor="middle" className="fill-muted-foreground" style={{ font: "600 4.5px ui-monospace, monospace" }}>
              c-Myc
            </text>
            <ellipse cx="182" cy="183" rx="10" ry="5.5" className="fill-muted/70 stroke-border" strokeWidth="0.8" />
            <text x="182" y="184.5" textAnchor="middle" className="fill-muted-foreground" style={{ font: "600 4.5px ui-monospace, monospace" }}>
              Ets
            </text>
            <ellipse cx="196" cy="178" rx="11" ry="6" className="fill-amber-200/70 stroke-amber-700/45" strokeWidth="0.8" />
            <text x="196" y="180" textAnchor="middle" className="fill-muted-foreground" style={{ font: "600 4.5px ui-monospace, monospace" }}>
              c-Jun
            </text>
            <ellipse cx="208" cy="183" rx="11" ry="6" className="fill-cyan-300/55 stroke-cyan-700/45" strokeWidth="0.8" />
            <text x="208" y="184.5" textAnchor="middle" className="fill-muted-foreground" style={{ font: "600 4.5px ui-monospace, monospace" }}>
              c-Fos
            </text>
            <text x="182" y="193" textAnchor="middle" className="fill-muted-foreground" style={{ font: "600 7px ui-monospace, monospace" }}>
              Nucleus
            </text>
          </motion.g>
        </motion.svg>
      </div>
    </motion.div>
  );
}

function ConsultantFlow({ reduced }: { reduced: boolean }) {
  const bullets = [
    "Lead with ligand–EGFR at the membrane so readers know where the story starts.",
    "If three arrows repeat the same step mid-diagram, trim to one clear cue for slides.",
  ];

  return (
    <motion.div
      className="flex min-h-[280px] flex-1 flex-col bg-background px-4 pb-4 pt-4 sm:min-h-[300px]"
      initial={false}
    >
      <div className="mb-3 space-y-2 text-center">
        <motion.p
          className="meta-mono text-[11px] text-muted-foreground"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
        >
          Consultant preview
        </motion.p>
        <motion.div
          className="mx-auto max-w-[280px] rounded-md border border-border/80 bg-muted/25 px-3 py-2 font-mono text-[10px] leading-snug text-foreground/85 sm:text-[11px]"
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.12 }}
        >
          Is the middle too busy for a slide?
        </motion.div>

        {/* Fades out before the reply card appears so “Thinking” does not run over the answer */}
        <motion.div
          className="flex min-h-[17px] items-center justify-center gap-1 text-[11px] font-medium text-primary"
          initial={reduced ? false : { opacity: 0 }}
          animate={
            reduced
              ? { opacity: 1 }
              : { opacity: [0, 1, 1, 0] }
          }
          transition={
            reduced
              ? { duration: 0 }
              : {
                  duration: 0.52,
                  times: [0, 0.12, 0.58, 0.92],
                  ease: "easeInOut",
                  delay: 0.42,
                }
          }
        >
          {!reduced && (
            <>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.85] }}
                transition={{ duration: 0.65, ease: "easeInOut", delay: 0.42 }}
              >
                Thinking
              </motion.span>
              <span aria-hidden className="inline-flex gap-0.5 pt-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="inline-block h-1 w-1 rounded-full bg-primary"
                    animate={{ opacity: [0.35, 1, 0.4], y: [0, -2, 0] }}
                    transition={{
                      duration: 0.55,
                      ease: "easeInOut",
                      delay: 0.48 + i * 0.1,
                    }}
                  />
                ))}
              </span>
            </>
          )}
          {reduced && <span>Reply ready</span>}
        </motion.div>
      </div>

      <motion.div
        className="hairline-box mx-auto mt-2 w-full max-w-[320px] flex-1 bg-background/95 p-4 font-sans text-[13px] leading-relaxed text-foreground/88 shadow-sm"
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.95 }}
      >
        <ul className="list-none space-y-3 pl-0">
          {bullets.map((text, i) => (
            <motion.li
              key={text}
              className="flex gap-2"
              initial={reduced ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: reduced ? 0 : 0.35,
                delay: reduced ? 0 : 1.08 + i * 0.22,
                ease: [0.22, 0.61, 0.36, 1],
              }}
            >
              <span className="font-mono text-primary">·</span>
              {text}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.p
        className="mt-4 text-center text-[12px] leading-snug text-muted-foreground"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 1.52 }}
      >
        Stays in the panel while you edit the canvas.
      </motion.p>
    </motion.div>
  );
}

export function FigureCopilotInteractiveDemo({ onModeChange }: DemoProps = {}) {
  const reduced = useEffectiveReducedMotion();
  const uid = useId().replace(/:/g, "");
  const patternId = `vector-demo-dots-${uid}`;

  const [mode, setMode] = useState<DemoMode>("creator");
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  const replay = useCallback((m: DemoMode) => {
    setMode(m);
    setRunKey((k) => k + 1);
  }, []);

  const onHoverPick = useCallback(
    (m: DemoMode) => {
      if (typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        if (m !== mode) replay(m);
      }
    },
    [mode, replay],
  );

  const onPick = useCallback(
    (m: DemoMode) => {
      replay(m);
    },
    [replay],
  );

  return (
    <div className="flex flex-col gap-0 lg:flex-row">
      <div className="flex min-h-[200px] w-full shrink-0 flex-col border-b border-border bg-muted/25 lg:max-w-[min(100%,280px)] lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-center gap-3 border-b border-border/70 px-3 py-2.5">
          <VectorMascot assistantMode={mode} size={46} tone="editor" interactive className="shrink-0" />
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Vector</p>
        </div>

        <div
          className="flex flex-col items-center gap-2 border-b border-border/50 px-3 py-3"
          role="tablist"
          aria-label="Vector demo modes"
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            <ModeButton
              mode="creator"
              label="Creator mode"
              active={mode === "creator"}
              onPick={onPick}
              onHoverPick={onHoverPick}
            />
            <ModeButton
              mode="consultant"
              label="Consultant mode"
              active={mode === "consultant"}
              onPick={onPick}
              onHoverPick={onHoverPick}
            />
          </div>
          <p className="max-w-[240px] text-center text-[10px] leading-snug text-muted-foreground">Hover to demonstrate.</p>
        </div>

        <div className="flex flex-1 flex-col p-3">
          <p className="meta-mono mb-2 text-center text-[11px] text-muted-foreground">Sample prompts</p>
          <div className="space-y-2">
            <button
              type="button"
              className={cn(
                "hairline-box w-full p-2.5 text-center font-sans text-[12px] leading-relaxed transition-colors",
                mode === "creator"
                  ? "bg-primary/10 text-foreground ring-1 ring-primary/30"
                  : "bg-background/90 text-foreground/88 hover:bg-accent/40",
              )}
              onClick={() => onPick("creator")}
              onMouseEnter={() => onHoverPick("creator")}
            >
              Creator: Draw the MAPK signalling pathway.
            </button>
            <button
              type="button"
              className={cn(
                "hairline-box w-full p-2.5 text-center font-sans text-[12px] leading-relaxed transition-colors",
                mode === "consultant"
                  ? "bg-primary/10 text-foreground ring-1 ring-primary/30"
                  : "bg-background/90 text-foreground/88 hover:bg-accent/40",
              )}
              onClick={() => onPick("consultant")}
              onMouseEnter={() => onHoverPick("consultant")}
            >
              Consultant: Is the middle too busy for a slide?
            </button>
          </div>
        </div>
      </div>

      <div
        className="relative min-h-[280px] flex-1 overflow-hidden sm:min-h-[300px]"
        role="tabpanel"
        aria-labelledby={`vector-demo-tab-${mode}`}
      >
        <AnimatePresence mode="wait">
          {mode === "creator" ? (
            <CreatorFlow key={`creator-${runKey}`} patternId={patternId} reduced={reduced} />
          ) : (
            <ConsultantFlow key={`consultant-${runKey}`} reduced={reduced} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
