import { ArrowLeft } from "lucide-react";
import BackLinkButton from "../navigation/BackLinkButton";
import { ShareButton } from "../ui/Share";

/**
 * The top of a payment form page: a way back, the page's name and one line.
 * No hero: like the forms made in the LMS, these pages open straight onto
 * the form.
 */
// `children` sit under the line (the Campus Chapter page's Purple Innovators note);
// `share` ({ url, title }) puts a Share button on the line with Back.
export default function FormPageHeader({ eyebrow, title, line, children, share = null }) {
  const words = (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <BackLinkButton
          fallbackTo="/payments"
          className="flex min-h-[44px] w-fit items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
        >
          <ArrowLeft size={14} strokeWidth={2.5} aria-hidden="true" />
          Back
        </BackLinkButton>
        {share && <ShareButton url={share.url} title={share.title} label="Share" className="z-20" />}
      </div>
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">{eyebrow}</p>}
      <h1 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl">{title}</h1>
      {line && <p className="mt-2 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">{line}</p>}
      {children}
    </>
  );
  return (
    <div className="land-in mb-6 md:mb-8">{words}</div>
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
