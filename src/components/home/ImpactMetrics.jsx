import { useEffect, useRef, useState } from "react";

const METRICS = [
  {
    value: 500,
    suffix: "+",
    label: "Learners Reached",
    description:
      "Students and youth trained through ERA AXIS school and community programmes.",
  },
  {
    value: 5,
    suffix: "",
    label: "Partner Schools",
    description:
      "Schools actively embedding hands-on STEM into everyday classroom learning.",
  },
  {
    value: 100,
    suffix: "+",
    label: "Student Projects",
    description:
      "Real projects built by learners across electronics, coding, and digital design.",
  },
  {
    value: 13,
    suffix: "",
    label: "Year-Levels Covered",
    description:
      "From Basic 1 through SHS 3 — a complete school learning journey.",
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

function MetricCard({ value, suffix, label, description, isVisible, reducedMotion, index }) {
  const count = useCountUp(value, isVisible, reducedMotion);
  const delay = reducedMotion ? 0 : index * 90;

  return (
    <div
      className={`impact-metric-card rounded-[var(--radius-md)] p-8 transition-all duration-700 ease-out hover:-translate-y-1 hover:duration-300 ${
        isVisible || reducedMotion
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="mb-3 text-5xl font-black leading-none tracking-tight text-[var(--color-accent)] lg:text-[3.25rem]">
        {count}{suffix}
      </p>
      <p className="mb-2 text-[0.9375rem] font-bold text-white">{label}</p>
      <p className="text-sm leading-relaxed text-white/50">{description}</p>
    </div>
  );
}

export default function ImpactMetrics() {
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
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Impact and reach"
      className="relative overflow-hidden bg-[var(--color-background-dark)] pt-10 pb-20 md:pb-24 lg:pt-0 lg:pb-28"
    >
      {/* Background orb — uses CSS class so no hardcoded colors in JSX */}
      <div aria-hidden="true" className="impact-orb-bg pointer-events-none absolute inset-0" />

      <div className="container relative z-10">
        {/* Section header */}
        <div
          className={`mb-12 max-w-2xl transition-all duration-700 ease-out md:mb-14 ${
            isVisible || reducedMotion
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Our Impact
          </p>
          <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.5rem]">
            Measurable outcomes across schools&nbsp;and communities.
          </h2>
          <p className="max-w-[520px] text-base leading-relaxed text-white/60 sm:text-[17px]">
            Every number reflects a real learner, a real school, and a real
            project built through practical STEM education.
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric, i) => (
            <MetricCard
              key={metric.label}
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
