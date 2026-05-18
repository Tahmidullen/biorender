import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  asPlain?: boolean;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * Typographic lockup aligned with the footer wordmark: Canvas/bio.
 * Leading mark: DNA duplex with a scissor-style nick — editing × molecular biology.
 */

const sizeMap = {
  sm: { icon: "h-[15px] w-[15px]", word: "text-[15px]", gap: "gap-1.5" },
  md: { icon: "h-[17px] w-[17px]", word: "text-[18px]", gap: "gap-2" },
  lg: { icon: "h-[21px] w-[21px]", word: "text-[22px]", gap: "gap-2.5" },
};

/** Inline icon: DNA duplex rungs + crossed blades at a nick (edit / cleavage). */
function BioEditMark({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <title>Molecular edit mark</title>
      <path
        d="M4 15.5h16"
        className="stroke-current"
        strokeWidth={1.25}
        strokeLinecap="round"
      />
      <path
        d="M4 18.5h16"
        className="stroke-current"
        strokeWidth={1.25}
        strokeLinecap="round"
      />
      <line x1="8" y1="15.5" x2="8" y2="18.5" className="stroke-current" strokeWidth={1} strokeLinecap="round" opacity={0.9} />
      <line x1="16" y1="15.5" x2="16" y2="18.5" className="stroke-current" strokeWidth={1} strokeLinecap="round" opacity={0.9} />
      <line x1="10.5" y1="17" x2="11.8" y2="17" className="stroke-current" strokeWidth={1} strokeLinecap="round" opacity={0.55} />
      <line x1="12.2" y1="17" x2="13.5" y2="17" className="stroke-current" strokeWidth={1} strokeLinecap="round" opacity={0.55} />
      <path
        d="M7 6 L12 13 L11 13.9 L7.8 6.6 Z"
        className="stroke-current"
        strokeWidth={0.9}
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={0.14}
      />
      <path
        d="M17 6 L12 13 L13 13.9 L16.2 6.6 Z"
        className="stroke-current"
        strokeWidth={0.9}
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={0.14}
      />
      <circle cx="12" cy="13.35" r={1.05} className="fill-current" />
    </svg>
  );
}

export function Logo({ asPlain, iconOnly, size = "md", className }: Props) {
  const s = sizeMap[size];

  const inner = (
    <span
      className={cn(
        "inline-flex items-center font-display tracking-tight text-foreground no-underline",
        s.gap,
        className,
      )}
    >
      <BioEditMark className={cn("text-primary translate-y-[0.5px]", s.icon)} />

      {!iconOnly && (
        <span className={cn("leading-none", s.word)}>
          Canvas<span className="text-primary font-semibold">/bio</span>
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
