import { useEffect, useRef, useState } from "react";
import { impactStories } from "../../data/impactStories";

function StoryCard({ name, role, quote, image, alt, isVisible, reducedMotion, index }) {
  const delay = reducedMotion ? 0 : index * 100;

  return (
    <figure
      className={`card-interactive flex flex-col p-7 transition-all duration-700 ease-out ${
        isVisible || reducedMotion
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Decorative opening quote mark */}
      <span
        aria-hidden="true"
        className="mb-4 block font-serif text-5xl leading-none text-[var(--color-primary)] opacity-20 select-none"
      >
        &ldquo;
      </span>

      {/* Quote */}
      <blockquote className="mb-6 flex-1">
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {quote}
        </p>
      </blockquote>

      {/* Attribution */}
      <figcaption className="flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
        <img
          src={image}
          alt={alt}
          className="h-11 w-11 shrink-0 rounded-full object-cover object-top ring-2 ring-[var(--color-border-soft)]"
          loading="lazy"
          decoding="async"
        />
        <div>
          <p className="text-sm font-bold leading-snug text-[var(--color-text-primary)]">
            {name}
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export default function ImpactStories() {
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
      aria-label="Impact stories"
      className="bg-[var(--color-surface-soft)] py-14 md:py-16 lg:py-20"
    >
      <div className="container">
        {/* Section header */}
        <div
          className={`mb-12 max-w-2xl transition-all duration-700 ease-out ${
            isVisible || reducedMotion
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Impact Stories
          </p>
          <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Voices from learners building with ERA AXIS.
          </h2>
          <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
            Real learners. Real projects. Real confidence built through
            practical STEM education.
          </p>
        </div>

        {/* Story cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {impactStories.map((story, i) => (
            <StoryCard
              key={story.name}
              {...story}
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
