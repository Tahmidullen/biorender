import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { RegisterMarks } from "@/components/RegisterMarks";
import { FigureCopilotInteractiveDemo } from "@/components/FigureCopilotInteractiveDemo";

export function FigureCopilotSpotlight({ className }: { className?: string }) {
  return (
    <section
      id="figure-copilot"
      aria-labelledby="figure-copilot-heading"
      className={cn(
        "hairline-box bg-gradient-to-br from-primary/[0.08] via-background to-chart-4/[0.07]",
        "dark:from-primary/[0.12] dark:via-background dark:to-chart-4/[0.09]",
        className,
      )}
    >
      <div className="grid gap-8 p-6 sm:gap-10 sm:p-8 md:grid-cols-12 md:gap-10 md:p-10">
        <div className="md:col-span-5">
          <p className="meta-mono mb-3 text-[11px] text-primary">Copilot</p>
          <h2
            id="figure-copilot-heading"
            className="font-display text-[34px] font-semibold leading-[1.06] tracking-[-0.02em] text-foreground sm:text-[42px]"
          >
            Meet your
            <br />
            <span className="text-primary">Figure Copilot.</span>
          </h2>
          <div className="mt-6 max-w-[42ch] space-y-5 text-[15px] leading-snug">
            <div>
              <p className="font-medium text-foreground">Creator mode</p>
              <p className="mt-1.5 text-muted-foreground">
                Describe a pathway or rough layout in plain language. Copilot drops editable shapes on the canvas and you finish the figure by hand.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Consultant mode</p>
              <p className="mt-1.5 text-muted-foreground">
                Ask what feels messy or unclear before you share the figure. You get straight suggestions back, not a wall of jargon.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-sm px-5 text-[14px] gap-2",
              )}
            >
              Open the editor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative md:col-span-7">
          <RegisterMarks size={9} inset={8} />
          <div className="hairline-box overflow-hidden bg-surface shadow-sm">
            <FigureCopilotInteractiveDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
