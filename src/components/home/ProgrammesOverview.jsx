import { Link } from "react-router-dom";
import { GraduationCap, Users, Monitor, Briefcase, ArrowRight } from "lucide-react";

const programmes = [
  {
    icon: GraduationCap,
    title: "School STEM Programmes",
    text: "Hands-on STEM education for Basic to SHS learners, aligned with classroom learning and built around practical projects.",
    to: "/programs/school-stem",
    cta: "Explore School STEM",
  },
  {
    icon: Users,
    title: "Out-of-School Youth",
    text: "Practical innovation training for young people ready to gain employable skills and build community-focused solutions.",
    to: "/programs/out-of-school-youth",
    cta: "Explore Youth Programme",
  },
  {
    icon: Monitor,
    title: "Online Learning",
    text: "Flexible online training in programming, AI, electronics, PCB design, and digital technology tools.",
    to: "/programs/online-learning",
    cta: "Explore Online Learning",
  },
  {
    icon: Briefcase,
    title: "ERA Digital Skills",
    text: "A practical digital productivity and AI tools programme for workers, professionals, and business owners.",
    to: "/programs/era-digital-skills",
    cta: "Explore Digital Skills",
  },
];

function ProgrammeCard({ icon: Icon, title, text, to, cta }) {
  return (
    <Link
      to={to}
      className="programme-card group flex flex-col rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-border-soft)] hover:shadow-[var(--shadow-soft)]"
    >
      {/* Icon */}
      <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)]">
        <Icon
          size={22}
          strokeWidth={1.75}
          className="text-[var(--color-primary)]"
        />
      </span>

      {/* Title */}
      <h3 className="mb-3 text-base font-bold leading-snug text-[var(--color-text-primary)]">
        {title}
      </h3>

      {/* Body text */}
      <p className="mb-6 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {text}
      </p>

      {/* CTA */}
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] transition-gap duration-200 group-hover:gap-2.5">
        {cta}
        <ArrowRight size={15} strokeWidth={2} />
      </span>
    </Link>
  );
}

export default function ProgrammesOverview() {
  return (
    <section className="bg-[var(--color-surface-soft)] py-20 md:py-24 lg:py-28">
      <div className="container">
        {/* Section header */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Programmes
          </p>
          <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Learning pathways for every stage of growth.
          </h2>
          <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
            From school-based STEM learning to digital skills for working
            adults, ERA AXIS provides practical programmes that help learners
            build real solutions.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {programmes.map((prog) => (
            <ProgrammeCard key={prog.to} {...prog} />
          ))}
        </div>
      </div>
    </section>
  );
}
