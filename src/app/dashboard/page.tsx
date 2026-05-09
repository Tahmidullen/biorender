"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

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
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-lg font-extrabold text-gray-900">BioRender</span>
          </Link>

          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-sm text-muted-foreground hidden sm:block">{userEmail}</span>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive">
              Log out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Figures</h1>
            {!loading && (
              <p className="text-sm text-muted-foreground mt-1">
                {figures.length} figure{figures.length !== 1 ? "s" : ""} saved
              </p>
            )}
          </div>
          <Link href="/editor" className={cn(buttonVariants())}>
            + New Figure
          </Link>
        </div>

        <Separator className="mb-8" />

        {/* Loading skeleton grid */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-36 w-full rounded-none" />
                <CardContent className="pt-4 pb-2">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
                <CardFooter className="pt-0 pb-4 gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-10" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && figures.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
              <span className="text-4xl">🧬</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No figures yet</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Create your first scientific figure. Click Save in the editor toolbar to store it here.
            </p>
            <Link href="/editor" className={cn(buttonVariants())}>
              Open Editor
            </Link>
          </div>
        )}

        {/* Figures grid */}
        {!loading && figures.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
    <Card className="overflow-hidden group hover:shadow-md transition-shadow hover:border-primary/30">
      {/* Preview thumbnail */}
      <div className="h-36 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
        {figure.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={figure.preview}
            alt={figure.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-4xl opacity-25">🧬</span>
        )}
      </div>

      <CardContent className="pt-3 pb-2 px-4">
        <h3 className="text-sm font-bold text-gray-900 truncate">{figure.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Updated {formatDate(figure.updated_at)}
        </p>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 gap-2">
        <Link
          href={`/editor?id=${figure.id}`}
          className={cn(buttonVariants({ size: "sm" }), "flex-1 text-center")}
        >
          Open
        </Link>
        <Button
          size="sm"
          variant="outline"
          className="text-destructive hover:bg-destructive/10 hover:border-destructive/30 px-3"
          onClick={() => onDelete(figure.id)}
        >
          🗑
        </Button>
      </CardFooter>
    </Card>
  );
}
