/**
 * The waiting state of the purple one-task pages (payment confirmation,
 * continue payment, attendance, certificate check, unsubscribe): five dots
 * that light up one after another, like LEDs on a board, over a short line
 * saying what is happening. Use this rather than a page-made spinner, so
 * every such page waits the same way.
 */
export default function PageLoading({ children, className = "" }) {
  return (
    <div role="status" className={`text-center ${className}`.trim()}>
      <div className="page-loading-dots mb-6 flex items-center justify-center gap-3" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-3 w-3 rounded-full bg-[var(--color-accent)]" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <p className="text-base text-[var(--color-text-on-dark-muted)]">{children}</p>
    </div>
  );
}
