/**
 * A parent or guardian, asked of someone under 18: who they are, how to reach
 * them, and that they agree. The agreement is the point of the question, so the
 * form is not accepted without it.
 */
export default function GuardianField({ question, value, onChange, fieldClass, invalid, describedBy }) {
  const answer = value && typeof value === "object" ? value : {};
  const set = (patch) => onChange({ ...answer, ...patch });
  const id = (suffix) => `q-${question.key}-${suffix}`;
  const label = "block text-sm font-medium text-[var(--color-text-secondary)]";
  return (
    <div className="space-y-4" aria-describedby={describedBy}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label htmlFor={id("name")} className={label}>
          Their full name
          <input id={id("name")} className={`mt-1.5 ${fieldClass}`} maxLength={160} autoComplete="off"
            aria-invalid={invalid || undefined} value={answer.name || ""} onChange={(event) => set({ name: event.target.value })} />
        </label>
        <label htmlFor={id("phone")} className={label}>
          Their phone number
          <input id={id("phone")} type="tel" className={`mt-1.5 ${fieldClass}`} maxLength={40} autoComplete="off"
            aria-invalid={invalid || undefined} value={answer.phone || ""} onChange={(event) => set({ phone: event.target.value })} />
        </label>
      </div>
      <label htmlFor={id("relationship")} className={label}>
        How they are related to you <span className="font-normal">(for example mother, uncle, guardian)</span>
        <input id={id("relationship")} className={`mt-1.5 ${fieldClass}`} maxLength={60}
          value={answer.relationship || ""} onChange={(event) => set({ relationship: event.target.value })} />
      </label>
      <label className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text)]">
        <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]" checked={answer.consent === true}
          onChange={(event) => set({ consent: event.target.checked })} />
        <span>I am their parent or guardian, and I agree to them taking part.</span>
      </label>
    </div>
  );
}
