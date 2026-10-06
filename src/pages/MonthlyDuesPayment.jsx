import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { getPaymentCategoryBySlug, calculatePaymentBreakdown, formatGhs } from "../data/payments";
import { api, ApiError, envelopeError, toUserMessage } from "../services/api";
import FormPageHeader from "../components/forms/FormPageHeader";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";
import { EMAIL_RE } from "../utils/validateEmail";
import useSpesoFees from "../hooks/useSpesoFees";

import BusyLabel from "../components/ui/BusyLabel";
import ChoiceCards from "../components/forms/ChoiceCards";
import GoogleSignIn from "../components/forms/GoogleSignIn";
import SignUpEmail from "../components/forms/SignUpEmail";
import SignUpSteps from "../components/forms/SignUpSteps";
import OrderSummary from "../components/forms/OrderSummary";
import ConfirmEmailStep from "../components/forms/ConfirmEmailStep";
import useSignUpCheckout from "../components/forms/useSignUpCheckout";
import { fieldCls, labelCls, optionalCls } from "../components/forms/signUpStyles";

const category = getPaymentCategoryBySlug("monthly-dues");
const item = category.items[0];

// Returning-member login is the one place a 404 is an ordinary outcome rather
// than a fault: the address simply has no paid dues registration behind it. The
// recovery is to correct the email or switch to the first-time steps, so it gets
// wording of its own instead of the client's generic "not found".
const NO_PAID_DUES_MESSAGE =
  "We couldn't find paid dues for this email. Check the email you used before, or choose \"This is my first time\".";

const HISTORY_ACCESS = [
  "Returning members sign in with a code sent to their email.",
  "Paying with the same email keeps every payment on one record.",
  "A receipt is emailed as soon as the payment goes through.",
];

const PERIODS = [
  { value: "1", title: "1 month", hint: "This month" },
  { value: "3", title: "3 months", hint: "A quarter" },
  { value: "6", title: "6 months", hint: "Half a year" },
  { value: "12", title: "12 months", hint: "A full year" },
];

const periodOptions = PERIODS.map((period) => ({ ...period, aside: formatGhs(item.baseAmount * Number(period.value)) }));

const optionalTag = <span className={optionalCls}>(optional)</span>;

const findDuesProgramme = async () => {
  const programmesData = await api.get("/programmes");
  const prog = programmesData.data?.find((p) => p.category === "monthly_dues");
  if (!prog) throw new ApiError("Monthly dues aren't available right now. Please try again shortly.");
  return prog;
};

