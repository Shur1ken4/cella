import { Lock, Pill, Wallet, X } from "lucide-react";
import { copy } from "@/lib/copy";
import { easeBack, kf, lerp, seg } from "../anim";
import { At, Coin, Node } from "../kit";
import type { SceneProps } from "../types";

/** 2 · So investors can't trust it. */
export function SceneNoTrust({ progress: p }: SceneProps) {
  const l = copy.explainer.labels;
  const left = seg(p, 0, 0.15, easeBack);
  const right = seg(p, 0.08, 0.23, easeBack);
  const line = seg(p, 0.2, 0.5);
  const x = seg(p, 0.55, 0.68, easeBack);
  // a coin tries to cross, hits the X and bounces back
  const coinX = kf(p, [[0.3, 250], [0.55, 470], [0.75, 330]]);
  const coinOpacity = kf(p, [[0.28, 0], [0.33, 1], [0.7, 1], [0.8, 0]]);

  return (
    <>
      <At x={200} y={270} style={{ opacity: left, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * left})` }}>
        <Node icon={Wallet} label={l.investor} tone="cyan" size={96} />
      </At>
      <At x={760} y={270} style={{ opacity: right, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * right})` }}>
        <Node
          icon={Pill}
          label={l.drug}
          tone="muted"
          size={96}
          badge={
            <span className="grid size-9 place-items-center rounded-full border-2 border-bg-deep bg-warning text-bg-deep">
              <Lock className="size-4" />
            </span>
          }
        />
      </At>

      <svg className="absolute inset-0" width={960} height={540} aria-hidden="true">
        <line
          x1={265}
          y1={250}
          x2={lerp(265, 695, line)}
          y2={250}
          strokeDasharray="8 8"
          strokeWidth={2}
          className="stroke-border-strong"
        />
      </svg>

      <At x={coinX} y={250} style={{ opacity: coinOpacity }}>
        <Coin />
      </At>

      <At x={480} y={250} style={{ opacity: Math.min(x, 1), transform: `translate(-50%,-50%) scale(${x})` }}>
        <span className="grid size-20 place-items-center rounded-full border-4 border-danger bg-danger-tint text-danger shadow-pop">
          <X className="size-11" strokeWidth={3} />
        </span>
      </At>
    </>
  );
}
