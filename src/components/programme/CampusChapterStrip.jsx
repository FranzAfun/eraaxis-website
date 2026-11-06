import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import { getChapterPrice } from "../../data/payments";
import PriceTag from "./PriceTag";

/**
 * Campus Chapters beside the programme cards: a full-width strip under the
 * grid rather than a fifth card, so the four programmes keep their rows.
 */
export default function CampusChapterStrip({ className = "" }) {
  return (
    <Link
      to="/payments/campus-chapter"
      className={`card-interactive group flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 ${className}`}
    >
      <div className="flex min-w-0 items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white shadow-[0_14px_30px_-16px_var(--color-primary)]"
        >
          <Users size={22} strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-light)]">
            University &amp; tertiary students
          </p>
          <h3 className="text-lg font-bold leading-snug text-[var(--color-text-primary)]">ERA AXIS Campus Chapters</h3>
          <p className="mt-1 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            Learn by building on your campus: practical sessions, real projects and a verified portfolio.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-3 sm:items-end sm:text-right">
        <PriceTag price={getChapterPrice()} alignEnd />
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] transition-gap duration-200 group-hover:gap-2.5">
          Join Campus Chapters
          <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
