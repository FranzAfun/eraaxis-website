import { Lock } from "lucide-react";
import { formatGhs } from "../../data/payments";

/**
 * What the sign-up costs, line by line, for the programme and Student Chapter
 * pages: beside the form on a computer, and above the last step's button on a
 * phone. `rows`: [{ label, amount?, value? }]; `empty` replaces the sums until
 * there is something to price.
 */
export default function OrderSummary({ title, rows = [], total, empty, error }) {
  return (
    <div className="space-y-3">
      <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-[var(--color-primary)]">Order summary</p>
        <h2 className="mt-1 text-lg font-bold tracking-tight text-[var(--color-text-primary)]">{title}</h2>

        {empty ? (
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{empty}</p>
        ) : (
          <>
            <dl className="mt-5 divide-y divide-[var(--color-border)] text-[15px]">
              {rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 py-3 first:pt-0">
                  <dt className="text-[var(--color-text-secondary)]">{row.label}</dt>
                  <dd className="whitespace-nowrap font-semibold text-[var(--color-text-primary)]">{row.value ?? formatGhs(row.amount)}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-center justify-between gap-4 rounded-[var(--radius-sm)] bg-[var(--color-primary)]/10 px-4 py-4">
              <span className="text-[15px] font-semibold text-[var(--color-primary-deep)]">Total payable</span>
              <span className="whitespace-nowrap text-xl font-bold text-[var(--color-primary)]">{formatGhs(total)}</span>
            </div>
          </>
        )}

        {error && (
          <p role="alert" className="mt-4 max-w-full break-words rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm leading-relaxed text-red-700">
            {error}
          </p>
        )}
      </div>
      <p className="flex items-center justify-center gap-2 text-center text-sm text-[var(--color-text-muted)]">
        <Lock size={14} strokeWidth={2} aria-hidden="true" />
        Payments are processed securely by Speso.
      </p>
    </div>
  );
}
