// Asset library data.
//
// Sidebar previews use Lucide for categories and either a custom science SVG
// (`scienceSymbol`) or Lucide for generic diagram marks.
// The editor drops real SVG strings onto the canvas via `scienceSymbolToSvg`
// or `lucideToSvg`.

import type { ScienceSymbolId } from "@/lib/science-symbols";

export type IconAsset = {
  id: string;
  name: string;
  emoji: string;
  lucide: LucideName;
  /** Custom publication-style schematic; preferred over Lucide on canvas. */
  scienceSymbol?: ScienceSymbolId;
  category: string;
};

export const ICON_CATEGORIES = [
  "Cell Biology",
  "Microbiology",
  "Lab Equipment",
  "Molecules & chemistry",
  "Organs & models",
  "Data & documentation",
  "Processes",
] as const;

// Names must exist in lucide-react (used for nav icons & non-science glyphs).
export type LucideName =
  | "Circle"
  | "CircleDot"
  | "Dot"
  | "Hexagon"
  | "Octagon"
  | "Atom"
  | "Dna"
  | "Microscope"
  | "FlaskConical"
  | "TestTube"
  | "Pill"
  | "Syringe"
  | "Bug"
  | "Zap"
  | "Key"
  | "Spline"
  | "Waves"
  | "ArrowRight"
  | "ArrowUp"
  | "Ban"
  | "Check"
  | "RotateCw"
  | "HelpCircle"
  | "Sparkles"
  | "Snowflake"
  | "Brain"
  | "BarChart3"
  | "LayoutGrid";

