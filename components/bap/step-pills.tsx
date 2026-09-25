"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** "1 Get test money → 2 Get verified → 3 Deposit → 4 Claim" progress pills. */
export function StepPills({
  steps,
  done,
  className,
}: {
  steps: readonly string[];
  done: boolean[];
  className?: string;
}) {
  const current = done.findIndex((d) => !d);
  return (
    <ol
      className={cn("flex flex-wrap items-center gap-x-1 gap-y-2", className)}
    >
      {steps.map((label, i) => {
        const isDone = done[i];
        const isCurrent = i === current;
        return (
          <li
            key={label}
            className="flex items-center gap-1"
            aria-current={isCurrent ? "step" : undefined}
          >
            <span
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-sm border px-2 text-xs font-medium whitespace-nowrap transition-colors duration-450",
                isDone && "border-green-deep/60 bg-green-tint text-green",
                isCurrent && "border-cyan/60 bg-cyan-tint text-cyan",
                !isDone && !isCurrent && "border-border bg-bg text-text-muted"
              )}
            >
              {isDone ? (
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Check className="size-3.5" aria-hidden="true" />
                </motion.span>
              ) : (
                <span className="nums">{i + 1}</span>
              )}
              {label}
            </span>
            {i < steps.length - 1 && (
              <span className="h-px w-3 bg-border-strong" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
