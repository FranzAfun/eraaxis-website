import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Users } from "lucide-react";
import {
  getPaymentCategoryBySlug,
  calculateFullProgrammeBase,
  formatGhs,
} from "../data/payments";

const category = getPaymentCategoryBySlug("programme-enrolment");

function ProgrammeCard({ programme }) {
  const fullBase = calculateFullProgrammeBase(
    programme.monthlyAmount,
    programme.fullPaymentMonths
  );

  return (
    <article className="card-interactive p-6 transition-all duration-300 hover:-translate-y-1">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[var(--color-text-primary)]">
            {programme.title}
          </h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <Users size={11} strokeWidth={1.75} aria-hidden="true" />
            {programme.audience}
          </span>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          <Clock size={10} strokeWidth={2} aria-hidden="true" />
          {programme.fullPaymentMonths} months
        </span>
      </div>

      <p className="text-[32px] font-black leading-none tracking-tight text-[var(--color-text-primary)]">
        {formatGhs(programme.monthlyAmount)}
        <span className="ml-1.5 text-base font-semibold text-[var(--color-text-muted)]">
          /month
        </span>
      </p>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Or pay{" "}
        <span className="font-semibold text-[var(--color-primary)]">
          {formatGhs(fullBase)}
        </span>{" "}
        upfront for the full {programme.fullPaymentMonths}-month programme.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled
          className="min-h-[42px] cursor-not-allowed rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)] px-3 text-sm font-semibold text-[var(--color-text-muted)]"
        >
          Pay monthly
        </button>
        <button
          type="button"
          disabled
          className="min-h-[42px] cursor-not-allowed rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-3 text-sm font-semibold text-[var(--color-text-muted)]"
        >
          Pay full programme
        </button>
      </div>
    </article>
  );
}

export default function ProgrammeEnrolmentPayment() {
  return (
    <>
      <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-14 pt-36 text-white md:pb-20 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 18%, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, transparent 30%), radial-gradient(circle at 84% 8%, color-mix(in srgb, var(--color-primary) 38%, transparent) 0%, transparent 34%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-28 top-28 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-4 h-96 w-96 rounded-full bg-[var(--color-accent)]/[0.08] blur-3xl"
        />

        <div className="container relative z-10">
          <Link
            to="/payments"
            className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/70"
          >
            <ArrowLeft size={12} strokeWidth={2.5} aria-hidden="true" />
            Back to payment options
          </Link>

          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
              Programme Payment
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
              Choose your programme payment option.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Select the ERA AXIS programme you want to pay for. Monthly and
              full programme totals will be shown before checkout.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface-soft)] py-16 md:py-24">
        <div className="container">
          <div className="grid gap-5 lg:grid-cols-2">
            {category.items.map((programme) => (
              <ProgrammeCard key={programme.slug} programme={programme} />
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta-band relative overflow-hidden py-16 md:py-20">
        <div aria-hidden="true" className="final-cta-orb pointer-events-none absolute inset-0" />
        <div className="container relative z-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">
            Institutional &amp; Group Payments
          </p>
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Paying for a school, group, or organisation?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            For schools, community groups, NGOs, and sponsors paying for
            multiple learners — contact ERA AXIS for a custom quote.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact#enquiry"
              className="final-cta-btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold"
            >
              Request custom quote
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link
              to="/payments"
              className="final-cta-btn-secondary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold"
            >
              Back to payment options
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
