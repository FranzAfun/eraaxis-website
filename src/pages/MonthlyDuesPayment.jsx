import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
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
import BackLinkButton from "../components/navigation/BackLinkButton";
import SelectField from "../components/ui/SelectField";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";

const category = getPaymentCategoryBySlug("monthly-dues");
const item = category.items[0];

const HISTORY_ACCESS = [
  "Secure OTP login ensures your payment data is protected.",
  "Using your registered email automatically links this payment to your profile.",
  "Digital receipts and payment history will be available after confirmation.",
];

const fieldCls =
  "min-h-[38px] w-full border-0 border-b border-[var(--color-border)] bg-transparent px-0 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-0";

const labelCls =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-primary-deep)]";

function PaymentHistoryAccessCard({ className = "" }) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/10 p-6 md:p-7 ${className}`.trim()}
    >
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
  );
}

export default function MonthlyDuesPayment() {
  const [showManualForm, setShowManualForm] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState("1");
  const manualFormInnerRef = useRef(null);
  const [manualFormHeight, setManualFormHeight] = useState(0);
  const [fullName, setFullName]         = useState("");
  const [email, setEmail]               = useState("");
  const [phone, setPhone]               = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [formError, setFormError]       = useState("");
  const baseTotal = item.baseAmount * Number(selectedMonths);
  const breakdown = calculatePaymentBreakdown(baseTotal);
  const duesPeriodOptions = [
    { value: "1", label: "1 Month (Current)" },
    { value: "3", label: "Quarter" },
    { value: "6", label: "Half Year" },
    { value: "12", label: "1 Year" },
  ];

  async function handleFirstTimeSubmit() {
    setFormError("");
    if (!fullName.trim()) { setFormError("Full name is required."); return; }
    if (!email.trim())    { setFormError("Email address is required."); return; }
    if (!phone.trim())    { setFormError("Phone number is required."); return; }
    setSubmitting(true);
    try {
      const programmesRes = await fetch("/api/website/programmes");
      const programmesData = await programmesRes.json();
      const prog = programmesData.data?.find((p) => p.payment_model === "dues");
      if (!prog) throw new Error("Monthly Dues programme not found. Please try again.");

      const enrolRes = await fetch("/api/website/enrolments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programme_id: prog.id,
          full_name:    fullName.trim(),
          email:        email.trim(),
          phone:        phone.trim(),
        }),
      });
      const enrolData = await enrolRes.json();
      if (!enrolData.success) throw new Error(enrolData.error || "Enrolment failed.");

      const payRes = await fetch("/api/website/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrolment_id: enrolData.data.id, months_paid: Number(selectedMonths) }),
      });
      const payData = await payRes.json();
      if (!payData.success) throw new Error(payData.error || "Payment initialisation failed.");

      window.location.href = payData.data.authorizationUrl;
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  useEffect(() => {
    const updateManualFormHeight = () => {
      if (!manualFormInnerRef.current) {
        return;
      }

      setManualFormHeight(manualFormInnerRef.current.scrollHeight);
    };

    updateManualFormHeight();

    if (!showManualForm) {
      return undefined;
    }

    window.addEventListener("resize", updateManualFormHeight);
    return () => window.removeEventListener("resize", updateManualFormHeight);
  }, [showManualForm]);

  return (
    <>
      <SEO {...getPageSeo("/payments/monthly-dues")} />
      <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-14 pt-32 text-white md:pb-18 md:pt-36">
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
          <div className="max-w-3xl">
            <BackLinkButton
              fallbackTo="/payments"
              className="mb-8 flex w-fit items-center gap-1.5 text-xs font-medium text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft size={12} strokeWidth={2.5} aria-hidden="true" />
              Back
            </BackLinkButton>

            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
              Monthly Dues
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl">
              Pay your monthly dues.
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              Choose the path that fits your situation. Returning members can
              continue with OTP for a faster experience, while first-time dues
              payers can open the form and enter their details from scratch.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#dues-payment"
                onClick={() => setShowManualForm(true)}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                First-time dues payment
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
              <a
                href="#member-login"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]"
              >
                Member login
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="dues-payment"
        className="bg-[var(--color-surface-soft)] py-8 md:py-10"
      >
        <div className="container">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="order-1 space-y-6 lg:flex-1">
              <div
                id="member-login"
                className="scroll-mt-24 rounded-[var(--radius-md)] border border-[var(--color-primary)]/12 bg-white p-6 shadow-sm md:scroll-mt-28 md:p-7"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-xl">
                    <div className="mb-4 flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        <UserRound size={18} strokeWidth={2.25} aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                          Returning member login
                        </h2>
                        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                          Returning member? Use an OTP to automatically pull in your details.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-primary-deep)]">
                          Email address or phone number
                        </label>
                        <input
                          type="text"
                          placeholder="genny@example.com"
                          className="min-h-[46px] w-full rounded-[var(--radius-sm)] border border-[var(--color-primary)]/18 bg-white px-4 py-3 text-sm text-[var(--color-text-primary)] shadow-[inset_0_1px_0_rgb(255_255_255/0.7)] placeholder:text-[var(--color-text-secondary)] outline-none transition-[border-color,box-shadow,background-color] focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/10"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn-outline min-h-[44px] justify-center sm:px-5"
                      >
                        Continue with OTP
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowManualForm((current) => !current)}
                    aria-expanded={showManualForm}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)]"
                  >
                    {showManualForm
                      ? "Hide first-time form"
                      : "First time paying dues?"}
                    <ChevronDown
                      size={16}
                      strokeWidth={2.25}
                      aria-hidden="true"
                      className={`transition-transform duration-200 ${
                        showManualForm ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div
                aria-hidden={!showManualForm}
                style={{ maxHeight: showManualForm ? `${manualFormHeight}px` : "0px" }}
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                  showManualForm
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <div
                  ref={manualFormInnerRef}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-sm md:p-8"
                >
                  <div className="mb-6 flex items-center gap-2">
                    <FileText
                      size={19}
                      strokeWidth={2.25}
                      aria-hidden="true"
                      className="text-[var(--color-primary)]"
                    />
                    <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                      First-Time Dues Payment
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
                      Use this form if you are paying dues for the first time.
                    </p>
                  </div>

                  <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Full name</label>
                      <input
                        type="text"
                        placeholder="Genny Amadapah"
                        className={fieldCls}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Email address</label>
                      <input
                        type="email"
                        placeholder="genny@example.com"
                        className={fieldCls}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Phone number</label>
                      <input
                        type="tel"
                        placeholder="+233 xx xxx xxxx"
                        className={fieldCls}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Dues period</label>
                      <SelectField
                        name="selectedMonths"
                        value={selectedMonths}
                        onChange={(event) => setSelectedMonths(event.target.value)}
                        className={fieldCls}
                        options={duesPeriodOptions}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <PaymentHistoryAccessCard className="hidden lg:block" />
            </div>

            <div className="order-2 space-y-4 lg:w-[330px] lg:shrink-0 lg:sticky lg:top-28">
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
                      x {Number(selectedMonths)}
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
                  {formError && (
                    <p className="text-sm text-red-600">{formError}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleFirstTimeSubmit}
                    disabled={submitting || !showManualForm}
                    className={`btn-primary w-full justify-center${submitting || !showManualForm ? " cursor-not-allowed opacity-50" : ""}`}
                  >
                    {submitting ? "Processing…" : "Continue to checkout"}
                    <ArrowRight size={15} strokeWidth={2.25} aria-hidden="true" />
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

            <PaymentHistoryAccessCard className="order-3 lg:hidden" />
          </div>
        </div>
      </section>
    </>
  );
}
