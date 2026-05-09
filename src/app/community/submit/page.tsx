"use client";

// Community template submission form.
//
// Inserts a row into the Supabase `template_submissions` table with status
// `pending`. An admin can later flip status to `approved` (it will then
// appear on /community) or `rejected`.
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  // We require login so we can credit submissions and prevent spam.
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
        <Loader2 className="h-7 w-7 animate-spin text-primary" strokeWidth={1.6} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-grain">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Logo size="sm" />
          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to community
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Submit a template
          </p>
          <h1 className="font-display text-4xl text-foreground md:text-5xl">
            Share a figure with the community
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Tell us about a template you&apos;d like to add. We&apos;ll review for
            clarity and accuracy, then publish it on the community page,
            credited to you.
          </p>
        </div>

        <Card className="surface-elegant border-border/70">
          {submitted ? (
            <CardContent className="pt-12 pb-12 text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-accent text-primary">
                <CheckCircle2 className="h-5 w-5" strokeWidth={1.6} />
              </div>
              <h2 className="font-display text-2xl text-foreground">Thanks — submitted!</h2>
              <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
                We&apos;ll review your template within a week. If it&apos;s
                approved, it&apos;ll appear on the community page credited to{" "}
                <strong className="text-foreground">{contributor || "you"}</strong>.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <Link
                  href="/community"
                  className="rounded-md border border-border bg-background px-4 py-2 text-[13px] font-medium text-foreground hover:bg-muted"
                >
                  Back to community
                </Link>
              </div>
            </CardContent>
          ) : (
            <>
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-2xl text-foreground">
                  Template details
                </CardTitle>
                <CardDescription className="text-[13px]">
                  Be specific — the clearer the description, the faster reviewers can publish.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Field
                    label="Title"
                    hint="A short, descriptive name (e.g. ‘CRISPR-Cas9 cut and repair’)."
                  >
                    <Input
                      required maxLength={80}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What does this figure show?"
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
                      className="w-full min-h-[96px] rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
                    />
                  </Field>

                  <Field label="Category">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
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
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
                    />
                  </Field>

                  {error && (
                    <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="h-11 w-full gap-2 text-[14px]" disabled={submitting}>
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

                  <p className="text-center text-[11px] text-muted-foreground">
                    By submitting you grant Canvas permission to publish this template on the community page.
                  </p>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}

function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-[12px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
