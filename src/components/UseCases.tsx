"use client";

// UseCases
// ────────────────────────────────────────────────────────────────────────────
// Section that answers the question "what are these figures FOR?".
// Four cards, each pairing a stylised illustration of the medium (journal,
// poster, slide deck, document) with a short description and one or two
// real‑world examples in the body copy.
//
// Real publication marks are deliberately NOT reproduced — the cards use
// generic mastheads (uppercase serif) so the visual hint is there without
// any trademark concerns.

import { BookOpen, LayoutPanelTop, Presentation, FileText } from "lucide-react";
import { Reveal } from "@/components/Reveal";

// ─── Decorative artwork (SVG) for each card ────────────────────────────────

function JournalCover() {
  return (
    <svg viewBox="0 0 160 200" className="h-full w-full">
      {/* book shadow */}
      <rect x="22" y="32" width="116" height="160" rx="3"
            className="fill-foreground/10" />
      {/* cover */}
      <rect x="18" y="28" width="116" height="160" rx="3"
            className="fill-background stroke-border" strokeWidth={1} />
      {/* masthead band */}
      <rect x="18" y="28" width="116" height="22"
            className="fill-foreground" />
      <text x="76" y="44" textAnchor="middle"
            className="fill-background"
            style={{ font: "700 9px ui-serif, Georgia, serif", letterSpacing: "0.18em" }}>
        PROCEEDINGS
      </text>
      {/* hairline */}
      <line x1={26} y1={56} x2={126} y2={56}
            className="stroke-border" strokeWidth={0.5} />
      {/* tiny figure: cell + arrow + atom */}
      <ellipse cx="50" cy="100" rx="18" ry="14"
               className="fill-primary/15 stroke-primary" strokeWidth={1} />
      <path d="M 72 100 H 92" className="stroke-foreground/60" strokeWidth={1} />
      <path d="M 88 96 L 94 100 L 88 104"
            className="fill-none stroke-foreground/60" strokeWidth={1} />
      <circle cx="108" cy="100" r="11"
              className="fill-chart-2/20 stroke-chart-2" strokeWidth={1} />
      {/* caption lines */}
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
      <rect x="10" y="10" width="180" height="140" rx="3"
            className="fill-background stroke-border" strokeWidth={1} />
      {/* title */}
      <rect x="20" y="22" width="100" height="6" rx="1" className="fill-foreground" />
      <rect x="20" y="34" width="70"  height="3" rx="1" className="fill-foreground/40" />
      {/* figure grid */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 20 + (i % 3) * 56;
        const y = 50 + Math.floor(i / 3) * 46;
        return (
          <g key={i}>
            <rect x={x} y={y} width={48} height={36} rx={2}
                  className="fill-muted stroke-border" strokeWidth={0.5} />
            {/* micro shape */}
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
      {/* projector screen frame */}
      <rect x="6" y="8" width="188" height="118" rx="2"
            className="fill-background stroke-border" strokeWidth={1} />
      {/* slide */}
      <rect x="14" y="16" width="172" height="102" rx="1.5"
            className="fill-muted/40" />
      {/* title bar */}
      <rect x="22" y="24" width="80" height="5" rx="1" className="fill-foreground" />
      <rect x="22" y="34" width="50" height="3" rx="1" className="fill-foreground/40" />
      {/* figure on slide */}
      <ellipse cx="58" cy="76" rx="22" ry="16"
               className="fill-primary/15 stroke-primary" strokeWidth={1} />
      <path d="M 84 76 H 110" className="stroke-foreground/60" strokeWidth={1} />
      <circle cx="130" cy="76" r="14"
              className="fill-chart-2/20 stroke-chart-2" strokeWidth={1} />
      {/* footer */}
      <rect x="22" y="106" width="40" height="2" rx="1" className="fill-foreground/30" />
    </svg>
  );
}

function GrantDoc() {
  return (
    <svg viewBox="0 0 160 200" className="h-full w-full">
      <rect x="22" y="32" width="116" height="160" rx="3"
            className="fill-foreground/10" />
      <rect x="18" y="28" width="116" height="160" rx="3"
            className="fill-background stroke-border" strokeWidth={1} />
      {/* letterhead */}
      <rect x="26" y="38" width="44" height="3" rx="1" className="fill-foreground" />
      <rect x="26" y="46" width="76" height="2" rx="1" className="fill-foreground/40" />
      {/* horizontal rule */}
      <line x1={26} y1={58} x2={126} y2={58}
            className="stroke-border" strokeWidth={0.5} />
      {/* paragraph blocks */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={26} y={66 + i * 18} width={100} height={2} rx={1} className="fill-foreground/25" />
          <rect x={26} y={72 + i * 18} width={92}  height={2} rx={1} className="fill-foreground/20" />
          <rect x={26} y={78 + i * 18} width={86}  height={2} rx={1} className="fill-foreground/20" />
        </g>
      ))}
      {/* embedded figure */}
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
  title: string;
  body: string;
  examples: string;
}[] = [
  {
    Icon: BookOpen,
    Art: JournalCover,
    title: "Peer-reviewed publications",
    body: "Vector geometry is preserved end-to-end. Submit through PubMed-indexed pipelines without re-rendering, re-sizing, or re-flattening anything.",
    examples: "Nature · Cell · Science · eLife · PNAS",
  },
  {
    Icon: LayoutPanelTop,
    Art: Poster,
    title: "Conference posters",
    body: "Scale a single SVG to A0 — every shape stays crisp and every label stays readable from across the hall.",
    examples: "ASCB · SfN · ESHG · Posters & abstracts",
  },
  {
    Icon: Presentation,
    Art: Slide,
    title: "Lab presentations",
    body: "Drop figures straight into Keynote, Slides, or PowerPoint. They keep their typography and stay crisp at any zoom.",
    examples: "Lab meetings · Symposia · Keynotes",
  },
  {
    Icon: FileText,
    Art: GrantDoc,
    title: "Grant applications",
    body: "Reviewers skim hundreds of proposals — a clear, considered figure is the fastest way to make yours stick.",
    examples: "NIH · ERC · Wellcome · NSF",
  },
];

export function UseCases() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Where your figures land
            </p>
            <h2 className="font-display text-4xl leading-[1.1] text-balance text-foreground md:text-[44px]">
              A figure is only as good as the page it lives on.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Canvas exports the formats real venues ask for — vectors for journals,
              high-DPI raster for posters, embedded SVG for slides — so you never
              re-do the work to fit the medium.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
          {CASES.map(({ Icon, Art, title, body, examples }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
                {/* Decorative artwork */}
                <div
                  className="flex h-44 items-center justify-center border-b border-border/70 px-8 py-6"
                  style={{ background: "var(--gradient-paper)" }}
                >
                  <div className="h-full w-44 transition-transform duration-500 group-hover:scale-[1.04]">
                    <Art />
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-accent text-primary">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </div>
                  <h3 className="font-display text-[22px] leading-tight text-foreground">{title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{body}</p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
                    {examples}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
