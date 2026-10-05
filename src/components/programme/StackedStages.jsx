import { SectionHead } from "./ProgrammeParts";

/**
 * A programme's stages as a pile of cards: each one holds near the top of the
 * screen and the next slides over it, so you feel the steps add up. The pile
 * is plain CSS (sticky); the stack-card scene eases the covered cards back.
 *
 * `stages`: [{ label, heading, line, Icon }].
 */
export default function StackedStages({ eyebrow, title, stages }) {
  return (
    <section className="soft-field py-20 md:py-24">
      <div className="container">
        <SectionHead eyebrow={eyebrow} title={title} />
        <ol className="stage-pile">
          {stages.map(({ label, heading, line, Icon }, i) => (
            <li
              key={label}
              data-scene="stack-card"
              className="stage-pile-card grid items-center gap-6 p-6 sm:p-9 md:grid-cols-[1fr_auto] md:gap-10"
              style={{ "--i": i }}
            >
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Stage {i + 1} of {stages.length}
                </p>
                <p className="mt-3 text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">{label}</p>
                <h3 className="mt-1 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">{heading}</h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">{line}</p>
              </div>
              <div className="stage-pile-art order-first flex h-20 w-20 items-center justify-center md:order-none md:h-36 md:w-36" aria-hidden="true">
                <Icon className="h-9 w-9 md:h-14 md:w-14" strokeWidth={1.7} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
