import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "../motion/Reveal";

/**
 * "Is this for you?" Tap what sounds like you; the answer and the way in
 * appear once anything is chosen. Nothing is sent anywhere.
 *
 * `items`: [{ label, Icon }]. `enrol`: { to, state, label }.
 */
export default function FitCheck({ eyebrow, title, items, yes, enrol }) {
  const [chosen, setChosen] = useState(() => new Set());
  const toggle = (label) =>
    setChosen((current) => {
      const next = new Set(current);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  const any = chosen.size > 0;

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="container grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">{eyebrow}</p>
          <h2 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg text-[var(--color-text-secondary)]">Tap what sounds like you.</p>
        </Reveal>
        <Reveal delay={80}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map(({ label, Icon }) => {
              const on = chosen.has(label);
              return (
                <li key={label}>
                  <button type="button" aria-pressed={on} onClick={() => toggle(label)} className="fit-chip flex w-full items-center gap-3 p-4 text-left">
                    <span className="fit-chip-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      {on ? <Check size={18} strokeWidth={2.6} aria-hidden="true" /> : <Icon size={18} strokeWidth={2} aria-hidden="true" />}
                    </span>
                    <span className="text-[15px] font-semibold leading-snug">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 min-h-[5.5rem] sm:min-h-[3.5rem]" aria-live="polite">
            {any && (
              <div className="fit-answer flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-base font-semibold text-[var(--color-text-primary)]">{yes}</p>
                <Link to={enrol.to} state={enrol.state} className="btn-primary min-h-[44px] w-fit shrink-0">
                  {enrol.label}
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
