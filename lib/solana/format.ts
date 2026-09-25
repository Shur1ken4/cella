import type { Lamports } from "@solana/kit";

const LAMPORTS_PER_SOL = 1_000_000_000n;

export function lamportsToSolString(amount: Lamports, maxDecimals = 2): string {
  const whole = amount / LAMPORTS_PER_SOL;
  const fractional = (amount % LAMPORTS_PER_SOL)
    .toString()
    .padStart(9, "0")
    .slice(0, maxDecimals)
    .replace(/0+$/, "");
  return fractional ? `${whole}.${fractional}` : whole.toString();
}
