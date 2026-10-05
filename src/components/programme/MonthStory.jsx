import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../motion/useMediaQuery";
import Reveal from "../motion/Reveal";
import { SectionHead } from "./ProgrammeParts";

/**
 * A programme month by month. On a wide screen a large "Month 1" holds still
 * beside the months and turns over as each one passes the middle of the
 * screen; on a phone the months are simply cards in order.
 *
 * `months`: [{ title, focus: [string], Icon }].
 */
export default function MonthStory({ eyebrow, title, months }) {
  const wide = useMediaQuery("(min-width: 1024px)");
  const [active, setActive] = useState(0);
  const cards = useRef([]);

  useEffect(() => {
    if (!wide || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    cards.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [wide]);

  return (
    <section className="soft-field py-20 md:py-24">
      <div className="container grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start lg:py-10">
          <SectionHead eyebrow={eyebrow} title={title} className="" />
          {wide && (
            <div className="mt-10" aria-hidden="true">
              <p key={active} className="month-turn text-[7rem] font-black leading-none tracking-tight text-[var(--color-primary)]">
                {String(active + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--color-text-secondary)]">Month {active + 1} of {months.length}</p>
              <ol className="mt-5 flex max-w-xs gap-2">
                {months.map((month, i) => (
                  <li key={month.title} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i <= active ? "bg-[var(--color-primary)]" : "bg-[var(--color-primary)]/15"}`} />
                ))}
              </ol>
            </div>
          )}
        </div>

        <ol>
          {months.map(({ title: heading, focus, Icon }, i) => (
            <li
              key={heading}
              ref={(node) => { cards.current[i] = node; }}
              data-index={i}
              className={`py-3 transition-opacity duration-500 lg:flex lg:min-h-[62vh] lg:items-center lg:py-0 ${wide && i !== active ? "lg:opacity-45" : ""}`}
            >
              <Reveal className="glass w-full p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white">
                    <Icon size={22} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">Month {i + 1}</p>
                    <h3 className="text-xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-2xl">{heading}</h3>
                  </div>
                </div>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label={`Month ${i + 1} covers`}>
                  {focus.map((item) => (
                    <li key={item} className="rounded-full bg-[var(--color-primary)]/[0.08] px-3.5 py-1.5 text-sm font-medium text-[var(--color-primary-deep)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
