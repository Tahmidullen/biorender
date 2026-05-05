"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as fabric from "fabric";

export type EditorCanvasHandle = {
  addText: () => void;
  addEmoji: (emoji: string, label: string) => void;
  deleteSelected: () => void;
  changeColor: (color: string) => void;
  downloadImage: () => void;
  clearCanvas: () => void;
  // Phase 5: save & load
  getCanvasData: () => { json: string; preview: string };
  loadFromData: (json: string) => void;
};

const EditorCanvas = forwardRef<EditorCanvasHandle>((_, ref) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef  = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const W = container.clientWidth  || 900;
    const H = container.clientHeight || 600;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: W,
      height: H,
      backgroundColor: "#ffffff",
    });

    fabricRef.current = canvas;

    // Resize the Fabric canvas when the window is resized
    // Fabric v6+ uses setDimensions instead of setWidth/setHeight
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

  useImperativeHandle(ref, () => ({
    addText() {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const text = new fabric.IText("Double-click to edit", {
        left: Math.max(40, (canvas.width ?? 400) / 2 - 110),
        top:  Math.max(40, (canvas.height ?? 300) / 2 - 15),
        fontSize: 22,
        fill: "#1f2937",
        fontFamily: "sans-serif",
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
        fill: "#6b7280",
        fontFamily: "sans-serif",
      });
      canvas.add(emojiObj, labelObj);
      canvas.setActiveObject(emojiObj);
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
      const selected = canvas.getActiveObjects();
      selected.forEach((obj) => {
        obj.set("fill", color);
      });
      // Force a full re-render so the new colour is visible immediately
      canvas.requestRenderAll();
    },

    downloadImage() {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "biorender-figure.png";
      a.click();
    },

    clearCanvas() {
      const canvas = fabricRef.current;
      if (!canvas) return;
      canvas.clear();
      canvas.backgroundColor = "#ffffff";
      canvas.renderAll();
    },

    // Returns the full canvas state as JSON + a small preview image (base64)
    getCanvasData() {
      const canvas = fabricRef.current;
      if (!canvas) return { json: "{}", preview: "" };
      const json    = JSON.stringify(canvas.toJSON());
      const preview = canvas.toDataURL({ format: "png", multiplier: 0.3 });
      return { json, preview };
    },

    // Restores a canvas from a previously saved JSON string
    loadFromData(json: string) {
      const canvas = fabricRef.current;
      if (!canvas) return;
      canvas.loadFromJSON(JSON.parse(json)).then(() => {
        canvas.renderAll();
      });
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
        // Subtle dot-grid background so the white canvas looks like it floats
        background: "#e5e7eb",
        backgroundImage:
          "radial-gradient(circle, #9ca3af 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div
        style={{
          boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #d1d5db",
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
});

EditorCanvas.displayName = "EditorCanvas";
export default EditorCanvas;
