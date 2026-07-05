import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

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
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-[var(--color-background-dark)] px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.25)] sm:px-6"
    >
      <div className="container flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-relaxed text-white/72">
          We use minimal local storage to keep this site running smoothly —
          no tracking or advertising cookies.{" "}
          <Link
            to="/privacy"
            className="font-semibold text-[var(--color-accent)] underline underline-offset-2"
          >
            Learn more
          </Link>
        </p>
        <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-[var(--radius-sm)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-200 hover:bg-white/90 sm:flex-none"
          >
            Got it
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss privacy notice"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/50 transition-colors duration-200 hover:bg-white/10 hover:text-white sm:hidden"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
