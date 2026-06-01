import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Wrench,
  Brain,
  FolderOpen,
  Briefcase,
  Zap,
  Radio,
  Sprout,
  ShieldAlert,
  Monitor,
  Users,
  GraduationCap,
  Search,
  Hammer,
  Layers,
  Presentation,
  CheckCircle,
} from "lucide-react";

import outOfSchoolImg from "../assets/images/programmes/out-of-school-youth.webp";

const learnerGains = [
  {
    Icon: Wrench,
    title: "Technical confidence",
    body: "Learners go from having no prior experience to building and explaining working systems. Confidence comes from doing, not from reading about it.",
  },
  {
    Icon: Brain,
    title: "Practical problem-solving",
    body: "The programme builds the habit of breaking a real problem into parts, testing solutions, and improving based on what actually happens.",
  },
  {
    Icon: FolderOpen,
    title: "Portfolio-ready projects",
    body: "Every learner finishes with a real project they built and can demonstrate. That is a more credible signal than a certificate alone.",
  },
  {
    Icon: Briefcase,
    title: "Work and entrepreneurship readiness",
    body: "Learners develop practical skills that are relevant to employment, freelance work, and starting small technology-adjacent ventures.",
  },
];

const journeyStages = [
  {
    step: "01",
    label: "Orientation",
    heading: "Set the foundation.",
    body: "Understanding tools, safety, the learning mindset, and how to frame real-world problems before picking up a component.",
    Icon: Search,
  },
  {
    step: "02",
    label: "Foundations",
    heading: "Learn the building blocks.",
    body: "Basic electronics, programming logic, digital tools, and system thinking, introduced through hands-on exercises.",
    Icon: Layers,
  },
  {
    step: "03",
    label: "Guided Builds",
    heading: "Build with structure.",
    body: "Step-by-step projects using sensors, boards, code, and simple automation, with increasing responsibility each session.",
    Icon: Hammer,
  },
  {
    step: "04",
    label: "Community Project",
    heading: "Solve a real problem.",
    body: "Learners identify a problem in their community and build a practical solution or working prototype using what they have learned.",
    Icon: Users,
  },
  {
    step: "05",
    label: "Demo and Next Steps",
    heading: "Present. Improve. Move forward.",
    body: "Learners present their work, explain their decisions, improve the build based on feedback, and map out their next steps.",
    Icon: Presentation,
  },
];

const focusAreas = [
  { Icon: Zap, title: "Simple automation systems" },
  { Icon: Radio, title: "Sensor-based monitoring" },
  { Icon: Sprout, title: "Smart agriculture demos" },
  { Icon: ShieldAlert, title: "Safety and alert systems" },
  { Icon: Monitor, title: "Digital productivity tools" },
  { Icon: CheckCircle, title: "Community problem-solving prototypes" },
];

const whoThisIsFor = [
  {
    Icon: GraduationCap,
    title: "School leavers",
    body: "Young people who have completed or left the school system and want a clear, practical path into technology skills.",
  },
  {
    Icon: Search,
    title: "Job seekers",
    body: "Those actively looking for work who want a skill set that is practical, demonstrable, and immediately relevant to the job market.",
  },
  {
    Icon: Hammer,
    title: "Young builders",
    body: "People who are curious about how things work and want to actually build something, not just study theory.",
  },
  {
    Icon: Users,
    title: "Community-focused youth",
    body: "Young people who want to apply practical skills to real problems in their communities and create something that matters.",
  },
];

const infoItems = [
  { label: "Audience", value: "Ages 16 – 30" },
  { label: "Entry level", value: "Zero prerequisites" },
  { label: "Format", value: "Practical training programme" },
  { label: "Duration", value: "3 – 6 months" },
  { label: "Learning style", value: "Hands-on, project-based" },
  { label: "Output", value: "Functional project or prototype" },
];

const heroPrimaryClass =
  "cta-mobile-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90";
const heroSecondaryClass =
  "cta-mobile-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]";
const ctaPrimaryClass =
  "final-cta-btn-primary cta-mobile-btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";
const ctaSecondaryClass =
  "final-cta-btn-secondary cta-mobile-btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";

