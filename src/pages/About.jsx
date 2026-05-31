import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Cpu,
  School,
  Wrench,
} from "lucide-react";
import programmesHeroImg from "../assets/images/programmes/programmes-hero.webp";

const whatWeDo = [
  {
    Icon: BookOpen,
    title: "Practical STEM education",
    body: "Hands-on learning experiences that help learners move from theory to real building, testing, and problem-solving.",
  },
  {
    Icon: Cpu,
    title: "Digital skills training",
    body: "Accessible training in technology tools, AI, software, and practical digital capabilities for modern work and learning.",
  },
  {
    Icon: Wrench,
    title: "ERA Dev Board learning",
    body: "Structured electronics and circuit learning through practical tools that help learners understand how systems work by doing.",
  },
  {
    Icon: School,
    title: "Programme and school partnerships",
    body: "Support for schools, communities, and partners that want to bring practical STEM and digital learning to more people.",
  },
];

const audiences = [
  "School students",
  "Out-of-school youth",
  "Parents",
  "Business owners",
  "Working professionals",
  "Schools and partners",
];

export default function About() {
  return (
    <>
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
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
              About ERA AXIS
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
              Making STEM practical for Africa&apos;s next generation of builders.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
              ERA AXIS is Ghana&apos;s practical STEM innovation platform,
              helping students, out-of-school youth, parents, and business
              owners gain real technology skills through hands-on learning.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/programs"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                Explore Programmes
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link
                to="/payments"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]"
              >
                Enrol Now
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="hero-media-card border-[var(--color-border)] bg-[var(--color-surface-soft)]">
            <img
              src={programmesHeroImg}
              alt="ERA AXIS learners in a practical STEM learning session"
              className="aspect-[16/8] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface-soft)] py-16 md:py-20">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                Who we are
              </p>
              <h2 className="mb-4 text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
                Practical technology learning for people ready to build.
              </h2>
              <p className="text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                From electronics and robotics to AI, digital skills, and
                product design, ERA AXIS makes STEM practical, affordable, and
                accessible for people ready to build, innovate, and grow with
                technology.
              </p>
            </div>

            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-7 shadow-[0_1px_4px_rgb(0_0_0/0.05)]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                Who we serve
              </p>
              <div className="flex flex-wrap gap-3">
                {audiences.map((audience) => (
                  <span
                    key={audience}
                    className="inline-flex items-center rounded-full border border-[var(--color-primary)]/15 bg-[var(--color-surface-soft)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)]"
                  >
                    {audience}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.72fr)] lg:items-start">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                Our Story
              </p>
              <h2 className="mb-4 text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
                Built to make technology education practical and useful.
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                <p>
                  ERA AXIS was built to make technology education more
                  practical, accessible, and useful for African learners. We
                  focus on hands-on STEM, digital skills, and project-based
                  learning so students, out-of-school youth, parents, and
                  professionals can move from theory to building real
                  solutions.
                </p>
                <p>
                  Through programmes in electronics, robotics, coding, AI,
                  digital skills, and product design, ERA AXIS helps learners
                  gain confidence with technology and apply it to real-world
                  problems.
                </p>
              </div>
            </div>

            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-6 shadow-[0_1px_4px_rgb(0_0_0/0.05)] sm:p-7">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                Journey so far
              </p>
              <div className="space-y-4">
                <div className="border-b border-[var(--color-border)] pb-4">
                  <p className="mb-1 text-sm font-bold text-[var(--color-text-primary)]">
                    2020
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    ERA AXIS started.
                  </p>
                </div>
                <div className="border-b border-[var(--color-border)] pb-4">
                  <p className="mb-1 text-sm font-bold text-[var(--color-text-primary)]">
                    2024
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    Incorporated.
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-bold text-[var(--color-text-primary)]">
                    Today
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    Practical STEM and digital skills programmes for learners,
                    youth, professionals, schools, and partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface-soft)] py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              What we do
            </p>
            <h2 className="mb-4 text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
              Practical programmes built around real outcomes.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {whatWeDo.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="card-interactive flex flex-col gap-4 rounded-[var(--radius-md)] p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-soft)]">
                  <Icon
                    size={20}
                    strokeWidth={1.9}
                    className="text-[var(--color-primary)]"
                  />
                </span>
                <div>
                  <h3 className="mb-2 text-base font-bold text-[var(--color-text-primary)]">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Mission &amp; Vision
            </p>
            <h2 className="mb-4 text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
              The direction guiding how ERA AXIS grows.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="card-interactive rounded-[var(--radius-md)] p-7 sm:p-8">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Briefcase size={22} strokeWidth={2} />
              </span>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                Our mission
              </p>
              <h3 className="mb-4 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-[2rem]">
                Expanding access to practical technology learning.
              </h3>
              <p className="text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                To make practical STEM and digital skills education accessible
                across Africa by helping learners build real projects, solve
                real problems, and grow with technology.
              </p>
            </div>

            <div className="card-interactive rounded-[var(--radius-md)] p-7 sm:p-8">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Cpu size={22} strokeWidth={2} />
              </span>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                Our vision
              </p>
              <h3 className="mb-4 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-[2rem]">
                A stronger future for practical learning in Africa.
              </h3>
              <p className="text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                To become a leading practical STEM and digital skills platform
                in Africa, helping more people learn by building, innovate with
                confidence, and use technology to improve their communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta-band relative overflow-hidden py-16 md:py-20">
        <div
          aria-hidden="true"
          className="final-cta-orb pointer-events-none absolute inset-0"
        />
        <div className="container relative text-center">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Ready to start learning with ERA AXIS?
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/programs"
              className="final-cta-btn-primary inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-5 py-2.5 text-sm font-semibold"
            >
              Explore Programmes
              <ArrowRight size={15} strokeWidth={2.2} />
            </Link>
            <Link
              to="/payments"
              className="final-cta-btn-secondary inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-5 py-2.5 text-sm font-semibold"
            >
              Enrol Now
              <ArrowRight size={15} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
