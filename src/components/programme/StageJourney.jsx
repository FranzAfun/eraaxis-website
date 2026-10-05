import { ArrowRight } from "lucide-react";
import Reveal from "../motion/Reveal";

/**
 * A programme's stages as a journey. On a wide screen (with the h-scroll scene
 * running) the section holds still and the stages slide sideways as you scroll
 * down; on a phone they are a row you swipe; with less motion, a grid.
 *
 * `stages`: [{ label, tag, heading, line, Icon }]. `tag` is who or when.
 */
export default function StageJourney({ eyebrow, title, stages, tone = "light" }) {
  const dark = tone === "dark";
  return (
    <section
      data-h-scroll
      style={{ "--h-cols": stages.length }}
      className={`relative overflow-hidden py-20 md:py-24 ${
        dark
          ? "dark-surface bg-[linear-gradient(135deg,var(--color-background-dark)_0%,var(--color-primary-deep)_60%,var(--color-primary)_100%)]"
          : "soft-field"
      }`}
    >
      <div className="container w-full">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className={`mb-3 text-xs font-semibold uppercase tracking-widest ${dark ? "text-[var(--color-accent-text-on-hero)]" : "text-[var(--color-primary)]"}`}>
              {eyebrow}
            </p>
            <h2 className={`text-3xl font-black tracking-tight sm:text-4xl ${dark ? "text-white" : "text-[var(--color-text-primary)]"}`}>{title}</h2>
          </div>
          <p className={`h-hint text-sm font-medium ${dark ? "text-[var(--color-text-on-dark-muted)]" : "text-[var(--color-text-secondary)]"}`}>
            Swipe <ArrowRight size={14} className="ml-1 inline align-[-2px]" aria-hidden="true" />
          </p>
        </Reveal>

        {/* Focusable so the row can be scrolled from the keyboard. */}
        <ol className="h-track" data-h-track tabIndex={0} aria-label={title}>
          {stages.map(({ label, tag, heading, line, Icon }, i) => (
            <li key={label} className={`h-card flex flex-col gap-5 p-6 sm:p-7 ${dark ? "glass-dark" : "glass"}`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] ${dark ? "bg-[var(--color-accent)] text-[var(--color-primary-deep)]" : "bg-[var(--color-primary)] text-white"}`}>
                  <Icon size={22} strokeWidth={2} aria-hidden="true" />
                </span>
                <span className={`text-5xl font-black leading-none ${dark ? "text-white/15" : "text-[var(--color-primary)]/15"}`} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <p className={`text-sm font-bold uppercase tracking-widest ${dark ? "text-[var(--color-accent-text-on-hero)]" : "text-[var(--color-primary)]"}`}>{label}</p>
                <h3 className={`mt-1 text-2xl font-black tracking-tight ${dark ? "text-white" : "text-[var(--color-text-primary)]"}`}>{heading}</h3>
                <p className={`mt-2 text-[15px] leading-relaxed lg:text-base ${dark ? "text-[var(--color-text-on-dark-muted)]" : "text-[var(--color-text-secondary)]"}`}>{line}</p>
              </div>
              {tag && (
                <p className={`mt-auto w-fit rounded-full px-3 py-1 text-sm font-semibold ${dark ? "bg-white/10 text-white" : "bg-[var(--color-primary)]/[0.08] text-[var(--color-primary-deep)]"}`}>
                  {tag}
                </p>
              )}
            </li>
          ))}
        </ol>
        <div className="h-progress" aria-hidden="true">
          <span data-h-progress />
        </div>
      </div>
    </section>
  );
}
