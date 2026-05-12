"use client";

// Environmental atmosphere — home page only. Fixed layers behind content:
// parallax on scroll, cursor-linked drift, soft ink/teal washes and schematic
// symbols (depth and motion without loud SaaS gradients).

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffectiveReducedMotion } from "@/components/MotionPreference";

export function EnvironmentalAtmosphere() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <EnvironmentalAtmosphereCanvas />;
}

function EnvironmentalAtmosphereCanvas() {
  const reduced = useEffectiveReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();

  const mouseNx = useMotionValue(0);
  const mouseNy = useMotionValue(0);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      mouseNx.set(e.clientX / window.innerWidth - 0.5);
      mouseNy.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, mouseNx, mouseNy]);

  const driftSpringX = useSpring(mouseNx, { stiffness: 26, damping: 22, mass: 0.35 });
  const driftSpringY = useSpring(mouseNy, { stiffness: 26, damping: 22, mass: 0.35 });

  const driftSlowX = useTransform(driftSpringX, [-0.5, 0.5], [-22, 22]);
  const driftSlowY = useTransform(driftSpringY, [-0.5, 0.5], [-22, 22]);
  const driftFastX = useTransform(driftSpringX, [-0.5, 0.5], [-46, 46]);
  const driftFastY = useTransform(driftSpringY, [-0.5, 0.5], [-46, 46]);

  const driftAltX = useTransform(driftSpringX, [-0.5, 0.5], [-14, 14]);
  const driftAltY = useTransform(driftSpringY, [-0.5, 0.5], [-30, 30]);

  const yFar = useTransform(scrollY, [0, 2800], [0, -140]);
  const yMid = useTransform(scrollY, [0, 2800], [0, -260]);
  const yNear = useTransform(scrollY, [0, 2800], [0, -420]);

  const fieldRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-6, 4, 10]);
  const fieldScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const dotGridY = useTransform(scrollY, [0, 2400], [0, -180]);
  const dotGridMouseX = useTransform(driftSpringX, [-0.5, 0.5], [-22, 22]);
  const dotGridMouseY = useTransform(driftSpringY, [-0.5, 0.5], [-22, 22]);

  const symbolLayerY = yMid;
  const symbolLayerRotate = useTransform(scrollYProgress, [0, 1], [0, 8]);

  const tealWashCounterRot = useTransform(fieldRotate, (r) => -Number(r) * 0.85);
  const vermilionOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    [0.35, 0.55, 0.45, 0.6],
  );

  const hexInnerY = useTransform(scrollY, [0, 2000], [0, -60]);
  const dnaGroupY = useTransform(scrollY, [0, 2000], [0, -90]);
  const orbitGroupY = useTransform(scrollY, [0, 2200], [0, -120]);

  const cross1X = useTransform(driftSpringX, (v) => -v * 50);
  const cross1Y = useTransform(yFar, (v) => Number(v) * 0.4);
  const cross2X = useTransform(driftSpringX, (v) => v * 55);
  const cross2Y = useTransform(yMid, (v) => Number(v) * 0.25);
  const glyphY = useTransform(yNear, (v) => Number(v) * 0.2);

  const tealWashInnerX = useTransform(driftSlowX, (v) => -v * 0.6);
  const tealWashInnerY = useTransform(yMid, (ym) => Number(ym) * 0.7);

  const vermilionScrollY = useTransform(yNear, (v) => Number(v) * 0.35);
  const vermilionMouseY = useTransform(driftFastY, (v) => Number(v) * 0.25);

  // Same layered artwork as the animated stack, frozen at scroll‑neutral /
  // mouse‑neutral transforms so reduced‑motion users keep depth cues.
  if (reduced) {
    const fieldRotateDeg = -6;
    const tealCounterRotDeg = -fieldRotateDeg * 0.85;
    const vermilionOpacityFrozen = 0.35;

    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-paper-grain" />

        <div className="absolute inset-0" style={{ transform: "translateY(0px)" }}>
          <div style={{ transform: "translate(0px, 0px)" }}>
            <div
              className="absolute -left-[25%] top-[5%] h-[85vmin] w-[85vmin] rounded-full will-change-transform"
              style={{
                transform: `rotate(${fieldRotateDeg}deg) scale(1)`,
                background:
                  "radial-gradient(circle at 40% 35%, oklch(0.55 0.06 215 / 0.12), transparent 62%)",
              }}
            />
          </div>
        </div>

        <div className="absolute inset-0" style={{ transform: "translate(0px, 0px)" }}>
          <div style={{ transform: "translate(0px, 0px)" }}>
            <div
              className="absolute -right-[20%] bottom-[10%] h-[75vmin] w-[75vmin] rounded-full will-change-transform"
              style={{
                transform: `rotate(${tealCounterRotDeg}deg)`,
                background:
                  "radial-gradient(circle at 60% 55%, oklch(0.72 0.08 75 / 0.095), transparent 65%)",
              }}
            />
          </div>
        </div>

        <div className="absolute inset-0" style={{ transform: "translate(0px, 0px)" }}>
          <div style={{ transform: "translate(0px, 0px)" }}>
            <div
              className="absolute left-[55%] top-[38%] h-[40vmin] w-[40vmin] rounded-full will-change-transform"
              style={{
                opacity: vermilionOpacityFrozen,
                background:
                  "radial-gradient(circle, oklch(0.58 0.16 32 / 0.11), transparent 68%)",
              }}
            />
          </div>
        </div>

        <div
          className="absolute inset-[-12%] opacity-[0.2] will-change-transform"
          style={{ transform: "translateY(0px)" }}
        >
          <div
            className="h-full w-full"
            style={{
              transform: "translate(0px, 0px)",
              backgroundImage: `radial-gradient(var(--ink) 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div
          className="absolute inset-0 text-ink will-change-transform"
          style={{
            transform: "translateY(0px) rotate(0deg)",
            opacity: 0.48,
          }}
        >
          <div className="absolute inset-0" style={{ transform: "translate(0px, 0px)" }}>
            <svg
              className="absolute left-[-6%] top-[12%] h-[min(42vw,520px)] w-[min(42vw,520px)]"
              viewBox="0 0 400 400"
              fill="none"
            >
              <g style={{ transform: "translateY(0px)" }}>
                <g style={{ transform: "translate(0px, 0px)" }}>
                  <polygon
                    points="200,40 320,130 320,270 200,360 80,270 80,130"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    opacity={0.58}
                  />
                  <circle cx="200" cy="200" r="48" stroke="currentColor" strokeWidth="1.35" opacity={0.48} />
                </g>
              </g>
            </svg>

            <svg
              className="absolute right-[-5%] top-[28%] h-[min(36vw,440px)] w-[min(36vw,440px)]"
              viewBox="0 0 360 360"
              fill="none"
            >
              <g style={{ transform: "translateY(0px)" }}>
                <g style={{ transform: "translate(0px, 0px)" }}>
                  <path
                    d="M40 180 Q90 120 140 180 T240 180 T340 180"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    opacity={0.52}
                  />
                  <path
                    d="M40 200 Q90 260 140 200 T240 200 T340 200"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    opacity={0.52}
                  />
                </g>
              </g>
            </svg>

            <svg
              className="absolute bottom-[8%] left-[18%] h-[min(50vw,560px)] w-[min(50vw,560px)]"
              viewBox="0 0 420 420"
              fill="none"
            >
              <g style={{ transform: "translateY(0px)" }}>
                <g style={{ transform: "translate(0px, 0px)" }}>
                  <circle
                    cx="210"
                    cy="210"
                    r="160"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    opacity={0.28}
                    strokeDasharray="4 10"
                  />
                  <circle
                    cx="210"
                    cy="210"
                    r="110"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity={0.34}
                    strokeDasharray="2 8"
                  />
                  <line x1="210" y1="50" x2="210" y2="370" stroke="currentColor" strokeWidth="0.85" opacity={0.36} />
                  <line x1="50" y1="210" x2="370" y2="210" stroke="currentColor" strokeWidth="0.85" opacity={0.36} />
                </g>
              </g>
            </svg>

            <div className="absolute left-[12%] top-[52%] font-mono text-[13px] tracking-[0.2em] text-foreground/48">
              <span className="inline-block" style={{ transform: "translate(0px, 0px)" }}>
                <span className="inline-block" style={{ transform: "translate(0px, 0px)" }}>
                  ┼
                </span>
              </span>
            </div>
            <div className="absolute right-[14%] top-[18%] font-mono text-[15px] tracking-[0.25em] text-foreground/44">
              <span className="inline-block" style={{ transform: "translate(0px, 0px)" }}>
                <span className="inline-block" style={{ transform: "translate(0px, 0px)" }}>
                  ╋
                </span>
              </span>
            </div>
            <div className="absolute bottom-[22%] right-[22%] font-mono text-[12px] text-foreground/40">
              <span className="inline-block" style={{ transform: "translate(0px, 0px)" }}>
                <span className="inline-block" style={{ transform: "translate(0px, 0px)" }}>
                  ◎
                </span>
              </span>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh]"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--paper) 92%, var(--ink)), transparent)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-paper-grain" />

      <motion.div className="absolute inset-0" style={{ y: yFar }}>
        <motion.div style={{ x: driftSlowX, y: driftSlowY }}>
          <motion.div
            className="absolute -left-[25%] top-[5%] h-[85vmin] w-[85vmin] rounded-full will-change-transform"
            style={{
              rotate: fieldRotate,
              scale: fieldScale,
              background:
                "radial-gradient(circle at 40% 35%, oklch(0.55 0.06 215 / 0.12), transparent 62%)",
            }}
          />
        </motion.div>
      </motion.div>

      <motion.div className="absolute inset-0" style={{ x: tealWashInnerX, y: tealWashInnerY }}>
        <motion.div style={{ x: driftAltX, y: driftSlowY }}>
          <motion.div
            className="absolute -right-[20%] bottom-[10%] h-[75vmin] w-[75vmin] rounded-full will-change-transform"
            style={{
              rotate: tealWashCounterRot,
              background:
                "radial-gradient(circle at 60% 55%, oklch(0.72 0.08 75 / 0.095), transparent 65%)",
            }}
          />
        </motion.div>
      </motion.div>

      <motion.div className="absolute inset-0" style={{ x: driftFastX, y: vermilionScrollY }}>
        <motion.div style={{ x: driftSlowY, y: vermilionMouseY }}>
          <motion.div
            className="absolute left-[55%] top-[38%] h-[40vmin] w-[40vmin] rounded-full will-change-transform"
            style={{
              opacity: vermilionOpacity,
              background:
                "radial-gradient(circle, oklch(0.58 0.16 32 / 0.11), transparent 68%)",
            }}
          />
        </motion.div>
      </motion.div>

      <motion.div className="absolute inset-[-12%] opacity-[0.2] will-change-transform" style={{ y: dotGridY }}>
        <motion.div
          className="h-full w-full"
          style={{
            x: dotGridMouseX,
            y: dotGridMouseY,
            backgroundImage: `radial-gradient(var(--ink) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 text-ink will-change-transform"
        style={{
          y: symbolLayerY,
          rotate: symbolLayerRotate,
          opacity: 0.48,
        }}
      >
        <motion.div className="absolute inset-0" style={{ x: driftSlowX, y: driftSlowY }}>
        <svg className="absolute left-[-6%] top-[12%] h-[min(42vw,520px)] w-[min(42vw,520px)]" viewBox="0 0 400 400" fill="none">
          <motion.g style={{ y: hexInnerY }}>
            <motion.g style={{ x: driftAltX, y: driftFastY }}>
            <polygon
              points="200,40 320,130 320,270 200,360 80,270 80,130"
              stroke="currentColor"
              strokeWidth="1.9"
              opacity={0.58}
            />
            <circle cx="200" cy="200" r="48" stroke="currentColor" strokeWidth="1.35" opacity={0.48} />
            </motion.g>
          </motion.g>
        </svg>

        <svg className="absolute right-[-5%] top-[28%] h-[min(36vw,440px)] w-[min(36vw,440px)]" viewBox="0 0 360 360" fill="none">
          <motion.g style={{ y: dnaGroupY }}>
            <motion.g style={{ x: driftFastX, y: driftFastY }}>
            <path
              d="M40 180 Q90 120 140 180 T240 180 T340 180"
              stroke="currentColor"
              strokeWidth="2.1"
              opacity={0.52}
            />
            <path
              d="M40 200 Q90 260 140 200 T240 200 T340 200"
              stroke="currentColor"
              strokeWidth="2.1"
              opacity={0.52}
            />
            </motion.g>
          </motion.g>
        </svg>

        <svg className="absolute bottom-[8%] left-[18%] h-[min(50vw,560px)] w-[min(50vw,560px)]" viewBox="0 0 420 420" fill="none">
          <motion.g style={{ y: orbitGroupY }}>
            <motion.g style={{ x: driftFastX, y: driftSlowY }}>
            <circle cx="210" cy="210" r="160" stroke="currentColor" strokeWidth="1.1" opacity={0.28} strokeDasharray="4 10" />
            <circle cx="210" cy="210" r="110" stroke="currentColor" strokeWidth="1" opacity={0.34} strokeDasharray="2 8" />
            <line x1="210" y1="50" x2="210" y2="370" stroke="currentColor" strokeWidth="0.85" opacity={0.36} />
            <line x1="50" y1="210" x2="370" y2="210" stroke="currentColor" strokeWidth="0.85" opacity={0.36} />
            </motion.g>
          </motion.g>
        </svg>

        <motion.div
          className="absolute left-[12%] top-[52%] font-mono text-[13px] tracking-[0.2em] text-foreground/48"
          style={{ x: cross1X }}
        >
          <motion.span style={{ y: cross1Y }} className="inline-block">
            <motion.span style={{ x: driftSlowX, y: driftSlowY }} className="inline-block">
              ┼
            </motion.span>
          </motion.span>
        </motion.div>
        <motion.div
          className="absolute right-[14%] top-[18%] font-mono text-[15px] tracking-[0.25em] text-foreground/44"
          style={{ x: cross2X }}
        >
          <motion.span style={{ y: cross2Y }} className="inline-block">
            <motion.span style={{ x: driftFastX, y: driftFastY }} className="inline-block">
              ╋
            </motion.span>
          </motion.span>
        </motion.div>
        <motion.div
          className="absolute bottom-[22%] right-[22%] font-mono text-[12px] text-foreground/40"
        >
          <motion.span style={{ x: driftFastX, y: glyphY }} className="inline-block">
            <motion.span style={{ x: driftSlowY, y: driftSlowX }} className="inline-block">
              ◎
            </motion.span>
          </motion.span>
        </motion.div>
        </motion.div>
      </motion.div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh]"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklab, var(--paper) 92%, var(--ink)), transparent)",
        }}
      />
    </div>
  );
}
