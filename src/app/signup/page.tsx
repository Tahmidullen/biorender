"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    supabase.auth.getUser()
      .then(({ data }) => {
        if (data.user) router.replace("/dashboard");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
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
        <Loader2 className="h-7 w-7 animate-spin text-primary" strokeWidth={1.6} />
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-paper-grain px-4"
      style={{ background: "var(--gradient-paper), var(--paper)" }}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <Card className="surface-elegant border-border/70">
          {success ? (
            <CardContent className="pt-10 pb-10 text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-accent text-primary">
                <MailCheck className="h-5 w-5" strokeWidth={1.6} />
              </div>
              <h2 className="font-display text-2xl text-foreground">Check your inbox</h2>
              <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                We sent a confirmation link to{" "}
                <strong className="text-foreground">{email}</strong>. Click it
                to activate your account, then{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  log in
                </Link>.
              </p>
            </CardContent>
          ) : (
            <>
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-3xl text-foreground">
                  Create your account
                </CardTitle>
                <CardDescription className="text-[13px]">
                  Already have one?{" "}
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    Log in
                  </Link>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="you@lab.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {error && (
                    <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="h-11 w-full text-[14px]" disabled={loading}>
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.6} />
                        Creating account…
                      </span>
                    ) : "Create account"}
                  </Button>
                </form>

                <p className="mt-4 text-center text-[11px] text-muted-foreground">
                  By signing up you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
