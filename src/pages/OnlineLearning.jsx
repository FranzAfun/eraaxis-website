import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Wrench,
  FolderOpen,
  Monitor,
  Cpu,
  Brain,
  Zap,
  Layers,
  Eye,
  Cog,
  Target,
  Search,
  Hammer,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Users,
} from "lucide-react";

import onlineLearningImg from "../assets/images/programmes/online-learning.webp";

const learnerGains = [
  {
    Icon: CheckCircle,
    title: "Flexible learning rhythm",
    body: "Sessions and tasks are structured so learners can fit training around work, school hours, or other commitments without losing momentum.",
  },
  {
    Icon: Wrench,
    title: "Practical technical confidence",
    body: "Learners do not just watch content. They work through guided exercises and real builds that develop hands-on competence over time.",
  },
  {
    Icon: FolderOpen,
    title: "Project-based portfolio growth",
    body: "Every track produces practical work learners can show. A collection of real exercises and projects is a stronger signal than a course completion badge.",
  },
  {
    Icon: Monitor,
    title: "Exposure to modern digital tools",
    body: "Learners work with tools that are actively used in technology work, including programming environments, AI platforms, design tools, and simulation software.",
  },
];

const learningTracks = [
  {
    Icon: Cpu,
    title: "Python Programming",
    body: "Write, run, and debug practical Python scripts. Focus on logic, data handling, and automation tasks relevant to real workflows.",
  },
  {
    Icon: Brain,
    title: "Artificial Intelligence Tools",
    body: "Explore how AI tools work and how to use them practically. Covering prompting, automation, and basic AI-powered workflows.",
  },
  {
    Icon: Zap,
    title: "Electronics Foundations",
    body: "Understand circuits, components, and basic electronics through hands-on exercises and guided builds using real hardware.",
  },
  {
    Icon: Layers,
    title: "PCB Design",
    body: "Learn to design printed circuit boards using standard design software. From schematic to layout, guided step by step.",
  },
  {
    Icon: Eye,
    title: "Simulation Tools",
    body: "Use simulation environments to model circuits, systems, and electronic behaviour before committing to physical builds.",
  },
  {
    Icon: Cog,
    title: "Automation Basics",
    body: "Build simple automation workflows using digital tools, scripts, and basic control systems applied to practical tasks.",
  },
];

const howItWorks = [
  {
    Icon: Target,
    step: "01",
    heading: "Choose a focus area",
    body: "Learners start with a pathway based on their current level and what they want to be able to do at the end.",
  },
  {
    Icon: Search,
    step: "02",
    heading: "Follow guided lessons",
    body: "Lessons are structured so learners understand the concept and practise immediately, not just watch and move on.",
  },
  {
    Icon: Hammer,
    step: "03",
    heading: "Build exercises and projects",
    body: "Learners complete practical builds, code tasks, simulations, or designs that produce something real and testable.",
  },
  {
    Icon: TrendingUp,
    step: "04",
    heading: "Review and improve",
    body: "Learners revisit their work, refine their builds, and grow toward stronger project outcomes over time.",
  },
];

const whoThisIsFor = [
  {
    Icon: GraduationCap,
    title: "Students who want more practical skills",
    body: "Students in school or at university who want to supplement their formal learning with practical digital and technical skills.",
  },
  {
    Icon: Briefcase,
    title: "Graduates improving their portfolio",
    body: "Recent graduates who want to demonstrate practical ability beyond their degree and strengthen their job prospects.",
  },
  {
    Icon: Monitor,
    title: "Young professionals learning digital tools",
    body: "Working adults who want to expand their technical skills in programming, AI, electronics, or digital tools around their schedule.",
  },
  {
    Icon: Users,
    title: "Curious self-paced learners",
    body: "Anyone driven by curiosity who wants to learn real technology skills through guided, structured practice rather than passive watching.",
  },
];

const infoItems = [
  { label: "Audience", value: "Remote & self-paced learners" },
  { label: "Format", value: "Online guided learning" },
  { label: "Focus", value: "Programming, AI, electronics, PCB design, simulation, automation" },
  { label: "Learning style", value: "Practical, project-based" },
  { label: "Output", value: "Portfolio-ready projects and working exercises" },
];

const heroPrimaryClass = "btn-primary min-h-[44px] justify-center";
const heroSecondaryClass = "btn-outline min-h-[44px] justify-center";
const ctaPrimaryClass =
  "final-cta-btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";
const ctaSecondaryClass =
  "final-cta-btn-secondary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";

