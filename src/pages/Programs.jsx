import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown, Hammer, Cpu, FolderOpen, TrendingUp } from "lucide-react";

import schoolStemImg from "../assets/images/programmes/school-stem-programs.webp";
import outOfSchoolImg from "../assets/images/programmes/out-of-school-youth.webp";
import onlineLearningImg from "../assets/images/programmes/online-learning.webp";
import eraDigitalImg from "../assets/images/programmes/era-digital-skill.webp";

const programmes = [
  {
    image: schoolStemImg,
    imageAlt: "Students engaged in a school STEM class",
    audience: "Basic 1 – SHS 3",
    title: "School STEM Programmes",
    body: "Hands-on STEM education for Basic to SHS learners, aligned with classroom learning and built around practical projects.",
    cta: "Explore School STEM",
    to: "/programs/school-stem",
  },
  {
    image: outOfSchoolImg,
    imageAlt: "Youth participating in innovation training",
    audience: "Ages 16 – 30",
    title: "Out-of-School Youth",
    body: "Practical innovation training for young people ready to gain employable skills and build community-focused solutions.",
    cta: "Explore Youth Programme",
    to: "/programs/out-of-school-youth",
  },
  {
    image: onlineLearningImg,
    imageAlt: "Learner studying an online programming course",
    audience: "Remote & self-paced learners",
    title: "Online Learning",
    body: "Flexible online training in programming, AI, electronics, PCB design, and digital technology tools.",
    cta: "Explore Online Learning",
    to: "/programs/online-learning",
  },
  {
    image: eraDigitalImg,
    imageAlt: "Professional using digital productivity tools",
    audience: "Working adults & professionals",
    title: "ERA Digital Skills",
    body: "A practical digital productivity and AI tools programme for workers, professionals, and business owners.",
    cta: "Explore Digital Skills",
    to: "/programs/era-digital-skills",
  },
];

const learningSteps = [
  {
    Icon: Hammer,
    step: "01",
    title: "Learn by Building",
    body: "Every lesson centres on a hands-on challenge — circuits, code, or a creative prototype learners build themselves.",
  },
  {
    Icon: Cpu,
    step: "02",
    title: "Work with Real Tools",
    body: "Learners use the same tools professionals rely on — microcontrollers, AI platforms, and design software.",
  },
  {
    Icon: FolderOpen,
    step: "03",
    title: "Build Practical Projects",
    body: "Projects are designed around real problems. Learners leave with work they can show, share, and build on.",
  },
  {
    Icon: TrendingUp,
    step: "04",
    title: "Progress through Outcomes",
    body: "Each pathway delivers measurable, portfolio-ready outcomes aligned with where learners want to go next.",
  },
];

function ProgrammeCard({ image, imageAlt, audience, title, body, cta, to }) {
  return (
    <Link
      to={to}
      className="card-interactive group flex flex-col overflow-hidden"
    >
      <div className="h-48 shrink-0 overflow-hidden">
        <img
          src={image}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-light)]">
          {audience}
        </p>
        <h3 className="mb-3 text-base font-bold leading-snug text-[var(--color-text-primary)]">
          {title}
        </h3>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {body}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] transition-gap duration-200 group-hover:gap-3">
          {cta}
          <ArrowRight size={15} strokeWidth={2.2} />
        </span>
      </div>
    </Link>
  );
}

function LearningStep({ Icon, step, title, body }) {
  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-[0_1px_4px_rgb(0_0_0/0.05)]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)]">
          <Icon size={20} className="text-[var(--color-primary)]" strokeWidth={1.75} />
        </span>
        <span className="text-xs font-bold tracking-widest text-[var(--color-text-muted)]">
          {step}
        </span>
      </div>
      <div>
        <h3 className="mb-2 text-base font-bold text-[var(--color-text-primary)]">{title}</h3>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{body}</p>
      </div>
    </div>
  );
}

export default function Programs() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-14 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 16%, transparent) 0%, transparent 70%)",
          }}
        />
        <div className="container relative">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Programmes
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.1] tracking-tight text-[var(--color-text-primary)] sm:text-5xl md:text-[3.25rem]">
              Learning pathways for every stage of growth.
            </h1>
            <p className="mb-8 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
              From school-based STEM learning to digital skills for working
              adults, ERA AXIS provides practical programmes that help learners
              build real solutions.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#pathways" className="btn-primary">
                Explore pathways
                <ArrowDown size={16} strokeWidth={2} />
              </a>
              <Link to="/partners" className="btn-outline">
                Partner with ERA
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programme Cards ───────────────────────────────────────────────── */}
      <section id="pathways" className="bg-[var(--color-surface-soft)] py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Pathways
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Choose your learning pathway.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Every ERA AXIS programme is built around practical skills, real
              tools, and outcomes that matter.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {programmes.map((prog) => (
              <ProgrammeCard key={prog.to} {...prog} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How Learning Works ───────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Our Method
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              How learning works at ERA AXIS.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Every programme follows the same core method: build something, use
              real tools, solve a real problem, and see the result.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {learningSteps.map((item) => (
              <LearningStep key={item.step} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ─────────────────────────────────────────────────────── */}
      <section className="final-cta-band relative overflow-hidden py-16 md:py-20">
        <div aria-hidden="true" className="final-cta-orb pointer-events-none absolute inset-0" />
        <div className="container relative text-center">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Not sure which pathway fits?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            Talk to ERA AXIS and we'll help you choose the right programme for
            your school, team, career, or learning goals.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="final-cta-btn-primary inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-5 py-2.5 text-sm font-semibold"
            >
              Contact ERA
              <ArrowRight size={15} strokeWidth={2.2} />
            </Link>
            <Link
              to="/partners"
              className="final-cta-btn-secondary inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-5 py-2.5 text-sm font-semibold"
            >
              Partner With ERA
              <ArrowRight size={15} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
