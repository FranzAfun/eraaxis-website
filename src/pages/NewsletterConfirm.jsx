import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import PageLoading from "../components/ui/PageLoading";
import { api } from "../services/api";

const primaryLink = "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-6 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90";
const secondaryLink = "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]";

/**
 * The link in the newsletter confirmation email. Opening it is the yes: the
 * address joins the list only now (it was 'pending' since the sign-up).
 */
export default function NewsletterConfirm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  // "invalid" is knowable from the URL alone, so it is the initial state itself.
  const [status, setStatus] = useState(token ? "loading" : "invalid"); // loading | confirmed | invalid | error
  const asked = useRef(false);

  useEffect(() => {
    if (!token || asked.current) return;
    asked.current = true;
    api.post("/newsletter/confirm", { token })
      .then(() => setStatus("confirmed"))
      .catch((error) => setStatus(error?.status === 404 ? "invalid" : "error"));
  }, [token]);

  return (
    <>
      <SEO title="Confirm your subscription — ERA AXIS" description="Confirm your ERA AXIS newsletter subscription." noindex />
      <section className="dark-surface relative -mt-20 min-h-[60vh] overflow-hidden bg-[var(--color-background-dark)] pb-20 pt-40 text-white md:pb-28 md:pt-52">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--color-accent) 18%, transparent) 0%, transparent 30%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div key={status} className="land-in container relative z-10 text-center">
          {status === "loading" && <PageLoading>Confirming your subscription…</PageLoading>}

          {status === "confirmed" && (
            <div className="mx-auto max-w-lg">
              <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)] backdrop-blur-xl">
                Subscribed
              </p>
              <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                You&apos;re subscribed to ERA AXIS updates.
              </h1>
              <p className="mb-8 text-base leading-relaxed text-[var(--color-text-on-dark-muted)]">
                Insights, programme news and learner stories will come to your inbox. Every email has a link to unsubscribe.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/insights" className={primaryLink}>
                  Read the latest insights <ArrowRight size={16} />
                </Link>
                <Link to="/" className={secondaryLink}>
                  Back to Home <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {status === "invalid" && (
            <div className="mx-auto max-w-lg">
              <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                This link has expired
              </h1>
              <p className="mb-8 text-base leading-relaxed text-[var(--color-text-on-dark-muted)]">
                Confirmation links last a week. Sign up again at the bottom of our home page and we&apos;ll send you a new one.
              </p>
              <Link to="/" className={primaryLink}>
                Back to Home <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="mx-auto max-w-lg">
              <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                We couldn&apos;t confirm it just now
              </h1>
              <p className="mb-8 text-base leading-relaxed text-[var(--color-text-on-dark-muted)]">
                Please check your connection and open the link from the email again.
              </p>
              <Link to="/contact" className={secondaryLink}>
                Contact ERA AXIS <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
