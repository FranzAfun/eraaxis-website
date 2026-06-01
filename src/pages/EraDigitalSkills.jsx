import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  FolderOpen,
  TrendingUp,
  Zap,
  Monitor,
  Cog,
  Lightbulb,
  Eye,
  Target,
  Briefcase,
  Users,
  GraduationCap,
  Trophy,
} from "lucide-react";

import eraDigitalImg from "../assets/images/programmes/era-digital-skill.webp";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";

const learnerGains = [
  {
    Icon: Brain,
    title: "Practical AI confidence",
    body: "Learners develop the ability to use AI tools purposefully for real tasks — writing, research, planning, and problem-solving — without overstating what AI does or does not do.",
  },
  {
    Icon: FolderOpen,
    title: "Better digital organisation",
    body: "Learners build habits and systems for managing files, communications, documents, and workflows in a way that reduces friction and saves real time.",
  },
  {
    Icon: TrendingUp,
    title: "Spreadsheet and reporting skills",
    body: "Learners move from basic data entry to building structured reports, dashboards, and simple analytical tools useful in their own work context.",
  },
  {
    Icon: Zap,
    title: "Automation mindset",
    body: "Learners learn to identify repetitive tasks and connect tools to reduce manual work — not through code, but through workflow thinking and practical automation tools.",
  },
];

const programmeMonths = [
  {
    Icon: Monitor,
    month: "Month 1",
    title: "Computer Confidence & Digital Foundations",
    focus: [
      "Google Workspace tools",
      "Excel fundamentals",
      "File and folder organisation",
      "Digital admin and communication",
      "Online payments and transactions",
      "Practical digital workflows",
    ],
  },
  {
    Icon: Brain,
    month: "Month 2",
    title: "AI Tools for Work and Business",
    focus: [
      "AI writing and research assistants",
      "Using AI for planning and content",
      "Canva AI for design",
      "Notion AI for organisation",
      "Responsible and critical AI use",
      "Data support and summarisation",
    ],
  },
  {
    Icon: Cog,
    month: "Month 3",
    title: "Automation & Your Business System",
    focus: [
      "Automation workflow tools",
      "Connecting apps and reducing manual steps",
      "Dashboards and simple reporting pipelines",
      "Building a system for your own work",
      "Capstone project in learner's own context",
    ],
  },
];

const practicalTools = [
  {
    Icon: Lightbulb,
    title: "AI writing and research tools",
    body: "Tools that help learners draft, edit, research, and plan more efficiently using AI assistance in everyday work.",
  },
  {
    Icon: TrendingUp,
    title: "Spreadsheets and reporting",
    body: "Excel and Google Sheets for building structured data, formulas, summaries, and simple reporting views.",
  },
  {
    Icon: Monitor,
    title: "Digital workspace tools",
    body: "Google Workspace, Notion, and similar platforms for managing documents, tasks, and team communication.",
  },
  {
    Icon: Eye,
    title: "Design and content tools",
    body: "Canva and related tools for producing professional-looking documents, presentations, and social content without design training.",
  },
  {
    Icon: Zap,
    title: "Automation workflows",
    body: "No-code tools that connect apps and automate repetitive tasks, reducing manual effort across common business processes.",
  },
  {
    Icon: Target,
    title: "Dashboards and simple systems",
    body: "Building lightweight dashboards and linked systems that give a clearer picture of work, business data, or team activity.",
  },
];

const whoThisIsFor = [
  {
    Icon: Briefcase,
    title: "Business owners",
    body: "Small business and micro-enterprise owners who want to use digital tools to organise, automate, and improve how their business operates day to day.",
  },
  {
    Icon: Users,
    title: "Working professionals",
    body: "Employees and mid-career professionals who want to work more efficiently, use AI tools responsibly, and build practical digital skills relevant to their field.",
  },
  {
    Icon: GraduationCap,
    title: "Graduates entering work",
    body: "Recent graduates who want to arrive in the workplace with strong digital confidence, practical AI skills, and the ability to use modern productivity tools.",
  },
  {
    Icon: Trophy,
    title: "Teams improving productivity",
    body: "Teams and departments that want to reduce manual processes, standardise digital workflows, and build shared systems for better day-to-day output.",
  },
];

const infoItems = [
  { label: "Audience", value: "Working adults, professionals, business owners" },
  { label: "Format", value: "Online practical programme" },
  { label: "Duration", value: "3 months" },
  { label: "Price", value: "GHS 700 / month" },
  { label: "Pay in full", value: "GHS 2,100" },
  { label: "Focus", value: "AI tools, Excel, digital productivity, automation" },
  { label: "Output", value: "Work-context digital system or capstone" },
];

const heroPrimaryClass =
  "cta-mobile-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90";
const heroSecondaryClass =
  "cta-mobile-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]";
const ctaPrimaryClass =
  "final-cta-btn-primary cta-mobile-btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";
const ctaSecondaryClass =
  "final-cta-btn-secondary cta-mobile-btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";

