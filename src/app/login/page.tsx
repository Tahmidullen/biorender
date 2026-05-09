"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [checking, setChecking] = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data }) => {
        if (data.user) router.replace("/dashboard");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
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
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-3xl text-foreground">
              Welcome back
            </CardTitle>
            <CardDescription className="text-[13px]">
              New here?{" "}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="••••••••"
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
                    Logging in…
                  </span>
                ) : "Log in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
