"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const COLORS = [
  { hex: "#1f2937", label: "Dark"   },
  { hex: "#ef4444", label: "Red"    },
  { hex: "#f97316", label: "Orange" },
  { hex: "#eab308", label: "Yellow" },
  { hex: "#22c55e", label: "Green"  },
  { hex: "#3b82f6", label: "Blue"   },
  { hex: "#8b5cf6", label: "Purple" },
  { hex: "#ec4899", label: "Pink"   },
  { hex: "#ffffff", label: "White"  },
];

type Props = {
  title:         string;
  onTitleChange: (t: string) => void;
  isSaving:      boolean;
  isSaved:       boolean;
  onSave:        () => void;
  onAddText:     () => void;
  onDelete:      () => void;
  onColorChange: (color: string) => void;
  onDownload:    () => void;
  onClear:       () => void;
};

export default function EditorToolbar({
  title, onTitleChange,
  isSaving, isSaved, onSave,
  onAddText, onDelete, onColorChange, onDownload, onClear,
}: Props) {
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  function startEditingTitle() {
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.select(), 0);
  }

  function finishEditingTitle() {
    setEditingTitle(false);
  }

  return (
    <header className="h-14 min-h-14 flex items-center justify-between px-4 bg-white border-b border-gray-200 gap-3">

      {/* Left: logo + editable title */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 no-underline">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="font-bold text-sm text-gray-900 hidden sm:block">BioRender</span>
        </Link>

        <Separator orientation="vertical" className="h-5" />

        {/* Click title to rename */}
        {editingTitle ? (
          <input
            ref={titleInputRef}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={finishEditingTitle}
            onKeyDown={(e) => e.key === "Enter" && finishEditingTitle()}
            className="text-sm font-medium text-gray-900 border border-primary rounded-md px-2 py-0.5 outline-none w-44"
          />
        ) : (
          <Tooltip>
            <TooltipTrigger render={<span className="inline-flex" />}>
              <span
                onClick={startEditingTitle}
                className="text-sm text-gray-700 font-medium cursor-text px-1.5 py-0.5 rounded border border-transparent hover:border-gray-200 transition-colors"
              >
                {title}
              </span>
            </TooltipTrigger>
            <TooltipContent>Click to rename</TooltipContent>
          </Tooltip>
        )}

        {/* Save status badge */}
        <Badge
          variant={isSaved ? "default" : "secondary"}
          className={isSaved
            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 text-[10px]"
            : "text-[10px]"
          }
        >
          {isSaving ? "Saving…" : isSaved ? "✓ Saved" : "Unsaved"}
        </Badge>
      </div>

      {/* Center: tools */}
      <div className="flex items-center gap-1.5 flex-1 justify-center">

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onAddText}
          title="Add a text label"
          className="text-xs gap-1"
        >
          𝐓 Text
        </Button>

        <Separator orientation="vertical" className="h-5" />

        {/* Fill colour swatches */}
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
          <span className="text-[10px] text-muted-foreground font-semibold mr-1">Fill</span>
          {COLORS.map((c) => (
            <Tooltip key={c.hex}>
              <TooltipTrigger render={<span className="inline-flex" />}>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onColorChange(c.hex)}
                  title={c.label}
                  className="w-4 h-4 rounded-full border border-gray-300 cursor-pointer hover:scale-125 transition-transform flex-shrink-0"
                  style={{ background: c.hex }}
                />
              </TooltipTrigger>
              <TooltipContent>{c.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator orientation="vertical" className="h-5" />

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onDelete}
          title="Delete selected object"
          className="text-xs gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          🗑 Delete
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClear}
          title="Clear entire canvas"
          className="text-xs gap-1"
        >
          ✕ Clear
        </Button>
      </div>

      {/* Right: Save + Export */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant={isSaved ? "outline" : "secondary"}
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          title="Save to your dashboard"
          className={isSaved ? "border-green-200 text-green-700 hover:bg-green-50 text-xs" : "text-xs"}
        >
          {isSaving ? "⏳ Saving…" : isSaved ? "✓ Saved" : "💾 Save"}
        </Button>

        <button
          onClick={onDownload}
          title="Download as PNG image"
          className={cn(buttonVariants({ size: "sm" }), "text-xs gap-1")}
        >
          ⬇ Export PNG
        </button>
      </div>
    </header>
  );
}
