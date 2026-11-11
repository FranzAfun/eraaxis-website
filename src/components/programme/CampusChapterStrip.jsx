import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { getChapterPrice } from "../../data/payments";
import { CHAPTER_IMAGE } from "../../data/programmeImages";
import PriceTag from "./PriceTag";

/**
 * ERA AXIS Campus Chapters beside the programme cards: a full-width feature
 * card under the grid rather than another card, so the programme cards keep
 * their rows. Its own photo and the Purple Innovators badge set it apart.
 */
export default function CampusChapterStrip({ className = "" }) {
  const photo = CHAPTER_IMAGE;
  return (
    <Link
      to="/payments/campus-chapter"
      className={`card-interactive group grid overflow-hidden border-[var(--color-primary)]/25 sm:grid-cols-[minmax(0,15rem)_1fr] lg:grid-cols-[minmax(0,22rem)_1fr] ${className}`}
    >
      <div className="relative h-48 overflow-hidden sm:h-full sm:min-h-[13rem]">
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(min-width: 1024px) 352px, (min-width: 640px) 240px, calc(100vw - 2rem)"
          alt="ERA AXIS Campus Chapter members building an electronics project together"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-[0_10px_24px_-10px_var(--color-primary)]">
          <Sparkles size={12} strokeWidth={2.4} aria-hidden="true" />
          Purple Innovators
        </span>
      </div>
      <div className="flex flex-col gap-5 bg-[var(--color-primary)]/[0.05] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            University &amp; tertiary students
          </p>
          <h3 className="text-xl font-black leading-snug tracking-tight text-[var(--color-text-primary)]">ERA AXIS Campus Chapters</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            Learn by building on your campus: practical sessions, real projects and a verified portfolio.
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-primary)]">Every member is a Purple Innovator.</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 lg:items-end lg:text-right">
          <PriceTag price={getChapterPrice()} alignEnd />
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] transition-gap duration-200 group-hover:gap-2.5">
            Join Campus Chapters
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
