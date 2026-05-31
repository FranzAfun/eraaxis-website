import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Call to action — start building with ERA AXIS"
      className="final-cta-band relative overflow-hidden border-t border-white/[0.07] py-16 md:py-20 lg:py-24"
    >
      {/* Decorative accent orb */}
      <div aria-hidden="true" className="final-cta-orb pointer-events-none absolute inset-0" />

      <div className="container relative z-10">
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ease-out ${
            visible || reducedMotion
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}
        >
          {/* Eyebrow */}
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Start Building With ERA AXIS
          </p>

          {/* Heading */}
          <h2 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.5rem]">
            Ready to turn learning into real projects?
          </h2>

          {/* Body */}
          <p className="mb-9 text-base leading-relaxed text-white/60 sm:text-[17px]">
            Whether you are a learner, school, parent, or partner, ERA AXIS
            helps you move from interest to hands-on technology skills.
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              to="/programs"
              className="final-cta-btn-primary cta-mobile-btn flex h-12 max-w-[300px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-7 text-sm font-semibold sm:w-[210px] sm:max-w-none"
            >
              Explore Programmes
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link
              to="/partners"
              className="final-cta-btn-secondary cta-mobile-btn flex h-12 max-w-[300px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-7 text-sm font-semibold sm:w-[210px] sm:max-w-none"
            >
              Partner With ERA
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>

          {/* Small contact link */}
          <p className="mt-7 text-sm text-white/35">
            Have a question?{" "}
            <Link
              to="/contact"
              className="text-white/55 underline underline-offset-2 transition-colors duration-200 hover:text-white"
            >
              Talk to us
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