export default function EraDigitalSkills() {
  return (
    <>
      <SEO {...getPageSeo("/programs/era-digital-skills")} />
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-16 pt-36 text-white md:pb-24 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 18%, color-mix(in srgb, var(--color-accent) 24%, transparent) 0%, transparent 30%), radial-gradient(circle at 84% 8%, color-mix(in srgb, var(--color-primary) 38%, transparent) 0%, transparent 34%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-28 top-28 h-80 w-80 rounded-full bg-white/[0.05] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-4 h-96 w-96 rounded-full bg-[var(--color-accent)]/10 blur-3xl"
        />
        <div className="container relative z-10">
          <Link
            to="/programs"
            className="mb-8 flex w-fit items-center gap-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/70"
          >
            <ArrowLeft size={12} strokeWidth={2.5} aria-hidden="true" />
            Back to programmes
          </Link>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-14">

            {/* Left: text */}
            <div className="flex flex-col justify-center">
              <p className="mb-5 inline-flex w-fit self-start rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
                ERA Digital Skills
              </p>
              <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
                Practical AI and digital productivity skills for work.
              </h1>
              <p className="mb-3 text-base leading-relaxed text-white/72 sm:text-lg">
                ERA Digital Skills helps working adults, business owners, and
                professionals use AI tools, spreadsheets, automation, and
                digital systems to work smarter and build practical solutions
                for their own context.
              </p>
              <p className="mb-8 text-sm text-white/55">
                A 3-month online programme built around real tasks, useful
                tools, and practical work outcomes.
              </p>
              <div className="inline-flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/payments/programme-enrolment"
                  state={{
                    programmeSlug: "era-digital-skills",
                    returnTo: "/programs/era-digital-skills",
                    returnLabel: "Back to ERA Digital Skills",
                  }}
                  className={heroPrimaryClass}
                >
                  Start Enrolment
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
                <Link to="/contact#enquiry" className={heroSecondaryClass}>
                  Inquire about the programme
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
              </div>
            </div>

            {/* Right: image card — tablet and up only */}
            <div className="hidden md:flex">
              <div className="relative min-h-[320px] w-full overflow-hidden rounded-[var(--radius-lg)] border border-white/10 shadow-2xl shadow-black/20">
                <img
                  src={eraDigitalImg}
                  alt="Professional using digital productivity and AI tools"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--color-text-primary)] shadow-sm backdrop-blur-sm">
                    Working adults &amp; professionals
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
                Digital skills for people already doing real work.
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                <p>
                  ERA Digital Skills is built for people who already have
                  responsibilities, not for those starting from scratch. The
                  programme is designed around the reality that most
                  professionals are time-poor and need skills they can apply
                  immediately, not theory they have to figure out how to use
                  later.
                </p>
                <p>
                  Over three months, learners build practical digital confidence
                  across three areas: foundational productivity tools, AI
                  assistants for work and business tasks, and automation
                  workflows that reduce manual effort. Everything is tied to
                  real work contexts. Learners bring their own job, business,
                  or professional situation into the exercises.
                </p>
                <p>
                  The programme closes with a capstone project where learners
                  build or document a practical digital system, workflow, or
                  automated process relevant to their own work. The outcome is
                  something they can actually use, not a demonstration exercise.
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
              These are practical outcomes earned through real work, not
              promises made before the programme starts.
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

      {/* ── Programme Structure ──────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Programme Structure
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Three months. Three focused areas.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Each month builds on the last. Learners move from digital
              foundations into AI tools, then into automation and their own
              work system.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programmeMonths.map(({ Icon, month, title, focus }) => (
              <div
                key={month}
                className="flex flex-col gap-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-6 shadow-[0_1px_4px_rgb(0_0_0/0.05)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-white shadow-[0_1px_3px_rgb(0_0_0/0.07)]">
                    <Icon size={18} className="text-[var(--color-primary)]" strokeWidth={1.75} />
                  </span>
                  <span className="text-xs font-bold tracking-widest text-[var(--color-text-muted)]">
                    {month}
                  </span>
                </div>
                <div>
                  <h3 className="mb-4 text-base font-bold text-[var(--color-text-primary)]">
                    {title}
                  </h3>
                  <ul className="space-y-2">
                    {focus.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs leading-relaxed text-[var(--color-text-secondary)]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-light)]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Practical Tools ──────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Tool Categories
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Categories of tools learners work with.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              The programme uses current, practical tools from each category.
              The focus is on being able to use them effectively, not on tool
              familiarity for its own sake.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {practicalTools.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-[0_1px_4px_rgb(0_0_0/0.05)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)]">
                  <Icon size={18} className="text-[var(--color-primary)]" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="mb-2 text-sm font-bold text-[var(--color-text-primary)]">
                    {title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
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
              Built for people with real work to do.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              The programme is most useful for learners who can immediately
              apply what they learn to an existing job, business, or role.
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

      {/* ── Work Outcome Strip ───────────────────────────────────────────── */}
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
                  Capstone Project
                </p>
                <h2 className="mb-3 text-xl font-black tracking-tight text-white sm:text-2xl">
                  Build a system for your own work.
                </h2>
                <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                  Learners do not just watch tool demos. They work toward a
                  practical digital workflow, dashboard, automation, or content
                  system connected to their own job, business, or professional
                  goals.
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
            Ready to upgrade how you work?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            Talk to ERA AXIS about joining ERA Digital Skills or enrolling
            your team in practical AI and digital productivity training.
          </p>
          <div className="flex justify-center">
            <div className="inline-flex flex-col gap-3 sm:flex-row">
              <Link
                to="/payments/programme-enrolment"
                state={{
                  programmeSlug: "era-digital-skills",
                  returnTo: "/programs/era-digital-skills",
                  returnLabel: "Back to ERA Digital Skills",
                }}
                className={ctaPrimaryClass}
              >
                Start Enrolment
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
              <Link to="/contact#enquiry" className={ctaSecondaryClass}>
                Ask a Question
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
