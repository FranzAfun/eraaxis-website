import { ArrowLeft } from "lucide-react";
import BackLinkButton from "../navigation/BackLinkButton";

/**
 * The top of a payment form page: a way back, the page's name and one line.
 * No hero: like the forms made in the LMS, these pages open straight onto
 * the form.
 */
// `children` sit under the line; `media` (a photo) stands beside the words
// from large screens up, and under them on a phone.
export default function FormPageHeader({ eyebrow, title, line, children, media }) {
  const words = (
    <>
      <BackLinkButton
        fallbackTo="/payments"
        className="mb-4 flex min-h-[44px] w-fit items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
      >
        <ArrowLeft size={14} strokeWidth={2.5} aria-hidden="true" />
        Back
      </BackLinkButton>
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">{eyebrow}</p>}
      <h1 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">{title}</h1>
      {line && <p className="mt-2 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">{line}</p>}
      {children}
    </>
  );
  return (
    <div className="land-in mb-6 md:mb-8">
      {media ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-10">
          <div className="min-w-0">{words}</div>
          {media}
        </div>
      ) : words}
    </div>
  );
}

/** A short list beside or under a payment form: what happens next, what you get. */
export function FormAside({ title, items, Icon, className = "" }) {
  return (
    <div className={`rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-white/70 p-5 ${className}`.trim()}>
      <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">{title}</h2>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            <Icon size={15} strokeWidth={2.2} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
