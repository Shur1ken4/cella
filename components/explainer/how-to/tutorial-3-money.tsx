import { BadgeCheck, Coins, UserCheck } from "lucide-react";
import { copy } from "@/lib/copy";
import { formatAmount } from "@/lib/format";
import { clickAmount, kf, seg } from "../anim";
import { Cursor, Highlight, MiniWindow } from "../kit";
import type { SceneProps } from "../types";
import { Box, MiniButton, MiniPills, MiniStat, MiniToast, toStage } from "./mini";

const FAUCET = { x: 32, y: 250, w: 280, h: 46 };
const KYC = { x: 332, y: 250, w: 280, h: 46 };

/** Tutorial 3 · Get test money, then get verified. */
export function TutorialMoney({ progress: p }: SceneProps) {
  const l = copy.explainer.labels;
  const t = copy.vaultPage.investor;
  const f = toStage(FAUCET.x + FAUCET.w / 2, FAUCET.y + FAUCET.h / 2);
  const k = toStage(KYC.x + KYC.w / 2, KYC.y + KYC.h / 2);
  const cx = kf(p, [[0, 820], [0.25, f.x], [0.4, f.x], [0.6, k.x], [1, k.x]]);
  const cy = kf(p, [[0, 500], [0.25, f.y], [0.4, f.y], [0.6, k.y], [1, k.y]]);
  const balance = seg(p, 0.32, 0.47) * 10_000;
  const verified = p > 0.68;

  return (
    <>
      <MiniWindow title="localhost:3000/vault/BAP-001">
        <p className="type-h3 absolute top-6 left-8 text-text">{t.title}</p>
        <Box x={32} y={70} w={736} h={30}>
          <MiniPills steps={t.steps} done={verified ? 2 : balance > 0 ? 1 : 0} />
        </Box>
        <Box x={32} y={124} w={736} h={90} className="grid grid-cols-3 gap-3">
          <MiniStat label={t.walletBalance} value={formatAmount(Math.round(balance))} className={balance > 0 ? "border-cyan/50" : undefined} />
          <MiniStat label={t.deposited} value="0" />
          <MiniStat label={t.share} value="0.0%" />
        </Box>
        <Box {...FAUCET}>
          <MiniButton variant="secondary" label={<><Coins className="size-4" /> {l.faucetBtn}</>} pressed={clickAmount(p, 0.28, 0.05) > 0 && clickAmount(p, 0.28, 0.05) < 1} />
        </Box>
        <Box {...KYC}>
          {verified ? (
            <span className="flex size-full items-center justify-center gap-2 rounded-md border border-green-deep/60 bg-green-tint text-sm font-medium text-green">
              <BadgeCheck className="size-4" /> {t.verified}
            </span>
          ) : (
            <MiniButton variant="secondary" label={<><UserCheck className="size-4" /> {l.kycBtn}</>} loading={p > 0.63} />
          )}
        </Box>
        <MiniToast text={copy.txLabels.faucet.confirmed} amount={seg(p, 0.45, 0.52) - seg(p, 0.62, 0.66)} />
        <MiniToast text={copy.txLabels.kyc.confirmed} amount={seg(p, 0.7, 0.78)} />
      </MiniWindow>

      <Highlight {...toStage(FAUCET.x, FAUCET.y)} w={FAUCET.w} h={FAUCET.h} amount={seg(p, 0.16, 0.24) - seg(p, 0.34, 0.4)} />
      <Highlight {...toStage(KYC.x, KYC.y)} w={KYC.w} h={KYC.h} amount={seg(p, 0.52, 0.58) - seg(p, 0.68, 0.72)} />
      <Cursor x={cx} y={cy} click={Math.max(clickAmount(p, 0.27, 0.1), clickAmount(p, 0.61, 0.1))} />
    </>
  );
}
