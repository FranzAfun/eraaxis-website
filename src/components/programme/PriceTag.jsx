/**
 * A price on a card, big enough to see at a glance: the amount, what it covers
 * beside it, and an optional line beneath. A programme that is coming soon has
 * a `badge` instead and no price. `price` is from getProgrammePrice /
 * getChapterPrice in data/payments.js; `alignEnd` lines it up on the right
 * from small screens up.
 */
export default function PriceTag({ price, className = "", alignEnd = false }) {
  if (!price) return null;
  if (price.badge) {
    return (
      <p className={className}>
        <span className="inline-flex items-center rounded-full bg-[var(--color-primary)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
          {price.badge}
        </span>
      </p>
    );
  }
  return (
    <p className={className}>
      <span className={`flex flex-wrap items-baseline gap-x-1.5 ${alignEnd ? "sm:justify-end" : ""}`}>
        <span className="text-2xl font-black tracking-tight text-[var(--color-text-primary)]">{price.amount}</span>
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">{price.per}</span>
      </span>
      {price.note && <span className="mt-0.5 block text-sm text-[var(--color-text-secondary)]">{price.note}</span>}
    </p>
  );
}
