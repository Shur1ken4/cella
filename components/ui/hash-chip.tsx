"use client";

import { Check, CircleX, Copy, Fingerprint, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy as text } from "@/lib/copy";
import { useCopy } from "@/lib/hooks/use-copy";

export type HashStatus = "idle" | "match" | "mismatch";

type HashChipProps = {
  /** SHA-256 as 64-char hex. */
  hash: string;
  status?: HashStatus;
  /** If provided, a "verify" button is shown. */
  onVerify?: () => void;
  className?: string;
};

function shortHash(hash: string) {
  return hash.length > 16 ? `${hash.slice(0, 6)}…${hash.slice(-6)}` : hash;
}

const iconButton =
  "grid size-7 place-items-center rounded-sm text-text-muted transition-colors duration-150 ease-brand hover:bg-surface-3 hover:text-text focus-ring";

export function HashChip({
  hash,
  status = "idle",
  onVerify,
  className,
}: HashChipProps) {
  const { copied, copy } = useCopy();

  return (
    <span className={cn("inline-flex w-fit flex-wrap items-center gap-2", className)}>
      <span
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-sm border bg-surface-2 pr-1 pl-2.5 transition-colors duration-250 ease-brand",
          status === "match" && "border-green-deep shadow-glow",
          status === "mismatch" && "border-danger",
          status === "idle" && "border-border"
        )}
      >
        <Fingerprint className="size-3.5 text-text-faint" aria-hidden="true" />
        <span className="nums ml-1 text-sm text-text" title={hash}>
          {shortHash(hash)}
        </span>
        <button
          type="button"
          onClick={() => copy(hash)}
          className={iconButton}
          aria-label={copied ? text.chips.copied : text.chips.copyHash}
        >
          {copied ? (
            <Check className="size-3.5 text-green" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
        </button>
        {onVerify && (
          <button
            type="button"
            onClick={onVerify}
            className={iconButton}
            aria-label={text.chips.verify}
          >
            <ShieldCheck className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </span>

      <span role="status" className="type-caption inline-flex items-center gap-1">
        {status === "match" && (
          <span className="inline-flex items-center gap-1 text-green">
            <Check className="size-3.5" aria-hidden="true" />
            {text.chips.hashMatch}
          </span>
        )}
        {status === "mismatch" && (
          <span className="inline-flex items-center gap-1 text-danger">
            <CircleX className="size-3.5" aria-hidden="true" />
            {text.chips.hashMismatch}
          </span>
        )}
      </span>
    </span>
  );
}
