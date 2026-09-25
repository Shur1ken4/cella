import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** A numbered step in a vertical flow (sign console, create wizard). */
export function StepSection({
  n,
  title,
  aside,
  done = false,
  children,
  className,
}: {
  n: number;
  title: string;
  aside?: React.ReactNode;
  done?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("grid grid-cols-[32px_1fr] gap-x-4", className)} aria-labelledby={`step-${n}`}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-full border text-sm font-medium",
          done ? "border-green-deep bg-green-tint text-green" : "border-border-strong bg-bg text-text-muted"
        )}
        aria-hidden="true"
      >
        {done ? <Check className="size-4" strokeWidth={2.5} /> : <span className="nums">{n}</span>}
      </span>
      <div className="flex min-h-8 flex-wrap items-center gap-x-3">
        <h2 id={`step-${n}`} className="font-heading text-lg font-semibold text-text">
          {title}
        </h2>
        {aside}
      </div>
      <div className="col-start-2 mt-4">{children}</div>
    </section>
  );
}
