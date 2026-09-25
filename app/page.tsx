import Link from "next/link";
import { ArrowRight, Hexagon, PlayCircle } from "lucide-react";
import { copy } from "@/lib/copy";
import { Button } from "@/components/ui/button";
import { ExplainerPlayer } from "@/components/explainer/explainer-player";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { MoleculeBackground } from "@/components/landing/molecule-background";
import { HeroPassport } from "@/components/landing/hero-passport";
import { BuildingBlocks } from "@/components/landing/building-blocks";
import { ProblemStats } from "@/components/landing/problem-stats";
import { WhyBlockchain } from "@/components/landing/why-blockchain";

export default function Home() {
  const h = copy.home;
  return (
    <>
      {/* 1 · Hero */}
      <section className="relative isolate overflow-hidden border-b border-border bg-bg">
        <MoleculeBackground className="-z-10" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <Reveal>
            <p className="type-label inline-flex items-center gap-2 rounded-sm border border-green-deep/40 bg-green-tint px-2.5 py-1 text-green">
              <Hexagon className="size-3.5" aria-hidden="true" /> {h.heroSub}
            </p>
            <h1 className="type-h1 sm:type-display mt-5 max-w-xl text-text">{h.heroTitle}</h1>
            <p className="type-body mt-5 max-w-lg text-text-muted">{h.heroBody}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/app">
                  {h.cta} <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href="#explainer">
                  <PlayCircle aria-hidden="true" /> {h.watch}
                </a>
              </Button>
            </div>
          </Reveal>
          <HeroPassport />
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-24 px-4 py-20 sm:px-6 lg:gap-32">
        {/* 2 · Explainer */}
        <section id="explainer" className="scroll-mt-24">
          <Reveal className="mb-6">
            <h2 className="type-h2 text-text">{h.explainerTitle}</h2>
          </Reveal>
          <ExplainerPlayer />
        </section>

        {/* 3 · Three steps */}
        <section>
          <Reveal className="mb-8">
            <h2 className="type-h2 text-text">{h.steps.title}</h2>
          </Reveal>
          <BuildingBlocks />
        </section>

        {/* 4 · The problem in numbers */}
        <section>
          <Reveal className="mb-8 max-w-xl">
            <h2 className="type-h2 text-text">{h.problem.title}</h2>
          </Reveal>
          <ProblemStats />
        </section>

        {/* 5 · Why blockchain */}
        <section>
          <WhyBlockchain />
        </section>

        {/* 6 · Built on Solana */}
        <section>
          <Reveal>
            <h2 className="type-label text-text-faint">{h.builtOn.title}</h2>
          </Reveal>
          <Stagger className="mt-4 flex flex-wrap gap-3">
            {h.builtOn.items.map((item) => (
              <StaggerItem
                key={item}
                className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-surface-1 px-4 py-2.5 text-sm font-medium text-text shadow-card"
              >
                <Hexagon className="size-4 text-green" aria-hidden="true" />
                {item}
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      </div>

      {/* 7 · Final CTA */}
      <section data-theme="dark" className="relative isolate overflow-hidden bg-bg-deep text-text">
        <MoleculeBackground className="-z-10 opacity-[0.12]" />
        <Reveal className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="type-h2 text-text">{h.finalCta.title}</h2>
            <p className="type-body mt-3 text-text-muted">{h.finalCta.body}</p>
          </div>
          <Button asChild size="lg">
            <Link href="/app">
              {h.finalCta.button} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
