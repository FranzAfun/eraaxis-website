import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  CircleSlash,
  Clock,
  RefreshCw,
  SearchX,
  UserX,
  WifiOff,
} from "lucide-react";
import SEO from "../components/SEO";
import { API_ERROR_MESSAGES, toUserMessage } from "../services/api";
import {
  SESSION_STATE,
  SIGN_IN_OUTCOME,
  loadAttendanceSession,
  signInToSession,
} from "../services/attendanceService";

const panel =
  "mx-auto max-w-xl rounded-[var(--radius-md)] border border-white/15 bg-white/[0.06] p-6 text-left backdrop-blur-xl sm:p-8";
const primaryAction =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-white px-6 text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90";
const secondaryAction =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-white/25 bg-white/[0.08] px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-primary)]";
const badge =
  "mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest backdrop-blur-xl";
const heading = "mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl";
const body = "text-base leading-relaxed text-white/68";

const GSI_SRC = "https://accounts.google.com/gsi/client";

// Google's script is loaded only once the window is known to be open, so a
// learner who arrives early or late never has a third party's script pulled in
// on their behalf.
let gsiPromise = null;
function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (gsiPromise) return gsiPromise;

  gsiPromise = new Promise((resolve, reject) => {
    // Only this function adds the script, and a load in progress is shared through
    // gsiPromise, so an element found here is left over from a failed attempt. It
    // has already fired its events and would never fire them again, which left a
    // retry waiting forever; start from a fresh element instead.
    document.querySelector(`script[src="${GSI_SRC}"]`)?.remove();
    const script = document.createElement("script");
    const fail = () => {
      script.remove();
      reject(new Error("Google sign-in did not load."));
    };
    script.addEventListener("load", () => {
      if (window.google?.accounts?.id) resolve(window.google);
      else fail();
    });
    script.addEventListener("error", fail);
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }).catch((error) => {
    // A failed load must not be cached as permanent: the learner may simply
    // have lost signal for a moment, and Try again has to mean something.
    gsiPromise = null;
    throw error;
  });
  return gsiPromise;
}

