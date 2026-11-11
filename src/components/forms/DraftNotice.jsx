import { History, X } from "lucide-react";

/**
 * Shown when a sign-up page brought back what someone typed earlier
 * (useSavedDraft): they carry on, or start again with a blank page
 * (`onStartAgain` clears the page's fields; the draft is forgotten here).
 */
export default function DraftNotice({ draft, onStartAgain, className = "" }) {
  if (!draft.restored) return null;
  return (
    <div
      role="status"
      className={`flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/[0.05] px-4 py-3 text-sm text-[var(--color-text-primary)] ${className}`}
    >
      <History size={16} strokeWidth={2.2} aria-hidden="true" className="shrink-0 text-[var(--color-primary)]" />
      <p className="min-w-0 flex-1">
        We kept what you typed earlier.{" "}
        <button type="button" onClick={() => { draft.forget(); onStartAgain(); }} className="font-semibold text-[var(--color-primary)] underline underline-offset-4">
          Start again
        </button>
      </p>
      <button
        type="button"
        onClick={draft.dismiss}
        aria-label="Hide this note"
        className="-mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--color-text-secondary)] hover:bg-white"
      >
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
