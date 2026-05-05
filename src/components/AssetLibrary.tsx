"use client";

import { useState } from "react";
import { ICONS, ICON_CATEGORIES, type IconAsset } from "@/lib/assets";

type Props = {
  onSelectIcon: (icon: IconAsset) => void;
};

const CATEGORY_ICONS: Record<string, string> = {
  "Cell Biology":  "🔵",
  "Microbiology":  "🦠",
  "Lab Equipment": "⚗️",
  "Molecules":     "🧬",
  "Processes":     "➡️",
};

export default function AssetLibrary({ onSelectIcon }: Props) {
  const [activeCategory, setActiveCategory] = useState("Cell Biology");
  const [search, setSearch] = useState("");

  const filteredIcons = ICONS.filter((icon) => {
    if (search.trim()) {
      return icon.name.toLowerCase().includes(search.toLowerCase());
    }
    return icon.category === activeCategory;
  });

  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      display: "flex",
      flexDirection: "column",
      background: "#ffffff",
      borderRight: "1px solid #e5e7eb",
      height: "100%",
      overflow: "hidden",
    }}>

      {/* ── Header ── */}
      <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid #f3f4f6" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
          Icon Library
        </p>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#9ca3af" }}>🔍</span>
          <input
            type="text"
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: 28,
              paddingRight: 10,
              paddingTop: 6,
              paddingBottom: 6,
              fontSize: 12,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#f9fafb",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* ── Category tabs (hidden when searching) ── */}
      {!search.trim() && (
        <div style={{ padding: "8px 8px 0" }}>
          {ICON_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
                textAlign: "left",
                padding: "7px 10px",
                borderRadius: 8,
                marginBottom: 2,
                border: "none",
                background: activeCategory === cat ? "#f0fdfa" : "transparent",
                color: activeCategory === cat ? "#0f766e" : "#6b7280",
                fontWeight: activeCategory === cat ? 600 : 500,
                fontSize: 12,
                cursor: "pointer",
                transition: "background 0.1s",
              }}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Icons grid ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px 0" }}>
        {search.trim() && (
          <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>
            {filteredIcons.length} result{filteredIcons.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
          </p>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 6,
        }}>
          {filteredIcons.map((icon) => (
            <IconButton key={icon.id} icon={icon} onSelect={onSelectIcon} />
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 32 }}>
            <p style={{ fontSize: 24, marginBottom: 4 }}>🔍</p>
            <p style={{ fontSize: 12, color: "#9ca3af" }}>No icons found</p>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: "10px 14px",
        borderTop: "1px solid #f3f4f6",
        background: "#f9fafb",
        marginTop: 8,
      }}>
        <p style={{ fontSize: 10, color: "#9ca3af", textAlign: "center" }}>
          Click any icon to add it to the canvas
        </p>
      </div>
    </aside>
  );
}

function IconButton({ icon, onSelect }: { icon: IconAsset; onSelect: (i: IconAsset) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onSelect(icon)}
      title={`Add ${icon.name}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        padding: 6,
        borderRadius: 10,
        border: hovered ? "1.5px solid #99f6e4" : "1.5px solid transparent",
        background: hovered ? "#f0fdfa" : "transparent",
        cursor: "pointer",
        aspectRatio: "1",
        transition: "all 0.1s",
        transform: hovered ? "scale(1.05)" : "scale(1)",
      }}
    >
      <span style={{ fontSize: 22, lineHeight: 1 }}>{icon.emoji}</span>
      <span style={{
        fontSize: 9,
        color: hovered ? "#0f766e" : "#9ca3af",
        textAlign: "center",
        lineHeight: 1.2,
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        width: "100%",
      }}>
        {icon.name}
      </span>
    </button>
  );
}
