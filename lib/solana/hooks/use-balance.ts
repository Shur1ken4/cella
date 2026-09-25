"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type Address, type Lamports } from "@solana/kit";
import { useSolanaClient } from "../client-context";

export function useBalance(address?: Address) {
  const client = useSolanaClient();
  const queryClient = useQueryClient();
  const queryKey = ["balance", address] as const;

  const { data, isLoading, error } = useQuery({
    queryKey,
    enabled: !!address,
    queryFn: async () => {
      const { value } = await client.rpc.getBalance(address!).send();
      return value;
    },
    refetchInterval: 60_000,
  });

  useEffect(() => {
    if (!address) return;

    const abortController = new AbortController();

    const subscribe = async () => {
      try {
        const notifications = await client.rpcSubscriptions
          .accountNotifications(address, { commitment: "confirmed" })
          .subscribe({ abortSignal: abortController.signal });

        for await (const notification of notifications) {
          queryClient.setQueryData(
            ["balance", address],
            notification.value.lamports
          );
        }
      } catch {
        // polling and focus refetch remain as fallback
      }
    };

    void subscribe();

    return () => {
      abortController.abort();
    };
  }, [address, client, queryClient]);

  return {
    lamports: (data ?? null) as Lamports | null,
    isLoading,
    error,
  };
}
