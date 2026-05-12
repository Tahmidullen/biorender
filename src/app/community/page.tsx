// Community landing page — editorial edition.
//
// Lists the templates that other users have submitted AND that an admin
// approved (status = 'approved'). Submissions live in a Supabase table
// called `template_submissions` (see /community/submit/page.tsx for the
// schema). Until anyone has submitted anything, this page renders an
// empty state inviting the visitor to be the first contributor.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus, ShieldCheck, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Community templates — Canvas.bio",
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
  // the whole page — we just show the empty state instead.
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
      {/* Masthead */}
      <header className="sticky top-0 z-10 bg-paper-grain hairline-b">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 pt-3 pb-2 colophon">
          <span>Community · ed. 02</span>
          <span className="hidden sm:inline tnum">
            {String(templates.length).padStart(3, "0")} approved
          </span>
        </div>
        <div className="hairline-t">
          <div className="mx-auto flex h-13 max-w-[1240px] items-center justify-between gap-4 px-6 py-3">
            <Logo size="sm" />
            <div className="flex items-center gap-4">
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
                href="/"
                className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-6 py-20">
        {/* Title block — asymmetric */}
        <div className="grid grid-cols-12 gap-x-6 items-end pb-10 hairline-b">
          <div className="col-span-12 md:col-span-8">
            <p className="meta-mono mb-4">
              <span className="ink-stamp">✱</span> § 04 — Community
            </p>
            <h1 className="font-display text-[52px] leading-[0.95] tracking-[-0.025em] text-foreground md:text-[88px]">
              Templates by
              <br />
              <span className="italic text-muted-foreground">the people who use them.</span>
            </h1>
          </div>
          <div className="col-span-12 mt-6 md:col-span-4 md:mt-0">
            <p className="max-w-[44ch] text-[14px] leading-relaxed text-muted-foreground">
              Submit a figure you keep redrawing. We review every submission
              for clarity and accuracy, then publish it here for the rest of
              the community to remix.
            </p>
            <Link
              href="/community/submit"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 h-11 gap-2 rounded-sm px-5 text-[14px]",
              )}
            >
              <Plus className="h-4 w-4" />
              Submit a template
            </Link>
          </div>
        </div>

        {/* How it works — three numbered editorial cells, hairline-divided */}
        <div className="mt-12 hairline-box bg-border grid grid-cols-1 gap-px md:grid-cols-3">
          {[
            { Icon: Send,         n: "01", title: "Submit",  body: "Describe your figure and what it's for. Attach a preview if you can." },
            { Icon: ShieldCheck,  n: "02", title: "Review",  body: "We check for scientific accuracy and visual clarity. Usually within a week." },
            { Icon: Sparkles,     n: "03", title: "Publish", body: "Approved templates appear below, credited to you, free for anyone to use." },
          ].map(({ Icon, n, title, body }) => (
            <div key={n} className="bg-background p-6">
              <div className="flex items-baseline gap-3">
                <span className="index-num tnum">№ {n}</span>
                <Icon className="h-4 w-4 text-foreground/70" strokeWidth={1.5} />
              </div>
              <h3 className="mt-3 font-display text-[24px] leading-tight text-foreground">{title}</h3>
              <p className="mt-2 max-w-[34ch] text-[13.5px] leading-[1.55] text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* Approved submissions */}
        <section className="mt-20">
          <div className="mb-8 grid grid-cols-12 gap-x-6 items-baseline">
            <h2 className="col-span-9 font-display text-[28px] leading-tight text-foreground md:text-[36px]">
              <span className="index-num tnum mr-3">§</span>
              Approved submissions
            </h2>
            <span className="col-span-3 text-right colophon tnum">
              {String(templates.length).padStart(2, "0")} template{templates.length !== 1 ? "s" : ""}
            </span>
          </div>

          {templates.length === 0 ? (
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-12 md:col-span-7 md:col-start-3">
                <p className="meta-mono mb-3">
                  <span className="ink-stamp">✱</span> Empty file
                </p>
                <h3 className="font-display text-[32px] leading-[1.05] text-foreground md:text-[44px]">
                  No submissions{" "}
                  <span className="italic text-muted-foreground">yet.</span>
                </h3>
                <p className="mt-4 max-w-[48ch] text-[14.5px] leading-relaxed text-muted-foreground">
                  Be the first to share a template. It might end up cited in
                  someone&apos;s thesis.
                </p>
                <Link
                  href="/community/submit"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "mt-6 h-11 gap-2 rounded-sm px-5 text-[14px]",
                  )}
                >
                  <Plus className="h-4 w-4" />
                  Submit the first one
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 hairline-box">
              {templates.map((t, i) => (
                <CommunityCard key={t.id} template={t} index={i + 1} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function CommunityCard({
  template, index,
}: { template: CommunityTemplate; index: number }) {
  return (
    <Link
      href={`/editor?community=${template.id}`}
      className="group relative flex flex-col bg-background transition-colors hover:bg-paper-grain"
    >
      <div className="relative flex h-48 items-center justify-center hairline-b bg-paper-grain p-6">
        {template.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={template.preview}
            alt={template.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <Sparkles className="h-7 w-7 text-muted-foreground/40" strokeWidth={1.4} />
        )}
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
        <p className="colophon mt-2">
          {template.category}{template.contributor ? ` · by ${template.contributor}` : ""}
        </p>
      </div>

      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-0 bg-foreground transition-all duration-500 group-hover:w-full"
      />
    </Link>
  );
}
