import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { generalFaqs } from "../../data/faqs";

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="card-interactive overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <span className="text-sm font-bold text-[var(--color-text-primary)] sm:text-base">
          {item.question}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className={`shrink-0 text-[var(--color-primary)] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6">
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection({
  items = generalFaqs,
  showCtas = true,
  className = "bg-white py-16 md:py-20 lg:py-24",
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className={className}>
      <div className="container">
        <div className="mb-10 max-w-2xl md:mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            FAQ
          </p>
          <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Questions people ask before they start.
          </h2>
          <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
            Clear answers about programmes, enrolment, dues, partnerships, and
            practical learning.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.75fr)] lg:items-start">
          <div className="space-y-3">
            {items.map((item, index) => (
              <FaqItem
                key={item.id}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>

          {showCtas ? (
            <div className="glass-surface-light rounded-[var(--radius-lg)] p-6 lg:sticky lg:top-24">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                Need a next step?
              </p>
              <h3 className="mb-3 text-xl font-black leading-tight tracking-tight text-[var(--color-text-primary)]">
                Start with enrolment or speak to the team directly.
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Whether you are joining as a learner or enquiring for a group,
                ERA AXIS can help you move forward clearly.
              </p>

              <div className="flex flex-col gap-3">
                <Link to="/payments" className="btn-primary justify-center">
                  Start enrolment
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
                <Link to="/contact#enquiry" className="btn-outline justify-center">
                  Contact ERA AXIS
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