export const ICONS: IconAsset[] = [
  // Cell Biology
  { id: "cb-animal-cell", name: "Animal cell", emoji: "🔵", lucide: "CircleDot", scienceSymbol: "animal-cell", category: "Cell Biology" },
  { id: "cb-plant-cell", name: "Plant cell", emoji: "🟢", lucide: "Hexagon", scienceSymbol: "plant-cell", category: "Cell Biology" },
  { id: "cb-nucleus", name: "Nucleus", emoji: "⭕", lucide: "CircleDot", scienceSymbol: "nucleus", category: "Cell Biology" },
  { id: "cb-mito", name: "Mitochondrion", emoji: "🫘", lucide: "Octagon", scienceSymbol: "mitochondrion", category: "Cell Biology" },
  { id: "cb-er", name: "Endoplasmic reticulum", emoji: "〰️", lucide: "Waves", scienceSymbol: "endoplasmic-reticulum", category: "Cell Biology" },
  { id: "cb-golgi", name: "Golgi apparatus", emoji: "📚", lucide: "LayoutGrid", scienceSymbol: "golgi-stack", category: "Cell Biology" },
  { id: "cb-ribosome", name: "Ribosomes", emoji: "🟡", lucide: "Dot", scienceSymbol: "ribosome", category: "Cell Biology" },
  { id: "cb-membrane", name: "Plasma membrane", emoji: "〰️", lucide: "Waves", scienceSymbol: "cell-membrane", category: "Cell Biology" },
  { id: "cb-lysosome", name: "Lysosome", emoji: "🔴", lucide: "Circle", scienceSymbol: "lysosome", category: "Cell Biology" },
  { id: "cb-chloro", name: "Chloroplast", emoji: "🌿", lucide: "Circle", scienceSymbol: "chloroplast", category: "Cell Biology" },
  { id: "cb-ion", name: "Ion channel", emoji: "⏸️", lucide: "Spline", scienceSymbol: "ion-channel", category: "Cell Biology" },

  // Microbiology
  { id: "mb-rod", name: "Rod bacterium", emoji: "🦠", lucide: "Bug", scienceSymbol: "bacteria-rod", category: "Microbiology" },
  { id: "mb-coccus", name: "Cocci cluster", emoji: "🔵", lucide: "Bug", scienceSymbol: "bacteria-coccus", category: "Microbiology" },
  { id: "mb-virus", name: "Enveloped virus", emoji: "❄️", lucide: "Snowflake", scienceSymbol: "virus-enveloped", category: "Microbiology" },
  { id: "mb-yeast", name: "Yeast", emoji: "🟤", lucide: "CircleDot", scienceSymbol: "yeast-cell", category: "Microbiology" },

  // Lab Equipment
  { id: "lab-scope", name: "Microscope", emoji: "🔬", lucide: "Microscope", scienceSymbol: "microscope", category: "Lab Equipment" },
  { id: "lab-petri", name: "Petri dish", emoji: "🫙", lucide: "Circle", scienceSymbol: "petri-dish", category: "Lab Equipment" },
  { id: "lab-plate", name: "Multi-well plate", emoji: "▦", lucide: "LayoutGrid", scienceSymbol: "well-plate", category: "Lab Equipment" },
  { id: "lab-pipette", name: "Pipette", emoji: "🧪", lucide: "TestTube", scienceSymbol: "pipette", category: "Lab Equipment" },
  { id: "lab-flask", name: "Erlenmeyer flask", emoji: "⚗️", lucide: "FlaskConical", scienceSymbol: "flask-erlenmeyer", category: "Lab Equipment" },
  { id: "lab-beaker", name: "Beaker", emoji: "🧴", lucide: "FlaskConical", scienceSymbol: "beaker", category: "Lab Equipment" },
  { id: "lab-tube", name: "Test tube", emoji: "🧪", lucide: "TestTube", scienceSymbol: "test-tube", category: "Lab Equipment" },
  { id: "lab-syringe", name: "Syringe", emoji: "💉", lucide: "Syringe", scienceSymbol: "syringe-simple", category: "Lab Equipment" },
  { id: "lab-centrifuge", name: "Centrifuge (icon)", emoji: "🌀", lucide: "RotateCw", category: "Lab Equipment" },

  // Molecules & chemistry
  { id: "mol-dna", name: "DNA helix", emoji: "🧬", lucide: "Dna", scienceSymbol: "dna-helix", category: "Molecules & chemistry" },
  { id: "mol-antibody", name: "Antibody (Ig)", emoji: "Y", lucide: "Atom", scienceSymbol: "antibody-y", category: "Molecules & chemistry" },
  { id: "mol-receptor", name: "Receptor (membrane)", emoji: "📍", lucide: "Spline", scienceSymbol: "receptor-tyrosine", category: "Molecules & chemistry" },
  { id: "mol-ligand", name: "Ligand / ligand sphere", emoji: "●", lucide: "Circle", scienceSymbol: "ligand", category: "Molecules & chemistry" },
  { id: "mol-enzyme", name: "Enzyme · substrate", emoji: "🔷", lucide: "Key", scienceSymbol: "enzyme-substrate", category: "Molecules & chemistry" },
  { id: "mol-ballstick", name: "Ball-and-stick unit", emoji: "⚛️", lucide: "Atom", scienceSymbol: "molecule", category: "Molecules & chemistry" },
  { id: "mol-ring", name: "Aromatic scaffold", emoji: "⬡", lucide: "Hexagon", scienceSymbol: "chem-structure", category: "Molecules & chemistry" },
  { id: "mol-atp", name: "Energy / coupling", emoji: "⚡", lucide: "Zap", category: "Molecules & chemistry" },

  // Organs & models
  { id: "org-neuron", name: "Neuron", emoji: "🧠", lucide: "Brain", scienceSymbol: "neuron", category: "Organs & models" },
  { id: "org-brain", name: "Brain (silhouette)", emoji: "🧠", lucide: "Brain", scienceSymbol: "brain", category: "Organs & models" },
  { id: "org-lungs", name: "Lungs", emoji: "🫁", lucide: "Brain", scienceSymbol: "lungs", category: "Organs & models" },
  { id: "org-rat", name: "Laboratory rodent", emoji: "🐀", lucide: "Bug", scienceSymbol: "rat", category: "Organs & models" },

  // Data & documentation
  { id: "dat-bars", name: "Bar chart", emoji: "📊", lucide: "BarChart3", scienceSymbol: "bar-chart", category: "Data & documentation" },
  { id: "dat-line", name: "Line chart", emoji: "📈", lucide: "BarChart3", scienceSymbol: "line-chart", category: "Data & documentation" },
  { id: "dat-gel", name: "Gel lanes", emoji: "▭", lucide: "LayoutGrid", scienceSymbol: "gel-electrophoresis", category: "Data & documentation" },

  // Processes (diagram marks — Lucide)
  { id: "proc-arrow-r", name: "Arrow right", emoji: "➡️", lucide: "ArrowRight", category: "Processes" },
  { id: "proc-arrow-u", name: "Arrow up", emoji: "⬆️", lucide: "ArrowUp", category: "Processes" },
  { id: "proc-inhibit", name: "Inhibition (blunt)", emoji: "⛔", lucide: "Ban", category: "Processes" },
  { id: "proc-activate", name: "Activation check", emoji: "✅", lucide: "Check", category: "Processes" },
  { id: "proc-cycle", name: "Cycle arrow", emoji: "🔄", lucide: "RotateCw", category: "Processes" },
  { id: "proc-unknown", name: "Unknown / hypothesis", emoji: "❓", lucide: "HelpCircle", category: "Processes" },
];
