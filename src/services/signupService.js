import { ApiError, api } from "./api";

/**
 * The programme and Student Chapter sign-ups: their email check before payment.
 * A wrong or expired code is an answer, returned with the server's wording; only
 * an outage throws.
 */

/** The Google client for "Continue with Google", or null when sign-in is off. */
export async function loadSignupConfig() {
  try {
    const body = await api.get("/signups/config");
    return { googleClientId: body?.data?.googleClientId || null };
  } catch {
    // Without it the page still works: the email is confirmed by code.
    return { googleClientId: null };
  }
}

export async function confirmSignupEmail(enrolmentId, code) {
  try {
    const body = await api.post(`/enrolments/${enrolmentId}/confirm-email`, { code });
    return { confirmed: Boolean(body?.data?.confirmed) };
  } catch (error) {
    if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
      return { confirmed: false, code: error.payload?.code, message: error.message };
    }
    throw error;
  }
}

export async function resendSignupCode(enrolmentId) {
  try {
    const body = await api.post(`/enrolments/${enrolmentId}/resend-code`, {});
    return { sent: true, retryAfter: body?.data?.retryAfter || 60 };
  } catch (error) {
    if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
      return { sent: false, retryAfter: error.payload?.data?.retryAfter || 0, message: error.message };
    }
    throw error;
  }
}
