import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Briefcase, Cpu, School, Wrench } from "lucide-react";
import earlyTeamImg from "../assets/images/about/early-team.webp";
import balconySessionImg from "../assets/images/about/balcony-session.webp";
import balconyPlanningImg from "../assets/images/about/balcony-planning.webp";
import teamTodayImg from "../assets/images/about/team-today.webp";
import devBoardImg from "../assets/images/dev-board/dev-board-main-640.webp";
import ImpactStories from "../components/home/ImpactStories";
import Reveal from "../components/motion/Reveal";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";

// How it started, in pictures. Only the years the company has stated are
// given; the photos are not dated.
const story = [
  {
    mark: "2020",
    title: "It started small.",
    line: "A small team with one idea: make technology learning practical.",
    photos: [{ src: earlyTeamImg, alt: "The early ERA AXIS team standing together outside" }],
  },
  {
    mark: "The early days",
    title: "Around a small balcony.",
    line: "Plans, code and circuits, worked out together in a very small space.",
    photos: [
      { src: balconySessionImg, alt: "The team working on laptops around a table on a small balcony" },
      { src: balconyPlanningImg, alt: "Team members planning together around laptops on the balcony" },
    ],
  },
  {
    mark: "By hand",
    title: "Built by hand.",
    line: "The ERA Dev Board was built by hand, and it still is.",
    photos: [{ src: devBoardImg, alt: "The ERA Dev Board", contain: true }],
  },
  {
    mark: "2024",
    title: "Incorporated.",
    line: "ERA AXIS became a registered company.",
    photos: [],
  },
  {
    mark: "Today",
    title: "Still building.",
    line: "Programmes for learners, youth, professionals, schools and partners.",
    photos: [{ src: teamTodayImg, alt: "The ERA AXIS team today, in ERA shirts", tall: true }],
  },
];

const audiences = ["School students", "Out-of-school youth", "Parents", "Business owners", "Working professionals", "Schools and partners"];

const whatWeDo = [
  { Icon: BookOpen, title: "Practical STEM", line: "From theory to building and testing." },
  { Icon: Cpu, title: "Digital skills", line: "AI, software and tools for real work." },
  { Icon: Wrench, title: "ERA Dev Board", line: "Electronics learned with your hands." },
  { Icon: School, title: "Partnerships", line: "With schools, communities and sponsors." },
];

function StoryPhotos({ photos }) {
  if (!photos.length) return null;
  return (
    <div className={`grid gap-3 ${photos.length > 1 ? "sm:grid-cols-2" : ""}`}>
      {photos.map((photo) => (
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className={`w-full rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)] ${
            photo.contain
              ? "max-w-[16rem] bg-[var(--color-background-dark)] p-3"
              : photo.tall
                ? "aspect-[3/4] max-w-sm object-cover"
                : "aspect-[4/3] object-cover"
          }`}
        />
      ))}
    </div>
  );
}

export default function About() {
  return (
    <>
      <SEO {...getPageSeo("/about")} />
      <section className="dark-surface hero-ground relative -mt-20 overflow-hidden pb-16 pt-36 text-white md:pb-24 md:pt-44">
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">
              About ERA AXIS
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
              Making STEM practical for Africa&apos;s next generation of builders.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-lg">
              Ghana&apos;s practical STEM platform: real technology skills, learned by building.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#story" className="btn-primary btn-on-dark cta-mobile-btn min-h-[48px]">
                How it started
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
              <Link to="/programs" className="btn-secondary cta-mobile-btn min-h-[48px]">
                Explore Programmes
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it started ───────────────────────────────────────────────── */}
      <section id="story" className="soft-field scroll-mt-20 py-20 md:py-24">
        <div className="container">
          <Reveal className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">Our Story</p>
            <h2 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">How it started.</h2>
          </Reveal>
          <ol className="relative space-y-14 border-l-2 border-[var(--color-primary)]/20 pl-7 sm:pl-10">
            {story.map((step) => (
              <Reveal as="li" key={step.title} className="relative">
                <span aria-hidden="true" className="absolute -left-[calc(1.75rem+7px)] top-1.5 h-3 w-3 rounded-full bg-[var(--color-primary)] ring-4 ring-[var(--color-surface-soft)] sm:-left-[calc(2.5rem+7px)]" />
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-12">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">{step.mark}</p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">{step.title}</h3>
                    <p className="mt-2 max-w-md text-lg leading-relaxed text-[var(--color-text-secondary)]">{step.line}</p>
                  </div>
                  <StoryPhotos photos={step.photos} />
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Who we are, what we do ───────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="container">
          <Reveal className="mb-10 grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">Who We Are</p>
              <h2 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
                Practical, affordable technology learning for people ready to build.
              </h2>
            </div>
            <ul className="flex flex-wrap gap-2 lg:justify-end" aria-label="Who we serve">
              {audiences.map((audience) => (
                <li key={audience} className="rounded-full bg-[var(--color-primary)]/[0.08] px-3.5 py-1.5 text-sm font-medium text-[var(--color-primary-deep)]">
                  {audience}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {whatWeDo.map(({ Icon, title, line }, i) => (
              <Reveal key={title} delay={i * 80} className="card-interactive flex flex-col gap-4 rounded-[var(--radius-md)] p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white">
                  <Icon size={20} strokeWidth={2} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{line}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission and vision ───────────────────────────────────────────── */}
      <section className="dark-surface bg-[linear-gradient(135deg,var(--color-background-dark)_0%,var(--color-primary-deep)_60%,var(--color-primary)_100%)] py-20 md:py-24">
        <div className="container grid gap-5 lg:grid-cols-2">
          {[
            // The company's own statements, word for word.
            { Icon: Briefcase, label: "Our mission", text: "To make practical STEM and digital skills education accessible across Africa by helping learners build real projects, solve real problems, and grow with technology." },
            { Icon: Cpu, label: "Our vision", text: "To become a leading practical STEM and digital skills platform in Africa, helping more people learn by building, innovate with confidence, and use technology to improve their communities." },
          ].map(({ Icon, label, text }, i) => (
            <Reveal key={label} delay={i * 100} className="glass-dark p-7 sm:p-9">
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[var(--color-accent)]">
                <Icon size={22} strokeWidth={2} aria-hidden="true" />
              </span>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">{label}</p>
              <p className="text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <ImpactStories />

      <section className="dark-surface final-cta-band relative overflow-hidden py-16 md:py-20">
        <div aria-hidden="true" className="final-cta-orb pointer-events-none absolute inset-0" />
        <Reveal className="container relative text-center">
          <h2 className="mb-6 text-3xl font-black tracking-tight text-white sm:text-4xl">Start building with us.</h2>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/programs" className="final-cta-btn-primary cta-mobile-btn inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] px-5 text-sm font-semibold">
              Explore Programmes
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <Link to="/payments" className="final-cta-btn-secondary cta-mobile-btn inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] px-5 text-sm font-semibold">
              Enrol Now
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
