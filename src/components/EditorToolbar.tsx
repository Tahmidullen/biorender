"use client";

import { useState, useRef } from "react";
import Link from "next/link";

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
    // Focus the input after React re-renders it
    setTimeout(() => titleInputRef.current?.select(), 0);
  }

  function finishEditingTitle() {
    setEditingTitle(false);
  }

  return (
    <header style={{
      height: "56px",
      minHeight: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px",
      background: "#ffffff",
      borderBottom: "1px solid #e5e7eb",
      gap: "12px",
    }}>

      {/* ── Left: logo + editable title ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{
            width: 28, height: 28, background: "#14b8a6", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "bold", color: "#fff", fontSize: 13,
          }}>B</div>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>BioRender</span>
        </Link>

        <span style={{ color: "#d1d5db" }}>|</span>

        {/* Clicking the title turns it into an input field */}
        {editingTitle ? (
          <input
            ref={titleInputRef}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={finishEditingTitle}
            onKeyDown={(e) => e.key === "Enter" && finishEditingTitle()}
            style={{
              fontSize: 13, fontWeight: 500, color: "#111827",
              border: "1px solid #14b8a6", borderRadius: 6,
              padding: "2px 8px", outline: "none", width: 180,
            }}
          />
        ) : (
          <span
            onClick={startEditingTitle}
            title="Click to rename"
            style={{
              fontSize: 13, color: "#374151", fontWeight: 500,
              cursor: "text", padding: "2px 4px", borderRadius: 4,
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
          >
            {title}
          </span>
        )}

        {/* Save status badge */}
        <span style={{
          fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 600,
          background: isSaved ? "#f0fdf4" : "#f3f4f6",
          color: isSaved ? "#16a34a" : "#9ca3af",
          border: `1px solid ${isSaved ? "#bbf7d0" : "#e5e7eb"}`,
        }}>
          {isSaving ? "Saving..." : isSaved ? "✓ Saved" : "Unsaved"}
        </span>
      </div>

      {/* ── Center: tools ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>

        <ToolBtn onClick={onAddText} title="Add text">
          𝐓 Text
        </ToolBtn>

        <Divider />

        {/* Fill colour swatches */}
        <div style={{
          display: "flex", alignItems: "center", gap: "5px",
          background: "#f9fafb", border: "1px solid #e5e7eb",
          borderRadius: 8, padding: "5px 10px",
        }}>
          <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginRight: 2 }}>Fill</span>
          {COLORS.map((c) => (
            <button
              key={c.hex}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onColorChange(c.hex)}
              title={c.label}
              style={{
                width: 16, height: 16, borderRadius: "50%",
                background: c.hex, border: "1.5px solid #d1d5db",
                cursor: "pointer", padding: 0, transition: "transform 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.3)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          ))}
        </div>

        <Divider />

        <ToolBtn onClick={onDelete} title="Delete selected" danger>
          🗑 Delete
        </ToolBtn>

        <ToolBtn onClick={onClear} title="Clear canvas">
          ✕ Clear
        </ToolBtn>
      </div>

      {/* ── Right: Save + Export ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {/* Save to Supabase */}
        <button
          onClick={onSave}
          disabled={isSaving}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: isSaved ? "#f0fdf4" : "#f9fafb",
            color: isSaved ? "#16a34a" : "#374151",
            border: `1px solid ${isSaved ? "#bbf7d0" : "#e5e7eb"}`,
            borderRadius: 8, padding: "6px 14px",
            fontWeight: 600, fontSize: 12, cursor: isSaving ? "default" : "pointer",
            transition: "all 0.15s", opacity: isSaving ? 0.6 : 1,
          }}
          onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.background = "#f3f4f6"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = isSaved ? "#f0fdf4" : "#f9fafb"; }}
        >
          {isSaving ? "⏳ Saving..." : isSaved ? "✓ Saved" : "💾 Save"}
        </button>

        {/* Export PNG */}
        <button
          onClick={onDownload}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#14b8a6", color: "#fff",
            border: "none", borderRadius: 8,
            padding: "7px 14px", fontWeight: 600, fontSize: 12,
            cursor: "pointer", transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0d9488")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#14b8a6")}
        >
          ⬇ Export PNG
        </button>
      </div>
    </header>
  );
}

function ToolBtn({ onClick, title, children, danger = false }: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "5px 10px", borderRadius: 8,
        border: danger ? "1px solid #fecaca" : "1px solid transparent",
        background: "transparent",
        color: danger ? "#ef4444" : "#374151",
        fontSize: 12, fontWeight: 500, cursor: "pointer",
        transition: "background 0.1s", whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = danger ? "#fef2f2" : "#f3f4f6")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 24, background: "#e5e7eb", margin: "0 2px" }} />;
}
