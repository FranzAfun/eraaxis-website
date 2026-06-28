import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, School, Zap } from "lucide-react";
import partners from "../data/partners";
import mestAfricaLogo from "../assets/partners/mest-africa.webp";
import heroImg from "../assets/partners/unicef-startup-img.webp";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";

const galleryItems = [
  {
    src: heroImg,
    alt: "KOICA UNICEF Startup Lab recognition event",
    caption: "KOICA UNICEF Startup Lab",
    tag: "Recognition",
  },
];

const partnershipAreas = [
  {
    Icon: BookOpen,
    title: "STEM education access",
    body: "Expanding access to practical, hands-on STEM education for schools and community learners across Ghana and underserved communities in Africa.",
  },
  {
    Icon: Users,
    title: "Youth skills development",
    body: "Building digital and technical skills for young people through structured programmes, practical tools, and real learning experiences.",
  },
  {
    Icon: School,
    title: "School and community programmes",
    body: "Working with schools, youth groups, and communities to deliver curriculum-aligned STEM and digital skills learning that creates lasting change.",
  },
  {
    Icon: Zap,
    title: "EdTech innovation and scaling",
    body: "Developing and scaling practical EdTech solutions, including the ERA Kids Development Board and AI-assisted learning support.",
  },
];

const ctaPrimaryClass =
  "final-cta-btn-primary cta-mobile-btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";
const ctaSecondaryClass =
  "final-cta-btn-secondary cta-mobile-btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";

export default function Partners() {
  return (
    <>
      <SEO {...getPageSeo("/partners")} />
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
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">

            {/* Left: text */}
            <div className="flex flex-col justify-center">
              <p className="mb-5 inline-flex w-fit self-start rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
                Partners, Accelerators &amp; Recognition
              </p>
              <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
                Building practical STEM education with the right ecosystem.
              </h1>
              <p className="text-base leading-relaxed text-white/72 sm:text-lg">
                ERA AXIS is supported by a growing network of partners,
                accelerator programs, and organizations advancing innovation,
                education, and youth development.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/contact#enquiry" className={ctaPrimaryClass}>
                  Start partnership conversation
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
                <Link to="/programs" className={ctaSecondaryClass}>
                  Explore Programmes
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
              </div>
            </div>

            {/* Right: image */}
            <div className="relative hidden lg:block">
              <div className="hero-media-card">
                <img
                  src={heroImg}
                  alt="KOICA UNICEF Startup Lab recognition event"
                  className="aspect-[4/3] w-full object-cover"
                />
                {/* Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="hero-media-card-badge inline-block rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    KOICA UNICEF Startup Lab
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Logo grid ────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Our network
          </p>
          <h2 className="mb-3 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Our ecosystem of support.
          </h2>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            Organizations and programmes supporting ERA AXIS through recognition,
            mentorship, capacity building, and practical education partnerships.
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="card-interactive flex flex-col items-center justify-center gap-3 p-5"
              >
                <img
                  src={partner.logo}
                  alt={partner.alt}
                  loading="lazy"
                  decoding="async"
                  className="max-h-12 w-full object-contain object-center"
                />
                <p className="text-center text-xs font-medium text-[var(--color-text-muted)]">
                  {partner.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured support ─────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Featured support
          </p>
          <h2 className="mb-10 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Accelerator &amp; fellowship support.
          </h2>

          <div className="card-interactive overflow-hidden">
            <div className="grid gap-8 p-8 md:grid-cols-2 md:gap-12 md:p-12">

              {/* Logo side */}
              <div className="flex flex-col justify-center gap-6">
                <div className="flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-5 max-w-[11rem]">
                  <img
                    src={mestAfricaLogo}
                    alt="MEST Africa logo"
                    loading="lazy"
                    decoding="async"
                    className="max-h-10 w-full object-contain object-center"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                    EdTech Fellowship
                  </span>
                  <span className="rounded-full border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                    Accelerator Support
                  </span>
                  <span className="rounded-full border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                    Capacity Building
                  </span>
                </div>
              </div>

              {/* Description side */}
              <div className="flex flex-col justify-center">
                <h3 className="mb-4 text-xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-2xl">
                  MEST Africa EdTech Fellowship
                </h3>
                <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
                  MEST Africa is supporting ERA AXIS through the EdTech
                  Fellowship with mentorship, strategic support, and capacity
                  building to help scale our practical STEM education model and
                  reach over 8,000 learners across underserved communities in
                  Africa.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Recognition gallery ──────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Recognition in action
          </p>
          <h2 className="mb-3 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Practical learning shown to the ecosystem.
          </h2>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            ERA AXIS shares its practical STEM learning model through accelerator
            programmes, showcases, and ecosystem events focused on education,
            innovation, and youth development.
          </p>

          <div className="grid gap-4">
            {galleryItems.map((item) => (
              <div
                key={item.caption}
                tabIndex={0}
                className="group relative aspect-[16/9] cursor-default overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] shadow-[var(--shadow-soft)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.04] md:group-focus-within:scale-[1.04]"
                />
                {/* Gradient: always on mobile, fades in on hover/focus on desktop */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/25 to-transparent transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 px-5 pb-5 transition-opacity duration-300 sm:flex-row sm:items-end sm:justify-between sm:gap-4 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                  <p className="text-xs font-semibold leading-snug text-white drop-shadow-sm sm:text-sm">
                    {item.caption}
                  </p>
                  <p className="text-[10px] leading-snug text-white/70 drop-shadow-sm sm:shrink-0 sm:whitespace-nowrap sm:text-xs sm:text-white/75">
                    {item.tag}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partnership areas ────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Partnership areas
          </p>
          <h2 className="mb-10 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Where we work together.
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {partnershipAreas.map(({ Icon, title, body }) => (
              <div key={title} className="card-interactive p-7">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] bg-white">
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    className="text-[var(--color-primary)]"
                  />
                </span>
                <h3 className="mb-2 text-base font-bold text-[var(--color-text-primary)]">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="final-cta-band relative overflow-hidden py-20 md:py-28">
        <div className="final-cta-orb pointer-events-none absolute inset-0" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Work with ERA AXIS.
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Partner with us to expand practical STEM and digital skills learning
            for schools, youth groups, and communities.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/contact#enquiry" className={ctaPrimaryClass}>
              Start Partnership Conversation <ArrowRight size={16} />
            </Link>
            <Link to="/programs" className={ctaSecondaryClass}>
              Explore Programmes <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
