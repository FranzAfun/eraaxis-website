import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CircuitBoard,
  Code2,
  Cpu,
  Lightbulb,
  PencilRuler,
} from "lucide-react";

const tracks = [
  {
    icon: Cpu,
    title: "Electronics & Embedded Systems",
    description:
      "Components, circuits, sensors, automation, and the hardware thinking behind how systems behave.",
  },
  {
    icon: Code2,
    title: "Programming & Software Development",
    description:
      "Coding logic, apps, automation scripts, and the problem-solving habits that make software useful.",
  },
  {
    icon: Bot,
    title: "Artificial Intelligence",
    description:
      "AI tools, applied machine learning concepts, automation, and intelligent systems tied to practical work.",
  },
  {
    icon: PencilRuler,
    title: "CAD & Digital Product Design",
    description:
      "Product sketches, enclosures, prototyping, and design thinking for ideas that can move toward production.",
  },
  {
    icon: CircuitBoard,
    title: "PCB & Circuit Board Design",
    description:
      "Moving from breadboard prototypes toward cleaner circuit board layouts and more structured hardware builds.",
  },
  {
    icon: Lightbulb,
    title: "Project-Based Innovation",
    description:
      "Learners combine skills to build solutions they can explain, improve, test, and present with confidence.",
  },
];

function TrackCard({ icon: Icon, title, description }) {
  return (
    <article className="insights-card group flex h-full flex-col p-6 sm:p-7">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8 text-[var(--color-accent)] transition-transform duration-300 group-hover:-translate-y-1">
        <Icon size={22} strokeWidth={2.1} />
      </div>

      <h3 className="mb-3 text-lg font-black leading-snug text-white">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-white/58 sm:text-[15px]">
        {description}
      </p>
    </article>
  );
}

export default function WhatYouLearn() {
  return (
    <section
      id="learn"
      aria-label="What learners build with ERA AXIS"
      className="relative overflow-hidden bg-[linear-gradient(135deg,var(--color-background-dark)_0%,var(--color-primary-deep)_55%,var(--color-primary)_100%)] py-20 md:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_48%_at_18%_18%,rgba(201,163,255,0.14),transparent_72%)]"
      />

      <div className="container relative z-10">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:gap-12">
          <div className="xl:pr-4">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
              What You Learn
            </p>
            <h2 className="mb-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.7rem]">
              Five learning tracks. One practical innovation pathway.
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-white/65 sm:text-[17px]">
              ERA AXIS helps learners build real skills across electronics,
              programming, AI, design, and product development. Each track is
              practical, project-based, and connected to real outcomes.
            </p>

            <div className="mt-8 hidden gap-3 sm:flex sm:flex-row sm:items-center">
              <Link to="/payments" className="btn-primary cta-mobile-btn">
                Enrol now
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link to="/programs" className="btn-secondary cta-mobile-btn">
                Explore programmes
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:self-start">
            {tracks.map((track) => (
              <TrackCard key={track.title} {...track} />
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[18px] border border-white/10 bg-[rgb(255_255_255_/_0.06)] p-4 shadow-[0_16px_40px_rgb(0_0_0_/_0.16)] sm:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/payments" className="btn-primary cta-mobile-btn">
              Enrol now
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link to="/programs" className="btn-secondary cta-mobile-btn">
              Explore programmes
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
