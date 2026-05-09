"use client";

import { useState } from "react";
import * as Lucide from "lucide-react";
import { Search } from "lucide-react";
import { ICONS, ICON_CATEGORIES, type IconAsset, type LucideName } from "@/lib/assets";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  onSelectIcon: (icon: IconAsset) => void;
};

const CATEGORY_ICONS: Record<string, LucideName> = {
  "Cell Biology":  "CircleDot",
  "Microbiology":  "Bug",
  "Lab Equipment": "FlaskConical",
  "Molecules":     "Dna",
  "Processes":     "ArrowRight",
};

function getLucide(name: LucideName) {
  const Icon = (Lucide as unknown as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>)[name];
  return Icon ?? Lucide.HelpCircle;
}

export default function AssetLibrary({ onSelectIcon }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("Cell Biology");
  const [search, setSearch] = useState("");

  const filteredIcons = ICONS.filter((icon) => {
    if (search.trim()) {
      return icon.name.toLowerCase().includes(search.toLowerCase());
    }
    return icon.category === activeCategory;
  });

  return (
    <aside className="flex h-full w-60 min-w-60 flex-col overflow-hidden border-r border-border bg-surface">
      {/* Header / search */}
      <div className="border-b border-border/70 px-3 pt-3 pb-2.5">
        <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Library
        </p>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search shapes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 bg-muted/40 pl-8 text-[12px]"
          />
        </div>
      </div>

      {/* Categories */}
      {!search.trim() && (
        <nav className="flex flex-col gap-0.5 px-2 pt-2 pb-1">
          {ICON_CATEGORIES.map((cat) => {
            const Icon = getLucide(CATEGORY_ICONS[cat]);
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
                <span>{cat}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Search count */}
      {search.trim() && (
        <div className="px-3 pt-2.5">
          <Badge variant="secondary" className="font-mono text-[10px]">
            {filteredIcons.length} match{filteredIcons.length !== 1 ? "es" : ""} for &ldquo;{search}&rdquo;
          </Badge>
        </div>
      )}

      {/* Grid */}
      <ScrollArea className="flex-1 px-2 pt-2.5">
        {filteredIcons.length > 0 ? (
          <div className="grid grid-cols-3 gap-1.5 pb-4">
            {filteredIcons.map((icon) => (
              <IconButton key={icon.id} icon={icon} onSelect={onSelectIcon} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="mb-1.5 h-5 w-5 text-muted-foreground/50" strokeWidth={1.4} />
            <p className="text-[12px] text-muted-foreground">No shapes found</p>
          </div>
        )}
      </ScrollArea>

      <div className="border-t border-border/70 bg-muted/30 px-3 py-2">
        <p className="text-center font-mono text-[10px] text-muted-foreground">
          click to add to canvas
        </p>
      </div>
    </aside>
  );
}

function IconButton({ icon, onSelect }: { icon: IconAsset; onSelect: (i: IconAsset) => void }) {
  const Icon = getLucide(icon.lucide);
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex w-full" />}>
        <button
          onClick={() => onSelect(icon)}
          className={cn(
            "group flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-transparent p-1.5",
            "cursor-pointer text-foreground/75 transition-all",
            "hover:border-border hover:bg-accent/40 hover:text-foreground",
          )}
        >
          <Icon className="h-[18px] w-[18px] transition-transform group-hover:scale-110" strokeWidth={1.6} />
          <span className="w-full truncate text-center text-[9px] font-medium leading-tight text-muted-foreground">
            {icon.name}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{icon.name}</TooltipContent>
    </Tooltip>
  );
}
