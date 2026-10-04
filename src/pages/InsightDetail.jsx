import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, UserRound } from "lucide-react";
import { insights as STATIC_INSIGHTS } from "../data/insights";
import NewsletterForm from "../components/ui/NewsletterForm";
import SEO from "../components/SEO";
import { api } from "../services/api";
import { resolveArticleMedia, resolveMediaUrl } from "../utils/resolveMediaUrl";

import { Waiting } from "../components/ui/BusyLabel";
const CONTENT_TYPE_LABEL = {
  article:         "Article",
  news:            "News",
  update:          "Update",
  announcement:    "Announcement",
  event_recap:     "Event Recap",
  programme_story: "Programme Story",
};

function formatDate(iso) {
  if (!iso) return "";
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
  // Keyed by slug so a slug change is detected by comparing against the
  // fetch result's own slug, instead of resetting state synchronously inside
  // the effect body (which triggers a redundant extra render).
  const [fetched, setFetched] = useState({ slug: null, insight: undefined });

  useEffect(() => {
    let cancelled = false;
    api.get(`/insights/${slug}`)
      .then((json) => { if (!cancelled) setFetched({ slug, insight: json?.data ?? null }); })
      .catch(() => { if (!cancelled) setFetched({ slug, insight: null }); });
    return () => { cancelled = true; };
  }, [slug]);

  const apiInsight = fetched.slug === slug ? fetched.insight : undefined;

  /* ── Loading ─────────────────────────────────────────────────────────────── */
  if (apiInsight === undefined) {
    return (
      <section className="bg-[var(--color-surface-soft)] py-24">
        <div className="container text-center">
          <Waiting className="text-sm text-[var(--color-text-muted)]">Loading…</Waiting>
        </div>
      </section>
    );
  }

  /* ── Data resolution: API → static fallback → not found ─────────────────── */
  const staticInsight = STATIC_INSIGHTS.find((item) => item.slug === slug);
  const insight = apiInsight ?? (staticInsight ? { ...staticInsight, _isStatic: true } : null);

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

  /* ── Normalise fields across API and static shapes ───────────────────────── */
  const title       = insight.title;
  const excerpt     = insight.excerpt;
  const publishedAt = insight.publishedAt ?? insight.published_at;
  const author      = insight._isStatic ? insight.author : "ERA AXIS";
  const typeLabel   = insight._isStatic
    ? insight.type
    : (CONTENT_TYPE_LABEL[insight.contentType] || "Insight");

  // Featured image: API returns a relative S3 path or an absolute pasted URL,
  // static returns null or an imported asset.
  const featuredImageSrc = insight._isStatic
    ? insight.featuredImage ?? null
    : resolveMediaUrl(insight.featuredImageUrl);

  // SEO
  const seoTitle       = insight.seoTitle || title;
  const seoDescription = insight.seoDescription || excerpt;

  // Content
  const cmsContent = !insight._isStatic ? resolveArticleMedia(insight.content) : null;
  const staticBody  = insight._isStatic ? insight.body : null;
  const staticImages = insight._isStatic && insight.images?.length > 0 ? insight.images : [];

  return (
    <>
      <SEO title={seoTitle} description={seoDescription} />

      {/* ── Article header ─────────────────────────────────────────────────── */}
      <section className="dark-surface relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-14 pt-36 text-white md:pb-20 md:pt-44">
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
          <Link
            to="/insights"
            className="mb-8 flex w-fit items-center gap-1.5 text-xs font-medium text-[var(--color-text-on-dark-muted)] transition-colors hover:text-white"
          >
            <ArrowLeft size={12} strokeWidth={2.5} />
            Back to Insights
          </Link>

          <div className={featuredImageSrc ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-14" : "mx-auto max-w-3xl"}>
          <div>
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)] backdrop-blur-xl">
              {typeLabel}
            </p>
            <h1 className="mb-5 text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mb-7 text-lg leading-relaxed text-[var(--color-text-on-dark-muted)]">
              {excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5">
              <span className="inline-flex items-center gap-2 text-sm text-[var(--color-text-on-dark-muted)]">
                <UserRound size={14} strokeWidth={1.75} aria-hidden="true" />
                {author}
              </span>
              {publishedAt && (
                <span className="inline-flex items-center gap-2 text-sm text-[var(--color-text-on-dark-muted)]">
                  <CalendarDays size={14} strokeWidth={1.75} aria-hidden="true" />
                  {formatDate(publishedAt)}
                </span>
              )}
            </div>
          </div>
          {/* The featured image beside the title, as the Partners and Dev Board
              pages show theirs; on a phone it follows the title instead. */}
          {featuredImageSrc && (
            <div className="relative">
              <div className="hero-media-card">
                <img
                  src={featuredImageSrc}
                  alt={title}
                  className="aspect-[4/3] w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          )}
          </div>
        </div>
      </section>

      {/* ── Article body ───────────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            {cmsContent ? (
              /* CMS TipTap HTML */
              <div
                className="flow-root text-base leading-relaxed text-[var(--color-text-secondary)]
                  [&_h1]:mb-4 [&_h1]:mt-10 [&_h1]:text-2xl [&_h1]:font-black [&_h1]:leading-snug [&_h1]:tracking-tight [&_h1]:text-[var(--color-text-primary)] [&_h1]:first:mt-0
                  [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-black [&_h2]:leading-snug [&_h2]:tracking-tight [&_h2]:text-[var(--color-text-primary)] [&_h2]:first:mt-0
                  [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:leading-snug [&_h3]:text-[var(--color-text-primary)] [&_h3]:first:mt-0
                  [&_p]:mb-5 [&_p]:leading-relaxed
                  [&_ul]:mb-5 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc
                  [&_ol]:mb-5 [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:list-decimal
                  [&_li]:leading-relaxed
                  [&_strong]:font-bold [&_strong]:text-[var(--color-text-primary)]
                  [&_em]:italic
                  [&_a]:text-[var(--color-primary)] [&_a]:underline [&_a]:underline-offset-2
                  [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-primary)]/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[var(--color-text-muted)]
                  [&_hr]:my-8 [&_hr]:border-[var(--color-border)]
                  [&_figure]:my-8 [&_figure]:mx-auto [&_figure]:max-w-full [&_figure]:text-center
                  [&_figure_img]:mx-auto [&_figure_img]:w-full [&_figure_img]:max-w-full [&_figure_img]:max-h-[420px] [&_figure_img]:rounded-[var(--radius-md)] [&_figure_img]:object-cover [&_figure_img]:shadow-[var(--shadow-soft)]
                  [&_figcaption]:mt-2.5 [&_figcaption]:text-xs [&_figcaption]:italic [&_figcaption]:text-[var(--color-text-muted)] [&_figcaption:empty]:hidden
                  [&_figure.figure-align-left]:float-left [&_figure.figure-align-left]:mr-6 [&_figure.figure-align-left]:mb-4 [&_figure.figure-align-left]:mt-1 [&_figure.figure-align-left]:w-[45%] [&_figure.figure-align-left]:text-left
                  [&_figure.figure-align-left_img]:max-h-[280px]
                  [&_figure.figure-align-wide]:w-screen [&_figure.figure-align-wide]:max-w-[900px] [&_figure.figure-align-wide]:ml-[calc(50%-50vw)] [&_figure.figure-align-wide]:mr-[calc(50%-50vw)]
                  [&_img]:w-full [&_img]:max-w-full [&_img]:max-h-[420px] [&_img]:rounded-[var(--radius-md)]"
                dangerouslySetInnerHTML={{ __html: cmsContent }}
              />
            ) : staticBody && staticBody.length > 0 ? (
              /* Static body[] fallback */
              staticBody.map((section, i) => renderSection(section, i))
            ) : (
              <p className="text-base text-[var(--color-text-muted)]">
                This article is being prepared and will be published here soon.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Image gallery (static fallback only) ───────────────────────────── */}
      {staticImages.length > 0 && (
        <section className="bg-[var(--color-surface-soft)] py-14 md:py-20">
          <div className="container">
            <h2 className="mb-8 text-xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-2xl">
              Gallery
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {staticImages.map((img, i) => (
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

      {/* ── Newsletter strip ───────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-14 md:py-18">
        <div className="container">
          <div className="mx-auto max-w-xl text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Stay connected
            </p>
            <h2 className="mb-3 text-xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-2xl">
              Get more insights from ERA AXIS.
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Subscribe to receive new insights, programme stories, and learner
              updates directly in your inbox.
            </p>
            <NewsletterForm source="article" />
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">
              You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      <section className="dark-surface final-cta-band relative overflow-hidden py-20 md:py-28">
        <div className="final-cta-orb pointer-events-none absolute inset-0" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
            Want to see practical learning in action?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-[var(--color-text-on-dark-muted)]">
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
