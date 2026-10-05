import { useState } from "react";
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
import PickerTabs from "../motion/PickerTabs";
import Reveal from "../motion/Reveal";

// Who someone is, and where that takes them.
const audiences = [
  {
    key: "school",
    Icon: School,
    label: "School learner",
    badge: "Basic 1 to SHS 3",
    line: "Build confidence early with electronics, coding and real projects.",
    tags: ["Electronics", "Coding", "Projects"],
    to: "/programs/school-stem",
    cta: "See School STEM",
  },
  {
    key: "youth",
    Icon: Lightbulb,
    label: "Out of school",
    badge: "Ages 16 to 30",
    line: "Practical skills you can earn with, and solutions for your community.",
    tags: ["Employable skills", "Innovation", "Mentorship"],
    to: "/programs/out-of-school-youth",
    cta: "See the youth programme",
  },
  {
    key: "university",
    Icon: GraduationCap,
    label: "University student",
    badge: "Portfolio building",
    line: "Hardware, software and AI work that strengthens your portfolio.",
    tags: ["Electronics", "Software", "AI"],
    to: "/payments/student-chapter",
    cta: "Join the Student Chapter",
  },
  {
    key: "professional",
    Icon: BriefcaseBusiness,
    label: "Professional",
    badge: "Applied productivity",
    line: "AI tools and automation you can use in your work this month.",
    tags: ["AI tools", "Automation", "Productivity"],
    to: "/programs/era-digital-skills",
    cta: "See ERA Digital Skills",
  },
  {
    key: "institution",
    Icon: Building2,
    label: "School or institution",
    badge: "Structured delivery",
    line: "Bring hands-on STEM into your classrooms, with the tools and support.",
    tags: ["Curriculum", "Dev Board", "Training"],
    to: "/programs/school-stem",
    cta: "Bring STEM to your school",
  },
  {
    key: "partner",
    Icon: Handshake,
    label: "NGO or sponsor",
    badge: "Group sponsorship",
    line: "Sponsor a cohort of learners, with outcomes you can measure.",
    tags: ["Cohorts", "Reporting", "Impact"],
    to: "/partners",
    cta: "Partner with us",
  },
];

export default function WhoItIsFor() {
  const [who, setWho] = useState(audiences[0].key);

  return (
    <section
      id="everyone"
      aria-label="Who ERA AXIS is for"
      className="soft-field relative overflow-hidden py-20 md:py-24 lg:py-28"
    >
      <div className="container relative z-10">
        <Reveal className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Who It&apos;s For
          </p>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-[2.7rem]">
            Find your path. Tap who you are.
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <PickerTabs items={audiences} value={who} onChange={setWho} label="Who you are">
            {(item) => (
              <div className="glass grid gap-6 p-6 sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10">
                <span className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-white shadow-[0_16px_36px_-16px_var(--color-primary)]">
                  <item.Icon size={30} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">{item.badge}</p>
                  <p className="mt-2 text-xl font-bold leading-snug text-[var(--color-text-primary)] sm:text-2xl">{item.line}</p>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="What it covers">
                    {item.tags.map((tag) => (
                      <li key={tag} className="rounded-full bg-[var(--color-primary)]/[0.08] px-3 py-1 text-sm font-medium text-[var(--color-primary-deep)]">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to={item.to} className="btn-primary group justify-center whitespace-nowrap">
                  {item.cta}
                  <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            )}
          </PickerTabs>
        </Reveal>
      </div>
    </section>
  );
}
