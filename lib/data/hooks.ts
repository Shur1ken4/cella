"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { withTxToast } from "@/components/ui/tx-toast";
import { useWallet } from "@/lib/solana/wallet/context";
import { DATA_SOURCE, getDataSource } from "./index";
import { DEMO_WALLET } from "./seed";
import type { TxResult } from "./types";

const ds = () => getDataSource();

export const queryKeys = {
  assets: ["assets"] as const,
  asset: (id: string) => ["asset", id] as const,
  attestations: (passportId: string) => ["attestations", passportId] as const,
  vault: (id: string) => ["vault", id] as const,
  position: (vaultId: string, wallet: string) => ["position", vaultId, wallet] as const,
  investor: (wallet: string) => ["investor", wallet] as const,
};

export function useAssets() {
  return useQuery({ queryKey: queryKeys.assets, queryFn: () => ds().listAssets() });
}

export function useAsset(id: string) {
  return useQuery({ queryKey: queryKeys.asset(id), queryFn: () => ds().getAsset(id) });
}

export function useAttestations(passportId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.attestations(passportId ?? ""),
    queryFn: () => ds().getAttestations(passportId!),
    enabled: !!passportId,
  });
}

export function useVault(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.vault(id ?? ""),
    queryFn: () => ds().getVault(id!),
    enabled: !!id,
  });
}

export function usePosition(vaultId: string | undefined, wallet: string | undefined) {
  return useQuery({
    queryKey: queryKeys.position(vaultId ?? "", wallet ?? ""),
    queryFn: () => ds().getPosition(vaultId!, wallet!),
    enabled: !!vaultId && !!wallet,
  });
}

export function useInvestor(wallet: string | undefined) {
  return useQuery({
    queryKey: queryKeys.investor(wallet ?? ""),
    queryFn: () => ds().getInvestor(wallet!),
    enabled: !!wallet,
  });
}

/**
 * The investor identity for vault actions: the connected Phantom wallet, or —
 * in mock mode only — a demo wallet so the story works without a wallet.
 */
export function useInvestorWallet(): { wallet: string | undefined; isDemo: boolean } {
  const { wallet } = useWallet();
  const address = wallet?.account.address;
  if (address) return { wallet: address, isDemo: false };
  return DATA_SOURCE === "mock" ? { wallet: DEMO_WALLET, isDemo: true } : { wallet: undefined, isDemo: false };
}

type Labels = { pending: string; confirmed: string };

/**
 * Wraps a data-source write: shows the TxToast (pending → confirmed with an
 * Explorer link, or a friendly error) and refreshes every query afterwards.
 */
export function useTxAction<TArgs, TResult extends TxResult>(
  fn: (args: TArgs) => Promise<TResult>,
  labels: Labels
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: TArgs) => {
      let result: TResult | undefined;
      await withTxToast(
        async () => {
          result = await fn(args);
          return result.signature;
        },
        { ...labels, explorerUrl: () => result!.explorerUrl }
      );
      return result!;
    },
    onSettled: () => queryClient.invalidateQueries(),
  });
}

export { ds as dataSource };
