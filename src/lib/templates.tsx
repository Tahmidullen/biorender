// Template registry.
//
// Each template is replayed as SVG ops (Lucide or custom science symbols) plus text.

import type { ReactNode } from "react";
import {
  ArrowRight,
  RotateCw,
  Zap,
} from "lucide-react";
import type { LucideName } from "@/lib/assets";
import type { ScienceSymbolId } from "@/lib/science-symbols";
import { scienceSymbolDataUrl } from "@/lib/science-symbols";

export type TemplateOp =
  | {
      kind: "svg";
      lucide?: LucideName;
      scienceSymbol?: ScienceSymbolId;
      x: number;
      y: number;
      size?: number;
      color?: string;
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
  defaultTitle: string;
  Preview: () => ReactNode;
  ops: TemplateOp[];
};

const INK = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#b45309";
const VIOLET = "#6d28d9";
const STONE = "#475569";

function SciPreview({
  id,
  x,
  y,
  w,
  color,
}: {
  id: ScienceSymbolId;
  x: number;
  y: number;
  w: number;
  color: string;
}) {
  return (
    <image
      href={scienceSymbolDataUrl(id, { color, size: 96 })}
      x={x}
      y={y}
      width={w}
      height={w}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}

export const TEMPLATES: Template[] = [
  {
    id: "signal-pathway",
    title: "Receptor Signalling",
    description: "Membrane receptor → enzyme hub → nuclear compartment with arrows.",
    category: "Signalling",
    defaultTitle: "Receptor Signalling Pathway",
    Preview: () => (
      <svg viewBox="0 0 240 140" className="h-full w-full" aria-hidden>
        <SciPreview id="receptor-tyrosine" x={10} y={42} w={42} color={TEAL} />
        <ArrowRight x={58} y={56} width={28} height={28} stroke={STONE} strokeWidth={1.5} fill="none" />
        <SciPreview id="enzyme-substrate" x={94} y={42} w={42} color={VIOLET} />
        <ArrowRight x={142} y={56} width={28} height={28} stroke={STONE} strokeWidth={1.5} fill="none" />
        <SciPreview id="nucleus" x={178} y={42} w={42} color={INK} />
        <text x={31} y={112} textAnchor="middle" fontSize="9" fill={STONE} fontFamily="serif" fontStyle="italic">
          receptor
        </text>
        <text x={115} y={112} textAnchor="middle" fontSize="9" fill={STONE} fontFamily="serif" fontStyle="italic">
          kinase
        </text>
        <text x={199} y={112} textAnchor="middle" fontSize="9" fill={STONE} fontFamily="serif" fontStyle="italic">
          nucleus
        </text>
      </svg>
    ),
    ops: [
      { kind: "svg", scienceSymbol: "receptor-tyrosine", x: 0.12, y: 0.40, size: 110, color: TEAL },
      { kind: "text", text: "receptor", x: 0.12, y: 0.62, italic: true, family: "serif" },
      { kind: "svg", lucide: "ArrowRight", x: 0.30, y: 0.46, size: 70, color: STONE },
      { kind: "svg", scienceSymbol: "enzyme-substrate", x: 0.45, y: 0.40, size: 110, color: VIOLET },
      { kind: "text", text: "kinase", x: 0.45, y: 0.62, italic: true, family: "serif" },
      { kind: "svg", lucide: "ArrowRight", x: 0.62, y: 0.46, size: 70, color: STONE },
      { kind: "svg", scienceSymbol: "nucleus", x: 0.78, y: 0.40, size: 110, color: INK },
      { kind: "text", text: "nucleus", x: 0.78, y: 0.62, italic: true, family: "serif" },
      { kind: "text", text: "Receptor signalling pathway", x: 0.5, y: 0.1, fontSize: 26, family: "serif" },
    ],
  },

  {
    id: "cell-cycle",
    title: "Cell Cycle",
    description: "Central nucleus with cycle arrows for G1 → S → G2 → M.",
    category: "Schematic",
    defaultTitle: "Cell Cycle Diagram",
    Preview: () => (
      <svg viewBox="0 0 240 140" className="h-full w-full" aria-hidden>
        <SciPreview id="nucleus" x={96} y={46} w={48} color={INK} />
        <RotateCw x={56} y={20} width={26} height={26} stroke={TEAL} strokeWidth={1.5} fill="none" />
        <RotateCw x={158} y={20} width={26} height={26} stroke={AMBER} strokeWidth={1.5} fill="none" />
        <RotateCw x={56} y={92} width={26} height={26} stroke={VIOLET} strokeWidth={1.5} fill="none" />
        <RotateCw x={158} y={92} width={26} height={26} stroke={STONE} strokeWidth={1.5} fill="none" />
        <text x={69} y={16} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">
          G1
        </text>
        <text x={171} y={16} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">
          S
        </text>
        <text x={69} y={134} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">
          G2
        </text>
        <text x={171} y={134} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">
          M
        </text>
      </svg>
    ),
    ops: [
      { kind: "text", text: "Cell cycle", x: 0.5, y: 0.1, fontSize: 26, family: "serif" },
      { kind: "svg", scienceSymbol: "nucleus", x: 0.5, y: 0.5, size: 120, color: INK },
      { kind: "svg", lucide: "RotateCw", x: 0.25, y: 0.25, size: 90, color: TEAL },
      { kind: "text", text: "G1", x: 0.25, y: 0.18, italic: true, family: "serif" },
      { kind: "svg", lucide: "RotateCw", x: 0.75, y: 0.25, size: 90, color: AMBER },
      { kind: "text", text: "S", x: 0.75, y: 0.18, italic: true, family: "serif" },
      { kind: "svg", lucide: "RotateCw", x: 0.25, y: 0.78, size: 90, color: VIOLET },
      { kind: "text", text: "G2", x: 0.25, y: 0.92, italic: true, family: "serif" },
      { kind: "svg", lucide: "RotateCw", x: 0.75, y: 0.78, size: 90, color: STONE },
      { kind: "text", text: "M", x: 0.75, y: 0.92, italic: true, family: "serif" },
    ],
  },

  {
    id: "lab-workflow",
    title: "Lab Workflow",
    description: "Sample handling through preparation, imaging, and gel readout.",
    category: "Workflow",
    defaultTitle: "Experimental Workflow",
    Preview: () => (
      <svg viewBox="0 0 240 140" className="h-full w-full" aria-hidden>
        <SciPreview id="test-tube" x={8} y={44} w={38} color={TEAL} />
        <ArrowRight x={52} y={56} width={22} height={22} stroke={STONE} strokeWidth={1.5} fill="none" />
        <SciPreview id="flask-erlenmeyer" x={80} y={44} w={38} color={AMBER} />
        <ArrowRight x={124} y={56} width={22} height={22} stroke={STONE} strokeWidth={1.5} fill="none" />
        <SciPreview id="microscope" x={152} y={44} w={38} color={VIOLET} />
        <ArrowRight x={196} y={56} width={22} height={22} stroke={STONE} strokeWidth={1.5} fill="none" />
        <SciPreview id="gel-electrophoresis" x={206} y={44} w={36} color={INK} />
        <text x={27} y={108} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">
          sample
        </text>
        <text x={99} y={108} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">
          prepare
        </text>
        <text x={171} y={108} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">
          image
        </text>
        <text x={222} y={108} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif" fontStyle="italic">
          analyse
        </text>
      </svg>
    ),
    ops: [
      { kind: "text", text: "Experimental workflow", x: 0.5, y: 0.1, fontSize: 26, family: "serif" },
      { kind: "svg", scienceSymbol: "test-tube", x: 0.1, y: 0.45, size: 110, color: TEAL },
      { kind: "text", text: "sample", x: 0.1, y: 0.7, italic: true, family: "serif" },
      { kind: "svg", lucide: "ArrowRight", x: 0.25, y: 0.5, size: 60, color: STONE },
      { kind: "svg", scienceSymbol: "flask-erlenmeyer", x: 0.4, y: 0.45, size: 110, color: AMBER },
      { kind: "text", text: "prepare", x: 0.4, y: 0.7, italic: true, family: "serif" },
      { kind: "svg", lucide: "ArrowRight", x: 0.55, y: 0.5, size: 60, color: STONE },
      { kind: "svg", scienceSymbol: "microscope", x: 0.7, y: 0.45, size: 110, color: VIOLET },
      { kind: "text", text: "image", x: 0.7, y: 0.7, italic: true, family: "serif" },
      { kind: "svg", lucide: "ArrowRight", x: 0.85, y: 0.5, size: 60, color: STONE },
      { kind: "svg", scienceSymbol: "gel-electrophoresis", x: 0.93, y: 0.45, size: 100, color: INK },
      { kind: "text", text: "analyse", x: 0.93, y: 0.7, italic: true, family: "serif" },
    ],
  },

  {
    id: "microbe-comparison",
    title: "Microbe Comparison",
    description: "Rod bacterium, enveloped virus, and budding yeast side by side.",
    category: "Comparison",
    defaultTitle: "Microbial Comparison",
    Preview: () => (
      <svg viewBox="0 0 240 140" className="h-full w-full" aria-hidden>
        <SciPreview id="bacteria-rod" x={22} y={34} w={46} color={TEAL} />
        <SciPreview id="virus-enveloped" x={94} y={34} w={46} color={AMBER} />
        <SciPreview id="yeast-cell" x={166} y={34} w={46} color={VIOLET} />
        <text x={45} y={98} textAnchor="middle" fontSize="9" fill={INK} fontFamily="serif" fontStyle="italic">
          bacteria
        </text>
        <text x={117} y={98} textAnchor="middle" fontSize="9" fill={INK} fontFamily="serif" fontStyle="italic">
          virus
        </text>
        <text x={189} y={98} textAnchor="middle" fontSize="9" fill={INK} fontFamily="serif" fontStyle="italic">
          yeast
        </text>
        <line x1={28} x2={212} y1={118} y2={118} stroke={STONE} strokeWidth={1} />
        <text x={120} y={132} textAnchor="middle" fontSize="8" fill={STONE} fontFamily="serif">
          ~1 µm
        </text>
      </svg>
    ),
    ops: [
      { kind: "text", text: "Microbial comparison", x: 0.5, y: 0.1, fontSize: 26, family: "serif" },
      { kind: "svg", scienceSymbol: "bacteria-rod", x: 0.2, y: 0.42, size: 130, color: TEAL },
      { kind: "text", text: "bacteria", x: 0.2, y: 0.7, italic: true, family: "serif" },
      { kind: "svg", scienceSymbol: "virus-enveloped", x: 0.5, y: 0.42, size: 130, color: AMBER },
      { kind: "text", text: "virus", x: 0.5, y: 0.7, italic: true, family: "serif" },
      { kind: "svg", scienceSymbol: "yeast-cell", x: 0.8, y: 0.42, size: 130, color: VIOLET },
      { kind: "text", text: "yeast", x: 0.8, y: 0.7, italic: true, family: "serif" },
      { kind: "text", text: "~1 µm scale", x: 0.5, y: 0.88, fontSize: 14, color: STONE, family: "serif" },
    ],
  },

  {
    id: "drug-mechanism",
    title: "Drug Mechanism",
    description: "Small-molecule ligand, membrane target, and downstream response.",
    category: "Signalling",
    defaultTitle: "Drug Mechanism of Action",
    Preview: () => (
      <svg viewBox="0 0 240 140" className="h-full w-full" aria-hidden>
        <SciPreview id="capsule" x={16} y={46} w={40} color={AMBER} />
        <ArrowRight x={62} y={54} width={26} height={26} stroke={STONE} strokeWidth={1.5} fill="none" />
        <SciPreview id="receptor-tyrosine" x={96} y={38} w={44} color={TEAL} />
        <ArrowRight x={146} y={54} width={26} height={26} stroke={STONE} strokeWidth={1.5} fill="none" />
        <Zap x={180} y={46} width={36} height={36} stroke={VIOLET} strokeWidth={1.6} fill="none" />
        <text x={36} y={108} textAnchor="middle" fontSize="9" fill={STONE} fontFamily="serif" fontStyle="italic">
          drug
        </text>
        <text x={118} y={108} textAnchor="middle" fontSize="9" fill={STONE} fontFamily="serif" fontStyle="italic">
          target
        </text>
        <text x={198} y={108} textAnchor="middle" fontSize="9" fill={STONE} fontFamily="serif" fontStyle="italic">
          response
        </text>
      </svg>
    ),
    ops: [
      { kind: "text", text: "Drug mechanism of action", x: 0.5, y: 0.1, fontSize: 26, family: "serif" },
      { kind: "svg", scienceSymbol: "capsule", x: 0.15, y: 0.45, size: 110, color: AMBER },
      { kind: "text", text: "drug", x: 0.15, y: 0.68, italic: true, family: "serif" },
      { kind: "svg", lucide: "ArrowRight", x: 0.32, y: 0.5, size: 70, color: STONE },
      { kind: "svg", scienceSymbol: "receptor-tyrosine", x: 0.5, y: 0.45, size: 110, color: TEAL },
      { kind: "text", text: "target", x: 0.5, y: 0.68, italic: true, family: "serif" },
      { kind: "svg", lucide: "ArrowRight", x: 0.66, y: 0.5, size: 70, color: STONE },
      { kind: "svg", lucide: "Zap", x: 0.84, y: 0.45, size: 110, color: VIOLET },
      { kind: "text", text: "response", x: 0.84, y: 0.68, italic: true, family: "serif" },
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
        <rect
          x={28}
          y={28}
          width={184}
          height={84}
          rx={6}
          stroke={STONE}
          strokeWidth={1}
          fill="none"
          strokeDasharray="3 4"
        />
        <text x={120} y={76} textAnchor="middle" fontSize="11" fill={STONE} fontFamily="serif" fontStyle="italic">
          your canvas
        </text>
      </svg>
    ),
    ops: [{ kind: "text", text: "Untitled figure", x: 0.5, y: 0.1, fontSize: 26, family: "serif" }],
  },
];

export function findTemplate(id: string | null): Template | undefined {
  if (!id) return undefined;
  return TEMPLATES.find((t) => t.id === id);
}
