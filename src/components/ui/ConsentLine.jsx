/**
 * The one line beside a form's submit or continue button: sending the form is
 * agreeing to how ERA AXIS handles the details. No tick box. The policy opens
 * in a new tab, so nothing typed into the form is lost.
 *
 * `action` finishes "By …": submitting, continuing, sending, subscribing.
 */
export default function ConsentLine({ action = "submitting", surface = "light", size = "sm", className = "" }) {
  const dark = surface === "dark";
  return (
    <p
      className={`${size === "xs" ? "text-xs" : "text-sm"} leading-relaxed ${
        dark ? "text-[var(--color-text-on-dark-muted)]" : "text-[var(--color-text-secondary)]"
      } ${className}`.trim()}
    >
      By {action}, you agree to our{" "}
      <a
        href="/privacy"
        target="_blank"
        rel="noopener"
        className={`font-semibold underline underline-offset-2 ${dark ? "text-white" : "text-[var(--color-primary)]"}`}
      >
        Privacy &amp; Cookie Policy<span className="sr-only"> (opens in a new tab)</span>
      </a>
      .
    </p>
  );
}
