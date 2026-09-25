import { WalletButton } from "@/components/wallet/wallet-button";
import { copy } from "@/lib/copy";

// Phase 0 placeholder: blank page with wallet connection only.
export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold tracking-tight">
          {copy.site.name}
        </span>
        <WalletButton />
      </header>
      <footer className="fixed inset-x-0 bottom-0 px-6 py-4 text-xs text-muted-foreground">
        {copy.network.devnetOnly}
      </footer>
    </div>
  );
}
