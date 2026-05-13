"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Composition archetype: **Blueprint Schematic** (#7).
 * Editorial vector drafting grammar (grid / leaders / registrations) —
 * genomic RNA-guided nuclease positioning, not receptor-style signaling panels.
 */
export type ScientificIllustrationDensity = "compact" | "standard" | "editorial";

type ScientificProcessIllustrationProps = {
  density?: ScientificIllustrationDensity;
  className?: string;
  title?: string;
};

export function ScientificProcessIllustration({
  density = "standard",
  className,
  title = "Blueprint schematic: RNA-programmed Cas nuclease engagement and site-defined double-strand break at a genomic locus.",
}: ScientificProcessIllustrationProps) {
  const uid = useId().replace(/:/g, "");

  const isCompact = density === "compact";
  const isEditorial = density === "editorial";

  const dimFont = isCompact ? 4.4 : isEditorial ? 4 : 4.35;
  const zoneFont = isCompact ? 6.1 : 5.95;
  const noteFont = isEditorial ? 3.5 : isCompact ? 3.95 : 0;

  const gridMinor = !isCompact;
  const showChainTicks = !isCompact;
  const showRegistration = true;

  return (
    <figure className={cn("w-full", className)} aria-label={title}>
      <svg
        viewBox="0 0 224 74"
        className="block h-auto w-full text-neutral-900"
        role="img"
        fill="none"
      >
        <title>{title}</title>
        <defs>
          <pattern id={`${uid}-grid`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" stroke="currentColor" strokeOpacity={0.12} strokeWidth="0.6" vectorEffect="nonScalingStroke" />
          </pattern>
          <pattern id={`${uid}-grid-fine`} width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" stroke="currentColor" strokeOpacity={0.065} strokeWidth="0.45" vectorEffect="nonScalingStroke" />
          </pattern>
          <pattern id={`${uid}-hatch-dna`} width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 0 6 L 6 0" stroke="currentColor" strokeOpacity={0.09} strokeWidth="0.7" vectorEffect="nonScalingStroke" />
          </pattern>
          <marker id={`${uid}-dim-tick`} markerWidth="3" markerHeight="3" refY="1.5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 3 1.5 L 0 3 Z" fill="currentColor" fillOpacity={0.35} />
          </marker>
        </defs>

        {/* Drawing surface */}
        <rect x="10" y="8" width="204" height="58" rx="1" stroke="currentColor" strokeOpacity={0.42} strokeWidth="0.9" vectorEffect="nonScalingStroke" fill={`url(#${uid}-grid)`} />
        {gridMinor ? <rect x="10" y="8" width="204" height="58" fill={`url(#${uid}-grid-fine)`} /> : null}

        {/* Registration marks — drafting anchors */}
        {showRegistration && (
          <>
            <path d="M 13 13 L 19 13 M 16 10 L 16 16" stroke="currentColor" strokeOpacity={0.38} strokeWidth="0.9" vectorEffect="nonScalingStroke" />
            <circle cx="16" cy="13" r="1.75" stroke="currentColor" strokeOpacity={0.42} strokeWidth="0.6" vectorEffect="nonScalingStroke" fill="white" />
            <path d="M 208 13 L 214 13 M 211 10 L 211 16" stroke="currentColor" strokeOpacity={0.38} strokeWidth="0.9" vectorEffect="nonScalingStroke" />
            <circle cx="211" cy="13" r="1.75" stroke="currentColor" strokeOpacity={0.42} strokeWidth="0.6" vectorEffect="nonScalingStroke" fill="white" />
            <path d="M 13 61 L 19 61 M 16 58 L 16 64" stroke="currentColor" strokeOpacity={0.34} strokeWidth="0.85" vectorEffect="nonScalingStroke" />
          </>
        )}

        {/* Zones — phased blueprint bands (spatial story, not a pathway network) */}
        <rect x="18" y="18" width="52" height="36" rx="1" stroke="currentColor" strokeOpacity={0.26} strokeWidth="0.65" strokeDasharray="6 5" vectorEffect="nonScalingStroke" fill="currentColor" fillOpacity={isCompact ? 0.02 : 0.028} />
        <rect x="78" y="18" width="68" height="36" rx="1" stroke="currentColor" strokeOpacity={0.26} strokeWidth="0.65" strokeDasharray="7 6" vectorEffect="nonScalingStroke" fill="currentColor" fillOpacity={0.026} />
        <rect x="154" y="18" width="54" height="36" rx="1" stroke="currentColor" strokeOpacity={0.28} strokeWidth="0.65" strokeDasharray="5 6" vectorEffect="nonScalingStroke" fill="currentColor" fillOpacity={0.024} />

        <text x="44" y="24" fontSize={zoneFont - 2.05} fontWeight="700" textAnchor="middle" fill="currentColor" opacity={0.82} letterSpacing="0.12em">
          A · PROGRAM
        </text>
        <text x="112" y="24" fontSize={zoneFont - 2.05} fontWeight="700" textAnchor="middle" fill="currentColor" opacity={0.82} letterSpacing="0.12em">
          B · DOCKING
        </text>
        <text x="181" y="24" fontSize={zoneFont - 2.05} fontWeight="700" textAnchor="middle" fill="currentColor" opacity={0.82} letterSpacing="0.12em">
          C · COMMIT CUT
        </text>

        {/* DNA duplex axis — blueprint bar stock (not receptor scaffolds) */}
        <rect x="28" y="33.5" width="170" height="8.5" rx="0.85" stroke="currentColor" strokeOpacity={0.52} strokeWidth="0.9" vectorEffect="nonScalingStroke" fill={`url(#${uid}-hatch-dna)`} />
        <line x1="26" x2="200" y1="34.5" y2="34.5" stroke="currentColor" strokeOpacity={0.78} strokeWidth="1.15" strokeLinecap="square" vectorEffect="nonScalingStroke" />
        <line x1="26" x2="200" y1="41" y2="41" stroke="currentColor" strokeOpacity={0.78} strokeWidth="1.15" strokeLinecap="square" vectorEffect="nonScalingStroke" />

        {/* Target window + PAM sector — dimensioned */}
        <rect x="126" y="33" width="38" height="9.5" rx="0.7" stroke="currentColor" strokeOpacity={0.78} strokeWidth="0.85" vectorEffect="nonScalingStroke" fill="currentColor" fillOpacity={0.05} />
        <line x1="126" x2="126" y1="49" y2="54" stroke="currentColor" strokeOpacity={0.45} strokeWidth="0.65" vectorEffect="nonScalingStroke" />
        <line x1="164" x2="164" y1="49" y2="54" stroke="currentColor" strokeOpacity={0.45} strokeWidth="0.65" vectorEffect="nonScalingStroke" />
        <line x1="126" x2="164" y1="52" y2="52" stroke="currentColor" strokeOpacity={0.6} strokeWidth="0.65" markerStart={`url(#${uid}-dim-tick)`} markerEnd={`url(#${uid}-dim-tick)`} vectorEffect="nonScalingStroke" />
        <text x="145" y="57.2" fontSize={dimFont} fontWeight="600" textAnchor="middle" fill="currentColor" opacity={0.55}>
          duplex window · PAM
        </text>

        {/* Strand discontinuity — site-defined */}
        <line x1="143" x2="143" y1="32" y2="44" stroke="currentColor" strokeOpacity={0.85} strokeWidth="1.2" strokeDasharray="2.2 3" vectorEffect="nonScalingStroke" />
        <path d="M 138 45 L 140 47 L 142 45 M 144 45 L 146 47 L 148 45" stroke="currentColor" strokeOpacity={0.72} strokeWidth="0.85" strokeLinecap="round" vectorEffect="nonScalingStroke" />
        <text x="143" y="66" fontSize={dimFont * 0.92} fontWeight="700" textAnchor="middle" fill="currentColor" opacity={0.58}>
          ds break sector
        </text>

        {/* sgRNA scaffold — orthogonal trace (not a membrane protein) */}
        <path
          d="M 46 48 L 46 58 L 62 58 L 62 44 L 78 44 L 78 36 L 98 36 L 98 34.5 L 122 34.5"
          stroke="currentColor"
          strokeOpacity={0.62}
          strokeWidth="1.05"
          strokeLinejoin="miter"
          vectorEffect="nonScalingStroke"
        />
        <rect x="40" y="52" width="12" height="10" rx="0.7" stroke="currentColor" strokeOpacity={0.48} strokeWidth="0.75" vectorEffect="nonScalingStroke" fill="currentColor" fillOpacity={0.03} />
        <text x="46" y="59.3" fontSize={dimFont * 0.88} fontWeight="700" textAnchor="middle" fill="currentColor" opacity={0.5}>
          gRNA
        </text>

        {/* Cas engineering block — massing diagram */}
        <path
          d="M 88 48 L 72 65 L 130 65 L 118 48 Z"
          stroke="currentColor"
          strokeOpacity={0.74}
          strokeWidth="1.05"
          fill="currentColor"
          fillOpacity={0.05}
          vectorEffect="nonScalingStroke"
        />
        <line x1="100" x2="108" y1="53" y2="60" stroke="currentColor" strokeOpacity={0.35} strokeWidth="0.55" strokeDasharray="4 4" vectorEffect="nonScalingStroke" />
        <text x="100" y="63" fontSize={dimFont} fontWeight="700" letterSpacing="0.08em" textAnchor="middle" fill="currentColor" opacity={0.52}>
          NUCL
        </text>

        {!isCompact ? (
          <text x="112" y="49" fontSize={noteFont || 4.1} fontWeight="600" textAnchor="middle" fill="currentColor" opacity={0.41}>
            RNP massing
          </text>
        ) : null}

        {showChainTicks ? (
          <>
            {[40, 58, 76, 94, 172, 188].map((tx) => (
              <line key={tx} x1={tx} x2={tx} y1="42" y2="43.5" stroke="currentColor" strokeOpacity={0.22} strokeWidth="0.55" vectorEffect="nonScalingStroke" />
            ))}
          </>
        ) : null}

        {isEditorial ? (
          <>
            <line x1="98" x2="98" y1="18" y2="30" stroke="currentColor" strokeOpacity={0.28} strokeWidth="0.55" vectorEffect="nonScalingStroke" />
            <line x1="143" x2="143" y1="18" y2="30" stroke="currentColor" strokeOpacity={0.28} strokeWidth="0.55" vectorEffect="nonScalingStroke" />
            <text x="98" y="16" fontSize={3.35} fontWeight="600" textAnchor="middle" fill="currentColor" opacity={0.42}>
              seed
            </text>
            <text x="143" y="16" fontSize={3.35} fontWeight="600" textAnchor="middle" fill="currentColor" opacity={0.42}>
              scissile plane
            </text>
          </>
        ) : null}

        {/* Title block — editorial spread corner */}
        <rect x="152" y="55" width="58" height="9" rx="0.65" stroke="currentColor" strokeOpacity={0.32} strokeWidth="0.55" vectorEffect="nonScalingStroke" fill="white" fillOpacity={0.88} />
        <text x="181" y="60" fontSize={3.85} fontWeight="700" textAnchor="middle" fill="currentColor" opacity={0.55}>
          {"SHEET 01 — LOCUS PLAN"}
        </text>
        <text x="181" y="64.4" fontSize={3.25} fontWeight="500" textAnchor="middle" fill="currentColor" opacity={0.38}>
          {"scale: narrative (not to scale)"}
        </text>
      </svg>
    </figure>
  );
}
