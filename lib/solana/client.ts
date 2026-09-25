import { createEmptyClient } from "@solana/kit";
import { rpc, rpcAirdrop } from "@solana/kit-plugin-rpc";
import { RPC_URL, WS_URL } from "./network";

export function createSolanaClient() {
  return createEmptyClient()
    .use(rpc(RPC_URL, { url: WS_URL }))
    .use(rpcAirdrop());
}

export type SolanaClient = ReturnType<typeof createSolanaClient>;
