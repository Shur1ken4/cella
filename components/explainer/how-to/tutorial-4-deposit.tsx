import { copy } from "@/lib/copy";
import { formatAmount } from "@/lib/format";
import { clickAmount, kf, seg } from "../anim";
import { Cursor, Highlight, MiniWindow, Ring } from "../kit";
import type { SceneProps } from "../types";
import { Box, MiniButton, MiniFlow, MiniToast, toStage } from "./mini";

const INPUT = { x: 32, y: 96, w: 300, h: 46 };
const BTN = { x: 350, y: 96, w: 140, h: 46 };
const TYPED = "10,000";

/** Tutorial 4 · Type an amount, deposit, watch coins move into the vault. */
export function TutorialDeposit({ progress: p }: SceneProps) {
  const l = copy.explainer.labels;
  const t = copy.vaultPage.investor;
  const inp = toStage(INPUT.x + 120, INPUT.y + INPUT.h / 2);
  const btn = toStage(BTN.x + BTN.w / 2, BTN.y + BTN.h / 2);
  const cx = kf(p, [[0, 820], [0.15, inp.x], [0.38, inp.x], [0.46, btn.x], [1, btn.x]]);
  const cy = kf(p, [[0, 500], [0.15, inp.y], [0.38, inp.y], [0.46, btn.y], [1, btn.y]]);
  const typed = TYPED.slice(0, Math.round(seg(p, 0.2, 0.38, (x) => x) * TYPED.length));
  const flow = seg(p, 0.52, 0.86, (x) => x);
  const raised = 490_000 + 10_000 * seg(p, 0.6, 0.86);

  return (
    <>
      <MiniWindow title="localhost:3000/vault/BAP-001">
        <p className="type-label absolute top-7 left-8 text-text-faint">{t.amount}</p>
        <Box {...INPUT} className="flex items-center rounded-sm border border-border-strong bg-surface-2 px-3" style={{ borderColor: p > 0.17 && p < 0.5 ? "var(--cyan)" : undefined }}>
          <span className="nums text-lg text-text">{typed}</span>
          {p > 0.17 && p < 0.45 && <span className="ml-0.5 h-5 w-px animate-pulse bg-text" />}
          <span className="type-label ml-auto text-cyan">{t.max}</span>
        </Box>
        <Box {...BTN}>
          <MiniButton label={l.depositBtn} pressed={clickAmount(p, 0.47, 0.05) > 0 && clickAmount(p, 0.47, 0.05) < 1} loading={p > 0.48 && p < 0.55} />
        </Box>
        <Box x={560} y={24} w={200} h={200} className="grid place-items-center">
          <Ring value={raised / 500_000} size={190} label={formatAmount(Math.round(raised))} sub={l.ofTarget} />
        </Box>
        <Box x={32} y={250} w={736} h={130}>
          <MiniFlow progress={flow} direction="in" you={copy.vaultPage.flowYou} vault={l.vault} />
        </Box>
        <MiniToast text={copy.txLabels.deposit.confirmed} amount={seg(p, 0.86, 0.94)} />
      </MiniWindow>

      <Highlight {...toStage(INPUT.x, INPUT.y)} w={INPUT.w} h={INPUT.h} amount={seg(p, 0.08, 0.14) - seg(p, 0.38, 0.42)} radius={8} />
      <Highlight {...toStage(BTN.x, BTN.y)} w={BTN.w} h={BTN.h} amount={seg(p, 0.4, 0.45) - seg(p, 0.52, 0.56)} />
      <Cursor x={cx} y={cy} click={Math.max(clickAmount(p, 0.16, 0.1), clickAmount(p, 0.47, 0.1))} />
    </>
  );
}
