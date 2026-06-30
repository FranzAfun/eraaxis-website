import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { api } from "../../services/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm({ source }) {
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
      <p className="text-sm font-semibold text-[var(--color-primary)]">
        You&apos;re subscribed! ERA AXIS updates will arrive in your inbox.
      </p>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex flex-1 flex-col gap-1">
        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter your email"
          disabled={isSubmitting}
          className={`min-h-[44px] w-full rounded-[var(--radius-sm)] border px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:ring-2 disabled:opacity-60 ${
            emailError
              ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
              : "border-[var(--color-border)] bg-white focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
          }`}
        />
        {emailError && (
          <p className="text-left text-xs text-red-600">{emailError}</p>
        )}
        {alreadySubscribed && (
          <p className="text-left text-xs text-[var(--color-text-muted)]">
            This email is already subscribed.
          </p>
        )}
        {submitError && (
          <p className="text-left text-xs text-red-600">{submitError}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary min-h-[44px] shrink-0 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
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
  );
}
