import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Plus } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Templates — Canvas",
  description:
    "Curated starting points for scientific figures: signalling pathways, workflows, comparisons.",
};

export default function TemplatesPage() {
  const grouped = TEMPLATES.reduce<Record<string, typeof TEMPLATES>>((acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-paper-grain">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <Link
              href="/community"
              className="hidden text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Community
            </Link>
            <Link
              href="/community/submit"
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "h-8 gap-1.5 text-[12px]",
              )}
            >
              <Plus className="h-3.5 w-3.5" />
              Submit a template
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Workspace
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3 w-3" />
            Templates
          </p>
          <h1 className="font-display text-5xl leading-[1.05] text-foreground md:text-6xl">
            Start from somewhere{" "}
            <span className="italic text-primary">considered.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Hand-composed starting points for the figures we draw most often.
            Each one opens in the editor as a fully editable canvas — recolour,
            relabel, or strip back to the bones.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="font-display text-[22px] text-foreground">{category}</h2>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {items.length} template{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((t) => (
                  <TemplateCard key={t.id} template={t} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

function TemplateCard({ template }: { template: typeof TEMPLATES[number] }) {
  const { Preview } = template;
  return (
    <Link
      href={`/editor?template=${template.id}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-border/70 bg-surface",
        "transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]",
      )}
    >
      <div className="flex h-44 items-center justify-center border-b border-border/70 bg-muted/30 p-6">
        <Preview />
      </div>

      <div className="space-y-1.5 px-5 pt-4 pb-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-[19px] leading-tight text-foreground">
            {template.title}
          </h3>
          <ArrowRight
            className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
            strokeWidth={1.6}
          />
        </div>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {template.description}
        </p>
      </div>
    </Link>
  );
}
