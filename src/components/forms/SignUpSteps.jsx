import { useRef } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import BusyLabel from "../ui/BusyLabel";

/**
 * A sign-up in a few short steps rather than one long page. Each step checks its
 * own answers before moving on, so a problem is shown where it was made; the last
 * step's button sends the sign-up.
 *
 * `steps`: [{ title, body, problem() }] where `problem` returns a message or "".
 */
export default function SignUpSteps({ steps, step, onStep, onFinish, busy = false, finishLabel, error, onError }) {
  const topRef = useRef(null);
  const last = step === steps.length - 1;

  function go(index) {
    onError("");
    onStep(index);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    const problem = steps[step].problem?.() || "";
    if (problem) { onError(problem); return; }
    if (last) onFinish();
    else go(step + 1);
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      <ol className="mb-6 flex items-center gap-2" aria-label="Sign-up steps">
        {steps.map((item, index) => {
          const done = index < step;
          const current = index === step;
          return (
            <li key={item.title} className="flex min-w-0 flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => done && go(index)}
                disabled={!done}
                aria-current={current ? "step" : undefined}
                className={`flex min-w-0 items-center gap-2 text-left text-xs font-semibold ${
                  current ? "text-[var(--color-primary)]" : done ? "text-[var(--color-text-primary)] hover:text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                } disabled:cursor-default`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                    current
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : done
                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                        : "border-[var(--color-border)]"
                  }`}
                >
                  {done ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : index + 1}
                </span>
                <span className={`truncate ${current ? "" : "hidden sm:inline"}`}>{item.title}</span>
              </button>
              {index < steps.length - 1 && <span aria-hidden="true" className="h-px min-w-3 flex-1 bg-[var(--color-border)]" />}
            </li>
          );
        })}
      </ol>

      <div className="space-y-5">{steps[step].body}</div>

      {error && (
        <p
          role="alert"
          className="mt-6 max-w-full break-words rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm leading-relaxed text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => go(step - 1)} disabled={busy} className="btn-outline justify-center">
            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
            Back
          </button>
        ) : <span />}
        <button
          type="button"
          onClick={next}
          disabled={busy}
          className={`btn-primary justify-center${busy ? " cursor-not-allowed opacity-60" : ""}`}
        >
          {busy ? <BusyLabel>Saving…</BusyLabel> : last ? finishLabel : "Continue"}
          {!busy && <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
