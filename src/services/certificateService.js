import { ApiError, api, envelopeError } from "./api";

// Public IDs are 32 lowercase hex characters. Checking here means an obviously
// malformed link never becomes a network request, and the page can show the
// same "not found" answer the API would give.
const PUBLIC_ID = /^[a-f0-9]{32}$/;

export const CERTIFICATE_STATUS = Object.freeze({
  ISSUED: "issued",
  REVOKED: "revoked",
  SUPERSEDED: "superseded",
});

export function isValidPublicId(value) {
  return typeof value === "string" && PUBLIC_ID.test(value);
}

/**
 * Looks up a certificate by its public ID.
 *
 * Resolves to the public projection, or to `null` when the certificate does not
 * exist — a 404 is a real answer here ("this is not a certificate we issued"),
 * not a failure. Everything else throws, because a network or server problem
 * means we do not know, and telling someone their genuine certificate is fake
 * is the worst mistake this page can make.
 */
export async function verifyCertificate(publicId) {
  if (!isValidPublicId(publicId)) return null;

  let body;
  try {
    body = await api.get(`/certificates/${publicId}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }

  if (!body?.success || !body.data) {
    throw envelopeError(body, "We couldn't check that certificate. Please try again shortly.");
  }

  return body.data;
}
