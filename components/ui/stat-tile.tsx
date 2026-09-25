import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedNumber } from "@/components/motion/animated-number";

type StatTileProps = {
  label: string;
  value: React.ReactNode;
  unit?: string;
  icon?: LucideIcon;
  hint?: React.ReactNode;
  /** green = verified/confirmed, cyan = data (default) */
  accent?: "cyan" | "green" | "none";
  loading?: boolean;
  /** Numbers only: 490000 → "490K". */
  compact?: boolean;
  className?: string;
};

const accentIcon = {
  cyan: "bg-cyan-tint text-cyan",
  green: "bg-green-tint text-green",
  none: "bg-surface-2 text-text-muted",
} as const;

export function StatTile({
  label,
  value,
  unit,
  icon: Icon,
  hint,
  accent = "cyan",
  loading = false,
  compact = false,
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "surface-card flex flex-col gap-3 rounded-lg border border-border p-4 shadow-card",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && (
          <span
            className={cn(
              "grid size-7 place-items-center rounded-sm",
              accentIcon[accent]
            )}
            aria-hidden="true"
          >
            <Icon className="size-4" />
          </span>
        )}
        <span className="type-label text-text-faint">{label}</span>
      </div>

      {loading ? (
        <Skeleton className="h-9 w-32" />
      ) : (
        <p className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
          <span className="nums text-3xl font-medium break-all text-text">
            {typeof value === "number" ? <AnimatedNumber value={value} compact={compact} /> : value}
          </span>
          {unit && (
            <span className="nums text-sm text-text-muted">{unit}</span>
          )}
        </p>
      )}

      {hint && <div className="type-caption text-text-muted">{hint}</div>}
    </div>
  );
}
