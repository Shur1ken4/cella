import * as React from "react";
import { cn } from "@/lib/utils";

/** Hexagon outline with centred content — the product's recurring motif. */
export function HexFrame({
  className,
  children,
  strokeClassName = "stroke-current",
  fillClassName = "fill-surface-2",
}: {
  className?: string;
  children?: React.ReactNode;
  strokeClassName?: string;
  fillClassName?: string;
}) {
  return (
    <span className={cn("relative grid place-items-center", className)}>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <polygon
          points="50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5"
          className={cn(fillClassName, strokeClassName)}
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}
