import { useLayoutEffect, useRef, useState } from "react";
import { AlertCircle, Check, Star } from "lucide-react";
import SelectField from "../ui/SelectField";
import SchoolPicker from "./SchoolPicker";
import { exampleText, fieldClass, scaleStyle } from "./formDisplay";
import { suggestEmailCorrection } from "../../utils/emailTypoCheck";

/**
 * One question, as somebody filling the form in meets it: its own card, the
 * question in plain words, and an answer area sized for a thumb. Text is 16px so
 * a phone does not zoom in on the field, and every choice is a whole row to tap
 * rather than a small circle to aim for.
 */

function optionRow(selected) {
  return [
    "flex min-h-[48px] w-full cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border px-3.5 py-2.5 text-left text-[15px] transition-colors",
    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-primary)]/30",
    selected
      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/[0.06] text-[var(--color-primary-deep)]"
      : "border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)]/40",
  ].join(" ");
}

// The mark beside an option, drawn rather than left to the browser, so a radio and
// a checkbox read the same on every phone.
function Mark({ selected, multiple }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors",
        multiple ? "rounded-[5px]" : "rounded-full",
        selected ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-border)] bg-white",
      ].join(" ")}
    >
      {selected &&
        (multiple ? (
          <Check size={13} strokeWidth={3} className="text-white" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-white" />
        ))}
    </span>
  );
}

function Choices({ question, value, onChange, multiple, options, describedBy }) {
  const chosen = multiple ? (Array.isArray(value) ? value : []) : value;
  return (
    <div role={multiple ? "group" : "radiogroup"} aria-labelledby={`q-${question.key}-label`} aria-describedby={describedBy} className="space-y-2">
      {options.map((option) => {
        const selected = multiple ? chosen.includes(option.value) : chosen === option.value;
        return (
          <label key={String(option.value)} className={optionRow(selected)}>
            <input
              type={multiple ? "checkbox" : "radio"}
              name={question.key}
              checked={selected}
              onChange={() => {
                if (!multiple) return onChange(option.value);
                return onChange(
                  selected ? chosen.filter((item) => item !== option.value) : [...chosen, option.value]
                );
              }}
              className="sr-only"
            />
            <Mark selected={selected} multiple={multiple} />
            <span className="min-w-0 break-words">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

/**
 * A rating: every star up to the chosen one is filled, and hovering shows what a
 * click would choose. Underneath they are ordinary radio buttons, so the keyboard
 * and screen readers work as they would on any other choice.
 */
function StarRating({ question, value, onChange, describedBy }) {
  const { max = 5, minLabel, maxLabel } = question.scale || {};
  const [hover, setHover] = useState(null);
  const chosen = Number(value) || 0;
  const shown = hover ?? chosen;
  return (
    <div>
      <div
        role="radiogroup"
        aria-labelledby={`q-${question.key}-label`}
        aria-describedby={describedBy}
        className="flex flex-wrap gap-1"
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: max }, (_, index) => index + 1).map((star) => (
          <label key={star} className="cursor-pointer" onMouseEnter={() => setHover(star)}>
            <input
              type="radio"
              name={question.key}
              value={star}
              checked={chosen === star}
              onChange={() => onChange(star)}
              className="peer sr-only"
            />
            <span className="block rounded-md p-1 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-primary)]">
              <Star
                aria-hidden="true"
                strokeWidth={1.5}
                className={`h-9 w-9 transition-colors ${
                  star <= shown ? "fill-amber-400 text-amber-400" : "text-[var(--color-border)]"
                }`}
              />
            </span>
            <span className="sr-only">
              {star} of {max}
            </span>
          </label>
        ))}
      </div>
      {(minLabel || maxLabel) && (
        <p className="mt-1.5 flex max-w-xs justify-between gap-4 text-sm text-[var(--color-text-muted)]">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </p>
      )}
    </div>
  );
}

// Numbers sit in one row where they fit, and in two even rows on a phone when
// there are more than six, so a 0 to 10 scale never leaves "10" alone on a line.
function NumberScale({ question, value, onChange, describedBy }) {
  const { min = 1, max = 5, minLabel, maxLabel } = question.scale || {};
  const points = Array.from({ length: max - min + 1 }, (_, index) => min + index);
  const narrowColumns = points.length > 6 ? Math.ceil(points.length / 2) : points.length;
  return (
    <div style={{ maxWidth: `${points.length * 64}px` }}>
      <div
        role="radiogroup"
        aria-labelledby={`q-${question.key}-label`}
        aria-describedby={describedBy}
        className="grid gap-2 [grid-template-columns:repeat(var(--scale-narrow),minmax(0,1fr))] sm:[grid-template-columns:repeat(var(--scale-wide),minmax(0,1fr))]"
        style={{ "--scale-narrow": narrowColumns, "--scale-wide": points.length }}
      >
        {points.map((point) => {
          const selected = Number(value) === point && value !== null && value !== "";
          return (
            <label
              key={point}
              className={[
                "flex h-12 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border text-base font-semibold transition-colors",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-primary)]/30",
                selected
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)]/40",
              ].join(" ")}
            >
              <input
                type="radio"
                name={question.key}
                checked={selected}
                onChange={() => onChange(point)}
                className="sr-only"
              />
              {point}
            </label>
          );
        })}
      </div>
      {(minLabel || maxLabel) && (
        <p className="mt-1.5 flex justify-between gap-4 text-sm text-[var(--color-text-muted)]">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </p>
      )}
    </div>
  );
}

