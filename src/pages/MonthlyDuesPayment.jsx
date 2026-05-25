import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Info,
  Lock,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  getPaymentCategoryBySlug,
  calculatePaymentBreakdown,
  formatGhs,
} from "../data/payments";

const category = getPaymentCategoryBySlug("monthly-dues");
const item = category.items[0];
const selectedMonths = 1;
const baseTotal = item.baseAmount * selectedMonths;
const breakdown = calculatePaymentBreakdown(baseTotal);

const HISTORY_ACCESS = [
  "Secure OTP login ensures your payment data is protected.",
  "Email matching automatically links this payment to your member profile.",
  "Digital receipts and complete transaction history will be available after integration.",
];

const fieldCls =
  "min-h-[38px] w-full border-0 border-b border-[var(--color-border)] bg-transparent px-0 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-0";

const darkFieldCls =
  "min-h-[42px] w-full rounded-[var(--radius-sm)] border border-white/10 bg-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-white/35 focus:ring-2 focus:ring-white/10";

const labelCls =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-primary)]";

export default function MonthlyDuesPayment() {
  return (
    <>
      <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-12 pt-32 text-white md:pb-16 md:pt-36">
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
          <div className="grid gap-10 lg:grid-cols-[1fr_390px] lg:items-center">
            <div>
              <Link
                to="/payments"
                className="mb-8 flex w-fit items-center gap-1.5 text-xs font-medium text-white/70 transition-colors hover:text-white"
              >
                <ArrowLeft size={12} strokeWidth={2.5} aria-hidden="true" />
                Back to payment options
              </Link>

              <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
                Monthly Dues
              </p>
              <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl">
                Pay your monthly dues.
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                Use your email or phone number to continue. Members can log in
                to auto-fill their details.
              </p>
            </div>

            <div className="rounded-[var(--radius-md)] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/10">
              <div className="mb-5 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-white/10 text-white/75">
                  <UserRound size={18} strokeWidth={2.25} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white">
                    Already a member?
                  </h2>
                  <p className="text-xs text-white/55">
                    Login for a faster checkout
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-white/55">
                    Email address or phone number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. member@axis.edu"
                    className={darkFieldCls}
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex min-h-[42px] w-full items-center justify-center rounded-[var(--radius-sm)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                >
                  Continue with OTP
                </button>
              </div>
            </div>
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
                    Dues Payment Form
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
                    If you log in using the OTP panel above, your member details
                    will automatically populate here, saving you time.
                  </p>
                </div>

                <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Full name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      className={fieldCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Email address</label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      className={fieldCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Phone number</label>
                    <input
                      type="tel"
                      placeholder="+233 54 123 4567"
                      className={fieldCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Pay ahead months</label>
                    <select defaultValue="1" className={fieldCls}>
                      {Array.from({ length: 12 }, (_, index) => {
                        const month = index + 1;

                        return (
                          <option key={month} value={month}>
                            {month} {month === 1 ? "Month (Current)" : "Months"}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-[var(--radius-md)] border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/10 p-6 md:p-7">
                <div className="mb-5 flex items-center gap-2">
                  <ShieldCheck
                    size={17}
                    strokeWidth={2.25}
                    aria-hidden="true"
                    className="text-[var(--color-primary)]"
                  />
                  <h3 className="text-sm font-semibold tracking-tight text-[var(--color-primary-deep)]">
                    Payment history access
                  </h3>
                </div>
                <ul className="space-y-4">
                  {HISTORY_ACCESS.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <CheckCircle2
                        size={15}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                      />
                      <span className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {detail}
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Monthly dues
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {formatGhs(item.baseAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Selected months
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      x {selectedMonths}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Base total
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
                    <ArrowRight size={15} strokeWidth={2.25} aria-hidden="true" />
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
                Secured by Paystack
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
