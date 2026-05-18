"use client";

// Templates showcase — short Affinity-style band: copy + masonry, passes with the page.
// Parallax is scoped to while the section crosses the viewport (no sticky / scroll trap).

import { useId, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffectiveReducedMotion } from "@/components/MotionPreference";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { RegisterMarks } from "@/components/RegisterMarks";
import { TEMPLATES } from "@/lib/templates";

/** Literal paints — Tailwind on SVG primitives is unreliable. */
const S = {
  ink: "oklch(0.216 0.034 52)",
  inkSoft: "oklch(0.395 0.030 55)",
  surface: "oklch(0.986 0.009 82)",
  primary: "oklch(0.308 0.096 146)",
  primaryFill: "oklch(0.308 0.096 146 / 0.28)",
  vermilion: "oklch(0.56 0.18 38)",
  violet: "oklch(0.42 0.12 18)",
  violetFill: "oklch(0.42 0.12 18 / 0.22)",
  border: "oklch(0.38 0.036 58 / 0.52)",
  dot: "oklch(0.216 0.034 52 / 0.14)",
  barSoft: "oklch(0.35 0.024 72 / 0.34)",
};

/** Same 12px dot grid as `JournalExportPlate` — under catalogue previews so thumbs aren’t flat solids. */
function DotCanvasBackdrop() {
  const uid = useId().replace(/:/g, "");
  const pid = `thumb-dot-${uid}`;
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={pid} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill={S.dot} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${pid})`} />
    </svg>
  );
}

function JournalExportPlate({ clipId }: { clipId: string }) {
  const cid = `${clipId}-journal`;
  return (
    <svg viewBox="0 0 400 220" className="block h-full w-full" aria-hidden preserveAspectRatio="xMidYMid meet">
      <defs>
        <clipPath id={cid}>
          <rect x="48" y="36" width="304" height="168" rx="1" />
        </clipPath>
      </defs>
      <rect x="48" y="36" width="304" height="168" rx="1" fill={S.surface} stroke={S.border} strokeWidth="1" />
      <g clipPath={`url(#${cid})`}>
        <text x="56" y="58" fill={S.inkSoft} style={{ font: "600 9px ui-monospace, monospace", letterSpacing: "0.04em" }}>
          Fig. 3 · Trafficking
        </text>
        <ellipse cx="160" cy="128" rx="52" ry="36" fill={S.primaryFill} stroke={S.primary} strokeWidth="1.4" />
        <path d="M 216 128 H 278" stroke={S.vermilion} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="298" cy="128" r="16" fill={S.violetFill} stroke={S.violet} strokeWidth="1.4" />
        <text x="298" y="132" textAnchor="middle" fill={S.ink} style={{ font: "600 8px ui-monospace, monospace" }}>
          EGFR
        </text>
        <line x1="56" y1="172" x2="344" y2="172" stroke={S.border} strokeWidth="0.8" strokeDasharray="4 4" />
      </g>
    </svg>
  );
}

function PosterPlate({ clipId }: { clipId: string }) {
  const cid = `${clipId}-poster`;
  return (
    <svg viewBox="0 0 400 220" className="block h-full w-full" aria-hidden preserveAspectRatio="xMidYMid meet">
      <defs>
        <clipPath id={cid}>
          <rect x="56" y="28" width="288" height="184" />
        </clipPath>
      </defs>
      <rect x="56" y="28" width="288" height="184" fill={S.surface} stroke={S.ink} strokeOpacity={0.28} strokeWidth="1.5" />
      <g clipPath={`url(#${cid})`}>
        <text x="200" y="52" textAnchor="middle" fill={S.ink} style={{ font: "700 11px Georgia, ui-serif, serif", letterSpacing: "0.14em" }}>
          CONFERENCE POSTER
        </text>
        <rect x="80" y="68" width="100" height="72" rx="1" fill={S.primaryFill} stroke={S.primary} strokeOpacity={0.55} strokeWidth="1" />
        <rect x="194" y="68" width="122" height="16" fill={S.barSoft} />
        <rect x="194" y="92" width="108" height="10" fill={S.barSoft} />
        <rect x="194" y="108" width="116" height="10" fill={S.barSoft} />
        <circle cx="302" cy="118" r="22" fill="oklch(0.56 0.18 32 / 0.18)" stroke={S.vermilion} strokeWidth="1.2" />
      </g>
    </svg>
  );
}

