import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Handshake,
  Lightbulb,
  School,
} from "lucide-react";

const audiences = [
  {
    icon: School,
    title: "School Learners",
    badge: "Basic to SHS learners",
    description:
      "Practical STEM, electronics, coding, and project-based learning designed to build confidence early.",
  },
  {
    icon: Lightbulb,
    title: "Out-of-School Youth",
    badge: "Ages 16–30",
    description:
      "Practical innovation training for employable skills and community solutions that can grow into real opportunities.",
  },
  {
    icon: GraduationCap,
    title: "University Students & Graduates",
    badge: "Portfolio-building",
    description:
      "Electronics, software, AI, and product development experience that helps strengthen technical portfolios.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Working Professionals",
    badge: "Applied productivity",
    description:
      "Learn automation, AI tools, and practical digital productivity skills you can use in real workflows.",
  },
  {
    icon: Building2,
    title: "Schools & Institutions",
    badge: "Structured implementation",
    description:
      "Bring structured STEM learning, practical tools, and learner projects into classrooms with better support.",
  },
  {
    icon: Handshake,
    title: "NGOs, CSR & Community Partners",
    badge: "Group sponsorship",
    description:
      "Support cohorts of learners through practical innovation programmes built around measurable learning outcomes.",
  },
];

function AudienceCard({ icon: Icon, title, badge, description }) {
  return (
    <article className="card-interactive group flex h-full flex-col p-6 sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-primary)_10%,white)] text-[var(--color-primary)] transition-transform duration-300 group-hover:-translate-y-1">
          <Icon size={22} strokeWidth={2.1} />
        </div>
        <span className="rounded-full border border-[var(--color-border-soft)] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          {badge}
        </span>
      </div>

      <h3 className="mb-3 text-lg font-black leading-snug text-[var(--color-text-primary)]">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-[15px]">
        {description}
      </p>
    </article>
  );
}

export default function WhoItIsFor() {
  return (
    <section
      aria-label="Who ERA AXIS is for"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#fcfbff_0%,var(--color-surface-soft)_100%)] py-20 md:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(201,163,255,0.16),transparent_72%)]"
      />

      <div className="container relative z-10">
        <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.72fr)] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Who It&apos;s For
            </p>
            <h2 className="mb-5 text-3xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-[2.7rem]">
              Built for learners, builders, and institutions ready to grow.
            </h2>
            <p className="text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-[17px]">
              ERA AXIS is built for students, out-of-school youth, working
              adults, schools, communities, and partners who want practical
              STEM and digital skills that lead to real outcomes.
            </p>
          </div>

          <div className="glass-surface-light rounded-[var(--radius-lg)] p-5 sm:p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Practical outcomes
            </p>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-[15px]">
              Every pathway is designed to move from learning concepts to
              building projects, applying tools, and creating visible progress.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {audiences.map((audience) => (
            <AudienceCard key={audience.title} {...audience} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 sm:mt-12 sm:flex-row sm:items-center">
          <Link to="/programs" className="btn-primary">
            Explore programmes
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
          <Link to="/payments" className="btn-outline">
            Enrol now
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
