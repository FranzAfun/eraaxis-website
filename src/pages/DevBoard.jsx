import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  BookOpen,
  ClipboardList,
  Cpu,
  Eye,
  Hammer,
  Layers,
  Link2,
  Search,
  TrendingUp,
  Wifi,
  Wrench,
} from "lucide-react";

import devBoardMainImg from "../assets/images/dev-board/dev-board-main.webp";
import devBoardMainSmallImg from "../assets/images/dev-board/dev-board-main-640.webp";
import devBoardMainMidImg from "../assets/images/dev-board/dev-board-main-768.webp";
import devBoardFrontImg from "../assets/images/dev-board/dev-board-front.webp";
import devBoardBackBlueImg from "../assets/images/dev-board/dev-board-back-blue.webp";
import devBoardBackPurpleImg from "../assets/images/dev-board/dev-board-back-purple.webp";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";
import Reveal from "../components/motion/Reveal";
import ScrollScenes from "../components/motion/ScrollScenes";
import BoardTour from "../components/devboard/BoardTour";
import SeriesParallelLab from "../components/devboard/SeriesParallelLab";

// What the board is, at a glance.
const specs = ["4 × AA, 6 V", "Polarity protected", "Breadboard practice area", "Built by hand in Ghana"];

const progression = [
  { Icon: Eye, label: "Discover", line: "Power it on and watch what happens." },
  { Icon: Link2, label: "Connect", line: "Wire components, polarity first." },
  { Icon: Layers, label: "Compare", line: "Series against parallel." },
  { Icon: Hammer, label: "Build", line: "Their own circuits, freely." },
];

const changes = [
  { Icon: TrendingUp, title: "The abstract becomes visible", line: "An LED lights, or doesn't, because of what they did." },
  { Icon: ClipboardList, title: "Confidence through doing", line: "Every circuit that works makes the next one easier." },
  { Icon: BookOpen, title: "Assessment you can see", line: "Learners show and explain what they built." },
  { Icon: Search, title: "Debugging becomes a habit", line: "When it doesn't work, they find out why." },
];

const aiHelps = [
  { Icon: Wifi, label: "Troubleshooting" },
  { Icon: Cpu, label: "Circuit reasoning" },
  { Icon: Wrench, label: "Guided debugging" },
  { Icon: Hammer, label: "Practice support" },
];

const photos = [
  { src: devBoardFrontImg, alt: "ERA Dev Board front view", title: "Front", note: "Power and practice area" },
  { src: devBoardBackBlueImg, alt: "ERA Dev Board back view, blue edition", title: "Blue back", note: "Build · Play · Invent" },
  { src: devBoardBackPurpleImg, alt: "ERA Dev Board back view, purple edition", title: "Purple back", note: "Build · Play · Invent" },
];

const heroPrimaryClass =
  "cta-mobile-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90";
const heroSecondaryClass =
  "cta-mobile-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]";
const ctaPrimaryClass =
  "final-cta-btn-primary cta-mobile-btn inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] px-5 text-sm font-semibold";
const ctaSecondaryClass =
  "final-cta-btn-secondary cta-mobile-btn inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] px-5 text-sm font-semibold";

function Eyebrow({ children, dark = false }) {
  return (
    <p className={`mb-3 text-xs font-semibold uppercase tracking-widest ${dark ? "text-[var(--color-accent-text-on-hero)]" : "text-[var(--color-primary)]"}`}>
      {children}
    </p>
  );
}

