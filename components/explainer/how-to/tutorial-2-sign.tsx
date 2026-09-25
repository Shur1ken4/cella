import { Check, FlaskConical, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { ASSET_SCHEMAS } from "@/lib/data/schemas";
import { AttestationSeal } from "@/components/bap/attestation-seal";
import { InstitutionIcon } from "@/components/bap/institution-icon";
import { clickAmount, easeBack, kf, seg } from "../anim";
import { Cursor, Highlight, MiniWindow } from "../kit";
import type { SceneProps } from "../types";
import { Box, MiniButton, toStage } from "./mini";

const ROW = (i: number) => ({ x: 32, y: 96 + i * 50, w: 400, h: 42 });
const BTN = { x: 32, y: 360, w: 200, h: 40 };

/** Tutorial 2 · Sign “Phase I complete” as the lab. */
export function TutorialSign({ progress: p }: SceneProps) {
  const l = copy.explainer.labels;
  const row = toStage(ROW(3).x + 200, ROW(3).y + 21);
  const btn = toStage(BTN.x + BTN.w / 2, BTN.y + BTN.h / 2);
  const cx = kf(p, [[0, 840], [0.28, row.x], [0.36, row.x], [0.52, btn.x], [1, btn.x]]);
  const cy = kf(p, [[0, 500], [0.28, row.y], [0.36, row.y], [0.52, btn.y], [1, btn.y]]);
  const selected = p > 0.31;
  const signing = p > 0.55 && p < 0.64;
  const signed = p >= 0.64;
  const seal = seg(p, 0.64, 0.78, easeBack);

  return (
    <>
      <MiniWindow title="localhost:3000/sign">
        <Box x={32} y={20} w={736} h={50} className="flex items-center gap-2 rounded-md border border-warning/40 bg-warning-tint px-4">
          <FlaskConical className="size-4 text-warning" />
          <span className="type-label text-warning">{copy.demo.banner(copy.institutions.lab.name)}</span>
        </Box>

        {ASSET_SCHEMAS.map((s, i) => {
          const r = ROW(i);
          const done = i < 3 || (i === 3 && signed);
          const locked = i === 4;
          const active = i === 3 && selected && !signed;
          return (
            <Box
              key={s}
              {...r}
              className={cn(
                "flex items-center gap-3 rounded-md border px-3",
                active ? "border-green-deep bg-green-tint" : locked ? "border-border bg-bg" : "border-border-strong bg-surface-2"
              )}
            >
              <span className={cn("grid size-7 place-items-center rounded-sm", done ? "bg-green-tint text-green" : "bg-surface-3 text-text-faint")}>
                {done ? <Check className="size-4" /> : locked ? <Lock className="size-3.5" /> : <InstitutionIcon kind="lab" className="size-4 text-text" />}
              </span>
              <span className={cn("text-sm font-medium", locked ? "text-text-muted" : "text-text")}>{copy.schemas[s]}</span>
              {active && <span className="ml-auto size-2.5 rounded-full bg-green-fill shadow-glow" />}
            </Box>
          );
        })}

        <Box {...BTN}>
          <MiniButton label={signing ? "…" : l.signBtn} pressed={clickAmount(p, 0.54, 0.05) > 0 && clickAmount(p, 0.54, 0.05) < 1} loading={signing} className={cn(!selected && "opacity-45")} />
        </Box>

        <Box x={480} y={96} w={288} h={304} className={cn("flex flex-col items-center justify-center gap-4 rounded-lg border", signed ? "border-green-deep bg-surface-1 shadow-glow" : "border-border-strong bg-surface-2")}>
          <div className="relative grid place-items-center">
            {signed &&
              [0, 1, 2].map((i) => {
                const r = seg(p, 0.66 + i * 0.05, 0.9 + i * 0.05);
                return (
                  <span key={i} className="absolute size-28 rounded-full border-2 border-green-fill" style={{ transform: `scale(${0.7 + 1.4 * r})`, opacity: 0.7 * (1 - r) }} />
                );
              })}
            <div style={{ transform: signed ? `scale(${0.5 + 0.5 * seal}) rotate(${(1 - seal) * -30}deg)` : undefined }}>
              <AttestationSeal kind="lab" institution={copy.institutions.lab.name} status={signed ? "attested" : "pending"} size="md" animate={false} />
            </div>
          </div>
          <p className="font-heading text-base font-semibold text-text">{signed ? copy.sign.successTitle : l.phase1}</p>
        </Box>
      </MiniWindow>

      <Highlight {...toStage(ROW(3).x, ROW(3).y)} w={ROW(3).w} h={ROW(3).h} amount={seg(p, 0.18, 0.26) - seg(p, 0.36, 0.42)} />
      <Highlight {...toStage(BTN.x, BTN.y)} w={BTN.w} h={BTN.h} amount={seg(p, 0.44, 0.5) - seg(p, 0.58, 0.62)} />
      <Cursor x={cx} y={cy} click={Math.max(clickAmount(p, 0.3, 0.1), clickAmount(p, 0.54, 0.1))} />
    </>
  );
}
