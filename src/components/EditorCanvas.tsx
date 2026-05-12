"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as fabric from "fabric";
import type { TemplateOp } from "@/lib/templates";

function createDotPattern(): fabric.Pattern {
  const d = 22;
  const el = document.createElement("canvas");
  el.width = d;
  el.height = d;
  const ctx = el.getContext("2d");
  if (!ctx) {
    return new fabric.Pattern({ source: el, repeat: "repeat" });
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, d, d);
  ctx.fillStyle = "rgba(15, 23, 42, 0.11)";
  ctx.beginPath();
  ctx.arc(d / 2, d / 2, 1.1, 0, Math.PI * 2);
  ctx.fill();
  return new fabric.Pattern({ source: el, repeat: "repeat" });
}

export type EditorCanvasHandle = {
  addText: () => void;
  /** Legacy: drop an emoji glyph onto the canvas. Kept for back-compat. */
  addEmoji: (emoji: string, label: string) => void;
  /** Drop a real SVG asset onto the canvas (vector, scalable, recolourable). */
  addSvg: (svgString: string, label?: string) => Promise<void>;
  deleteSelected: () => void;
  changeColor: (color: string) => void;
  downloadImage: () => void;
  clearCanvas: () => void;
  getCanvasData: () => { json: string; preview: string };
  loadFromData: (json: string) => void;
  /** Replay a list of template operations onto a fresh canvas. */
  loadTemplate: (ops: TemplateOp[]) => Promise<void>;
};

type FontFamily = "sans" | "serif" | "mono";

const FAMILY_MAP: Record<FontFamily, string> = {
  sans:  "var(--font-sans), system-ui, sans-serif",
  serif: "var(--font-display), ui-serif, Georgia, serif",
  mono:  "var(--font-mono), ui-monospace, monospace",
};

