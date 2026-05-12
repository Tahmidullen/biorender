"use client";

// Community template submission form — editorial edition.
//
// Inserts a row into the Supabase `template_submissions` table with status
// `pending`. An admin can later flip status to `approved` (it then appears
// on /community) or `rejected`.
//
// ─── Required Supabase table (run once in the SQL editor) ─────────────────
// create table template_submissions (
//   id           uuid primary key default gen_random_uuid(),
//   user_id      uuid references auth.users(id),
//   contributor  text,
//   title        text not null,
//   description  text not null,
//   category     text not null,
//   notes        text,
//   preview      text,                                -- data-URL or storage URL
//   status       text not null default 'pending',     -- 'pending' | 'approved' | 'rejected'
//   created_at   timestamptz not null default now()
// );
// alter table template_submissions enable row level security;
// create policy "anyone can read approved" on template_submissions
//   for select using (status = 'approved');
// create policy "users can submit" on template_submissions
//   for insert to authenticated with check (auth.uid() = user_id);
// ─────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";

const CATEGORIES = ["Signalling", "Workflow", "Comparison", "Schematic", "Other"] as const;

export default function SubmitTemplatePage() {
  const router = useRouter();
  const [userId,   setUserId]   = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  const [title,        setTitle]        = useState("");
  const [description,  setDescription]  = useState("");
  const [category,     setCategory]     = useState<string>(CATEGORIES[0]);
  const [contributor,  setContributor]  = useState("");
  const [notes,        setNotes]        = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [submitted,  setSubmitted]  = useState(false);

  // Require login so we can credit submissions and prevent spam.
  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data }) => {
        if (!data.user) {
          router.replace("/login?next=/community/submit");
          return;
        }
        setUserId(data.user.id);
        setContributor(data.user.email?.split("@")[0] ?? "");
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setSubmitting(true);
    setError(null);

    const { error: insertErr } = await supabase
      .from("template_submissions")
      .insert({
        user_id:     userId,
        contributor: contributor.trim() || null,
        title:       title.trim(),
        description: description.trim(),
        category,
        notes:       notes.trim() || null,
        status:      "pending",
      });

    setSubmitting(false);

    if (insertErr) {
      // Most common: the table doesn't exist yet. Show a helpful message
      // rather than the raw error.
      setError(
        insertErr.message.includes("does not exist")
          ? "Submissions aren't enabled yet — the database table hasn't been created. Ask the admin to run the SQL in the file header."
          : insertErr.message,
      );
      return;
    }

    setSubmitted(true);
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-grain">
        <Loader2 className="h-6 w-6 animate-spin text-primary" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-grain">
      {/* Masthead */}
      <header className="sticky top-0 z-10 bg-paper-grain hairline-b">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-6 pt-3 pb-2 colophon">
          <span>New submission · ed. 02</span>
          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 text-[10.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to community
          </Link>
        </div>
        <div className="hairline-t">
          <div className="mx-auto flex h-13 max-w-[900px] items-center justify-between px-6 py-3">
            <Logo size="sm" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-6 py-16">
        {submitted ? (
          <div className="hairline-t hairline-b py-12">
            <p className="meta-mono mb-4">
              <span className="ink-stamp">✱</span> Submitted for review
            </p>
            <h1 className="font-display text-[44px] leading-[1.02] tracking-[-0.02em] text-foreground md:text-[60px]">
              Thanks — that&apos;s
              <br />
              <span className="italic text-muted-foreground">on the desk.</span>
            </h1>
            <div className="mt-6 hairline-t pt-5">
              <p className="flex items-baseline gap-2 text-[14px] leading-relaxed text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 translate-y-0.5 text-foreground" strokeWidth={1.5} />
                <span>
                  We&apos;ll review your template within a week. If it&apos;s
                  approved it&apos;ll appear on the community page credited to{" "}
                  <strong className="font-mono text-foreground">
                    {contributor || "you"}
                  </strong>.
                </span>
              </p>
              <Link
                href="/community"
                className="mt-6 inline-flex items-center gap-2 text-[14px] text-foreground"
              >
                <span className="underline-rule">Back to community</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Title block */}
            <div className="grid grid-cols-12 gap-x-6 items-end pb-8 hairline-b">
              <div className="col-span-12 md:col-span-8">
                <p className="meta-mono mb-3">
                  <span className="ink-stamp">✱</span> § Submit a template
                </p>
                <h1 className="font-display text-[40px] leading-[1.02] tracking-[-0.02em] text-foreground md:text-[56px]">
                  Share a figure
                  <br />
                  <span className="italic text-muted-foreground">with the community.</span>
                </h1>
              </div>
              <p className="col-span-12 mt-4 text-[13.5px] leading-relaxed text-muted-foreground md:col-span-4 md:mt-0">
                Tell us about a template you&apos;d like to add. We&apos;ll
                review for clarity and accuracy, then publish it on the
                community page, credited to you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-12 space-y-7">
              <Field
                label="Title"
                hint="A short, descriptive name (e.g. ‘CRISPR-Cas9 cut and repair’)."
              >
                <Input
                  required maxLength={80}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What does this figure show?"
                  className="h-11 rounded-sm border-border bg-surface text-[14px]"
                />
              </Field>

              <Field
                label="Description"
                hint="A sentence or two on what's in the figure and why it's useful."
              >
                <textarea
                  required maxLength={400}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A four-step diagram showing… "
                  className="w-full min-h-[112px] rounded-sm border border-border bg-surface px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
                />
              </Field>

              <Field label="Category">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-11 w-full rounded-sm border border-border bg-surface px-3 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field
                label="Credit name"
                hint="How would you like to be credited on the community page?"
              >
                <Input
                  maxLength={60}
                  value={contributor}
                  onChange={(e) => setContributor(e.target.value)}
                  placeholder="Your name or handle"
                  className="h-11 rounded-sm border-border bg-surface text-[14px]"
                />
              </Field>

              <Field
                label="Notes for reviewers"
                hint="Optional — anything reviewers should know (sources, caveats, alternative versions)."
              >
                <textarea
                  maxLength={400}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Drawn from Alberts et al., 6th ed., chapter 8…"
                  className="w-full min-h-[96px] rounded-sm border border-border bg-surface px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
                />
              </Field>

              {error && (
                <div className="hairline-box bg-paper-grain px-3 py-2.5 text-[13px] text-destructive">
                  <span className="meta-mono ink-stamp mr-1.5">✱ Err</span>
                  {error}
                </div>
              )}

              <div className="hairline-t pt-7 flex flex-wrap items-center justify-between gap-y-3">
                <p className="colophon">
                  By submitting you grant Canvas permission to publish this
                  template on the community page.
                </p>
                <Button
                  type="submit"
                  className="h-11 gap-2 rounded-sm px-5 text-[14px]"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.6} />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" strokeWidth={1.8} />
                      Submit for review
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-2">
      <div className="col-span-12 md:col-span-3 md:pt-2.5">
        <Label className="meta-mono">{label}</Label>
      </div>
      <div className="col-span-12 md:col-span-9 space-y-1.5">
        {children}
        {hint && (
          <p className="text-[12px] leading-relaxed text-muted-foreground">{hint}</p>
        )}
      </div>
    </div>
  );
}
