import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { HexFrame } from "@/components/ui/hex-frame";
import { InstitutionIcon } from "@/components/bap/institution-icon";
import { PassportCard } from "@/components/bap/passport-card";
import { clickAmount, kf, seg } from "../anim";
import { Cursor, Highlight, MiniWindow } from "../kit";
import type { SceneProps } from "../types";
import { Box, toStage } from "./mini";

const CARD = { x: 32, y: 96, w: 230, h: 180 };

/** Tutorial 1 · Open the passport from the dashboard. */
export function TutorialOpen({ progress: p }: SceneProps) {
  const l = copy.explainer.labels;
  const target = toStage(CARD.x + CARD.w / 2, CARD.y + CARD.h / 2);
  const cx = kf(p, [[0, 820], [0.35, target.x], [1, target.x]]);
  const cy = kf(p, [[0, 480], [0.35, target.y], [1, target.y]]);
  const out = seg(p, 0.48, 0.6);
  const into = seg(p, 0.55, 0.7);
  const rows = copy.explainer.labels.rows;

  return (
    <>
      <MiniWindow title={p < 0.5 ? "localhost:3000/app" : "localhost:3000/asset/BAP-001"}>
        {/* dashboard */}
        <div className="absolute inset-0" style={{ opacity: 1 - out, transform: `translateX(${-40 * out}px)` }}>
          <p className="type-h3 absolute top-6 left-8 text-text">{l.dashboard}</p>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              x={CARD.x + i * 252}
              y={CARD.y}
              w={CARD.w}
              h={CARD.h}
              className={cn(
                "flex flex-col gap-3 rounded-lg border p-4",
                i === 0 ? "border-border bg-surface-1 shadow-card" : "border-dashed border-border-strong bg-bg"
              )}
            >
              <div className="flex items-center gap-2">
                <HexFrame className={cn("size-9", i === 0 ? "text-green" : "text-border-strong")} fillClassName={i === 0 ? "fill-green-tint" : "fill-bg"}>
                  {i === 0 ? <InstitutionIcon kind="owner" className="size-4" /> : <Lock className="size-3.5 text-text-faint" />}
                </HexFrame>
                <div>
                  <p className="text-sm font-semibold text-text">{i === 0 ? copy.asset.name : copy.dashboard.placeholders[i - 1].name}</p>
                  {i === 0 && <p className="nums text-xs text-cyan">{copy.asset.code}</p>}
                </div>
              </div>
              <div className="flex gap-1">
                {copy.stages.map((s, j) => (
                  <span key={s} className={cn("h-1.5 flex-1 rounded-full", i === 0 && j <= 3 ? (j === 3 ? "bg-green-fill" : "bg-green-deep") : "bg-surface-3")} />
                ))}
              </div>
              <span className="type-caption mt-auto text-text-muted">{i === 0 ? `${copy.stages[3]} · ${copy.asset.area}` : copy.dashboard.comingSoon}</span>
            </Box>
          ))}
        </div>

        {/* passport page */}
        <div className="absolute inset-0" style={{ opacity: into, transform: `translateX(${40 * (1 - into)}px)` }}>
          <div className="absolute top-6 left-8 w-[340px]">
            <PassportCard
              name={copy.asset.name}
              code={copy.asset.code}
              stage={copy.stages[3]}
              owner={copy.institutions.owner.name}
              modality={copy.asset.modality}
              area={copy.asset.area}
              attestationCount={2}
              animate={false}
            />
          </div>
          {rows.map((row, i) => {
            const a = seg(p, 0.68 + i * 0.07, 0.8 + i * 0.07);
            const signed = i === 0;
            return (
              <Box key={row} x={400} y={40 + i * 62} w={370} h={50} className="flex items-center gap-3 rounded-md border border-border bg-surface-1 px-4 shadow-card" style={{ opacity: a, transform: `translateX(${(1 - a) * 20}px)` }}>
                <span className={cn("grid size-6 place-items-center rounded-full", signed ? "bg-green-fill text-on-green" : "border border-dashed border-border-strong")}>
                  {signed && <Check className="size-4" strokeWidth={3} />}
                </span>
                <span className="text-sm font-medium text-text">{row}</span>
                <span className={cn("type-caption ml-auto", signed ? "text-green" : "text-text-faint")}>
                  {signed ? copy.timeline.attested : copy.timeline.pending}
                </span>
              </Box>
            );
          })}
        </div>
      </MiniWindow>

      <Highlight {...toStage(CARD.x, CARD.y)} w={CARD.w} h={CARD.h} amount={seg(p, 0.2, 0.3) - seg(p, 0.45, 0.5)} />
      <Cursor x={cx} y={cy} click={clickAmount(p, 0.38, 0.12)} />
    </>
  );
}
