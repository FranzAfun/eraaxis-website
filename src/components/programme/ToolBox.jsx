import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "../motion/Reveal";
import { SectionHead } from "./ProgrammeParts";

/**
 * Tool categories as a toolbox: tap one and it opens to say what it is for,
 * and which tools, where the programme names them. One open at a time.
 *
 * `tools`: [{ title, line, names?: [string], Icon }].
 */
export default function ToolBox({ eyebrow, title, tools }) {
  const id = useId();
  const [open, setOpen] = useState(tools[0].title);
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="container">
        <SectionHead eyebrow={eyebrow} title={title} className="mb-4" />
        <Reveal as="p" className="mb-10 text-lg text-[var(--color-text-secondary)]">Tap a category.</Reveal>
        <ul className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ title: label, line, names, Icon }, i) => {
            const on = open === label;
            const body = `${id}-tool-${i}`;
            return (
              <Reveal as="li" key={label} delay={(i % 3) * 80} className={`tool-tile ${on ? "is-open" : ""}`}>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={body}
                  onClick={() => setOpen(on ? null : label)}
                  className="flex min-h-[4.5rem] w-full items-center gap-4 p-5 text-left"
                >
                  <span className="tool-tile-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)]">
                    <Icon size={20} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="text-[15px] font-semibold leading-snug text-[var(--color-text-primary)]">{label}</span>
                  <ChevronDown size={18} className="tool-tile-chevron ml-auto shrink-0 text-[var(--color-text-secondary)]" aria-hidden="true" />
                </button>
                <div id={body} className="tool-tile-body" aria-hidden={!on}>
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5">
                      <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{line}</p>
                      {names && (
                        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tools">
                          {names.map((name) => (
                            <li key={name} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[var(--color-primary-deep)] shadow-[0_1px_0_var(--color-border-soft)]">
                              {name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
