import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { insights } from "../../data/insights";

function InsightCard({ type, title, excerpt, slug, isVisible, reducedMotion, index }) {
  const delay = reducedMotion ? 0 : index * 100;

  return (
    <Link
      to={`/insights/${slug}`}
      className={`card-interactive group flex flex-col p-7 transition-all duration-700 ease-out ${
        isVisible || reducedMotion
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
        {type}
      </p>
      <h3 className="mb-3 text-base font-bold leading-snug text-[var(--color-text-primary)]">
        {title}
      </h3>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {excerpt}
      </p>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] transition-[gap] duration-200 group-hover:gap-2.5">
        Read insight
        <ArrowRight size={15} strokeWidth={2} />
      </span>
    </Link>
  );
}

export default function InsightsPreview() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      ref={sectionRef}
      aria-label="Insights preview"
      className="bg-[var(--color-background)] py-16 md:py-20 lg:py-24"
    >
      <div className="container">
        {/* Section header + CTA row */}
        <div
          className={`mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between transition-all duration-700 ease-out ${
            isVisible || reducedMotion
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}
        >
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Insights
            </p>
            <h2 className="mb-3 text-3xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
              Thinking behind the work.
            </h2>
            <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
              Perspectives on STEM education, digital skills, and how practical
              learning shapes better outcomes.
            </p>
          </div>

          <Link to="/insights" className="btn-outline shrink-0 self-start sm:self-auto">
            View all insights
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((item, i) => (
            <InsightCard
              key={item.title}
              {...item}
              isVisible={isVisible}
              reducedMotion={reducedMotion}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
