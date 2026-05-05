// Each icon has a name, an emoji to display, and a category it belongs to.
// In a real BioRender, these would be SVG files. For now we use emojis as placeholders.

export type IconAsset = {
  id: string;
  name: string;
  emoji: string;
  category: string;
};

export const ICON_CATEGORIES = [
  "Cell Biology",
  "Microbiology",
  "Lab Equipment",
  "Molecules",
  "Processes",
];

export const ICONS: IconAsset[] = [
  // Cell Biology
  { id: "cell-1",      name: "Animal Cell",    emoji: "🔵", category: "Cell Biology" },
  { id: "cell-2",      name: "Plant Cell",     emoji: "🟢", category: "Cell Biology" },
  { id: "cell-3",      name: "Nucleus",        emoji: "⭕", category: "Cell Biology" },
  { id: "cell-4",      name: "Mitochondria",   emoji: "🫘", category: "Cell Biology" },
  { id: "cell-5",      name: "Ribosome",       emoji: "🟡", category: "Cell Biology" },
  { id: "cell-6",      name: "Membrane",       emoji: "〰️", category: "Cell Biology" },

  // Microbiology
  { id: "micro-1",     name: "Bacteria",       emoji: "🦠", category: "Microbiology" },
  { id: "micro-2",     name: "Virus",          emoji: "🔴", category: "Microbiology" },
  { id: "micro-3",     name: "Yeast",          emoji: "🟤", category: "Microbiology" },
  { id: "micro-4",     name: "Flagellum",      emoji: "〽️", category: "Microbiology" },
  { id: "micro-5",     name: "Spore",          emoji: "🟠", category: "Microbiology" },

  // Lab Equipment
  { id: "lab-1",       name: "Flask",          emoji: "⚗️", category: "Lab Equipment" },
  { id: "lab-2",       name: "Microscope",     emoji: "🔬", category: "Lab Equipment" },
  { id: "lab-3",       name: "Test Tube",      emoji: "🧪", category: "Lab Equipment" },
  { id: "lab-4",       name: "Petri Dish",     emoji: "🫙", category: "Lab Equipment" },
  { id: "lab-5",       name: "Syringe",        emoji: "💉", category: "Lab Equipment" },
  { id: "lab-6",       name: "Centrifuge",     emoji: "🌀", category: "Lab Equipment" },

  // Molecules
  { id: "mol-1",       name: "DNA",            emoji: "🧬", category: "Molecules" },
  { id: "mol-2",       name: "Protein",        emoji: "🔷", category: "Molecules" },
  { id: "mol-3",       name: "ATP",            emoji: "⚡", category: "Molecules" },
  { id: "mol-4",       name: "Enzyme",         emoji: "🔑", category: "Molecules" },
  { id: "mol-5",       name: "Antibody",       emoji: "Y️",  category: "Molecules" },
  { id: "mol-6",       name: "RNA",            emoji: "🧵", category: "Molecules" },

  // Processes
  { id: "proc-1",      name: "Arrow Right",    emoji: "➡️", category: "Processes" },
  { id: "proc-2",      name: "Arrow Up",       emoji: "⬆️", category: "Processes" },
  { id: "proc-3",      name: "Inhibit",        emoji: "⛔", category: "Processes" },
  { id: "proc-4",      name: "Activate",       emoji: "✅", category: "Processes" },
  { id: "proc-5",      name: "Cycle",          emoji: "🔄", category: "Processes" },
  { id: "proc-6",      name: "Question",       emoji: "❓", category: "Processes" },
];
