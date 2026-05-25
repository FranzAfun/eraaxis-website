import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Bell,
  Droplets,
  Lightbulb,
  Cog,
  Cpu,
  Target,
  Eye,
  Trophy,
  TrendingUp,
  Search,
  Hammer,
  Layers,
  Rocket,
} from "lucide-react";

import schoolStemImg from "../assets/images/programmes/school-stem-programs.webp";

const progressionStages = [
  {
    step: "01",
    label: "Discover",
    heading: "Curiosity first.",
    body: "Younger learners explore basic circuits, simple switches, and cause-and-effect through safe, supervised experiments.",
    audience: "Basic 1 – Basic 3",
    Icon: Search,
  },
  {
    step: "02",
    label: "Build",
    heading: "Start making things.",
    body: "Learners work with components, sensors, and guided project briefs to assemble and test their first working systems.",
    audience: "Basic 4 – JHS 1",
    Icon: Hammer,
  },
  {
    step: "03",
    label: "Connect",
    heading: "Understand the system.",
    body: "Students move into automation, data, and microcontroller programming, connecting physical and digital systems to solve problems.",
    audience: "JHS 2 – SHS 1",
    Icon: Layers,
  },
  {
    step: "04",
    label: "Create",
    heading: "Build real solutions.",
    body: "SHS learners design, build, and present functional prototypes that address real problems and integrate multiple technologies.",
    audience: "SHS 2 – SHS 3",
    Icon: Rocket,
  },
];

const buildExamples = [
  { Icon: Zap, title: "Simple circuits and lighting systems" },
  { Icon: Bell, title: "Sensor-based alarms" },
  { Icon: Droplets, title: "Automated watering demos" },
  { Icon: Lightbulb, title: "Smart classroom prototypes" },
  { Icon: Cog, title: "Basic robotics and motion projects" },
  { Icon: Cpu, title: "Custom control systems using the ERA Dev Board" },
];

const schoolReasons = [
  {
    Icon: Target,
    title: "Fits into school learning goals",
    body: "The programme is structured to work alongside existing curricula, not replace it. Lessons are designed to reinforce concepts learners already encounter in science, maths, and ICT.",
  },
  {
    Icon: Eye,
    title: "Makes STEM visible and practical",
    body: "When learners build something that works, STEM stops being abstract. Schools that run this programme see learners engaging with technology rather than just reading about it.",
  },
  {
    Icon: Trophy,
    title: "Builds confidence through projects",
    body: "Completing a working project they built themselves changes how learners see their own capability. That confidence carries into other subjects and future decisions.",
  },
  {
    Icon: TrendingUp,
    title: "Supports a long-term innovation culture",
    body: "ERA AXIS is designed to grow with the school. Each year level builds on the last, creating a culture where practical thinking and problem-solving become part of how learners work.",
  },
];

const infoItems = [
  { label: "Audience", value: "Basic 1 – SHS 3" },
  { label: "Format", value: "School-based practical sessions" },
  { label: "Core tool", value: "ERA Dev Board" },
  { label: "Learning style", value: "Hands-on, project-based" },
  { label: "Focus areas", value: "Electronics, coding, sensors, automation" },
];

const heroPrimaryClass =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90";
const heroSecondaryClass =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]";
const ctaPrimaryClass =
  "final-cta-btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";
const ctaSecondaryClass =
  "final-cta-btn-secondary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";