export default function OnlineLearning() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-24">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-14">

            {/* Left: text */}
            <div className="flex flex-col justify-center">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                Online Learning Programme
              </p>
              <h1 className="mb-5 text-4xl font-black leading-[1.1] tracking-tight text-[var(--color-text-primary)] sm:text-5xl md:text-[3.25rem]">
                Flexible technology learning you can build around your life.
              </h1>
              <p className="mb-3 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                ERA AXIS online learning helps learners develop practical skills
                in programming, AI, electronics, PCB design, simulation tools,
                and automation through guided, project-based training.
              </p>
              <p className="mb-8 text-sm text-[var(--color-text-muted)]">
                Learn remotely, practise consistently, and build projects that
                show what you can do.
              </p>
              <div className="inline-flex flex-col gap-3 sm:flex-row">
                <Link to="/contact" className={heroPrimaryClass}>
                  Start / Enquire
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
                <Link to="/programs" className={heroSecondaryClass}>
                  View All Programmes
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
              </div>
            </div>

            {/* Right: image card — tablet and up only */}
            <div className="hidden md:flex">
              <div className="relative min-h-[320px] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] shadow-[var(--shadow-soft)]">
                <img
                  src={onlineLearningImg}
                  alt="Learner studying an online technology course"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--color-text-primary)] shadow-sm backdrop-blur-sm">
                    Remote &amp; self-paced learners
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Programme Overview ───────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">

            {/* Left */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                About the Programme
              </p>
              <h2 className="mb-5 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                Online learning designed for practical builders.
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                <p>
                  The ERA AXIS Online Learning Programme is for learners who
                  need flexibility but still want serious hands-on technology
                  training. Not passive video content. Not slides and quizzes.
                  Guided practice, real tools, and builds that produce something
                  you can demonstrate.
                </p>
                <p>
                  Each track is structured so learners progress through concepts
                  and immediately apply them. Lessons lead directly into
                  exercises, and exercises lead into practical projects. The
                  focus is always on building competence, not just completing
                  content.
                </p>
                <p>
                  Learners work through programming, AI tools, electronics,
                  PCB design, simulation software, and automation. The
                  programme is designed for people who are serious about
                  developing real technical ability and want a portfolio of
                  work to show for it.
                </p>
              </div>
            </div>

            {/* Right: info card */}
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-7 lg:sticky lg:top-8">
              <p className="mb-5 text-sm font-bold text-[var(--color-text-primary)]">
                Programme at a Glance
              </p>
              <dl className="space-y-4">
                {infoItems.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-0.5 border-b border-[var(--color-border)] pb-4 last:border-0 last:pb-0"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                      {label}
                    </dt>
                    <dd className="text-sm font-medium text-[var(--color-text-primary)]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

          </div>
        </div>
      </section>

      {/* ── What Learners Gain ───────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Learner Outcomes
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              What learners gain from this programme.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              These are practical outcomes built through doing, not claims made
              before the work has happened.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {learnerGains.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-[0_1px_4px_rgb(0_0_0/0.05)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)]">
                  <Icon size={18} className="text-[var(--color-primary)]" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="mb-2 text-base font-bold text-[var(--color-text-primary)]">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Learning Tracks ──────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Learning Tracks
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Six tracks built around practical technology skills.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Each track is structured around real tools and guided practice.
              Learners pick the track that fits their goals and level.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {learningTracks.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-6 shadow-[0_1px_4px_rgb(0_0_0/0.05)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-white shadow-[0_1px_3px_rgb(0_0_0/0.07)]">
                  <Icon size={18} className="text-[var(--color-primary)]" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="mb-2 text-base font-bold text-[var(--color-text-primary)]">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How Online Learning Works ────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              How It Works
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Four steps from start to finished project.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Every track follows the same approach: understand, practise,
              build, and improve.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {howItWorks.map(({ Icon, step, heading, body }) => (
              <div
                key={step}
                className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-[0_1px_4px_rgb(0_0_0/0.05)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)]">
                    <Icon size={20} className="text-[var(--color-primary)]" strokeWidth={1.75} />
                  </span>
                  <span className="text-xs font-bold tracking-widest text-[var(--color-text-muted)]">
                    {step}
                  </span>
                </div>
                <div>
                  <h3 className="mb-2 text-base font-bold text-[var(--color-text-primary)]">
                    {heading}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who This Is For ──────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Who This Is For
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              For learners who are serious about building real skills.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              The programme suits anyone who wants structured guidance and
              practical output from their learning time.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {whoThisIsFor.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-white shadow-[0_1px_3px_rgb(0_0_0/0.07)]">
                  <Icon size={18} className="text-[var(--color-primary)]" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="mb-2 text-base font-bold text-[var(--color-text-primary)]">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Practical Support Strip ──────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-12 md:py-14">
        <div className="container">
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-primary-deep)] px-8 py-10 md:px-12 md:py-11">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 55% 75% at 90% 50%, color-mix(in srgb, var(--color-accent) 12%, transparent) 0%, transparent 65%)",
              }}
            />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                  Learning Support
                </p>
                <h2 className="mb-3 text-xl font-black tracking-tight text-white sm:text-2xl">
                  Online does not mean learning alone.
                </h2>
                <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                  ERA AXIS keeps online learning practical through guided tasks,
                  practical projects, and learning support focused on helping
                  learners build real competence, not just complete content.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  to="/contact"
                  className="final-cta-btn-primary inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-5 py-2.5 text-sm font-semibold"
                >
                  Contact ERA
                  <ArrowRight size={15} strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="final-cta-band relative overflow-hidden py-14 md:py-16">
        <div aria-hidden="true" className="final-cta-orb pointer-events-none absolute inset-0" />
        <div className="container relative text-center">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Ready to learn technology by building?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            Talk to ERA AXIS about joining the Online Learning Programme or
            choosing the right pathway for your goals.
          </p>
          <div className="flex justify-center">
            <div className="inline-flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className={ctaPrimaryClass}>
                Contact ERA
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
              <Link to="/programs" className={ctaSecondaryClass}>
                View All Programmes
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
