import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown } from "lucide-react";
import { insights as STATIC_INSIGHTS } from "../data/insights";
import Reveal from "../components/motion/Reveal";
import ScrollScenes from "../components/motion/ScrollScenes";
import { ProgrammeClose, SectionHead } from "../components/programme/ProgrammeParts";
import { closePrimaryClass, closeSecondaryClass, heroPrimaryClass } from "../components/programme/programmeClasses";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";
import { api } from "../services/api";
import NewsletterForm from "../components/ui/NewsletterForm";
import { resolveMediaUrl } from "../utils/resolveMediaUrl";

const CONTENT_TYPE_LABEL = {
  article:          "Article",
  news:             "News",
  update:           "Update",
  announcement:     "Announcement",
  event_recap:      "Event Recap",
  programme_story:  "Programme Story",
};

const ALL = "All";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Insights() {
  const [apiInsights, setApiInsights] = useState(null);
  const [type, setType] = useState(ALL);

  useEffect(() => {
    let cancelled = false;
    api.get("/insights")
      .then((json) => {
        if (!cancelled) setApiInsights(json?.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setApiInsights([]);
      });
    return () => { cancelled = true; };
  }, []);

  const published = (() => {
    if (!apiInsights || apiInsights.length === 0) {
      return STATIC_INSIGHTS.filter((item) => item.status === "published");
    }
    return apiInsights.map((item) => ({
      slug:         item.slug,
      title:        item.title,
      excerpt:      item.excerpt,
      type:         CONTENT_TYPE_LABEL[item.content_type] || "Insight",
      author:       "ERA AXIS",
      publishedAt:  item.published_at,
      featuredImage: resolveMediaUrl(item.featured_image_url),
    }));
  })();

  // The kinds of writing there are, in the order they first appear.
  const types = [...new Set(published.map((item) => item.type))];
  const chosen = types.includes(type) ? type : ALL;
  const shown = chosen === ALL ? published : published.filter((item) => item.type === chosen);

  return (
    <ScrollScenes>
      <SEO {...getPageSeo("/insights")} />
      <section className="dark-surface hero-ground relative -mt-20 overflow-hidden pb-16 pt-36 text-white md:pb-24 md:pt-44">
        <div className="container relative z-10" data-scene="hero-exit">
          <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">
            Insights
          </p>
          <h1 className="mb-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
            Ideas, stories and updates from practical STEM learning.
          </h1>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-lg">
            STEM education, digital skills and stories from our programmes.
          </p>
          <a href="#insights-listing" className={heroPrimaryClass}>
            Read the latest
            <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section id="insights-listing" className="soft-field scroll-mt-20 py-20 md:py-24">
        <div className="container">
          <SectionHead eyebrow="Latest" title="Latest insights." className="mb-6" />

          {types.length > 1 && (
            <Reveal className="mb-8">
              <div role="group" aria-label="Show insights of one kind" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible">
                {[ALL, ...types].map((label) => {
                  const on = label === chosen;
                  return (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setType(label)}
                      className={`inline-flex min-h-[44px] shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition-all duration-300 ${
                        on
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[0_10px_30px_-14px_var(--color-primary)]"
                          : "border-[var(--color-ui-border)] bg-white/70 text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </Reveal>
          )}

          {shown.length === 0 ? (
            <p className="text-base text-[var(--color-text-secondary)]">No published insights yet. Check back soon.</p>
          ) : (
            <ul key={chosen} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((item, i) => (
                <Reveal as="li" key={item.slug} delay={(i % 3) * 80} className="flex">
                  <Link to={`/insights/${item.slug}`} className="card-interactive group flex w-full flex-col overflow-hidden">
                    {item.featuredImage && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={item.featuredImage}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">{item.type}</p>
                      <h3 className="mb-2 text-lg font-bold leading-snug text-[var(--color-text-primary)]">{item.title}</h3>
                      <p className="mb-5 line-clamp-3 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{item.excerpt}</p>
                      <div className="mt-auto flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-4">
                        <p className="text-sm text-[var(--color-text-secondary)]">{formatDate(item.publishedAt)}</p>
                        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-[var(--color-primary)] transition-[gap] duration-200 group-hover:gap-2.5">
                          Read
                          <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="container">
          <Reveal className="glass mx-auto max-w-2xl p-8 text-center md:p-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">Stay connected</p>
            <h2 className="mb-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">Get updates from ERA AXIS.</h2>
            <p className="mb-7 text-base leading-relaxed text-[var(--color-text-secondary)]">Insights, programme news and learner stories in your inbox.</p>
            <NewsletterForm source="insights" />
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">You can unsubscribe at any time.</p>
          </Reveal>
        </div>
      </section>

      <ProgrammeClose
        title="See practical learning in action."
        actions={
          <>
            <Link to="/programs" className={closePrimaryClass}>
              Explore Programmes
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <Link to="/contact" className={closeSecondaryClass}>
              Contact ERA
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </>
        }
      />
    </ScrollScenes>
  );
}
