"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [checking, setChecking] = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/dashboard");
      else setChecking(false);
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) { setError(error.message); setLoading(false); return; }

    router.push("/dashboard");
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
      {/* Small colophon strip at the very top. */}
      <header className="hairline-b">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-3 colophon">
          <span>Subscriber access · ed. 02</span>
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

          {/* Title block — set above two stacked hairline rules, with a
              monospace meta line acting like an editorial folio. */}
          <div className="hairline-t hairline-b py-7">
            <p className="meta-mono mb-3">
              <span className="ink-stamp">✱</span> § Sign in
            </p>
            <h1 className="font-display text-[40px] leading-[1] tracking-[-0.02em] text-foreground md:text-[52px]">
              Welcome
              <br />
              <span className="italic text-muted-foreground">back.</span>
            </h1>
            <p className="mt-4 text-[13.5px] text-muted-foreground">
              New here?{" "}
              <Link
                href="/signup"
                className="text-foreground underline-rule"
              >
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="meta-mono"
              >
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="meta-mono">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
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
                  Signing in…
                </span>
              ) : "Sign in"}
            </Button>

            <p className="colophon text-center">
              Secured by Supabase &nbsp;·&nbsp; <span className="tnum">v 02.0001</span>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
