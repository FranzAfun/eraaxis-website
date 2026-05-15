import { Link } from "react-router-dom";
import heroBg from "../../assets/images/hero/hero-main.webp";

const stats = [
  { value: "500+", label: "Learners" },
  { value: "STEM", label: "Programmes" },
  { value: "Community", label: "Impact" },
];

export default function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative -mt-20 flex min-h-screen items-center overflow-hidden"
    >
      {/* Background image — loaded eagerly, no layout shift */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="sync"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Horizontal overlay — deepens from left so left-aligned text stays legible */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#06060a]/92 via-[#06060a]/70 to-[#06060a]/20" />

      {/* Vertical overlay — darkens top (behind header) and bottom edge */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06060a]/50 via-transparent to-[#06060a]/55" />

      {/* Hero content */}
      <div className="container relative z-10 pb-24 pt-40 md:pt-44 lg:pt-48">
        <div className="hero-content max-w-2xl">
          {/* Eyebrow */}
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Practical STEM &amp; Digital Skills
          </p>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[68px]">
            Building Africa&apos;s Next Generation of&nbsp;Innovators.
          </h1>

          {/* Subtext */}
          <p className="mb-10 max-w-[540px] text-base leading-relaxed text-white/70 sm:text-[17px]">
            ERA AXIS equips students, youth, and professionals with practical
            technology skills through hands-on STEM education, software
            development, and innovation programmes.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link
              to="/programs"
              className="hero-btn-primary rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-soft)] active:scale-[0.97]"
            >
              Explore Programmes
            </Link>
            <Link
              to="/partners"
              className="hero-btn-secondary rounded-[var(--radius-sm)] border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-white/18 active:scale-[0.97]"
            >
              Partner With ERA
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-8">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-white/50">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