// A typed address that is one slip away from a common provider gets a gentle
// "did you mean", with a button that fixes it. It never blocks anything.
function EmailInput({ question, value, onChange, describedBy, invalid }) {
  const suggestion = value ? suggestEmailCorrection(value) : null;
  return (
    <div>
      <input
        id={`q-${question.key}`}
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        value={value || ""}
        maxLength={254}
        placeholder="Type your answer"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value.trim())}
        className={fieldClass}
      />
      {suggestion && (
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Did you mean <span className="font-semibold text-[var(--color-text-primary)]">{suggestion}</span>?{" "}
          <button
            type="button"
            onClick={() => onChange(suggestion)}
            className="font-semibold text-[var(--color-primary)] underline underline-offset-2"
          >
            Use this
          </button>
        </p>
      )}
    </div>
  );
}

// A paragraph answer starts as one line and grows with what is written, so a
// short answer does not face a large empty box and a long one never scrolls
// inside itself. It also fits an answer brought back from a saved draft.
function ParagraphInput({ value, onChange, ...field }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const box = ref.current;
    if (!box) return;
    box.style.height = "auto";
    box.style.height = `${box.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      {...field}
      ref={ref}
      rows={1}
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      className={`${fieldClass} resize-none overflow-hidden`}
    />
  );
}

// Choices that are not required can be taken back, as on any paper form.
const CLEARABLE = new Set(["single_choice", "linear_scale", "yes_no", "dropdown"]);

export default function QuestionField({ slug, question, value, onChange, error, note }) {
  const helpId = question.help ? `q-${question.key}-help` : undefined;
  const errorId = error ? `q-${question.key}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;
  const invalid = Boolean(error);
  const common = {
    id: `q-${question.key}`,
    className: fieldClass,
    placeholder: "Type your answer",
    "aria-invalid": invalid || undefined,
    "aria-describedby": describedBy,
  };
  const options = question.options || [];

  function field() {
    switch (question.type) {
      case "long_text":
        return (
          <ParagraphInput
            {...common}
            maxLength={question.validation?.maxLength || 5000}
            value={value}
            onChange={onChange}
          />
        );
      case "number":
        return (
          <input
            {...common}
            type="text"
            inputMode={question.validation?.integer ? "numeric" : "decimal"}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
          />
        );
      case "email":
        return (
          <EmailInput
            question={question}
            value={value}
            onChange={onChange}
            invalid={invalid}
            describedBy={describedBy}
          />
        );
      case "phone":
        return (
          <input
            {...common}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={value || ""}
            onChange={(event) => onChange(event.target.value)}
          />
        );
      case "date":
        return (
          <input
            {...common}
            type="date"
            min={question.validation?.min}
            max={question.validation?.max}
            value={value || ""}
            onChange={(event) => onChange(event.target.value)}
          />
        );
      case "single_choice":
        return <Choices question={question} value={value} onChange={onChange} options={options} describedBy={describedBy} />;
      case "multiple_choice":
        return <Choices question={question} value={value} onChange={onChange} options={options} describedBy={describedBy} multiple />;
      case "yes_no":
        return (
          <Choices
            question={question}
            value={value}
            onChange={onChange}
            describedBy={describedBy}
            options={[
              { value: true, label: "Yes" },
              { value: false, label: "No" },
            ]}
          />
        );
      case "dropdown":
        return (
          <SelectField
            id={`q-${question.key}`}
            name={question.key}
            className={fieldClass}
            value={value || ""}
            placeholder="Choose one"
            options={options.map((option) => ({ value: option.value, label: option.label }))}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value)}
          />
        );
      case "linear_scale":
        return scaleStyle(question.scale) === "stars" ? (
          <StarRating question={question} value={value} onChange={onChange} describedBy={describedBy} />
        ) : (
          <NumberScale question={question} value={value} onChange={onChange} describedBy={describedBy} />
        );
      case "school":
        return (
          <SchoolPicker
            slug={slug}
            question={question}
            value={value}
            onChange={onChange}
            fieldClass={fieldClass}
            invalid={invalid}
            describedBy={describedBy}
          />
        );
      case "file":
        return (
          <p className="rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] px-3.5 py-3 text-sm text-[var(--color-text-muted)]">
            File uploads are not open on this form yet.
          </p>
        );
      default:
        return (
          <input
            {...common}
            type="text"
            autoComplete={question.binding === "full_name" ? "name" : "off"}
            maxLength={question.validation?.maxLength || 240}
            value={value || ""}
            onChange={(event) => onChange(event.target.value)}
          />
        );
    }
  }

  const answered = value !== undefined && value !== null && value !== "";
  // Choice groups are labelled by id; single fields by their <label>.
  const grouped = ["single_choice", "multiple_choice", "yes_no", "linear_scale"].includes(question.type);
  const LabelTag = grouped ? "p" : "label";

  return (
    <div
      className={`rounded-[var(--radius-md)] border bg-white px-5 py-5 transition-colors sm:px-6 ${
        invalid ? "border-red-400" : "border-[var(--color-border)]"
      }`}
    >
      <LabelTag
        id={`q-${question.key}-label`}
        {...(grouped ? {} : { htmlFor: `q-${question.key}` })}
        className="block text-base font-semibold leading-snug text-[var(--color-text-primary)]"
      >
        {question.label}
        {question.required && (
          <span className="ml-1 text-red-600" aria-hidden="true">
            *
          </span>
        )}
        {question.required && <span className="sr-only"> (required)</span>}
      </LabelTag>
      {question.help && (
        <p id={helpId} className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
          {exampleText(question.help)}
        </p>
      )}
      <div className="mt-4">{field()}</div>
      {note && <p className="mt-2 text-sm text-[var(--color-text-muted)]">{note}</p>}
      {!question.required && answered && CLEARABLE.has(question.type) && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-3 text-sm font-medium text-[var(--color-text-muted)] underline-offset-2 hover:text-[var(--color-text-primary)] hover:underline"
        >
          Clear selection
        </button>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-3 flex items-start gap-1.5 text-sm font-medium text-red-600">
          <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
