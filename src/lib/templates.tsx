// Template registry.
//
// A template is a small recipe of operations the editor can replay onto a
// fresh fabric canvas: drop an SVG shape here, drop another there, add a
// text label. This is more robust than serialising fabric JSON directly —
// the canvas reconstructs everything from scratch using the same pipeline as
// the manual editor.

import type { ReactNode } from "react";
import {
  Hexagon, Dna, Atom, Microscope, FlaskConical, ArrowRight,
  CircleDot, Bug, Zap, Snowflake, Spline, RotateCw, TestTube, Pill,
} from "lucide-react";
import type { LucideName } from "@/lib/assets";

export type TemplateOp =
  | {
      kind: "svg";
      lucide: LucideName;
      x: number;          // 0..1 (canvas-relative)
      y: number;          // 0..1
      size?: number;      // px
      color?: string;     // stroke
      fill?: string;
    }
  | {
      kind: "text";
      text: string;
      x: number;
      y: number;
      fontSize?: number;
      color?: string;
      italic?: boolean;
      family?: "sans" | "serif" | "mono";
    };

export type Template = {
  id: string;
  title: string;
  description: string;
  category: "Signalling" | "Workflow" | "Comparison" | "Schematic";
  /** Default working title once opened in the editor. */
  defaultTitle: string;
  /** Visual preview rendered on the gallery card. */
  Preview: () => ReactNode;
  /** Operations to replay onto the canvas. */
  ops: TemplateOp[];
};

// ─── Reusable colours ────────────────────────────────────────────────────────
const INK     = "#0f172a";
const TEAL    = "#0d9488";
const AMBER   = "#b45309";
const VIOLET  = "#6d28d9";
const STONE   = "#475569";

// ─── Templates ───────────────────────────────────────────────────────────────

