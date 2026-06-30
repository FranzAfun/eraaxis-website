import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Cpu,
  Monitor,
  BookOpen,
  CalendarDays,
  Bell,
  Wrench,
} from "lucide-react";
import { insights as STATIC_INSIGHTS } from "../data/insights";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";
import { api } from "../services/api";
import NewsletterForm from "../components/ui/NewsletterForm";

const MEDIA_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

const CONTENT_TYPE_LABEL = {
  article:          "Article",
  news:             "News",
  update:           "Update",
  announcement:     "Announcement",
  event_recap:      "Event Recap",
  programme_story:  "Programme Story",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const editorialFocus = [
  {
    Icon: Cpu,
    label: "STEM Education",
    body: "Perspectives on hands-on STEM learning, curriculum design, and what effective science and technology education looks like in practice.",
  },
  {
    Icon: Monitor,
    label: "Digital Skills",
    body: "Insights on AI tools, digital productivity, automation, and building confidence with technology for work and everyday life.",
  },
  {
    Icon: BookOpen,
    label: "Programme Stories",
    body: "Stories from ERA AXIS school, youth, and community programmes — how learners engage, what they build, and what changes.",
  },
  {
    Icon: CalendarDays,
    label: "Event Recaps",
    body: "Summaries from ERA AXIS showcases, accelerator events, and ecosystem gatherings where practical learning is shared.",
  },
  {
    Icon: Bell,
    label: "Announcements",
    body: "Programme launches, partnership updates, recognition milestones, and news from the ERA AXIS learning ecosystem.",
  },
  {
    Icon: Wrench,
    label: "Project-Based Learning",
    body: "Why ERA AXIS uses projects as the primary measure of learning — and what that means for how learners are assessed and supported.",
  },
];

const ctaPrimaryClass =
  "final-cta-btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";
const ctaSecondaryClass =
  "final-cta-btn-secondary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";

export default function Insights() {
  const [apiInsights, setApiInsights] = useState(null);

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
      featuredImage: item.featured_image_url
        ? `${MEDIA_BASE}${item.featured_image_url}`
        : null,
    }));
  })();

  return (
    <>
      <SEO {...getPageSeo("/insights")} />
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-16 pt-36 text-white md:pb-24 md:pt-44">
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
          <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
            Insights
          </p>
          <h1 className="mb-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
            Ideas, stories, and updates from practical STEM learning.
          </h1>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
            Explore ERA AXIS perspectives on STEM education, digital skills,
            learner outcomes, programme stories, and the future of practical
            learning in Africa.
          </p>
          <a
            href="#insights-listing"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
          >
            Explore latest insights <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* ── Insight listing ──────────────────────────────────────────────── */}
      <section id="insights-listing" className="bg-white py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Latest insights
          </p>
          <h2 className="mb-3 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Latest insights
          </h2>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            Thought pieces, programme updates, and stories from the ERA AXIS
            learning ecosystem.
          </p>

          {published.length === 0 ? (
            <p className="text-base text-[var(--color-text-muted)]">
              No published insights yet. Check back soon.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {published.map((item) => (
                <Link
                  key={item.slug}
                  to={`/insights/${item.slug}`}
                  className="card-interactive flex flex-col overflow-hidden"
                >
                  {/* Image slot — rendered only when featuredImage exists */}
                  {item.featuredImage && (
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="flex flex-1 flex-col p-7">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                      {item.type}
                    </p>
                    <h3 className="mb-3 text-base font-bold leading-snug text-[var(--color-text-primary)]">
                      {item.title}
                    </h3>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5">
                      <div>
                        <p className="text-xs font-medium text-[var(--color-text-primary)]">
                          {item.author}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {formatDate(item.publishedAt)}
                        </p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-[var(--color-primary)]">
                        Read insight
                        <ArrowRight size={14} strokeWidth={2} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Editorial focus ──────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            What we cover
          </p>
          <h2 className="mb-3 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            One hub, several types of content.
          </h2>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            ERA AXIS Insights is a single public space for ideas, stories, and
            updates across everything we work on.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {editorialFocus.map(({ Icon, label, body }) => (
              <div key={label} className="card-interactive p-7">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] bg-white">
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    className="text-[var(--color-primary)]"
                  />
                </span>
                <h3 className="mb-2 text-base font-bold text-[var(--color-text-primary)]">
                  {label}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="card-interactive mx-auto max-w-2xl p-10 text-center md:p-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Stay connected
            </p>
            <h2 className="mb-4 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Get updates from ERA AXIS.
            </h2>
            <p className="mb-8 text-base leading-relaxed text-[var(--color-text-secondary)]">
              Receive featured insights, programme updates, and learner stories
              directly in your inbox.
            </p>
            <NewsletterForm source="insights" />
            <p className="mt-4 text-xs text-[var(--color-text-muted)]">
              You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="final-cta-band relative overflow-hidden py-20 md:py-28">
        <div className="final-cta-orb pointer-events-none absolute inset-0" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Want to see practical learning in action?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Explore ERA AXIS programmes or talk to the team about partnerships,
            school programmes, and youth skills development.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/programs" className={ctaPrimaryClass}>
              Explore Programmes <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className={ctaSecondaryClass}>
              Contact ERA <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