export default function SchoolStem() {
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
          <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-14">

            {/* Left: text */}
            <div className="flex flex-col justify-center">
              <p className="mb-5 inline-flex w-fit self-start rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
                School STEM Programmes
              </p>
              <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
                Hands-on STEM learning from Basic&nbsp;1 to SHS&nbsp;3.
              </h1>
              <p className="mb-3 text-base leading-relaxed text-white/72 sm:text-lg">
                ERA AXIS helps schools bring practical STEM into the classroom
                through structured lessons, real tools, and project-based learning
                built around electronics, coding, sensors, automation, and the ERA
                Dev Board.
              </p>
              <p className="mb-8 text-sm text-white/55">
                Built for schools that want learners to understand technology by
                building it.
              </p>
              <div className="inline-flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/payments/programme-enrolment"
                  className={heroPrimaryClass}
                >
                  Start Learner Enrolment
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
                <Link to="/contact#enquiry" className={heroSecondaryClass}>
                  Discuss School Partnership
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
              </div>
            </div>

            {/* Right: image card — tablet and up only */}
            <div className="hidden md:flex">
              <div className="relative min-h-[320px] w-full overflow-hidden rounded-[var(--radius-lg)] border border-white/10 shadow-2xl shadow-black/20">
                <img
                  src={schoolStemImg}
                  alt="Students engaged in a hands-on school STEM class"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--color-text-primary)] shadow-sm backdrop-blur-sm">
                    Basic 1 – SHS 3
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
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
            {/* Left */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                About the Programme
              </p>
              <h2 className="mb-5 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                A practical STEM pathway for the whole school journey.
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                <p>
                  The ERA AXIS School STEM Programme is built to grow with
                  learners. It does not start at one level and stop. It covers
                  13 year levels, from Basic 1 through SHS 3, with each stage
                  designed to build meaningfully on the one before it.
                </p>
                <p>
                  Younger learners start with discovery: safe experiments,
                  simple observations, and the joy of making something respond
                  to their actions. As they progress, they move into
                  building: working with sensors, programming, and guided
                  projects that produce real results.
                </p>
                <p>
                  By SHS, learners are designing and presenting functional
                  systems. They are not just learning about STEM. They are
                  doing it, with the tools and frameworks used in real
                  technology work.
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

      {/* ── Learning Progression ─────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Learning Progression
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Four stages. One connected journey.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Every stage is intentional. Learners enter where they are and
              progress at a pace that builds genuine understanding.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {progressionStages.map(({ step, label, heading, body, audience, Icon }) => (
              <div
                key={step}
                className="flex flex-col gap-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-[0_1px_4px_rgb(0_0_0/0.05)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)]">
                    <Icon
                      size={18}
                      className="text-[var(--color-primary)]"
                      strokeWidth={1.75}
                    />
                  </span>
                  <span className="text-xs font-bold tracking-widest text-[var(--color-text-muted)]">
                    {step}
                  </span>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                    {label}
                  </p>
                  <h3 className="mb-2 text-base font-bold text-[var(--color-text-primary)]">
                    {heading}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {body}
                  </p>
                </div>
                <p className="mt-auto pt-2 text-xs font-medium text-[var(--color-text-muted)] border-t border-[var(--color-border-soft)]">
                  {audience}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Learners Build ──────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Project Examples
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              What learners actually build.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Projects are practical, hands-on, and designed to produce
              something real. No simulations, no diagrams.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {buildExamples.map(({ Icon, title }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-white shadow-[0_1px_3px_rgb(0_0_0/0.08)]">
                  <Icon
                    size={18}
                    className="text-[var(--color-primary)]"
                    strokeWidth={1.75}
                  />
                </span>
                <p className="pt-1.5 text-sm font-medium leading-snug text-[var(--color-text-primary)]">
                  {title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Schools Choose It ────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              For School Leaders
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Why schools choose this programme.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              For headteachers, school owners, and education leaders evaluating
              what this programme brings to their institution.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {schoolReasons.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-[0_1px_4px_rgb(0_0_0/0.05)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)]">
                  <Icon
                    size={18}
                    className="text-[var(--color-primary)]"
                    strokeWidth={1.75}
                  />
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

      {/* ── ERA Dev Board Strip ──────────────────────────────────────────── */}
      <section className="bg-white py-12 md:py-14">
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
                  ERA Dev Board
                </p>
                <h2 className="mb-3 text-xl font-black tracking-tight text-white sm:text-2xl">
                  Powered by the ERA Dev Board.
                </h2>
                <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                  The ERA Dev Board gives learners a real platform for exploring
                  circuits, sensors, programming, and automation. They do not need
                  to wait until university to touch practical technology.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  to="/dev-board"
                  className="final-cta-btn-primary inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-5 py-2.5 text-sm font-semibold"
                >
                  Explore ERA Dev Board
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
            Bring practical STEM into your school.
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            Partner with ERA AXIS to introduce structured, hands-on STEM
            learning for learners from Basic 1 to SHS 3.
          </p>
          <div className="flex justify-center">
            <div className="inline-flex flex-col gap-3 sm:flex-row">
              <Link
                to="/payments/programme-enrolment"
                className={ctaPrimaryClass}
              >
                Start Learner Enrolment
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
              <Link to="/contact#enquiry" className={ctaSecondaryClass}>
                Discuss School Partnership
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
