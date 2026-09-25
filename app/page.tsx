import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { copy } from "@/lib/copy";
import { Button } from "@/components/ui/button";
import { PassportCard } from "@/components/bap/passport-card";

// Temporary home until the Phase 3 landing page.
export default function Home() {
  return (
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
      <div>
        <p className="type-label text-green">{copy.site.tagline}</p>
        <h1 className="type-h1 sm:type-display mt-4 max-w-xl text-text">{copy.site.pitch}</h1>
        <Button asChild size="lg" className="mt-8">
          <Link href="/app">
            {copy.home.cta} <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
      <PassportCard
        name={copy.asset.name}
        code={copy.asset.code}
        stage={copy.stages[3]}
        owner={copy.institutions.owner.name}
        modality={copy.asset.modality}
        area={copy.asset.area}
        attestationCount={2}
        className="justify-self-center lg:justify-self-end"
      />
    </div>
  );
}