function TemplatePreviewFill({ templateIndex }: { templateIndex: number }) {
  const tpl = TEMPLATES[templateIndex];
  const Preview = tpl?.Preview;
  if (!Preview) return null;
  return (
    <div className="relative flex h-full min-h-[88px] w-full min-w-0 flex-col overflow-hidden">
      <p
        className="pointer-events-none absolute left-1 right-1 top-1 z-[1] truncate text-center font-mono text-[9px] font-medium tracking-tight text-muted-foreground md:text-[10px]"
        aria-hidden
      >
        {tpl.title}
      </p>
      <div className="pointer-events-none absolute inset-0 top-5 flex min-h-0 flex-col overflow-hidden pt-0">
        <div className="relative min-h-0 flex-1 overflow-hidden [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:max-h-full [&_svg]:object-contain">
          <Preview />
        </div>
      </div>
    </div>
  );
}

const SCENES: {
  eyebrow: string;
  title: string;
  body: string;
  caption: string;
  kind: "template" | "journal" | "poster";
  templateIndex?: number;
}[] = [
  {
    eyebrow: "Templates",
    title: "Start from a pathway.",
    body: "Receptor to nucleus, already wired. Swap labels — artwork stays sharp at journal resolutions.",
    caption: "Signalling · template",
    kind: "template",
    templateIndex: 0,
  },
  {
    eyebrow: "Templates",
    title: "Cycles that teach.",
    body: "Four phases, one style. Duplicate for slides or the supplement.",
    caption: "Cell cycle · template",
    kind: "template",
    templateIndex: 1,
  },
  {
    eyebrow: "Templates",
    title: "Bench day, drawn.",
    body: "Sample → prep → image → analyse — the strip methods reviewers like.",
    caption: "Lab workflow · template",
    kind: "template",
    templateIndex: 2,
  },
  {
    eyebrow: "Exports",
    title: "Journal PDF.",
    body: "Sharp strokes when production zooms in — fewer \"can you resubmit this?\" emails.",
    caption: "Journal PDF",
    kind: "journal",
  },
  {
    eyebrow: "Exports",
    title: "Poster size.",
    body: "Same file from laptop to hallway board — scale up without starting over.",
    caption: "Poster",
    kind: "poster",
  },
];

function SceneThumbnail({
  scene,
  aspectClassName,
}: {
  scene: (typeof SCENES)[number];
  aspectClassName?: string;
}) {
  const tpl = scene.kind === "template";
  const thumbUid = useId().replace(/:/g, "");
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-transparent hairline-box min-h-[96px]",
        aspectClassName ??
          (tpl ? "aspect-[240/140]" : "aspect-[400/220]"),
      )}
    >
      <DotCanvasBackdrop />
      <div className="absolute inset-0 z-[1] min-h-[96px] overflow-hidden">
        {scene.kind === "journal" && <JournalExportPlate clipId={thumbUid} />}
        {scene.kind === "poster" && <PosterPlate clipId={thumbUid} />}
        {scene.kind === "template" && scene.templateIndex !== undefined && (
          <TemplatePreviewFill templateIndex={scene.templateIndex} />
        )}
      </div>
    </div>
  );
}

/** Masonry tiles: explicit columns, gaps, mixed heights — no stacking overlap. */
type MasonryTile = { sceneIndex: number; aspect: "tall" | "mid" | "wide" };

/** Keep thumbs visibly tall — mixing aspect + aggressive max-h collapsed tiles in flex. */
const ASPECT: Record<MasonryTile["aspect"], string> = {
  tall: "aspect-[4/5] w-full min-h-[168px] sm:min-h-[200px]",
  mid: "aspect-[5/4] w-full min-h-[148px] sm:min-h-[172px]",
  wide: "aspect-[16/10] w-full min-h-[132px] sm:min-h-[156px]",
};

const MASONRY_LEFT: MasonryTile[] = [
  { sceneIndex: 0, aspect: "tall" },
  { sceneIndex: 3, aspect: "wide" },
  { sceneIndex: 2, aspect: "mid" },
];

const MASONRY_RIGHT: MasonryTile[] = [
  { sceneIndex: 1, aspect: "wide" },
  { sceneIndex: 4, aspect: "tall" },
  { sceneIndex: 0, aspect: "mid" },
];