export default function OutOfSchoolYouth() {
  return (
    <>
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
                Out-of-School Youth Programme
              </p>
              <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
                Practical innovation training for young people ready to build.
              </h1>
              <p className="mb-3 text-base leading-relaxed text-white/72 sm:text-lg">
                ERA AXIS helps young people aged 16–30 gain practical technology
                skills through hands-on training, real tools, and
                community-focused projects.
              </p>
              <p className="mb-8 text-sm text-white/55">
                No prior technical background required. Start where you are and
                grow by building.
              </p>
              <div className="inline-flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/payments/programme-enrolment"
                  state={{
                    programmeSlug: "out-of-school-youth",
                    returnTo: "/programs/out-of-school-youth",
                    returnLabel: "Back to Out-of-School Youth",
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
                  src={outOfSchoolImg}
                  alt="Young people participating in hands-on innovation training"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--color-text-primary)] shadow-sm backdrop-blur-sm">
                    Ages 16 – 30
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
                A practical pathway from interest to real skills.
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                <p>
                  The ERA AXIS Out-of-School Youth Programme is built for young
                  people who are outside the formal school pathway but are ready
                  to learn, build, and contribute. Being out of school does not
                  mean being out of options.
                </p>
                <p>
                  The programme starts from zero. No prior electronics knowledge,
                  no programming background, no equipment needed. Learners arrive
                  with curiosity and leave with practical skills they can
                  demonstrate, apply, and build on.
                </p>
                <p>
                  Over 3 to 6 months, the focus is on building real things.
                  Learners progress from basic concepts to guided projects, and
                  finally to a community-focused build they design and present
                  themselves. The outcome is not just a certificate. It is a
                  project portfolio and the confidence that comes from actually
                  solving a real problem.
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

      {/* ── Learning Journey ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Learning Journey
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Five stages from start to final build.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Each stage builds directly on the one before it. Learners progress
              at a pace designed for real understanding, not speed.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {journeyStages.map(({ step, label, heading, body, Icon }) => (
              <div
                key={step}
                className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-6 shadow-[0_1px_4px_rgb(0_0_0/0.05)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-white shadow-[0_1px_3px_rgb(0_0_0/0.07)]">
                    <Icon size={17} className="text-[var(--color-primary)]" strokeWidth={1.75} />
                  </span>
                  <span className="text-xs font-bold tracking-widest text-[var(--color-text-muted)]">
                    {step}
                  </span>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                    {label}
                  </p>
                  <h3 className="mb-2 text-sm font-bold text-[var(--color-text-primary)]">
                    {heading}
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

      {/* ── Project Focus Areas ──────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Project Focus Areas
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              What learners work on.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Projects are practical and grounded in real contexts. These are the
              types of builds learners work toward during the programme.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map(({ Icon, title }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)] shadow-[0_1px_3px_rgb(0_0_0/0.06)]">
                  <Icon size={18} className="text-[var(--color-primary)]" strokeWidth={1.75} />
                </span>
                <p className="pt-1.5 text-sm font-medium leading-snug text-[var(--color-text-primary)]">
                  {title}
                </p>
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
              Built for young people who are ready to start.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              The only requirement is the readiness to learn by doing.
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

      {/* ── Partner / Sponsor Strip ──────────────────────────────────────── */}
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
                  Partners and Sponsors
                </p>
                <h2 className="mb-3 text-xl font-black tracking-tight text-white sm:text-2xl">
                  Support practical skills for young people.
                </h2>
                <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                  ERA AXIS can work with partners to deliver practical STEM and
                  digital skills training for youth groups, communities, and
                  development programmes.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  to="/partners"
                  className="final-cta-btn-primary inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-5 py-2.5 text-sm font-semibold"
                >
                  Partner With ERA
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
            Ready to start building real skills?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            Talk to ERA AXIS about joining, sponsoring, or partnering on the
            Out-of-School Youth Programme.
          </p>
          <div className="flex justify-center">
            <div className="inline-flex flex-col gap-3 sm:flex-row">
              <Link
                to="/payments/programme-enrolment"
                state={{
                  programmeSlug: "out-of-school-youth",
                  returnTo: "/programs/out-of-school-youth",
                  returnLabel: "Back to Out-of-School Youth",
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
