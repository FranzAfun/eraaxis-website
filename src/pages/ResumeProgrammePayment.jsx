import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";
import { formatGhs, calculatePaymentBreakdown } from "../data/payments";
import SelectField from "../components/ui/SelectField";

const labelCls =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-white/70";

function buildMonthOptions(durationMonths, monthsPaidTotal) {
  if (durationMonths) {
    const remaining = Math.max(1, durationMonths - monthsPaidTotal);
    return Array.from({ length: remaining }, (_, i) => {
      const n = i + 1;
      return { value: String(n), label: `${n} Month${n > 1 ? "s" : ""}` };
    });
  }
  return [
    { value: "1", label: "1 Month (Current)" },
    { value: "3", label: "Quarter" },
    { value: "6", label: "Half Year" },
    { value: "12", label: "1 Year" },
  ];
}

export default function ResumeProgrammePayment() {
  const { enrolmentId } = useParams();

  // loading | not-found | paid-up | owes | error
  const [status, setStatus] = useState("loading");
  const [summary, setSummary] = useState(null);
  const [months, setMonths] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch(`/api/website/enrolments/${enrolmentId}/summary`);
        if (cancelled) return;

        if (res.status === 404) {
          setStatus("not-found");
          return;
        }

        const json = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok || !json?.success) {
          setStatus("error");
          return;
        }

        setSummary(json.data);
        setMonths(buildMonthOptions(json.data.durationMonths, json.data.monthsPaidTotal)[0].value);
        setStatus(json.data.hasDueObligation ? "owes" : "paid-up");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    run();
    return () => { cancelled = true; };
  }, [enrolmentId]);

  async function handlePayNow() {
    setPayError("");
    setSubmitting(true);
    try {
      const payRes = await fetch("/api/website/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrolment_id: enrolmentId, months_paid: Number(months) }),
      });
      const payData = await payRes.json();
      if (!payData.success) throw new Error(payData.error || "Payment initialisation failed.");
      window.location.href = payData.data.authorizationUrl;
    } catch (err) {
      setPayError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const monthOptions = summary ? buildMonthOptions(summary.durationMonths, summary.monthsPaidTotal) : [];
  const breakdown = summary ? calculatePaymentBreakdown(summary.instalmentAmount * Number(months)) : null;

  return (
    <>
      <SEO {...getPageSeo("/payments/resume")} />
      <section className="relative -mt-20 min-h-[60vh] overflow-hidden bg-[var(--color-background-dark)] pb-20 pt-40 text-white md:pb-28 md:pt-52">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--color-accent) 18%, transparent) 0%, transparent 30%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div className="container relative z-10 text-center">
          {status === "loading" && (
            <div>
              <div className="mb-6 flex items-center justify-center gap-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="h-3 w-3 rounded-full bg-[var(--color-accent)]"
                    style={{
                      animation: "chaseDotGlow 1.2s ease-in-out infinite",
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
              <p className="text-base text-white/60">Looking up your payment…</p>
            </div>
          )}

          {status === "not-found" && (
            <div className="mx-auto max-w-lg">
              <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                We couldn&apos;t find this payment link.
              </h1>
              <p className="mb-8 text-base leading-relaxed text-white/68">
                This link may be out of date. Please contact us if you believe this is a mistake.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/payments"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-6 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                >
                  Back to Payments <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]"
                >
                  Contact ERA AXIS <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mx-auto max-w-lg">
              <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                Something went wrong.
              </h1>
              <p className="mb-8 text-base leading-relaxed text-white/68">
                We couldn&apos;t load your payment details. Please try again shortly.
              </p>
              <Link
                to="/contact"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-6 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                Contact ERA AXIS <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {status === "paid-up" && (
            <div className="mx-auto max-w-lg">
              <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
                All Paid Up
              </p>
              <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                You&apos;re all paid up, {summary?.fullName || "friend"}.
              </h1>
              <p className="mb-8 text-base leading-relaxed text-white/68">
                There&apos;s no outstanding payment on your <strong className="text-white">{summary?.programmeName}</strong> enrolment right now.
              </p>
              <Link
                to="/"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-6 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                Back to Home <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {status === "owes" && summary && (
            <div className="mx-auto max-w-lg text-left">
              <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
                Continue Payment
              </p>
              <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                Welcome back, {summary.fullName}.
              </h1>
              <p className="mb-8 text-base leading-relaxed text-white/68">
                {summary.durationMonths
                  ? `You've paid ${summary.monthsPaidTotal} of ${summary.durationMonths} months for ${summary.programmeName}.`
                  : `Continue your payment for ${summary.programmeName}.`}
              </p>

              <div className="mb-6 space-y-4 rounded-[var(--radius-md)] border border-white/15 bg-white/[0.06] p-5 backdrop-blur-xl">
                <div>
                  <label className={labelCls}>Months to pay now</label>
                  <SelectField
                    name="months"
                    value={months}
                    onChange={(event) => setMonths(event.target.value)}
                    className="min-h-[46px] w-full rounded-[var(--radius-sm)] border border-white/20 bg-white/[0.08] px-4 text-sm text-white"
                    options={monthOptions}
                  />
                </div>

                {breakdown && (
                  <div className="flex items-center justify-between gap-4 border-t border-white/15 pt-4 text-sm">
                    <span className="text-white/60">Total payable</span>
                    <span className="text-xl font-bold text-white">{formatGhs(breakdown.customerTotal)}</span>
                  </div>
                )}
              </div>

              {payError && <p className="mb-4 text-sm text-red-300">{payError}</p>}

              <button
                type="button"
                onClick={handlePayNow}
                disabled={submitting}
                className={`inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-6 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90${submitting ? " cursor-not-allowed opacity-60" : ""}`}
              >
                {submitting ? "Processing…" : "Pay Now"}
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-white/50">
                <Lock size={13} strokeWidth={2} aria-hidden="true" />
                Payments are processed securely via Paystack.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
