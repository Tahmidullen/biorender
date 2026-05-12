"use client";

// UseCases — editorial edition.
// ────────────────────────────────────────────────────────────────────────────
// Section that answers "what are these figures FOR?".
// Four entries, each paired with a stylised illustration of its medium
// (journal, poster, slide deck, grant document).
//
// The artwork is unchanged from the previous version — it's already
// considered. What changed is the chrome: no rounded cards, no
// hover-lift, no rounded icon-chips, no ambient gradient panel. Instead:
// a 2-column hairline grid, numbered entries, monospace examples set
// like a typesetter's running list.

import { BookOpen, LayoutPanelTop, Presentation, FileText } from "lucide-react";
import { Reveal } from "@/components/Reveal";

// ─── Decorative artwork (SVG) for each card ────────────────────────────────

function JournalCover() {
  return (
    <svg viewBox="0 0 160 200" className="h-full w-full">
      <rect x="22" y="32" width="116" height="160" rx="2"
            className="fill-foreground/10" />
      <rect x="18" y="28" width="116" height="160" rx="2"
            className="fill-background stroke-border" strokeWidth={1} />
      <rect x="18" y="28" width="116" height="22"
            className="fill-foreground" />
      <text x="76" y="44" textAnchor="middle"
            className="fill-background"
            style={{ font: "700 9px ui-serif, Georgia, serif", letterSpacing: "0.18em" }}>
        PROCEEDINGS
      </text>
      <line x1={26} y1={56} x2={126} y2={56}
            className="stroke-border" strokeWidth={0.5} />
      <ellipse cx="50" cy="100" rx="18" ry="14"
               className="fill-primary/15 stroke-primary" strokeWidth={1} />
      <path d="M 72 100 H 92" className="stroke-foreground/60" strokeWidth={1} />
      <path d="M 88 96 L 94 100 L 88 104"
            className="fill-none stroke-foreground/60" strokeWidth={1} />
      <circle cx="108" cy="100" r="11"
              className="fill-chart-2/20 stroke-chart-2" strokeWidth={1} />
      <rect x="26" y="130" width="100" height="2" rx="1" className="fill-foreground/30" />
      <rect x="26" y="138" width="86"  height="2" rx="1" className="fill-foreground/20" />
      <rect x="26" y="146" width="92"  height="2" rx="1" className="fill-foreground/20" />
      <rect x="26" y="170" width="40"  height="2" rx="1" className="fill-foreground/40" />
    </svg>
  );
}

function Poster() {
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full">
      <rect x="10" y="10" width="180" height="140" rx="2"
            className="fill-background stroke-border" strokeWidth={1} />
      <rect x="20" y="22" width="100" height="6" rx="1" className="fill-foreground" />
      <rect x="20" y="34" width="70"  height="3" rx="1" className="fill-foreground/40" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 20 + (i % 3) * 56;
        const y = 50 + Math.floor(i / 3) * 46;
        return (
          <g key={i}>
            <rect x={x} y={y} width={48} height={36} rx={2}
                  className="fill-muted stroke-border" strokeWidth={0.5} />
            <circle cx={x + 24} cy={y + 18} r={8}
                    className="fill-primary/20 stroke-primary" strokeWidth={0.8} />
          </g>
        );
      })}
    </svg>
  );
}

function Slide() {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full">
      <rect x="6" y="8" width="188" height="118" rx="2"
            className="fill-background stroke-border" strokeWidth={1} />
      <rect x="14" y="16" width="172" height="102" rx="1"
            className="fill-muted/40" />
      <rect x="22" y="24" width="80" height="5" rx="1" className="fill-foreground" />
      <rect x="22" y="34" width="50" height="3" rx="1" className="fill-foreground/40" />
      <ellipse cx="58" cy="76" rx="22" ry="16"
               className="fill-primary/15 stroke-primary" strokeWidth={1} />
      <path d="M 84 76 H 110" className="stroke-foreground/60" strokeWidth={1} />
      <circle cx="130" cy="76" r="14"
              className="fill-chart-2/20 stroke-chart-2" strokeWidth={1} />
      <rect x="22" y="106" width="40" height="2" rx="1" className="fill-foreground/30" />
    </svg>
  );
}

