/**
 * Network configuration. This app runs on Solana DEVNET ONLY (test money).
 * Any attempt to point it at another cluster throws at startup.
 */

export const CLUSTER = "devnet" as const;
export const WALLET_CHAIN = "solana:devnet" as const;

/** Genesis hash of Solana devnet — used for an optional runtime check. */
export const DEVNET_GENESIS_HASH = "EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG";

const DEFAULT_DEVNET_RPC = "https://api.devnet.solana.com";

export function assertDevnetUrl(url: string): string {
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    throw new Error(`Invalid RPC URL: "${url}"`);
  }
  if (!host.includes("devnet")) {
    throw new Error(
      `Refusing to start: RPC "${host}" is not a devnet endpoint. This demo runs on devnet only.`
    );
  }
  return url;
}

export const RPC_URL = assertDevnetUrl(
  process.env.NEXT_PUBLIC_RPC_URL || DEFAULT_DEVNET_RPC
);

export const WS_URL = RPC_URL.replace(/^http/, "ws");

/** Asks the RPC for its genesis hash and throws if it is not devnet. */
export async function verifyDevnetGenesis(
  getGenesisHash: () => Promise<string>
): Promise<void> {
  const hash = await getGenesisHash();
  if (hash !== DEVNET_GENESIS_HASH) {
    throw new Error(
      `Refusing to continue: connected cluster genesis ${hash} is not devnet.`
    );
  }
}
