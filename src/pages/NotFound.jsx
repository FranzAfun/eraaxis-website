import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  function handleGoBack() {
    const historyIndex = window.history.state?.idx;

    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate("/");
  }

  return (
    <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-16 pt-36 text-white md:pb-24 md:pt-44">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 18%, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, transparent 28%), radial-gradient(circle at 82% 10%, color-mix(in srgb, var(--color-primary) 40%, transparent) 0%, transparent 34%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 52%, var(--color-background-dark) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/[0.08] blur-3xl"
      />
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
            Error 404
          </p>

          <div className="notfound-wave mb-8 flex items-center justify-center gap-4 sm:gap-6">
            <span className="notfound-wave-char text-[clamp(4.5rem,17vw,9rem)] font-black leading-none tracking-[-0.06em] text-white/96">
              4
            </span>
            <span
              aria-hidden="true"
              className="notfound-axis-line h-14 w-px rounded-full bg-gradient-to-b from-transparent via-[var(--color-accent)]/85 to-transparent sm:h-[4.5rem]"
            />
            <span className="notfound-wave-char text-[clamp(4.5rem,17vw,9rem)] font-black leading-none tracking-[-0.06em] text-white/96">
              0
            </span>
            <span className="notfound-wave-char text-[clamp(4.5rem,17vw,9rem)] font-black leading-none tracking-[-0.06em] text-white/96">
              4
            </span>
          </div>

          <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
            This page drifted off-axis.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
            The page you&apos;re looking for may have moved, been renamed, or
            no longer exists.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="cta-mobile-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
            >
              Go Home
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link
              to="/programs"
              className="cta-mobile-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]"
            >
              Explore Programmes
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleGoBack}
              className="cta-mobile-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/15 bg-transparent px-5 text-sm font-semibold text-white/82 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/28 hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
