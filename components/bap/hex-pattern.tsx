import { useId } from "react";
import { cn } from "@/lib/utils";

const R = 12; // hexagon radius
const W = Math.sqrt(3) * R; // horizontal spacing
const H = 3 * R; // pattern height (two rows)

function hexPath(cx: number, cy: number) {
  const pts = [-90, -30, 30, 90, 150, 210].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return `${(cx + R * Math.cos(a)).toFixed(2)},${(cy + R * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join("L")}Z`;
}

// Pointy-top honeycomb: centres at the tile corners plus one offset in the middle.
const tilePath = [
  [0, 0],
  [W, 0],
  [W / 2, H / 2],
  [0, H],
  [W, H],
]
  .map(([x, y]) => hexPath(x, y))
  .join("");

/** Honeycomb background. Colour via `className` (text-*), opacity default 6%. */
export function HexPattern({ className }: { className?: string }) {
  const id = `hex-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full text-green opacity-[0.06]",
        className
      )}
    >
      <defs>
        <pattern
          id={id}
          width={W}
          height={H}
          patternUnits="userSpaceOnUse"
        >
          <path d={tilePath} fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
