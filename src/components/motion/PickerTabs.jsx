import { useId, useRef } from "react";

/**
 * A row of choices and the one panel that answers the choice: tap who you are,
 * or which track, and the panel changes softly in place. Built as tabs, so
 * arrow keys move along the row and screen readers announce the panel.
 *
 * `items`: [{ key, label, Icon }]. `children(item)` renders the chosen panel.
 * `tone`: "light" or "dark", for the section it sits on.
 */
export default function PickerTabs({ items, value, onChange, label, tone = "light", children, className = "" }) {
  const id = useId();
  const refs = useRef([]);
  const index = Math.max(0, items.findIndex((item) => item.key === value));
  const current = items[index];

  function move(step) {
    const next = (index + step + items.length) % items.length;
    onChange(items[next].key);
    refs.current[next]?.focus();
  }

  const dark = tone === "dark";
  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
        }}
      >
        {items.map((item, i) => {
          const chosen = i === index;
          const { Icon } = item;
          return (
            <button
              key={item.key}
              ref={(node) => { refs.current[i] = node; }}
              type="button"
              role="tab"
              id={`${id}-tab-${item.key}`}
              aria-selected={chosen}
              aria-controls={`${id}-panel`}
              tabIndex={chosen ? 0 : -1}
              onClick={() => onChange(item.key)}
              className={`picker-tab inline-flex min-h-[44px] shrink-0 snap-start items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all duration-300 ${
                dark
                  ? chosen
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-primary-deep)] shadow-[0_10px_30px_-12px_var(--color-accent)]"
                    : "border-white/15 bg-white/[0.06] text-white hover:border-white/35 hover:bg-white/10"
                  : chosen
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[0_10px_30px_-14px_var(--color-primary)]"
                    : "border-[var(--color-ui-border)] bg-white/70 text-[var(--color-text-primary)] backdrop-blur hover:border-[var(--color-primary)]"
              }`}
            >
              {Icon && <Icon size={17} strokeWidth={2.1} aria-hidden="true" />}
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        key={current.key}
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${current.key}`}
        className="picker-panel mt-5"
      >
        {children(current)}
      </div>
    </div>
  );
}
