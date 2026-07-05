import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "../components/SEO";

const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export default function NewsletterUnsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // "no-token" is knowable synchronously from the URL, so it's the initial
  // state itself rather than something set from inside the effect below.
  const [status, setStatus] = useState(token ? "loading" : "no-token"); // "loading" | "success" | "error" | "no-token"

  useEffect(() => {
    if (!token) return;

    fetch(`${BASE_URL}/newsletter/unsubscribe/${encodeURIComponent(token)}`)
      .then((res) => {
        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <>
      <SEO title="Unsubscribe — ERA AXIS" description="Unsubscribe from ERA AXIS newsletter updates." />
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
            <p className="text-base text-white/60">Processing your request…</p>
          )}

          {status === "success" && (
            <div className="mx-auto max-w-lg">
              <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
                Unsubscribed
              </p>
              <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                You&apos;re unsubscribed from ERA AXIS updates.
              </h1>
              <p className="mb-8 text-base leading-relaxed text-white/68">
                You won&apos;t receive any further newsletter emails from ERA AXIS.
                You can resubscribe at any time from the Insights page.
              </p>
              <Link
                to="/"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-6 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                Back to Home <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {(status === "error" || status === "no-token") && (
            <div className="mx-auto max-w-lg">
              <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                Link not valid
              </h1>
              <p className="mb-8 text-base leading-relaxed text-white/68">
                This unsubscribe link may have already been used or is no longer valid.
                If you are still receiving emails, please contact us.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-6 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                >
                  Back to Home <ArrowRight size={16} />
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
