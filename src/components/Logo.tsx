import Link from "next/link";
import { Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** When true, renders as a plain element (no link). */
  asPlain?: boolean;
  /** Hide the wordmark, useful in tight toolbars. */
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: { box: "h-7 w-7", icon: "h-4 w-4",     text: "text-base" },
  md: { box: "h-8 w-8", icon: "h-[18px] w-[18px]", text: "text-lg" },
  lg: { box: "h-9 w-9", icon: "h-5 w-5",     text: "text-xl" },
};

/**
 * Brand mark for the app. A hexagon (geometric, scientific) over an inked
 * surface — replaces the previous "B" letter logo which felt placeholder-y.
 * Use everywhere: navbar, dashboard, editor, auth pages.
 */
export function Logo({ asPlain, iconOnly, size = "md", className }: Props) {
  const s = sizeMap[size];

  const inner = (
    <span className={cn("flex items-center gap-2.5 no-underline", className)}>
      <span
        className={cn(
          "relative flex items-center justify-center rounded-[10px]",
          "text-primary-foreground",
          s.box,
        )}
        style={{
          background:
            "linear-gradient(140deg, var(--ink) 0%, color-mix(in oklab, var(--ink) 70%, var(--primary)) 100%)",
          boxShadow:
            "inset 0 1px 0 0 color-mix(in oklab, white 18%, transparent), 0 6px 16px -8px color-mix(in oklab, var(--ink) 60%, transparent)",
        }}
      >
        <Hexagon className={cn("stroke-[1.6]", s.icon)} />
        <span
          aria-hidden
          className="absolute inset-0 rounded-[10px] opacity-60 mix-blend-overlay"
          style={{ background: "var(--texture-grain)" }}
        />
      </span>
      {!iconOnly && (
        <span
          className={cn(
            "font-display font-normal tracking-tight text-foreground",
            s.text,
          )}
        >
          Canvas<span className="text-muted-foreground italic">.bio</span>
        </span>
      )}
    </span>
  );

  if (asPlain) return inner;
  return (
    <Link href="/" className="inline-flex">
      {inner}
    </Link>
  );
}
