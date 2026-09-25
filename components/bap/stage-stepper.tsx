"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";

type StageStepperProps = {
  /** Index of the current stage in `stages`. */
  current: number;
  stages?: readonly string[];
  className?: string;
};

export function StageStepper({
  current,
  stages = copy.stages,
  className,
}: StageStepperProps) {
  const currentRef = useRef<HTMLLIElement>(null);

  // On narrow screens, keep the current stage in view.
  useEffect(() => {
    const el = currentRef.current;
    const scroller = el?.parentElement;
    if (!el || !scroller || scroller.scrollWidth <= scroller.clientWidth) return;
    scroller.scrollTo({ left: el.offsetLeft - scroller.clientWidth / 2 + el.clientWidth / 2 });
  }, [current]);

  return (
    <ol
      aria-label={copy.stepper.label}
      className={cn(
        "relative flex snap-x overflow-x-auto pt-1 pb-2 [scrollbar-width:thin]",
        className
      )}
    >
      {stages.map((stage, i) => {
        const done = i < current;
        const isCurrent = i === current;
        const last = i === stages.length - 1;
        return (
          <li
            key={stage}
            ref={isCurrent ? currentRef : undefined}
            aria-current={isCurrent ? "step" : undefined}
            className="relative flex min-w-[92px] flex-1 snap-center flex-col items-center gap-2 px-1 text-center"
          >
            {!last && (
              <span aria-hidden="true" className="absolute top-4 left-1/2 h-0.5 w-full bg-border">
                {done && (
                  <motion.span
                    className="block h-full origin-left bg-green-deep"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.15 + i * 0.12, duration: 0.35 }}
                  />
                )}
              </span>
            )}

            <span className="relative z-10 grid size-8 place-items-center">
              {isCurrent && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-green-fill"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <span
                className={cn(
                  "relative grid size-8 place-items-center rounded-full border text-xs font-medium transition-colors duration-450",
                  done && "border-green-deep bg-green-tint text-green",
                  isCurrent && "border-green-deep bg-green-fill text-on-green shadow-glow",
                  !done && !isCurrent && "border-border-strong bg-bg text-text-faint"
                )}
              >
                {done ? (
                  <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
                ) : (
                  <span className="nums">{i + 1}</span>
                )}
              </span>
            </span>

            <span
              className={cn(
                "type-caption",
                isCurrent && "font-medium text-text",
                done && "text-text-muted",
                !done && !isCurrent && "text-text-faint"
              )}
            >
              {stage}
              <span className="sr-only">
                {` (${done ? copy.stepper.completed : isCurrent ? copy.stepper.current : copy.stepper.upcoming})`}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
