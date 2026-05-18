"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, useAnimationControls } from "motion/react";
import { cn } from "@/lib/utils";
import { useEffectiveReducedMotion } from "@/components/MotionPreference";

type Tone = "default" | "editor";

export type AssistantMode = "creator" | "consultant";

export type CognitionPose = "idle" | "thinking" | "suggesting";

type VectorMascotProps = {
  size?: number;
  busy?: boolean;
  speaking?: boolean;
  tone?: Tone;
  /**
   * Creator ≈ round cell; consultant ≈ wide oval (design sheet variations).
   * Creator shows a Golgi stack accent.
   */
  assistantMode?: AssistantMode;
  /** When set, overrides automatic pose from `busy` / `speaking`. */
  cognitionPose?: CognitionPose;
  interactive?: boolean;
  className?: string;
};

type PointerState = { nx: number; ny: number; prox: number };

const BLINK_MS = 90;

/** Palette: cream membrane, pink cytoplasm, forest organelles (design reference). */
const SAGE_EDGE = "#5c6b52";
const SAGE_MEMBRANE_HI = "#f5efe4";
const SAGE_MEMBRANE_MID = "#e0d4c4";
const SAGE_MEMBRANE_DEEP = "#c4b69f";
const CYTO_PINK = "#fce8ec";
const CYTO_DEEP = "#f5d4dc";
const ORG_GREEN = "#4a6b52";
const ORG_GREEN_L = "#6d8f72";
const ORG_GREEN_D = "#2f4a38";
const NUCL_MEMB = "#d4b8c8";
const NUCL_FILL = "#ecd8e4";
const ORG_GREY = "#7a8585";
const ACCENT_FG = "#1a3d2e";
const ACCENT_FG_L = "#2d5244";

function nextBlinkSchedule(): number {
  return 5200 + Math.random() * 7200;
}

/**
 * Creator: standard round cell (variation 1 — stable, symmetric).
 * Consultant: horizontal oval (variation 3 — wide, low profile).
 * Same segment structure so `motion.path` can interpolate `d`.
 */
const PATH_BODY_CREATOR = `
  M 52 18
  C 41 17 29 26 23 41
  C 17 56 26 76 52 82
  C 74 76 83 56 82 41
  C 76 24 63 17 52 18
  Z
`.replace(/\s+/g, " ").trim();

const PATH_BODY_CONSULTANT = `
  M 52 21
  C 36 19 22 30 18 44
  C 15 58 26 78 52 82
  C 78 78 89 58 86 44
  C 89 30 68 20 52 21
  Z
`.replace(/\s+/g, " ").trim();

const PATH_SHEEN_CREATOR = "M 34 38 Q 52 26 69 41";
const PATH_SHEEN_CONSULTANT = "M 30 39 Q 52 27 72 42";

/** Expressions (consultant “reasoning” / “suggesting” references). */
const MOUTH_NEUTRAL = "M 41.5 71 Q 52 75.5 61.8 71";
const MOUTH_HOVER = "M 41 70.5 Q 52 76 62.5 70";
const MOUTH_BUSY = "M 43 71.5 Q 52 74 61 71.5";
const MOUTH_THINKING = "M 44 72.5 Q 52 69.5 60 72.5";
const MOUTH_SUGGESTING = "M 41 69.5 Q 52 77 63 69.5";

const LIMB_STROKE = "#8fb88f";
const LIMB_FILL = "#c6e0c6";

const morphTransition = { duration: 0.38, ease: [0.4, 0, 0.2, 1] as const };

/** One-shot hover jump; springs back (fires on every pointer enter). */
const hoverJumpTransition = {
  duration: 0.36,
  times: [0, 0.38, 1] as [number, number, number],
  ease: [0.26, 0.84, 0.37, 1] as [number, number, number, number],
};

