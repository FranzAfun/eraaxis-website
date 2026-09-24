import { Lock } from "lucide-react";
import useSpesoFees from "../../hooks/useSpesoFees";
import { calculatePaymentBreakdown, formatGhs } from "../../data/payments";

/**
 * What a paid form costs, laid out the way every ERA AXIS payment is: the fee
 * itself, the maintenance fee, Speso's processing fee, and the total. Worked out
 * with the same rules and current Speso rates the payment page uses, so the total
 * here is the total on the receipt.
 */
export default function PaymentSummary({ amount, sent = false, className = "" }) {
  const { feeConfig, feesLoading, feesError } = useSpesoFees();
  const breakdown = calculatePaymentBreakdown(amount, feeConfig);

  const rows = [
    ["Form fee", breakdown.baseAmount],
    ["Maintenance fee", breakdown.maintenanceFee],
    ["Speso processing fee", breakdown.spesoFee],
  ];

  return (
    <div className={`rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 py-5 sm:px-6 ${className}`}>
      <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Payment</h2>
      <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {sent
          ? "You'll pay on Speso, and we'll email your receipt as soon as the payment goes through."
          : "This form has a fee. When you continue, your answers are sent and you'll pay on Speso. We'll email your receipt."}
      </p>
      <dl className="mt-4 space-y-3 text-sm" aria-busy={feesLoading}>
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-3">
            <dt className="text-[var(--color-text-secondary)]">{label}</dt>
            <dd className="font-semibold tabular-nums text-[var(--color-text-primary)]">{formatGhs(value)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center justify-between gap-4 rounded-[var(--radius-sm)] bg-[var(--color-primary)]/10 px-4 py-3.5">
        <span className="text-sm font-semibold text-[var(--color-primary-deep)]">Total payable</span>
        <span className="text-lg font-bold tabular-nums text-[var(--color-primary)]">{formatGhs(breakdown.customerTotal)}</span>
      </div>
      {feesError && (
        <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-muted)]">{feesError}</p>
      )}
      <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
        <Lock size={13} strokeWidth={2} aria-hidden="true" />
        Payments are processed securely via Speso.
      </p>
    </div>
  );
}
