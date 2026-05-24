import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Cpu,
  Monitor,
  BookOpen,
  CalendarDays,
  Bell,
  Wrench,
} from "lucide-react";
import { insights } from "../data/insights";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const editorialFocus = [
  {
    Icon: Cpu,
    label: "STEM Education",
    body: "Perspectives on hands-on STEM learning, curriculum design, and what effective science and technology education looks like in practice.",
  },
  {
    Icon: Monitor,
    label: "Digital Skills",
    body: "Insights on AI tools, digital productivity, automation, and building confidence with technology for work and everyday life.",
  },
  {
    Icon: BookOpen,
    label: "Programme Stories",
    body: "Stories from ERA AXIS school, youth, and community programmes — how learners engage, what they build, and what changes.",
  },
  {
    Icon: CalendarDays,
    label: "Event Recaps",
    body: "Summaries from ERA AXIS showcases, accelerator events, and ecosystem gatherings where practical learning is shared.",
  },
  {
    Icon: Bell,
    label: "Announcements",
    body: "Programme launches, partnership updates, recognition milestones, and news from the ERA AXIS learning ecosystem.",
  },
  {
    Icon: Wrench,
    label: "Project-Based Learning",
    body: "Why ERA AXIS uses projects as the primary measure of learning — and what that means for how learners are assessed and supported.",
  },
];

const ctaPrimaryClass =
  "final-cta-btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";
const ctaSecondaryClass =
  "final-cta-btn-secondary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold";

const published = insights.filter((item) => item.status === "published");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Insights() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-24">
        <div className="container">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Insights
          </p>
          <h1 className="mb-5 max-w-3xl text-4xl font-black leading-[1.1] tracking-tight text-[var(--color-text-primary)] sm:text-5xl md:text-[3.25rem]">
            Ideas, stories, and updates from practical STEM learning.
          </h1>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
            Explore ERA AXIS perspectives on STEM education, digital skills,
            learner outcomes, programme stories, and the future of practical
            learning in Africa.
          </p>
          <a
            href="#insights-listing"
            className="btn-primary inline-flex min-h-[44px] items-center gap-2"
          >
            Explore latest insights <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* ── Insight listing ──────────────────────────────────────────────── */}
      <section id="insights-listing" className="bg-white py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Latest insights
          </p>
          <h2 className="mb-3 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Latest insights
          </h2>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            Thought pieces, programme updates, and stories from the ERA AXIS
            learning ecosystem.
          </p>

          {published.length === 0 ? (
            <p className="text-base text-[var(--color-text-muted)]">
              No published insights yet. Check back soon.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {published.map((item) => (
                <article
                  key={item.slug}
                  className="card-interactive flex flex-col overflow-hidden"
                >
                  {/* Image slot — rendered only when featuredImage exists */}
                  {item.featuredImage && (
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="flex flex-1 flex-col p-7">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                      {item.type}
                    </p>
                    <h3 className="mb-3 text-base font-bold leading-snug text-[var(--color-text-primary)]">
                      {item.title}
                    </h3>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5">
                      <div>
                        <p className="text-xs font-medium text-[var(--color-text-primary)]">
                          {item.author}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {formatDate(item.publishedAt)}
                        </p>
                      </div>
                      {/* Read insight — detail route not yet available */}
                      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-[var(--color-primary)]">
                        Read insight
                        <ArrowRight size={14} strokeWidth={2} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Editorial focus ──────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-soft)] py-16 md:py-24">
        <div className="container">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            What we cover
          </p>
          <h2 className="mb-3 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            One hub, several types of content.
          </h2>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            ERA AXIS Insights is a single public space for ideas, stories, and
            updates across everything we work on.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {editorialFocus.map(({ Icon, label, body }) => (
              <div key={label} className="card-interactive p-7">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] bg-white">
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    className="text-[var(--color-primary)]"
                  />
                </span>
                <h3 className="mb-2 text-base font-bold text-[var(--color-text-primary)]">
                  {label}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="card-interactive mx-auto max-w-2xl p-10 text-center md:p-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Stay connected
            </p>
            <h2 className="mb-4 text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Get updates from ERA AXIS.
            </h2>
            <p className="mb-8 text-base leading-relaxed text-[var(--color-text-secondary)]">
              Receive featured insights, programme updates, and learner stories
              directly in your inbox.
            </p>
            <form
              noValidate
              onSubmit={handleSubscribe}
              className="flex flex-col gap-3 sm:flex-row sm:items-start"
            >
              <div className="flex flex-1 flex-col gap-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="Enter your email"
                  className={`min-h-[44px] w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:ring-2 ${
                    emailError
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                      : "border-[var(--color-border)] bg-white focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
                  }`}
                />
                {emailError && (
                  <p className="text-left text-xs text-red-600">{emailError}</p>
                )}
              </div>
              <button
                type="submit"
                className="btn-primary min-h-[44px] shrink-0 justify-center"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-xs text-[var(--color-text-muted)]">
              Newsletter signup will be connected when the backend is ready.
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="final-cta-band relative overflow-hidden py-20 md:py-28">
        <div className="final-cta-orb pointer-events-none absolute inset-0" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Want to see practical learning in action?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Explore ERA AXIS programmes or talk to the team about partnerships,
            school programmes, and youth skills development.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/programs" className={ctaPrimaryClass}>
              Explore Programmes <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className={ctaSecondaryClass}>
              Contact ERA <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
