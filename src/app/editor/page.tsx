"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import EditorToolbar from "@/components/EditorToolbar";
import AssetLibrary from "@/components/AssetLibrary";
import FigureAssistantPanel from "@/components/FigureAssistantPanel";
import type { EditorCanvasHandle } from "@/components/EditorCanvas";
import type { IconAsset } from "@/lib/assets";
import { findTemplate } from "@/lib/templates";
import { lucideToSvg } from "@/lib/lucide-svg";
import { scienceSymbolToSvg } from "@/lib/science-symbols";
import { supabase } from "@/lib/supabase";

const EditorCanvas = dynamic(() => import("@/components/EditorCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-muted/40">
      <Loader2 className="h-7 w-7 animate-spin text-primary" strokeWidth={1.6} />
      <p className="font-mono text-[12px] text-muted-foreground">Preparing canvas…</p>
    </div>
  ),
});

function EditorPageInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const figureId     = searchParams.get("id");
  const templateId   = searchParams.get("template");

  const canvasRef = useRef<EditorCanvasHandle>(null);

  const [title,    setTitle]    = useState("Untitled Figure");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved,  setIsSaved]  = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(figureId);

  useEffect(() => {
    if (!figureId) return;

    async function loadFigure() {
      const { data, error } = await supabase
        .from("figures")
        .select("title, canvas_json")
        .eq("id", figureId)
        .single();

      if (error || !data) {
        console.error("Could not load figure:", error);
        return;
      }

      setTitle(data.title);
      setCurrentId(figureId);

      setTimeout(() => {
        canvasRef.current?.loadFromData(data.canvas_json);
        setIsSaved(true);
      }, 500);
    }

    loadFigure();
  }, [figureId]);

  useEffect(() => {
    if (figureId || !templateId) return;
    const tpl = findTemplate(templateId);
    if (!tpl) return;

    setTitle(tpl.defaultTitle);
    setIsSaved(false);

    const timer = setTimeout(() => {
      canvasRef.current?.loadTemplate(tpl.ops);
    }, 500);
    return () => clearTimeout(timer);
  }, [templateId, figureId]);

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    setIsSaved(false);
  }

  async function handleSave() {
    setIsSaving(true);

    const canvasData = canvasRef.current?.getCanvasData();
    if (!canvasData) { setIsSaving(false); return; }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/login");
      return;
    }

    const payload = {
      user_id:     userData.user.id,
      title:       title.trim() || "Untitled Figure",
      canvas_json: canvasData.json,
      preview:     canvasData.preview,
      updated_at:  new Date().toISOString(),
    };

    let savedId = currentId;

    if (currentId) {
      await supabase.from("figures").update(payload).eq("id", currentId);
    } else {
      const { data } = await supabase
        .from("figures")
        .insert(payload)
        .select("id")
        .single();
      savedId = data?.id ?? null;

      if (savedId) {
        router.replace(`/editor?id=${savedId}`);
        setCurrentId(savedId);
      }
    }

    setIsSaving(false);
    setIsSaved(true);
  }

  function handleIconClick(icon: IconAsset) {
    const svg = icon.scienceSymbol
      ? scienceSymbolToSvg(icon.scienceSymbol, { color: "#0f172a", size: 96 })
      : lucideToSvg(icon.lucide, { color: "#0f172a" });
    canvasRef.current?.addSvg(svg, icon.name);
    setIsSaved(false);
  }

  return (
    <>
      <EditorToolbar
        title={title}
        onTitleChange={handleTitleChange}
        isSaving={isSaving}
        isSaved={isSaved}
        onSave={handleSave}
        onAddText={() => { canvasRef.current?.addText(); setIsSaved(false); }}
        onDelete={() => { canvasRef.current?.deleteSelected(); setIsSaved(false); }}
        onColorChange={(c) => { canvasRef.current?.changeColor(c); setIsSaved(false); }}
        onDownload={() => canvasRef.current?.downloadImage()}
        onClear={() => { canvasRef.current?.clearCanvas(); setIsSaved(false); }}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden xl:flex-row">
        <AssetLibrary onSelectIcon={handleIconClick} />
        <div className="flex min-h-[min(480px,55vh)] min-w-0 flex-1 flex-col xl:min-h-0">
          <EditorCanvas ref={canvasRef} />
        </div>
        <FigureAssistantPanel
          canvasRef={canvasRef}
          onCanvasModified={() => setIsSaved(false)}
        />
      </div>
    </>
  );
}

export default function EditorPage() {
  return (
    <Suspense>
      <EditorPageInner />
    </Suspense>
  );
}
