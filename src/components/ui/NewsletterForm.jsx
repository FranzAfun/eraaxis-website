import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, MailCheck } from "lucide-react";
import { api } from "../../services/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Bots once used this form to email strangers, so it carries two checks nobody
// sees (EDOS server/utils/newsletterSignup.js). A short-lived pass, asked for as
// soon as the form is on screen: the API refuses one younger than three seconds,
// and nobody types an address faster. And a hidden field people never see; a
// bot that fills it is quietly ignored. Signing up then sends an email, and the
// person joins the list only once they press its link.
const PASS_MIN_AGE_MS = 3500;
const PASS_REFRESH_MS = 100 * 60 * 1000; // the API accepts one for two hours
const TRAP_FIELD = "website";
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function NewsletterForm({ source, surface = "light" }) {
  const onDark = surface === "dark";
  const successInk = onDark ? "text-[var(--color-success-text-dark)]" : "text-[var(--color-success-text)]";
  const errorInk = onDark ? "text-[var(--color-error-text-dark)]" : "text-[var(--color-field-danger)]";
  const secondaryInk = onDark ? "text-[var(--color-text-on-dark-muted)]" : "text-[var(--color-text-muted)]";
  const [email, setEmail]                   = useState("");
  const [emailError, setEmailError]         = useState("");
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [sentTo, setSentTo]                 = useState("");
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [submitError, setSubmitError]       = useState("");
  const formRef = useRef(null);
  const trapRef = useRef(null);
  const passRef = useRef(null); // { promise, at }: `at` is when the pass arrived

  function requestPass() {
    const held = passRef.current;
    if (held && !(held.at && Date.now() - held.at > PASS_REFRESH_MS)) return held.promise;
    const entry = { at: 0, promise: null };
    entry.promise = api.get("/newsletter/signup-pass")
      .then((json) => {
        entry.at = Date.now();
        return json?.data?.pass ?? null;
      })
      .catch(() => {
        if (passRef.current === entry) passRef.current = null;
        return null;
      });
    passRef.current = entry;
    return entry.promise;
  }

  // A pass old enough for the API to accept.
  async function readyPass({ fresh = false } = {}) {
    if (fresh) passRef.current = null;
    const pass = await requestPass();
    const age = Date.now() - (passRef.current?.at || Date.now());
    if (age < PASS_MIN_AGE_MS) await wait(PASS_MIN_AGE_MS - age);
    return pass;
  }

  // Ask for the pass once the form is nearly on screen, so it is old enough by
  // the time anybody has typed an address.
  useEffect(() => {
    const form = formRef.current;
    if (!form || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        requestPass();
        observer.disconnect();
      }
    }, { rootMargin: "300px" });
    observer.observe(form);
    return () => observer.disconnect();
    // requestPass only reads refs, so it never needs a fresh closure.
  }, []);

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

    const address = email.trim().toLowerCase();
    const send = (pass) => api.post("/newsletter/subscribe", {
      email: address,
      source,
      pass,
      [TRAP_FIELD]: trapRef.current?.value ?? "",
    });

    try {
      let json;
      try {
        json = await send(await readyPass());
      } catch (error) {
        // A pass that was too young, too old or never arrived: one more go.
        const code = error?.payload?.code;
        if (code === "SIGNUP_TOO_FAST") {
          await wait(2000);
          json = await send(await readyPass());
        } else if (code === "SIGNUP_PASS_EXPIRED" || code === "SIGNUP_PASS_INVALID") {
          json = await send(await readyPass({ fresh: true }));
        } else {
          throw error;
        }
      }

      if (json?.data?.alreadySubscribed) {
        setAlreadySubscribed(true);
      } else {
        setSentTo(address);
      }
    } catch (error) {
      setSubmitError(error?.name === "ApiError" && error.status === 429
        ? error.message
        : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (sentTo) {
    return (
      <div role="status" className={`flex items-start gap-2.5 rounded-[var(--radius-sm)] border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-left ${successInk}`}>
        <MailCheck size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p className="text-sm">
          <span className="font-semibold">Almost there.</span> Check your inbox at {sentTo} and press the link to confirm your subscription.
        </p>
      </div>
    );
  }

  // The send button is a small arrow inside the field, on the right.
  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-1">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={handleChange}
          onFocus={() => requestPass()}
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
      {/* The hidden field: off screen, out of the tab order and hidden from
          screen readers, so only a bot ever fills it. */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label>
          Your website
          <input ref={trapRef} type="text" name={TRAP_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
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
