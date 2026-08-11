const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

/**
 * Stable, user-facing fallbacks. These are the only strings the shared client
 * will ever invent on its own — they never carry a status code, a request path,
 * a response body or anything else that describes how the API is built.
 */
export const API_ERROR_MESSAGES = {
  network:
    "We couldn't reach ERA AXIS. Please check your internet connection and try again.",
  malformed: "We couldn't complete that request. Please try again in a moment.",
  badRequest: "Please check the details you entered and try again.",
  notFound: "We couldn't find what you were looking for.",
  conflict:
    "That request couldn't be completed. Please refresh the page and try again.",
  rateLimit:
    "You've tried that a few times too quickly. Please wait a moment and try again.",
  server: "Something went wrong on our side. Please try again shortly.",
  unknown: "Something went wrong. Please try again.",
};

/**
 * A failed API call. `message` is always safe to render; everything technical
 * is kept on separate properties so callers can branch on it without any of it
 * reaching the page.
 *
 *   status        HTTP status (0 when the request never reached the API)
 *   path          request path, e.g. "/enrolments/request-access"
 *   kind          "network" | "http" | "malformed" | "envelope"
 *   payload       parsed JSON body, when the response was JSON
 *   serverMessage raw server-supplied string, vetted or not — diagnostics only
 */
export class ApiError extends Error {
  constructor(
    message,
    { status = 0, path = "", kind = "unknown", payload = null, serverMessage = "", cause } = {}
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
    this.kind = kind;
    this.payload = payload;
    this.serverMessage = serverMessage;
    if (cause !== undefined) this.cause = cause;
  }
}

const MAX_SERVER_MESSAGE_LENGTH = 240;

// Markup, serialised structures, URLs, file paths and stack frames — anything
// that describes the system rather than what the person should do next.
const TECHNICAL_SHAPE_RE = /[<>{}[\]\\]|https?:\/\/|\bat\s+\S+\s+\(|node_modules|[\r\n]/;

// EDOS rejects malformed payloads by field name ("programme_id is required",
// "email is required"). Those are addressed to this client, not to a member —
// the site validates every one of them before submitting, so reaching one means
// a bug here, and the generic 400 wording is more useful than the field name.
// Deliberately case-sensitive: real member-facing copy starts with a capital.
const FIELD_NAME_SHAPE_RE =
  /^[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b|^[a-z][a-z0-9_]*\s+(?:is required|cannot be empty|must be)\b/;

/**
 * Returns a server-supplied string only when it reads as guidance for a person.
 * Anything else returns "" so the caller falls back to a generic message.
 */
export function safeServerMessage(value) {
  if (typeof value !== "string") return "";
  const text = value.trim();
  if (!text || text.length > MAX_SERVER_MESSAGE_LENGTH) return "";
  if (TECHNICAL_SHAPE_RE.test(text)) return "";
  if (FIELD_NAME_SHAPE_RE.test(text)) return "";
  return text;
}

function genericForStatus(status) {
  if (status === 429) return API_ERROR_MESSAGES.rateLimit;
  if (status >= 500) return API_ERROR_MESSAGES.server;
  if (status === 404) return API_ERROR_MESSAGES.notFound;
  if (status === 409) return API_ERROR_MESSAGES.conflict;
  if (status >= 400) return API_ERROR_MESSAGES.badRequest;
  return API_ERROR_MESSAGES.unknown;
}

/**
 * Reads a failed response without ever letting the body itself become the
 * message. HTML error pages, plain text and empty bodies all resolve to no
 * usable string rather than being passed along.
 */
async function readErrorBody(response) {
  let text;
  try {
    text = await response.text();
  } catch {
    return { payload: null, serverMessage: "" };
  }

  if (!text.trim()) return { payload: null, serverMessage: "" };

  try {
    const payload = JSON.parse(text);
    if (payload && typeof payload === "object") {
      const raw =
        typeof payload.error === "string"
          ? payload.error
          : typeof payload.message === "string"
            ? payload.message
            : "";
      return { payload, serverMessage: raw };
    }
  } catch {
    // Not JSON — an HTML error page, a proxy response or plain text. The body
    // is dropped on purpose so none of it can be rendered.
  }

  return { payload: null, serverMessage: "" };
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch (cause) {
    throw new ApiError(API_ERROR_MESSAGES.network, {
      path,
      kind: "network",
      cause,
    });
  }

  if (!response.ok) {
    const { payload, serverMessage } = await readErrorBody(response);
    // A 5xx body can carry an unsanitised exception message, so those always
    // use the generic wording even when the server supplied a string.
    const vetted =
      response.status >= 500 ? "" : safeServerMessage(serverMessage);

    throw new ApiError(vetted || genericForStatus(response.status), {
      status: response.status,
      path,
      kind: "http",
      payload,
      serverMessage,
    });
  }

  try {
    return await response.json();
  } catch (cause) {
    // A 2xx that isn't JSON — a misrouted API base URL serving the SPA shell,
    // for instance. The parser's own message names the offending characters,
    // so it must not surface.
    throw new ApiError(API_ERROR_MESSAGES.malformed, {
      status: response.status,
      path,
      kind: "malformed",
      cause,
    });
  }
}

/**
 * Builds an error for a 2xx response that still carries `{ success: false }`.
 * Callers supply the wording that fits their page; a safe server string wins
 * over it when one is offered.
 */
export function envelopeError(body, fallback = API_ERROR_MESSAGES.unknown) {
  const vetted =
    safeServerMessage(body?.error) || safeServerMessage(body?.message);

  return new ApiError(vetted || fallback, {
    status: 200,
    kind: "envelope",
    payload: body && typeof body === "object" ? body : null,
    serverMessage: typeof body?.error === "string" ? body.error : "",
  });
}

/**
 * The single place pages turn a caught error into display text. An ApiError has
 * already been vetted; anything else is a fault in our own code (a TypeError
 * while reading a response, say) whose message describes internals, so only the
 * caller's fallback is ever shown for those.
 */
export function toUserMessage(error, fallback = API_ERROR_MESSAGES.unknown) {
  if (error instanceof ApiError) return error.message;
  return fallback;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
};
