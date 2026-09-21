import { useEffect, useRef, useState } from "react";
import { loadGoogleIdentity } from "../../utils/googleIdentity";

/**
 * Choosing a Google account, for a form that takes its email address from one.
 *
 * Google's own prompt offers the accounts already signed in on this device as the
 * page opens ("Continue as Ama"), so for most people it is a single tap, the way a
 * Google Form shows who is answering. The button underneath opens the full account
 * chooser in a popup, for anybody who dismissed the prompt or wants another
 * account. A popup keeps the person on the form, so nothing is lost to a redirect.
 *
 * `onCredential` must be stable (useCallback): the button is re-rendered whenever
 * it changes. `chooseAgain` turns off Google's automatic pick of the last account,
 * for somebody switching to a different one.
 */
export default function GoogleSignIn({ clientId, onCredential, chooseAgain = false }) {
  const buttonRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!clientId) return undefined;
    let active = true;

    loadGoogleIdentity()
      .then((google) => {
        if (!active || !buttonRef.current) return;
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onCredential(response?.credential || ""),
          ux_mode: "popup",
          cancel_on_tap_outside: true,
          context: "use",
          // The browser's own account chooser where it has one (Chrome), and the
          // prompt still shows in Safari, which blocks the older way of doing it.
          use_fedcm_for_prompt: true,
          itp_support: true,
        });
        if (chooseAgain) google.accounts.id.disableAutoSelect();
        google.accounts.id.prompt();
        // Re-rendering into a div that already holds a button would stack them.
        buttonRef.current.innerHTML = "";
        google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
          width: Math.min(Math.max(buttonRef.current.offsetWidth || 280, 200), 400),
        });
        setFailed(false);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
      // Chosen, or the page moved on: the prompt should not linger over the form.
      window.google?.accounts?.id?.cancel();
    };
  }, [clientId, onCredential, chooseAgain, attempt]);

  if (!clientId) {
    return (
      <p className="text-sm text-red-600">
        Signing in isn&apos;t available on this form just now. Please try again later.
      </p>
    );
  }

  return (
    <div>
      <div ref={buttonRef} className="min-h-[44px] w-full max-w-[400px]" />
      {failed && (
        <p className="mt-2 text-sm text-red-600">
          Google sign-in didn&apos;t load. Check your connection, then{" "}
          <button
            type="button"
            onClick={() => setAttempt((current) => current + 1)}
            className="font-semibold underline underline-offset-2"
          >
            try again
          </button>
          .
        </p>
      )}
    </div>
  );
}
