"use client";

import { Wind } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "@/components/MotionPreference";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** Small FAB — same intent as Affinity’s edge control, without blocking content. */
export function ReducedMotionToggle() {
  const pathname = usePathname();
  const { reducedMotion, userBoostActive, toggleUserBoost } = useMotionPreference();

  if (pathname.startsWith("/editor")) return null;

  const label =
    reducedMotion && !userBoostActive
      ? "Reduced motion (system). Tap to adjust site preference."
      : reducedMotion && userBoostActive
        ? "Reduced motion on. Tap to allow more motion."
        : "Reduce motion";

  return (
    <div className="pointer-events-none fixed bottom-6 right-4 z-[100] print:hidden sm:bottom-8 sm:right-6">
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={toggleUserBoost}
              className={cn(
                "pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/90 shadow-sm backdrop-blur-sm transition-colors sm:h-9 sm:w-9",
                "hover:bg-muted/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                (userBoostActive || reducedMotion) && "border-primary/40 bg-primary/10 text-primary",
              )}
              aria-pressed={userBoostActive}
              aria-label={label}
            />
          }
        >
          <Wind className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} aria-hidden />
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8} className="max-w-[220px]">
          <span className="font-medium">Reduce motion</span>
          <span className="mt-1 block text-[11px] font-normal leading-snug opacity-90">
            {reducedMotion && !userBoostActive
              ? "Your device prefers less motion. Decorative movement stays still."
              : reducedMotion
                ? "Animations and drifting backgrounds are minimized."
                : "Less movement on this site (figures show finished frames)."}
          </span>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
