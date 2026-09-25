import { CLUSTER } from "./network";

/** Solana Explorer link on devnet, e.g. getExplorerUrl(`/tx/${sig}`). */
export function getExplorerUrl(path: string): string {
  const url = new URL(path, "https://explorer.solana.com");
  url.searchParams.set("cluster", CLUSTER);
  return url.toString();
}

export function ellipsify(str: string, chars = 4): string {
  if (str.length <= chars * 2 + 3) return str;
  return `${str.slice(0, chars)}...${str.slice(-chars)}`;
}
