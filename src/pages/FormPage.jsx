import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleSlash,
  CloudCheck,
  History,
  RefreshCw,
  SearchX,
  Send,
  WifiOff,
} from "lucide-react";
import SEO from "../components/SEO";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import QuestionField from "../components/forms/QuestionField";
import GoogleSignIn from "../components/forms/GoogleSignIn";
import ConfirmEmailStep from "../components/forms/ConfirmEmailStep";
import {
  clearDraft,
  credentialProfile,
  hasAnswers,
  looksLikeFullName,
  readDraft,
  writeDraft,
} from "../components/forms/formDisplay";
import { API_ERROR_MESSAGES, toUserMessage } from "../services/api";
import { SUBMIT_OUTCOME, loadPublicForm, submitPublicForm } from "../services/formsService";
import { RULES_SHA, SCHEMA_VERSION, validateAnswers } from "../utils/formSchema";
import { resolveMediaUrl } from "../utils/resolveMediaUrl";

/**
 * A form published from EDOS, as the public fills it in.
 *
 * Built for a phone first: one question to a card, a section to a page, big
 * targets, and nothing lost to a dropped signal — answers are kept on the device
 * as they are typed and come back if the page is reopened.
 *
 * The page checks answers with the same rules the server uses, so problems are
 * pointed out before anybody presses Submit. The server's check is the one that
 * counts: if this copy of the rules is older than the server's, the page stops
 * judging and lets the server say what is wrong.
 */

// The server refuses a form sent within three seconds of being opened. A form
// brought back from this device can be ready that fast, so the page waits out
// whatever is left rather than showing somebody an error for being quick.
const MIN_FILL_MS = 3500;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const tooSoonBy = (loadedAt) => loadedAt + MIN_FILL_MS - Date.now();
// Google's credential lasts an hour; one about to run out would be refused.
const signInLapsed = (profile) => !profile || profile.expiresAt < Date.now() + 30000;

const card = "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white";
const primaryButton =
  "btn-primary min-h-[48px] justify-center px-6 text-[15px] disabled:cursor-not-allowed disabled:opacity-60";
const quietButton =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-5 text-[15px] font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-primary)]/40 disabled:opacity-60";

// The introduction is formatted; a page description takes words.
const plainText = (html) =>
  (html || "").replace(/<\/(p|li)>/g, " ").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

function focusRecordEmail() {
  const box = document.getElementById("record-email");
  box?.scrollIntoView({ behavior: "smooth", block: "center" });
  box?.focus({ preventScroll: true });
}

function focusQuestion(key) {
  const label = document.getElementById(`q-${key}-label`);
  label?.scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById(`q-${key}`)?.focus({ preventScroll: true });
}

const LOADING = Object.freeze({ view: "loading", form: null, error: "", loadedAt: 0 });

export default function FormPage() {
  const { slug } = useParams();
  const [attempt, setAttempt] = useState(0);
  // Stamped with the slug it belongs to, so a late reply for a previous form can
  // never be shown against the current one.
  const [result, setResult] = useState({ id: slug, ...LOADING });

  useEffect(() => {
    let active = true;
    loadPublicForm(slug)
      .then((form) => {
        if (!active) return;
        setResult({ id: slug, view: form ? "form" : "missing", form, error: "", loadedAt: Date.now() });
      })
      .catch((error) => {
        if (!active) return;
        setResult({ id: slug, ...LOADING, view: "error", error: toUserMessage(error, API_ERROR_MESSAGES.server) });
      });
    return () => {
      active = false;
    };
  }, [slug, attempt]);

  const retry = useCallback(() => {
    setResult({ id: slug, ...LOADING });
    setAttempt((current) => current + 1);
  }, [slug]);

  // A fresh copy of the form, fetched when the one on screen went stale.
  const replaceForm = useCallback(
    (form) => setResult({ id: slug, view: "form", form, error: "", loadedAt: Date.now() }),
    [slug]
  );

  const { view, form, error, loadedAt } = result.id === slug ? result : LOADING;
  const intro = plainText(form?.description).slice(0, 160);

  return (
    <>
      <SEO
        title={form ? `${form.title} — ERA AXIS` : "Form — ERA AXIS"}
        description={intro || "Fill in this form from ERA AXIS."}
        noindex
      />
      <section className="min-h-[70vh] bg-[var(--color-surface-soft)] pb-16 pt-6 sm:pb-24 sm:pt-10">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6" aria-busy={view === "loading"}>
          {view === "loading" && <FormSkeleton />}

          {view === "missing" && (
            <Notice
              icon={SearchX}
              title="We couldn't find this form."
              body="The link may have been copied incompletely, or the form may have been taken down. Please check the link with whoever shared it."
            >
              <Link to="/" className={quietButton}>
                Go to the ERA AXIS home page <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Notice>
          )}

          {view === "error" && (
            <Notice
              icon={WifiOff}
              title="We couldn't open this form."
              body={`${error} This doesn't mean the form is closed — we just couldn't reach it right now.`}
            >
              <button type="button" onClick={retry} className={primaryButton}>
                <RefreshCw size={16} aria-hidden="true" /> Try again
              </button>
            </Notice>
          )}

          {view === "form" && !form.open && (
            <>
              <FormHeader form={form} />
              <Closed message={form.closedReason} />
            </>
          )}

          {view === "form" && form.open && (
            <FormFill
              key={`${slug}:${form.version}`}
              slug={slug}
              form={form}
              loadedAt={loadedAt}
              onFormChanged={replaceForm}
            />
          )}
        </div>
      </section>
    </>
  );
}

