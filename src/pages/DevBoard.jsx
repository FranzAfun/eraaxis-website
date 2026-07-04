import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Lightbulb,
  CircleAlert,
  Layers,
  Grid2x2,
  Search,
  Eye,
  Link2,
  Hammer,
  TrendingUp,
  ClipboardList,
  BookOpen,
  Wifi,
  Wrench,
  Cpu,
  Bot,
  BatteryMedium,
  ShieldCheck,
  ToggleRight,
} from "lucide-react";

import devBoardFrontImg from "../assets/images/dev-board/dev-board-front.webp";
import devBoardBackBlueImg from "../assets/images/dev-board/dev-board-back-blue.webp";
import devBoardBackPurpleImg from "../assets/images/dev-board/dev-board-back-purple.webp";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";

const infoItems = [
  { label: "Full name", value: "ERA Kids Development Board" },
  { label: "Common name", value: "ERA Dev Board" },
  { label: "Type", value: "Electronics learning kit" },
  { label: "Power", value: "4 × AA batteries (6 V)" },
  { label: "Used for", value: "Hands-on STEM education and practical projects" },
  { label: "Learning areas", value: "Circuits, LEDs, resistors, buzzers, polarity, breadboard prototyping" },
  { label: "Approach", value: "Learn, connect, build, test, improve" },
];

const teachingBlocks = [
  {
    number: "01",
    title: "Power Block",
    body: "Houses the battery holder, a reverse-polarity protection diode, an ON/OFF switch, and a power indicator LED with resistor. Learners see how a safe, switched power supply is built before connecting anything else.",
    icons: [BatteryMedium, ShieldCheck, ToggleRight, Lightbulb],
    iconLabels: ["Battery holder", "Polarity protection", "ON/OFF switch", "Power indicator"],
  },
  {
    number: "02",
    title: "LED and Buzzer Block",
    body: "Introduces learners to output components. They connect LEDs and buzzers directly, understand polarity, observe how each component responds to current, and learn why resistors are needed to protect LEDs.",
    icons: [Lightbulb, Zap],
    iconLabels: ["LED output", "Buzzer output"],
  },
  {
    number: "03",
    title: "Series LED Block",
    body: "Learners wire LEDs in series, observe how voltage distributes across components, and see what happens when one LED is removed from a series chain. A direct, physical demonstration of series circuit behaviour.",
    icons: [Layers],
    iconLabels: ["Series wiring"],
  },
  {
    number: "04",
    title: "Parallel LED Block",
    body: "Learners wire LEDs in parallel and compare results with the series block. They observe that parallel LEDs stay lit when one is removed, building intuition for how household lighting and real systems work.",
    icons: [Grid2x2],
    iconLabels: ["Parallel wiring"],
  },
  {
    number: "05",
    title: "Practice Area",
    body: "A mini breadboard-style area where learners build their own circuits freely. Supports LED and resistor combos, switch circuits, buzzer circuits, and early creative sensor ideas, giving learners space to experiment beyond guided steps.",
    icons: [Hammer, Search],
    iconLabels: ["Free build", "Testing and debugging"],
  },
];

const exploreCards = [
  {
    Icon: Zap,
    title: "LEDs and resistors",
    body: "Learners connect LEDs with the correct resistors, understand why resistors are needed, and observe how current limiting works in a real circuit.",
  },
  {
    Icon: CircleAlert,
    title: "Polarity and safe connections",
    body: "The board teaches learners to read component polarity, connect correctly, and understand what reverse polarity means and why protection matters.",
  },
  {
    Icon: Lightbulb,
    title: "Buzzers and outputs",
    body: "Working with buzzers alongside LEDs, learners observe different types of output and how each component behaves when powered.",
  },
  {
    Icon: Layers,
    title: "Series and parallel circuits",
    body: "Dedicated blocks let learners directly compare series and parallel wiring, seeing the difference in behaviour through their own hands-on builds.",
  },
  {
    Icon: Grid2x2,
    title: "Breadboard prototyping",
    body: "The practice area introduces breadboard-style circuit building, where learners can create, test, and modify circuits without permanent connections.",
  },
  {
    Icon: Search,
    title: "Problem-solving and testing",
    body: "Learners trace faults, test connections, and reason through why a circuit is not behaving as expected, building practical debugging habits.",
  },
];

