import { useEffect, useState } from "react";
import { api, envelopeError, toUserMessage } from "../../services/api";
import { confirmSignupEmail, loadSignupConfig, resendSignupCode } from "../../services/signupService";

/**
 * Sending a programme or Student Chapter sign-up and taking it to checkout.
 *
 * The email is confirmed first: a Google sign-in for the same address confirms it
 * as the sign-up is sent; otherwise the server emails a code and `confirming`
 * holds what the code step needs. Payment starts once the address is confirmed.
 */
export default function useSignUpCheckout() {
  const [clientId, setClientId] = useState(null);
  const [credential, setCredential] = useState("");
  const [confirming, setConfirming] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    loadSignupConfig().then((config) => { if (active) setClientId(config.googleClientId); });
    return () => { active = false; };
  }, []);

  async function pay(enrolmentId, months) {
    const payData = await api.post("/payments/initialize", { enrolment_id: enrolmentId, months_paid: months });
    if (!payData.success) throw envelopeError(payData, "We couldn't start your payment. Please try again.");
    window.sessionStorage.setItem("eraaxis_payment_reference", payData.data.reference);
    window.location.href = payData.data.authorizationUrl;
  }

  /** `findProgramme` resolves to the programme from the server; `payload` is the sign-up. */
  async function start({ findProgramme, payload, months = 1 }) {
    setBusy(true);
    setError("");
    try {
      const programme = await findProgramme();
      const enrolData = await api.post("/enrolments", { ...payload, programme_id: programme.id, credential: credential || undefined });
      if (!enrolData.success) throw envelopeError(enrolData, "We couldn't complete your sign-up. Please try again.");
      if (enrolData.data.emailConfirmed) {
        await pay(enrolData.data.id, months);
        return;
      }
      setConfirming({ id: enrolData.data.id, email: enrolData.data.email, months });
      setBusy(false);
    } catch (err) {
      setError(toUserMessage(err, "We couldn't start your payment. Please try again."));
      setBusy(false);
    }
  }

  async function confirmed() {
    setBusy(true);
    try {
      await pay(confirming.id, confirming.months);
    } catch (err) {
      setConfirming(null);
      setError(toUserMessage(err, "We couldn't start your payment. Please try again."));
      setBusy(false);
    }
  }

  return {
    clientId,
    credential,
    setCredential,
    confirming,
    busy,
    error,
    setError,
    start,
    confirmed,
    changeAddress: () => setConfirming(null),
    checkCode: (code) => confirmSignupEmail(confirming.id, code),
    sendAgain: () => resendSignupCode(confirming.id),
  };
}
