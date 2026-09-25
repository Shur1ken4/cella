import { ArrowRight, Banknote, Coins, ShieldCheck } from "lucide-react";
import { copy } from "@/lib/copy";
import { LogoMark } from "@/components/site/logo";
import { easeBack, seg } from "../anim";
import { At, Node } from "../kit";
import type { SceneProps } from "../types";

const ICONS = [ShieldCheck, Coins, Banknote];
const XS = [230, 480, 730];

/** 7 · Verified. Funded. Paid. */
export function SceneTagline({ progress: p }: SceneProps) {
  const l = copy.explainer.labels;
  const lift = seg(p, 0.55, 0.75);
  const logo = seg(p, 0.6, 0.8, easeBack);

  return (
    <>
      {ICONS.map((Icon, i) => {
        const a = seg(p, 0.05 + i * 0.15, 0.2 + i * 0.15, easeBack);
        return (
          <At
            key={i}
            x={XS[i]}
            y={220 - 50 * lift}
            style={{ opacity: Math.min(a, 1), transform: `translate(-50%,-50%) scale(${(0.5 + 0.5 * a) * (1 - 0.2 * lift)})` }}
          >
            <Node icon={Icon} label={l.trio[i]} tone="green" size={110} />
          </At>
        );
      })}
      {[0, 1].map((i) => {
        const a = seg(p, 0.15 + i * 0.15, 0.25 + i * 0.15);
        return (
          <At key={i} x={(XS[i] + XS[i + 1]) / 2} y={205 - 50 * lift} style={{ opacity: a }}>
            <ArrowRight className="size-10 text-green" style={{ transform: `translateX(${(a - 1) * 20}px)` }} />
          </At>
        );
      })}

      <At x={480} y={420} style={{ opacity: Math.min(logo, 1), transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * logo})` }}>
        <div className="flex items-center gap-4">
          <LogoMark className="size-16" />
          <div>
            <p className="font-heading text-3xl font-bold text-text">
              Biotech Asset <span className="text-green">Passport</span>
            </p>
            <p className="type-label text-text-muted">
              {copy.site.tagline} · {l.onSolana}
            </p>
          </div>
        </div>
      </At>
    </>
  );
}
