import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { faqGroups } from "../data/faqs";

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.05] backdrop-blur-sm transition-colors duration-200 hover:border-white/16">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
      >
        <span className="text-sm font-bold leading-snug text-white sm:text-base">
          {item.question}
        </span>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--color-accent)]">
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
            <p className="text-sm leading-relaxed text-white/68">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [activeGroupId, setActiveGroupId] = useState(faqGroups[0].id);
  const [openItemId, setOpenItemId] = useState(faqGroups[0].items[0].id);

  const activeGroup =
    faqGroups.find((group) => group.id === activeGroupId) ?? faqGroups[0];

  function handleGroupChange(groupId) {
    const nextGroup = faqGroups.find((group) => group.id === groupId);
    if (!nextGroup) return;
    setActiveGroupId(groupId);
    setOpenItemId(nextGroup.items[0]?.id ?? null);
  }

  return (
    <>
      <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-16 pt-36 text-white md:pb-24 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 16% 18%, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, transparent 30%), radial-gradient(circle at 84% 10%, color-mix(in srgb, var(--color-primary) 42%, transparent) 0%, transparent 36%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-28 top-24 h-80 w-80 rounded-full bg-white/[0.05] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-6 h-96 w-96 rounded-full bg-[var(--color-accent)]/10 blur-3xl"
        />

        <div className="container relative z-10">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/68 transition-colors duration-200 hover:text-white"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back to home
          </Link>

          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
              FAQ
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
              Questions people ask before they start.
            </h1>
            <p className="mb-8 text-base leading-relaxed text-white/72 sm:text-lg">
              Clear answers about ERA AXIS programmes, enrolment, dues,
              partnerships, practical learning, and support.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/payments" className="btn-primary">
                Start enrolment
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link to="/contact#enquiry" className="btn-secondary">
                Contact ERA AXIS
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#0c0917_0%,#110d1f_100%)] py-16 md:py-20 lg:py-24">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                Explore topics
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {faqGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => handleGroupChange(group.id)}
                    className={`rounded-[14px] border px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                      group.id === activeGroup.id
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-white/10 bg-white/[0.04] text-white/72 hover:border-white/18 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            </aside>

            <div>
              <div className="mb-6 max-w-2xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                  {activeGroup.label}
                </p>
                <h2 className="mb-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                  Clear answers for {activeGroup.label.toLowerCase()}.
                </h2>
                <p className="text-base leading-relaxed text-white/62">
                  Browse the most common questions in this area and open the one
                  you need without leaving the page.
                </p>
              </div>

              <div className="space-y-3">
                {activeGroup.items.map((item) => (
                  <FaqItem
                    key={item.id}
                    item={item}
                    isOpen={openItemId === item.id}
                    onToggle={() =>
                      setOpenItemId(openItemId === item.id ? null : item.id)
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
