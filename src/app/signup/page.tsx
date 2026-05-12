"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";

export default function SignupPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [checking, setChecking] = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/dashboard");
      else setChecking(false);
    });
  }, [router]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) { setError(error.message); setLoading(false); return; }

    setSuccess(true);
    setLoading(false);
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-grain">
        <Loader2 className="h-6 w-6 animate-spin text-primary" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper-grain">
      <header className="hairline-b">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-3 colophon">
          <span>New subscriber · ed. 02</span>
          <Link
            href="/"
            className="text-[10.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-[480px]">
          <div className="mb-10 flex justify-center">
            <Logo size="lg" />
          </div>

          {success ? (
            <div className="hairline-t hairline-b py-12">
              <p className="meta-mono mb-4">
                <span className="ink-stamp">✱</span> Confirmation sent
              </p>
              <h2 className="font-display text-[36px] leading-[1.02] tracking-[-0.02em] text-foreground md:text-[44px]">
                Check your
                <br />
                <span className="italic text-muted-foreground">inbox.</span>
              </h2>
              <div className="mt-5 hairline-t pt-5">
                <p className="flex items-baseline gap-2 text-[13.5px] leading-relaxed text-muted-foreground">
                  <MailCheck className="h-4 w-4 shrink-0 translate-y-0.5 text-foreground" strokeWidth={1.5} />
                  <span>
                    We sent a confirmation link to{" "}
                    <strong className="font-mono text-foreground">{email}</strong>.
                    Click it to activate, then{" "}
                    <Link
                      href="/login"
                      className="text-foreground underline-rule"
                    >
                      log in
                    </Link>
                    .
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="hairline-t hairline-b py-7">
                <p className="meta-mono mb-3">
                  <span className="ink-stamp">✱</span> § New subscription
                </p>
                <h1 className="font-display text-[40px] leading-[1] tracking-[-0.02em] text-foreground md:text-[52px]">
                  Open an
                  <br />
                  <span className="italic text-muted-foreground">account.</span>
                </h1>
                <p className="mt-4 text-[13.5px] text-muted-foreground">
                  Already have one?{" "}
                  <Link
                    href="/login"
                    className="text-foreground underline-rule"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSignup} className="mt-8 space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="meta-mono">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="you@lab.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-sm border-border bg-surface text-[14px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="meta-mono">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-sm border-border bg-surface text-[14px]"
                  />
                </div>

                {error && (
                  <div className="hairline-box bg-paper-grain px-3 py-2.5 text-[13px] text-destructive">
                    <span className="meta-mono ink-stamp mr-1.5">✱ Err</span>
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-11 w-full rounded-sm text-[14px]"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.6} />
                      Creating account…
                    </span>
                  ) : "Create account"}
                </Button>

                <p className="colophon text-center">
                  By subscribing you agree to the Terms and Privacy Policy.
                </p>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
