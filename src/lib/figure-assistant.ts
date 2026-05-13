import { z } from "zod";

/** Items the model places on the Fabric canvas (validated server-side). */
export const canvasItemSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("svg"),
    svg: z
      .string()
      .describe(
        "Complete standalone SVG document: includes xmlns on root, viewBox fitting ~ 480–620px wide and ~ 260–400px tall, scientific schematic only (paths, rects, circles, lines, text). Ink #0f172a strokes, restrained fills (#e2e8f0, #bfdbfe). No scripts, filters, or external images.",
      ),
    caption: z
      .string()
      .optional()
      .describe("Optional short figure note placed under this SVG."),
  }),
  z.object({
    type: z.literal("text"),
    text: z
      .string()
      .describe("Short caption or label block; keep under ~400 chars for readability."),
  }),
]);

export const figureAssistantResponseSchema = z.object({
  assistantMessage: z
    .string()
    .describe(
      "Plain-language explanation, caveats about schematic vs experiment-specific detail, or critique as requested.",
    ),
  canvasItems: z
    .array(canvasItemSchema)
    .describe(
      "For diagram tasks: typically one svg item (optionally captions). For consult-only: zero or few text items highlighting key edits.",
    ),
});

export type FigureAssistantCanvasItem = z.infer<typeof canvasItemSchema>;
export type FigureAssistantResponse = z.infer<typeof figureAssistantResponseSchema>;

export function buildFigureAssistantSystemPrompt(mode: "diagram" | "consult"): string {
  const base = `You are a scientific illustration copilot embedded in Canvas.bio — a publication-oriented vector figure editor.

Scientific grounding: depict only well-supported, textbook-level biology. If the user asks for undocumented or speculative pathways, say so briefly in assistantMessage and draw only what is universally accepted unless the user insists on hypothetical framing (then prefix labels "schematic • hypothetical").

Visual style for SVGs: restrained abstraction, hierarchy, generous whitespace, no cluttered molecular detail. Avoid receptor-in-the-middle clichés unless asked. Use simple geometry and legible typography (system sans via text/font-family Arial or Helvetica).

Output MUST match the structured schema.`;

  if (mode === "diagram") {
    return `${base}

Mode: DIAGRAM GENERATION — You will place new content on the user's live canvas.
- Primary deliverable is one cohesive SVG schematic in canvasItems (type svg) unless the sketch truly needs separate panels — prefer a single grouped composition.
- Each SVG root must declare xmlns="http://www.w3.org/2000/svg" and a sensible viewBox.
- Keep primitives compatible with Fabric.js SVG import: avoid mask=url(), filters, nested foreignObject unless essential.
- assistantMessage summarizes what was drawn and cites key biological caveats.`;
  }

  return `${base}

Mode: CONSULT / CRITIQUE — Focus on publication readability, hierarchy, annotation load, and layout flow.
- assistantMessage contains the full critique and recommendations.
- canvasItems: usually empty. If helpful, add at most 2 short type "text" reminders (e.g. "Tighten vertical rhythm" / "Reduce label density") as pull-quotes the user can delete on-canvas.`;
}
