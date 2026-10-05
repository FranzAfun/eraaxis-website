import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useBootstrap } from "../../hooks/useBootstrap";
import { insights as STATIC_INSIGHTS } from "../../data/insights";
import { resolveMediaUrl } from "../../utils/resolveMediaUrl";
import Reveal from "../motion/Reveal";

const CONTENT_TYPE_LABEL = {
  article: "Article",
  news: "News",
  update: "Update",
  announcement: "Announcement",
  event_recap: "Event Recap",
  programme_story: "Programme Story",
};

function InsightCard({ type, title, slug, image }) {
  return (
    <Link
      to={`/insights/${slug}`}
      className="insights-card group flex h-full w-full flex-col transition-transform duration-300 hover:-translate-y-1"
    >
      {image && (
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-44 w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">
          {type}
        </p>
        <h3 className="mb-5 flex-1 text-lg font-bold leading-snug text-white">
          {title}
        </h3>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-text-on-hero)] transition-[gap] duration-200 group-hover:gap-2.5">
          Read
          <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export default function InsightsPreview() {
  const { featuredInsights } = useBootstrap();
  const insights =
    featuredInsights.length > 0
      ? featuredInsights.map((item) => ({
          slug: item.slug,
          title: item.title,
          type: CONTENT_TYPE_LABEL[item.content_type] || "Insight",
          image: resolveMediaUrl(item.featured_image_url),
        }))
      : STATIC_INSIGHTS;

  return (
    <section
      id="insights"
      aria-label="Insights preview"
      className="dark-surface bg-[var(--color-background-dark)] pt-8 pb-16 md:pt-10 md:pb-20 lg:pt-12 lg:pb-24"
    >
      <div className="container">
        {/* Section header + CTA row */}
        <Reveal className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mb-10">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">
              Insights
            </p>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              Thinking behind the work.
            </h2>
          </div>

          <Link
            to="/insights"
            className="btn-secondary group hidden shrink-0 self-start sm:self-auto md:inline-flex"
          >
            View all insights
            <ArrowRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-2"
            />
          </Link>
        </Reveal>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((item, i) => (
            <Reveal key={item.slug} delay={i * 90} className="flex">
              <InsightCard {...item} />
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex md:hidden">
          <Link
            to="/insights"
            className="btn-secondary group w-full justify-center"
          >
            View all insights
            <ArrowRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-2"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
