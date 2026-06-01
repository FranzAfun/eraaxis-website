import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import schoolStemImg from "../../assets/images/programmes/school-stem-programs.webp";
import outOfSchoolImg from "../../assets/images/programmes/out-of-school-youth.webp";
import onlineLearningImg from "../../assets/images/programmes/online-learning.webp";
import eraDigitalImg from "../../assets/images/programmes/era-digital-skill.webp";

const programmes = [
  {
    image: schoolStemImg,
    title: "School STEM Programmes",
    text: "Hands-on STEM education for Basic to SHS learners, aligned with classroom learning and built around practical projects.",
    to: "/programs/school-stem",
    cta: "Explore School STEM",
  },
  {
    image: outOfSchoolImg,
    title: "Out-of-School Youth",
    text: "Practical innovation training for young people ready to gain employable skills and build community-focused solutions.",
    to: "/programs/out-of-school-youth",
    cta: "Explore Youth Programme",
  },
  {
    image: onlineLearningImg,
    title: "Online Learning",
    text: "Flexible online training in programming, AI, electronics, PCB design, and digital technology tools.",
    to: "/programs/online-learning",
    cta: "Explore Online Learning",
  },
  {
    image: eraDigitalImg,
    title: "ERA Digital Skills",
    text: "A practical digital productivity and AI tools programme for workers, professionals, and business owners.",
    to: "/programs/era-digital-skills",
    cta: "Explore Digital Skills",
  },
];

function ProgrammeCard({ image, title, text, to, cta }) {
  return (
    <Link
      to={to}
      className="card-interactive group flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover brightness-75 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-3 text-base font-bold leading-snug text-[var(--color-text-primary)]">
          {title}
        </h3>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {text}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] transition-gap duration-200 group-hover:gap-2.5">
          {cta}
          <ArrowRight size={15} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}

export default function ProgrammesOverview() {
  return (
    <section className="premium-settle-in bg-[var(--color-surface-soft)] py-20 md:py-24 lg:py-28">
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
