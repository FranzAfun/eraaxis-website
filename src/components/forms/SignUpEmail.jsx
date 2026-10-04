import { useCallback, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import GoogleSignIn from "./GoogleSignIn";
import { credentialProfile } from "./formDisplay";
import { suggestEmailCorrection } from "../../utils/emailTypoCheck";

/**
 * The sign-up's email address, which is confirmed before payment: by continuing
 * with Google (the address comes from the account, nothing to type or check), or
 * by typing it and entering the code we email.
 */
export default function SignUpEmail({ clientId, email, onEmail, credential, onCredential, label, fieldCls, labelCls }) {
  const [suggestion, setSuggestion] = useState("");
  const [switching, setSwitching] = useState(false);
  const profile = credential ? credentialProfile(credential) : null;

  const handleCredential = useCallback(
    (value) => {
      const signedInAs = credentialProfile(value);
      if (!signedInAs) return;
      onCredential(value);
      onEmail(signedInAs.email);
      setSuggestion("");
      setSwitching(false);
    },
    [onCredential, onEmail]
  );

  if (profile) {
    return (
      <div>
        <p className={labelCls}>{label}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3.5 py-3">
          <span className="flex min-w-0 items-center gap-2 text-sm">
            <CheckCircle2 size={18} aria-hidden="true" className="shrink-0 text-green-700" />
            <span className="min-w-0">
              <span className="block break-all font-semibold text-[var(--color-text-primary)]">{profile.email}</span>
              <span className="block text-xs text-[var(--color-text-secondary)]">Confirmed with Google</span>
            </span>
          </span>
          <button
            type="button"
            onClick={() => { onCredential(""); onEmail(""); setSwitching(true); }}
            className="text-sm font-semibold text-[var(--color-primary)] underline underline-offset-2"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className={labelCls} htmlFor="signup-email">{label}</label>
      <input
        id="signup-email"
        type="email"
        autoComplete="email"
        placeholder="genny@example.com"
        className={fieldCls}
        value={email}
        onChange={(e) => { onEmail(e.target.value); setSuggestion(""); }}
        onBlur={() => setSuggestion(suggestEmailCorrection(email) || "")}
      />
      {suggestion && (
        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
          Did you mean{" "}
          <button
            type="button"
            onClick={() => { onEmail(suggestion); setSuggestion(""); }}
            className="font-semibold text-[var(--color-primary)] underline"
          >
            {suggestion}
          </button>
          ?
        </p>
      )}
      <p className="mt-1.5 text-xs text-[var(--color-text-secondary)]">We&apos;ll email a six-digit code to confirm it before payment.</p>
      {clientId && (
        <div className="mt-4">
          <p className="mb-2 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-border)]" />
            or skip the code
            <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-border)]" />
          </p>
          <GoogleSignIn clientId={clientId} onCredential={handleCredential} chooseAgain={switching} />
        </div>
      )}
    </div>
  );
}