function MasonryGalleryCard({ tile }: { tile: MasonryTile }) {
  const scene = SCENES[tile.sceneIndex];

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-sm bg-background/95 hairline-box shadow-sm",
      )}
    >
      <RegisterMarks size={6} inset={4} className="opacity-40" />
      <div className="flex items-center gap-1.5 hairline-b bg-muted/30 px-2 py-1">
        <span className="h-1 w-1 rounded-full bg-foreground/22" />
        <span className="truncate font-mono text-[8px] text-muted-foreground tracking-wide md:text-[9px]">
          {scene.caption}
        </span>
      </div>
      <div className="p-1.5 md:p-2">
        <SceneThumbnail scene={scene} aspectClassName={ASPECT[tile.aspect]} />
      </div>
    </article>
  );
}

function TemplateMasonryStage({
  scrollYProgress,
  reduced,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduced: boolean;
}) {
  /** Smooth scroll progress — reads closer to Affinity’s fluid columns than raw jumps. */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: reduced ? 380 : 72,
    damping: reduced ? 88 : 18,
    mass: 0.78,
  });

  const p = smoothProgress;

  /** Gentler drift + shorter tail so thumbs aren’t clipped upward before the Features hairline. */
  const colLeftY = useTransform(p, [0, 1], reduced ? [0, 0] : [40, -118]);
  const colRightY = useTransform(p, [0, 1], reduced ? [0, 0] : [-32, 132]);
  const dotsX = useTransform(p, [0, 1], reduced ? ["0%", "0%"] : ["0%", "-18%"]);

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden pb-10 pt-1 md:pb-14 md:pt-2">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(var(--ink) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          backgroundPositionX: dotsX,
        }}
      />

      {/* Vertical padding gives room for translateY so cards aren’t clipped flat */}
      <div className="relative px-1 py-10 pt-12 pb-14 md:px-2 md:py-14 md:pb-16">
        <div className="flex gap-3 md:gap-4 lg:gap-5">
          <motion.div
            className="flex min-w-0 flex-1 flex-col gap-3 will-change-transform md:gap-4"
            style={{ y: colLeftY }}
          >
            {MASONRY_LEFT.map((tile, i) => (
              <MasonryGalleryCard key={`L-${tile.sceneIndex}-${i}`} tile={tile} />
            ))}
          </motion.div>
          <motion.div
            className="flex min-w-0 flex-1 flex-col gap-3 will-change-transform md:gap-4"
            style={{ y: colRightY }}
          >
            {MASONRY_RIGHT.map((tile, i) => (
              <MasonryGalleryCard key={`R-${tile.sceneIndex}-${i}`} tile={tile} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function ScrollMorphShowcase() {
  const reduced = useEffectiveReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    /** Start slightly before full enter / end slightly after — longer parallax window like Affinity’s band. */
    offset: ["start 0.88", "end 0.12"],
  });

  return (
    <section
      ref={containerRef}
      id="showcase"
      className="hairline-t bg-paper-grain-veil overflow-hidden"
    >
      <div className="mx-auto flex max-w-[1240px] flex-col gap-12 px-6 pb-20 pt-20 md:gap-14 md:pb-28 md:pt-24 lg:flex-row lg:items-start lg:gap-16 lg:pb-32 lg:pt-28">
        <div className="flex shrink-0 flex-col gap-6 lg:w-[min(42%,460px)] lg:border-r lg:border-border lg:pr-10 xl:pr-12">
          <header>
            <p className="meta-mono mb-3">Templates</p>
            <h2 className="font-display text-[clamp(28px,4vw,42px)] leading-[1.02] tracking-[-0.025em] text-foreground">
              Jump in with something
              <span className="italic text-muted-foreground"> already drawn.</span>
            </h2>
          </header>
          <p className="max-w-[40ch] text-[14px] leading-[1.6] text-muted-foreground">
            Pathways, cycles, lab strips — open a template, make it yours, export PNG or a scalable file when you&apos;re happy.
          </p>
          <Link
            href="/templates"
            className={cn(
              buttonVariants({ size: "default" }),
              "mt-1 h-10 w-fit rounded-sm px-4 text-[13px] gap-2",
            )}
          >
            See all templates
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <TemplateMasonryStage scrollYProgress={scrollYProgress} reduced={!!reduced} />
      </div>
    </section>
  );
}
