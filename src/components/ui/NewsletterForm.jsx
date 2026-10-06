import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
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

  // The send button is a small arrow inside the field, on the right.
  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-1">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter your email"
          aria-label="Email address"
          autoComplete="email"
          disabled={isSubmitting}
          aria-invalid={emailError ? true : undefined}
          className={`min-h-[48px] w-full rounded-[var(--radius-sm)] border bg-white py-3 pl-4 pr-14 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:ring-2 focus:ring-offset-2 disabled:opacity-100 ${
            emailError
              ? "border-[var(--color-field-danger)] focus:border-[var(--color-field-danger)] focus:ring-[var(--color-field-danger)]"
              : "border-[var(--color-ui-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          }`}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label={isSubmitting ? "Subscribing" : "Subscribe"}
          title="Subscribe"
          className="absolute right-1 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[4px] bg-[var(--color-primary)] text-[var(--color-text-inverse)] transition-[filter,transform] duration-200 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 size={17} strokeWidth={2.25} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
          ) : (
            <ArrowRight size={17} strokeWidth={2.25} aria-hidden="true" />
          )}
        </button>
      </div>
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
    </form>
  );
}
