import Link from "next/link";
import {
  ArrowRight,
  MousePointer2,
  Atom,
  Hexagon,
  Dna,
  Microscope,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { HowItWorksDemo } from "@/components/HowItWorksDemo";
import { UseCases } from "@/components/UseCases";
import { Reveal } from "@/components/Reveal";
import { RegisterMarks } from "@/components/RegisterMarks";
import { FeaturesShowcase } from "@/components/FeaturesShowcase";
import { ScrollMorphShowcase } from "@/components/ScrollMorphShowcase";

/* ──────────────────────────────────────────────────────────────────────────
   Canvas.bio — landing page, edition 02.
   ──────────────────────────────────────────────────────────────────────────
   Structured like a small-press magazine: a masthead, an asymmetric opening
   spread (with a PCR amplification figure plate), a numbered index of
   features, an animated workflow plate, a use-cases section, a pull-quote
   coda, and a colophon footer.

   Every section the previous page had is still here — only the typesetting
   changed.
   ────────────────────────────────────────────────────────────────────── */

// ─── Masthead (nav) ───────────────────────────────────────────────────────────
function Masthead() {
  // Pricing was removed (no plans yet). Community is the curated
  // user-submitted gallery at /community.
  const links: { href: string; label: string; external?: boolean }[] = [
    { href: "#showcase",    label: "Examples"  },
    { href: "#features",    label: "Features"  },
    { href: "#how-it-works", label: "Workflow"  },
    { href: "/templates",    label: "Templates", external: true },
    { href: "/community",    label: "Community", external: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-paper-grain-scrim hairline-b">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-6 py-4">
        <Logo size="md" />

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => {
            const className =
              "text-[13px] text-foreground/80 transition-colors hover:text-foreground border-b border-transparent hover:border-foreground pb-0.5";
            return l.external ? (
              <Link key={l.href} href={l.href} className={className}>
                {l.label}
              </Link>
            ) : (
              <a key={l.href} href={l.href} className={className}>
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-8 rounded-sm gap-1.5 px-3 text-[12.5px]",
            )}
          >
            Open editor
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Opening spread (hero) ────────────────────────────────────────────────────
function OpeningSpread() {
  return (
    <section className="relative px-6 pt-20 pb-24 sm:pt-28">
      <div className="mx-auto max-w-[1240px]">
        {/* Title slab — breathes full-width now that the marginalia
            sidebar is gone. */}
        <h1 className="font-display text-[12vw] leading-[0.92] tracking-[-0.025em] text-foreground sm:text-[96px] md:text-[120px] lg:text-[140px]">
          Beautiful
          <br />
          <span className="italic font-normal text-primary">science</span> figures,
          <br />
          drafted by hand.
        </h1>

        {/* Animated rule — runs once on load, like a scanner line. */}
        <div className="mt-12 h-px w-full max-w-[640px] origin-left bg-foreground/80 animate-rule-sweep" />

        <div className="mt-10 grid grid-cols-12 gap-x-6">
          {/* Lead paragraph — set in a narrow column. */}
          <p className="col-span-12 max-w-[58ch] text-pretty text-[17px] leading-[1.55] text-foreground/85 md:col-span-8">
            A focused editor with a growing library of clear, publication-style
            schematic symbols — built for researchers who care how their work looks on
            the page. Drag, snap, label, ship. The figure should not be the
            thing that holds the paper up.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 rounded-sm px-5 text-[14px] gap-2",
            )}
          >
            Open the editor
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how-it-works"
            className="group inline-flex items-center gap-2 text-[14px] text-foreground"
          >
            <span className="underline-rule">See how it works</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* Figure plate — PCR amplification diagram (Fig. 01). */}
      <div className="mx-auto mt-24 max-w-[1240px]">
        <figure>
          <div className="relative">
            <EditorMockup />
            <RegisterMarks size={11} inset={8} />
          </div>
          <figcaption className="mt-3 flex items-baseline justify-between border-t border-border pt-2 colophon">
            <span>Fig. 01 &nbsp;·&nbsp; PCR amplification, drafted in colour</span>
            <span className="hidden sm:inline">
              Denaturation · Annealing · Extension &nbsp;·&nbsp; × 30 cycles
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/**
 * The static PCR amplification plate. Same drawing as the previous edition
 * — the geometry was already considered, so I only reframed the chrome
 * (no rounded lifted card, hairlines instead).
 */
function EditorMockup() {
  return (
    <div className="hairline-box overflow-hidden bg-surface text-left">
      <div className="flex items-center gap-2 hairline-b bg-muted/40 px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
        <span className="ml-3 font-mono text-[11px] text-muted-foreground">
          pcr-amplification · figure-01
        </span>
        <span className="ml-auto colophon">Plate 01</span>
      </div>

      <div className="grid grid-cols-[200px_1fr] min-h-[320px]">
        <aside className="hairline-r bg-paper-grain p-3">
          <p className="meta-mono mb-3 px-1">Library</p>
          <div className="grid grid-cols-3 gap-1">
            {[Hexagon, Dna, Atom, Microscope, FlaskConical, Sparkles].map((I, i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center hairline-box bg-background text-foreground/75"
              >
                <I className="h-4 w-4" strokeWidth={1.4} />
              </div>
            ))}
          </div>
        </aside>

        <div className="relative bg-background p-6">
          <svg
            viewBox="0 0 360 200"
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <defs>
              <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="currentColor" className="text-foreground/10" />
              </pattern>
            </defs>
            <rect width="360" height="200" fill="url(#dots)" />

            {/* Faint vertical dividers between phases */}
            <line x1="122" y1="38" x2="122" y2="172" className="stroke-border" strokeWidth={1} strokeDasharray="2 4" />
            <line x1="238" y1="38" x2="238" y2="172" className="stroke-border" strokeWidth={1} strokeDasharray="2 4" />

            {/* ── Panel 1: Denaturation 95°C ─────────────────────── */}
            <text x="64" y="50" textAnchor="middle" className="fill-primary"
                  style={{ font: "600 9px ui-monospace, monospace", letterSpacing: "0.12em" }}>
              95°C
            </text>
            <path d="M 24 86 Q 64 74 104 86" fill="none" className="stroke-primary"
                  strokeWidth={1.6} strokeLinecap="round" />
            <path d="M 24 114 Q 64 126 104 114" fill="none" className="stroke-primary"
                  strokeWidth={1.6} strokeLinecap="round" />
            {[
              { x: 36, op: 0.35 },
              { x: 50, op: 0.18 },
              { x: 64, op: 0.0  },
              { x: 78, op: 0.18 },
              { x: 92, op: 0.35 },
            ].map((h) => (
              <line key={h.x} x1={h.x} y1={88} x2={h.x} y2={112}
                    className="stroke-foreground" strokeWidth={0.8}
                    strokeDasharray="2 2" opacity={h.op} />
            ))}
            <text x="64" y="170" textAnchor="middle" className="fill-muted-foreground"
                  style={{ font: "italic 11px var(--font-display, serif)" }}>
              denaturation
            </text>

            <path d="M 110 100 H 130" className="stroke-foreground/55" strokeWidth={1.4} strokeLinecap="round" />
            <path d="M 126 96 L 132 100 L 126 104" fill="none"
                  className="stroke-foreground/55" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />

            {/* ── Panel 2: Annealing 55°C ────────────────────────── */}
            <text x="180" y="50" textAnchor="middle" className="fill-primary"
                  style={{ font: "600 9px ui-monospace, monospace", letterSpacing: "0.12em" }}>
              55°C
            </text>
            <line x1="140" y1="92" x2="220" y2="92"
                  className="stroke-primary" strokeWidth={1.6} strokeLinecap="round" />
            <line x1="200" y1="92" x2="220" y2="92"
                  className="stroke-chart-2" strokeWidth={4} strokeLinecap="round" />
            <line x1="140" y1="112" x2="220" y2="112"
                  className="stroke-primary" strokeWidth={1.6} strokeLinecap="round" />
            <line x1="140" y1="112" x2="160" y2="112"
                  className="stroke-chart-2" strokeWidth={4} strokeLinecap="round" />
            <text x="180" y="170" textAnchor="middle" className="fill-muted-foreground"
                  style={{ font: "italic 11px var(--font-display, serif)" }}>
              annealing
            </text>

            <path d="M 226 100 H 246" className="stroke-foreground/55" strokeWidth={1.4} strokeLinecap="round" />
            <path d="M 242 96 L 248 100 L 242 104" fill="none"
                  className="stroke-foreground/55" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />

            {/* ── Panel 3: Extension 72°C ────────────────────────── */}
            <text x="296" y="50" textAnchor="middle" className="fill-primary"
                  style={{ font: "600 9px ui-monospace, monospace", letterSpacing: "0.12em" }}>
              72°C
            </text>
            <line x1="252" y1="92" x2="340" y2="92"
                  className="stroke-primary" strokeWidth={2} strokeLinecap="round" />
            <line x1="252" y1="92" x2="270" y2="92"
                  className="stroke-chart-2" strokeWidth={4} strokeLinecap="round" />
            <circle cx="328" cy="92" r="6.5"
                    className="fill-chart-3/30 stroke-chart-3" strokeWidth={1.4} />
            <line x1="252" y1="112" x2="340" y2="112"
                  className="stroke-primary" strokeWidth={2} strokeLinecap="round" />
            <line x1="322" y1="112" x2="340" y2="112"
                  className="stroke-chart-2" strokeWidth={4} strokeLinecap="round" />
            <circle cx="264" cy="112" r="6.5"
                    className="fill-chart-3/30 stroke-chart-3" strokeWidth={1.4} />
            <text x="296" y="170" textAnchor="middle" className="fill-muted-foreground"
                  style={{ font: "italic 11px var(--font-display, serif)" }}>
              extension
            </text>

            <text x="350" y="190" textAnchor="end"
                  className="fill-muted-foreground/70"
                  style={{ font: "italic 9px var(--font-display, serif)" }}>
              × 30 cycles
            </text>
          </svg>

          <div className="absolute right-10 top-10 animate-float-soft text-primary">
            <MousePointer2 className="h-4 w-4 -rotate-12 fill-primary" strokeWidth={1} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Workflow (animated demo) ─────────────────────────────────────────────────
function Workflow() {
  return (
    <section
      id="how-it-works"
      className="hairline-t bg-paper-grain-veil px-6 py-24"
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <div className="mb-14 grid grid-cols-12 gap-x-6 items-baseline">
            <div className="col-span-12 md:col-span-8">
              <h2 className="font-display text-[44px] leading-[1.02] tracking-[-0.02em] text-foreground md:text-[60px]">
                The workflow,
                <br />
                <span className="italic text-muted-foreground">drafted in real time.</span>
              </h2>
            </div>
            <p className="text-[13.5px] leading-relaxed text-muted-foreground col-span-12 mt-4 md:col-span-4 md:mt-0">
              The plate below auto-plays a full session — pick a cell, place
              a receptor, bind a ligand, label, export — on a loop while you
              read.
            </p>
          </div>
        </Reveal>

        <HowItWorksDemo />
      </div>
    </section>
  );
}

// ─── Pull-quote coda ──────────────────────────────────────────────────────────
function PullQuote() {
  return (
    <section className="hairline-t px-6 py-28">
      <div className="mx-auto max-w-[1240px] grid grid-cols-12 gap-x-6">
        <div className="col-span-12 lg:col-span-10">
          <blockquote className="font-display text-[40px] leading-[1.05] tracking-[-0.02em] text-foreground text-balance md:text-[64px]">
            <span aria-hidden className="ink-stamp mr-2">&ldquo;</span>
            Make the figure your paper{" "}
            <span className="italic text-muted-foreground">deserves.</span>
            <span aria-hidden className="ink-stamp ml-1">&rdquo;</span>
          </blockquote>

          <p className="mt-6 max-w-[56ch] text-[15px] leading-[1.6] text-muted-foreground">
            Free to start. No watermarks. No upsell modal halfway through your
            draft. Built by people who&apos;ve sat through one too many ugly
            conference posters.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-sm px-5 text-[14px] gap-2",
              )}
            >
              Start drawing
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/templates"
              className="group inline-flex items-center gap-2 text-[14px] text-foreground"
            >
              <span className="underline-rule">Browse templates</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="col-span-12 mt-6 lg:col-span-2 lg:mt-0 lg:text-right lg:self-start">
          <p className="colophon">
            Set in Instrument Serif
            <br />
            &amp; Geist
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Colophon (footer) ────────────────────────────────────────────────────────
function Colophon() {
  return (
    <footer className="hairline-t bg-paper-grain-scrim px-6 py-14">
      <div className="mx-auto max-w-[1240px]">
        {/* Big wordmark, set as if it were a printed seal. */}
        <div className="hairline-b pb-10">
          <p className="font-display text-[18vw] leading-[0.85] tracking-[-0.04em] text-foreground sm:text-[120px] md:text-[160px]">
            Canvas
            <span className="italic font-normal text-muted-foreground">/bio</span>
          </p>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-8">
          <div className="col-span-12 md:col-span-4">
            <p className="meta-mono mb-3">Imprint</p>
            <p className="max-w-[40ch] text-[13px] leading-[1.6] text-muted-foreground">
              A studio for clear scientific figures. Drafted as a learning
              project by Tahmid; not affiliated with BioRender or any of the
              big incumbents.
            </p>
          </div>

          <ColophonCol
            title="Product"
            links={[
              ["Examples",     "#showcase"],
              ["Features",     "#features"],
              ["Workflow",     "#how-it-works"],
              ["Templates",    "/templates"],
              ["Community",    "/community"],
            ]}
          />
          <ColophonCol
            title="Account"
            links={[
              ["Log in",    "/login"],
              ["Sign up",   "/signup"],
              ["Dashboard", "/dashboard"],
            ]}
          />
          <ColophonCol
            title="Legal"
            links={[
              ["Privacy", "#"],
              ["Terms",   "#"],
              ["Contact", "#"],
            ]}
          />
        </div>

        <div className="mt-10 hairline-t pt-4 flex flex-wrap items-baseline justify-between gap-y-1 colophon">
          <span>
            © 2026 Canvas.bio &nbsp;·&nbsp; ed. 02 &nbsp;·&nbsp; set on warm paper
          </span>
          <span className="tnum">№ 0001 / 0001</span>
        </div>
      </div>
    </footer>
  );
}

function ColophonCol({
  title, links,
}: { title: string; links: [string, string][] }) {
  return (
    <div className="col-span-6 md:col-span-2 md:col-start-auto">
      <p className="meta-mono mb-3">{title}</p>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="text-[13px] text-foreground/85 transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="relative z-[1] flex min-h-screen flex-col">
      <Masthead />
      <main className="flex-1">
        <OpeningSpread />
        <ScrollMorphShowcase />
        <FeaturesShowcase />
        <Workflow />
        <UseCases />
        <PullQuote />
      </main>
      <Colophon />
    </div>
  );
}
