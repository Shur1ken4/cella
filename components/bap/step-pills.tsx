import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** "1 Get test money → 2 Get verified → 3 Deposit → 4 Claim" progress pills. */
export function StepPills({ steps, done, className }: { steps: readonly string[]; done: boolean[]; className?: string }) {
  const current = done.findIndex((d) => !d);
  return (
    <ol className={cn("flex flex-wrap items-center gap-x-1 gap-y-2", className)}>
      {steps.map((label, i) => {
        const isDone = done[i];
        const isCurrent = i === current;
        return (
          <li key={label} className="flex items-center gap-1" aria-current={isCurrent ? "step" : undefined}>
            <span
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-sm border px-2 text-xs font-medium whitespace-nowrap",
                isDone && "border-green-deep/60 bg-green-tint text-green",
                isCurrent && "border-cyan/60 bg-cyan-tint text-cyan",
                !isDone && !isCurrent && "border-border bg-bg text-text-muted"
              )}
            >
              {isDone ? <Check className="size-3.5" aria-hidden="true" /> : <span className="nums">{i + 1}</span>}
              {label}
            </span>
            {i < steps.length - 1 && <span className="h-px w-3 bg-border-strong" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
