import Reveal from "../motion/Reveal";
import { SectionHead } from "./ProgrammeParts";

/**
 * Steps down a line that fills as you scroll (the grow-line scene); each
 * step's dot lights as it arrives.
 *
 * `steps`: [{ heading, line, Icon }].
 */
export default function StepLine({ eyebrow, title, steps }) {
  return (
    <section className="soft-field py-20 md:py-24">
      <div className="container grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead eyebrow={eyebrow} title={title} className="" />
        </div>
        <div className="relative">
          <div aria-hidden="true" className="absolute bottom-8 left-[1.6rem] top-8 w-0.5 bg-[var(--color-primary)]/15" />
          <div aria-hidden="true" data-scene="grow-line" data-axis="y" className="absolute bottom-8 left-[1.6rem] top-8 w-0.5 origin-top bg-[var(--color-primary)]" />
          <ol className="relative">
            {steps.map(({ heading, line, Icon }, i) => (
              <Reveal as="li" key={heading} className="step-line-item relative flex gap-5 pb-10 last:pb-0 sm:gap-7">
                <span className="step-line-dot relative z-10 flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full">
                  <Icon size={22} strokeWidth={2} aria-hidden="true" />
                </span>
                <div className="pt-1">
                  <p className="text-sm font-semibold text-[var(--color-text-secondary)]">Step {i + 1}</p>
                  <h3 className="mt-1 text-xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-2xl">{heading}</h3>
                  <p className="mt-2 max-w-md text-base leading-relaxed text-[var(--color-text-secondary)]">{line}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
