import { useEffect, useRef, useState } from "react";
import { useBootstrap } from "../../hooks/useBootstrap";

const STATIC_METRICS = [
  {
    key: "students",
    fallback: 1000,
    suffix: "+",
    label: "Learners Reached",
  },
  {
    key: "schools",
    fallback: 5,
    suffix: "",
    label: "Partner Schools",
  },
  {
    key: "projects",
    fallback: 100,
    suffix: "+",
    label: "Student Projects",
  },
  {
    key: "partners",
    fallback: 13,
    suffix: "",
    label: "Year-Levels Covered",
  },
];

const DURATION = 1600;

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function useCountUp(target, shouldStart, reducedMotion) {
  const [count, setCount] = useState(() => (reducedMotion ? target : 0));
  const rafRef = useRef(null);

  useEffect(() => {
    if (!shouldStart || reducedMotion) return;
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / DURATION, 1);
      setCount(Math.round(easeOutQuart(progress) * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldStart, target, reducedMotion]);

  return count;
}

function MetricCard({ value, suffix, label, isVisible, reducedMotion, index }) {
  const count = useCountUp(value, isVisible, reducedMotion);
  const delay = reducedMotion ? 0 : index * 90;

  return (
    <div
      className={`glass-dark p-8 transition-all duration-700 ease-out hover:-translate-y-1 hover:duration-300 ${
        isVisible || reducedMotion
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="mb-3 text-5xl font-black leading-none tracking-tight text-[var(--color-accent-text-on-hero)] lg:text-[3.25rem]">
        {count}{suffix}
      </p>
      <p className="text-[0.9375rem] font-bold text-white">{label}</p>
    </div>
  );
}

export default function ImpactMetrics() {
  const { metrics } = useBootstrap();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const METRICS = STATIC_METRICS.map((m) => ({
    ...m,
    value: metrics?.[m.key] || m.fallback,
  }));

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
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Impact and reach"
      className="dark-surface relative overflow-hidden bg-[var(--color-background-dark)] pt-10 pb-20 md:pb-24 lg:pt-0 lg:pb-28"
    >
      {/* Background orb — uses CSS class so no hardcoded colors in JSX */}
      <div aria-hidden="true" className="impact-orb-bg pointer-events-none absolute inset-0" />

      <div className="container relative z-10">
        {/* Section header */}
        <div
          className={`mb-12 max-w-2xl transition-all duration-500 ease-out md:mb-14 ${
            isVisible || reducedMotion
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">
            Our Impact
          </p>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.5rem]">
            Real learners. Real schools. Real projects.
          </h2>
        </div>

        {/* Metrics grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map(({ key, ...metric }, i) => (
            <MetricCard
              key={key}
              {...metric}
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
