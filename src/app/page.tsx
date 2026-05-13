import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { HowItWorksDemo } from "@/components/HowItWorksDemo";
import { UseCases } from "@/components/UseCases";
import { Reveal } from "@/components/Reveal";
import { FeaturesShowcase } from "@/components/FeaturesShowcase";
import { ScrollMorphShowcase } from "@/components/ScrollMorphShowcase";
import { AnimatedBrandMark } from "@/components/AnimatedBrandMark";
import { FigureCopilotSpotlight } from "@/components/FigureCopilotSpotlight";

function Masthead() {
  const links: { href: string; label: string; external?: boolean }[] = [
    { href: "#figure-copilot", label: "Copilot" },
    { href: "#showcase", label: "Examples" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "/templates", label: "Templates", external: true },
    { href: "/community", label: "Community", external: true },
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
            Try the editor
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function OpeningSpread() {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_60%_at_15%_10%,oklch(0.9_0.06_76/0.45),transparent_55%)] bg-no-repeat dark:bg-[radial-gradient(ellipse_90%_60%_at_15%_10%,oklch(0.28_0.04_72/0.45),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_45%,oklch(0.42_0.08_146/0.12),transparent_50%)] dark:bg-[radial-gradient(circle_at_85%_45%,oklch(0.55_0.1_146/0.18),transparent_50%)]"
      />

      <div className="mx-auto max-w-[1240px]">
        <h1 className="font-display text-[12vw] font-semibold leading-[0.92] tracking-[-0.03em] text-foreground sm:text-[96px] md:text-[120px] lg:text-[140px]">
          Science figures,
          <br />
          <span className="text-primary">minus the fuss.</span>
        </h1>

        <div className="mt-12 h-px w-full max-w-[640px] origin-left bg-foreground/80 animate-rule-sweep" />

        <div className="mt-10 grid grid-cols-12 gap-x-6">
          <p className="col-span-12 max-w-[52ch] text-pretty text-[17px] leading-[1.5] text-foreground/85 md:col-span-8">
            Icons, arrows, and a canvas that behaves — whether you&apos;re wiring a poster for class or a figure for review.
            Figure Copilot is optional: Creator mode drafts from your description; Consultant mode chats back about what to fix.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="inline-flex items-center gap-2 rounded-sm border border-primary/35 bg-primary/10 px-3 py-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-primary">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
            Copilot · Creator / Consultant
          </span>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 rounded-sm px-5 text-[14px] gap-2",
            )}
          >
            Start free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <FigureCopilotSpotlight className="mt-16" />
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section id="how-it-works" className="hairline-t bg-paper-grain-veil px-6 py-24">
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <div className="mb-14 grid grid-cols-12 gap-x-6 items-baseline">
            <div className="col-span-12 md:col-span-8">
              <h2 className="font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-foreground md:text-[60px]">
                See it once,
                <br />
                <span className="text-primary">then try it.</span>
              </h2>
            </div>
            <p className="text-[14px] leading-relaxed text-muted-foreground col-span-12 mt-4 md:col-span-4 md:mt-0">
              A quick loop: grab symbols, connect them, export. Copilot is there when you want help sketching or another pair of eyes.
            </p>
          </div>
        </Reveal>

        <HowItWorksDemo />
      </div>
    </section>
  );
}

function ClosingBand() {
  return (
    <section className="hairline-t bg-gradient-to-br from-secondary/[0.42] via-background to-primary/[0.09] px-6 py-28 dark:from-secondary/[0.24] dark:via-background dark:to-primary/[0.14]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-12 gap-x-6 gap-y-8">
        <div className="col-span-12 lg:col-span-8">
          <p className="meta-mono mb-4 text-primary">Why Canvas</p>
          <h2 className="font-display text-balance text-[38px] font-semibold leading-[1.06] tracking-[-0.02em] text-foreground md:text-[56px]">
            Looks sharp on screen — holds up on paper.
          </h2>

          <p className="mt-6 max-w-[48ch] text-[15px] leading-[1.6] text-muted-foreground">
            Free to start. No watermark stamped across your work.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-sm px-5 text-[14px] gap-2",
              )}
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/templates"
              className="group inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
            >
              <span className="underline-rule">Browse templates</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="col-span-12 flex flex-col justify-end border-l border-border/80 pl-6 lg:col-span-4 lg:border-l-0 lg:pl-0 lg:pt-4">
          <p className="meta-mono mb-2 text-muted-foreground">Nice type</p>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Readable up close on a PDF and from the back row on a slide.
          </p>
        </div>
      </div>
    </section>
  );
}

function Colophon() {
  return (
    <footer className="hairline-t bg-paper-grain-scrim px-6 py-14">
      <div className="mx-auto max-w-[1240px]">
        <div className="hairline-b pb-10">
          <AnimatedBrandMark />
        </div>

        <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-8">
          <div className="col-span-12 md:col-span-4">
            <p className="meta-mono mb-3">About</p>
            <p className="max-w-[40ch] text-[13px] leading-[1.6] text-muted-foreground">
              Canvas.bio is a side project by Tahmid — a friendlier place to draw science figures. Not affiliated with BioRender.
            </p>
          </div>

          <ColophonCol
            title="Explore"
            links={[
              ["Figure Copilot", "#figure-copilot"],
              ["Examples", "#showcase"],
              ["Features", "#features"],
              ["How it works", "#how-it-works"],
              ["Templates", "/templates"],
              ["Community", "/community"],
            ]}
          />
          <ColophonCol
            title="Account"
            links={[
              ["Log in", "/login"],
              ["Sign up", "/signup"],
              ["Dashboard", "/dashboard"],
            ]}
          />
          <ColophonCol
            title="Legal"
            links={[
              ["Privacy", "#"],
              ["Terms", "#"],
              ["Contact", "#"],
            ]}
          />
        </div>

        <div className="mt-10 hairline-t pt-4 colophon">
          <span>© 2026 Canvas.bio</span>
        </div>
      </div>
    </footer>
  );
}

function ColophonCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
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
        <ClosingBand />
      </main>
      <Colophon />
    </div>
  );
}
