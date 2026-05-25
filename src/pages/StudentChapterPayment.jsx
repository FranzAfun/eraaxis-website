import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  getPaymentCategoryBySlug,
  calculatePaymentBreakdown,
  formatGhs,
} from "../data/payments";

const category = getPaymentCategoryBySlug("student-chapter");
const item = category.items[0];
const breakdown = calculatePaymentBreakdown(item.baseAmount);

const BENEFITS = [
  "Student Chapter community access",
  "One practical class every month",
  "Collaborative project and build sessions",
  "Monthly dues of GHS 15 continue after first payment",
];

const fieldCls =
  "min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20";

const labelCls =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]";

const optionalTag = (
  <span className="ml-1 font-normal normal-case tracking-normal text-[var(--color-text-muted)]">
    (optional)
  </span>
);

export default function StudentChapterPayment() {
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
              Student Chapter
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
              Join the ERA AXIS Student Chapter.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Complete your first payment to access the Student Chapter
              community, monthly practical sessions, and collaborative build
              opportunities.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface-soft)] py-16 md:py-20">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">

            {/* ── Left column ──────────────────────────────────────────── */}
            <div className="space-y-5">

              {/* Form card */}
              <div className="card-interactive p-6 md:p-8">
                <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                  Member information
                </h2>
                <p className="mb-6 text-sm text-[var(--color-text-muted)]">
                  Tell us a bit about yourself. No payment details needed here.
                </p>

                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>
                        Full name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className={fieldCls}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>
                        Phone number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+233 XX XXX XXXX"
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>
                        Institution / School / Community{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Your school or community"
                        className={fieldCls}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>
                        Year or level {optionalTag}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Year 2, Level 200, SHS 3"
                        className={fieldCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Notes {optionalTag}</label>
                    <textarea
                      rows={3}
                      placeholder="Anything you want ERA AXIS to know before joining..."
                      className={fieldCls.replace("min-h-[44px]", "min-h-0")}
                    />
                  </div>
                </div>
              </div>

              {/* Benefits card */}
              <div className="card-interactive p-6">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                  What you get
                </h3>
                <ul className="space-y-3">
                  {BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-soft)]">
                        <Check
                          size={10}
                          strokeWidth={3}
                          aria-hidden="true"
                          className="text-[var(--color-primary)]"
                        />
                      </span>
                      <span className="text-sm leading-snug text-[var(--color-text-secondary)]">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Right column (sticky) ─────────────────────────────────── */}
            <div className="space-y-4 lg:sticky lg:top-28">

              {/* Order summary card */}
              <div className="card-interactive overflow-hidden p-6">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                  Order summary
                </p>
                <h2 className="mb-6 text-lg font-black tracking-tight text-[var(--color-text-primary)]">
                  {item.title}
                </h2>

                <div className="space-y-2.5">
                  {item.breakdown.map(({ label, amount }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-[var(--color-text-secondary)]">
                        {label}
                      </span>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {formatGhs(amount)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="my-4 border-t border-[var(--color-border)]" />

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[var(--color-text-primary)]">
                      Base total
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {formatGhs(breakdown.baseAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">
                      Maintenance fee
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                      {formatGhs(breakdown.maintenanceFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">
                      Paystack processing fee
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                      {formatGhs(breakdown.paystackFee)}
                    </span>
                  </div>
                </div>

                <div className="my-4 border-t border-[var(--color-border)]" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[var(--color-text-primary)]">
                    Total payable
                  </span>
                  <span className="text-2xl font-black text-[var(--color-primary)]">
                    {formatGhs(breakdown.customerTotal)}
                  </span>
                </div>
              </div>

              {/* CTA */}
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
                  <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
                  Back to payment options
                </Link>
              </div>

              <p className="text-center text-[11px] text-[var(--color-text-muted)]">
                Payments are processed securely via Paystack.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
