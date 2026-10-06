import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { faqGroups } from "../data/faqs";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";

function FaqItem({ item, tag, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-white/[0.05] backdrop-blur-sm transition-colors duration-200 hover:border-white/16">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
      >
        <span>
          {tag && (
            <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">{tag}</span>
          )}
          <span className="text-sm font-bold leading-snug text-white sm:text-base">
            {item.question}
          </span>
        </span>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--color-accent-text-on-hero)]">
          <ChevronDown
            size={18}
            strokeWidth={2}
            aria-hidden="true"
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/8 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
            <p className="text-sm leading-relaxed text-[var(--color-text-on-dark-muted)]">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Every word typed must appear in the question or its answer.
function matches(item, words) {
  const text = `${item.question} ${item.answer}`.toLowerCase();
  return words.every((word) => text.includes(word));
}

export default function Faq() {
  const [activeGroupId, setActiveGroupId] = useState(faqGroups[0].id);
  const [openItemId, setOpenItemId] = useState(faqGroups[0].items[0].id);
  const [query, setQuery] = useState("");
  const activeGroup =
    faqGroups.find((group) => group.id === activeGroupId) ?? faqGroups[0];

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const searching = words.length > 0;
  const results = searching
    ? faqGroups.flatMap((group) => group.items.filter((item) => matches(item, words)).map((item) => ({ ...item, group: group.label })))
    : [];

  function handleGroupChange(groupId) {
    const nextGroup = faqGroups.find((group) => group.id === groupId);
    if (!nextGroup) return;
    setQuery("");
    setActiveGroupId(groupId);
    setOpenItemId(nextGroup.items[0]?.id ?? null);
  }

  const toggle = (id) => setOpenItemId(openItemId === id ? null : id);

  // Searching opens the best match straight away.
  function search(value) {
    setQuery(value);
    const next = value.toLowerCase().split(/\s+/).filter(Boolean);
    if (!next.length) return;
    const first = faqGroups.flatMap((group) => group.items).find((item) => matches(item, next));
    if (first) setOpenItemId(first.id);
  }

  return (
    <>
      <SEO {...getPageSeo("/faq")} />
      <section className="dark-surface hero-ground relative -mt-20 overflow-hidden pb-14 pt-36 text-white md:pb-20 md:pt-44">
        <div className="land-in container relative z-10">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">
              FAQ
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
              Questions people ask before they start.
            </h1>
            <p className="mb-8 text-base leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-lg">
              Search, or pick a topic below.
            </p>
            <label htmlFor="faq-search" className="sr-only">Search the questions</label>
            <div className="relative">
              <Search size={18} strokeWidth={2} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-on-dark-muted)]" />
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={(event) => search(event.target.value)}
                placeholder="e.g. receipt, dues, beginners"
                autoComplete="off"
                className="search-on-dark min-h-[52px] w-full rounded-full border border-white/20 bg-white/[0.08] pl-11 pr-5 text-base text-white placeholder-[var(--color-text-on-dark-muted)] outline-none transition-colors focus:border-[var(--color-accent)] focus:bg-white/[0.12]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="dark-surface bg-[linear-gradient(180deg,var(--color-surface-dark)_0%,var(--color-primary-deep)_100%)] py-14 md:py-20">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
            {/* While searching, a phone shows the answers first. */}
            <aside className={`lg:sticky lg:top-24 lg:block lg:self-start ${searching ? "hidden" : ""}`}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)]">
                Topics
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {faqGroups.map((group) => {
                  const on = !searching && group.id === activeGroup.id;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => handleGroupChange(group.id)}
                      className={`min-h-[44px] rounded-[var(--radius-sm)] border px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                        on
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                          : "border-white/10 bg-white/[0.04] text-[var(--color-text-on-dark-muted)] hover:border-white/18 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      {group.label}
                    </button>
                  );
                })}
              </div>
            </aside>

            <div>
              {/* Read out how many answers a search found; nothing else. */}
              <p className="sr-only" aria-live="polite">
                {searching ? `${results.length} ${results.length === 1 ? "answer" : "answers"} found` : ""}
              </p>
              {searching ? (
                <>
                  <h2 className="mb-6 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {results.length === 0
                      ? "No question matches that."
                      : `${results.length} ${results.length === 1 ? "answer" : "answers"} for \u201c${query.trim()}\u201d`}
                  </h2>
                  {results.length === 0 ? (
                    <Link to="/contact#enquiry" className="btn-primary btn-on-dark w-fit">
                      Ask us directly
                      <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      {results.map((item) => (
                        <FaqItem key={item.id} item={item} tag={item.group} isOpen={openItemId === item.id} onToggle={() => toggle(item.id)} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="mb-6 text-2xl font-black tracking-tight text-white sm:text-3xl">{activeGroup.label}</h2>
                  <div className="space-y-3">
                    {activeGroup.items.map((item) => (
                      <FaqItem key={item.id} item={item} isOpen={openItemId === item.id} onToggle={() => toggle(item.id)} />
                    ))}
                  </div>
                </>
              )}
              <p className="mt-8 text-sm text-[var(--color-text-on-dark-muted)]">
                Still unsure?{" "}
                <Link to="/contact#enquiry" className="font-semibold text-white underline underline-offset-4 hover:text-[var(--color-accent-text-on-hero)]">
                  Ask us directly
                </Link>
                {" "}or{" "}
                <Link to="/payments" className="font-semibold text-white underline underline-offset-4 hover:text-[var(--color-accent-text-on-hero)]">
                  start enrolment
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
