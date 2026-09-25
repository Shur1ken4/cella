import { CircleCheck, HandCoins } from "lucide-react";
import { copy } from "@/lib/copy";
import { formatAmount } from "@/lib/format";
import { clickAmount, kf, seg } from "../anim";
import { Cursor, Highlight, MiniWindow } from "../kit";
import type { SceneProps } from "../types";
import { Box, MiniButton, MiniFlow, MiniStat, MiniToast, toStage } from "./mini";

const BTN = { x: 32, y: 150, w: 360, h: 50 };

/** Tutorial 5 · Claim the payout; coins flow back, balance goes up. */
export function TutorialClaim({ progress: p }: SceneProps) {
  const l = copy.explainer.labels;
  const t = copy.vaultPage;
  const b = toStage(BTN.x + BTN.w / 2, BTN.y + BTN.h / 2);
  const cx = kf(p, [[0, 820], [0.25, b.x], [1, b.x]]);
  const cy = kf(p, [[0, 500], [0.25, b.y], [1, b.y]]);
  const flow = seg(p, 0.32, 0.72, (x) => x);
  const balance = 3_000 * seg(p, 0.4, 0.78);
  const claimed = p > 0.4;

  return (
    <>
      <MiniWindow title="localhost:3000/vault/BAP-001">
        <Box x={32} y={24} w={360} h={100} className="flex flex-col justify-center gap-1 rounded-lg border border-green-deep bg-surface-1 px-4 shadow-glow">
          <span className="type-label text-text-faint">{t.payout}</span>
          <span className="nums text-2xl text-text">150,000 tUSDC</span>
          <span className="inline-flex items-center gap-1 text-sm text-green">
            <CircleCheck className="size-4" /> {t.payoutStatus.unlocked}
          </span>
        </Box>
        <Box {...BTN}>
          <MiniButton
            label={
              <>
                <HandCoins className="size-4" /> {claimed ? l.claimBtn : `${l.claimBtn} · 3,000 tUSDC`}
              </>
            }
            pressed={clickAmount(p, 0.28, 0.05) > 0 && clickAmount(p, 0.28, 0.05) < 1}
            loading={p > 0.29 && p < 0.36}
            className={claimed && p > 0.4 ? "opacity-45" : undefined}
          />
        </Box>
        <Box x={420} y={24} w={348} h={176} className="grid grid-cols-2 gap-3">
          <MiniStat label={t.investor.walletBalance} value={formatAmount(Math.round(balance))} className={balance > 0 ? "border-green-deep" : undefined} />
          <MiniStat label={t.investor.claimed} value={formatAmount(Math.round(balance))} />
          <MiniStat label={t.investor.deposited} value="10,000" />
          <MiniStat label={t.investor.share} value="2.0%" />
        </Box>
        <Box x={32} y={230} w={736} h={140}>
          <MiniFlow progress={flow} direction="out" you={copy.vaultPage.flowYou} vault={l.vault} />
        </Box>
        <MiniToast text={l.claimed} amount={seg(p, 0.78, 0.86)} />
      </MiniWindow>

      <Highlight {...toStage(BTN.x, BTN.y)} w={BTN.w} h={BTN.h} amount={seg(p, 0.15, 0.22) - seg(p, 0.32, 0.38)} />
      <Cursor x={cx} y={cy} click={clickAmount(p, 0.27, 0.1)} />
    </>
  );
}
