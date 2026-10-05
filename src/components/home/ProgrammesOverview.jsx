import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useBootstrap } from "../../hooks/useBootstrap";
import { resolveMediaUrl } from "../../utils/resolveMediaUrl";
import Reveal from "../motion/Reveal";

import schoolStemImg from "../../assets/images/programmes/school-stem-programs.webp";
import outOfSchoolImg from "../../assets/images/programmes/out-of-school-youth.webp";
import onlineLearningImg from "../../assets/images/programmes/online-learning.webp";
import eraDigitalImg from "../../assets/images/programmes/era-digital-skill.webp";

// Real programmes have no admin-managed thumbnail today (images/pricing are
// migration-only) — fall back to the same bundled local asset per category
// that the /programs page uses, rather than a bare gray placeholder.
const CATEGORY_IMAGE = {
  school_stem:         schoolStemImg,
  out_of_school_youth: outOfSchoolImg,
  online_learning:     onlineLearningImg,
  digital_skills:      eraDigitalImg,
};

const STATIC_PROGRAMMES = [
  {
    image: schoolStemImg,
    title: "School STEM Programmes",
    text: "Hands-on STEM from Basic 1 to SHS 3.",
    to: "/programs/school-stem",
    cta: "Explore School STEM",
  },
  {
    image: outOfSchoolImg,
    title: "Out-of-School Youth",
    text: "Employable skills for ages 16 to 30.",
    to: "/programs/out-of-school-youth",
    cta: "Explore Youth Programme",
  },
  {
    image: onlineLearningImg,
    title: "Online Learning",
    text: "Code, AI and electronics, from anywhere.",
    to: "/programs/online-learning",
    cta: "Explore Online Learning",
  },
  {
    image: eraDigitalImg,
    title: "ERA Digital Skills",
    text: "AI tools and automation for your work.",
    to: "/programs/era-digital-skills",
    cta: "Explore Digital Skills",
  },
];

// One line per programme on the homepage; the full story is on its own page.
const CATEGORY_LINE = {
  school_stem: "Hands-on STEM from Basic 1 to SHS 3.",
  out_of_school_youth: "Employable skills for ages 16 to 30.",
  online_learning: "Code, AI and electronics, from anywhere.",
  digital_skills: "AI tools and automation for your work.",
};

const CATEGORY_CTA = {
  school_stem: "Explore School STEM",
  out_of_school_youth: "Explore Youth Programme",
  online_learning: "Explore Online Learning",
  digital_skills: "Explore Digital Skills",
};

function ProgrammeCard({ image, title, text, to, cta }) {
  return (
    <Link
      to={to}
      className="card-interactive group flex w-full flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover brightness-75 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[var(--color-surface-soft)]" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-lg font-bold leading-snug text-[var(--color-text-primary)]">
          {title}
        </h3>
        <p className="mb-5 flex-1 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
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
  const { featuredProgrammes } = useBootstrap();

  const programmes =
    featuredProgrammes.length > 0
      ? featuredProgrammes.map((p) => ({
          image: resolveMediaUrl(p.thumbnail_url) || CATEGORY_IMAGE[p.category] || schoolStemImg,
          title: p.name,
          text: CATEGORY_LINE[p.category] || p.description,
          to: `/programs/${p.slug}`,
          cta: CATEGORY_CTA[p.category] || "Explore Programme",
        }))
      : STATIC_PROGRAMMES;

  return (
    <section className="bg-[var(--color-surface-soft)] py-20 md:py-24 lg:py-28">
      <div className="container">
        {/* Section header */}
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Programmes
          </p>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Learning pathways for every stage of growth.
          </h2>
        </Reveal>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {programmes.map((prog, i) => (
            <Reveal key={prog.to} delay={i * 80} className="flex">
              <ProgrammeCard {...prog} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
