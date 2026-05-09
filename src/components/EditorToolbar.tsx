"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Type as TypeIcon,
  Trash2,
  X,
  Save,
  Download,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";

const COLORS = [
  { hex: "#0f172a", label: "Ink"        },
  { hex: "#0d9488", label: "Teal"       },
  { hex: "#2563eb", label: "Blue"       },
  { hex: "#7c3aed", label: "Violet"     },
  { hex: "#db2777", label: "Magenta"    },
  { hex: "#ea580c", label: "Vermilion"  },
  { hex: "#ca8a04", label: "Ochre"      },
  { hex: "#16a34a", label: "Verdant"    },
  { hex: "#ffffff", label: "Paper"      },
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
    <header className="flex h-14 min-h-14 items-center justify-between gap-3 border-b border-border bg-surface px-4">
      {/* Left: logo + editable title + save status */}
      <div className="flex shrink-0 items-center gap-3">
        <Link href="/dashboard">
          <Logo size="sm" iconOnly />
        </Link>

        <Separator orientation="vertical" className="h-5" />

        {editingTitle ? (
          <input
            ref={titleInputRef}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={finishEditingTitle}
            onKeyDown={(e) => e.key === "Enter" && finishEditingTitle()}
            className="w-48 rounded-md border border-primary bg-background px-2 py-0.5 font-display text-[15px] text-foreground outline-none"
          />
        ) : (
          <Tooltip>
            <TooltipTrigger render={<span className="inline-flex" />}>
              <span
                onClick={startEditingTitle}
                className="cursor-text rounded border border-transparent px-1.5 py-0.5 font-display text-[15px] text-foreground transition-colors hover:border-border"
              >
                {title}
              </span>
            </TooltipTrigger>
            <TooltipContent>Click to rename</TooltipContent>
          </Tooltip>
        )}

        <SaveBadge isSaving={isSaving} isSaved={isSaved} />
      </div>

      {/* Centre: tools */}
      <div className="flex flex-1 items-center justify-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onAddText}
          title="Add a text label"
          className="gap-1.5 text-[12px]"
        >
          <TypeIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
          Text
        </Button>

        <Separator orientation="vertical" className="h-5" />

        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5">
          <span className="mr-1 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Fill
          </span>
          {COLORS.map((c) => (
            <Tooltip key={c.hex}>
              <TooltipTrigger render={<span className="inline-flex" />}>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onColorChange(c.hex)}
                  title={c.label}
                  aria-label={`Fill ${c.label}`}
                  className="h-4 w-4 shrink-0 cursor-pointer rounded-full border border-border transition-transform hover:scale-125"
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
          className="gap-1.5 text-[12px] text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
          Delete
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClear}
          title="Clear entire canvas"
          className="gap-1.5 text-[12px]"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.8} />
          Clear
        </Button>
      </div>

      {/* Right: Save + Export */}
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant={isSaved ? "outline" : "secondary"}
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          title="Save to your dashboard"
          className={cn(
            "gap-1.5 text-[12px]",
            isSaved && "border-primary/30 bg-accent/40 text-primary hover:bg-accent",
          )}
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.8} />
          ) : isSaved ? (
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
          ) : (
            <Save className="h-3.5 w-3.5" strokeWidth={1.8} />
          )}
          {isSaving ? "Saving" : isSaved ? "Saved" : "Save"}
        </Button>

        <button
          onClick={onDownload}
          title="Download as PNG image"
          className={cn(buttonVariants({ size: "sm" }), "gap-1.5 text-[12px]")}
        >
          <Download className="h-3.5 w-3.5" strokeWidth={1.8} />
          Export PNG
        </button>
      </div>
    </header>
  );
}

function SaveBadge({ isSaving, isSaved }: { isSaving: boolean; isSaved: boolean }) {
  if (isSaving) {
    return (
      <Badge variant="secondary" className="gap-1 font-mono text-[10px]">
        <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1.8} />
        saving
      </Badge>
    );
  }
  if (isSaved) {
    return (
      <Badge
        variant="secondary"
        className="gap-1 border-primary/20 bg-accent/60 font-mono text-[10px] text-primary"
      >
        <Check className="h-3 w-3" strokeWidth={2} />
        saved
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="font-mono text-[10px]">
      unsaved
    </Badge>
  );
}
