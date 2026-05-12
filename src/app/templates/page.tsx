import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Templates — Canvas.bio",
  description:
    "Curated starting points for scientific figures: signalling pathways, workflows, comparisons.",
};

export default function TemplatesPage() {
  // Group templates by category for the gallery layout.
  const grouped = TEMPLATES.reduce<Record<string, typeof TEMPLATES>>((acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  }, {});

  const total = TEMPLATES.length;

  return (
    <div className="min-h-screen bg-paper-grain">
      {/* Masthead — flat, no glass. */}
      <header className="sticky top-0 z-10 bg-paper-grain hairline-b">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 pt-3 pb-2 colophon">
          <span>Catalogue · ed. 02</span>
          <span className="hidden sm:inline tnum">{String(total).padStart(3, "0")} entries</span>
        </div>
        <div className="hairline-t">
          <div className="mx-auto flex h-13 max-w-[1240px] items-center justify-between gap-4 px-6 py-3">
            <Logo size="sm" />
            <div className="flex items-center gap-4">
              <Link
                href="/community"
                className="hidden text-[12.5px] text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Community
              </Link>
              <Link
                href="/community/submit"
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "h-8 gap-1.5 rounded-sm px-3 text-[12px]",
                )}
              >
                <Plus className="h-3.5 w-3.5" />
                Submit a template
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Workspace
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-6 py-20">
        {/* Title block — asymmetric, hairline-divided. */}
        <div className="grid grid-cols-12 gap-x-6 items-end pb-10 hairline-b">
          <div className="col-span-12 md:col-span-8">
            <p className="meta-mono mb-4">
              <span className="ink-stamp">✱</span> § 03 — Catalogue
            </p>
            <h1 className="font-display text-[52px] leading-[0.95] tracking-[-0.025em] text-foreground md:text-[88px]">
              Start from somewhere
              <br />
              <span className="italic text-muted-foreground">considered.</span>
            </h1>
          </div>
          <div className="col-span-12 mt-6 md:col-span-4 md:mt-0">
            <p className="max-w-[40ch] text-[14px] leading-relaxed text-muted-foreground">
              Hand-composed starting points for the figures we draw most often.
              Each one opens in the editor as a fully editable canvas —
              recolour, relabel, or strip back to the bones.
            </p>
            <p className="colophon mt-4">
              <span className="tnum">{String(total).padStart(2, "0")}</span> entries ·{" "}
              <span className="tnum">{Object.keys(grouped).length}</span> categories
            </p>
          </div>
        </div>

        {/* Categories — each its own little plate. */}
        <div className="space-y-20 pt-14">
          {Object.entries(grouped).map(([category, items], catIdx) => (
            <section key={category}>
              <div className="mb-8 grid grid-cols-12 gap-x-6 items-baseline">
                <h2 className="col-span-9 font-display text-[28px] leading-tight text-foreground md:text-[36px]">
                  <span className="index-num tnum mr-3">
                    № {String(catIdx + 1).padStart(2, "0")}
                  </span>
                  {category}
                </h2>
                <span className="col-span-3 text-right colophon tnum">
                  {String(items.length).padStart(2, "0")} entr{items.length !== 1 ? "ies" : "y"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 hairline-box">
                {items.map((t, i) => (
                  <TemplateCard key={t.id} template={t} index={i + 1} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

function TemplateCard({
  template, index,
}: { template: typeof TEMPLATES[number]; index: number }) {
  const { Preview } = template;
  return (
    <Link
      href={`/editor?template=${template.id}`}
      className={cn(
        "group relative flex flex-col bg-background",
        "transition-colors hover:bg-paper-grain",
      )}
    >
      <div className="relative flex h-48 items-center justify-center hairline-b bg-paper-grain p-6">
        <Preview />
        <span className="absolute left-2 top-2 colophon tnum">
          Pl. {String(index).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[20px] leading-tight text-foreground">
            {template.title}
          </h3>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-foreground"
            strokeWidth={1.5}
          />
        </div>
        <p className="text-[13.5px] leading-[1.55] text-muted-foreground">
          {template.description}
        </p>
      </div>

      {/* Editorial hover-mark — a thin rule lining the bottom edge when
          the card is hovered. */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-0 bg-foreground transition-all duration-500 group-hover:w-full"
      />
    </Link>
  );
}