const EditorCanvas = forwardRef<EditorCanvasHandle>((_, ref) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef    = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const W = container.clientWidth  || 900;
    const H = container.clientHeight || 600;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: W,
      height: H,
      backgroundColor: createDotPattern(),
    });

    fabricRef.current = canvas;

    function handleResize() {
      canvas.setDimensions({
        width:  container.clientWidth,
        height: container.clientHeight,
      });
      canvas.renderAll();
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, []);

  async function buildSvgObject(
    svgString: string,
    targetSize: number,
  ): Promise<fabric.Object | null> {
    const parsed = await fabric.loadSVGFromString(svgString);
    const objects = (parsed.objects ?? []).filter(
      (o): o is fabric.Object => o !== null,
    );
    if (objects.length === 0) return null;

    const grouped = fabric.util.groupSVGElements(objects, parsed.options);

    const w = grouped.width  ?? targetSize;
    const h = grouped.height ?? targetSize;
    const scale = targetSize / Math.max(w, h);
    grouped.scale(scale);
    grouped.set({ originX: "center", originY: "center" });
    return grouped;
  }

  function fontFor(family?: FontFamily): string {
    return FAMILY_MAP[family ?? "sans"];
  }

  useImperativeHandle(ref, () => ({
    addText() {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const text = new fabric.IText("Double-click to edit", {
        left: Math.max(40, (canvas.width ?? 400) / 2 - 110),
        top:  Math.max(40, (canvas.height ?? 300) / 2 - 15),
        fontSize: 22,
        fill: "#0f172a",
        fontFamily: FAMILY_MAP.sans,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    },

    addEmoji(emoji: string, label: string) {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const W = canvas.width  ?? 900;
      const H = canvas.height ?? 600;

      const emojiObj = new fabric.IText(emoji, {
        left: 80 + Math.random() * (W - 200),
        top:  80 + Math.random() * (H - 200),
        fontSize: 52,
      });
      const labelObj = new fabric.IText(label, {
        left: emojiObj.left,
        top:  (emojiObj.top ?? 0) + 64,
        fontSize: 13,
        fill: "#475569",
        fontFamily: FAMILY_MAP.sans,
      });
      canvas.add(emojiObj, labelObj);
      canvas.setActiveObject(emojiObj);
      canvas.renderAll();
    },

    async addSvg(svgString: string, label?: string) {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const W = canvas.width  ?? 900;
      const H = canvas.height ?? 600;

      const obj = await buildSvgObject(svgString, 110);
      if (!obj) return;

      const cx = 100 + Math.random() * (W - 200);
      const cy = 100 + Math.random() * (H - 200);
      obj.set({ left: cx, top: cy });
      canvas.add(obj);

      if (label) {
        const labelObj = new fabric.IText(label, {
          left: cx, top: cy + 70,
          originX: "center", originY: "top",
          fontSize: 13,
          fontStyle: "italic",
          fill: "#475569",
          fontFamily: FAMILY_MAP.serif,
        });
        canvas.add(labelObj);
      }

      canvas.setActiveObject(obj);
      canvas.renderAll();
    },

    deleteSelected() {
      const canvas = fabricRef.current;
      if (!canvas) return;
      canvas.getActiveObjects().forEach((obj) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
    },

    changeColor(color: string) {
      const canvas = fabricRef.current;
      if (!canvas) return;
      canvas.getActiveObjects().forEach((obj) => {
        recolourDeep(obj, color);
      });
      canvas.requestRenderAll();
    },

    downloadImage() {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "canvas-figure.png";
      a.click();
    },

    clearCanvas() {
      const canvas = fabricRef.current;
      if (!canvas) return;
      canvas.clear();
      canvas.backgroundColor = createDotPattern();
      canvas.renderAll();
    },

    getCanvasData() {
      const canvas = fabricRef.current;
      if (!canvas) return { json: "{}", preview: "" };
      const json    = JSON.stringify(canvas.toJSON());
      const preview = canvas.toDataURL({ format: "png", multiplier: 0.3 });
      return { json, preview };
    },

    loadFromData(json: string) {
      const canvas = fabricRef.current;
      if (!canvas) return;
      canvas.loadFromJSON(JSON.parse(json)).then(() => {
        canvas.renderAll();
      });
    },

    async loadTemplate(ops: TemplateOp[]) {
      const canvas = fabricRef.current;
      if (!canvas) return;
      canvas.clear();
      canvas.backgroundColor = createDotPattern();

      const W = canvas.width  ?? 900;
      const H = canvas.height ?? 600;

      const { lucideToSvg } = await import("@/lib/lucide-svg");
      const { scienceSymbolToSvg } = await import("@/lib/science-symbols");

      for (const op of ops) {
        if (op.kind === "svg") {
          const color = op.color ?? "#0f172a";
          const size = op.size ?? 96;
          const svgString =
            op.scienceSymbol != null
              ? scienceSymbolToSvg(op.scienceSymbol, { color, size })
              : op.lucide != null
                ? lucideToSvg(op.lucide, {
                    color,
                    fill: op.fill ?? "none",
                    size,
                  })
                : null;
          if (!svgString) continue;
          const obj = await buildSvgObject(svgString, size);
          if (!obj) continue;
          obj.set({ left: op.x * W, top: op.y * H });
          canvas.add(obj);
        } else {
          const txt = new fabric.IText(op.text, {
            left: op.x * W,
            top:  op.y * H,
            originX: "center",
            originY: "center",
            fontSize: op.fontSize ?? 14,
            fill: op.color ?? "#0f172a",
            fontFamily: fontFor(op.family),
            fontStyle: op.italic ? "italic" : "normal",
          });
          canvas.add(txt);
        }
      }

      canvas.discardActiveObject();
      canvas.renderAll();
    },
  }));

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "var(--muted, #f3f4f6)",
        backgroundImage:
          "radial-gradient(circle, color-mix(in oklab, var(--ink, #0f172a) 14%, transparent) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div
        style={{
          boxShadow:
            "0 24px 60px -24px color-mix(in oklab, var(--ink, #0f172a) 30%, transparent)",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid var(--border, #d1d5db)",
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
});

function recolourDeep(obj: fabric.Object, color: string): void {
  const asGroup = obj as unknown as { getObjects?: () => fabric.Object[] };
  if (typeof asGroup.getObjects === "function") {
    for (const child of asGroup.getObjects()) recolourDeep(child, color);
    return;
  }
  const o = obj as fabric.Object & { stroke?: string | null; fill?: string | null };
  if (o.stroke !== undefined && o.stroke !== null) o.set("stroke", color);
  if (o.fill && o.fill !== "transparent" && o.fill !== "none") {
    o.set("fill", color);
  }
}

EditorCanvas.displayName = "EditorCanvas";
export default EditorCanvas;