export const TEMPLATES: Template[] = [
  {
    id: "signal-pathway",
    title: "Receptor Signalling",
    description: "Three-step receptor → kinase → nucleus diagram with arrows and labels.",
    category: "Signalling",
    defaultTitle: "Receptor Signalling Pathway",
    Preview: () => (
      <svg viewBox="0 0 240 140" className="h-full w-full" aria-hidden>
        <Hexagon  x={20} y={50} width={40} height={40} stroke={TEAL} strokeWidth={1.6} fill="none" />
        <ArrowRight x={70} y={56} width={28} height={28} stroke={STONE} strokeWidth={1.5} fill="none" />
        <Atom     x={108} y={50} width={40} height={40} stroke={VIOLET} strokeWidth={1.6} fill="none" />
        <ArrowRight x={158} y={56} width={28} height={28} stroke={STONE} strokeWidth={1.5} fill="none" />
        <CircleDot x={196} y={50} width={40} height={40} stroke={INK} strokeWidth={1.6} fill="none" />
        <text x={40}  y={108} textAnchor="middle" fontSize="9" fill={STONE} fontFamily="serif" fontStyle="italic">receptor</text>
        <text x={128} y={108} textAnchor="middle" fontSize="9" fill={STONE} fontFamily="serif" fontStyle="italic">kinase</text>
        <text x={216} y={108} textAnchor="middle" fontSize="9" fill={STONE} fontFamily="serif" fontStyle="italic">nucleus</text>
      </svg>
    ),
    ops: [
      { kind: "svg",  lucide: "Hexagon",     x: 0.12, y: 0.40, size: 110, color: TEAL },
      { kind: "text", text: "receptor",      x: 0.12, y: 0.62, italic: true, family: "serif" },
      { kind: "svg",  lucide: "ArrowRight",  x: 0.30, y: 0.46, size: 70,  color: STONE },
      { kind: "svg",  lucide: "Atom",        x: 0.45, y: 0.40, size: 110, color: VIOLET },
      { kind: "text", text: "kinase",        x: 0.45, y: 0.62, italic: true, family: "serif" },
      { kind: "svg",  lucide: "ArrowRight",  x: 0.62, y: 0.46, size: 70,  color: STONE },
      { kind: "svg",  lucide: "CircleDot",   x: 0.78, y: 0.40, size: 110, color: INK  },
      { kind: "text", text: "nucleus",       x: 0.78, y: 0.62, italic: true, family: "serif" },
      { kind: "text", text: "Receptor signalling pathway", x: 0.5, y: 0.10, fontSize: 26, family: "serif" },
    ],
  },

  {
    id: "cell-cycle",
    title: "Cell Cycle",
    description: "Four-phase cycle with rotational arrows around a central nucleus.",
    category: "Schematic",
    defaultTitle: "Cell Cycle Diagram",
    Preview: () => (
      <svg viewBox="0 0 240 140" className="h-full w-full" aria-hidden>
        <CircleDot x={104} y={50} width={32} height={32} stroke={INK} strokeWidth={1.6} fill="none" />
        <RotateCw  x={56}  y={20} width={26} height={26} stroke={TEAL} strokeWidth={1.5} fill="none" />
        <RotateCw  x={158} y={20} width={26} height={26} stroke={AMBER} strokeWidth={1.5} fill="none" />
        <RotateCw  x={56}  y={92} width={26} height={26} stroke={VIOLET} strokeWidth={1.5} fill="none" />
        <RotateCw  x={158} y={92} width={26} height={26} stroke={STONE} strokeWidth={1.5} fill="none" />
        <text x={69}  y={16}  textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">G1</text>
        <text x={171} y={16}  textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">S</text>
        <text x={69}  y={134} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">G2</text>
        <text x={171} y={134} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">M</text>
      </svg>
    ),
    ops: [
      { kind: "text", text: "Cell cycle",   x: 0.5, y: 0.10, fontSize: 26, family: "serif" },
      { kind: "svg",  lucide: "CircleDot",  x: 0.50, y: 0.50, size: 120, color: INK    },
      { kind: "svg",  lucide: "RotateCw",   x: 0.25, y: 0.25, size: 90,  color: TEAL   },
      { kind: "text", text: "G1",           x: 0.25, y: 0.18, italic: true, family: "serif" },
      { kind: "svg",  lucide: "RotateCw",   x: 0.75, y: 0.25, size: 90,  color: AMBER  },
      { kind: "text", text: "S",            x: 0.75, y: 0.18, italic: true, family: "serif" },
      { kind: "svg",  lucide: "RotateCw",   x: 0.25, y: 0.78, size: 90,  color: VIOLET },
      { kind: "text", text: "G2",           x: 0.25, y: 0.92, italic: true, family: "serif" },
      { kind: "svg",  lucide: "RotateCw",   x: 0.75, y: 0.78, size: 90,  color: STONE  },
      { kind: "text", text: "M",            x: 0.75, y: 0.92, italic: true, family: "serif" },
    ],
  },

  {
    id: "lab-workflow",
    title: "Lab Workflow",
    description: "Sample → flask → microscope → analysis. A clean experimental schematic.",
    category: "Workflow",
    defaultTitle: "Experimental Workflow",
    Preview: () => (
      <svg viewBox="0 0 240 140" className="h-full w-full" aria-hidden>
        <TestTube     x={12}  y={50} width={36} height={36} stroke={TEAL} strokeWidth={1.6} fill="none" />
        <ArrowRight   x={56}  y={56} width={22} height={22} stroke={STONE} strokeWidth={1.5} fill="none" />
        <FlaskConical x={88}  y={50} width={36} height={36} stroke={AMBER} strokeWidth={1.6} fill="none" />
        <ArrowRight   x={132} y={56} width={22} height={22} stroke={STONE} strokeWidth={1.5} fill="none" />
        <Microscope   x={164} y={50} width={36} height={36} stroke={VIOLET} strokeWidth={1.6} fill="none" />
        <ArrowRight   x={208} y={56} width={22} height={22} stroke={STONE} strokeWidth={1.5} fill="none" />
        <text x={30}  y={104} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">sample</text>
        <text x={106} y={104} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">prepare</text>
        <text x={182} y={104} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">image</text>
      </svg>
    ),
    ops: [
      { kind: "text", text: "Experimental workflow", x: 0.5, y: 0.10, fontSize: 26, family: "serif" },
      { kind: "svg",  lucide: "TestTube",     x: 0.10, y: 0.45, size: 110, color: TEAL   },
      { kind: "text", text: "sample",         x: 0.10, y: 0.70, italic: true, family: "serif" },
      { kind: "svg",  lucide: "ArrowRight",   x: 0.25, y: 0.50, size: 60,  color: STONE  },
      { kind: "svg",  lucide: "FlaskConical", x: 0.40, y: 0.45, size: 110, color: AMBER  },
      { kind: "text", text: "prepare",        x: 0.40, y: 0.70, italic: true, family: "serif" },
      { kind: "svg",  lucide: "ArrowRight",   x: 0.55, y: 0.50, size: 60,  color: STONE  },
      { kind: "svg",  lucide: "Microscope",   x: 0.70, y: 0.45, size: 110, color: VIOLET },
      { kind: "text", text: "image",          x: 0.70, y: 0.70, italic: true, family: "serif" },
      { kind: "svg",  lucide: "ArrowRight",   x: 0.85, y: 0.50, size: 60,  color: STONE  },
      { kind: "svg",  lucide: "Spline",       x: 0.92, y: 0.45, size: 100, color: INK    },
      { kind: "text", text: "analyse",        x: 0.92, y: 0.70, italic: true, family: "serif" },
    ],
  },

  {
    id: "microbe-comparison",
    title: "Microbe Comparison",
    description: "Side-by-side bacteria, virus, and yeast with shared scale label.",
    category: "Comparison",
    defaultTitle: "Microbial Comparison",
    Preview: () => (
      <svg viewBox="0 0 240 140" className="h-full w-full" aria-hidden>
        <Bug       x={28}  y={36} width={42} height={42} stroke={TEAL}   strokeWidth={1.6} fill="none" />
        <Snowflake x={100} y={36} width={42} height={42} stroke={AMBER}  strokeWidth={1.6} fill="none" />
        <CircleDot x={172} y={36} width={42} height={42} stroke={VIOLET} strokeWidth={1.6} fill="none" />
        <text x={49}  y={94}  textAnchor="middle" fontSize="9" fill={INK} fontFamily="serif" fontStyle="italic">bacteria</text>
        <text x={121} y={94}  textAnchor="middle" fontSize="9" fill={INK} fontFamily="serif" fontStyle="italic">virus</text>
        <text x={193} y={94}  textAnchor="middle" fontSize="9" fill={INK} fontFamily="serif" fontStyle="italic">yeast</text>
        <line x1={28} x2={214} y1={114} y2={114} stroke={STONE} strokeWidth={1} />
        <text x={121} y={128} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif">~1 µm</text>
      </svg>
    ),
    ops: [
      { kind: "text", text: "Microbial comparison", x: 0.5, y: 0.10, fontSize: 26, family: "serif" },
      { kind: "svg",  lucide: "Bug",        x: 0.20, y: 0.42, size: 130, color: TEAL   },
      { kind: "text", text: "bacteria",     x: 0.20, y: 0.70, italic: true, family: "serif" },
      { kind: "svg",  lucide: "Snowflake",  x: 0.50, y: 0.42, size: 130, color: AMBER  },
      { kind: "text", text: "virus",        x: 0.50, y: 0.70, italic: true, family: "serif" },
      { kind: "svg",  lucide: "CircleDot",  x: 0.80, y: 0.42, size: 130, color: VIOLET },
      { kind: "text", text: "yeast",        x: 0.80, y: 0.70, italic: true, family: "serif" },
      { kind: "text", text: "~1 µm scale",  x: 0.50, y: 0.88, fontSize: 14, color: STONE, family: "serif" },
    ],
  },

  {
    id: "drug-mechanism",
    title: "Drug Mechanism",
    description: "Compound binds receptor, inhibits downstream cascade. Annotated.",
    category: "Signalling",
    defaultTitle: "Drug Mechanism of Action",
    Preview: () => (
      <svg viewBox="0 0 240 140" className="h-full w-full" aria-hidden>
        <Pill        x={20}  y={48} width={36} height={36} stroke={AMBER}  strokeWidth={1.6} fill="none" />
        <ArrowRight  x={62}  y={54} width={26} height={26} stroke={STONE}  strokeWidth={1.5} fill="none" />
        <Hexagon     x={98}  y={48} width={36} height={36} stroke={TEAL}   strokeWidth={1.6} fill="none" />
        <ArrowRight  x={140} y={54} width={26} height={26} stroke={STONE}  strokeWidth={1.5} fill="none" />
        <Zap         x={176} y={48} width={36} height={36} stroke={VIOLET} strokeWidth={1.6} fill="none" />
        <text x={38}  y={104} textAnchor="middle" fontSize="9" fill={STONE} fontFamily="serif" fontStyle="italic">drug</text>
        <text x={116} y={104} textAnchor="middle" fontSize="9" fill={STONE} fontFamily="serif" fontStyle="italic">target</text>
        <text x={194} y={104} textAnchor="middle" fontSize="9" fill={STONE} fontFamily="serif" fontStyle="italic">response</text>
      </svg>
    ),
    ops: [
      { kind: "text", text: "Drug mechanism of action", x: 0.5, y: 0.10, fontSize: 26, family: "serif" },
      { kind: "svg",  lucide: "Pill",       x: 0.15, y: 0.45, size: 110, color: AMBER  },
      { kind: "text", text: "drug",         x: 0.15, y: 0.68, italic: true, family: "serif" },
      { kind: "svg",  lucide: "ArrowRight", x: 0.32, y: 0.50, size: 70,  color: STONE  },
      { kind: "svg",  lucide: "Hexagon",    x: 0.50, y: 0.45, size: 110, color: TEAL   },
      { kind: "text", text: "target",       x: 0.50, y: 0.68, italic: true, family: "serif" },
      { kind: "svg",  lucide: "ArrowRight", x: 0.66, y: 0.50, size: 70,  color: STONE  },
      { kind: "svg",  lucide: "Zap",        x: 0.84, y: 0.45, size: 110, color: VIOLET },
      { kind: "text", text: "response",     x: 0.84, y: 0.68, italic: true, family: "serif" },
    ],
  },

  {
    id: "blank-canvas",
    title: "Blank canvas",
    description: "Start from a clean slate with just a title placeholder.",
    category: "Schematic",
    defaultTitle: "Untitled figure",
    Preview: () => (
      <svg viewBox="0 0 240 140" className="h-full w-full" aria-hidden>
        <rect x={28} y={28} width={184} height={84} rx={6}
              stroke={STONE} strokeWidth={1} fill="none" strokeDasharray="3 4" />
        <text x={120} y={76} textAnchor="middle" fontSize="11" fill={STONE} fontFamily="serif" fontStyle="italic">
          your canvas
        </text>
      </svg>
    ),
    ops: [
      { kind: "text", text: "Untitled figure", x: 0.5, y: 0.10, fontSize: 26, family: "serif" },
    ],
  },
];

export function findTemplate(id: string | null): Template | undefined {
  if (!id) return undefined;
  return TEMPLATES.find((t) => t.id === id);
}
