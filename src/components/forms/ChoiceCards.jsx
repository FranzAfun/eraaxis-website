import { Check } from "lucide-react";

/**
 * One choice from a few, as cards rather than a dropdown, so every option is seen
 * at once. The chosen card fills with the primary colour, like the Most Popular
 * card on /payments. Native radios underneath, so the keyboard and screen
 * readers work as they would with any radio group.
 *
 * `options`: [{ value, title, hint?, aside?, Icon? }]
 */
export default function ChoiceCards({ name, legend, options, value, onChange, columns = "sm:grid-cols-3", legendCls }) {
  return (
    <fieldset>
      {legend && <legend className={legendCls}>{legend}</legend>}
      <div className={`mt-2 grid gap-3 ${columns}`}>
        {options.map((option) => {
          const chosen = value === option.value;
          const { Icon } = option;
          return (
            <label
              key={option.value}
              className={`group relative flex cursor-pointer flex-col rounded-[var(--radius-md)] border-2 p-4 transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-primary)] has-[:focus-visible]:ring-offset-2 ${
                chosen
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25"
                  : "border-[var(--color-ui-border)] bg-white hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-md"
              }`}
            >
              <input type="radio" name={name} className="sr-only" checked={chosen} onChange={() => onChange(option.value)} />
              <span className="flex items-start justify-between gap-3">
                {Icon ? (
                  <span
                    aria-hidden="true"
                    className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] ${
                      chosen ? "bg-white/15 text-white" : "bg-[var(--color-primary)]/[0.08] text-[var(--color-primary)]"
                    }`}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </span>
                ) : (
                  <span className={`text-base font-semibold leading-snug ${chosen ? "text-white" : "text-[var(--color-text-primary)]"}`}>{option.title}</span>
                )}
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    chosen ? "border-white bg-white text-[var(--color-primary)]" : "border-[var(--color-ui-border)]"
                  }`}
                >
                  {chosen && <Check size={12} strokeWidth={3.5} />}
                </span>
              </span>
              {Icon && (
                <span className={`mt-3 text-base font-semibold leading-snug ${chosen ? "text-white" : "text-[var(--color-text-primary)]"}`}>
                  {option.title}
                </span>
              )}
              {option.hint && (
                <span className={`mt-1 text-sm leading-relaxed ${chosen ? "text-[var(--color-text-on-dark-muted)]" : "text-[var(--color-text-secondary)]"}`}>
                  {option.hint}
                </span>
              )}
              {option.aside && (
                <span className={`mt-3 text-sm font-bold ${chosen ? "text-white" : "text-[var(--color-primary)]"}`}>{option.aside}</span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** A short answer from a few, as a row of pills; choosing the chosen one again clears it. */
export function PillChoice({ name, legend, legendCls, options, value, onChange }) {
  return (
    <fieldset>
      {legend && <legend className={legendCls}>{legend}</legend>}
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const chosen = value === option;
          return (
            <label
              key={option}
              className={`cursor-pointer rounded-full border-2 px-4 py-2 text-[15px] font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-primary)] has-[:focus-visible]:ring-offset-2 ${
                chosen
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-ui-border)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
              }`}
            >
              <input
                type="radio"
                name={name}
                className="sr-only"
                checked={chosen}
                onChange={() => {}}
                onClick={() => onChange(chosen ? "" : option)}
              />
              {option}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
