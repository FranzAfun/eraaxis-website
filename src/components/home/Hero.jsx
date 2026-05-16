import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
      {/* Background image — loaded eagerly; mobile shifts crop up to show learners */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="sync"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%] sm:object-center"
      />

      {/* Horizontal overlay — deepens from left so left-aligned text stays legible */}
      <div className="hero-overlay-h absolute inset-0" />

      {/* Vertical overlay — darkens top (behind header) and bottom edge */}
      <div className="hero-overlay-v absolute inset-0" />

      {/* Hero content */}
      <div className="container relative z-10 pb-16 pt-28 sm:pb-20 sm:pt-32 md:pb-24 md:pt-36 lg:pb-28 lg:pt-40">
        <div className="hero-content max-w-2xl">
          {/* Eyebrow */}
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-accent)] sm:mb-5">
            Practical STEM &amp; Digital Skills
          </p>

          {/* Headline */}
          <h1 className="mb-4 text-[2rem] font-black leading-[1.15] tracking-tight text-white sm:mb-6 sm:text-5xl sm:leading-[1.1] lg:text-[52px] xl:text-[56px]">
            Building Africa&apos;s Next Generation of&nbsp;Innovators.
          </h1>

          {/* Subtext */}
          <p className="mb-7 max-w-[540px] text-[15px] leading-relaxed text-white/70 sm:mb-10 sm:text-base sm:text-[17px]">
            ERA AXIS equips students, youth, and professionals with practical
            technology skills through hands-on STEM education, software
            development, and innovation programmes.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              to="/programs"
              className="btn-primary group flex h-14 w-full max-w-[320px] items-center justify-center rounded-xl px-7 text-sm font-semibold sm:w-[230px] sm:max-w-none md:w-[250px] md:text-base"
            >
              Explore Programmes
              <ArrowRight
                size={18}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-2"
              />
            </Link>
            <Link
              to="/partners"
              className="btn-secondary group flex h-14 w-full max-w-[320px] items-center justify-center rounded-xl px-7 text-sm font-semibold sm:w-[230px] sm:max-w-none md:w-[250px] md:text-base"
            >
              Partner With ERA
              <ArrowRight
                size={18}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-2"
              />
            </Link>
          </div>

          {/* Stats row — 3-col grid on mobile, flex row on sm+ */}
          <div className="mt-8 grid grid-cols-3 gap-x-4 gap-y-4 border-t border-white/10 pt-6 sm:mt-12 sm:flex sm:flex-wrap sm:gap-x-10 sm:gap-y-5 sm:pt-8">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-xl font-black text-white sm:text-2xl">{value}</p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-white/50 sm:text-xs">
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