export function VectorMascot({
  size = 48,
  busy = false,
  speaking = false,
  tone = "default",
  assistantMode = "creator",
  cognitionPose,
  interactive = true,
  className,
}: VectorMascotProps) {
  const reduced = useEffectiveReducedMotion();
  const editor = tone === "editor";

  const pose: CognitionPose =
    cognitionPose ?? (busy ? "thinking" : speaking ? "suggesting" : "idle");
  const thinking = pose === "thinking";
  const suggesting = pose === "suggesting";

  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<PointerState>({ nx: 0, ny: 0, prox: 0 });
  const blinkEndRef = useRef<number | null>(null);
  const blinkScheduleRef = useRef<number | null>(null);

  const [pointer, setPointer] = useState<PointerState>({ nx: 0, ny: 0, prox: 0 });
  const [blinkShut, setBlinkShut] = useState(false);
  const [hovered, setHovered] = useState(false);

  const rid = useId().replace(/:/g, "");
  const gradMembrane = `vector-membrane-${rid}`;
  const gradSheen = `vector-sheen-${rid}`;
  const clipCell = `vector-cell-clip-${rid}`;
  const isCreator = assistantMode === "creator";
  const bodyD = isCreator ? PATH_BODY_CREATOR : PATH_BODY_CONSULTANT;
  const sheenD = isCreator ? PATH_SHEEN_CREATOR : PATH_SHEEN_CONSULTANT;

  const jumpControls = useAnimationControls();
  const shadowControls = useAnimationControls();

  const pump = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setPointer(pendingRef.current);
    });
  }, []);

  useEffect(() => {
    if (!interactive || reduced) return;

    const handle = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(r.width * 2.8, 120);
      const prox = Math.max(0, Math.min(1, 1 - dist / reach));
      const cap = 0.85;
      const nx = Math.max(-cap, Math.min(cap, (dx / Math.max(r.width, 1)) * 0.85));
      const ny = Math.max(-cap, Math.min(cap, (dy / Math.max(r.height, 1)) * 0.85));
      pendingRef.current = { nx, ny, prox };
      pump();
    };

    window.addEventListener("pointermove", handle, { passive: true });
    return () => window.removeEventListener("pointermove", handle);
  }, [interactive, reduced, pump]);

  useEffect(() => {
    if (reduced) return;

    function scheduleBlink() {
      if (blinkScheduleRef.current != null) window.clearTimeout(blinkScheduleRef.current);
      blinkScheduleRef.current = window.setTimeout(() => {
        setBlinkShut(true);
        if (blinkEndRef.current != null) window.clearTimeout(blinkEndRef.current);
        blinkEndRef.current = window.setTimeout(() => {
          setBlinkShut(false);
          scheduleBlink();
        }, BLINK_MS);
      }, nextBlinkSchedule());
    }

    scheduleBlink();
    return () => {
      if (blinkScheduleRef.current != null) window.clearTimeout(blinkScheduleRef.current);
      if (blinkEndRef.current != null) window.clearTimeout(blinkEndRef.current);
    };
  }, [reduced]);

  const tiltDeg = interactive ? pointer.nx * (editor ? 2.25 : 3.25) + pointer.ny * (editor ? 0.65 : 0.9) : 0;
  const px = pointer.nx * (editor ? 0.85 : 1.05);
  const py = pointer.ny * (editor ? 0.78 : 0.95);
  const eyeScaleY = blinkShut ? 0.12 : 1;

  const talking = speaking && !reduced && suggesting;

  const mouthD =
    thinking
      ? MOUTH_THINKING
      : suggesting
        ? MOUTH_SUGGESTING
        : busy
          ? MOUTH_BUSY
          : hovered
            ? MOUTH_HOVER
            : MOUTH_NEUTRAL;

  const breathAmp = editor ? { sx: [1, 1.018, 1], sy: [1, 0.985, 1] } : { sx: [1, 1.024, 1], sy: [1, 0.98, 1] };
  const breathDur = editor ? 4.85 : 3.95;

  const onVectorEnter = useCallback(() => {
    if (!interactive) return;
    setHovered(true);
    if (!reduced) {
      void Promise.all([
        jumpControls.start({
          y: [0, -10, 0],
          transition: hoverJumpTransition,
        }),
        shadowControls.start({
          scaleX: [1, 0.68, 1],
          scaleY: [1, 0.62, 1],
          opacity: [0.9, 0.38, 0.9],
          transition: hoverJumpTransition,
        }),
      ]);
    }
  }, [interactive, reduced, jumpControls, shadowControls]);

  const onVectorLeave = useCallback(() => {
    if (interactive) setHovered(false);
  }, [interactive]);

  return (
    <div
      ref={rootRef}
      className={cn("vector-mascot relative inline-flex select-none", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Vector"
      onPointerEnter={interactive ? onVectorEnter : undefined}
      onPointerLeave={interactive ? onVectorLeave : undefined}
    >
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{
          rotate: tiltDeg,
        }}
        transition={{
          rotate: { type: "spring", stiffness: 140, damping: 20 },
        }}
        style={{ transformOrigin: "50% 55%" }}
      >
        <motion.div className="relative h-full w-full" animate={jumpControls} initial={{ y: 0 }}>
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
          <defs>
            <clipPath id={clipCell}>
              <motion.path
                d={bodyD}
                initial={false}
                animate={{ d: bodyD }}
                transition={morphTransition}
              />
            </clipPath>
            <radialGradient id={gradMembrane} cx="38%" cy="30%" r="82%">
              <stop offset="0%" stopColor={SAGE_MEMBRANE_HI} stopOpacity={0.34} />
              <stop offset="38%" stopColor={SAGE_MEMBRANE_MID} stopOpacity={0.42} />
              <stop offset="72%" stopColor={SAGE_MEMBRANE_DEEP} stopOpacity={0.38} />
              <stop offset="100%" stopColor={SAGE_EDGE} stopOpacity={0.36} />
            </radialGradient>
            <linearGradient id={gradSheen} x1="28%" y1="22%" x2="82%" y2="88%">
              <stop offset="0%" stopColor="#fffef8" stopOpacity={0.52} />
              <stop offset="40%" stopColor="#fffef8" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#fffef8" stopOpacity={0} />
            </linearGradient>
            <radialGradient id={`vector-nucleus-${rid}`} cx="40%" cy="40%" r="72%">
              <stop offset="0%" stopColor={NUCL_FILL} stopOpacity={0.95} />
              <stop offset="72%" stopColor={NUCL_MEMB} stopOpacity={0.88} />
              <stop offset="100%" stopColor="#b89aac" stopOpacity={0.75} />
            </radialGradient>
          </defs>

          <motion.g
            style={{ transformOrigin: "52px 55px" }}
            initial={false}
            animate={reduced ? { scaleX: 1, scaleY: 1 } : { scaleX: breathAmp.sx, scaleY: breathAmp.sy }}
            transition={{ duration: breathDur, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Cytoplasm + organelles — distinct layouts per mode (reference: nucleus/mitochondria shift). */}
            <g clipPath={`url(#${clipCell})`} className="pointer-events-none">
              <motion.g
                initial={false}
                animate={{ opacity: isCreator ? 1 : 0 }}
                transition={morphTransition}
              >
                <ellipse cx={52} cy={56} rx={31} ry={29} fill={CYTO_PINK} opacity={0.92} />
                <ellipse cx={48} cy={54} rx={23} ry={24} fill={CYTO_DEEP} opacity={0.38} />

                <path
                  d="M 28 48 C 38 44 44 52 52 48 S 66 40 74 46 M 30 58 C 40 54 48 62 56 57 S 68 52 76 58 M 34 38 C 42 36 50 42 58 38"
                  fill="none"
                  stroke={ORG_GREEN_L}
                  strokeOpacity={0.55}
                  strokeWidth={0.95}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <g opacity={0.92}>
                  <ellipse cx={38} cy={62} rx={6.5} ry={3.8} fill={ORG_GREEN} transform="rotate(-28 38 62)" />
                  <path
                    d="M 35.5 61.5 Q 38 59.8 40.5 61.5"
                    fill="none"
                    stroke={ORG_GREEN_D}
                    strokeOpacity={0.55}
                    strokeWidth={0.55}
                    strokeLinecap="round"
                    transform="rotate(-28 38 62)"
                  />
                  <ellipse cx={64} cy={56} rx={5.8} ry={3.4} fill={ORG_GREEN} transform="rotate(18 64 56)" />
                  <ellipse cx={56} cy={68} rx={4.5} ry={2.7} fill={ORG_GREEN_D} opacity={0.85} transform="rotate(8 56 68)" />
                </g>

                <circle cx={50} cy={44} r={10} fill={`url(#vector-nucleus-${rid})`} stroke={NUCL_MEMB} strokeWidth={0.55} opacity={0.97} />
                <circle cx={50} cy={44} r={7.2} fill="none" stroke="#c9a8b8" strokeWidth={0.4} strokeOpacity={0.65} />
                <path
                  d="M 46 41.5 Q 48.5 43.5 47 46 M 52 41 Q 50.5 44.5 52.5 45.5"
                  fill="none"
                  stroke="#a08092"
                  strokeOpacity={0.45}
                  strokeWidth={0.45}
                  strokeLinecap="round"
                />

                <circle cx={72} cy={64} r={2.2} fill={ORG_GREEN_L} opacity={0.85} />
                <circle cx={34} cy={48} r={1.8} fill={ORG_GREEN_L} opacity={0.7} />
                <ellipse cx={58} cy={72} rx={3.1} ry={2.2} fill={ORG_GREY} opacity={0.55} transform="rotate(-12 58 72)" />
              </motion.g>

              <motion.g
                initial={false}
                animate={{ opacity: isCreator ? 0 : 1 }}
                transition={morphTransition}
              >
                <ellipse cx={51} cy={56} rx={34} ry={27} fill={CYTO_PINK} opacity={0.9} />
                <ellipse cx={46} cy={55} rx={20} ry={22} fill={CYTO_DEEP} opacity={0.34} />

                <path
                  d="M 20 52 C 28 46 34 54 42 48 M 22 62 C 32 56 40 66 50 60 M 24 40 C 32 38 40 44 48 40"
                  fill="none"
                  stroke={ORG_GREEN_L}
                  strokeOpacity={0.52}
                  strokeWidth={0.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <g opacity={0.9}>
                  <ellipse cx={32} cy={58} rx={6} ry={3.6} fill={ORG_GREEN} transform="rotate(-35 32 58)" />
                  <ellipse cx={38} cy={72} rx={5.5} ry={3.2} fill={ORG_GREEN} transform="rotate(8 38 72)" />
                  <ellipse cx={70} cy={61} rx={5.2} ry={3} fill={ORG_GREEN_D} opacity={0.88} transform="rotate(22 70 61)" />
                  <path
                    d="M 29 57.5 Q 32 56 34 57.5"
                    fill="none"
                    stroke={ORG_GREEN_D}
                    strokeOpacity={0.5}
                    strokeWidth={0.5}
                    strokeLinecap="round"
                    transform="rotate(-35 32 58)"
                  />
                </g>

                <circle cx={43} cy={40.5} r={9.5} fill={`url(#vector-nucleus-${rid})`} stroke={NUCL_MEMB} strokeWidth={0.55} opacity={0.97} />
                <circle cx={43} cy={40.5} r={6.8} fill="none" stroke="#c9a8b8" strokeWidth={0.4} strokeOpacity={0.65} />
                <path
                  d="M 39.5 38.5 Q 41.5 40.5 40 42.5"
                  fill="none"
                  stroke="#a08092"
                  strokeOpacity={0.45}
                  strokeWidth={0.45}
                  strokeLinecap="round"
                />

                <circle cx={34} cy={46} r={1.7} fill={ORG_GREEN_L} opacity={0.72} />
                <circle cx={74} cy={58} r={2.1} fill={ORG_GREEN_L} opacity={0.82} />
                <ellipse cx={54} cy={73} rx={3.4} ry={2.4} fill={ORG_GREY} opacity={0.52} transform="rotate(-8 54 73)" />
              </motion.g>
            </g>

            <motion.path
              d={bodyD}
              fill={`url(#${gradMembrane})`}
              stroke={SAGE_EDGE}
              strokeOpacity={0.58}
              strokeWidth={1.35}
              strokeLinejoin="round"
              initial={false}
              animate={{ d: bodyD }}
              transition={morphTransition}
            />

            {/* Cream membrane highlight (under Golgi so the stack stays crisp) */}
            <motion.path
              d={sheenD}
              fill="none"
              stroke={`url(#${gradSheen})`}
              strokeWidth={4.2}
              strokeLinecap="round"
              className="pointer-events-none opacity-[0.85]"
              initial={false}
              animate={{ d: sheenD }}
              transition={morphTransition}
            />
            <circle
              cx={36}
              cy={34}
              r={3.2}
              fill="#fffef8"
              fillOpacity={0.42}
              className="pointer-events-none"
            />
            <circle cx={69} cy={40} r={2} fill="#fffef8" fillOpacity={0.26} className="pointer-events-none" />

            {/* Creator — Golgi stack (processing, packaging, building the figure) */}
            <motion.g
              initial={false}
              animate={{ opacity: isCreator ? 1 : 0 }}
              transition={morphTransition}
              className="pointer-events-none"
              style={{ transformOrigin: "52px 20px" }}
            >
              <path
                d="M 38 26 C 44 22 60 22 66 26"
                fill="none"
                stroke={ACCENT_FG}
                strokeOpacity={0.88}
                strokeWidth={1.65}
                strokeLinecap="round"
              />
              <path
                d="M 40 21 C 46 17 58 17 64 21"
                fill="none"
                stroke={ACCENT_FG_L}
                strokeOpacity={0.78}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              <path
                d="M 42 16 C 48 12.5 56 12.5 62 16"
                fill="none"
                stroke={ACCENT_FG}
                strokeOpacity={0.72}
                strokeWidth={1.35}
                strokeLinecap="round"
              />
              <circle cx={63} cy={14} r={1.25} fill={ACCENT_FG_L} fillOpacity={0.5} />
              <circle cx={41} cy={18} r={1} fill={ACCENT_FG_L} fillOpacity={0.4} />
            </motion.g>

            {thinking && !reduced ? (
              <g className="pointer-events-none" aria-hidden>
                <motion.g
                  initial={false}
                  animate={{ y: [0, -1.8, 0], opacity: [0.82, 1, 0.82] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <circle cx={44} cy={12} r={1.5} fill="#faf8f4" opacity={0.9} />
                  <circle cx={49} cy={9.5} r={1.9} fill="#faf8f4" opacity={0.95} />
                  <circle cx={54} cy={12} r={1.5} fill="#faf8f4" opacity={0.9} />
                </motion.g>
                <motion.g
                  style={{ transformOrigin: "40px 68px" }}
                  initial={false}
                  animate={{ rotate: [0, -5, 0, 4.5, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path
                    d="M 22 71 Q 32 62 41.5 67.5"
                    stroke={LIMB_STROKE}
                    strokeWidth={2.35}
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx={41.5} cy={67.5} r={3.2} fill={LIMB_FILL} stroke={LIMB_STROKE} strokeWidth={0.45} strokeOpacity={0.55} />
                </motion.g>
              </g>
            ) : null}

            {suggesting && !reduced ? (
              <motion.g
                className="pointer-events-none"
                aria-hidden
                initial={false}
                animate={{ y: [0, -2.5, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <path
                  d="M 79 67 Q 71 52 61 43"
                  stroke={LIMB_STROKE}
                  strokeWidth={2.35}
                  fill="none"
                  strokeLinecap="round"
                />
                <path d="M 61 43 L 55 31.5" stroke={LIMB_STROKE} strokeWidth={2.45} strokeLinecap="round" />
                <circle cx={54.5} cy={30} r={2.6} fill={LIMB_FILL} stroke={LIMB_STROKE} strokeWidth={0.4} strokeOpacity={0.55} />
              </motion.g>
            ) : null}

            {thinking && !reduced ? (
              <>
                <motion.circle
                  cx={52}
                  cy={54}
                  r={21}
                  fill="#7d9f7d"
                  initial={false}
                  animate={{ opacity: [0.07, 0.2, 0.09] }}
                  transition={{ duration: 1.85, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.g
                  initial={false}
                  animate={{ rotate: [0, -2.8, 2.2, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "52px 55px" }}
                >
                  <path d="M 52 54 L 61 61" stroke={ACCENT_FG} strokeOpacity={0.35} strokeWidth={1.1} strokeLinecap="round" />
                </motion.g>
              </>
            ) : null}

            {/* Face — infographic-style dot eyes */}
            <g style={{ transformOrigin: "53px 62px", transform: `scaleY(${eyeScaleY})` }}>
              <g transform={`translate(${px}, ${py})`}>
                <circle cx={43} cy={62} r={hovered ? 3.85 : 3.55} fill="#171717" />
                <circle cx={61} cy={62} r={hovered ? 3.85 : 3.55} fill="#171717" />
                <circle cx={44} cy={60.9} r={1} fill="#fafafa" opacity={0.65} />
                <circle cx={62} cy={60.9} r={1} fill="#fafafa" opacity={0.65} />
              </g>
            </g>

            <motion.path
              key={mouthD}
              d={mouthD}
              fill="none"
              stroke="#1c1917"
              strokeOpacity={0.88}
              strokeWidth={1.15}
              strokeLinecap="round"
              initial={false}
              animate={
                talking
                  ? { opacity: [0.5, 0.95, 0.56, 0.9, 0.52], strokeWidth: [1.05, 1.38, 1.12] }
                  : { opacity: 0.92, strokeWidth: 1.15 }
              }
              transition={
                talking
                  ? { duration: 0.48, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.22 }
              }
              className="dark:stroke-[#fafaf9]"
            />
          </motion.g>
        </svg>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-[4%] left-1/2 w-[70%] -translate-x-1/2"
          style={{ transformOrigin: "50% 100%" }}
          initial={{ scaleX: 1, scaleY: 1, opacity: 0.9 }}
          animate={shadowControls}
          aria-hidden
        >
          <svg viewBox="0 0 100 20" className="block h-[min(18%,14px)] w-full overflow-visible" preserveAspectRatio="xMidYMid meet">
            <ellipse cx="50" cy="10" rx="28" ry="5" className="fill-foreground/[0.08] dark:fill-foreground/[0.07]" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
