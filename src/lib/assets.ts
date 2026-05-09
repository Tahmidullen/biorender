// Asset library data.
//
// Each icon now carries a `lucide` identifier — used by the AssetLibrary UI
// to render a real, consistent vector icon instead of an emoji glyph.
//
// `emoji` is retained because the canvas (fabric.js) currently draws the
// glyph as a text object via `addEmoji`. Replacing canvas glyphs with real
// SVGs is a separate (larger) task — see EditorCanvas.

export type IconAsset = {
  id: string;
  name: string;
  emoji: string;        // canvas glyph (legacy)
  lucide: LucideName;   // UI rendering — see AssetLibrary
  category: string;
};

export const ICON_CATEGORIES = [
  "Cell Biology",
  "Microbiology",
  "Lab Equipment",
  "Molecules",
  "Processes",
] as const;

// Names must exist in lucide-react. Keep this list narrow so the bundle
// stays small and the AssetLibrary mapping is exhaustive.
export type LucideName =
  | "Circle" | "CircleDot" | "Dot" | "Hexagon" | "Octagon"
  | "Atom"   | "Dna"       | "Microscope" | "FlaskConical"
  | "TestTube" | "Pill"    | "Syringe"    | "Bug"
  | "Zap"    | "Key"       | "Spline"     | "Waves"
  | "ArrowRight" | "ArrowUp" | "Ban" | "Check" | "RotateCw"
  | "HelpCircle" | "Sparkles" | "Snowflake";

export const ICONS: IconAsset[] = [
  // Cell Biology
  { id: "cell-1", name: "Animal Cell",   emoji: "🔵", lucide: "Circle",     category: "Cell Biology" },
  { id: "cell-2", name: "Plant Cell",    emoji: "🟢", lucide: "Hexagon",    category: "Cell Biology" },
  { id: "cell-3", name: "Nucleus",       emoji: "⭕", lucide: "CircleDot",  category: "Cell Biology" },
  { id: "cell-4", name: "Mitochondria",  emoji: "🫘", lucide: "Octagon",    category: "Cell Biology" },
  { id: "cell-5", name: "Ribosome",      emoji: "🟡", lucide: "Dot",        category: "Cell Biology" },
  { id: "cell-6", name: "Membrane",      emoji: "〰️", lucide: "Waves",      category: "Cell Biology" },

  // Microbiology
  { id: "micro-1", name: "Bacteria",     emoji: "🦠", lucide: "Bug",        category: "Microbiology" },
  { id: "micro-2", name: "Virus",        emoji: "🔴", lucide: "Snowflake",  category: "Microbiology" },
  { id: "micro-3", name: "Yeast",        emoji: "🟤", lucide: "CircleDot",  category: "Microbiology" },
  { id: "micro-4", name: "Flagellum",    emoji: "〽️", lucide: "Spline",     category: "Microbiology" },
  { id: "micro-5", name: "Spore",        emoji: "🟠", lucide: "Sparkles",   category: "Microbiology" },

  // Lab Equipment
  { id: "lab-1", name: "Flask",          emoji: "⚗️", lucide: "FlaskConical", category: "Lab Equipment" },
  { id: "lab-2", name: "Microscope",     emoji: "🔬", lucide: "Microscope",   category: "Lab Equipment" },
  { id: "lab-3", name: "Test Tube",      emoji: "🧪", lucide: "TestTube",     category: "Lab Equipment" },
  { id: "lab-4", name: "Petri Dish",     emoji: "🫙", lucide: "Pill",         category: "Lab Equipment" },
  { id: "lab-5", name: "Syringe",        emoji: "💉", lucide: "Syringe",      category: "Lab Equipment" },
  { id: "lab-6", name: "Centrifuge",     emoji: "🌀", lucide: "RotateCw",     category: "Lab Equipment" },

  // Molecules
  { id: "mol-1", name: "DNA",            emoji: "🧬", lucide: "Dna",         category: "Molecules" },
  { id: "mol-2", name: "Protein",        emoji: "🔷", lucide: "Hexagon",     category: "Molecules" },
  { id: "mol-3", name: "ATP",            emoji: "⚡", lucide: "Zap",         category: "Molecules" },
  { id: "mol-4", name: "Enzyme",         emoji: "🔑", lucide: "Key",         category: "Molecules" },
  { id: "mol-5", name: "Antibody",       emoji: "Y",  lucide: "Atom",        category: "Molecules" },
  { id: "mol-6", name: "RNA",            emoji: "🧵", lucide: "Spline",      category: "Molecules" },

  // Processes
  { id: "proc-1", name: "Arrow Right",   emoji: "➡️", lucide: "ArrowRight",  category: "Processes" },
  { id: "proc-2", name: "Arrow Up",      emoji: "⬆️", lucide: "ArrowUp",     category: "Processes" },
  { id: "proc-3", name: "Inhibit",       emoji: "⛔", lucide: "Ban",         category: "Processes" },
  { id: "proc-4", name: "Activate",      emoji: "✅", lucide: "Check",       category: "Processes" },
  { id: "proc-5", name: "Cycle",         emoji: "🔄", lucide: "RotateCw",    category: "Processes" },
  { id: "proc-6", name: "Question",      emoji: "❓", lucide: "HelpCircle",  category: "Processes" },
];
