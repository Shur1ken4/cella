/** Shared, purely presentational building blocks for explainer scenes. */
import type { CSSProperties, ReactNode } from "react";
import { MousePointer2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { HexFrame } from "@/components/ui/hex-frame";
import { clamp } from "./anim";

/** Absolutely positioned element centred on (x, y) in stage pixels. */
export function At({
  x,
  y,
  children,
  style,
  className,
}: {
  x: number;
  y: number;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={cn("absolute", className)}
      // One inline transform (callers that pass their own include the centring translate).
      style={{ left: x, top: y, ...style, transform: style?.transform ?? "translate(-50%, -50%)" }}
    >
      {children}
    </div>
  );
}

/** Hexagon node with an icon and a label underneath. */
export function Node({
  icon: Icon,
  label,
  tone = "cyan",
  size = 72,
  badge,
}: {
  icon: LucideIcon;
  label?: string;
  tone?: "cyan" | "green" | "muted" | "danger";
  size?: number;
  badge?: ReactNode;
}) {
  const colour = {
    cyan: "text-cyan",
    green: "text-green",
    muted: "text-text-faint",
    danger: "text-danger",
  }[tone];
  const fill = { cyan: "fill-cyan-tint", green: "fill-green-tint", muted: "fill-surface-1", danger: "fill-danger-tint" }[tone];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <HexFrame className={colour} fillClassName={fill}>
          <span style={{ width: size, height: size }} className="grid place-items-center">
            <Icon style={{ width: size * 0.42, height: size * 0.42 }} />
          </span>
        </HexFrame>
        {badge && <span className="absolute -right-1 -bottom-1">{badge}</span>}
      </div>
      {label && <span className="font-heading text-base font-semibold whitespace-nowrap text-text">{label}</span>}
    </div>
  );
}

/** A floating document tile. */
export function DocTile({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border-strong bg-surface-2 px-3 py-2 shadow-pop">
      <Icon className="size-5 text-cyan" />
      <span className="text-sm font-medium whitespace-nowrap text-text">{label}</span>
    </div>
  );
}

export function Coin({ size = 28 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-full border-2 border-cyan bg-cyan-tint font-bold text-cyan shadow-glow-cyan"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      $
    </span>
  );
}

/** Fake browser window for tutorial scenes, rendered in the light app theme. */
export function MiniWindow({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div
      data-theme="light"
      className="absolute overflow-hidden rounded-lg border border-border-strong bg-bg-deep text-text shadow-pop"
      style={{ left: 80, top: 40, width: 800, height: 460 }}
    >
      <div className="flex h-9 items-center gap-2 border-b border-border bg-bg px-3">
        <span className="size-2.5 rounded-full bg-danger/60" />
        <span className="size-2.5 rounded-full bg-warning/60" />
        <span className="size-2.5 rounded-full bg-green/60" />
        <span className="nums ml-3 rounded-sm bg-surface-2 px-3 py-0.5 text-xs text-text-muted">{title}</span>
      </div>
      <div className="relative h-[calc(100%-36px)]">{children}</div>
    </div>
  );
}

/** Mouse cursor with a click ripple. `click` 0→1 animates the ripple. */
export function Cursor({ x, y, click = 0 }: { x: number; y: number; click?: number }) {
  const pressing = click > 0 && click < 0.35;
  return (
    <div className="pointer-events-none absolute z-50" style={{ left: x, top: y }}>
      {click > 0 && click < 1 && (
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-green-fill"
          style={{ width: 16 + click * 56, height: 16 + click * 56, opacity: 1 - click }}
        />
      )}
      <MousePointer2
        className="-translate-x-[3px] -translate-y-[2px] fill-text text-bg-deep drop-shadow-md"
        style={{ width: 26, height: 26, transform: `scale(${pressing ? 0.85 : 1})` }}
        strokeWidth={1.5}
      />
    </div>
  );
}

/** Pulsing highlight ring drawn around a target rectangle. */
export function Highlight({
  x,
  y,
  w,
  h,
  amount,
  radius = 12,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  amount: number;
  radius?: number;
}) {
  const a = clamp(amount);
  if (a <= 0) return null;
  return (
    <span
      className="pointer-events-none absolute z-40 border-2 border-cyan shadow-glow-cyan"
      style={{ left: x - 4, top: y - 4, width: w + 8, height: h + 8, borderRadius: radius, opacity: a }}
    />
  );
}

/** Progress ring driven directly by a 0–1 value. */
export function Ring({ value, size = 150, label, sub }: { value: number; size?: number; label?: string; sub?: string }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const done = value >= 0.999;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-surface-3" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamp(value))}
          className={done ? "stroke-green" : "stroke-cyan"}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label && <span className={cn("nums text-xl font-medium", done ? "text-green" : "text-text")}>{label}</span>}
        {sub && <span className="type-caption text-text-muted">{sub}</span>}
      </div>
    </div>
  );
}
