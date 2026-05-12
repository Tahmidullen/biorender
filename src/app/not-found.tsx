import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";

// Next.js renders this file for any route that doesn't exist.
//
// Set as a typographic erratum slip: a serif "404", an editor's note about
// the missing folio, and two quiet links back into the publication.

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-paper-grain">
      <header className="hairline-b">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-3 colophon">
          <span>Erratum · ed. 02</span>
          <span className="hidden sm:inline tnum">№ 404</span>
        </div>
        <div className="hairline-t">
          <div className="mx-auto flex h-13 max-w-[1240px] items-center justify-between px-6 py-3">
            <Logo size="sm" />
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="grid w-full max-w-[1240px] grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3">
            <p className="meta-mono mb-6">
              <span className="ink-stamp">✱</span> Erratum &nbsp;·&nbsp; folio not found
            </p>

            <p className="font-display text-[32vw] leading-[0.85] tracking-[-0.04em] text-foreground sm:text-[200px] md:text-[240px] tnum">
              404
            </p>

            <div className="mt-8 hairline-t pt-6 grid grid-cols-12 gap-x-6">
              <h1 className="col-span-12 font-display text-[32px] leading-[1.05] tracking-[-0.02em] text-foreground md:col-span-7 md:text-[44px]">
                This page didn&apos;t make it{" "}
                <span className="italic text-muted-foreground">past review.</span>
              </h1>
              <p className="col-span-12 mt-4 max-w-[44ch] text-[14.5px] leading-relaxed text-muted-foreground md:col-span-5 md:mt-0">
                The address you tried doesn&apos;t correspond to anything we
                publish. It may have moved, been renamed, or never existed at
                all — that happens to the best of us.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-[14px] text-foreground"
              >
                <span className="underline-rule">Return to the masthead</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 text-[14px] text-muted-foreground hover:text-foreground"
              >
                <span className="underline-rule">Open my workspace</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="hairline-t bg-paper-grain px-6 py-5">
        <div className="mx-auto max-w-[1240px] flex flex-wrap items-baseline justify-between gap-y-1 colophon">
          <span>
            © 2026 Canvas.bio &nbsp;·&nbsp; ed. 02
          </span>
          <span className="tnum">№ 0001 / 0001</span>
        </div>
      </footer>
    </div>
  );
}
