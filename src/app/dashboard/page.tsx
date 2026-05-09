"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Trash2, LogOut, ImageOff, FileText, LayoutTemplate,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/Logo";

type Figure = {
  id: string;
  title: string;
  preview: string | null;
  updated_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [figures,   setFigures]   = useState<Figure[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    async function init() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { router.push("/login"); return; }

      setUserEmail(userData.user.email ?? null);

      const { data } = await supabase
        .from("figures")
        .select("id, title, preview, updated_at")
        .order("updated_at", { ascending: false });

      setFigures(data ?? []);
      setLoading(false);
    }
    init();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this figure? This cannot be undone.")) return;
    await supabase.from("figures").delete().eq("id", id);
    setFigures((prev) => prev.filter((f) => f.id !== id));
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-paper-grain">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="hidden font-mono text-[12px] text-muted-foreground sm:block">
                {userEmail}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Page header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Workspace
            </p>
            <h1 className="font-display text-4xl text-foreground md:text-5xl">
              Your figures
            </h1>
            {!loading && (
              <p className="mt-2 text-[14px] text-muted-foreground">
                {figures.length} figure{figures.length !== 1 ? "s" : ""} in this workspace.
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/templates"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-11 gap-2 px-5 text-[14px]",
              )}
            >
              <LayoutTemplate className="h-4 w-4" />
              Templates
            </Link>
            <Link
              href="/editor"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 px-5 text-[14px] shadow-[0_10px_24px_-12px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
              )}
            >
              <Plus className="h-4 w-4" />
              New figure
            </Link>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-border/70">
                <Skeleton className="h-40 w-full rounded-none" />
                <CardContent className="pt-4 pb-2">
                  <Skeleton className="mb-2 h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
                <CardFooter className="gap-2 pt-0 pb-4">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-10" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && figures.length === 0 && (
          <div className="surface-elegant hairline mx-auto max-w-md py-16 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-accent text-primary">
              <FileText className="h-6 w-6" strokeWidth={1.6} />
            </div>
            <h2 className="font-display text-2xl text-foreground">No figures yet</h2>
            <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              Open the editor to draft your first figure. It will appear here as
              soon as you save.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <Link
                href="/templates"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-11 gap-2 px-5 text-[14px]")}
              >
                <LayoutTemplate className="h-4 w-4" />
                Browse templates
              </Link>
              <Link
                href="/editor"
                className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-5 text-[14px]")}
              >
                <Plus className="h-4 w-4" />
                Blank canvas
              </Link>
            </div>
          </div>
        )}

        {/* Figures grid */}
        {!loading && figures.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {figures.map((fig) => (
              <FigureCard
                key={fig.id}
                figure={fig}
                onDelete={handleDelete}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function FigureCard({
  figure, onDelete, formatDate,
}: {
  figure: Figure;
  onDelete: (id: string) => void;
  formatDate: (iso: string) => string;
}) {
  return (
    <Card className="group overflow-hidden border-border/70 bg-surface transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
      <div className="flex h-40 items-center justify-center overflow-hidden border-b border-border/70 bg-muted/40">
        {figure.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={figure.preview}
            alt={figure.title}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <ImageOff className="h-7 w-7 text-muted-foreground/40" strokeWidth={1.4} />
        )}
      </div>

      <CardContent className="px-4 pt-3 pb-2">
        <h3 className="truncate font-display text-[17px] leading-tight text-foreground">
          {figure.title}
        </h3>
        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
          updated {formatDate(figure.updated_at)}
        </p>
      </CardContent>

      <CardFooter className="gap-2 px-4 pt-0 pb-4">
        <Link
          href={`/editor?id=${figure.id}`}
          className={cn(buttonVariants({ size: "sm" }), "flex-1 text-center text-[12px]")}
        >
          Open
        </Link>
        <Button
          size="sm"
          variant="outline"
          aria-label="Delete figure"
          className="px-3 text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(figure.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
