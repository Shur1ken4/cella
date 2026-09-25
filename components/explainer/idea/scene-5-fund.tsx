import { Landmark, Wallet } from "lucide-react";
import { copy } from "@/lib/copy";
import { formatAmount } from "@/lib/format";
import { CoinFlow } from "@/components/bap/coin-flow";
import { easeBack, seg } from "../anim";
import { At, Node, Ring } from "../kit";
import type { SceneProps } from "../types";

const INVESTORS = [240, 480, 720];
const VAULT = { x: 480, y: 150 };

/** 5 · Now investors can fund it: coins flow up into the vault, the meter fills. */
export function SceneFund({ progress: p }: SceneProps) {
  const l = copy.explainer.labels;
  const vault = seg(p, 0, 0.15, easeBack);
  const fill = seg(p, 0.25, 0.9);

  return (
    <>
      {INVESTORS.map((x, i) => (
        <CoinFlow
          key={x}
          from={{ x: (x / 960) * 100, y: (430 / 540) * 100 }}
          to={{ x: (VAULT.x / 960) * 100, y: (VAULT.y / 540) * 100 }}
          progress={seg(p, 0.15 + i * 0.08, 0.8 + i * 0.05, (t) => t)}
          count={5}
          arc={6}
          className="absolute inset-0"
        />
      ))}

      <At x={VAULT.x} y={VAULT.y} style={{ opacity: Math.min(vault, 1), transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * vault})` }}>
        <div className="relative grid place-items-center">
          <Ring value={fill} size={190} label={formatAmount(Math.round(fill * 500_000))} sub={`tUSDC · ${l.vault}`} />
          <span className="absolute -top-3 grid size-9 place-items-center rounded-full border border-cyan bg-bg-deep text-cyan">
            <Landmark className="size-4" />
          </span>
        </div>
      </At>

      {INVESTORS.map((x, i) => {
        const a = seg(p, 0.05 + i * 0.05, 0.2 + i * 0.05, easeBack);
        return (
          <At key={x} x={x} y={440} style={{ opacity: Math.min(a, 1), transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * a})` }}>
            <Node icon={Wallet} label={`${l.investor} ${i + 1}`} tone="cyan" size={60} />
          </At>
        );
      })}
    </>
  );
}
