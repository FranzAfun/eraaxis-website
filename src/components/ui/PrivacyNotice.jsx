import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, X } from "lucide-react";

const STORAGE_KEY = "era_privacy_notice_dismissed";

function readDismissed() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    // localStorage may be unavailable (e.g. blocked by browser settings) —
    // fail open rather than showing the banner on every load.
    return true;
  }
}

/**
 * The first-visit privacy note: a small card floating in the corner (a sheet
 * along the bottom on phones) rather than a bar across the page, so it never
 * hides more of the page than it needs to. It rises in once, gently (still
 * for people who ask for less motion; see .privacy-notice in index.css).
 */
export default function PrivacyNotice() {
  const [dismissed, setDismissed] = useState(readDismissed);

  function handleDismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore — banner still dismisses for this session
    }
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Privacy notice"
      style={{ borderColor: "color-mix(in srgb, var(--color-accent) 30%, transparent)" }}
      className="privacy-notice dark-surface fixed inset-x-3 bottom-3 z-[60] overflow-hidden rounded-2xl border bg-[var(--color-background-dark)] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[25rem]"
    >
      {/* A soft purple glow along the top edge, like the site's dark panels. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{ background: "radial-gradient(120% 100% at 100% 0%, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, transparent 70%)" }}
      />
      <div className="relative p-5">
        <div className="flex items-start gap-3 pr-8">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-[var(--color-accent)] ring-1 ring-white/10"
          >
            <ShieldCheck size={20} strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="text-base font-bold leading-snug text-white">Your privacy, kept simple</p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-on-dark-muted)]">
              No tracking or advertising cookies. Just a few small things kept in your browser so the
              site works.
            </p>
          </div>
        </div>

        <p className="mt-4 flex items-center gap-2 rounded-lg bg-white/[0.05] px-3 py-2 text-xs font-medium text-[var(--color-text-on-dark-muted)]">
          <ShieldCheck size={14} strokeWidth={2.2} aria-hidden="true" className="shrink-0 text-[var(--color-accent)]" />
          Registered with Ghana&apos;s Data Protection Commission
        </p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-[var(--radius-md)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-colors duration-200 hover:bg-white/90"
          >
            Got it
          </button>
          <Link
            to="/privacy"
            className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-[var(--radius-md)] border border-white/15 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
          >
            Read the policy
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss privacy notice"
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-on-dark-muted)] transition-colors duration-200 hover:bg-white/10 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}
