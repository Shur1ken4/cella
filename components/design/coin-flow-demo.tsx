"use client";

import { useState } from "react";
import { Landmark, Pause, Play, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoinFlow } from "@/components/bap/coin-flow";
import { HexFrame } from "@/components/ui/hex-frame";
import { DemoLabel } from "./section";

function Anchor({ icon: Icon, label, className }: { icon: typeof Wallet; label: string; className: string }) {
  return (
    <div className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 ${className}`}>
      <HexFrame className="size-14 text-border-strong">
        <Icon className="size-5 text-cyan" aria-hidden="true" />
      </HexFrame>
      <span className="type-caption text-text-muted">{label}</span>
    </div>
  );
}

export function CoinFlowDemo() {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0.4);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <DemoLabel>Self-running loop — deposit (investor → vault)</DemoLabel>
        <div className="relative h-56 rounded-lg border border-border bg-bg">
          <CoinFlow from={{ x: 15, y: 60 }} to={{ x: 85, y: 60 }} playing={playing} className="absolute inset-0" />
          <Anchor icon={Wallet} label="Investor" className="top-[60%] left-[15%]" />
          <Anchor icon={Landmark} label="Vault" className="top-[60%] left-[85%]" />
        </div>
        <Button variant="secondary" size="sm" className="mt-3" onClick={() => setPlaying((p) => !p)}>
          {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {playing ? "Pause" : "Play"}
        </Button>
      </div>
      <div>
        <DemoLabel>Controlled by progress — claim (vault → investor)</DemoLabel>
        <div className="relative h-56 rounded-lg border border-border bg-bg">
          <CoinFlow from={{ x: 85, y: 60 }} to={{ x: 15, y: 60 }} progress={progress} arc={28} className="absolute inset-0" />
          <Anchor icon={Landmark} label="Vault" className="top-[60%] left-[85%]" />
          <Anchor icon={Wallet} label="Investor" className="top-[60%] left-[15%]" />
        </div>
        <label className="mt-3 flex items-center gap-3 text-sm text-text-muted">
          progress
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="flex-1 accent-cyan focus-ring"
          />
          <span className="nums w-10 text-right text-text">{progress.toFixed(2)}</span>
        </label>
      </div>
    </div>
  );
}
