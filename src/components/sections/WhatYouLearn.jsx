import { useState } from "react";
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
import PickerTabs from "../motion/PickerTabs";
import Reveal from "../motion/Reveal";

const tracks = [
  {
    key: "electronics",
    Icon: Cpu,
    label: "Electronics",
    title: "Electronics & Embedded Systems",
    line: "How circuits, sensors and microcontrollers make things happen.",
    tags: ["Components", "Sensors", "Automation"],
  },
  {
    key: "programming",
    Icon: Code2,
    label: "Programming",
    title: "Programming & Software",
    line: "The logic behind apps and the scripts that do the boring work.",
    tags: ["Logic", "Apps", "Scripts"],
  },
  {
    key: "ai",
    Icon: Bot,
    label: "AI",
    title: "Artificial Intelligence",
    line: "AI tools and intelligent systems, put to practical work.",
    tags: ["AI tools", "Machine learning", "Automation"],
  },
  {
    key: "cad",
    Icon: PencilRuler,
    label: "CAD & Design",
    title: "CAD & Digital Product Design",
    line: "From a sketch to an enclosure to a prototype you can hold.",
    tags: ["Sketching", "Enclosures", "Prototypes"],
  },
  {
    key: "pcb",
    Icon: CircuitBoard,
    label: "PCB Design",
    title: "PCB & Circuit Board Design",
    line: "From a breadboard tangle to a clean, real circuit board.",
    tags: ["Schematics", "Layout", "Hardware builds"],
  },
  {
    key: "projects",
    Icon: Lightbulb,
    label: "Projects",
    title: "Project-Based Innovation",
    line: "Everything together: build it, test it, improve it, present it.",
    tags: ["Build", "Test", "Present"],
  },
];

export default function WhatYouLearn() {
  const [track, setTrack] = useState(tracks[0].key);

  return (
    <section
      id="learn"
      aria-label="What learners build with ERA AXIS"
      className="dark-surface relative overflow-hidden bg-[linear-gradient(135deg,var(--color-background-dark)_0%,var(--color-primary-deep)_55%,var(--color-primary)_100%)] py-20 md:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_48%_at_18%_18%,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent_72%)]"
      />

      <div className="container relative z-10">
        <Reveal className="mb-10 max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">
            What You Learn
          </p>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.7rem]">
            Six tracks. One practical pathway.
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div data-scene="zoom-in">
          <PickerTabs items={tracks} value={track} onChange={setTrack} label="Learning tracks" tone="dark">
            {(item) => (
              <div className="glass-dark grid gap-6 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
                <span className="track-icon relative flex h-24 w-24 items-center justify-center rounded-full text-[var(--color-accent)]">
                  <item.Icon size={40} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-2xl font-black leading-snug text-white sm:text-[1.75rem]">{item.title}</h3>
                  <p className="mt-2 text-lg leading-relaxed text-[var(--color-text-on-dark-muted)]">{item.line}</p>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="What it covers">
                    {item.tags.map((tag) => (
                      <li key={tag} className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-sm font-medium text-[var(--color-text-on-dark-muted)]">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </PickerTabs>
          </div>
        </Reveal>

        <Reveal delay={140} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* White on the purple ground, so the main action stands out. */}
          <Link
            to="/payments"
            className="cta-mobile-btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
          >
            Enrol now
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
          <Link to="/programs" className="btn-secondary cta-mobile-btn">
            Explore programmes
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
