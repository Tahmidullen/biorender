/**
 * Publication-style schematic SVG symbols — simplified geometry inspired by
 * common scientific illustration conventions (cells, bench, molecules).
 * Not clinical diagnostic art; meant to read clearly at small sizes in figures.
 */

export type ScienceSymbolId = keyof typeof SYMBOL_BUILDERS;

type B = (s: string, f?: string) => string;
/** stroke colour `s`, optional soft fill `f` */

const SYMBOL_BUILDERS = {
  "animal-cell": (s, f = "#f4f4f5") =>
    `<ellipse cx="48" cy="50" rx="34" ry="30" fill="${f}" stroke="${s}" stroke-width="1.35"/>
     <ellipse cx="42" cy="44" rx="12" ry="10" fill="#e4e4e7" stroke="${s}" stroke-width="1.1"/>
     <ellipse cx="58" cy="58" rx="6" ry="4" fill="none" stroke="${s}" stroke-width="1"/>
     <ellipse cx="34" cy="58" rx="5" ry="3.5" fill="none" stroke="${s}" stroke-width="1"/>
     <path d="M22 52 Q48 68 74 52" fill="none" stroke="${s}" stroke-width="1" stroke-dasharray="2 3" opacity="0.85"/>`,

  "plant-cell": (s, f = "#ecfdf5") =>
    `<rect x="18" y="22" width="60" height="56" rx="3" fill="${f}" stroke="${s}" stroke-width="1.4"/>
     <rect x="14" y="18" width="68" height="64" rx="5" fill="none" stroke="${s}" stroke-width="1.8"/>
     <ellipse cx="48" cy="48" rx="18" ry="22" fill="#d1fae5" stroke="${s}" stroke-width="1.1"/>
     <ellipse cx="62" cy="36" rx="8" ry="10" fill="#bbf7d0" stroke="${s}" stroke-width="1"/>
     <circle cx="36" cy="40" r="3" fill="#86efac" stroke="${s}" stroke-width="0.9"/>`,

  nucleus: (s, f = "#e4e4e7") =>
    `<circle cx="48" cy="48" r="22" fill="${f}" stroke="${s}" stroke-width="1.35"/>
     <circle cx="48" cy="48" r="14" fill="none" stroke="${s}" stroke-width="1" opacity="0.7"/>`,

  mitochondrion: (s, f = "#fef3c7") =>
    `<ellipse cx="48" cy="48" rx="28" ry="12" fill="${f}" stroke="${s}" stroke-width="1.35"/>
     <path d="M26 48 Q36 40 48 48 T70 48" fill="none" stroke="${s}" stroke-width="1"/>
     <path d="M26 48 Q36 56 48 48 T70 48" fill="none" stroke="${s}" stroke-width="1"/>`,

  "endoplasmic-reticulum": (s) =>
    `<path d="M20 38 Q32 28 44 38 T68 38" fill="none" stroke="${s}" stroke-width="1.3"/>
     <path d="M22 48 Q34 38 46 48 T72 48" fill="none" stroke="${s}" stroke-width="1.3"/>
     <path d="M24 58 Q36 48 48 58 T74 58" fill="none" stroke="${s}" stroke-width="1.3"/>`,

  "golgi-stack": (s, f = "#e0e7ff") =>
    `<path d="M28 52 Q48 42 68 52" fill="none" stroke="${s}" stroke-width="1.4"/>
     <path d="M30 58 Q48 50 66 58" fill="none" stroke="${s}" stroke-width="1.4"/>
     <path d="M32 64 Q48 58 64 64" fill="${f}" stroke="${s}" stroke-width="1.3"/>
     <circle cx="52" cy="34" r="4" fill="${f}" stroke="${s}" stroke-width="1"/>`,

  ribosome: (s) =>
    `<circle cx="38" cy="48" r="5" fill="#fafafa" stroke="${s}" stroke-width="1.2"/>
     <circle cx="54" cy="48" r="5" fill="#fafafa" stroke="${s}" stroke-width="1.2"/>
     <circle cx="46" cy="38" r="4" fill="#fafafa" stroke="${s}" stroke-width="1"/>`,

  "cell-membrane": (s) =>
    `<path d="M14 48 Q48 38 82 48" fill="none" stroke="${s}" stroke-width="1.6"/>
     <path d="M14 54 Q48 64 82 54" fill="none" stroke="${s}" stroke-width="1.6"/>
     <circle cx="22" cy="44" r="2.5" fill="${s}" opacity="0.35"/><circle cx="32" cy="52" r="2.5" fill="${s}" opacity="0.35"/>
     <circle cx="46" cy="44" r="2.5" fill="${s}" opacity="0.35"/><circle cx="60" cy="52" r="2.5" fill="${s}" opacity="0.35"/>
     <circle cx="74" cy="44" r="2.5" fill="${s}" opacity="0.35"/>`,

  "bacteria-rod": (s, f = "#dbeafe") =>
    `<rect x="26" y="40" width="44" height="18" rx="9" fill="${f}" stroke="${s}" stroke-width="1.35"/>
     <path d="M34 46h8M54 52h8" stroke="${s}" stroke-width="0.9" opacity="0.5"/>`,

  "bacteria-coccus": (s, f = "#dbeafe") =>
    `<circle cx="34" cy="48" r="10" fill="${f}" stroke="${s}" stroke-width="1.25"/>
     <circle cx="52" cy="44" r="9" fill="${f}" stroke="${s}" stroke-width="1.25"/>
     <circle cx="62" cy="56" r="8" fill="${f}" stroke="${s}" stroke-width="1.25"/>`,

  "virus-enveloped": (s, f = "#fecaca") =>
    `<circle cx="48" cy="48" r="18" fill="${f}" stroke="${s}" stroke-width="1.35"/>
     <path d="M48 22v10M48 64v10M22 48h10M64 48h10M30 30l8 8M58 58l8 8M66 30l-8 8M38 58l-8 8" stroke="${s}" stroke-width="1.3" stroke-linecap="round"/>`,

  "yeast-cell": (s, f = "#ffedd5") =>
    `<circle cx="44" cy="50" r="20" fill="${f}" stroke="${s}" stroke-width="1.35"/>
     <circle cx="62" cy="38" r="10" fill="${f}" stroke="${s}" stroke-width="1.2"/>`,

  lysosome: (s, f = "#fce7f3") =>
    `<circle cx="48" cy="48" r="12" fill="${f}" stroke="${s}" stroke-width="1.3"/>
     <path d="M42 46 L46 52 L54 44" fill="none" stroke="${s}" stroke-width="1" stroke-linecap="round"/>`,

  chloroplast: (s, f = "#bbf7d0") =>
    `<ellipse cx="48" cy="48" rx="22" ry="14" fill="${f}" stroke="${s}" stroke-width="1.3"/>
     <path d="M30 48h36" stroke="${s}" stroke-width="0.9" opacity="0.6"/>
     <path d="M34 42h28M34 54h28" stroke="${s}" stroke-width="0.8" opacity="0.45"/>`,

  microscope: (s) =>
    `<path d="M28 72 L48 28 L68 72 Z" fill="#fafafa" stroke="${s}" stroke-width="1.35"/>
     <rect x="42" y="18" width="12" height="14" rx="2" fill="#f4f4f5" stroke="${s}" stroke-width="1.2"/>
     <circle cx="48" cy="24" r="4" fill="none" stroke="${s}" stroke-width="1.2"/>
     <ellipse cx="48" cy="56" rx="14" ry="8" fill="none" stroke="${s}" stroke-width="1.2"/>
     <rect x="20" y="70" width="56" height="5" rx="1" fill="${s}" opacity="0.25"/>`,

  "petri-dish": (s) =>
    `<ellipse cx="48" cy="44" rx="32" ry="14" fill="#f8fafc" stroke="${s}" stroke-width="1.35"/>
     <ellipse cx="48" cy="44" rx="26" ry="10" fill="none" stroke="${s}" stroke-width="1" opacity="0.6"/>
     <circle cx="38" cy="42" r="3" fill="#86efac" opacity="0.7" stroke="${s}" stroke-width="0.8"/>
     <circle cx="52" cy="46" r="2.5" fill="#a7f3d0" opacity="0.8" stroke="${s}" stroke-width="0.8"/>
     <circle cx="56" cy="40" r="2" fill="#6ee7b7" opacity="0.7" stroke="${s}" stroke-width="0.8"/>`,

  "well-plate": (s) =>
    `<rect x="18" y="28" width="60" height="44" rx="3" fill="#fafafa" stroke="${s}" stroke-width="1.25"/>
     ${Array.from({ length: 24 }, (_, i) => {
       const col = i % 6;
       const row = Math.floor(i / 6);
       const x = 24 + col * 9;
       const y = 34 + row * 12;
       return `<circle cx="${x}" cy="${y}" r="3.2" fill="#f1f5f9" stroke="${s}" stroke-width="0.85"/>`;
     }).join("")}`,

  pipette: (s) =>
    `<rect x="44" y="18" width="8" height="38" rx="2" fill="#f4f4f5" stroke="${s}" stroke-width="1.25"/>
     <path d="M40 56 L56 56 L52 72 L44 72 Z" fill="#e4e4e7" stroke="${s}" stroke-width="1.2"/>
     <path d="M46 74 L50 74 L49 82 L47 82 Z" fill="${s}" opacity="0.35"/>`,

  "flask-erlenmeyer": (s, f = "#e0f2fe") =>
    `<path d="M38 28h20l-8 36h-4l-8-36z" fill="${f}" stroke="${s}" stroke-width="1.35"/>
     <rect x="44" y="22" width="8" height="8" rx="1" fill="#f4f4f5" stroke="${s}" stroke-width="1.1"/>
     <ellipse cx="48" cy="58" rx="14" ry="4" fill="none" stroke="${s}" stroke-width="1"/>`,

  beaker: (s, f = "#dbeafe") =>
    `<path d="M32 30h32l-4 42H36l-4-42z" fill="${f}" stroke="${s}" stroke-width="1.35"/>
     <path d="M36 34h24" stroke="${s}" stroke-width="1" opacity="0.5"/>
     <path d="M44 26v6M52 26v6" stroke="${s}" stroke-width="1.2" stroke-linecap="round"/>`,

  "test-tube": (s, f = "#fef9c3") =>
    `<path d="M40 22h16v44q0 8-8 8t-8-8V22z" fill="${f}" stroke="${s}" stroke-width="1.35"/>
     <line x1="38" y1="28" x2="58" y2="28" stroke="${s}" stroke-width="1"/>`,

  "syringe-simple": (s) =>
    `<rect x="30" y="42" width="36" height="12" rx="2" fill="#fafafa" stroke="${s}" stroke-width="1.25"/>
     <rect x="66" y="45" width="10" height="6" fill="#e4e4e7" stroke="${s}" stroke-width="1"/>
     <path d="M30 48 H22" stroke="${s}" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M22 44v8" stroke="${s}" stroke-width="1.4" stroke-linecap="round"/>`,

  "gel-electrophoresis": (s) =>
    `<rect x="22" y="28" width="52" height="44" rx="2" fill="#f8fafc" stroke="${s}" stroke-width="1.25"/>
     <line x1="30" y1="38" x2="66" y2="38" stroke="${s}" stroke-width="1" opacity="0.35"/>
     ${[46, 52, 58].map((y) => `<line x1="28" y1="${y}" x2="68" y2="${y}" stroke="${s}" stroke-width="2.5" opacity="0.55"/>`).join("")}`,

  "dna-helix": (s) =>
    `<path d="M28 22 Q48 48 28 74" fill="none" stroke="${s}" stroke-width="1.6"/>
     <path d="M68 22 Q48 48 68 74" fill="none" stroke="${s}" stroke-width="1.6"/>
     ${[30, 42, 54, 66].map((y) => `<line x1="34" y1="${y}" x2="62" y2="${y}" stroke="${s}" stroke-width="1.2" opacity="0.85"/>`).join("")}`,

  "antibody-y": (s, f = "#fef3c7") =>
    `<path d="M48 72 L48 44" stroke="${s}" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M48 44 L34 28 M48 44 L62 28" stroke="${s}" stroke-width="2.4" stroke-linecap="round"/>
     <circle cx="34" cy="26" r="7" fill="${f}" stroke="${s}" stroke-width="1.2"/>
     <circle cx="62" cy="26" r="7" fill="${f}" stroke="${s}" stroke-width="1.2"/>
     <circle cx="48" cy="76" r="6" fill="${f}" stroke="${s}" stroke-width="1.2"/>`,

  "receptor-tyrosine": (s) =>
    `<line x1="14" y1="56" x2="82" y2="56" stroke="${s}" stroke-width="1.6"/>
     <path d="M48 56 L48 36 M48 36 L38 22 M48 36 L58 22" stroke="${s}" stroke-width="2" stroke-linecap="round"/>
     <circle cx="38" cy="20" r="5" fill="#fce7f3" stroke="${s}" stroke-width="1.1"/>
     <circle cx="58" cy="20" r="5" fill="#fce7f3" stroke="${s}" stroke-width="1.1"/>
     <circle cx="48" cy="68" r="4" fill="#dbeafe" stroke="${s}" stroke-width="1"/>`,

  "enzyme-substrate": (s) =>
    `<circle cx="34" cy="48" r="14" fill="#f1f5f9" stroke="${s}" stroke-width="1.3"/>
     <path d="M52 34 L68 38 L64 54 L48 50 Z" fill="#fef9c3" stroke="${s}" stroke-width="1.25"/>
     <circle cx="58" cy="42" r="3" fill="none" stroke="${s}" stroke-width="1"/>`,

  ligand: (s, f = "#fda4af") =>
    `<circle cx="48" cy="48" r="14" fill="${f}" stroke="${s}" stroke-width="1.35"/>
     <circle cx="44" cy="44" r="3" fill="none" stroke="${s}" stroke-width="1"/>
     <circle cx="54" cy="52" r="2.5" fill="none" stroke="${s}" stroke-width="1"/>`,

  "ion-channel": (s) =>
    `<rect x="38" y="24" width="20" height="48" rx="3" fill="#e0f2fe" stroke="${s}" stroke-width="1.35"/>
     <path d="M42 32h12M42 40h12M42 48h12M42 56h12" stroke="${s}" stroke-width="1.4" stroke-linecap="round"/>
     <line x1="14" y1="48" x2="82" y2="48" stroke="${s}" stroke-width="1.2" opacity="0.45"/>`,

  "bar-chart": (s) =>
    `<rect x="22" y="52" width="10" height="22" fill="#93c5fd" stroke="${s}" stroke-width="1"/>
     <rect x="38" y="40" width="10" height="34" fill="#86efac" stroke="${s}" stroke-width="1"/>
     <rect x="54" y="46" width="10" height="28" fill="#fcd34d" stroke="${s}" stroke-width="1"/>
     <rect x="70" y="34" width="10" height="40" fill="#fca5a5" stroke="${s}" stroke-width="1"/>
     <line x1="18" y1="76" x2="86" y2="76" stroke="${s}" stroke-width="1.2"/>`,

  "line-chart": (s) =>
    `<rect x="20" y="24" width="56" height="48" rx="2" fill="#fafafa" stroke="${s}" stroke-width="1.1"/>
     <polyline points="26,58 38,44 50,52 62,36 74,42" fill="none" stroke="${s}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="38" cy="44" r="2.5" fill="#fff" stroke="${s}" stroke-width="1"/>
     <circle cx="62" cy="36" r="2.5" fill="#fff" stroke="${s}" stroke-width="1"/>`,

  neuron: (s, f = "#fafafa") =>
    `<circle cx="48" cy="50" r="12" fill="${f}" stroke="${s}" stroke-width="1.35"/>
     <path d="M48 38 V22 M36 30 L26 18 M60 30 L70 18 M34 58 L22 72 M62 58 L74 70" stroke="${s}" stroke-width="1.35" stroke-linecap="round"/>
     <path d="M48 62 Q54 72 62 78" fill="none" stroke="${s}" stroke-width="1.2"/>`,

  brain: (s, f = "#fce7f3") =>
    `<path d="M28 52 Q26 32 48 26 Q70 32 68 52 Q72 68 48 74 Q24 68 28 52Z" fill="${f}" stroke="${s}" stroke-width="1.35"/>
     <path d="M38 40 Q48 44 58 40M34 52 Q48 56 62 52" fill="none" stroke="${s}" stroke-width="1" opacity="0.7"/>`,

  lungs: (s, f = "#fecaca") =>
    `<path d="M48 26 V58M34 30 Q26 48 30 68 Q38 74 46 68 Q46 48 48 30Z" fill="${f}" stroke="${s}" stroke-width="1.3"/>
     <path d="M48 26 V58M62 30 Q70 48 66 68 Q58 74 50 68 Q50 48 48 30Z" fill="${f}" stroke="${s}" stroke-width="1.3"/>
     <path d="M42 36 Q46 44 42 52M54 36 Q50 44 54 52" fill="none" stroke="${s}" stroke-width="1" opacity="0.6"/>`,

  rat: (s, f = "#e7e5e4") =>
    `<ellipse cx="42" cy="52" rx="18" ry="12" fill="${f}" stroke="${s}" stroke-width="1.25"/>
     <circle cx="26" cy="48" r="8" fill="${f}" stroke="${s}" stroke-width="1.2"/>
     <path d="M22 44 L14 38M22 48 L12 48M22 52 L14 58" stroke="${s}" stroke-width="1.2" stroke-linecap="round"/>
     <path d="M58 52 Q72 48 78 42" fill="none" stroke="${s}" stroke-width="1.3" stroke-linecap="round"/>`,

  capsule: (s, f = "#fecaca") =>
    `<rect x="30" y="42" width="36" height="14" rx="7" fill="${f}" stroke="${s}" stroke-width="1.35"/>
     <line x1="48" y1="42" x2="48" y2="56" stroke="${s}" stroke-width="1"/>`,

  tablet: (s, f = "#f4f4f5") =>
    `<rect x="34" y="40" width="28" height="18" rx="3" fill="${f}" stroke="${s}" stroke-width="1.3"/>
     <line x1="48" y1="43" x2="48" y2="55" stroke="${s}" stroke-width="1"/>`,

  molecule: (s) =>
    `<circle cx="34" cy="40" r="8" fill="#dbeafe" stroke="${s}" stroke-width="1.2"/>
     <circle cx="58" cy="36" r="8" fill="#fef9c3" stroke="${s}" stroke-width="1.2"/>
     <circle cx="50" cy="58" r="8" fill="#fecaca" stroke="${s}" stroke-width="1.2"/>
     <line x1="40" y1="43" x2="52" y2="52" stroke="${s}" stroke-width="1.4"/>
     <line x1="52" y1="36" x2="54" y2="52" stroke="${s}" stroke-width="1.4"/>
     <line x1="42" y1="40" x2="52" y2="38" stroke="${s}" stroke-width="1.4"/>`,

  "chem-structure": (s) =>
    `<polygon points="48,24 66,36 66,60 48,72 30,60 30,36" fill="none" stroke="${s}" stroke-width="1.35"/>
     <circle cx="48" cy="48" r="10" fill="none" stroke="${s}" stroke-width="1.2"/>
     <line x1="48" y1="24" x2="48" y2="14" stroke="${s}" stroke-width="1.2"/>`,
} satisfies Record<string, B>;

export const SCIENCE_SYMBOL_IDS = Object.keys(SYMBOL_BUILDERS) as ScienceSymbolId[];

export function scienceSymbolToSvg(
  id: ScienceSymbolId,
  { color = "#0f172a", size = 96 }: { color?: string; size?: number } = {},
): string {
  const inner = SYMBOL_BUILDERS[id](color);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 96 96" fill="none">${inner}</svg>`;
}

export function scienceSymbolDataUrl(
  id: ScienceSymbolId,
  opts: { color?: string; size?: number } = {},
): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(scienceSymbolToSvg(id, opts))}`;
}
