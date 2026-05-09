"use client";

import { useState } from "react";
import { ICONS, ICON_CATEGORIES, type IconAsset } from "@/lib/assets";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    <aside className="w-56 min-w-56 flex flex-col bg-white border-r border-gray-200 h-full overflow-hidden">

      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-gray-100">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
          Icon Library
        </p>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">🔍</span>
          <Input
            type="text"
            placeholder="Search icons…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-8 text-xs bg-gray-50"
          />
        </div>
      </div>

      {/* Category buttons (hidden when searching) */}
      {!search.trim() && (
        <div className="px-2.5 pt-2 pb-1 flex flex-col gap-0.5">
          {ICON_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                "w-full flex items-center gap-2 text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                activeCategory === cat
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-gray-100 hover:text-gray-800",
              ].join(" ")}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search result count badge */}
      {search.trim() && (
        <div className="px-3 pt-2">
          <Badge variant="secondary" className="text-[10px]">
            {filteredIcons.length} result{filteredIcons.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
          </Badge>
        </div>
      )}

      {/* Icons grid */}
      <ScrollArea className="flex-1 px-2 pt-2">
        {filteredIcons.length > 0 ? (
          <div className="grid grid-cols-3 gap-1.5 pb-4">
            {filteredIcons.map((icon) => (
              <IconButton key={icon.id} icon={icon} onSelect={onSelectIcon} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="text-2xl mb-1">🔍</span>
            <p className="text-xs text-muted-foreground">No icons found</p>
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
        <p className="text-[10px] text-muted-foreground text-center">
          Click any icon to add it
        </p>
      </div>
    </aside>
  );
}

function IconButton({ icon, onSelect }: { icon: IconAsset; onSelect: (i: IconAsset) => void }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex w-full" />}>
        <button
          onClick={() => onSelect(icon)}
          className="flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl border border-transparent
            hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all hover:scale-105 aspect-square w-full"
        >
          <span className="text-xl leading-none">{icon.emoji}</span>
          <span className="text-[9px] text-muted-foreground text-center leading-tight w-full truncate">
            {icon.name}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{icon.name}</TooltipContent>
    </Tooltip>
  );
}