const progressionStages = [
  {
    step: "A",
    label: "Discover",
    heading: "Observe inputs, outputs, and cause-and-effect.",
    body: "Learners power the board, observe the indicator LED, and interact with simple circuits. The focus is curiosity: seeing what happens when components are connected correctly or incorrectly.",
    Icon: Eye,
  },
  {
    step: "B",
    label: "Connect",
    heading: "Wire components and understand polarity.",
    body: "Learners follow guided connections on the LED, buzzer, and circuit blocks. They learn to read polarity, trace a circuit path, and understand what each component does in the chain.",
    Icon: Link2,
  },
  {
    step: "C",
    label: "Compare",
    heading: "See the difference between series and parallel.",
    body: "Working across the series and parallel blocks, learners build both configurations and compare the results. They start developing intuition for how circuit structure changes behaviour.",
    Icon: Layers,
  },
  {
    step: "D",
    label: "Build",
    heading: "Experiment freely in the practice area.",
    body: "With the practice area open, learners create their own circuits, test ideas, and combine components. They move from following steps to thinking through their own builds.",
    Icon: Hammer,
  },
];

const whyItMatters = [
  {
    Icon: TrendingUp,
    title: "Makes abstract STEM visible",
    body: "Voltage, current, and circuit logic become real when learners see an LED light up or go out based on their own connections. Abstract concepts become observable results.",
  },
  {
    Icon: ClipboardList,
    title: "Builds confidence through doing",
    body: "Completing a working circuit, even a simple one, changes how learners relate to electronics. Each successful build makes the next challenge feel more approachable.",
  },
  {
    Icon: BookOpen,
    title: "Supports practical assessment",
    body: "Learners can explain, demonstrate, and document what they built. The board provides a natural foundation for hands-on assessment alongside written work.",
  },
  {
    Icon: Search,
    title: "Teaches problem-solving habits",
    body: "When a circuit does not work, learners trace, test, and reason through the fault. These debugging habits are as valuable as the circuit knowledge itself.",
  },
];

const aiSupportCards = [
  {
    Icon: Wifi,
    title: "Connection troubleshooting",
    body: "Helping learners work through common wiring problems, identify loose connections, and understand what a circuit needs to function correctly.",
  },
  {
    Icon: Cpu,
    title: "Circuit reasoning",
    body: "Supporting learners in understanding how components relate: why something works, what a component does, and how to think through a circuit's behaviour.",
  },
  {
    Icon: Wrench,
    title: "Guided debugging",
    body: "Walking learners through a fault step by step, asking the right questions to help them locate and understand the problem rather than just giving the answer.",
  },
  {
    Icon: Hammer,
    title: "Practice area support",
    body: "Offering guidance when learners are experimenting freely: helping them plan what to try, review what happened, and decide what to adjust.",
  },
];

const heroPrimaryClass =
  "cta-mobile-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90";
const heroSecondaryClass =
  "cta-mobile-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]";
const ctaPrimaryClass =
  "final-cta-btn-primary cta-mobile-btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";
const ctaSecondaryClass =
  "final-cta-btn-secondary cta-mobile-btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";

