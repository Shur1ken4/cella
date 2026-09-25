"use client";

import { MotionConfig } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type PropsWithChildren } from "react";
import { WalletProvider } from "@/lib/solana/wallet/context";
import { SolanaClientProvider } from "@/lib/solana/client-context";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { transition } from "@/lib/motion";
import { RoleProvider } from "@/lib/role";

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 5_000, refetchOnWindowFocus: false } } })
  );

  return (
    <MotionConfig reducedMotion="user" transition={transition.base}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={200}>
          <SolanaClientProvider>
            <WalletProvider>
              <RoleProvider>{children}</RoleProvider>
            </WalletProvider>
          </SolanaClientProvider>
        </TooltipProvider>
        <Toaster />
      </QueryClientProvider>
    </MotionConfig>
  );
}
