import Link from "next/link";
import { Clapperboard } from "lucide-react";
import { copy } from "@/lib/copy";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

// Placeholder until the Phase 3 explainer video + FAQ.
export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="type-h1 text-text">{copy.howItWorks.title}</h1>
      <EmptyState
        className="mt-8"
        icon={Clapperboard}
        title={copy.howItWorks.comingSoon}
        action={
          <Button asChild>
            <Link href="/app">{copy.howItWorks.cta}</Link>
          </Button>
        }
      />
    </div>
  );
}
