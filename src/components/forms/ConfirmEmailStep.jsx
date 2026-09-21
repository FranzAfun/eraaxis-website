import { useEffect, useState } from "react";
import { AlertCircle, MailCheck } from "lucide-react";
import { API_ERROR_MESSAGES, toUserMessage } from "../../services/api";
import { confirmFormEmail, resendFormCode } from "../../services/formsService";
import { fieldClass } from "./formDisplay";

// Matches the server's wait between codes.
const RESEND_WAIT_SECONDS = 60;

/**
 * The six-digit code step, for a form that confirms the address it was given.
 *
 * The answers are already saved by the time this shows, so nothing here can lose
 * them; it only proves the address is real. Somebody who typed it wrong can go
 * back and correct it rather than wait for an email that will never come.
 */
export default function ConfirmEmailStep({ receipt, email, onConfirmed, onChangeAddress }) {
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [wait, setWait] = useState(RESEND_WAIT_SECONDS);

  // Counts down to when another code can be asked for.
  useEffect(() => {
    if (wait <= 0) return undefined;
    const timer = setTimeout(() => setWait((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  async function confirm(event) {
    event.preventDefault();
    const digits = code.replace(/\D/g, "");
    if (digits.length !== 6) {
      setMessage("Enter the six-digit code from the email.");
      return;
    }
    setChecking(true);
    setMessage("");
    setNotice("");
    try {
      const result = await confirmFormEmail(receipt, digits);
      if (result.confirmed) onConfirmed();
      else setMessage(result.message || "That code doesn't match. Check the email and try again.");
    } catch (error) {
      setMessage(toUserMessage(error, API_ERROR_MESSAGES.server));
    } finally {
      setChecking(false);
    }
  }

  async function resend() {
    setMessage("");
    setNotice("");
    try {
      const result = await resendFormCode(receipt);
      if (result.sent) {
        setCode("");
        setNotice(`A new code is on its way to ${email}. The earlier one no longer works.`);
      } else if (result.message) {
        setMessage(result.message);
      }
      setWait(result.retryAfter || RESEND_WAIT_SECONDS);
    } catch (error) {
      setMessage(toUserMessage(error, API_ERROR_MESSAGES.server));
    }
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-5 py-6 sm:px-8 sm:py-8">
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary)]/[0.08] text-[var(--color-primary)]">
        <MailCheck size={22} aria-hidden="true" />
      </span>
      <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
        Confirm your email address
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
        Your answers are saved. We&apos;ve sent a six-digit code to{" "}
        <span className="break-all font-semibold text-[var(--color-text-primary)]">{email}</span>. Enter it here so
        we know we can reach you.
      </p>

      <form onSubmit={confirm} className="mt-6" noValidate>
        <label htmlFor="confirm-code" className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">
          Code from the email
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="confirm-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={7}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/[^\d ]/g, ""))}
            aria-invalid={message ? true : undefined}
            aria-describedby={message ? "confirm-code-error" : undefined}
            className={`${fieldClass} font-mono tracking-[0.3em] sm:max-w-[200px]`}
          />
          <button type="submit" disabled={checking} className="btn-primary min-h-[48px] justify-center disabled:opacity-60">
            {checking ? "Checking…" : "Confirm"}
          </button>
        </div>
        {message && (
          <p id="confirm-code-error" role="alert" className="mt-3 flex items-start gap-1.5 text-sm font-medium text-red-600">
            <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
            <span>{message}</span>
          </p>
        )}
        {notice && (
          <p role="status" className="mt-3 text-sm text-[var(--color-text-secondary)]">
            {notice}
          </p>
        )}
      </form>

      <div className="mt-6 flex flex-col gap-2 border-t border-[var(--color-border-soft)] pt-5 text-sm text-[var(--color-text-secondary)]">
        <p>
          No email? Check your spam folder, or{" "}
          {wait > 0 ? (
            <span className="text-[var(--color-text-muted)]">ask for a new code in {wait}s</span>
          ) : (
            <button type="button" onClick={resend} className="font-semibold text-[var(--color-primary)] underline underline-offset-2">
              send a new code
            </button>
          )}
          .
        </p>
        <p>
          Wrong address?{" "}
          <button
            type="button"
            onClick={onChangeAddress}
            className="font-semibold text-[var(--color-primary)] underline underline-offset-2"
          >
            Change it
          </button>
        </p>
      </div>
    </div>
  );
}
