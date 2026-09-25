/** Miniature versions of real app UI for the tutorial scenes (window-local coords). */
import type { CSSProperties, ReactNode } from "react";
import { Check, CircleCheck, Landmark, LoaderCircle, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { HexFrame } from "@/components/ui/hex-frame";
import { CoinFlow } from "@/components/bap/coin-flow";

/** Window content starts at stage (80, 76); convert window-local → stage coords. */
export const toStage = (x: number, y: number) => ({ x: x + 80, y: y + 76 });

export function Box({ x, y, w, h, className, style, children }: { x: number; y: number; w: number; h: number; className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div className={cn("absolute", className)} style={{ left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  );
}

export function MiniButton({
  label,
  variant = "primary",
  pressed = false,
  loading = false,
  className,
}: {
  label: ReactNode;
  variant?: "primary" | "secondary";
  pressed?: boolean;
  loading?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-full items-center justify-center gap-2 rounded-md border text-sm font-medium",
        variant === "primary" ? "border-green-deep bg-green-fill text-on-green" : "border-border-strong bg-surface-2 text-text",
        className
      )}
      style={{ transform: pressed ? "translateY(1px) scale(0.98)" : undefined, filter: pressed ? "brightness(0.95)" : undefined }}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" />}
      {label}
    </span>
  );
}

export function MiniToast({ text, amount }: { text: string; amount: number }) {
  if (amount <= 0) return null;
  return (
    <div
      className="absolute right-4 bottom-4 flex items-center gap-2 rounded-md border border-green-deep bg-surface-1 px-3 py-2 text-sm font-medium text-text shadow-pop"
      style={{ opacity: Math.min(amount, 1), transform: `translateY(${(1 - amount) * 16}px)` }}
    >
      <CircleCheck className="size-4 text-green" />
      {text}
    </div>
  );
}

export function MiniPills({ steps, done }: { steps: readonly string[]; done: number }) {
  return (
    <div className="flex gap-1.5">
      {steps.map((s, i) => (
        <span
          key={s}
          className={cn(
            "inline-flex h-7 items-center gap-1 rounded-sm border px-2 text-xs font-medium",
            i < done ? "border-green-deep/60 bg-green-tint text-green" : i === done ? "border-cyan/60 bg-cyan-tint text-cyan" : "border-border text-text-muted"
          )}
        >
          {i < done ? <Check className="size-3.5" /> : <span className="nums">{i + 1}</span>}
          {s}
        </span>
      ))}
    </div>
  );
}

export function MiniStat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("rounded-md border border-border bg-surface-1 p-3", className)}>
      <p className="type-caption text-text-faint">{label}</p>
      <p className="nums text-xl text-text">{value}</p>
    </div>
  );
}

/** You ⇄ Vault strip with a progress-driven coin flow. */
export function MiniFlow({ progress, direction, you, vault }: { progress: number; direction: "in" | "out"; you: string; vault: string }) {
  const YOU = { x: 10, y: 50 };
  const VAULT = { x: 90, y: 50 };
  return (
    <div className="relative size-full rounded-md border border-border bg-bg">
      <CoinFlow
        from={direction === "in" ? YOU : VAULT}
        to={direction === "in" ? VAULT : YOU}
        progress={progress}
        count={6}
        arc={30}
        className="absolute inset-0"
      />
      {[
        { at: YOU, Icon: Wallet, label: you },
        { at: VAULT, Icon: Landmark, label: vault },
      ].map(({ at, Icon, label }) => (
        <div key={label} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1" style={{ left: `${at.x}%`, top: `${at.y}%` }}>
          <HexFrame className="size-11 text-cyan" fillClassName="fill-cyan-tint">
            <Icon className="size-4" />
          </HexFrame>
          <span className="type-caption text-text-muted">{label}</span>
        </div>
      ))}
    </div>
  );
}