export default function DevBoard() {
  return (
    <ScrollScenes>
      <SEO {...getPageSeo("/dev-board")} />

      {/* ── Hero: the board itself, stepping back as you scroll ──────────── */}
      <section className="dark-surface hero-ground relative -mt-20 overflow-hidden pb-16 pt-36 text-white md:pb-24 md:pt-40">
        <div className="land-in container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
            <div data-scene="hero-exit">
              <p className="mb-5 inline-flex w-fit rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">
                ERA Dev Board
              </p>
              <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
                A hands-on electronics learning kit for real circuits.
              </h1>
              <p className="mb-7 max-w-xl text-base leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-lg">
                Learners build, test and explain real circuits, from a single LED to their own designs.
              </p>
              <ul className="mb-9 flex flex-wrap gap-2" aria-label="At a glance">
                {specs.map((spec) => (
                  <li key={spec} className="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-[var(--color-text-on-dark-muted)]">
                    {spec}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="#tour" className={heroPrimaryClass}>
                  Take the tour
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </a>
                <Link to="/programs" className={heroSecondaryClass}>
                  Explore Programmes
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div data-scene="hero-sink" className="mx-auto w-full max-w-[18rem] sm:max-w-sm lg:max-w-none">
              <img
                src={devBoardMainImg}
                srcSet={`${devBoardMainSmallImg} 640w, ${devBoardMainMidImg} 768w, ${devBoardMainImg} 1024w`}
                sizes="(min-width: 1024px) 40vw, 18rem"
                width="1024"
                height="1280"
                alt="The ERA Dev Board with its batteries in, power parts and breadboard"
                className="w-full rounded-[var(--radius-lg)] shadow-[0_40px_90px_-40px_rgb(0_0_0_/_0.8)]"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── The tour ─────────────────────────────────────────────────────── */}
      <section id="tour" className="soft-field relative scroll-mt-20 py-20 md:py-24">
        <div className="container">
          <Reveal className="mb-10 max-w-2xl">
            <Eyebrow>The Board</Eyebrow>
            <h2 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
              Take the tour. Every part teaches something.
            </h2>
          </Reveal>
          <BoardTour />
        </div>
      </section>

      {/* ── Try it: series or parallel ───────────────────────────────────── */}
      <section className="dark-surface relative overflow-hidden bg-[linear-gradient(135deg,var(--color-background-dark)_0%,var(--color-primary-deep)_60%,var(--color-primary)_100%)] py-20 md:py-24">
        <div className="container relative z-10 grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <Eyebrow dark>Try It</Eyebrow>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Series or parallel?</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-lg">
              Learners build both on the breadboard. Pull an LED out and see which circuit keeps going.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div data-scene="zoom-in">
              <SeriesParallelLab />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Progression ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="container">
          <Reveal className="mb-12 max-w-2xl">
            <Eyebrow>Learning Progression</Eyebrow>
            <h2 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
              From first look to their own build.
            </h2>
          </Reveal>
          <div className="relative">
            {/* The line fills as you scroll past the steps. */}
            <div aria-hidden="true" className="absolute left-5 top-5 bottom-5 w-0.5 bg-[var(--color-border)] md:left-0 md:right-0 md:top-5 md:bottom-auto md:h-0.5 md:w-auto" />
            <div aria-hidden="true" data-scene="grow-line" data-axis="y" className="absolute left-5 top-5 bottom-5 w-0.5 origin-top bg-[var(--color-primary)] md:hidden" />
            <div aria-hidden="true" data-scene="grow-line" className="absolute left-0 right-0 top-5 hidden h-0.5 origin-left bg-[var(--color-primary)] md:block" />
            <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
              {progression.map(({ Icon, label, line }, i) => (
                <Reveal as="li" key={label} delay={i * 110} className="flex gap-4 md:flex-col md:gap-5">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[0_0_0_6px_white]">
                    <Icon size={18} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-primary)]">Step {i + 1}</p>
                    <h3 className="mt-1 text-xl font-black text-[var(--color-text-primary)]">{label}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{line}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── What changes ─────────────────────────────────────────────────── */}
      <section className="soft-field overflow-hidden py-20 md:py-24">
        <div className="container">
          <Reveal className="mb-10 max-w-2xl">
            <Eyebrow>Why It Matters</Eyebrow>
            <h2 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
              What changes when learners build.
            </h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {changes.map(({ Icon, title, line }, i) => (
              <div key={title} data-scene="drift" data-from={i % 2 ? "right" : "left"} className="glass flex gap-5 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white">
                  <Icon size={20} strokeWidth={2} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{line}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photos ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="container">
          <Reveal className="mb-10 max-w-2xl">
            <Eyebrow>Up Close</Eyebrow>
            <h2 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">Front and back.</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <figure key={photo.title} className="group relative aspect-[3/2] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] shadow-[var(--shadow-soft)]">
                <div data-scene="zoom-in" className="h-full w-full">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 via-black/35 to-transparent px-5 pb-4 pt-10">
                  <span className="text-sm font-semibold text-white">{photo.title}</span>
                  <span className="text-xs text-[var(--color-text-on-dark-muted)]">{photo.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI support (in development) ──────────────────────────────────── */}
      <section className="dark-surface bg-[var(--color-primary-deep)] py-20 md:py-24">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-white/10">
                <Bot size={18} className="text-[var(--color-accent)]" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">AI-Assisted Support</p>
              <span className="rounded-full border border-[var(--color-accent)]/40 px-2.5 py-0.5 text-xs font-semibold text-[var(--color-accent-text-on-hero)]">In development</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Help while they build.</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-lg">
              We&apos;re training an assistant that knows the board: its wiring, polarity and circuit logic.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="What it will help with">
              {aiHelps.map(({ Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-sm font-medium text-[var(--color-text-on-dark-muted)]">
                  <Icon size={15} strokeWidth={2} className="text-[var(--color-accent)]" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-[var(--color-text-on-dark-muted)]">It supports facilitators; it doesn&apos;t replace them.</p>
          </Reveal>

          {/* A preview of the kind of help, not a live chat. */}
          <div className="glass-dark space-y-3 p-6" aria-label="A preview of a learner asking the assistant for help" role="img">
            <Reveal delay={150} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white/10 px-4 py-3 text-[15px] text-white">
              My LED won&apos;t light.
            </Reveal>
            <Reveal delay={450} className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-[var(--color-accent)] px-4 py-3 text-[15px] font-medium text-[var(--color-primary-deep)]">
              Check its long leg goes to the + side. Is the switch on?
            </Reveal>
            <Reveal delay={750} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white/10 px-4 py-3 text-[15px] text-white">
              It was backwards. It works now!
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Close ────────────────────────────────────────────────────────── */}
      <section className="dark-surface final-cta-band relative overflow-hidden py-16 md:py-20">
        <div aria-hidden="true" className="final-cta-orb pointer-events-none absolute inset-0" />
        <Reveal className="container relative text-center">
          <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Bring the board to your learners.
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-[var(--color-text-on-dark-muted)]">
            In school STEM, youth training and project-based learning.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/contact" className={ctaPrimaryClass}>
              Talk to us
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <Link to="/programs/school-stem" className={ctaSecondaryClass}>
              School STEM Programme
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>
    </ScrollScenes>
  );
}
