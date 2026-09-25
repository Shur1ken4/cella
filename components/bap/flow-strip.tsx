"use client";

import { Landmark, Wallet } from "lucide-react";
import { copy } from "@/lib/copy";
import { HexFrame } from "@/components/ui/hex-frame";
import { CoinFlow } from "./coin-flow";

export type FlowEvent = { id: number; direction: "in" | "out" };

const YOU = { x: 12, y: 50 };
const VAULT = { x: 88, y: 50 };

/** You ⇄ Vault strip that plays a CoinFlow on deposit (in) and claim (out). */
export function FlowStrip({ event }: { event: FlowEvent | null }) {
  return (
    <div className="relative h-28 rounded-md border border-border bg-bg">
      <CoinFlow
        key={event?.id ?? "idle"}
        from={event?.direction === "out" ? VAULT : YOU}
        to={event?.direction === "out" ? YOU : VAULT}
        count={event ? 6 : 0}
        loop={false}
        arc={30}
        className="absolute inset-0"
      />
      {[
        { at: YOU, icon: Wallet, label: copy.vaultPage.flowYou },
        { at: VAULT, icon: Landmark, label: copy.rightsMap.vault },
      ].map(({ at, icon: Icon, label }) => (
        <div
          key={label}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
          style={{ left: `${at.x}%`, top: `${at.y}%` }}
        >
          <HexFrame className="size-11 text-cyan" fillClassName="fill-cyan-tint">
            <Icon className="size-4" aria-hidden="true" />
          </HexFrame>
          <span className="type-caption text-text-muted">{label}</span>
        </div>
      ))}
    </div>
  );
}
