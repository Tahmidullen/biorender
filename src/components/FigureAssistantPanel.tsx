"use client";

import { useEffect, useState, type RefObject } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EditorCanvasHandle } from "@/components/EditorCanvas";
import type { FigureAssistantResponse } from "@/lib/figure-assistant";
import { VectorMascot } from "@/components/VectorMascot";

type Props = {
  canvasRef: RefObject<EditorCanvasHandle | null>;
  /** Mark figure dirty after canvas mutation */
  onCanvasModified: () => void;
};

const PRESETS_DIAGRAM = [
  "Minimal RTK–Ras–MAPK pathway from ligand binding to nucleus (schematic, not to scale)",
  "GPCR activates adenylyl cyclase increasing cAMP; PKA relays to nucleus (high-level)",
  "JAK–STAT signalling: cytokine, receptor dimer, STAT activation → nuclear transcription",
];

const PRESETS_CONSULT = [
  "Does this plate read fast for a reviewer? Where would you tighten arrows or labels?",
  "I'm moving this from slides to a two-column PDF — what would you change first?",
];

export default function FigureAssistantPanel({ canvasRef, onCanvasModified }: Props) {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"diagram" | "consult">("diagram");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [placedMeta, setPlacedMeta] = useState<string | null>(null);
  /** Mimic “answer being written” after the reply payload arrives (no streaming yet). */
  const [replySpeaking, setReplySpeaking] = useState(false);

  useEffect(() => {
    if (busy) {
      setReplySpeaking(false);
      return;
    }
    if (!reply?.trim()) {
      setReplySpeaking(false);
      return;
    }
    setReplySpeaking(true);
    const ms = Math.min(12000, Math.max(1600, reply.length * 28));
    const id = window.setTimeout(() => setReplySpeaking(false), ms);
    return () => window.clearTimeout(id);
  }, [reply, busy]);

  async function runAssistant() {
    const trimmed = prompt.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setError(null);
    setReply(null);
    setPlacedMeta(null);
    try {
      const res = await fetch("/api/figure-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed, mode }),
      });

      const data = (await res.json()) as FigureAssistantResponse | { error?: string };

      if (!res.ok) {
        setError(("error" in data && data.error) || `Request failed (${res.status})`);
        return;
      }

      const figure = data as FigureAssistantResponse;
      setReply(figure.assistantMessage);

      const handle = canvasRef.current;
      if (!handle) {
        setError("Canvas is still loading.");
        return;
      }

      const stats = await handle.applyFigureAssistantItems(figure.canvasItems);
      setPlacedMeta(
        `${stats.placed} object${stats.placed === 1 ? "" : "s"} on canvas${stats.failed ? ` (${stats.failed} skipped)` : ""}`,
      );
      if (stats.placed > 0) onCanvasModified();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside
      className={cn(
        "flex h-[min(480px,48vh)] shrink-0 flex-col border-border bg-surface shadow-[inset_1px_0_0_theme(colors.border)]",
        "w-full xl:h-full xl:w-[min(100vw,360px)] xl:max-w-[360px]",
        "border-t xl:border-l xl:border-t-0 xl:shadow-none",
      )}
    >
      <div className="flex items-center gap-3 border-b border-border/80 px-3 py-2.5">
        <VectorMascot
          assistantMode={mode === "diagram" ? "creator" : "consultant"}
          size={46}
          tone="editor"
          busy={busy}
          speaking={replySpeaking}
          interactive
        />
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Vector</p>
          <p className="font-display text-[14px] text-foreground">Your ideas on canvas</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border/60 px-3 py-2">
        <ModeChip
          active={mode === "diagram"}
          onClick={() => setMode("diagram")}
          label="Creator mode"
        />
        <ModeChip
          active={mode === "consult"}
          onClick={() => setMode("consult")}
          label="Consultant mode"
        />
      </div>

      <ScrollArea className="min-h-[56px] max-h-[28vh] xl:max-h-[120px]">
        <div className="space-y-1.5 px-3 py-2">
          <p className="meta-mono text-[10px] text-muted-foreground">Try one</p>
          <div className="flex flex-wrap gap-1.5 pb-1">
            {(mode === "diagram" ? PRESETS_DIAGRAM : PRESETS_CONSULT).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrompt(p)}
                className="rounded-md border border-border/80 bg-muted/30 px-2 py-1 text-left font-sans text-[11px] leading-snug text-foreground/85 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <label className="sr-only" htmlFor="vector-panel-input">
        Message for Vector
      </label>
      <textarea
        id="vector-panel-input"
        value={prompt}
        disabled={busy}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={
          mode === "diagram"
            ? "What should appear on the canvas? Say it in plain language."
            : "What feels off? Ask like you would a labmate."
        }
        rows={mode === "consult" ? 5 : 4}
        className="mx-3 mb-2 min-h-[88px] resize-none rounded-lg border border-border bg-background px-3 py-2 font-sans text-[13px] text-foreground shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary/35 disabled:opacity-55"
      />

      {error ? (
        <div className="mx-3 mb-2 rounded-md border border-destructive/35 bg-destructive/10 px-2 py-1.5 text-[12px] text-destructive">
          {error}
        </div>
      ) : null}

      <div className="px-3 pb-2">
        <Button
          type="button"
          size="sm"
          className="w-full gap-2 text-[12px]"
          disabled={busy || !prompt.trim()}
          onClick={runAssistant}
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
              {mode === "diagram" ? "Drawing…" : "Thinking…"}
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
              {mode === "diagram" ? "Add to canvas" : "Ask consultant"}
            </>
          )}
        </Button>
        {placedMeta ? (
          <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">{placedMeta}</p>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-t border-border/70 bg-muted/15">
        <p className="meta-mono px-3 py-2 text-[10px] text-muted-foreground">Reply</p>
        <ScrollArea className="min-h-[100px] flex-1">
          <div className="px-3 pb-4">
            {reply ? (
              <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-foreground/90">
                {reply}
              </p>
            ) : (
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                Creator puts shapes on the canvas you can drag like anything else. Consultant answers here — read it, fix the figure, ask again.
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}

function ModeChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-md border px-1.5 py-1.5 font-sans text-[10px] font-medium transition-colors sm:px-2 sm:text-[11px]",
        active
          ? "border-primary bg-primary/12 text-primary"
          : "border-border bg-background text-muted-foreground hover:bg-muted",
      )}
    >
      {label}
    </button>
  );
}
