"use client";

import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { copy } from "@/lib/copy";
import { getExplorerUrl, ellipsify } from "@/lib/solana/explorer";

type ToastId = string | number;

function ExplorerLink({ signature, href }: { signature: string; href?: string }) {
  return (
    <a
      href={href ?? getExplorerUrl(`/tx/${signature}`)}
      target="_blank"
      rel="noopener noreferrer"
      className="nums inline-flex items-center gap-1 text-xs text-cyan underline-offset-2 hover:underline focus-ring"
    >
      {copy.tx.viewOnExplorer} · {ellipsify(signature, 4)}
      <ExternalLink className="size-3" aria-hidden="true" />
    </a>
  );
}

/**
 * TxToast: every Solana transaction shows pending → confirmed (with an
 * Explorer devnet link) or failed. Thin wrapper around sonner.
 */
export const txToast = {
  pending(title: string = copy.tx.pending): ToastId {
    return toast.loading(title, { duration: Infinity });
  },

  confirmed(
    id: ToastId,
    opts: { signature: string; title?: string; explorerUrl?: string }
  ) {
    toast.success(opts.title ?? copy.tx.confirmed, {
      id,
      duration: 8000,
      description: (
        <ExplorerLink signature={opts.signature} href={opts.explorerUrl} />
      ),
    });
  },

  failed(id: ToastId, message: string, title: string = copy.tx.failed) {
    toast.error(title, { id, duration: 10000, description: message });
  },
};

/** Runs a transaction and drives the toast through its states. */
export async function withTxToast(
  run: () => Promise<string>,
  labels: { pending?: string; confirmed?: string; explorerUrl?: (sig: string) => string } = {}
): Promise<string> {
  const id = txToast.pending(labels.pending);
  try {
    const signature = await run();
    txToast.confirmed(id, {
      signature,
      title: labels.confirmed,
      explorerUrl: labels.explorerUrl?.(signature),
    });
    return signature;
  } catch (err) {
    txToast.failed(id, err instanceof Error ? err.message : String(err));
    throw err;
  }
}
