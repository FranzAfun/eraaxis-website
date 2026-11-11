import { School, UserRound } from "lucide-react";
import Reveal from "../motion/Reveal";
import CampusChapterStrip from "./CampusChapterStrip";
import JoinLink from "./JoinLink";
import { SectionHead } from "./ProgrammeParts";
import { enrolmentModeOf, getProgrammePrice } from "../../data/payments";

/**
 * The pricing section on /programs (#pricing), as Partnerships asked (Nov 2026):
 * two cards, schools and individual learners, each with its price, how it is
 * billed and one button, then Campus Chapters. Prices and how people join come
 * from EDOS (`programmes`, the API list) with data/payments.js behind them.
 */
const PLANS = [
  {
    category: "school_stem",
    Icon: School,
    who: "Schools and institutions",
    title: "School Partnerships",
    line: "Bring practical STEM education to your school through ERA AXIS's structured, hands-on learning programmes.",
    enquiry: {
      inquiryType: "School or Institutional Partnership",
      message: "We would like to bring ERA AXIS School STEM to our school.",
    },
    enrol: {
      to: "/payments/programme-enrolment",
      state: { programmeSlug: "junior-stem", returnTo: "/programs#pricing", returnLabel: "Back to pricing" },
      label: "Enrol Now",
    },
    page: "/programs/school-stem",
    highlight: true,
  },
  {
    category: "out_of_school_youth",
    Icon: UserRound,
    who: "Individual learners",
    title: "Out-of-School Youth",
    line: "Develop practical skills in electronics, robotics, programming, engineering and other emerging technologies through structured, hands-on learning.",
    enquiry: { inquiryType: "Enrolment / Admissions" },
    enrol: {
      to: "/payments/programme-enrolment",
      state: { programmeSlug: "out-of-school-youth", returnTo: "/programs#pricing", returnLabel: "Back to pricing" },
      label: "Enrol Now",
    },
    page: "/programs/out-of-school-youth",
  },
];

// Under the price: what it means for how people pay.
const NOTE = {
  enquiry: "No fixed fee: agreed with each school.",
  online: "Pay monthly, or 3 months at once at checkout.",
};

function PlanCard({ plan, programme }) {
  const { Icon, highlight } = plan;
  const mode = enrolmentModeOf(plan.category, programme);
  const price = getProgrammePrice(plan.category, programme);
  // School Partnerships is the focus card, filled with the primary colour so
  // the two read apart at a glance; its words are white on it.
  const tone = highlight
    ? {
        card: "border-2 border-[var(--color-primary)] bg-[var(--color-primary)] shadow-xl shadow-[var(--color-primary)]/25",
        who: "text-[var(--color-text-on-dark-muted)]",
        title: "text-white",
        amount: "text-white",
        body: "text-[var(--color-text-on-dark-muted)]",
        icon: "border-white/25 bg-white/10 text-white",
        button: "inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-white/90",
      }
    : {
        card: "card-interactive",
        who: "text-[var(--color-primary)]",
        title: "text-[var(--color-text-primary)]",
        amount: "text-[var(--color-text-primary)]",
        body: "text-[var(--color-text-secondary)]",
        icon: "border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-primary)]",
        button: "btn-primary min-h-[48px] w-full justify-center",
      };

  return (
    <article className={`flex h-full w-full flex-col rounded-[var(--radius-md)] p-6 sm:p-8 ${tone.card}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className={`mb-2 text-xs font-semibold uppercase tracking-widest ${tone.who}`}>{plan.who}</p>
          <h3 className={`text-2xl font-black tracking-tight ${tone.title}`}>{plan.title}</h3>
        </div>
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] border ${tone.icon}`}>
          <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
        </span>
      </div>

      {price?.badge ? (
        <p className={`text-3xl font-black uppercase tracking-widest ${tone.amount}`}>{price.badge}</p>
      ) : price ? (
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className={`text-3xl font-black tracking-tight sm:text-4xl ${tone.amount}`}>{price.amount}</span>
          <span className={`text-base font-medium ${tone.body}`}>{price.per}</span>
        </p>
      ) : null}
      {NOTE[mode] && <p className={`mt-1 text-sm font-semibold ${tone.body}`}>{NOTE[mode]}</p>}

      <p className={`mt-5 text-[15px] leading-relaxed ${tone.body}`}>{plan.line}</p>

      <div className="mt-auto pt-8">
        <JoinLink mode={mode} enrol={plan.enrol} enquiry={plan.enquiry} updatesTo={plan.page} className={tone.button} />
      </div>
    </article>
  );
}

export default function PricingSection({ programmes }) {
  const byCategory = (category) => programmes?.find((p) => p.category === category) || null;
  return (
    <section id="pricing" className="scroll-mt-20 bg-white py-20 md:py-24">
      <div className="container">
        <SectionHead eyebrow="Pricing" title="Clear pricing for schools and learners." />
        <ul className="grid gap-5 md:grid-cols-2">
          {PLANS.map((plan, i) => (
            <Reveal as="li" key={plan.category} delay={i * 80} className="flex">
              <PlanCard plan={plan} programme={byCategory(plan.category)} />
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-5">
          <CampusChapterStrip />
        </Reveal>
      </div>
    </section>
  );
}