// The window is shown in the learner's own timezone, because "has it started?"
// is a question about their clock, not the server's.
function formatMoment(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// The session's own identity, shown above every state so a learner can always
// see which class this link belongs to — including when they are being told it
// is closed, which is when knowing they have the wrong link matters most.
function SessionHeader({ session }) {
  if (!session) return null;
  return (
    <div className="mb-6 border-b border-white/10 pb-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
        {session.programme}
        {session.track ? ` · ${session.track}` : ""}
      </p>
      <p className="mt-2 break-words text-xl font-bold leading-snug text-white sm:text-2xl">
        {session.title}
      </p>
      {session.objective && (
        <p className="mt-2 text-sm leading-relaxed text-white/60">{session.objective}</p>
      )}
    </div>
  );
}

const LOADING = Object.freeze({ view: "loading", session: null, error: "" });

export default function AttendanceSignIn() {
  const { token } = useParams();
  const [attempt, setAttempt] = useState(0);
  // The resolved answer is stamped with the token it belongs to, so a late reply
  // for a previous link can never be shown against the current one.
  const [result, setResult] = useState({ id: token, ...LOADING });
  const [signIn, setSignIn] = useState(null);
  const [busy, setBusy] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    let active = true;
    loadAttendanceSession(token)
      .then((session) => {
        if (!active) return;
        setResult({
          id: token,
          view: session ? "session" : "unknown-link",
          session,
          error: "",
        });
      })
      .catch((error) => {
        if (!active) return;
        setResult({
          id: token,
          view: "error",
          session: null,
          error: toUserMessage(error, API_ERROR_MESSAGES.server),
        });
      });
    return () => {
      active = false;
    };
  }, [token, attempt]);

  const retry = useCallback(() => {
    setResult({ id: token, ...LOADING });
    setSignIn(null);
    setAttempt((current) => current + 1);
  }, [token]);

  // Navigating from one link to another keeps the component mounted, so derive
  // the loading view rather than showing the previous session's answer.
  const { view, session, error: errorMessage } = result.id === token ? result : LOADING;

  const handleCredential = useCallback(
    (response) => {
      setBusy(true);
      signInToSession(token, response?.credential)
        .then((outcome) => setSignIn(outcome))
        .catch((error) =>
          setSignIn({
            outcome: "failed",
            message: toUserMessage(error, API_ERROR_MESSAGES.server),
          }),
        )
        .finally(() => setBusy(false));
    },
    [token],
  );

  const clientId = session?.googleClientId;
  // A refusal is not the end of the attempt. Someone who picked the wrong Google
  // account, or opened a course link they are not on, has to be able to try another
  // account without reloading the link — so the button stays available for every
  // outcome except actually being marked present.
  const marked = signIn?.outcome === SIGN_IN_OUTCOME.PRESENT
    || signIn?.outcome === SIGN_IN_OUTCOME.ALREADY_PRESENT;
  const windowMoved = signIn?.outcome === SIGN_IN_OUTCOME.WINDOW_CLOSED;
  const canSignIn = view === "session" && session?.state === SESSION_STATE.OPEN && !marked && !windowMoved;

  useEffect(() => {
    if (!canSignIn || !clientId) return undefined;
    let active = true;

    loadGoogleIdentity()
      .then((google) => {
        if (!active || !buttonRef.current) return;
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredential,
          // A popup keeps the learner on this page, so the meeting tab behind it
          // is never navigated away from.
          ux_mode: "popup",
          cancel_on_tap_outside: true,
        });
        // After a refusal Google would otherwise reuse the account it just had
        // rejected, so the learner would press the button and see nothing change.
        // Turning auto-select off brings the account chooser back.
        if (signIn) google.accounts.id.disableAutoSelect();
        // Re-rendering into a div that already holds a button would stack them.
        buttonRef.current.innerHTML = "";
        google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
          width: 280,
        });
      })
      .catch(() => {
        if (!active) return;
        setSignIn({
          outcome: "failed",
          message:
            "We couldn't load Google sign-in. Check your connection, or try again in a different browser.",
        });
      });

    return () => {
      active = false;
    };
    // `signIn` is a dependency so that a refusal re-renders the button into the
    // fresh div React gives us after the busy state, which is what made an earlier
    // build require a page reload to try a second account.
  }, [canSignIn, clientId, handleCredential, signIn]);

  // A refusal on POST carries the session's current state, so a page left open
  // since before the session started re-renders as closed rather than lying.
  const shown = windowMoved && signIn.session ? signIn.session : session;

  return (
    <>
      <SEO
        title="Session attendance — ERA AXIS"
        description="Sign in to record your attendance for an ERA AXIS session."
        noindex
      />
      <section className="relative -mt-20 min-h-[60vh] overflow-hidden bg-[var(--color-background-dark)] pb-20 pt-40 text-white md:pb-28 md:pt-52">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--color-accent) 18%, transparent) 0%, transparent 30%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div className="container relative z-10">
          <div aria-live="polite" aria-busy={view === "loading" || busy}>
            {view === "loading" && (
              <p className="text-center text-base text-white/60">Opening this session…</p>
            )}

            {view === "unknown-link" && (
              <div className={panel}>
                <p className={`${badge} text-white/70`}>
                  <SearchX aria-hidden="true" size={14} />
                  Not valid
                </p>
                <h1 className={heading}>This attendance link isn&apos;t valid.</h1>
                {/* A mistyped or truncated link reaches this same state, so it
                    does not accuse anyone of anything. */}
                <p className={`mb-8 ${body}`}>
                  We don&apos;t recognise this link. It may have been copied
                  incompletely, or replaced with a newer one. Please ask your
                  facilitator for the current link for this session.
                </p>
                <Link to="/" className={secondaryAction}>
                  Back to Home <ArrowRight size={16} />
                </Link>
              </div>
            )}

            {view === "error" && (
              <div className={panel}>
                <p className={`${badge} text-white/70`}>
                  <WifiOff aria-hidden="true" size={14} />
                  Unavailable
                </p>
                <h1 className={heading}>We couldn&apos;t open this session.</h1>
                {/* An outage must never be presented as a closed session. */}
                <p className={`mb-8 ${body}`}>
                  {errorMessage} This doesn&apos;t mean the session is closed — we
                  simply couldn&apos;t reach our records just now. Please try again.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={retry} className={primaryAction}>
                    <RefreshCw aria-hidden="true" size={16} /> Try again
                  </button>
                  <Link to="/contact" className={secondaryAction}>
                    Contact ERA AXIS <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            {view === "session" && (
              <div className={panel}>
                <SessionHeader session={shown} />

                {marked && (
                  <>
                    <p className={`${badge} text-[var(--color-accent)]`}>
                      <CheckCircle2 aria-hidden="true" size={14} />
                      {signIn.outcome === SIGN_IN_OUTCOME.PRESENT ? "Marked present" : "Already present"}
                    </p>
                    <h1 className={heading}>
                      {signIn.outcome === SIGN_IN_OUTCOME.PRESENT
                        ? "You're marked present."
                        : "You're already marked present."}
                    </h1>
                    {signIn.attendance?.learnerName && (
                      <p className="mb-4 break-words text-lg font-semibold text-white">
                        {signIn.attendance.learnerName}
                      </p>
                    )}
                    {/* Short and warm, and it says what to do next: the meeting
                        is still running and that is where they should be. */}
                    <p className={body}>
                      That&apos;s everything — you can close this page and head back
                      to the meeting. Thanks for being here.
                    </p>
                  </>
                )}

                {!marked && windowMoved && shown?.state === SESSION_STATE.NOT_STARTED && (
                  <NotStarted session={shown} />
                )}
                {!marked && windowMoved && shown?.state === SESSION_STATE.CLOSED && (
                  <Closed session={shown} />
                )}
                {!marked && windowMoved && shown?.state === SESSION_STATE.COURSE_CLOSED && <CourseClosed />}

                {!marked && !windowMoved && session?.state === SESSION_STATE.NOT_STARTED && (
                  <NotStarted session={session} onRetry={retry} />
                )}
                {!marked && !windowMoved && session?.state === SESSION_STATE.CLOSED && (
                  <Closed session={session} />
                )}
                {!marked && !windowMoved && session?.state === SESSION_STATE.COURSE_CLOSED && <CourseClosed />}

                {!marked && !windowMoved && session?.state === SESSION_STATE.OPEN && (
                  <>
                    <h1 className={heading}>Sign in to be marked present.</h1>
                    <p className={`mb-6 ${body}`}>
                      Choose the Google account you registered with. That&apos;s all
                      we use it for — your name and email, to tick you off the
                      register for this session.
                    </p>

                    {signIn?.outcome === SIGN_IN_OUTCOME.NOT_RECOGNISED && (
                      <Refusal icon={UserX} label="Not on the register" message={signIn.message} />
                    )}
                    {signIn?.outcome === SIGN_IN_OUTCOME.WRONG_COURSE && (
                      <Refusal icon={BookOpen} label="Wrong course" message={signIn.message} />
                    )}
                    {signIn?.outcome === SIGN_IN_OUTCOME.AMBIGUOUS && (
                      <Refusal icon={UserX} label="Needs a correction" message={signIn.message} />
                    )}
                    {signIn?.outcome === SIGN_IN_OUTCOME.LINK_UNKNOWN && (
                      <Refusal
                        icon={SearchX}
                        label="Link replaced"
                        message="This link is no longer active. Please ask your facilitator for the current one."
                      />
                    )}
                    {signIn?.outcome === "failed" && (
                      <Refusal icon={WifiOff} label="Try again" message={signIn.message} />
                    )}

                    <div className="min-h-[44px]">
                      {clientId ? (
                        <>
                          {/* Hidden, never unmounted: React would otherwise hand back
                              an empty div once the busy state ended, losing the button
                              Google rendered into it. */}
                          <div ref={buttonRef} hidden={busy} />
                          {busy && <p className="text-sm text-white/60">Recording your attendance…</p>}
                        </>
                      ) : (
                        <Refusal
                          icon={WifiOff}
                          label="Sign-in unavailable"
                          message="Google sign-in isn't set up for this session yet, so we can't mark you present here. Please tell your facilitator now, while the class is still running."
                        />
                      )}
                    </div>

                    {session.closesAt && (
                      <p className="mt-6 flex items-center gap-2 text-sm text-white/45">
                        <Clock aria-hidden="true" size={14} />
                        Sign-in closes at {formatTime(session.closesAt)}.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function NotStarted({ session, onRetry }) {
  return (
    <>
      <p className={`${badge} text-amber-300`}>
        <CalendarClock aria-hidden="true" size={14} />
        Not started
      </p>
      <h1 className={heading}>This session hasn&apos;t started yet.</h1>
      <p className={`mb-8 ${body}`}>
        Sign-in opens at {formatMoment(session.opensAt)}. Come back to this same
        link once the session begins and you&apos;ll be able to mark yourself
        present then.
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={secondaryAction}>
          <RefreshCw aria-hidden="true" size={16} /> Check again
        </button>
      )}
    </>
  );
}

function Closed({ session }) {
  return (
    <>
      <p className={`${badge} text-white/70`}>
        <CircleSlash aria-hidden="true" size={14} />
        Closed
      </p>
      <h1 className={heading}>This session is closed.</h1>
      <p className={`mb-8 ${body}`}>
        Sign-in closed at {formatMoment(session.closesAt)} and attendance is no
        longer being taken for this session. If you were in the class and
        weren&apos;t marked present, tell your facilitator so it can be corrected.
      </p>
      <Link to="/contact" className={secondaryAction}>
        Contact ERA AXIS <ArrowRight size={16} />
      </Link>
    </>
  );
}

// The course is over, so no later link is coming for it. That is deliberately a
// different message from a session having closed, which leaves room to hope.
function CourseClosed() {
  return (
    <>
      <p className={`${badge} text-white/70`}>
        <CircleSlash aria-hidden="true" size={14} />
        Course ended
      </p>
      <h1 className={heading}>This course has ended.</h1>
      <p className={`mb-8 ${body}`}>
        Attendance is closed for all of its sessions, and the register is final. If
        you attended and think you were missed, speak to your facilitator — they can
        still tell you where you stand.
      </p>
      <Link to="/contact" className={secondaryAction}>
        Contact ERA AXIS <ArrowRight size={16} />
      </Link>
    </>
  );
}

// A refusal sits above the sign-in button rather than replacing it, so someone
// who picked the wrong Google account can simply choose another.
function Refusal({ icon: Icon, label, message }) {
  return (
    <div className="mb-6 rounded-[var(--radius-sm)] border border-amber-300/25 bg-amber-300/[0.08] p-4">
      <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
        <Icon aria-hidden="true" size={14} />
        {label}
      </p>
      <p className="text-sm leading-relaxed text-white/75">{message}</p>
    </div>
  );
}
