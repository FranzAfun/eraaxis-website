import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown, Hammer, Cpu, FolderOpen, TrendingUp } from "lucide-react";

import schoolStemImg from "../assets/images/programmes/school-stem-programs.webp";
import outOfSchoolImg from "../assets/images/programmes/out-of-school-youth.webp";
import onlineLearningImg from "../assets/images/programmes/online-learning.webp";
import eraDigitalImg from "../assets/images/programmes/era-digital-skill.webp";
import programmesHeroImg from "../assets/images/programmes/programmes-hero.webp";
import Reveal from "../components/motion/Reveal";
import ScrollScenes from "../components/motion/ScrollScenes";
import { ProgrammeClose, ProgrammeHero, SectionHead } from "../components/programme/ProgrammeParts";
import { closePrimaryClass, closeSecondaryClass, heroPrimaryClass, heroSecondaryClass } from "../components/programme/programmeClasses";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";
import { api } from "../services/api";
import { resolveMediaUrl } from "../utils/resolveMediaUrl";

const CATEGORY_IMAGE = {
  school_stem:        schoolStemImg,
  out_of_school_youth: outOfSchoolImg,
  online_learning:    onlineLearningImg,
  digital_skills:     eraDigitalImg,
};

const CATEGORY_AUDIENCE = {
  school_stem:         "Basic 1 – SHS 3",
  out_of_school_youth: "Ages 16 – 30",
  online_learning:     "Remote & self-paced learners",
  digital_skills:      "Working adults & professionals",
};

// Short lines and links for each kind of programme; the long descriptions
// kept in EDOS are used only for a programme without one here.
const CATEGORY_LINE = {
  school_stem:         "Hands-on STEM in school, built around practical projects.",
  out_of_school_youth: "Practical tech skills and community projects for young people.",
  online_learning:     "Programming, AI, electronics and PCB design, online.",
  digital_skills:      "AI tools, spreadsheets and automation for real work.",
};

const CATEGORY_CTA = {
  school_stem:         "Explore School STEM",
  out_of_school_youth: "Explore Youth Programme",
  online_learning:     "Explore Online Learning",
  digital_skills:      "Explore Digital Skills",
};

const STATIC_PROGRAMMES = [
  {
    image: schoolStemImg,
    audience: "Basic 1 – SHS 3",
    title: "School STEM Programmes",
    cta: "Explore School STEM",
    body: "Hands-on STEM in school, built around practical projects.",
    to: "/programs/school-stem",
  },
  {
    image: outOfSchoolImg,
    audience: "Ages 16 – 30",
    title: "Out-of-School Youth",
    cta: "Explore Youth Programme",
    body: "Practical tech skills and community projects for young people.",
    to: "/programs/out-of-school-youth",
  },
  {
    image: onlineLearningImg,
    audience: "Remote & self-paced learners",
    title: "Online Learning",
    cta: "Explore Online Learning",
    body: "Programming, AI, electronics and PCB design, online.",
    to: "/programs/online-learning",
  },
  {
    image: eraDigitalImg,
    audience: "Working adults & professionals",
    title: "ERA Digital Skills",
    cta: "Explore Digital Skills",
    body: "AI tools, spreadsheets and automation for real work.",
    to: "/programs/era-digital-skills",
  },
];

const method = [
  { Icon: Hammer, title: "Learn by building", line: "Every lesson is a hands-on challenge." },
  { Icon: Cpu, title: "Use real tools", line: "Microcontrollers, AI platforms, design software." },
  { Icon: FolderOpen, title: "Make real projects", line: "Work you can show and build on." },
  { Icon: TrendingUp, title: "Grow with outcomes", line: "Portfolio-ready results for your next step." },
];

// The whole card is one link, like the homepage's programme cards.
function ProgrammeCard({ image, audience, title, body, to, cta }) {
  return (
    <Link to={to} className="card-interactive group flex h-full w-full flex-col overflow-hidden">
      <div className="h-48 shrink-0 overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-light)]">{audience}</p>
        <h3 className="mb-2 text-lg font-bold leading-snug text-[var(--color-text-primary)]">{title}</h3>
        <p className="mb-5 line-clamp-3 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{body}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] transition-gap duration-200 group-hover:gap-2.5">
          {cta}
          <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export default function Programs() {
  const [apiProgrammes, setApiProgrammes] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get("/programmes")
      .then((json) => {
        if (!cancelled) setApiProgrammes(json?.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setApiProgrammes([]);
      });
    return () => { cancelled = true; };
  }, []);

  const programmes = (() => {
    if (!apiProgrammes || apiProgrammes.length === 0) return STATIC_PROGRAMMES;
    // website_programmes also holds billing-only categories (student_chapter,
    // monthly_dues) used by the payment system — only real teaching
    // programmes belong on this page.
    return apiProgrammes
      .filter((p) => Object.prototype.hasOwnProperty.call(CATEGORY_IMAGE, p.category))
      .map((p) => ({
        image: resolveMediaUrl(p.coverImageUrl) || CATEGORY_IMAGE[p.category] || schoolStemImg,
        audience: CATEGORY_AUDIENCE[p.category] || "",
        title: p.name,
        body: CATEGORY_LINE[p.category] || p.description,
        to: `/programs/${p.slug}`,
        cta: CATEGORY_CTA[p.category] || "Explore Programme",
      }));
  })();

  return (
    <ScrollScenes>
      <SEO {...getPageSeo("/programs")} />
      <ProgrammeHero
        back={false}
        eyebrow="Programmes"
        title="Learning pathways for every stage of growth."
        line="From the classroom to the workplace: practical programmes where you learn by building."
        image={programmesHeroImg}
        imageAlt="ERA AXIS learners participating in a practical programme session"
        badge="Practical learning pathways"
        actions={
          <>
            <a href="#pathways" className={heroPrimaryClass}>
              Explore pathways
              <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
            </a>
            <Link to="/partners" className={heroSecondaryClass}>
              Partner with ERA
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </>
        }
      />

      <section id="pathways" className="soft-field scroll-mt-20 py-20 md:py-24">
        <div className="container">
          <SectionHead eyebrow="Pathways" title="Choose your pathway." />
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {programmes.map((prog, i) => (
              <Reveal as="li" key={prog.to} delay={(i % 4) * 80} className="flex">
                <ProgrammeCard {...prog} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="container">
          <SectionHead eyebrow="Our method" title="Every programme works the same way." />
          <ol className="relative grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {method.map(({ Icon, title, line }, i) => (
              <Reveal as="li" key={title} delay={i * 90} className="flex gap-4 xl:flex-col">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white shadow-[0_14px_30px_-16px_var(--color-primary)]">
                  <Icon size={22} strokeWidth={2} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-secondary)]">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{line}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <ProgrammeClose
        title="Not sure which fits?"
        line="Tell us about your school, team or goals and we'll help you choose."
        actions={
          <>
            <Link to="/contact" className={closePrimaryClass}>
              Contact ERA
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <Link to="/partners" className={closeSecondaryClass}>
              Partner With ERA
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </>
        }
      />
    </ScrollScenes>
  );
}
