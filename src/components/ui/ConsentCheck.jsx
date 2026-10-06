import { forwardRef, useId } from "react";

/**
 * The tick box beside a form's submit or continue button: "I agree to the
 * Privacy & Cookie Policy". The button stays greyed out (`needs-consent`)
 * until it is ticked. The policy opens in a new tab, so nothing typed into the
 * form is lost.
 */

const ConsentCheck = forwardRef(function ConsentCheck(
  { checked, onChange, surface = "light", size = "sm", className = "" },
  ref
) {
  const id = useId();
  const dark = surface === "dark";
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 text-left ${size === "xs" ? "text-xs" : "text-sm"} ${
          dark ? "text-[var(--color-text-on-dark-muted)]" : "text-[var(--color-text-secondary)]"
        }`}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="h-[18px] w-[18px] shrink-0 cursor-pointer"
        />
        <span>
          I agree to the{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener"
            className={`font-semibold underline underline-offset-2 ${dark ? "text-white" : "text-[var(--color-primary)]"}`}
          >
            Privacy &amp; Cookie Policy<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </span>
      </label>
    </div>
  );
});

export default ConsentCheck;
