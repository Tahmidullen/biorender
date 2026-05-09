// Community landing page.
//
// Lists the templates that other users have submitted AND that have been
// approved by an admin. Submissions live in a Supabase table called
// `template_submissions` (see /community/submit/page.tsx for the schema)
// and are filtered here by `status = 'approved'`.
//
// Until anyone has submitted anything, this page renders an empty state
// inviting the visitor to be the first contributor.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus, Users, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Community templates — Canvas",
  description:
    "Templates contributed by Canvas users. Reviewed by the team, shared with everyone.",
};

type CommunityTemplate = {
  id: string;
  title: string;
  description: string;
  category: string;
  contributor: string | null;
  preview: string | null;
  created_at: string;
};

async function loadApprovedTemplates(): Promise<CommunityTemplate[]> {
  // We catch the error so a missing table (during local dev) doesn't 500
  // the whole page. We just show the empty state instead.
  try {
    const { data } = await supabase
      .from("template_submissions")
      .select("id, title, description, category, contributor, preview, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function CommunityPage() {
  const templates = await loadApprovedTemplates();

  return (
    <div className="min-h-screen bg-paper-grain">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Logo size="sm" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Hero */}
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Users className="h-3 w-3" />
              Community
            </p>
            <h1 className="font-display text-5xl leading-[1.05] text-foreground md:text-6xl">
              Templates by{" "}
              <span className="italic text-primary">the people who use them.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              Submit a figure you keep redrawing. We review every submission for
              clarity and accuracy, then publish it here for the rest of the
              community to remix.
            </p>
          </div>

          <Link
            href="/community/submit"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 gap-2 px-6 text-[14px] shadow-[0_12px_28px_-12px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
            )}
          >
            <Plus className="h-4 w-4" />
            Submit a template
          </Link>
        </div>

        {/* How it works (mini) */}
        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {[
            { Icon: Plus,        title: "1. Submit",  body: "Describe your figure and what it’s for. Attach a preview if you can." },
            { Icon: ShieldCheck, title: "2. Review",  body: "We check for scientific accuracy and visual clarity. Usually within a week." },
            { Icon: Sparkles,    title: "3. Publish", body: "Approved templates appear here, credited to you, free for anyone to use." },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="bg-background p-6">
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-accent text-primary">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </div>
              <h3 className="font-display text-[18px] leading-tight text-foreground">{title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        {/* Approved templates grid OR empty state */}
        <div className="mt-16">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-[22px] text-foreground">Approved submissions</h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {templates.length} template{templates.length !== 1 ? "s" : ""}
            </span>
          </div>

          {templates.length === 0 ? (
            <div className="surface-elegant hairline mx-auto max-w-md py-14 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-accent text-primary">
                <Sparkles className="h-6 w-6" strokeWidth={1.6} />
              </div>
              <h3 className="font-display text-2xl text-foreground">No submissions yet</h3>
              <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                Be the first to share a template. It might end up cited in
                someone&apos;s thesis.
              </p>
              <Link
                href="/community/submit"
                className={cn(buttonVariants({ size: "lg" }), "mt-6 h-11 gap-2 px-5 text-[14px]")}
              >
                <Plus className="h-4 w-4" />
                Submit the first one
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((t) => (
                <CommunityCard key={t.id} template={t} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function CommunityCard({ template }: { template: CommunityTemplate }) {
  return (
    <Link
      href={`/editor?community=${template.id}`}
      className="group block overflow-hidden rounded-xl border border-border/70 bg-surface transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]"
    >
      <div className="flex h-44 items-center justify-center border-b border-border/70 bg-muted/30 p-6">
        {template.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={template.preview} alt={template.title} className="h-full w-full object-contain" />
        ) : (
          <Sparkles className="h-7 w-7 text-muted-foreground/40" strokeWidth={1.4} />
        )}
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
        <p className="text-[13px] leading-relaxed text-muted-foreground">{template.description}</p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
          {template.category}{template.contributor ? ` · by ${template.contributor}` : ""}
        </p>
      </div>
    </Link>
  );
}