function FormFill({ slug, form, loadedAt, onFormChanged }) {
  const definition = form.definition;
  // A copy of the rules that differs from the server's cannot be trusted to judge,
  // only to lay the form out. The server's reply then says what is wrong.
  const trustRules = form.rulesSha === RULES_SHA && form.schemaVersion === SCHEMA_VERSION;

  const [draft] = useState(() => readDraft(slug));
  const [answers, setAnswers] = useState(() => draft?.answers || {});
  const [step, setStep] = useState(() => (draft?.version === form.version ? draft.step || 0 : 0));
  const [restored, setRestored] = useState(() => hasAnswers(draft?.answers) && !draft?.receipt);
  // The form was edited since these answers were started on this device.
  const [edited] = useState(() => Boolean(draft?.version && draft.version !== form.version && hasAnswers(draft.answers)));
  const [revealed, setRevealed] = useState(() => new Set());
  const [checked, setChecked] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [credential, setCredential] = useState("");
  // The address somebody ticked to send with. Held as the address rather than a
  // yes, so switching to another account asks again.
  const [recordedFor, setRecordedFor] = useState("");
  // The name the account supplied, kept so the form can say so for as long as that
  // is still what is in the box.
  const [accountName, setAccountName] = useState("");
  const [switching, setSwitching] = useState(false);
  const [sending, setSending] = useState(false);
  const [problem, setProblem] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  // What came of sending: waiting on a code, sent, or closed in the meantime. A
  // draft that already has a receipt reopens at the code step.
  const [outcome, setOutcome] = useState(() =>
    draft?.receipt ? { view: "confirm", receipt: draft.receipt, email: draft.email } : null
  );
  const honeypot = useRef(null);
  const topRef = useRef(null);

  const questions = useMemo(
    () => (definition.sections || []).flatMap((section) => section.questions || []),
    [definition]
  );
  const emailQuestion = questions.find((question) => question.binding === "email" && question.type === "email");
  const nameKey = questions.find((question) => question.binding === "full_name")?.key;

  const profile = useMemo(() => (credential ? credentialProfile(credential) : null), [credential]);
  const signedIn = Boolean(profile);
  const needsSignIn = form.requiresSignIn && !signedIn;
  // As on a Google Form: the address comes from the account, is shown in its own
  // card before every question, and is sent only once they tick to say so. The
  // form's own email question is then answered from the account and not shown.
  const emailRecorded = !form.requiresSignIn || (signedIn && recordedFor === profile.email);
  const fromAccountKey = form.requiresSignIn ? emailQuestion?.key : undefined;

  // A form that proves who is answering fills its email question from the account,
  // which is also the address the server will keep.
  const effective = useMemo(
    () => (profile && emailQuestion ? { ...answers, [emailQuestion.key]: profile.email } : answers),
    [answers, profile, emailQuestion]
  );
  const result = useMemo(() => validateAnswers(definition, effective), [definition, effective]);

  const hidden = new Set(result.hidden);
  const shown = (question) => !hidden.has(question.key) && question.key !== fromAccountKey;
  const sections = definition.sections || [];
  const found = sections.filter((section) => (section.questions || []).some(shown));
  // A form whose only question was the email still has a first page, for its card.
  const pages = found.length || !form.requiresSignIn ? found : sections.slice(0, 1);
  const current = Math.min(step, Math.max(pages.length - 1, 0));
  const page = pages[current];
  const paged = pages.length > 1;
  const last = current >= pages.length - 1;
  const sectionOf = new Map(
    sections.flatMap((section) => (section.questions || []).map((question) => [question.key, section.key]))
  );
  const pageOf = (key) => pages.findIndex((candidate) => candidate.key === sectionOf.get(key));

  // A page's problems are shown once somebody tries to leave it, not while they are
  // still filling it in.
  const clientErrors = trustRules
    ? Object.fromEntries(
        result.errors
          .filter((item) => checked || revealed.has(sectionOf.get(item.questionKey)))
          .map((item) => [item.questionKey, item.message])
      )
    : {};
  const errors = { ...clientErrors, ...serverErrors };
  const emailCardError = !emailRecorded && (checked || revealed.has(pages[0]?.key));

  // Kept on the device as it is typed. The Google credential is never stored.
  useEffect(() => {
    if (outcome?.view === "sent" || outcome?.view === "closed") return;
    if (outcome?.view === "confirm") {
      writeDraft(slug, { answers, step: current, version: form.version, receipt: outcome.receipt, email: outcome.email });
    } else if (hasAnswers(answers)) {
      writeDraft(slug, { answers, step: current, version: form.version });
    }
  }, [slug, answers, current, form.version, outcome]);

  const setAnswer = useCallback((key, value) => {
    setAnswers((existing) => ({ ...existing, [key]: value }));
    setServerErrors((existing) => {
      if (!(key in existing)) return existing;
      const next = { ...existing };
      delete next[key];
      return next;
    });
  }, []);

  const handleCredential = useCallback(
    (value) => {
      const signedInAs = credentialProfile(value);
      if (!signedInAs) return;
      setCredential(value);
      setSwitching(false);
      setProblem("");
      // The name can come from the account too, when the form asks for it, nothing
      // has been typed there yet, and the account is named like a person rather
      // than "Zum". It stays editable either way.
      if (nameKey && looksLikeFullName(signedInAs.name)) {
        setAnswers((existing) => (existing[nameKey] ? existing : { ...existing, [nameKey]: signedInAs.name }));
        setAccountName(signedInAs.name);
      }
    },
    [nameKey]
  );

  function goTo(index) {
    setStep(index);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    if (current === 0 && !emailRecorded) {
      setRevealed((existing) => new Set([...existing, page.key]));
      focusRecordEmail();
      return;
    }
    if (trustRules && page) {
      const keys = new Set((page.questions || []).map((question) => question.key));
      const wrong = result.errors.find((item) => keys.has(item.questionKey));
      if (wrong) {
        setRevealed((existing) => new Set([...existing, page.key]));
        focusQuestion(wrong.questionKey);
        return;
      }
    }
    goTo(current + 1);
  }

  // Show the first problem where it is, rather than a count at the bottom.
  function showFirstProblem(keys) {
    const first = keys[0];
    const target = pageOf(first);
    if (target !== -1 && target !== current) {
      setStep(target);
      // The page has to render before its question can be scrolled to.
      setTimeout(() => focusQuestion(first), 60);
    } else {
      focusQuestion(first);
    }
  }

  async function send(token) {
    return submitPublicForm(slug, {
      token,
      answers: effective,
      website: honeypot.current?.value || "",
      ...(form.requiresSignIn ? { credential } : {}),
    });
  }

  async function submit() {
    setProblem("");
    if (!emailRecorded) {
      setChecked(true);
      if (current !== 0) {
        setStep(0);
        setTimeout(focusRecordEmail, 60);
      } else {
        focusRecordEmail();
      }
      return;
    }
    if (trustRules && result.errors.length) {
      setChecked(true);
      showFirstProblem(result.errors.map((item) => item.questionKey));
      return;
    }
    // Google's credential lasts an hour. One that has run out would be refused, so
    // ask for a fresh one first; the answers stay where they are.
    if (form.requiresSignIn && signInLapsed(profile)) {
      setCredential("");
      setProblem("Your sign-in has timed out. Sign in again to send your answers — they're all still here.");
      return;
    }

    setSending(true);
    try {
      const early = tooSoonBy(loadedAt);
      if (early > 0) await wait(early);
      let response = await send(form.submissionToken);

      // The page sat open for hours and its token lapsed. Fetch the form again: if
      // it has not changed, send with the fresh token; if it has, show the new
      // version with the answers carried across.
      if (response.outcome === SUBMIT_OUTCOME.RELOAD && response.code !== "FORM_TOO_FAST") {
        const fresh = await loadPublicForm(slug);
        if (!fresh || !fresh.open) {
          response = { outcome: SUBMIT_OUTCOME.CLOSED, message: fresh?.closedReason || "This form is closed." };
        } else if (fresh.version !== form.version) {
          onFormChanged(fresh);
          return;
        } else {
          onFormChanged(fresh);
          await wait(MIN_FILL_MS);
          response = await send(fresh.submissionToken);
        }
      }

      if (response.outcome === SUBMIT_OUTCOME.SENT) {
        if (response.confirmEmail) {
          setOutcome({ view: "confirm", receipt: response.receipt, email: response.email });
        } else {
          clearDraft(slug);
          setOutcome({ view: "sent" });
        }
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (response.outcome === SUBMIT_OUTCOME.INVALID) {
        const refused = Object.fromEntries((response.errors || []).map((item) => [item.questionKey, item.message]));
        setServerErrors(refused);
        setChecked(true);
        if (Object.keys(refused).length) showFirstProblem(Object.keys(refused));
      } else if (response.outcome === SUBMIT_OUTCOME.CLOSED) {
        clearDraft(slug);
        setOutcome({ view: "closed", message: response.message });
      } else if (response.outcome === SUBMIT_OUTCOME.SIGN_IN) {
        setCredential("");
        setProblem("Please sign in with Google again to send your answers — they're all still here.");
      } else {
        setProblem(response.message || "That couldn't be sent. Please try again.");
      }
    } catch (error) {
      setProblem(
        `${toUserMessage(error, API_ERROR_MESSAGES.server)} Your answers are still here, so you can try again.`
      );
    } finally {
      setSending(false);
    }
  }

  // Every answer on every page, and the Email tick. The chosen Google account
  // stays: clearing the answers is not signing out.
  function startAgain() {
    clearDraft(slug);
    setAnswers({});
    setRecordedFor("");
    setStep(0);
    setRestored(false);
    setRevealed(new Set());
    setChecked(false);
    setServerErrors({});
    setProblem("");
    setConfirmReset(false);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (outcome?.view === "closed") {
    return (
      <>
        <FormHeader form={form} />
        <Closed message={outcome.message} />
      </>
    );
  }

  if (outcome?.view === "sent") {
    return (
      <div ref={topRef} className="scroll-mt-24 space-y-3">
        <FormHeader form={form} />
        <div className={`${card} px-5 py-8 text-center sm:px-8`}>
          <CheckCircle2 size={44} strokeWidth={1.75} aria-hidden="true" className="mx-auto text-emerald-600" />
          <h2 className="mt-4 text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Your answers have been sent.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            Thank you. {outcome.confirmed ? "Your email address is confirmed, too. " : ""}
            You can close this page now.
          </p>
          <Link to="/" className={`${quietButton} mt-6`}>
            Visit ERA AXIS <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  if (outcome?.view === "confirm") {
    return (
      <div ref={topRef} className="scroll-mt-24 space-y-3">
        <FormHeader form={form} />
        <ConfirmEmailStep
          receipt={outcome.receipt}
          email={outcome.email}
          onConfirmed={() => {
            clearDraft(slug);
            setOutcome({ view: "sent", confirmed: true });
          }}
          onChangeAddress={() => {
            setOutcome(null);
            const key = emailQuestion?.key;
            if (key) showFirstProblem([key]);
          }}
        />
      </div>
    );
  }

  const hasRequired = questions.some((question) => question.required);
  // Worked out rather than stored, so it goes away as soon as the last problem is
  // put right.
  const banner =
    problem || (checked && (Object.keys(errors).length || !emailRecorded) ? "Some answers need another look." : "");

  return (
    <div ref={topRef} className="scroll-mt-24 space-y-3">
      <FormHeader form={form} intro={current === 0}>
        {form.requiresSignIn && signedIn && !switching && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[var(--color-border-soft)] pt-4">
            <p className="min-w-0 text-sm">
              <span className="break-all font-semibold text-[var(--color-text-primary)]">{profile.email}</span>{" "}
              <button
                type="button"
                onClick={() => {
                  setSwitching(true);
                  setCredential("");
                }}
                className="font-semibold text-[var(--color-primary)] underline underline-offset-2"
              >
                Switch account
              </button>
            </p>
            {hasAnswers(answers) && (
              <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                <CloudCheck size={15} aria-hidden="true" /> Saved on this device
              </p>
            )}
          </div>
        )}
        {current === 0 && hasRequired && (
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            <span className="text-red-600">*</span> Required question
          </p>
        )}
        {paged && (
          <div className="mt-5">
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              Page {current + 1} of {pages.length}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-soft)]" aria-hidden="true">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
                style={{ width: `${((current + 1) / pages.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </FormHeader>

      {restored && (
        <div className={`${card} flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between`}>
          <p className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            <History size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
            {edited
              ? "We've brought back what you started on this device. The form has changed since, so please check your answers."
              : "We've brought back what you started on this device."}
          </p>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="shrink-0 self-start text-sm font-semibold text-[var(--color-primary)] underline underline-offset-2 sm:self-auto"
          >
            Start again
          </button>
        </div>
      )}

      {form.requiresSignIn && (!signedIn || switching) && (
        <div className={`${card} px-5 py-5 sm:px-6`}>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Choose your Google account</h2>
          <p className="mb-4 mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            This form records the email address of the account you choose, so there&apos;s nothing
            to type or confirm. We use it for your name and email, and nothing else.
          </p>
          {problem && (
            <p role="alert" className="mb-4 flex items-start gap-1.5 text-sm font-medium text-red-600">
              <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>{problem}</span>
            </p>
          )}
          <GoogleSignIn clientId={form.googleClientId} onCredential={handleCredential} chooseAgain={switching} />
        </div>
      )}

      {!needsSignIn && current === 0 && form.requiresSignIn && (
        <div
          className={`${card} px-5 py-5 transition-colors sm:px-6 ${emailCardError ? "border-red-400" : ""}`}
        >
          <p className="text-base font-semibold leading-snug text-[var(--color-text-primary)]">
            Email
            <span className="ml-1 text-red-600" aria-hidden="true">
              *
            </span>
          </p>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-[15px] leading-relaxed text-[var(--color-text-primary)]">
            <input
              id="record-email"
              type="checkbox"
              checked={emailRecorded}
              onChange={(event) => setRecordedFor(event.target.checked ? profile.email : "")}
              aria-invalid={emailCardError || undefined}
              aria-describedby={emailCardError ? "record-email-error" : undefined}
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
            />
            <span className="min-w-0">
              Send my answers with <span className="break-all font-semibold">{profile.email}</span>
            </span>
          </label>
          {emailCardError && (
            <p id="record-email-error" role="alert" className="mt-3 flex items-start gap-1.5 text-sm font-medium text-red-600">
              <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>Please tick this to send your answers with this address.</span>
            </p>
          )}
        </div>
      )}

      {!needsSignIn &&
        page &&
        (() => {
          const visible = (page.questions || []).filter(shown);
          const showSectionHeading = sections.indexOf(page) > 0 && (page.title || page.description);
          return (
            <section aria-label={page.title || undefined} className="space-y-3">
              {showSectionHeading && (
                <div className={`${card} border-l-4 border-l-[var(--color-primary)] px-5 py-5 sm:px-6`}>
                  {page.title && (
                    <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">{page.title}</h2>
                  )}
                  {page.description && (
                    <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                      {page.description}
                    </p>
                  )}
                </div>
              )}
              {visible.map((question) => (
                <QuestionField
                  key={question.key}
                  slug={slug}
                  question={question}
                  value={effective[question.key]}
                  error={errors[question.key]}
                  // Only while it is still the account's name, untouched.
                  note={question.key === nameKey && accountName && answers[nameKey] === accountName
                    ? "From your Google account. Change it if this isn't your full name."
                    : undefined}
                  onChange={(value) => setAnswer(question.key, value)}
                />
              ))}
            </section>
          );
        })()}

      {/* A field a person never sees and a script fills in anyway. Named so no
          browser's autofill mistakes it for a real one. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input ref={honeypot} type="text" name="eraaxis_leave_empty" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {!needsSignIn && page && (
        <div className="pt-2">
          {banner && (
            <p role="alert" className="mb-3 flex items-start gap-2 rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>{banner}</span>
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {paged && current > 0 && (
              <button type="button" onClick={() => goTo(current - 1)} className={quietButton} disabled={sending}>
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>
            )}
            {!last && (
              <button type="button" onClick={next} className={primaryButton}>
                Next <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
            {last && (
              <button type="button" onClick={submit} className={primaryButton} disabled={sending}>
                {sending ? "Sending…" : "Submit"}
                {!sending && <Send size={16} aria-hidden="true" />}
              </button>
            )}
            {/* Asks first when there is something to lose; with nothing typed it
                just goes back to the start. */}
            <button
              type="button"
              disabled={sending}
              onClick={() => (hasAnswers(answers) || recordedFor ? setConfirmReset(true) : startAgain())}
              className="ml-auto min-h-[48px] rounded-[var(--radius-sm)] px-3 text-[15px] font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/[0.06] disabled:opacity-60"
            >
              Clear form
            </button>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]">
            Your answers are kept on this device until you send them. Never give your password
            in a form.
          </p>
        </div>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="Clear the form?"
        message="This removes your answers from every page of this form, on this device, and takes you back to the start. It can't be undone."
        confirmLabel="Clear form"
        cancelLabel="Keep my answers"
        onConfirm={startAgain}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

// The form's own heading card: banner, title and introduction, as its creator
// built it in EDOS. The banner heads every page, as on a Google Form; the
// introduction is read once, on the first.
function FormHeader({ form, intro = false, children }) {
  const banner = form.headerImage ? resolveMediaUrl(form.headerImage) : null;
  return (
    <div className="space-y-3">
      {banner && (
        <img
          src={banner}
          alt=""
          className="aspect-[4/1] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] object-cover"
        />
      )}
      <div className={`${card} border-t-[6px] border-t-[var(--color-primary)] px-5 py-6 sm:px-8`}>
        <h1 className="break-words text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
          {form.title}
        </h1>
        {/* Cleaned on the server against a short allowlist before it was stored. */}
        {intro && form.description && (
          <div
            className="form-intro mt-3 text-[15px] leading-relaxed text-[var(--color-text-secondary)]"
            dangerouslySetInnerHTML={{ __html: form.description }}
          />
        )}
        {children}
      </div>
    </div>
  );
}

function Closed({ message }) {
  return (
    <div className={`${card} mt-3 px-5 py-8 text-center sm:px-8`}>
      <CircleSlash size={40} strokeWidth={1.75} aria-hidden="true" className="mx-auto text-[var(--color-text-muted)]" />
      <h2 className="mt-4 text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
        {message || "This form is closed."}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
        It isn&apos;t taking answers at the moment. If you think this is a mistake, let us know.
      </p>
      <Link to="/contact" className={`${quietButton} mt-6`}>
        Contact ERA AXIS <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}

function Notice({ icon: Icon, title, body, children }) {
  return (
    <div className={`${card} px-5 py-8 sm:px-8`}>
      <Icon size={36} strokeWidth={1.75} aria-hidden="true" className="text-[var(--color-text-muted)]" />
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">{title}</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{body}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-3" aria-label="Loading the form">
      <div className={`${card} border-t-[6px] border-t-[var(--color-border)] px-5 py-6 sm:px-8`}>
        <div className="h-7 w-2/3 rounded bg-[var(--color-surface-soft)]" />
        <div className="mt-4 h-4 w-full rounded bg-[var(--color-surface-soft)]" />
        <div className="mt-2 h-4 w-4/5 rounded bg-[var(--color-surface-soft)]" />
      </div>
      {[0, 1, 2].map((item) => (
        <div key={item} className={`${card} px-5 py-5 sm:px-6`}>
          <div className="h-5 w-1/2 rounded bg-[var(--color-surface-soft)]" />
          <div className="mt-4 h-12 w-full rounded bg-[var(--color-surface-soft)]" />
        </div>
      ))}
    </div>
  );
}
