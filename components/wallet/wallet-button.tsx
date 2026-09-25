"use client";

import { useState, useRef, useEffect } from "react";
import { useWallet } from "@/lib/solana/wallet/context";
import { useBalance } from "@/lib/solana/hooks/use-balance";
import { lamportsToSolString } from "@/lib/solana/format";
import { ellipsify, getExplorerUrl } from "@/lib/solana/explorer";
import { copy } from "@/lib/copy";

const itemClass =
  "flex-1 cursor-pointer rounded-md border border-border bg-card px-3 py-2 text-center text-xs font-medium transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring";

export function WalletButton() {
  const { connectors, connect, disconnect, wallet, status, error } =
    useWallet();

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const address = wallet?.account.address;
  const balance = useBalance(address);

  const close = () => setIsOpen(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleCopy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status !== "connected" || !address) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setIsOpen((o) => !o)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {copy.wallet.connect}
        </button>

        {isOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-border bg-card p-3 shadow-lg"
          >
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {copy.wallet.chooseWallet}
            </p>
            {connectors.length === 0 && (
              <p className="text-xs text-muted-foreground">
                {copy.wallet.noWallets}
              </p>
            )}
            <div className="space-y-1">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  role="menuitem"
                  onClick={async () => {
                    try {
                      await connect(connector.id);
                      close();
                    } catch {
                      // connection errors are surfaced through context state
                    }
                  }}
                  disabled={status === "connecting"}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  {connector.icon && (
                    // eslint-disable-next-line @next/next/no-img-element -- wallet icons are data: URIs
                    <img src={connector.icon} alt="" className="h-5 w-5 rounded" />
                  )}
                  <span>{connector.name}</span>
                </button>
              ))}
            </div>
            {status === "connecting" && (
              <p className="mt-2 text-xs text-muted-foreground">
                {copy.wallet.connecting}
              </p>
            )}
            {error != null && (
              <p className="mt-2 text-xs text-destructive">
                {error instanceof Error ? error.message : String(error)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
        <span className="font-mono">{ellipsify(address, 4)}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-border bg-card p-4 shadow-lg"
        >
          <div className="mb-3">
            <p className="text-xs text-muted-foreground">
              {copy.wallet.balance}
            </p>
            <p className="font-mono text-lg font-bold tabular-nums">
              {balance.lamports != null
                ? lamportsToSolString(balance.lamports)
                : "—"}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                SOL (devnet)
              </span>
            </p>
          </div>

          <div className="mb-3 rounded-md border border-border px-3 py-2">
            <p className="break-all font-mono text-xs">{address}</p>
          </div>

          <div className="flex gap-2">
            <button onClick={handleCopy} className={itemClass}>
              {copied ? copy.wallet.copied : copy.wallet.copyAddress}
            </button>
            <a
              href={getExplorerUrl(`/address/${address}`)}
              target="_blank"
              rel="noopener noreferrer"
              className={itemClass}
            >
              {copy.wallet.explorer}
            </a>
          </div>

          <button
            onClick={() => {
              void disconnect();
              close();
            }}
            className="mt-2 w-full cursor-pointer rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-destructive transition hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-ring"
          >
            {copy.wallet.disconnect}
          </button>
        </div>
      )}
    </div>
  );
}
