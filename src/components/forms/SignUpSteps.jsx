import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import BusyLabel from "../ui/BusyLabel";

/**
 * A sign-up in a few short steps rather than one long page. Each step has its
 * own heading, checks its own answers before moving on (so a problem shows where
 * it was made), and the last step's button sends the sign-up.
 *
 * `steps`: [{ title, heading, intro?, body, problem() }], `problem` returning a
 * message or "". `lastStepExtra` shows above the buttons on the last step only
 * (the order summary on a phone, where the side column is hidden until then).
 */
export default function SignUpSteps({ steps, step, onStep, onFinish, busy = false, finishLabel, error, onError, lastStepExtra }) {
  const topRef = useRef(null);
  const last = step === steps.length - 1;
  const current = steps[step];

  function go(index) {
    onError("");
    onStep(index);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    const problem = current.problem?.() || "";
    if (problem) { onError(problem); return; }
    if (last) onFinish();
    else go(step + 1);
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      {/* Progress: one bar per step; a finished step can be gone back to. */}
      <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-label="Sign-up steps">
        {steps.map((item, index) => {
          const done = index < step;
          return (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => done && go(index)}
                disabled={!done}
                aria-current={index === step ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${item.title}${done ? " (done, go back)" : ""}`}
                className="group block w-full text-left disabled:cursor-default"
              >
                <span
                  className={`block h-1.5 rounded-full transition-colors duration-300 ${
                    index <= step ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
                  } ${done ? "group-hover:opacity-80" : ""}`}
                />
                <span
                  className={`mt-2 hidden truncate text-sm font-medium sm:block ${
                    index === step ? "text-[var(--color-primary)]" : done ? "text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {item.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-8">
        <p className="text-sm font-semibold text-[var(--color-primary)]">
          Step {step + 1} of {steps.length}
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[1.75rem]">{current.heading}</h2>
        {current.intro && <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{current.intro}</p>}
      </div>

      <div key={step} className="signup-step mt-7 space-y-6">{current.body}</div>

      {error && (
        <p
          role="alert"
          className="mt-6 max-w-full break-words rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-4 py-3 text-[15px] leading-relaxed text-red-700"
        >
          {error}
        </p>
      )}

      {last && lastStepExtra && <div className="mt-8 lg:hidden">{lastStepExtra}</div>}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => go(step - 1)} disabled={busy} className="btn-outline min-h-[48px] justify-center px-6">
            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
            Back
          </button>
        ) : <span />}
        <button
          type="button"
          onClick={next}
          disabled={busy}
          className={`btn-primary min-h-[48px] justify-center px-7 text-[15px]${busy ? " cursor-not-allowed opacity-60" : ""}`}
        >
          {busy ? <BusyLabel>Saving…</BusyLabel> : last ? finishLabel : "Continue"}
          {!busy && <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
