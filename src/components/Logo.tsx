import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  asPlain?: boolean;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * A typographic colophon mark.
 *
 * The previous logo was a hexagon sitting inside a gradient-ink rounded
 * square — the canonical "AI startup app-icon" pattern. This version is
 * deliberately type-only: a small vermilion six-point asterisk (the
 * compositor's mark used to break editorial sections), the Canvas
 * wordmark set in serif, and a hairline italic `.bio` suffix.
 *
 * No gradients, no rounded chip, no glow.
 */

const sizeMap = {
  sm: { mark: "text-[14px]", word: "text-[15px]", gap: "gap-1.5" },
  md: { mark: "text-[16px]", word: "text-[18px]", gap: "gap-2"   },
  lg: { mark: "text-[20px]", word: "text-[22px]", gap: "gap-2.5" },
};

export function Logo({ asPlain, iconOnly, size = "md", className }: Props) {
  const s = sizeMap[size];

  const inner = (
    <span
      className={cn(
        "inline-flex items-baseline font-display tracking-tight text-foreground no-underline",
        s.gap,
        className,
      )}
    >
      {/* The compositor's mark. Rendered in vermilion as the page's
          single permitted "hot" tick. */}
      <span
        aria-hidden
        className={cn("ink-stamp leading-none", s.mark)}
        style={{ transform: "translateY(-1px)" }}
      >
        ✱
      </span>

      {!iconOnly && (
        <span className={cn("leading-none", s.word)}>
          Canvas
          <span className="text-muted-foreground italic font-normal">/bio</span>
        </span>
      )}
    </span>
  );

  if (asPlain) return inner;
  return (
    <Link href="/" className="inline-flex shrink-0">
      {inner}
    </Link>
  );
}
