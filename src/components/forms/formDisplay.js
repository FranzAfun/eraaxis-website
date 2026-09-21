// Small pieces of how a form reads, shared by the public form's components. The
// builder in EDOS has the same two rules, so a form looks the way its creator
// previewed it.

// Help text under a question reads as an example, so the form supplies the "e.g."
// and the person building it just writes the example.
export function exampleText(help) {
  const written = (help || "").trim();
  if (!written) return "";
  const already = written.toLowerCase();
  return already.startsWith("e.g") || already.startsWith("eg ") ? written : `e.g. ${written}`;
}

// Every text box on a form. 16px text on a phone, so the page does not zoom in
// on the field somebody taps.
export const fieldClass =
  "min-h-[48px] w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-base text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 aria-[invalid=true]:border-red-500 sm:text-[15px]";

// A scale is drawn as stars unless it says otherwise, and never when it starts at
// zero: nobody can click "no stars".
export const scaleStyle = (scale = {}) =>
  scale.style || ((scale.min ?? 1) === 1 ? "stars" : "numbers");

/**
 * What a Google credential says about who signed in, for showing it back to them.
 * Only for display: the server verifies the credential itself and never trusts
 * this reading of it.
 */
export function credentialProfile(credential) {
  try {
    const part = String(credential).split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = part.padEnd(part.length + ((4 - (part.length % 4)) % 4), "=");
    const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes));
    if (!claims.email) return null;
    return { email: claims.email, name: claims.name || "", expiresAt: (Number(claims.exp) || 0) * 1000 };
  } catch {
    return null;
  }
}

/**
 * Answers in progress, kept on this device so a dropped signal or a closed tab
 * does not cost somebody what they had typed. Per form rather than per version:
 * question keys are never reused, so answers survive the form being edited.
 * Storage can be missing or full; every call here fails quietly, and the form
 * works the same without it.
 */
const draftKey = (slug) => `eraaxis-form:${slug}`;

export function readDraft(slug) {
  try {
    const raw = window.localStorage.getItem(draftKey(slug));
    const draft = raw ? JSON.parse(raw) : null;
    return draft && typeof draft === "object" && draft.answers ? draft : null;
  } catch {
    return null;
  }
}

export function writeDraft(slug, draft) {
  try {
    window.localStorage.setItem(draftKey(slug), JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch {
    // Private browsing or a full disk: the form still works, it just won't remember.
  }
}

export function clearDraft(slug) {
  try {
    window.localStorage.removeItem(draftKey(slug));
  } catch {
    // Nothing to clear.
  }
}

// A draft with nothing typed in it is not worth offering back.
export const hasAnswers = (answers) =>
  Object.values(answers || {}).some((value) =>
    Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== ""
  );
