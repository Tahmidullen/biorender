"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Trash2, LogOut, ImageOff, LayoutTemplate,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
      {/* Masthead — flat, no backdrop-blur. */}
      <header className="sticky top-0 z-10 bg-paper-grain hairline-b">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 pt-3 pb-2 colophon">
          <span>Workspace · ed. 02</span>
          {userEmail && (
            <span className="hidden font-mono text-[10.5px] text-muted-foreground sm:inline tnum">
              {userEmail}
            </span>
          )}
        </div>
        <div className="hairline-t">
          <div className="mx-auto flex h-13 max-w-[1240px] items-center justify-between gap-4 px-6 py-3">
            <Logo size="sm" />
            <div className="flex items-center gap-4">
              <Link
                href="/community"
                className="hidden text-[12.5px] text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Community
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 rounded-sm text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-6 py-16">
        {/* Page title block — asymmetric, hairline-divided. */}
        <div className="grid grid-cols-12 gap-x-6 items-end pb-8 hairline-b">
          <div className="col-span-12 md:col-span-8">
            <p className="meta-mono mb-3">
              <span className="ink-stamp">✱</span> § 01 — Workspace
            </p>
            <h1 className="font-display text-[44px] leading-[1.02] tracking-[-0.02em] text-foreground md:text-[64px]">
              Your figures,
              <br />
              <span className="italic text-muted-foreground">in progress.</span>
            </h1>
            {!loading && (
              <p className="mt-4 text-[14px] text-muted-foreground">
                <span className="tnum">{String(figures.length).padStart(2, "0")}</span>{" "}
                figure{figures.length !== 1 ? "s" : ""} on file ·{" "}
                <span className="font-mono">
                  last edit {figures[0] ? formatDate(figures[0].updated_at) : "—"}
                </span>
              </p>
            )}
          </div>
          <div className="col-span-12 mt-6 flex items-center justify-start gap-3 md:col-span-4 md:mt-0 md:justify-end">
            <Link
              href="/templates"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-11 gap-2 rounded-sm px-5 text-[14px]",
              )}
            >
              <LayoutTemplate className="h-4 w-4" />
              Templates
            </Link>
            <Link
              href="/editor"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 rounded-sm px-5 text-[14px]",
              )}
            >
              <Plus className="h-4 w-4" />
              New figure
            </Link>
          </div>
        </div>

        {/* Loading skeletons — flat hairline-edged blocks. */}
        {loading && (
          <div className="mt-12 grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 hairline-box">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-background p-4">
                <Skeleton className="h-40 w-full rounded-none" />
                <Skeleton className="mt-4 h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/2" />
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state — editorial pull, not a centred chip. */}
        {!loading && figures.length === 0 && (
          <div className="mt-16 grid grid-cols-12 gap-x-6">
            <div className="col-span-12 md:col-span-7 md:col-start-3">
              <p className="meta-mono mb-4">
                <span className="ink-stamp">✱</span> Empty file
              </p>
              <h2 className="font-display text-[36px] leading-[1.05] text-foreground md:text-[48px]">
                No figures on the desk{" "}
                <span className="italic text-muted-foreground">yet.</span>
              </h2>
              <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
                Open the editor to draft your first figure. It will appear here
                as soon as you save — no folder structure, no naming ceremony.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href="/editor"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 gap-2 rounded-sm px-5 text-[14px]",
                  )}
                >
                  <Plus className="h-4 w-4" />
                  Blank canvas
                </Link>
                <Link
                  href="/templates"
                  className="group inline-flex items-center gap-2 text-[14px] text-foreground"
                >
                  <LayoutTemplate className="h-3.5 w-3.5" />
                  <span className="underline-rule">Browse templates</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Figures index — flat hairline grid. */}
        {!loading && figures.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 hairline-box">
            {figures.map((fig, i) => (
              <FigureCard
                key={fig.id}
                figure={fig}
                index={i + 1}
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
  figure, index, onDelete, formatDate,
}: {
  figure: Figure;
  index: number;
  onDelete: (id: string) => void;
  formatDate: (iso: string) => string;
}) {
  return (
    <article className="group relative flex flex-col bg-background">
      <div className="relative flex h-44 items-center justify-center overflow-hidden hairline-b bg-paper-grain">
        {figure.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={figure.preview}
            alt={figure.title}
            className="h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.015]"
          />
        ) : (
          <ImageOff className="h-7 w-7 text-muted-foreground/40" strokeWidth={1.4} />
        )}
        <span className="absolute left-2 top-2 colophon tnum">
          № {String(index).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-col p-4">
        <h3 className="truncate font-display text-[18px] leading-tight text-foreground">
          {figure.title}
        </h3>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground tnum">
          edited {formatDate(figure.updated_at)}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/editor?id=${figure.id}`}
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-8 flex-1 rounded-sm text-[12px]",
            )}
          >
            Open
          </Link>
          <Button
            size="sm"
            variant="outline"
            aria-label="Delete figure"
            className="h-8 rounded-sm px-3 text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(figure.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}
