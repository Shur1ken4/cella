import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy, type InstitutionKind } from "@/lib/copy";
import { AttestationSeal } from "@/components/bap/attestation-seal";
import { institutionIcons } from "@/components/bap/institution-icon";
import { easeBack, easeInOut, lerp, seg } from "../anim";
import { At, Node } from "../kit";
import type { SceneProps } from "../types";

const SIGNERS: { kind: InstitutionKind; x: number }[] = [
  { kind: "university", x: 220 },
  { kind: "lab", x: 480 },
  { kind: "pharma", x: 740 },
];
const ROW_Y = (i: number) => 322 + i * 62;

/** 4 · The right people confirm each fact: seals travel into the passport rows. */
export function SceneConfirm({ progress: p }: SceneProps) {
  const l = copy.explainer.labels;
  const panel = seg(p, 0.05, 0.2);

  return (
    <>
      {SIGNERS.map((s, i) => {
        const a = seg(p, i * 0.06, 0.15 + i * 0.06, easeBack);
        return (
          <At key={s.kind} x={s.x} y={95} style={{ opacity: Math.min(a, 1), transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * a})` }}>
            <Node icon={institutionIcons[s.kind]} label={copy.institutions[s.kind].name} tone="green" size={60} />
          </At>
        );
      })}

      {/* the passport's claims list */}
      <div
        className="absolute rounded-xl border border-green-deep/60 bg-surface-1 p-5 shadow-pop"
        style={{ left: 250, top: 245, width: 460, height: 265, opacity: panel, transform: `translateY(${(1 - panel) * 20}px)` }}
      >
        <p className="type-label text-text-faint">
          {copy.passport.title} · {copy.asset.code}
        </p>
      </div>
      {l.rows.map((row, i) => {
        const done = seg(p, 0.38 + i * 0.2, 0.44 + i * 0.2) > 0.5;
        return (
          <div
            key={row}
            className={cn(
              "absolute flex items-center gap-3 rounded-md border px-4 transition-none",
              done ? "border-green-deep bg-green-tint" : "border-border bg-surface-2"
            )}
            style={{ left: 330, top: ROW_Y(i) - 22, width: 360, height: 44, opacity: panel }}
          >
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full",
                done ? "bg-green-fill text-on-green" : "border border-dashed border-border-strong"
              )}
            >
              {done && <Check className="size-4" strokeWidth={3} />}
            </span>
            <span className={cn("font-medium", done ? "text-text" : "text-text-muted")}>{row}</span>
          </div>
        );
      })}

      {/* seals fly from each institution into its row */}
      {SIGNERS.map((s, i) => {
        const t = seg(p, 0.2 + i * 0.2, 0.42 + i * 0.2, easeInOut);
        const visible = p > 0.2 + i * 0.2;
        const land = seg(p, 0.42 + i * 0.2, 0.5 + i * 0.2);
        return visible ? (
          <At
            key={s.kind}
            x={lerp(s.x, 300, t)}
            y={lerp(140, ROW_Y(i), t)}
            style={{ transform: `translate(-50%,-50%) scale(${lerp(1, 0.55, t) * (1 + 0.15 * Math.sin(land * Math.PI))})` }}
          >
            <AttestationSeal kind={s.kind} institution={copy.institutions[s.kind].name} size="sm" animate={false} />
          </At>
        ) : null;
      })}
    </>
  );
}
