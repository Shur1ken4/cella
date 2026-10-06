"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy as text } from "@/lib/copy";
import { useCopy } from "@/lib/hooks/use-copy";
import { ellipsify, getExplorerUrl } from "@/lib/solana/explorer";
import { SIMULATED } from "@/lib/data/source";

type AddressChipProps = {
  /** Base58 address or transaction signature. */
  value: string;
  /** Explorer path type. */
  kind?: "address" | "tx";
  label?: string;
  chars?: number;
  className?: string;
};

const iconButton =
  "grid size-7 place-items-center rounded-sm text-text-muted transition-colors duration-150 ease-brand hover:bg-surface-3 hover:text-text focus-ring";

export function AddressChip({
  value,
  kind = "address",
  label,
  chars = 4,
  className,
}: AddressChipProps) {
  const { copied, copy } = useCopy();
  const href = getExplorerUrl(`/${kind}/${value}`);

  return (
    <span
      className={cn(
        "inline-flex h-9 w-fit items-center gap-1 rounded-sm border border-border bg-surface-2 pr-1 pl-2.5",
        className
      )}
    >
      {label && (
        <span className="type-caption mr-1 text-text-faint">{label}</span>
      )}
      <span className="nums text-sm text-cyan" title={value}>
        {ellipsify(value, chars)}
      </span>
      <button
        type="button"
        onClick={() => copy(value)}
        className={iconButton}
        aria-label={copied ? text.chips.copied : text.chips.copyAddress}
      >
        {copied ? (
          <Check className="size-3.5 text-green" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
      </button>
      {/* Simulated addresses don't exist on devnet, so there is nothing to open. */}
      {!SIMULATED && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={iconButton}
          aria-label={text.chips.viewOnExplorer}
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      )}
      <span className="sr-only" role="status">
        {copied ? text.chips.copied : ""}
      </span>
    </span>
  );
}
