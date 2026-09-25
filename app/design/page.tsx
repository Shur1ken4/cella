import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { copy } from "@/lib/copy";
import { Section } from "@/components/design/section";
import { SwatchGrid } from "@/components/design/swatch-grid";
import { TypeSpecimen } from "@/components/design/type-specimen";
import { ButtonMatrix } from "@/components/design/button-matrix";
import { CardsDemo } from "@/components/design/cards-demo";
import { ChipsDemo } from "@/components/design/chips-demo";
import { FeedbackDemo } from "@/components/design/feedback-demo";
import { PassportDemo } from "@/components/design/passport-demo";
import { SealDemo } from "@/components/design/seal-demo";
import { VaultMeterDemo } from "@/components/design/vault-meter-demo";
import { CoinFlowDemo } from "@/components/design/coin-flow-demo";
import { PrimitivesDemo } from "@/components/design/primitives-demo";
import { StrandTimeline } from "@/components/bap/strand-timeline";
import { StageStepper } from "@/components/bap/stage-stepper";
import { mockTimeline } from "@/lib/design/mock";

// Hidden living style guide: not linked from the nav, not indexed.
export const metadata: Metadata = {
  title: `${copy.design.title} · ${copy.site.name}`,
  robots: { index: false, follow: false },
};

const s = copy.design.sections;
const nav = [
  ["colours", s.colours],
  ["type", s.type],
  ["buttons", s.buttons],
  ["cards", s.cards],
  ["chips", s.chips],
  ["feedback", s.feedback],
  ["passport", s.passport],
  ["seals", s.seals],
  ["timeline", s.timeline],
  ["stepper", s.stepper],
  ["vault", s.vault],
  ["coins", s.coins],
  ["primitives", s.primitives],
] as const;

export default function DesignPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[200px_1fr] lg:gap-14 lg:py-16">
      <aside className="lg:sticky lg:top-10 lg:self-start">
        <Link
          href="/"
          className="type-caption inline-flex items-center gap-1 text-text-muted hover:text-text focus-ring"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" /> {copy.site.name}
        </Link>
        <p className="type-label mt-6 text-green">{copy.site.tagline}</p>
        <nav aria-label="Style guide sections" className="mt-4 hidden lg:block">
          <ul className="flex flex-col gap-1 border-l border-border">
            {nav.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="type-small -ml-px block border-l border-transparent py-0.5 pl-3 text-text-muted hover:border-green hover:text-text focus-ring"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex min-w-0 flex-col gap-14">
        <header className="max-w-2xl">
          <h1 className="type-h1 sm:type-display text-text">{copy.design.title}</h1>
          <p className="type-body mt-3 text-text-muted">{copy.design.intro}</p>
        </header>

        <Section id="colours" title={s.colours} note="Values are read live from app/globals.css.">
          <SwatchGrid />
        </Section>
        <Section id="type" title={s.type} note="Space Grotesk · IBM Plex Sans · JetBrains Mono">
          <TypeSpecimen />
        </Section>
        <Section id="buttons" title={s.buttons}>
          <ButtonMatrix />
        </Section>
        <Section id="cards" title={s.cards}>
          <CardsDemo />
        </Section>
        <Section id="chips" title={s.chips}>
          <ChipsDemo />
        </Section>
        <Section id="feedback" title={s.feedback}>
          <FeedbackDemo />
        </Section>
        <Section id="passport" title={s.passport}>
          <PassportDemo />
        </Section>
        <Section id="seals" title={s.seals}>
          <SealDemo />
        </Section>
        <Section id="timeline" title={s.timeline}>
          <div className="max-w-2xl">
            <StrandTimeline events={mockTimeline} />
          </div>
        </Section>
        <Section id="stepper" title={s.stepper} note="Current: Preclinical">
          <StageStepper current={3} />
        </Section>
        <Section id="vault" title={s.vault}>
          <VaultMeterDemo />
        </Section>
        <Section id="coins" title={s.coins}>
          <CoinFlowDemo />
        </Section>
        <Section id="primitives" title={s.primitives}>
          <PrimitivesDemo />
        </Section>
      </main>
    </div>
  );
}
