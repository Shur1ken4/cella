import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { copy } from "@/lib/copy";
import { Button } from "@/components/ui/button";
import { ExplainerPlayer } from "@/components/explainer/explainer-player";
import { Faq } from "@/components/site/faq";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = { title: `${copy.howItWorks.title} · ${copy.site.name}` };

export default function HowItWorksPage() {
  const h = copy.howItWorks;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="max-w-2xl">
        <p className="type-label text-green">{copy.site.tagline}</p>
        <h1 className="type-h1 mt-2 text-text">{h.title}</h1>
        <p className="type-body mt-2 text-text-muted">{h.intro}</p>
      </div>

      <ExplainerPlayer className="mt-8" />

      <Reveal className="mt-20 grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 className="type-h2 text-text">{h.faqTitle}</h2>
          <Button asChild className="mt-6">
            <Link href="/app">
              {h.cta} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <Faq items={h.faq} />
      </Reveal>
    </div>
  );
}
