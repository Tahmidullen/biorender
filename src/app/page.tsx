import Link from "next/link";
import {
  ArrowRight,
  Check,
  MousePointer2,
  Atom,
  FileDown,
  Cloud,
  LayoutTemplate,
  Wand2,
  Sparkles,
  Hexagon,
  Dna,
  Microscope,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/Logo";

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const links: { href: string; label: string; external?: boolean }[] = [
    { href: "#features",     label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "/templates",    label: "Templates", external: true },
    { href: "#pricing",      label: "Pricing" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Logo size="md" />

        <div className="hidden items-center gap-7 text-[13px] font-medium text-muted-foreground md:flex">
          {links.map((l) =>
            l.external ? (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ) : (
              <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
                {l.label}
              </a>
            ),
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-[13px]")}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "sm" }),
              "text-[13px] gap-1.5 shadow-[0_6px_16px_-8px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
            )}
          >
            Start free
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative overflow-hidden px-6 pt-24 pb-32"
      style={{ background: "var(--gradient-paper)" }}
    >
      {/* Hairline grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--ink) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--ink) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur">
          <Sparkles className="h-3 w-3 text-primary" />
          A studio for scientific figures
        </div>

        <h1 className="font-display text-5xl leading-[1.05] text-balance text-foreground md:text-[68px] md:leading-[1.02]">
          Beautiful science figures,
          <br className="hidden sm:block" />{" "}
          <span className="italic text-primary">drafted in minutes.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-muted-foreground">
          A focused editor with a vetted library of scientifically accurate
          shapes — built for researchers who care how their work looks on the page.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 px-7 text-[15px] gap-2 shadow-[0_12px_28px_-12px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
            )}
          >
            Open the editor
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how-it-works"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 px-7 text-[15px] border-border/80 bg-background/60 backdrop-blur",
            )}
          >
            See how it works
          </a>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-muted-foreground">
          {["No credit card", "Free forever plan", "Export at 300 dpi"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" />
              {t}
            </span>
          ))}
        </div>

        {/* Editor mockup */}
        <div className="relative mt-16">
          <EditorMockup />
        </div>
      </div>
    </section>
  );
}

function EditorMockup() {
  return (
    <div className="surface-lifted hairline overflow-hidden text-left">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border/70 bg-muted/40 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="ml-3 font-mono text-[11px] text-muted-foreground">
          mitochondrial-pathway · untitled
        </span>
      </div>

      <div className="grid grid-cols-[180px_1fr] min-h-[300px]">
        {/* Sidebar */}
        <aside className="border-r border-border/70 bg-muted/30 p-3">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Library
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {[Hexagon, Dna, Atom, Microscope, FlaskConical, Sparkles].map((I, i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center rounded-md border border-border/70 bg-background text-foreground/70"
              >
                <I className="h-4 w-4" strokeWidth={1.6} />
              </div>
            ))}
          </div>
        </aside>

        {/* Canvas */}
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

            <ellipse cx="100" cy="100" rx="62" ry="48"
              className="fill-primary/10 stroke-primary/70" strokeWidth="1.5" />
            <circle cx="92" cy="98" r="14" className="fill-primary/30 stroke-primary" strokeWidth="1.2" />
            <ellipse cx="118" cy="110" rx="9" ry="5" className="fill-foreground/10 stroke-foreground/40" strokeWidth="1" />

            <path d="M170 100 H230" stroke="currentColor" className="text-foreground/60" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M225 95 L235 100 L225 105" stroke="currentColor" className="text-foreground/60" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            <g transform="translate(248,72)">
              <rect width="84" height="56" rx="22" className="fill-[oklch(0.92_0.06_60)] stroke-[oklch(0.55_0.13_60)]" strokeWidth="1.4" />
              {Array.from({ length: 5 }).map((_, i) => (
                <path key={i} d={`M${10 + i * 16} 8 Q${18 + i * 16} 28 ${10 + i * 16} 48`}
                  className="stroke-[oklch(0.55_0.13_60)]" strokeWidth="1.2" fill="none" />
              ))}
            </g>

            <text x="100" y="166" textAnchor="middle" className="fill-muted-foreground" style={{ font: "italic 10px var(--font-display, serif)" }}>
              cell
            </text>
            <text x="290" y="148" textAnchor="middle" className="fill-muted-foreground" style={{ font: "italic 10px var(--font-display, serif)" }}>
              mitochondrion
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

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  { Icon: MousePointer2, title: "Direct manipulation", body: "A precise canvas with snapping, alignment, and pixel-perfect handles. No menus to hunt through." },
  { Icon: Atom,          title: "7,000+ vetted shapes", body: "Cell biology, microbiology, lab apparatus, signalling — drawn to a consistent visual language." },
  { Icon: FileDown,      title: "Publication exports", body: "PNG, SVG, and PDF at print resolution. Vector geometry preserved for journals." },
  { Icon: Cloud,         title: "Quiet autosave",      body: "Your figure is persisted as you work. Pick up on any device, no save button required." },
  { Icon: LayoutTemplate,title: "Starter templates",   body: "Pathways, workflows, schematics — a curated set of starting points instead of a blank page." },
  { Icon: Wand2,         title: "Recolour anything",   body: "Restyle a whole figure with a single palette change. Themes are first-class, not an afterthought." },
];

function Features() {
  return (
    <section id="features" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Features"
          title="Designed for the page, not the demo."
          subtitle="The minimum surface area you need to build a clear, accurate scientific figure — and nothing more."
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, body }) => (
            <div key={title} className="group bg-background p-7 transition-colors hover:bg-muted/40">
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-accent text-accent-foreground">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </div>
              <h3 className="font-display text-[20px] leading-tight text-foreground">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
const steps = [
  { n: "01", title: "Open the editor",      body: "Sign up in seconds — no card, no setup. The canvas opens instantly." },
  { n: "02", title: "Compose your figure",  body: "Drag from the library, snap to the grid, label and recolour as you go." },
  { n: "03", title: "Export and publish",   body: "Download a vector or print-ready raster. Drop it straight into your manuscript." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-muted/30 px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Workflow"
          title="Three steps. Then back to the science."
        />

        <ol className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute left-12 right-0 top-5 hidden h-px bg-border md:block" />
              )}
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background font-mono text-[12px] font-medium tracking-wide text-foreground">
                {s.n}
              </div>
              <h3 className="font-display text-[22px] leading-tight text-foreground">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CtaBanner() {
  return (
    <section className="px-6 py-24">
      <div
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl px-10 py-16 text-center"
        style={{
          background: "var(--gradient-ink)",
          boxShadow: "var(--shadow-lifted)",
        }}
      >
        <h2 className="font-display text-4xl text-balance md:text-5xl"
            style={{ color: "var(--paper)" }}>
          Make the figure your paper deserves.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed"
           style={{ color: "color-mix(in oklab, var(--paper) 75%, transparent)" }}>
          Free to start. No watermarks. Built by people who&apos;ve sat through
          one too many ugly conference posters.
        </p>
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "mt-8 h-12 px-7 text-[15px] gap-2 bg-background text-foreground hover:bg-background/90",
          )}
        >
          Start drawing
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo size="md" />
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              A studio for clear scientific figures. Built as a learning project
              by Tahmid.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-[13px] sm:grid-cols-3">
            <FooterCol title="Product" links={[
              ["Features", "#features"],
              ["How it works", "#how-it-works"],
              ["Templates", "/templates"],
            ]} />
            <FooterCol title="Account" links={[
              ["Log in",    "/login"],
              ["Sign up",   "/signup"],
              ["Dashboard", "/dashboard"],
            ]} />
            <FooterCol title="Legal" links={[
              ["Privacy", "#"],
              ["Terms",   "#"],
              ["Contact", "#"],
            ]} />
          </div>
        </div>

        <Separator className="my-10" />

        <p className="text-center text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          © 2026 Canvas.bio · A practice project, not affiliated with BioRender
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">{title}</p>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionHeading({
  eyebrow, title, subtitle,
}: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl leading-[1.1] text-balance text-foreground md:text-[44px]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-paper-grain">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
