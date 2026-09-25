"use client";

import { useState, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Instruction } from "@solana/kit";
import { createClient } from "@solana/kit-client-rpc";
import { useWallet } from "../wallet/context";
import { RPC_URL, WS_URL } from "../network";

export function useSendTransaction() {
  const { signer } = useWallet();
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = useState(false);

  const txClient = useMemo(
    () =>
      signer
        ? createClient({
            url: RPC_URL,
            rpcSubscriptionsConfig: { url: WS_URL },
            payer: signer,
          })
        : null,
    [signer]
  );

  const send = useCallback(
    async ({ instructions }: { instructions: readonly Instruction[] }) => {
      if (!txClient) throw new Error("Wallet not connected");

      setIsSending(true);
      try {
        const result = await txClient.sendTransaction([...instructions]);
        await queryClient.invalidateQueries({ queryKey: ["balance"] });
        return result.context.signature;
      } finally {
        setIsSending(false);
      }
    },
    [txClient, queryClient]
  );

  return { send, isSending };
}
