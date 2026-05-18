"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RegisterMarks } from "@/components/RegisterMarks";
import { FigureCopilotInteractiveDemo, type DemoMode } from "@/components/FigureCopilotInteractiveDemo";
import { VectorMascot } from "@/components/VectorMascot";

export function FigureCopilotSpotlight({ className }: { className?: string }) {
  const [demoMode, setDemoMode] = useState<DemoMode>("creator");

  return (
    <section
      id="vector"
      aria-labelledby="vector-heading"
      className={cn(
        "hairline-box bg-gradient-to-br from-primary/[0.08] via-background to-chart-4/[0.07]",
        "dark:from-primary/[0.12] dark:via-background dark:to-chart-4/[0.09]",
        className,
      )}
    >
      <div className="grid gap-8 p-6 sm:gap-10 sm:p-8 md:grid-cols-12 md:gap-10 md:p-10">
        <div className="md:col-span-5">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <VectorMascot assistantMode={demoMode} size={88} tone="default" interactive className="shrink-0" />
            <h2
              id="vector-heading"
              className="font-display text-center text-[34px] font-semibold leading-[1.06] tracking-[-0.02em] text-foreground sm:text-left sm:text-[42px]"
            >
              Meet
              <br />
              <span className="text-primary">Vector.</span>
            </h2>
          </div>
          <div className="mt-6 max-w-[42ch] space-y-5 text-[15px] leading-snug">
            <div>
              <p className="font-medium text-foreground">Creator mode</p>
              <p className="mt-1.5 text-muted-foreground">
                Describe a pathway or rough layout in plain language. Vector drops editable shapes on the canvas and you finish the figure by
                hand.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Consultant mode</p>
              <p className="mt-1.5 text-muted-foreground">
                Ask what feels messy or unclear before you share the figure. You get straight suggestions back, not a wall of jargon.
              </p>
            </div>
          </div>
        </div>

        <div className="relative md:col-span-7">
          <RegisterMarks size={9} inset={8} />
          <div className="hairline-box overflow-hidden bg-surface shadow-sm">
            <FigureCopilotInteractiveDemo onModeChange={setDemoMode} />
          </div>
        </div>
      </div>
    </section>
  );
}
