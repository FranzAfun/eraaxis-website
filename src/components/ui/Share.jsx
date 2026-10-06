import { useEffect, useId, useRef, useState } from "react";
import { Check, Link2, Mail, Share2 } from "lucide-react";
import whatsappImg from "../../assets/social/whatsapp.webp";
import linkedinImg from "../../assets/social/linkedin.webp";
import { copyTextToClipboard } from "../../utils/clipboard";
import { hasShareSheet, shareLinks } from "../../utils/share";

/**
 * Sharing an article. `ShareRow` is the row of buttons on the article page;
 * `ShareButton` is the small button on an article card, which opens the phone's
 * own share sheet or, on a computer, a short list. Both offer WhatsApp,
 * LinkedIn, X, Facebook, email and copying the link.
 */

// X and Facebook drawn here (the icon set no longer carries brand marks);
// WhatsApp and LinkedIn use the site's own logo files.
function XMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function FacebookMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 8h3V4h-3c-2.76 0-5 2.24-5 5v2H6v4h3v9h4v-9h3l1-4h-4V9c0-.55.45-1 1-1z" />
    </svg>
  );
}

function targets(url, title) {
  const links = shareLinks(url, title);
  return [
    { key: "whatsapp", label: "WhatsApp", href: links.whatsapp, mark: <img src={whatsappImg} alt="" className="h-full w-full rounded-[inherit] object-cover" /> },
    { key: "linkedin", label: "LinkedIn", href: links.linkedin, mark: <img src={linkedinImg} alt="" className="h-full w-full rounded-[inherit] object-cover" /> },
    { key: "x", label: "X", href: links.x, mark: <span className="flex h-full w-full items-center justify-center rounded-[inherit] bg-black text-white"><XMark className="h-[45%] w-[45%]" /></span> },
    { key: "facebook", label: "Facebook", href: links.facebook, mark: <span className="flex h-full w-full items-center justify-center rounded-[inherit] bg-[#1877F2] text-white"><FacebookMark className="h-[55%] w-[55%]" /></span> },
    { key: "email", label: "Email", href: links.email, mark: <span className="flex h-full w-full items-center justify-center rounded-[inherit] bg-[var(--color-primary)] text-white"><Mail className="h-[48%] w-[48%]" aria-hidden="true" /></span> },
  ];
}

// "Copy link", then "Copied" for a moment.
function useCopied() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = (text) => copyTextToClipboard(text).then((ok) => {
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  });
  return [copied, copy];
}

/** The row on the article page. `surface` is "light" or "dark". */
export function ShareRow({ url, title, surface = "light", label = "Share", className = "" }) {
  const [copied, copy] = useCopied();
  const dark = surface === "dark";
  // A phone with its own share sheet gets the two most used here, and the sheet
  // for the rest, so the row stays one line.
  const sheet = hasShareSheet();
  const shown = sheet ? targets(url, title).filter((item) => item.key === "whatsapp" || item.key === "linkedin") : targets(url, title);
  const tile = "inline-flex h-10 w-10 shrink-0 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2";
  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-2.5 ${className}`.trim()}>
      <span className={`mr-1 text-sm font-semibold ${dark ? "text-[var(--color-text-on-dark-muted)]" : "text-[var(--color-text-secondary)]"}`}>{label}</span>
      {shown.map((item) => (
        <a key={item.key} href={item.href} target="_blank" rel="noopener noreferrer" className={tile} aria-label={`Share on ${item.label} (opens in a new tab)`} title={item.label}>
          <span className="h-full w-full overflow-hidden rounded-full">{item.mark}</span>
        </a>
      ))}
      <button
        type="button"
        onClick={() => copy(url)}
        className={`${tile} border ${dark ? "border-white/25 bg-white/10 text-white" : "border-[var(--color-ui-border)] bg-white text-[var(--color-primary)]"}`}
        aria-label={copied ? "Link copied" : "Copy the link"}
        title={copied ? "Copied" : "Copy link"}
      >
        {copied ? <Check size={18} aria-hidden="true" /> : <Link2 size={18} aria-hidden="true" />}
      </button>
      {sheet && (
        <button
          type="button"
          onClick={() => navigator.share({ title, url }).catch(() => {})}
          className={`${tile} border ${dark ? "border-white/25 bg-white/10 text-white" : "border-[var(--color-ui-border)] bg-white text-[var(--color-primary)]"}`}
          aria-label="More ways to share"
          title="More"
        >
          <Share2 size={18} aria-hidden="true" />
        </button>
      )}
      <span aria-live="polite" className="sr-only">{copied ? "Link copied" : ""}</span>
    </div>
  );
}

/**
 * The small button on an article card. Placed beside the card's link, never
 * inside it, so pressing it never opens the article.
 */
export function ShareButton({ url, title, className = "" }) {
  const [open, setOpen] = useState(false);
  const [copied, copy] = useCopied();
  const wrapRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (!wrapRef.current?.contains(event.target)) setOpen(false); };
    const escape = (event) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const press = () => {
    if (hasShareSheet()) navigator.share({ title, url }).catch(() => {});
    else setOpen((current) => !current);
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        onClick={press}
        aria-expanded={hasShareSheet() ? undefined : open}
        aria-controls={hasShareSheet() ? undefined : menuId}
        aria-label={`Share "${title}"`}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[var(--color-primary)] shadow-[0_6px_20px_-8px_rgb(0_0_0_/_0.45)] transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        <Share2 size={17} aria-hidden="true" />
      </button>
      {open && (
        <div
          id={menuId}
          className="share-menu absolute right-0 top-12 z-20 w-52 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-1.5 shadow-[0_18px_40px_-16px_rgb(0_0_0_/_0.35)]"
        >
          {targets(url, title).map((item) => (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex min-h-[44px] items-center gap-3 rounded-[var(--radius-sm)] px-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)]"
            >
              <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full">{item.mark}</span>
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => copy(url)}
            className="flex min-h-[44px] w-full items-center gap-3 rounded-[var(--radius-sm)] px-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-ui-border)] text-[var(--color-primary)]">
              {copied ? <Check size={15} aria-hidden="true" /> : <Link2 size={15} aria-hidden="true" />}
            </span>
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
