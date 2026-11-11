import { useEffect, useState } from "react";
import { clearDraft, readDraft, writeDraft } from "./formDisplay";

/**
 * What someone has typed into a sign-up page (Campus Chapter, programme
 * enrolment, Monthly Dues), kept in their own browser like the EDOS forms'
 * drafts, so a dropped signal, a closed tab or a trip to another app does not
 * cost them their answers. Never sent anywhere. Forgotten after a week, and
 * cleared once they are sent to payment (useSignUpCheckout's `draftKey`).
 *
 * A page reads the draft once, as it first draws (`useSavedDraft`: its fields
 * start from `initial`), and keeps every change after that (`useKeepDraft`).
 * `blank` is the page's empty state.
 */
const KEEP_FOR_MS = 7 * 24 * 60 * 60 * 1000;

export const signUpDraftKey = (page) => `signup-${page}`;

export function useSavedDraft(page, blank) {
  const key = signUpDraftKey(page);
  const [saved] = useState(() => {
    const draft = readDraft(key);
    if (draft && Date.now() - Number(draft.savedAt || 0) < KEEP_FOR_MS) return draft.answers;
    if (draft) clearDraft(key);
    return null;
  });
  const [restored, setRestored] = useState(Boolean(saved));
  return {
    key,
    initial: saved ? { ...blank, ...saved } : blank,
    restored,
    /** "Start again": forget the draft; the page clears its own fields. */
    forget() {
      clearDraft(key);
      setRestored(false);
    },
    dismiss() {
      setRestored(false);
    },
  };
}

export function useKeepDraft(key, state, blank) {
  const serialised = JSON.stringify(state);
  const empty = JSON.stringify(blank);
  useEffect(() => {
    if (serialised === empty) return;
    writeDraft(key, { answers: JSON.parse(serialised) });
  }, [key, serialised, empty]);
}
