import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useBootstrap } from "../../hooks/useBootstrap";
import { insights as STATIC_INSIGHTS } from "../../data/insights";

const CONTENT_TYPE_LABEL = {
  article: "Article",
  news: "News",
  update: "Update",
  announcement: "Announcement",
  event_recap: "Event Recap",
  programme_story: "Programme Story",
};

function InsightCard({ type, title, excerpt, slug, isVisible, reducedMotion, index }) {
  const delay = reducedMotion ? 0 : index * 100;

  return (
    <Link
      to={`/insights/${slug}`}
      className={`insights-card group flex flex-col p-7 transition-all duration-500 ease-out hover:-translate-y-1 hover:duration-300 ${
        isVisible || reducedMotion
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
        {type}
      </p>
      <h3 className="mb-3 text-base font-bold leading-snug text-white">
        {title}
      </h3>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-white/55">
        {excerpt}
      </p>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] transition-[gap] duration-200 group-hover:gap-2.5">
        Read insight
        <ArrowRight size={15} strokeWidth={2} />
      </span>
    </Link>
  );
}

export default function InsightsPreview() {
  const { featuredInsights } = useBootstrap();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const insights =
    featuredInsights.length > 0
      ? featuredInsights.map((item) => ({
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt,
          type: CONTENT_TYPE_LABEL[item.content_type] || "Insight",
        }))
      : STATIC_INSIGHTS;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="insights"
      ref={sectionRef}
      aria-label="Insights preview"
      className="bg-[var(--color-background-dark)] pt-8 pb-16 md:pt-10 md:pb-20 lg:pt-12 lg:pb-24"
    >
      <div className="container">
        {/* Section header + CTA row */}
        <div
          className={`mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mb-10 transition-all duration-500 ease-out ${
            isVisible || reducedMotion
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
        >
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
              Insights
            </p>
            <h2 className="mb-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              Thinking behind the work.
            </h2>
            <p className="text-base leading-relaxed text-white/60">
              Perspectives on STEM education, digital skills, and how practical
              learning shapes better outcomes.
            </p>
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
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((item, i) => (
            <InsightCard
              key={item.slug}
              {...item}
              isVisible={isVisible}
              reducedMotion={reducedMotion}
              index={i}
            />
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
