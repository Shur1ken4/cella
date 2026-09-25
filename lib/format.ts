const amountFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const compactFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** 250000 → "250,000" */
export function formatAmount(n: number): string {
  return amountFormat.format(n);
}

/** 250000 → "250K" */
export function formatCompact(n: number): string {
  return compactFormat.format(n);
}

/** 0.5 → "50%" */
export function formatPercent(fraction: number, digits = 0): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}
