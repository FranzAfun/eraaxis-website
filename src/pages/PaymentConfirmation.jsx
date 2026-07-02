import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import { formatGhs } from "../data/payments";
import { getPageSeo } from "../data/seo";

const MAX_ATTEMPTS = 5;
const DELAY_MS = 3000;

function formatPaidAt(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PaymentConfirmation() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  // loading | pending | success | failed | error
  const [status, setStatus] = useState(() => (reference ? "loading" : "error"));
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    if (!reference) return;

    let cancelled = false;

    async function fetchReceipt(ref, attempt) {
      try {
        const res = await fetch(`/api/website/payments/${encodeURIComponent(ref)}/receipt`);
        if (cancelled) return;

        if (res.status === 404) {
          setStatus("pending");
          if (attempt >= MAX_ATTEMPTS) return;
          await new Promise((r) => setTimeout(r, DELAY_MS));
          if (!cancelled) return fetchReceipt(ref, attempt + 1);
          return;
        }

        const json = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok || !json?.success) {
          setStatus("error");
          return;
        }
        setReceipt(json.data);
        setStatus("success");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    async function run() {
      try {
        const verifyRes = await fetch(`/api/website/payments/verify/${encodeURIComponent(reference)}`);
        if (cancelled) return;
        const verifyJson = await verifyRes.json().catch(() => null);
        if (cancelled) return;

        if (!verifyRes.ok || !verifyJson?.success) {
          setStatus("error");
          return;
        }
        if (verifyJson.data.status !== "success") {
          setStatus("failed");
          return;
        }
        await fetchReceipt(reference, 1);
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    run();
    return () => { cancelled = true; };
  }, [reference]);

  return (
    <>
      <SEO {...getPageSeo("/payments/confirmation")} />
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
              <p className="text-base text-white/60">Confirming your payment…</p>
            </div>
          )}

          {status === "pending" && (
            <div className="mx-auto max-w-lg">
              <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
                Processing
              </p>
              <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                Your payment is still processing.
              </h1>
              <p className="mb-3 text-base leading-relaxed text-white/68">
                This can take a few moments. We&apos;ll email you a receipt as soon as it&apos;s confirmed.
              </p>
              {reference && (
                <p className="mb-8 font-mono text-sm text-white/50">{reference}</p>
              )}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-6 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                Refresh Status <ArrowRight size={16} />
              </button>
            </div>
          )}

          {status === "success" && (
            <div className="mx-auto max-w-lg">
              <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
                Payment Confirmed
              </p>
              <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                Thank you, {receipt?.customer?.fullName || "friend"}.
              </h1>
              <p className="mb-3 text-base leading-relaxed text-white/68">
                Your payment for <strong className="text-white">{receipt?.programme?.name}</strong> has been received.
                A copy of your receipt has been emailed to you.
              </p>
              <p className="mb-8 text-sm text-white/50">
                Didn&apos;t receive it? Contact us with your reference number —{" "}
                <Link to="/contact" className="text-[var(--color-accent)] underline">
                  get in touch
                </Link>
                .
              </p>

              <div className="mb-8 space-y-3 rounded-[var(--radius-md)] border border-white/15 bg-white/[0.06] p-5 text-left backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-white/60">Reference</span>
                  <span className="font-mono text-white">{receipt?.reference}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-white/60">Amount Paid</span>
                  <span className="font-semibold text-white">
                    {formatGhs(receipt?.amount?.amountPaid ?? 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-white/60">Paid</span>
                  <span className="text-white">{formatPaidAt(receipt?.paidAt)}</span>
                </div>
              </div>

              <Link
                to="/"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-6 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                Back to Home <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {(status === "failed" || status === "error") && (
            <div className="mx-auto max-w-lg">
              <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                {status === "failed" ? "Payment not completed" : "Something went wrong"}
              </h1>
              <p className="mb-8 text-base leading-relaxed text-white/68">
                {status === "failed"
                  ? "Paystack reported that this payment was not successful. No charge should have been made. Please try again."
                  : "We couldn't confirm this payment. If money was deducted from your account, please contact us with your reference number."}
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
        </div>
      </section>
    </>
  );
}