export default function MonthlyDuesPayment() {
  const { feeConfig } = useSpesoFees();
  const navigate = useNavigate();
  const [path, setPath] = useState(""); // "" | "returning" | "first"

  // First time.
  const checkout = useSignUpCheckout();
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [months, setMonths] = useState("1");

  // Returning.
  const [loginStep, setLoginStep] = useState("email"); // "email" | "otp" | "history"
  const [duesProgrammeId, setDuesProgrammeId] = useState(null);
  const [returningEmail, setReturningEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [returningEnrolment, setReturningEnrolment] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [historyMonths, setHistoryMonths] = useState("1");

  const [showNavConfirm, setShowNavConfirm] = useState(false);
  const isDirty = useRef(false);
  const pendingNav = useRef(null);
  const cardRef = useRef(null);

  const checkoutMonths = path === "returning" ? historyMonths : months;
  const breakdown = calculatePaymentBreakdown(item.baseAmount * Number(checkoutMonths), feeConfig);

  function choosePath(next) {
    setPath(next);
    checkout.setError("");
    setLoginError("");
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleRequestOtp() {
    setLoginError("");
    if (!returningEmail.trim()) { setLoginError("Please enter the email you pay dues with."); return; }
    if (!EMAIL_RE.test(returningEmail.trim())) { setLoginError("Please enter a valid email address."); return; }
    setLoginBusy(true);
    try {
      let progId = duesProgrammeId;
      if (!progId) {
        progId = (await findDuesProgramme()).id;
        setDuesProgrammeId(progId);
      }
      const data = await api.post("/enrolments/request-access", { email: returningEmail.trim(), programme_id: progId });
      if (!data.success) throw envelopeError(data, "We couldn't send your code. Please try again.");
      setLoginStep("otp");
      setResendCooldown(120);
    } catch (err) {
      // The entered email is left in place either way so it can be corrected.
      const noPaidDues = err instanceof ApiError && err.status === 404 && err.path === "/enrolments/request-access";
      setLoginError(noPaidDues ? NO_PAID_DUES_MESSAGE : toUserMessage(err, "We couldn't send your code. Please try again."));
    } finally {
      setLoginBusy(false);
    }
  }

  async function handleVerifyOtp() {
    setLoginError("");
    if (otpCode.replace(/\D/g, "").length !== 6) { setLoginError("Enter the six-digit code from the email."); return; }
    setLoginBusy(true);
    try {
      const data = await api.post("/enrolments/verify-access", {
        email: returningEmail.trim(),
        programme_id: duesProgrammeId,
        otp: otpCode.replace(/\D/g, ""),
      });
      if (!data.success) throw envelopeError(data, "That code didn't work. Please try again.");
      await openMembership(data.data);
    } catch (err) {
      // Every 400 from verify-access means the same thing to the member: the
      // code they typed is not the live one. Say so, and point at the recovery.
      const badCode = err instanceof ApiError && err.status === 400;
      setLoginError(
        badCode
          ? "That code didn't work. It may have expired: check the most recent email from us, or ask for a new code."
          : toUserMessage(err, "We couldn't check your code. Please try again.")
      );
    } finally {
      setLoginBusy(false);
    }
  }

  async function openMembership(enrolment) {
    setReturningEnrolment(enrolment);
    const historyData = await api.get(`/enrolments/${enrolment.id}/payment-history`);
    setPaymentHistory(historyData.success ? historyData.data : []);
    setLoginStep("history");
  }

  // Google proves the address the way the code does, so a member can skip it.
  const handleGoogleCredential = useCallback(async (credential) => {
    if (!credential) return;
    setLoginError("");
    setLoginBusy(true);
    try {
      const progId = duesProgrammeId || (await findDuesProgramme()).id;
      setDuesProgrammeId(progId);
      const data = await api.post("/enrolments/google-access", { credential, programme_id: progId });
      if (!data.success) throw envelopeError(data, "That Google sign-in did not work. Please try again, or use a code.");
      setReturningEmail(data.data.email || "");
      await openMembership(data.data);
    } catch (err) {
      const noPaidDues = err instanceof ApiError && err.status === 404;
      setLoginError(
        noPaidDues
          ? `We couldn't find paid dues for ${err.payload?.data?.email || "that Google account"}. Try the email you used before, or choose "This is my first time".`
          : toUserMessage(err, "That Google sign-in did not work. Please try again, or use a code.")
      );
    } finally {
      setLoginBusy(false);
    }
  }, [duesProgrammeId]);

  async function handlePayAgain() {
    setLoginBusy(true);
    setLoginError("");
    try {
      const payData = await api.post("/payments/initialize", { enrolment_id: returningEnrolment.id, months_paid: Number(historyMonths) });
      if (!payData.success) throw envelopeError(payData, "We couldn't start your payment. Please try again.");
      isDirty.current = false;
      window.sessionStorage.setItem("eraaxis_payment_reference", payData.data.reference);
      window.location.href = payData.data.authorizationUrl;
    } catch (err) {
      setLoginError(toUserMessage(err, "We couldn't start your payment. Please try again."));
      setLoginBusy(false);
    }
  }

  function finishFirstTime() {
    isDirty.current = false;
    checkout.start({
      findProgramme: findDuesProgramme,
      payload: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        other_names: otherNames.trim() || undefined,
        email: email.trim(),
        phone: phone.trim(),
        // Dues are paid by the member themselves; saying so asks the server to
        // confirm the email before payment, as the other sign-ups do.
        signed_up_by: "learner",
      },
      months: Number(months),
    });
  }

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timer = setInterval(() => setResendCooldown((current) => (current > 0 ? current - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Unsaved progress: a partly filled first-time sign-up, or a returning member
  // who has asked for a code (losing that means asking again).
  useEffect(() => {
    isDirty.current = Boolean(
      firstName.trim() || lastName.trim() || otherNames.trim() || email.trim() || phone.trim() || loginStep !== "email"
    );
  }, [firstName, lastName, otherNames, email, phone, loginStep]);

  // Tab close or reload: the browser shows its own dialog; nothing custom is possible.
  useEffect(() => {
    function handleBeforeUnload(e) {
      if (!isDirty.current) return;
      e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // In-app links (header, back link): asked about first. Capture phase runs
  // before React Router's own click handler, so it can be held.
  useEffect(() => {
    function handleAnchorClick(e) {
      if (!isDirty.current) return;
      const anchor = e.target.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || /^#|^(https?:)?\/\/|^mailto:|^tel:/.test(href)) return;
      e.preventDefault();
      e.stopPropagation();
      pendingNav.current = href;
      setShowNavConfirm(true);
    }
    document.addEventListener("click", handleAnchorClick, true);
    return () => document.removeEventListener("click", handleAnchorClick, true);
  }, []);

  const summary = (
    <OrderSummary
      title="Monthly dues"
      rows={[
        { label: "Monthly dues", amount: item.baseAmount },
        { label: "Months", value: `× ${Number(checkoutMonths)}` },
        { label: "Dues total", amount: breakdown.baseAmount },
        { label: "Maintenance fee", amount: breakdown.maintenanceFee },
        { label: "Speso processing fee", amount: breakdown.spesoFee },
      ]}
      total={breakdown.customerTotal}
    />
  );

  const switchLink = (label, next) => (
    <button
      type="button"
      onClick={() => choosePath(next)}
      className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline"
    >
      <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
      {label}
    </button>
  );

  const firstTimeSteps = [
    {
      title: "About you",
      heading: "About you",
      intro: "Your name as it should appear on your membership.",
      problem: () => {
        if (!firstName.trim()) return "Please enter your first name.";
        if (!lastName.trim()) return "Please enter your last name.";
        return "";
      },
      body: (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="dues-first-name">First name</label>
            <input id="dues-first-name" type="text" autoComplete="given-name" placeholder="Genny" className={fieldCls} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="dues-last-name">Last name</label>
            <input id="dues-last-name" type="text" autoComplete="family-name" placeholder="Amadapah" className={fieldCls} value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="dues-other-names">Other names{optionalTag}</label>
            <input id="dues-other-names" type="text" placeholder="Ama" className={fieldCls} value={otherNames} onChange={(e) => setOtherNames(e.target.value)} />
          </div>
        </div>
      ),
    },
    {
      title: "How long",
      heading: "How many months?",
      intro: "Pay a month at a time, or further ahead.",
      problem: () => "",
      body: <ChoiceCards name="dues-months" columns="grid-cols-2 lg:grid-cols-4" options={periodOptions} value={months} onChange={setMonths} />,
    },
    {
      title: "Contact",
      heading: "How do we reach you?",
      intro: "Receipts and reminders go here. Use this email next time to sign straight in.",
      problem: () => {
        if (!email.trim()) return "Please enter an email address, or continue with Google.";
        if (!EMAIL_RE.test(email.trim())) return "Please enter a valid email address.";
        if (!phone.trim()) return "Please enter a phone number.";
        return "";
      },
      body: (
        <>
          <SignUpEmail
            clientId={checkout.clientId}
            email={email}
            onEmail={setEmail}
            credential={checkout.credential}
            onCredential={checkout.setCredential}
            label="Email address"
            fieldCls={fieldCls}
            labelCls={labelCls}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="dues-phone">Phone number</label>
              <input id="dues-phone" type="tel" autoComplete="tel" placeholder="+233 XX XXX XXXX" className={fieldCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
        </>
      ),
    },
  ];
  const onLastStep = (path === "first" && step === firstTimeSteps.length - 1) || (path === "returning" && loginStep === "history");

  const loginErrorBox = loginError && (
    <p role="alert" className="mt-6 max-w-full break-words rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-4 py-3 text-[15px] leading-relaxed text-red-700">
      {loginError}
    </p>
  );

  return (
    <>
      <SEO {...getPageSeo("/payments/monthly-dues")} />
      <section className="bg-[var(--color-surface-soft)] pb-12 pt-6 md:pb-16 md:pt-8">
        <div className="container">
          <FormPageHeader
            eyebrow="Monthly dues"
            title="Pay your monthly dues."
            line={`${formatGhs(item.baseAmount)} a month. Members sign in with a code; paying for the first time takes a minute.`}
          />
          <div className="land-in-late grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
            <div ref={cardRef} className="scroll-mt-28">
              {path === "first" && checkout.confirming ? (
                <div className="space-y-3">
                  <ConfirmEmailStep
                    email={checkout.confirming.email}
                    savedNote="Your details are saved."
                    checkCode={checkout.checkCode}
                    sendAgain={checkout.sendAgain}
                    onConfirmed={checkout.confirmed}
                    onChangeAddress={checkout.changeAddress}
                  />
                  {checkout.busy && (
                    <p className="text-[15px] text-[var(--color-text-secondary)]"><BusyLabel>Opening checkout…</BusyLabel></p>
                  )}
                </div>
              ) : (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8 md:p-10">
                  {!path && (
                    <div className="signup-step">
                      <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[1.75rem]">
                        Have you paid dues with us before?
                      </h2>
                      <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                        Members sign in with a code; everyone else starts here.
                      </p>
                      <div className="mt-7">
                        <ChoiceCards
                          name="dues-path"
                          columns="sm:grid-cols-2"
                          options={[
                            { value: "returning", title: "Yes, I'm a member", hint: "We'll email you a code and bring up your details.", Icon: UserRound },
                            { value: "first", title: "No, this is my first time", hint: "Three short steps, then checkout.", Icon: Sparkles },
                          ]}
                          value={path}
                          onChange={choosePath}
                        />
                      </div>
                    </div>
                  )}

                  {path === "first" && (
                    <>
                      <div className="mb-6">{switchLink("I've paid before", "returning")}</div>
                      <SignUpSteps
                        steps={firstTimeSteps}
                        step={step}
                        onStep={setStep}
                        onFinish={finishFirstTime}
                        busy={checkout.busy}
                        finishLabel="Continue to checkout"
                        error={checkout.error}
                        onError={checkout.setError}
                        lastStepExtra={summary}
                      />
                    </>
                  )}

                  {path === "returning" && (
                    <div key={loginStep} className="signup-step">
                      {loginStep !== "history" && <div className="mb-6">{switchLink("This is my first time", "first")}</div>}

                      {loginStep === "email" && (
                        <>
                          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[1.75rem]">Welcome back</h2>
                          <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                            Sign in with the email you pay dues with: by a six-digit code we send, or with Google.
                          </p>
                          <div className="mt-7 max-w-md">
                            <label className={labelCls} htmlFor="dues-returning-email">Email address</label>
                            <input
                              id="dues-returning-email"
                              type="email"
                              autoComplete="email"
                              placeholder="genny@example.com"
                              className={fieldCls}
                              value={returningEmail}
                              onChange={(e) => setReturningEmail(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter") handleRequestOtp(); }}
                            />
                          </div>
                          {checkout.clientId && (
                            <div className="mt-6 max-w-md">
                              <p className="mb-3 flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                                <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-border)]" />
                                or skip the code
                                <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-border)]" />
                              </p>
                              <GoogleSignIn clientId={checkout.clientId} onCredential={handleGoogleCredential} />
                            </div>
                          )}
                          {loginErrorBox}
                          <div className="mt-8 flex justify-end">
                            <button type="button" onClick={handleRequestOtp} disabled={loginBusy} className={`btn-primary min-h-[48px] justify-center px-7 text-[15px]${loginBusy ? " cursor-not-allowed opacity-100" : ""}`}>
                              {loginBusy ? <BusyLabel>Sending…</BusyLabel> : "Send my code"}
                              {!loginBusy && <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />}
                            </button>
                          </div>
                        </>
                      )}

                      {loginStep === "otp" && (
                        <>
                          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[1.75rem]">Check your email</h2>
                          <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                            We sent a six-digit code to <span className="break-all font-semibold text-[var(--color-text-primary)]">{returningEmail}</span>.
                          </p>
                          <div className="mt-7 max-w-xs">
                            <label className={labelCls} htmlFor="dues-code">Code from the email</label>
                            <input
                              id="dues-code"
                              type="text"
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              maxLength={7}
                              className={`${fieldCls} font-mono tracking-[0.3em]`}
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/[^\d ]/g, ""))}
                              onKeyDown={(e) => { if (e.key === "Enter") handleVerifyOtp(); }}
                            />
                          </div>
                          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
                            <button
                              type="button"
                              onClick={handleRequestOtp}
                              disabled={resendCooldown > 0 || loginBusy}
                              className="font-semibold text-[var(--color-primary)] underline underline-offset-2 disabled:cursor-not-allowed disabled:no-underline disabled:text-[var(--color-text-muted)]"
                            >
                              {resendCooldown > 0 ? `Send a new code in ${resendCooldown}s` : "Send a new code"}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setLoginStep("email"); setOtpCode(""); setLoginError(""); }}
                              className="font-semibold text-[var(--color-text-secondary)] underline underline-offset-2"
                            >
                              Change email
                            </button>
                          </p>
                          {loginErrorBox}
                          <div className="mt-8 flex justify-end">
                            <button type="button" onClick={handleVerifyOtp} disabled={loginBusy} className={`btn-primary min-h-[48px] justify-center px-7 text-[15px]${loginBusy ? " cursor-not-allowed opacity-100" : ""}`}>
                              {loginBusy ? <BusyLabel>Checking…</BusyLabel> : "Continue"}
                              {!loginBusy && <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />}
                            </button>
                          </div>
                        </>
                      )}

                      {loginStep === "history" && returningEnrolment && (
                        <>
                          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[1.75rem]">
                            Welcome back, {String(returningEnrolment.fullName || "").split(" ")[0]}
                          </h2>
                          <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">How many months would you like to pay?</p>
                          <div className="mt-7">
                            <ChoiceCards name="dues-history-months" columns="grid-cols-2 lg:grid-cols-4" options={periodOptions} value={historyMonths} onChange={setHistoryMonths} />
                          </div>

                          <div className="mt-8">
                            <p className="text-[15px] font-semibold text-[var(--color-text-primary)]">Your payments</p>
                            {paymentHistory.length > 0 ? (
                              <ul className="mt-3 divide-y divide-[var(--color-border)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]">
                                {paymentHistory.map((entry) => (
                                  <li key={entry.reference} className="flex items-center justify-between gap-3 px-4 py-3">
                                    <div className="min-w-0">
                                      <p className="text-[15px] font-medium text-[var(--color-text-primary)]">
                                        {new Date(entry.paidAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                                      </p>
                                      <p className="truncate text-sm text-[var(--color-text-secondary)]">
                                        {entry.monthsPaid} month{entry.monthsPaid === 1 ? "" : "s"} · {entry.reference}
                                      </p>
                                    </div>
                                    <span className="whitespace-nowrap text-[15px] font-semibold text-[var(--color-text-primary)]">{formatGhs(entry.amount)}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-2 text-[15px] text-[var(--color-text-secondary)]">No payments found yet.</p>
                            )}
                          </div>

                          {loginErrorBox}
                          <div className="mt-8 lg:hidden">{summary}</div>
                          <div className="mt-8 flex justify-end">
                            <button type="button" onClick={handlePayAgain} disabled={loginBusy} className={`btn-primary min-h-[48px] w-full justify-center px-7 text-[15px] sm:w-auto${loginBusy ? " cursor-not-allowed opacity-100" : ""}`}>
                              {loginBusy ? <BusyLabel>Opening checkout…</BusyLabel> : "Continue to checkout"}
                              {!loginBusy && <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div
                className={`mt-6 rounded-[var(--radius-md)] border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/10 p-6 md:p-7 ${
                  onLastStep ? "" : "hidden lg:block"
                }`}
              >
                <div className="mb-5 flex items-center gap-2">
                  <ShieldCheck size={18} strokeWidth={2.25} aria-hidden="true" className="text-[var(--color-primary)]" />
                  <h3 className="text-base font-semibold tracking-tight text-[var(--color-primary-deep)]">Your payment record</h3>
                </div>
                <ul className="space-y-4">
                  {HISTORY_ACCESS.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                      <span className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* On a phone the summary waits for the last step, inside the card. */}
            <div className="hidden lg:sticky lg:top-28 lg:block">{summary}</div>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={showNavConfirm}
        title="Leave without saving?"
        message="You have unsaved progress here. If you leave now it will be lost."
        confirmLabel="Leave"
        cancelLabel="Stay on page"
        onConfirm={() => {
          isDirty.current = false;
          setShowNavConfirm(false);
          navigate(pendingNav.current);
          pendingNav.current = null;
        }}
        onCancel={() => {
          setShowNavConfirm(false);
          pendingNav.current = null;
        }}
      />
    </>
  );
}
