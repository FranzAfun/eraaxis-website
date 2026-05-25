import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, UserRound } from "lucide-react";
import { insights } from "../data/insights";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderSection(section, i) {
  switch (section.type) {
    case "heading":
      return (
        <h2
          key={i}
          className="mb-4 mt-10 text-xl font-black leading-snug tracking-tight text-[var(--color-text-primary)] first:mt-0 sm:text-2xl"
        >
          {section.text}
        </h2>
      );
    case "subheading":
      return (
        <h3
          key={i}
          className="mb-3 mt-8 text-lg font-bold leading-snug text-[var(--color-text-primary)] first:mt-0"
        >
          {section.text}
        </h3>
      );
    case "paragraph":
      return (
        <p
          key={i}
          className="mb-5 text-base leading-relaxed text-[var(--color-text-secondary)]"
        >
          {section.text}
        </p>
      );
    case "list":
      return (
        <ul key={i} className="mb-5 space-y-2.5">
          {section.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]"
              />
              <span className="text-base leading-relaxed text-[var(--color-text-secondary)]">
                {item}
              </span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

const ctaPrimaryClass =
  "final-cta-btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";
const ctaSecondaryClass =
  "final-cta-btn-secondary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";

export default function InsightDetail() {
  const { slug } = useParams();
  const insight = insights.find((item) => item.slug === slug);

  /* ── Not found ─────────────────────────────────────────────────────────── */
  if (!insight) {
    return (
      <section className="bg-[var(--color-surface-soft)] py-24">
        <div className="container text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Insights
          </p>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Insight not found
          </h1>
          <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-[var(--color-text-secondary)]">
            The insight you are looking for does not exist or may have been
            removed.
          </p>
          <Link
            to="/insights"
            className="btn-primary inline-flex min-h-[44px] items-center gap-2"
          >
            Back to Insights <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  const hasImages = insight.images && insight.images.length > 0;

  return (
    <>
      {/* ── Article header ─────────────────────────────────────────────────── */}
      <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-14 pt-36 text-white md:pb-20 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 18%, color-mix(in srgb, var(--color-accent) 24%, transparent) 0%, transparent 30%), radial-gradient(circle at 84% 8%, color-mix(in srgb, var(--color-primary) 38%, transparent) 0%, transparent 34%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-28 top-28 h-80 w-80 rounded-full bg-white/[0.05] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-4 h-96 w-96 rounded-full bg-[var(--color-accent)]/10 blur-3xl"
        />
        <div className="container relative z-10">
          {/* Back link */}
          <Link
            to="/insights"
            className="mb-8 flex w-fit items-center gap-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={12} strokeWidth={2.5} />
            Back to Insights
          </Link>

          <div className="mx-auto max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
              {insight.type}
            </p>
            <h1 className="mb-5 text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
              {insight.title}
            </h1>
            <p className="mb-7 text-lg leading-relaxed text-white/72">
              {insight.excerpt}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5">
              <span className="inline-flex items-center gap-2 text-sm text-white/55">
                <UserRound size={14} strokeWidth={1.75} aria-hidden="true" />
                {insight.author}
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-white/55">
                <CalendarDays size={14} strokeWidth={1.75} aria-hidden="true" />
                {formatDate(insight.publishedAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured image ─────────────────────────────────────────────────── */}
      {insight.featuredImage && (
        <div className="bg-white">
          <div className="container pt-0">
            <img
              src={insight.featuredImage}
              alt={insight.title}
              className="w-full rounded-[var(--radius-lg)] object-cover shadow-[var(--shadow-soft)] md:max-h-[480px]"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      )}

      {/* ── Article body ───────────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            {insight.body && insight.body.length > 0 ? (
              insight.body.map((section, i) => renderSection(section, i))
            ) : (
              <p className="text-base text-[var(--color-text-muted)]">
                Full article coming soon.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Image gallery ──────────────────────────────────────────────────── */}
      {hasImages && (
        <section className="bg-[var(--color-surface-soft)] py-14 md:py-20">
          <div className="container">
            <h2 className="mb-8 text-xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-2xl">
              Gallery
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {insight.images.map((img, i) => (
                <figure key={i} className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-soft)]">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-52 w-full object-cover"
                  />
                  {img.caption && (
                    <figcaption className="px-4 py-2.5 text-xs text-[var(--color-text-muted)]">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      <section className="final-cta-band relative overflow-hidden py-20 md:py-28">
        <div className="final-cta-orb pointer-events-none absolute inset-0" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
            Want to see practical learning in action?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/80">
            Explore ERA AXIS programmes or reach out to learn more about
            partnerships, school programmes, and youth skills development.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/programs" className={ctaPrimaryClass}>
              Explore Programmes <ArrowRight size={16} />
            </Link>
            <Link to="/insights" className={ctaSecondaryClass}>
              More Insights <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
