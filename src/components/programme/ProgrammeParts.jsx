import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import devBoardImg from "../../assets/images/dev-board/dev-board-main-640.webp";
import Reveal from "../motion/Reveal";

/**
 * The pieces every programme page shares: the hero, the tiles of what
 * learners make or work on, the short reasons, the Dev Board strip and the
 * close. Each page brings its own words and its own centrepiece.
 */

const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

export function ProgrammeHero({ eyebrow, title, line, glance, image, imageAlt, imageClass = "", badge, actions }) {
  return (
    <section className="dark-surface hero-ground relative -mt-20 overflow-hidden pb-16 pt-32 text-white md:pb-24 md:pt-40">
      <div className="container relative z-10">
        <Link
          to="/programs"
          className="mb-8 flex w-fit items-center gap-1.5 text-xs font-medium text-[var(--color-text-on-dark-muted)] transition-colors hover:text-white"
        >
          <ArrowLeft size={12} strokeWidth={2.5} aria-hidden="true" />
          Back to programmes
        </Link>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div data-scene="hero-exit">
            <p className="mb-5 inline-flex w-fit rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">
              {eyebrow}
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[3.6rem]">{title}</h1>
            <p className="mb-7 max-w-xl text-base leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-lg">{line}</p>
            {glance && (
              <ul className="mb-9 flex flex-wrap gap-2" aria-label="At a glance">
                {glance.map((item) => (
                  <li key={item} className="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-[var(--color-text-on-dark-muted)]">
                    {item}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-col gap-3 sm:flex-row">{actions}</div>
          </div>
          <div className="hidden md:block" data-scene="hero-sink">
            <div className="hero-media-card relative overflow-hidden">
              {/* The photo shows from tablet width up; phones get a blank
                  pixel instead, so they never download it. */}
              <picture>
                <source media="(max-width: 767px)" srcSet={BLANK} />
                <img src={image} alt={imageAlt} className={`aspect-[4/3] w-full object-cover ${imageClass}`} fetchPriority="high" />
              </picture>
              {badge && (
                <div className="absolute bottom-4 left-4">
                  <span className="hero-media-card-badge inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--color-text-primary)] shadow-sm">
                    {badge}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, dark = false, className = "mb-10" }) {
  return (
    <Reveal className={`max-w-2xl ${className}`}>
      <p className={`mb-3 text-xs font-semibold uppercase tracking-widest ${dark ? "text-[var(--color-accent-text-on-hero)]" : "text-[var(--color-primary)]"}`}>{eyebrow}</p>
      <h2 className={`text-3xl font-black tracking-tight sm:text-4xl ${dark ? "text-white" : "text-[var(--color-text-primary)]"}`}>{title}</h2>
    </Reveal>
  );
}

/** Things learners make or work with: icon tiles that arrive in a wave. */
export function BuildTiles({ eyebrow, title, items }) {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="container">
        <SectionHead eyebrow={eyebrow} title={title} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ Icon, title: label }, i) => (
            <Reveal as="li" key={label} delay={(i % 3) * 90} className="build-tile flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-white text-[var(--color-primary)] shadow-[0_8px_20px_-12px_var(--color-primary)]">
                <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
              </span>
              <span className="text-[15px] font-semibold leading-snug text-[var(--color-text-primary)]">{label}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Short reasons, sliding in from alternating sides on a wide screen. */
export function ReasonLines({ eyebrow, title, items }) {
  return (
    <section className="soft-field overflow-hidden py-20 md:py-24">
      <div className="container">
        <SectionHead eyebrow={eyebrow} title={title} />
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map(({ Icon, title: heading, line }, i) => (
            <div key={heading} data-scene="drift" data-from={i % 2 ? "right" : "left"} className="glass flex gap-5 p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white">
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{heading}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{line}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The Dev Board, where a programme uses it. */
export function DevBoardStrip({ line }) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container">
        <Reveal className="relative grid items-center gap-8 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-primary-deep)] p-8 md:grid-cols-[1fr_auto] md:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_75%_at_85%_50%,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_65%)]" />
          <div className="relative">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">Hands-on hardware</p>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Powered by the ERA Dev Board.</h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-[var(--color-text-on-dark-muted)]">{line}</p>
            <Link to="/dev-board" className="btn-primary btn-on-dark mt-6 w-fit">
              Take the board tour
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
          <div data-scene="tilt-zoom" className="relative mx-auto w-40 md:w-48">
            <img src={devBoardImg} alt="The ERA Dev Board" loading="lazy" decoding="async" className="w-full rounded-[var(--radius-md)] shadow-[0_30px_60px_-30px_rgb(0_0_0_/_0.8)]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Asks partners and sponsors in. */
export function PartnerStrip({ title, line }) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container">
        <Reveal className="glass flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">Partners and sponsors</p>
            <h2 className="text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">{title}</h2>
            <p className="mt-2 text-base leading-relaxed text-[var(--color-text-secondary)]">{line}</p>
          </div>
          <Link to="/partners" className="btn-primary min-h-[44px] w-fit shrink-0">
            Partner With ERA
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function ProgrammeClose({ title, line, actions }) {
  return (
    <section className="dark-surface final-cta-band relative overflow-hidden py-16 md:py-20">
      <div aria-hidden="true" className="final-cta-orb pointer-events-none absolute inset-0" />
      <Reveal className="container relative text-center">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h2>
        {line && <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-[var(--color-text-on-dark-muted)]">{line}</p>}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">{actions}</div>
      </Reveal>
    </section>
  );
}
