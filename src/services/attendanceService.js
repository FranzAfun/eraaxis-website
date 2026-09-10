import { ApiError, api, envelopeError } from "./api";

// Link tokens are 32 lowercase hex characters, the same shape as a certificate
// public ID. Checking here means an obviously malformed link never becomes a
// network request, and the page shows the same answer the API would give.
const LINK_TOKEN = /^[a-f0-9]{32}$/;

// The three states of the link itself, decided against its window.
export const SESSION_STATE = Object.freeze({
  NOT_STARTED: "not_started",
  OPEN: "open",
  CLOSED: "closed",
  // The course itself has ended, which outranks the window. "This session is
  // closed" would suggest another is coming; this says none is.
  COURSE_CLOSED: "course_closed",
});

// What came of a sign-in. `present` and `already_present` are both successes:
// clicking the link twice is something a learner will do, and it is not an error.
export const SIGN_IN_OUTCOME = Object.freeze({
  PRESENT: "present",
  ALREADY_PRESENT: "already_present",
  NOT_RECOGNISED: "not_recognised",
  // Registered, but on another course in this cohort. A learner takes exactly one
  // course per cohort, so this is someone who opened the wrong facilitator's link.
  WRONG_COURSE: "wrong_course",
  AMBIGUOUS: "ambiguous",
  WINDOW_CLOSED: "window_closed",
  LINK_UNKNOWN: "link_unknown",
});

export function isValidLinkToken(value) {
  return typeof value === "string" && LINK_TOKEN.test(value);
}

/**
 * Loads what the sign-in page may show before anyone identifies themselves.
 *
 * Resolves to the session, or to `null` when the link is not one we issued — a
 * 404 is a real answer here, not a failure. Everything else throws, because a
 * network or server problem means we do not know whether the session is open,
 * and guessing either way would either turn a learner away or invite them to
 * authenticate for nothing.
 */
export async function loadAttendanceSession(token) {
  if (!isValidLinkToken(token)) return null;

  let body;
  try {
    body = await api.get(`/attendance/${token}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }

  if (!body?.success || !body.data) {
    throw envelopeError(body, "We couldn't open this attendance link. Please try again shortly.");
  }
  return body.data;
}

/**
 * Presents a Google credential and records attendance.
 *
 * The meaningful answers are returned rather than thrown, because each one is
 * something to tell the learner plainly while the class is still running. Only
 * the cases where we genuinely do not know — no network, our own outage, Google
 * unreachable, a credential we could not verify — throw, so the page can offer
 * to try again instead of implying they were turned away.
 */
export async function signInToSession(token, credential) {
  if (!isValidLinkToken(token)) return { outcome: SIGN_IN_OUTCOME.LINK_UNKNOWN };

  let body;
  try {
    body = await api.post(`/attendance/${token}`, { credential });
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    const code = error.payload?.code;
    if (error.status === 404) return { outcome: SIGN_IN_OUTCOME.LINK_UNKNOWN };
    if (code === "ATTENDANCE_NOT_RECOGNISED") {
      return { outcome: SIGN_IN_OUTCOME.NOT_RECOGNISED, message: error.message };
    }
    if (code === "ATTENDANCE_WRONG_COURSE") {
      return { outcome: SIGN_IN_OUTCOME.WRONG_COURSE, message: error.message };
    }
    if (code === "ATTENDANCE_EMAIL_AMBIGUOUS") {
      return { outcome: SIGN_IN_OUTCOME.AMBIGUOUS, message: error.message };
    }
    // The window moved under an open page. The refusal carries the session's
    // current public state, so the page can re-render without asking again.
    if (code === "ATTENDANCE_NOT_STARTED" || code === "ATTENDANCE_CLOSED" || code === "ATTENDANCE_COURSE_CLOSED") {
      return { outcome: SIGN_IN_OUTCOME.WINDOW_CLOSED, session: error.payload?.data || null };
    }
    throw error;
  }

  if (!body?.success || !body.data) {
    throw envelopeError(body, "We couldn't record your attendance. Please try again shortly.");
  }
  return { outcome: body.data.state, attendance: body.data };
}
