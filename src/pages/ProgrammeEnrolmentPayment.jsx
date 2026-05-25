import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, FileText, Info, Lock } from "lucide-react";
import {
  getPaymentCategoryBySlug,
  calculatePaymentBreakdown,
  calculateFullProgrammeBase,
  formatGhs,
} from "../data/payments";

const category = getPaymentCategoryBySlug("programme-enrolment");

const NEXT_STEPS = [
  "Your enrolment details will be attached to your payment record.",
  "ERA AXIS will use your email/phone to match future receipts and payment history.",
  "After payment, the next steps and confirmation details will be shared with you.",
];

const learnerTypes = [
  "School learner",
  "Out-of-school youth",
  "Working professional",
  "Parent/guardian paying",
  "Sponsor paying for learner",
];

const fieldCls =
  "min-h-[38px] w-full border-0 border-b border-[var(--color-border)] bg-transparent px-0 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-0";

const labelCls =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-primary)]";

const optionalTag = (
  <span className="ml-1 font-normal normal-case tracking-normal text-[var(--color-text-muted)]">
    (optional)
  </span>
);

export default function ProgrammeEnrolmentPayment() {
  const location = useLocation();
  const [selectedProgrammeSlug, setSelectedProgrammeSlug] =
    useState("junior-stem");
  const [paymentOption, setPaymentOption] = useState("monthly");
  const returnTo =
    typeof location.state?.returnTo === "string" &&
    location.state.returnTo.startsWith("/")
      ? location.state.returnTo
      : "/payments";
  const returnLabel =
    typeof location.state?.returnLabel === "string"
      ? location.state.returnLabel
      : "Back to payment options";

  const selectedProgramme =
    category.items.find((programme) => programme.slug === selectedProgrammeSlug) ||
    category.items[0];

  const isFullPayment = paymentOption === "full";
  const baseAmount = isFullPayment
    ? calculateFullProgrammeBase(
        selectedProgramme.monthlyAmount,
        selectedProgramme.fullPaymentMonths
      )
    : selectedProgramme.monthlyAmount;
  const breakdown = calculatePaymentBreakdown(baseAmount);

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
            to={returnTo}
            className="mb-8 flex w-fit items-center gap-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/70"
          >
            <ArrowLeft size={12} strokeWidth={2.5} aria-hidden="true" />
            {returnLabel}
          </Link>

          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
              Programme Payment
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
              Choose your programme and payment option.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Select a programme, choose monthly or full payment, and complete
              the required enrolment details before checkout.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface-soft)] py-8 md:py-10">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-[1fr_330px] lg:items-start">
            <div className="space-y-6">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-center gap-2">
                  <FileText
                    size={19}
                    strokeWidth={2.25}
                    aria-hidden="true"
                    className="text-[var(--color-primary)]"
                  />
                  <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    Programme enrolment details
                  </h2>
                </div>

                <div className="mb-6 flex gap-3 rounded-[var(--radius-sm)] bg-[var(--color-primary)]/10 px-4 py-3 text-xs leading-relaxed text-[var(--color-primary-deep)]">
                  <Info
                    size={16}
                    strokeWidth={2.25}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                  />
                  <p>
                    Complete the details needed to attach your enrolment to your
                    payment record.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Full name</label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Email address</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className={fieldCls}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Phone number</label>
                      <input
                        type="tel"
                        placeholder="+233 XX XXX XXXX"
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Programme</label>
                      <select
                        value={selectedProgrammeSlug}
                        onChange={(event) =>
                          setSelectedProgrammeSlug(event.target.value)
                        }
                        className={fieldCls}
                      >
                        {category.items.map((programme) => (
                          <option key={programme.slug} value={programme.slug}>
                            {programme.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Payment option</label>
                      <select
                        value={paymentOption}
                        onChange={(event) => setPaymentOption(event.target.value)}
                        className={fieldCls}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="full">Full programme</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>
                        Institution / organisation {optionalTag}
                      </label>
                      <input
                        type="text"
                        placeholder="School, company, or organisation"
                        className={fieldCls}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Learner type {optionalTag}</label>
                      <select defaultValue="" className={fieldCls}>
                        <option value="" disabled>
                          Select learner type
                        </option>
                        {learnerTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Learning goal {optionalTag}</label>
                      <input
                        type="text"
                        placeholder="What do you want to achieve?"
                        className={fieldCls}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>
                        Previous experience {optionalTag}
                      </label>
                      <input
                        type="text"
                        placeholder="Beginner, some experience, or advanced"
                        className={fieldCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Notes {optionalTag}</label>
                    <textarea
                      rows={3}
                      placeholder="Anything ERA AXIS should know before enrolment..."
                      className={`${fieldCls} min-h-20 resize-none`}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[var(--radius-md)] border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/10 p-6 md:p-7">
                <h3 className="mb-5 text-sm font-semibold tracking-tight text-[var(--color-primary-deep)]">
                  What happens next
                </h3>
                <ul className="space-y-4">
                  {NEXT_STEPS.map((step) => (
                    <li key={step} className="flex items-start gap-3">
                      <Check
                        size={15}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                      />
                      <span className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {step}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4 lg:sticky lg:top-28">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-sm">
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                  Order summary
                </p>
                <h2 className="mb-5 text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                  {selectedProgramme.title}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Payment option
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {isFullPayment ? "Full programme" : "Monthly"}
                    </span>
                  </div>

                  {isFullPayment && (
                    <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 text-sm">
                      <span className="text-[var(--color-text-secondary)]">
                        Programme duration
                      </span>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {selectedProgramme.fullPaymentMonths} months
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Base amount
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {formatGhs(breakdown.baseAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Maintenance fee
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {formatGhs(breakdown.maintenanceFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Paystack processing fee
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {formatGhs(breakdown.paystackFee)}
                    </span>
                  </div>
                </div>

                <div className="my-5 flex items-center justify-between gap-4 rounded-[var(--radius-sm)] bg-[var(--color-primary)]/10 px-4 py-4">
                  <span className="text-sm font-semibold text-[var(--color-primary-deep)]">
                    Total payable
                  </span>
                  <span className="text-xl font-bold text-[var(--color-primary)]">
                    {formatGhs(breakdown.customerTotal)}
                  </span>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    disabled
                    className="btn-primary w-full cursor-not-allowed justify-center opacity-50"
                  >
                    Continue to checkout
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </button>
                  <Link
                    to="/payments"
                    className="btn-outline w-full justify-center"
                  >
                    Back to payment options
                  </Link>
                </div>
              </div>

              <p className="flex items-center justify-center gap-2 text-center text-xs text-[var(--color-text-muted)]">
                <Lock size={14} strokeWidth={2} aria-hidden="true" />
                Payments are processed securely via Paystack.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
