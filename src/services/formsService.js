import { ApiError, api, envelopeError } from "./api";

/**
 * The public side of an ERA AXIS form.
 *
 * The page validates as somebody types, with the same rules the server uses, but
 * the server's check is the one that counts. Everything here returns the answers
 * a page has to act on — refused answers, a closed form, a code that did not
 * match — and throws only when we genuinely do not know what happened.
 */

const SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;
const RECEIPT = /^[a-f0-9]{32}$/;

export function isValidFormSlug(value) {
  return typeof value === "string" && SLUG.test(value);
}

/** The form, or `null` when there is no such form. */
export async function loadPublicForm(slug) {
  if (!isValidFormSlug(slug)) return null;

  let body;
  try {
    body = await api.get(`/forms/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }

  if (!body?.success || !body.data) {
    throw envelopeError(body, "We couldn't open this form. Please try again shortly.");
  }
  return body.data;
}

/** Schools matching what somebody typed, from the list this question offers. */
export async function searchFormSchools(slug, questionKey, query) {
  const params = new URLSearchParams({ question: questionKey, q: query || "" });
  const body = await api.get(`/forms/${encodeURIComponent(slug)}/schools?${params}`);
  return body?.data?.items || [];
}

export const SUBMIT_OUTCOME = Object.freeze({
  SENT: "sent",
  // Some answers were refused; `errors` says which, in the rules' own words.
  INVALID: "invalid",
  CLOSED: "closed",
  // The page sat open long enough for its token to expire, or was sent too fast.
  RELOAD: "reload",
  SIGN_IN: "sign_in",
});

export async function submitPublicForm(slug, payload) {
  let body;
  try {
    body = await api.post(`/forms/${encodeURIComponent(slug)}/submissions`, payload);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    const code = error.payload?.code;
    if (code === "ANSWERS_INVALID") {
      return { outcome: SUBMIT_OUTCOME.INVALID, errors: error.payload?.data?.errors || [] };
    }
    if (code === "FORM_CLOSED") return { outcome: SUBMIT_OUTCOME.CLOSED, message: error.message };
    if (code === "FORM_TOKEN_EXPIRED" || code === "FORM_TOKEN_INVALID" || code === "FORM_TOO_FAST") {
      return { outcome: SUBMIT_OUTCOME.RELOAD, code, message: error.message };
    }
    if (code === "SIGN_IN_REQUIRED") return { outcome: SUBMIT_OUTCOME.SIGN_IN, message: error.message };
    throw error;
  }

  if (!body?.success || !body.data) {
    throw envelopeError(body, "That could not be sent just now. Please try again.");
  }
  return { outcome: SUBMIT_OUTCOME.SENT, ...body.data };
}

/**
 * Checks the six-digit code from the confirmation email. A wrong or expired code
 * is an answer, returned with the server's wording; only an outage throws.
 */
export async function confirmFormEmail(receipt, code) {
  if (!RECEIPT.test(receipt || "")) return { confirmed: false, message: "This confirmation link is not valid." };
  try {
    const body = await api.post(`/forms/submissions/${receipt}/confirm`, { code });
    return { confirmed: Boolean(body?.data?.confirmed) };
  } catch (error) {
    if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
      return { confirmed: false, code: error.payload?.code, message: error.message };
    }
    throw error;
  }
}

/** Sends the code again. Resolves to when another may be asked for. */
export async function resendFormCode(receipt) {
  try {
    const body = await api.post(`/forms/submissions/${receipt}/resend`, {});
    return { sent: true, retryAfter: body?.data?.retryAfter || 60 };
  } catch (error) {
    if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
      return { sent: false, retryAfter: error.payload?.data?.retryAfter || 0, message: error.message };
    }
    throw error;
  }
}
