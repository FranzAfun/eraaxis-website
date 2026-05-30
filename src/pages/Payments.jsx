import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  Landmark,
  Users,
} from "lucide-react";

const paymentOptions = [
  {
    title: "Programme Enrolment",
    amount: "From GHS 200/month",
    description:
      "Pay for an ERA AXIS learning programme. Monthly or full upfront.",
    bullets: [
      "4 programmes across school, youth, and professional tracks",
      "Monthly or full programme payment options",
      "Full pricing and checkout totals shown at the next step",
    ],
    cta: "Choose programme",
    to: "/payments/programme-enrolment",
    Icon: GraduationCap,
    isPopular: true,
  },
  {
    title: "Student Chapter",
    amount: "GHS 75 first payment",
    description: "Join the ERA AXIS Student Chapter.",
    bullets: [
      "GHS 60 registration",
      "GHS 15 first month dues",
      "Monthly dues continue after first month",
    ],
    cta: "Start chapter payment",
    to: "/payments/student-chapter",
    Icon: Users,
  },
  {
    title: "Monthly Dues",
    amount: "GHS 15/month",
    description: "Pay monthly membership or chapter dues.",
    bullets: [
      "For active members",
      "Monthly payment record",
      "Receipt after confirmation",
    ],
    cta: "Pay dues",
    to: "/payments/monthly-dues",
    Icon: CalendarDays,
  },
  {
    title: "Institutional / Group Payments",
    amount: "Custom quote",
    description:
      "For schools, communities, NGOs, CSR sponsors, and partners paying for multiple learners.",
    bullets: [
      "Group learner support",
      "School/community arrangements",
      "Custom payment guidance",
    ],
    cta: "Request quote",
    to: "/contact#enquiry",
    Icon: Landmark,
    isSecondary: true,
  },
];

function OptionCard({ option }) {
  const { Icon, isPopular } = option;

  const baseClasses = "flex min-h-[360px] flex-col p-6 transition-all duration-300 hover:-translate-y-1";
  const popularClasses = "relative rounded-[var(--radius-md)] border-2 border-[var(--color-primary)] bg-white bg-gradient-to-b from-[var(--color-primary)]/[0.06] to-transparent shadow-lg shadow-[var(--color-primary)]/10 hover:shadow-xl hover:shadow-[var(--color-primary)]/20";
  const standardClasses = "card-interactive";

  return (
    <article className={`${baseClasses} ${isPopular ? popularClasses : standardClasses}`}>
      {isPopular && (
        <div className="absolute right-5 top-0 -translate-y-1/2 rounded-full bg-[var(--color-primary)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
          Most Popular
        </div>
      )}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Payment option
          </p>
          <h2 className="text-2xl font-black tracking-tight text-[var(--color-text-primary)]">
            {option.title}
          </h2>
        </div>
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm ${
            isPopular
              ? "border-[var(--color-primary)]/20 bg-white"
              : "border-[var(--color-border)] bg-[var(--color-surface-soft)]"
          }`}
        >
          <Icon size={21} className="text-[var(--color-primary)]" strokeWidth={1.85} />
        </span>
      </div>

      <p className="text-2xl font-black tracking-tight text-[var(--color-primary)]">
        {option.amount}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {option.description}
      </p>

      <ul className="mt-6 space-y-3">
        {option.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
            <span
              aria-hidden="true"
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]"
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <Link
          to={option.to}
          className={option.isSecondary ? "btn-outline" : "btn-primary"}
        >
          {option.cta}
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    </article>
  );
}

export default function Payments() {
  return (
    <>
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
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
              ERA AXIS PAYMENTS
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
              Payments &amp; Dues
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
              Pay for programme enrolment, dues, student chapter access, or
              request institutional/group payment support.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#payment-options"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                Choose payment option
                <ArrowRight size={16} strokeWidth={2} />
              </a>
              <Link
                to="/contact#enquiry"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]"
              >
                Request institutional quote
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="payment-options" className="bg-[var(--color-surface-soft)] py-16 md:py-24">
        <div className="container">
          <div className="mb-10 flex max-w-2xl items-start gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white shadow-sm sm:flex">
              <GraduationCap
                size={21}
                className="text-[var(--color-primary)]"
                strokeWidth={1.85}
              />
            </span>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                Payment options
              </p>
              <h2 className="mb-4 text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
                Start with the payment path that fits.
              </h2>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                Choose a category now. Final totals and confirmation steps will
                be shown clearly before any payment is made.
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {paymentOptions.map((option) => (
              <OptionCard key={option.title} option={option} />
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta-band relative overflow-hidden py-16 md:py-20">
        <div aria-hidden="true" className="final-cta-orb pointer-events-none absolute inset-0" />
        <div className="container relative text-center">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Need help choosing?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            Contact ERA AXIS and we will guide you to the right payment path.
          </p>
          <Link
            to="/contact#enquiry"
            className="final-cta-btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold"
          >
            Contact ERA AXIS
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </section>
    </>
  );
}
