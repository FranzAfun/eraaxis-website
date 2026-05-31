import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, FileText, Info, Lock } from "lucide-react";
import {
  getPaymentCategoryBySlug,
  calculatePaymentBreakdown,
  formatGhs,
} from "../data/payments";
import BackLinkButton from "../components/navigation/BackLinkButton";
import studentChapterHeroImg from "../assets/images/programmes/student-chapter-hero.webp";

const category = getPaymentCategoryBySlug("student-chapter");
const item = category.items[0];
const breakdown = calculatePaymentBreakdown(item.baseAmount);

const BENEFITS = [
  "Student Chapter community access",
  "One practical class every month",
  "Collaborative project and build sessions",
  "Opportunities to connect with mentors and industry partners",
  
];

const fieldCls =
  "min-h-[38px] w-full border-0 border-b border-[var(--color-border)] bg-transparent px-0 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-0";

const labelCls =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-primary-deep)]";

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
          <BackLinkButton
            fallbackTo="/payments"
            className="mb-8 flex w-fit items-center gap-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/70"
          >
            <ArrowLeft size={12} strokeWidth={2.5} aria-hidden="true" />
            Back
          </BackLinkButton>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="flex flex-col justify-center">
              <p className="mb-5 inline-flex w-fit self-start rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
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

            <div className="relative hidden lg:block">
              <div className="hero-media-card">
                <img
                  src={studentChapterHeroImg}
                  alt="ERA AXIS Student Chapter learners in a practical session"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="hero-media-card-badge inline-block rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    Practical student learning
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface-soft)] py-8 md:py-10">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-[1fr_330px] lg:items-start">
            <div className="order-1 lg:order-none">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-center gap-2">
                  <FileText
                    size={19}
                    strokeWidth={2.25}
                    aria-hidden="true"
                    className="text-[var(--color-primary)]"
                  />
                  <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    Member information
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
                    Kindly provide your official information. This will be used for your Student Chapter membership and to keep you updated on chapter activities and opportunities.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Full name</label>
                      <input
                        type="text"
                        placeholder="Genny Amadapah"
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Email address</label>
                      <input
                        type="email"
                        placeholder="genny@example.com"
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
                      <label className={labelCls}>
                        Institution / School / Community
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
                      className={`${fieldCls} min-h-20 resize-none`}
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="order-2 space-y-4 lg:order-none lg:sticky lg:top-28">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-sm">
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                  Order summary
                </p>
                <h2 className="mb-5 text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                  {item.title}
                </h2>

                <div className="space-y-4">
                  {item.breakdown.map(({ label, amount }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 text-sm"
                    >
                      <span className="text-[var(--color-text-secondary)]">
                        {label}
                      </span>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {formatGhs(amount)}
                      </span>
                    </div>
                  ))}

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
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </button>
                  <Link
                    to="/payments"
                    className="btn-outline w-full justify-center"
                  >
                    Back to enrolment &amp; dues
                  </Link>
                </div>
              </div>

              <p className="flex items-center justify-center gap-2 text-center text-xs text-[var(--color-text-muted)]">
                <Lock size={14} strokeWidth={2} aria-hidden="true" />
                Secured by Paystack
              </p>
            </div>

            <div className="order-3 rounded-[var(--radius-md)] border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/10 p-6 md:p-7 lg:order-none lg:col-start-1 lg:row-start-2">
              <h3 className="mb-5 text-sm font-semibold tracking-tight text-[var(--color-primary-deep)]">
                What you get
              </h3>
              <ul className="space-y-4">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <Check
                      size={15}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                    />
                    <span className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
