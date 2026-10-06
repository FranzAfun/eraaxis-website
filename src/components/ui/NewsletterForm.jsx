import { useState } from "react";
import ConsentCheck from "./ConsentCheck";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm({ source, surface = "light" }) {
  const onDark = surface === "dark";
  const successInk = onDark ? "text-[var(--color-success-text-dark)]" : "text-[var(--color-success-text)]";
  const errorInk = onDark ? "text-[var(--color-error-text-dark)]" : "text-[var(--color-field-danger)]";
  const secondaryInk = onDark ? "text-[var(--color-text-on-dark-muted)]" : "text-[var(--color-text-muted)]";
  const [email, setEmail]                   = useState("");
  const [emailError, setEmailError]         = useState("");
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [agreed, setAgreed]                 = useState(false);
  const [submitted, setSubmitted]           = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [submitError, setSubmitError]       = useState("");

  function handleChange(e) {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
    if (submitError) setSubmitError("");
    if (alreadySubscribed) setAlreadySubscribed(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError("Email address is required");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setEmailError("Enter a valid email address");
      return;
    }
    if (!agreed) return;

    setEmailError("");
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const json = await api.post("/newsletter/subscribe", {
        email: email.trim().toLowerCase(),
        source,
      });

      if (json?.data?.alreadySubscribed) {
        setAlreadySubscribed(true);
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className={`flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 ${successInk}`}>
        <CheckCircle2 size={18} className="shrink-0" />
        <p className="text-sm font-semibold">
          You&apos;re subscribed! ERA AXIS updates will arrive in your inbox.
        </p>
      </div>
    );
  }

  return (
    <div>
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex flex-1 flex-col gap-1">
        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter your email"
          disabled={isSubmitting}
          aria-invalid={emailError ? true : undefined}
          className={`min-h-[44px] w-full rounded-[var(--radius-sm)] border bg-white px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:ring-2 focus:ring-offset-2 disabled:opacity-100 ${
            emailError
              ? "border-[var(--color-field-danger)] focus:border-[var(--color-field-danger)] focus:ring-[var(--color-field-danger)]"
              : "border-[var(--color-ui-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          }`}
        />
        {emailError && (
          <p className={`text-left text-xs ${errorInk}`}>{emailError}</p>
        )}
        {alreadySubscribed && (
          <p className={`text-left text-xs ${secondaryInk}`}>
            This email is already subscribed.
          </p>
        )}
        {submitError && (
          <p className={`text-left text-xs ${errorInk}`}>{submitError}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !agreed}
        className={`btn-primary min-h-[44px] shrink-0 justify-center disabled:opacity-100 disabled:cursor-not-allowed${agreed ? "" : " needs-consent"}`}
      >
        {isSubmitting ? (
          "Subscribing…"
        ) : (
          <>
            Subscribe
            <ArrowRight size={15} strokeWidth={2} />
          </>
        )}
      </button>
    </form>
    <ConsentCheck checked={agreed} onChange={setAgreed} surface={onDark ? "dark" : "light"} size="xs" className="mt-1" />
    </div>
  );
}