function GrantDoc() {
  return (
    <svg viewBox="0 0 160 200" className="h-full w-full">
      <rect x="22" y="32" width="116" height="160" rx="2"
            className="fill-foreground/10" />
      <rect x="18" y="28" width="116" height="160" rx="2"
            className="fill-background stroke-border" strokeWidth={1} />
      <rect x="26" y="38" width="44" height="3" rx="1" className="fill-foreground" />
      <rect x="26" y="46" width="76" height="2" rx="1" className="fill-foreground/40" />
      <line x1={26} y1={58} x2={126} y2={58}
            className="stroke-border" strokeWidth={0.5} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={26} y={66 + i * 18} width={100} height={2} rx={1} className="fill-foreground/25" />
          <rect x={26} y={72 + i * 18} width={92}  height={2} rx={1} className="fill-foreground/20" />
          <rect x={26} y={78 + i * 18} width={86}  height={2} rx={1} className="fill-foreground/20" />
        </g>
      ))}
      <rect x={26} y={132} width={100} height={36} rx={2}
            className="fill-muted stroke-border" strokeWidth={0.5} />
      <circle cx={50} cy={150} r={9}
              className="fill-primary/15 stroke-primary" strokeWidth={1} />
      <circle cx={100} cy={150} r={9}
              className="fill-chart-2/15 stroke-chart-2" strokeWidth={1} />
      <path d="M 60 150 H 90" className="stroke-foreground/60" strokeWidth={0.8} />
    </svg>
  );
}

const CASES: {
  Icon: typeof BookOpen;
  Art: React.ComponentType;
  n: string;
  title: string;
  body: string;
  examples: string;
}[] = [
  {
    Icon: BookOpen,
    Art: JournalCover,
    n: "01",
    title: "Peer-reviewed publications",
    body: "Vector geometry is preserved end-to-end. Submit through PubMed-indexed pipelines without re-rendering, re-sizing, or re-flattening anything.",
    examples: "Nature · Cell · Science · eLife · PNAS",
  },
  {
    Icon: LayoutPanelTop,
    Art: Poster,
    n: "02",
    title: "Conference posters",
    body: "Scale a single SVG to A0 — every shape stays crisp and every label stays readable from across the hall.",
    examples: "ASCB · SfN · ESHG · Posters & abstracts",
  },
  {
    Icon: Presentation,
    Art: Slide,
    n: "03",
    title: "Lab presentations",
    body: "Drop figures straight into Keynote, Slides, or PowerPoint. They keep their typography and stay crisp at any zoom.",
    examples: "Lab meetings · Symposia · Keynotes",
  },
  {
    Icon: FileText,
    Art: GrantDoc,
    n: "04",
    title: "Grant applications",
    body: "Reviewers skim hundreds of proposals — a clear, considered figure is the fastest way to make yours stick.",
    examples: "NIH · ERC · Wellcome · NSF",
  },
];

export function UseCases() {
  return (
    <section className="hairline-t px-6 py-24">
      <div className="mx-auto max-w-[1240px]">
        {/* Section masthead — asymmetric, hairline-divided. */}
        <Reveal>
          <div className="grid grid-cols-12 gap-x-6 items-end pb-8 hairline-b">
            <div className="col-span-12 md:col-span-8">
              <p className="meta-mono mb-3">§ 03 — Use cases</p>
              <h2 className="font-display text-[44px] leading-[1.02] tracking-[-0.02em] text-foreground md:text-[60px]">
                A figure is only as good as
                <br />
                <span className="italic text-muted-foreground">the page it lives on.</span>
              </h2>
            </div>
            <div className="col-span-12 mt-4 text-[13.5px] leading-relaxed text-muted-foreground md:col-span-4 md:mt-0">
              Canvas exports the formats real venues ask for — vectors for
              journals, high-DPI raster for posters, embedded SVG for slides
              — so you never re-do the work to fit the medium.
            </div>
          </div>
        </Reveal>

        {/* Flat hairline grid. Two columns, each cell with its own
            illustration plate, numbered & captioned like a figure index. */}
        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 hairline-box">
          {CASES.map(({ Icon, Art, n, title, body, examples }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <article className="group flex h-full flex-col bg-background">
                {/* Plate */}
                <div className="relative flex h-52 items-center justify-center hairline-b bg-paper-grain px-8 py-6">
                  <div className="h-full w-48">
                    <Art />
                  </div>
                  <span className="absolute left-3 top-3 colophon tnum">
                    Pl. {n}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-baseline gap-3">
                    <span className="index-num tnum">№ {n}</span>
                    <Icon className="h-4 w-4 text-foreground/70" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-[24px] leading-tight text-foreground md:text-[28px]">
                    {title}
                  </h3>
                  <p className="max-w-[52ch] text-[14px] leading-[1.55] text-muted-foreground">
                    {body}
                  </p>
                  <p className="colophon mt-2">
                    {examples}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
