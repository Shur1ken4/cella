import { BadgeCheck, Landmark, Wallet, Zap } from "lucide-react";
import { copy } from "@/lib/copy";
import { CoinFlow } from "@/components/bap/coin-flow";
import { easeBack, kf, seg } from "../anim";
import { At, Node } from "../kit";
import type { SceneProps } from "../types";

const VAULT = { x: 700, y: 150 };
const INVESTORS = [580, 700, 820];

/** 6 · Milestone confirmed, everyone gets paid. */
export function ScenePaid({ progress: p }: SceneProps) {
  const l = copy.explainer.labels;
  const stamp = seg(p, 0.08, 0.22, easeBack);
  const bolt = kf(p, [[0.28, 0], [0.33, 1], [0.42, 1], [0.5, 0]]);
  const vaultFlash = kf(p, [[0.35, 0], [0.42, 1], [0.7, 0.3]]);

  return (
    <>
      {/* passport receiving the Phase I stamp */}
      <div
        data-theme="dark"
        className="absolute rounded-xl border border-green-deep/70 bg-surface-1 p-5 shadow-pop"
        style={{ left: 60, top: 150, width: 340, height: 220 }}
      >
        <p className="type-label text-text-faint">{copy.passport.title}</p>
        <p className="type-h3 mt-2 text-text">{copy.asset.name}</p>
        <p className="nums text-sm tracking-[0.2em] text-cyan">{copy.asset.code}</p>
      </div>
      <At
        x={240}
        y={320}
        style={{ opacity: Math.min(stamp, 1), transform: `translate(-50%,-50%) rotate(-10deg) scale(${2 - stamp})` }}
      >
        <span className="inline-flex items-center gap-2 rounded-sm border-2 border-green-fill bg-bg-deep/80 px-3 py-1.5 text-green shadow-glow">
          <BadgeCheck className="size-5" />
          <span className="type-label">{l.phase1}</span>
        </span>
      </At>

      {/* lightning from passport to vault */}
      <At x={560} y={200} style={{ opacity: bolt, transform: `translate(-50%,-50%) rotate(20deg) scale(${0.8 + 0.4 * bolt})` }}>
        <Zap className="size-24 fill-warning text-warning drop-shadow-[0_0_24px_var(--warning)]" />
      </At>

      <At x={VAULT.x} y={VAULT.y}>
        <div className="rounded-full" style={{ boxShadow: `0 0 ${60 * vaultFlash}px var(--green-glow)` }}>
          <Node icon={Landmark} label={l.vault} tone="green" size={80} />
        </div>
      </At>

      {INVESTORS.map((x, i) => (
        <CoinFlow
          key={x}
          from={{ x: (VAULT.x / 960) * 100, y: (VAULT.y / 540) * 100 }}
          to={{ x: (x / 960) * 100, y: (430 / 540) * 100 }}
          progress={seg(p, 0.45 + i * 0.05, 0.95, (t) => t)}
          count={4}
          arc={-4}
          className="absolute inset-0"
        />
      ))}
      {INVESTORS.map((x, i) => {
        const paid = seg(p, 0.8 + i * 0.04, 0.9 + i * 0.04, easeBack);
        return (
          <At key={x} x={x} y={445}>
            <div className="relative">
              <Node icon={Wallet} tone="cyan" size={56} />
              <span
                className="nums absolute -top-6 left-1/2 rounded-sm bg-green-fill px-2 py-0.5 text-xs font-bold whitespace-nowrap text-on-green"
                style={{ opacity: Math.min(paid, 1), transform: `translate(-50%, ${(1 - paid) * 10}px)` }}
              >
                {l.paid}
              </span>
            </div>
          </At>
        );
      })}
    </>
  );
}
