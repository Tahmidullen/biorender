"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import EditorToolbar from "@/components/EditorToolbar";
import AssetLibrary from "@/components/AssetLibrary";
import type { EditorCanvasHandle } from "@/components/EditorCanvas";
import type { IconAsset } from "@/lib/assets";
import { supabase } from "@/lib/supabase";

const EditorCanvas = dynamic(() => import("@/components/EditorCanvas"), {
  ssr: false,
  loading: () => (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 12,
      background: "#f3f4f6",
    }}>
      <div style={{
        width: 32, height: 32,
        border: "4px solid #14b8a6", borderTopColor: "transparent",
        borderRadius: "50%", animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ fontSize: 13, color: "#9ca3af" }}>Loading canvas...</p>
    </div>
  ),
});

// useSearchParams must be inside a Suspense boundary in Next.js App Router
function EditorPageInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const figureId     = searchParams.get("id"); // present when opening a saved figure

  const canvasRef = useRef<EditorCanvasHandle>(null);

  const [title,    setTitle]    = useState("Untitled Figure");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved,  setIsSaved]  = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(figureId);

  // When the page loads with ?id=xxx, load that figure from Supabase
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

      // Wait a moment for the Fabric canvas to fully mount before loading data
      setTimeout(() => {
        canvasRef.current?.loadFromData(data.canvas_json);
        setIsSaved(true);
      }, 500);
    }

    loadFigure();
  }, [figureId]);

  // When title changes, mark it as unsaved
  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    setIsSaved(false);
  }

  async function handleSave() {
    setIsSaving(true);

    // Get the current canvas state: JSON data + a small preview image
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
      // Update the existing row
      await supabase.from("figures").update(payload).eq("id", currentId);
    } else {
      // Insert a brand new row and get back its id
      const { data } = await supabase
        .from("figures")
        .insert(payload)
        .select("id")
        .single();
      savedId = data?.id ?? null;

      // Update the URL so refreshing keeps the same figure
      if (savedId) {
        router.replace(`/editor?id=${savedId}`);
        setCurrentId(savedId);
      }
    }

    setIsSaving(false);
    setIsSaved(true);
  }

  function handleIconClick(icon: IconAsset) {
    canvasRef.current?.addEmoji(icon.emoji, icon.name);
    setIsSaved(false); // canvas changed — mark unsaved
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

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <AssetLibrary onSelectIcon={handleIconClick} />
        <EditorCanvas ref={canvasRef} />
      </div>
    </>
  );
}

// Wrap in Suspense because useSearchParams() requires it in Next.js App Router
export default function EditorPage() {
  return (
    <Suspense>
      <EditorPageInner />
    </Suspense>
  );
}