export default function DevBoard() {
  return (
    <>
      <SEO {...getPageSeo("/dev-board")} />
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
                ERA Dev Board
              </p>
              <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
                A hands-on electronics learning kit for real circuits.
              </h1>
              <p className="mb-3 text-base leading-relaxed text-white/72 sm:text-lg">
                The ERA Kids Development Board introduces children and learners to
                basic electrical and electronic principles through circuits they
                can build, test, compare, and explain for themselves.
              </p>
              <p className="mb-8 text-sm text-white/55">
                From LEDs and resistors to series and parallel circuits, learners
                move from observation to independent building at their own pace.
              </p>
              <div className="inline-flex flex-col gap-3 sm:flex-row">
                <Link to="/programs" className={heroPrimaryClass}>
                  Explore Programmes
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
                <Link to="/payments" className={heroSecondaryClass}>
                  Enrol Now
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
              </div>
            </div>

            {/* Right: board image (tablet and up only) */}
            <div className="hidden md:flex">
              <div className="hero-media-card relative min-h-[320px] w-full bg-white/[0.04]">
                <img
                  src={devBoardFrontImg}
                  alt="ERA Kids Development Board, front view"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="hero-media-card-badge inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--color-text-primary)] shadow-sm backdrop-blur-sm">
                    Ghana-developed learning kit
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── What It Is ───────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">

            {/* Left */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                About the Dev Board
              </p>
              <h2 className="mb-5 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                A practical bridge between theory and building.
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                <p>
                  The ERA Kids Development Board is a hands-on electronics learning
                  kit designed to introduce children and learners to basic
                  electrical and electronic principles in a structured, safe, and
                  practical way.
                </p>
                <p>
                  Rather than reading about circuits in a textbook, learners work
                  directly with LEDs, resistors, buzzers, switches, and power
                  connections. They observe cause-and-effect, compare series and
                  parallel wiring, and experiment freely in a dedicated practice
                  area, all powered by four standard AA batteries.
                </p>
                <p>
                  The board is built around five dedicated teaching blocks, each
                  targeting a specific concept. Learners progress through them
                  naturally, from understanding how power is supplied safely to
                  building their own mini circuits from scratch.
                </p>
              </div>
            </div>

            {/* Right: info card */}
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-7 lg:sticky lg:top-8">
              <p className="mb-5 text-sm font-bold text-[var(--color-text-primary)]">
                ERA Dev Board at a Glance
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

      {/* ── Board Learning Blocks ─────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Board Structure
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Five teaching blocks, one connected board.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Each block on the ERA Dev Board targets a specific concept. Learners
              work through them in sequence or return to any block during
              practice.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {teachingBlocks.map(({ number, title, body }) => (
              <div
                key={number}
                className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-[0_1px_4px_rgb(0_0_0/0.05)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest text-[var(--color-text-muted)]">
                    Block {number}
                  </span>
                </div>
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

      {/* ── What Learners Explore ────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Learning Areas
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              What learners work with on the board.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              The ERA Dev Board covers the core concepts of basic electronics
              through components learners can touch, connect, and test.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {exploreCards.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-6 shadow-[0_1px_4px_rgb(0_0_0/0.05)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-white shadow-[0_1px_3px_rgb(0_0_0/0.07)]">
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

      {/* ── Board Images ─────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              The Board
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Front and back of the ERA Dev Board.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              The board is compact and clearly laid out. Each teaching block is
              physically separated so learners can see exactly what they are
              working with.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {/* Front */}
            <div
              tabIndex={0}
              className="group relative aspect-[3/2] cursor-default overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] shadow-[var(--shadow-soft)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              <img
                src={devBoardFrontImg}
                alt="ERA Dev Board front view showing all five teaching blocks"
                className="h-full w-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.04] md:group-focus-within:scale-[1.04]"
              />
              {/* Gradient: always on mobile, fades in on hover/focus on desktop */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/25 to-transparent transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 px-5 pb-5 transition-opacity duration-300 sm:flex-row sm:items-end sm:justify-between sm:gap-4 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                <p className="text-xs font-semibold leading-snug text-white drop-shadow-sm sm:text-sm">
                  ERA Dev Board &mdash; Front View
                </p>
                <p className="text-[10px] leading-snug text-white/70 drop-shadow-sm sm:shrink-0 sm:whitespace-nowrap sm:text-xs sm:text-white/75">
                  Power + practice area
                </p>
              </div>
            </div>

            {/* Back blue */}
            <div
              tabIndex={0}
              className="group relative aspect-[3/2] cursor-default overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] shadow-[var(--shadow-soft)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              <img
                src={devBoardBackBlueImg}
                alt="ERA Dev Board back view, blue edition"
                className="h-full w-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.04] md:group-focus-within:scale-[1.04]"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/25 to-transparent transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 px-5 pb-5 transition-opacity duration-300 sm:flex-row sm:items-end sm:justify-between sm:gap-4 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                <p className="text-xs font-semibold leading-snug text-white drop-shadow-sm sm:text-sm">
                  ERA Dev Board &mdash; Blue Back
                </p>
                <p className="text-[10px] leading-snug text-white/70 drop-shadow-sm sm:shrink-0 sm:whitespace-nowrap sm:text-xs sm:text-white/75">
                  Build &bull; Play &bull; Invent
                </p>
              </div>
            </div>

            {/* Back purple */}
            <div
              tabIndex={0}
              className="group relative aspect-[3/2] cursor-default overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] shadow-[var(--shadow-soft)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              <img
                src={devBoardBackPurpleImg}
                alt="ERA Dev Board back view, purple edition"
                className="h-full w-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.04] md:group-focus-within:scale-[1.04]"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/25 to-transparent transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 px-5 pb-5 transition-opacity duration-300 sm:flex-row sm:items-end sm:justify-between sm:gap-4 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                <p className="text-xs font-semibold leading-snug text-white drop-shadow-sm sm:text-sm">
                  ERA Dev Board &mdash; Purple Back
                </p>
                <p className="text-[10px] leading-snug text-white/70 drop-shadow-sm sm:shrink-0 sm:whitespace-nowrap sm:text-xs sm:text-white/75">
                  Build &bull; Play &bull; Invent
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Progressive Learning ─────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Learning Progression
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              From first observation to independent building.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              The ERA Dev Board does not require prior knowledge. Learners begin
              by observing and progress naturally through connecting, comparing,
              and building.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {progressionStages.map(({ step, label, heading, body, Icon }) => (
              <div
                key={step}
                className="flex flex-col gap-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-6 shadow-[0_1px_4px_rgb(0_0_0/0.05)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-white shadow-[0_1px_3px_rgb(0_0_0/0.07)]">
                    <Icon size={18} className="text-[var(--color-primary)]" strokeWidth={1.75} />
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why It Matters ───────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Why It Matters
            </p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              What hands-on learning actually changes.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Practical electronics learning produces outcomes that carry beyond
              the board itself, in how learners think, how they engage, and what
              they believe they can understand.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {whyItMatters.map(({ Icon, title, body }) => (
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

      {/* ── AI-Assisted Learner Support ──────────────────────────────────── */}
      <section className="bg-[var(--color-primary-deep)] py-16 md:py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.04] px-8 py-12 md:px-12 md:py-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 70% at 90% 10%, color-mix(in srgb, var(--color-accent) 10%, transparent) 0%, transparent 60%)",
              }}
            />

            <div className="relative">
              <div className="mb-10 max-w-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-white/10">
                    <Bot size={18} className="text-[var(--color-accent)]" strokeWidth={1.75} />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                    AI-Assisted Support
                  </p>
                </div>
                <h2 className="mb-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Guidance while learners build.
                </h2>
                <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                  ERA AXIS is developing AI-assisted support for the ERA Dev Board
                  so learners can get help while practising. The assistant is being
                  trained to understand the board layout, common wiring issues,
                  polarity mistakes, and circuit logic, giving learners a place to
                  ask questions and think through problems during independent
                  practice.
                </p>
              </div>

              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {aiSupportCards.map(({ Icon, title, body }) => (
                  <div
                    key={title}
                    className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-white/10">
                      <Icon size={16} className="text-[var(--color-accent)]" strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="mb-1.5 text-sm font-bold text-white">
                        {title}
                      </h3>
                      <p className="text-xs leading-relaxed text-white/65">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[var(--radius-sm)] border border-white/10 bg-white/[0.04] px-5 py-4">
                <p className="text-xs leading-relaxed text-white/55">
                  <span className="font-semibold text-white/75">Note: </span>
                  This support is designed to complement facilitators and learning
                  materials, not replace them. It is an extra layer for practice
                  and revision, not a guaranteed problem-solving service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programme Connection Strip ───────────────────────────────────── */}
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
                  Practical Learning Pathways
                </p>
                <h2 className="mb-3 text-xl font-black tracking-tight text-white sm:text-2xl">
                  Used across practical learning pathways.
                </h2>
                <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                  The ERA Dev Board supports ERA AXIS learning experiences across
                  school STEM, youth training, and project-based technology
                  education.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link
                  to="/programs/school-stem"
                  className="final-cta-btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold"
                >
                  School STEM Programme
                  <ArrowRight size={15} strokeWidth={2.2} />
                </Link>
                <Link
                  to="/programs"
                  className="final-cta-btn-secondary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold"
                >
                  View All Programmes
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
            Bring hands-on STEM learning to your learners.
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            Talk to ERA AXIS about using the ERA Dev Board as part of a practical
            STEM programme for your school, youth group, or learning community.
          </p>
          <div className="flex justify-center">
            <div className="inline-flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className={ctaPrimaryClass}>
                Contact ERA
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
              <Link to="/partners" className={ctaSecondaryClass}>
                Partner With ERA
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
