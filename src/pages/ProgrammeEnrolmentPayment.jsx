import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Check, FileText, Info, Lock } from "lucide-react";
import {
  getPaymentCategoryBySlug,
  calculatePaymentBreakdown,
  calculateFullProgrammeBase,
  formatGhs,
} from "../data/payments";
import { api, ApiError } from "../services/api";
import BackLinkButton from "../components/navigation/BackLinkButton";
import SelectField from "../components/ui/SelectField";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";
import { EMAIL_RE } from "../utils/validateEmail";
import useSpesoFees from "../hooks/useSpesoFees";

import BusyLabel from "../components/ui/BusyLabel";
import SignUpDetails from "../components/forms/SignUpDetails";
import SignUpEmail from "../components/forms/SignUpEmail";
import SignUpSteps from "../components/forms/SignUpSteps";
import ConfirmEmailStep from "../components/forms/ConfirmEmailStep";
import useSignUpCheckout from "../components/forms/useSignUpCheckout";
import { EMPTY_SIGNUP, learnerLabel, signUpPayload, signUpProblem } from "../components/forms/signUp";
const category = getPaymentCategoryBySlug("programme-enrolment");

const NEXT_STEPS = [
  "Your enrolment details will be attached to your payment record.",
  "ERA AXIS will use your email/phone to match future receipts and payment history.",
  "After payment, the next steps and confirmation details will be shared with you.",
];



const fieldCls =
  "min-h-[38px] w-full border-0 border-b border-[var(--color-border)] bg-transparent px-0 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-0";

const labelCls =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-primary-deep)]";

const optionalTag = (
  <span className="ml-1 font-normal normal-case tracking-normal text-[var(--color-text-muted)]">
    (optional)
  </span>
);

export default function ProgrammeEnrolmentPayment() {
  const { feeConfig, feesLoading, feesError } = useSpesoFees();
  const location = useLocation();
  const requestedProgrammeSlug = location.state?.programmeSlug;
  const [manualProgrammeSlug, setManualProgrammeSlug] = useState("");
  const [paymentOption, setPaymentOption] = useState("monthly");
  const [signUp, setSignUp] = useState(EMPTY_SIGNUP);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(0);
  const checkout = useSignUpCheckout();
  const self = !signUp.who || signUp.who === "learner";
  const selectedProgrammeSlug = category.items.some(
    (programme) => programme.slug === manualProgrammeSlug
  )
    ? manualProgrammeSlug
    : category.items.some(
        (programme) => programme.slug === requestedProgrammeSlug
      )
      ? requestedProgrammeSlug
      : "junior-stem";

  const selectedProgramme =
    category.items.find((programme) => programme.slug === selectedProgrammeSlug) ||
    category.items[0];

  // Maps frontend static slugs to backend DB slugs (where they differ)
  const SLUG_TO_BACKEND = {
    "junior-stem": "school-stem",
  };

  const requiresInstitution = selectedProgrammeSlug === "junior-stem";

  function finish() {
    checkout.start({
      findProgramme: async () => {
        const programmesData = await api.get("/programmes");
        const backendSlug = SLUG_TO_BACKEND[selectedProgrammeSlug] || selectedProgrammeSlug;
        const prog = programmesData.data?.find((p) => p.slug === backendSlug);
        if (!prog) throw new ApiError("This programme isn't available right now. Please try again shortly.");
        return prog;
      },
      payload: {
        first_name:          firstName.trim(),
        last_name:           lastName.trim(),
        other_names:         otherNames.trim() || undefined,
        email:               email.trim(),
        phone:               phone.trim(),
        ...signUpPayload(signUp),
        learning_goal:       learningGoal.trim() || undefined,
        previous_experience: previousExperience.trim() || undefined,
        notes:               notes.trim() || undefined,
        payment_option:      paymentOption,
      },
      months: paymentOption === "full" ? (selectedProgramme.fullPaymentMonths ?? 3) : 1,
    });
  }

  const steps = [
    {
      title: "Programme",
      problem: () => (signUp.who ? "" : "Please choose who is signing up."),
      body: (
        <>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelCls}>Programme</label>
                          <SelectField
                            name="programme"
                            value={selectedProgrammeSlug}
                            onChange={(event) => setManualProgrammeSlug(event.target.value)}
                            className={fieldCls}
                            options={category.items.map((programme) => ({ value: programme.slug, label: programme.title }))}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Payment option</label>
                          <SelectField
                            name="paymentOption"
                            value={paymentOption}
                            onChange={(event) => setPaymentOption(event.target.value)}
                            className={fieldCls}
                            options={[
                              { value: "monthly", label: "Monthly" },
                              { value: "full", label: "Full programme" },
                            ]}
                          />
                        </div>
                      </div>
                      <SignUpDetails part="who" value={signUp} onChange={setSignUp} fieldCls={fieldCls} labelCls={labelCls} optionalTag={optionalTag} />
        </>
      ),
    },
    {
      title: "The learner",
      problem: () => {
        if (!firstName.trim()) return self ? "Please enter your first name." : "Please enter the learner's first name.";
        if (!lastName.trim()) return self ? "Please enter your last name." : "Please enter the learner's last name.";
        return signUpProblem(signUp, { schoolRequired: requiresInstitution });
      },
      body: (
        <>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelCls} htmlFor="signup-first-name">{learnerLabel(signUp, "First name")}</label>
                          <input id="signup-first-name" type="text" autoComplete={self ? "given-name" : "off"} placeholder="Genny" className={fieldCls} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="signup-last-name">{learnerLabel(signUp, "Last name")}</label>
                          <input id="signup-last-name" type="text" autoComplete={self ? "family-name" : "off"} placeholder="Amadapah" className={fieldCls} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="signup-other-names">{learnerLabel(signUp, "Other names")} {optionalTag}</label>
                          <input id="signup-other-names" type="text" placeholder="Middle name(s), if any" className={fieldCls} value={otherNames} onChange={(e) => setOtherNames(e.target.value)} />
                        </div>
                      </div>
                      <SignUpDetails part="details" value={signUp} onChange={setSignUp} schoolRequired={requiresInstitution} fieldCls={fieldCls} labelCls={labelCls} optionalTag={optionalTag} />
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelCls} htmlFor="signup-goal">Learning goal {optionalTag}</label>
                          <input id="signup-goal" type="text" placeholder="What do you want to achieve?" className={fieldCls} value={learningGoal} onChange={(e) => setLearningGoal(e.target.value)} />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="signup-experience">Previous experience {optionalTag}</label>
                          <input id="signup-experience" type="text" placeholder="Beginner, some experience, or advanced" className={fieldCls} value={previousExperience} onChange={(e) => setPreviousExperience(e.target.value)} />
                        </div>
                      </div>
        </>
      ),
    },
    {
      title: "Contact",
      problem: () => {
        if (feesLoading) return "The current fees are still loading. Please try again in a moment.";
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
                        label={self ? "Email address" : "Your email, for receipts and updates"}
                        fieldCls={fieldCls}
                        labelCls={labelCls}
                      />
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelCls} htmlFor="signup-phone">{self ? "Phone number" : "Your phone, for updates"}</label>
                          <input id="signup-phone" type="tel" autoComplete="tel" placeholder="+233 XX XXX XXXX" className={fieldCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls} htmlFor="signup-notes">Notes {optionalTag}</label>
                        <textarea id="signup-notes" rows={3} placeholder="Anything ERA AXIS should know before enrolment..." className={`${fieldCls} min-h-20 resize-none`} value={notes} onChange={(e) => setNotes(e.target.value)} />
                      </div>
        </>
      ),
    },
  ];

  const isFullPayment = paymentOption === "full";
  const baseAmount = isFullPayment
    ? calculateFullProgrammeBase(
        selectedProgramme.monthlyAmount,
        selectedProgramme.fullPaymentMonths
      )
    : selectedProgramme.monthlyAmount;
  const breakdown = calculatePaymentBreakdown(baseAmount, feeConfig);

  return (
    <>
      <SEO {...getPageSeo("/payments/programme-enrolment")} />
      <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-14 pt-36 text-white md:pb-20 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 18%, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, transparent 30%), radial-gradient(circle at 84% 8%, color-mix(in srgb, var(--color-primary) 38%, transparent) 0%, transparent 34%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-28 top-28 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-4 h-96 w-96 rounded-full bg-[var(--color-accent)]/[0.08] blur-3xl"
        />

        <div className="container relative z-10">
          <BackLinkButton
            fallbackTo="/payments"
            className="mb-8 flex w-fit items-center gap-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white/70"
          >
            <ArrowLeft size={12} strokeWidth={2.5} aria-hidden="true" />
            Back
          </BackLinkButton>

          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
              Programme Enrolment
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
              Choose your programme and payment option.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Select a programme, choose monthly or full payment, and complete
              the required enrolment details before checkout.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface-soft)] py-8 md:py-10">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-[1fr_330px] lg:items-start">
            <div className="order-1 lg:order-none">
          {checkout.confirming ? (
            <div className="space-y-3">
              <ConfirmEmailStep
                email={checkout.confirming.email}
                savedNote="Your sign-up is saved."
                checkCode={checkout.checkCode}
                sendAgain={checkout.sendAgain}
                onConfirmed={checkout.confirmed}
                onChangeAddress={checkout.changeAddress}
              />
              {checkout.busy && (
                <p className="text-sm text-[var(--color-text-secondary)]"><BusyLabel>Opening checkout…</BusyLabel></p>
              )}
            </div>
          ) : (
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-center gap-2">
                  <FileText
                    size={19}
                    strokeWidth={2.25}
                    aria-hidden="true"
                    className="text-[var(--color-primary)]"
                  />
                  <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    Programme enrolment details
                  </h2>
                </div>

                <div className="mb-6 flex gap-3 rounded-[var(--radius-sm)] bg-[var(--color-primary)]/10 px-4 py-3 text-xs leading-relaxed text-[var(--color-primary-deep)]">
                  <Info
                    size={16}
                    strokeWidth={2.25}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                  />
                  <p>
                    Complete the details needed to attach your enrolment to your
                    payment record.
                  </p>
                </div>

                <SignUpSteps
                  steps={steps}
                  step={step}
                  onStep={setStep}
                  onFinish={finish}
                  busy={checkout.busy}
                  finishLabel="Continue to checkout"
                  error={checkout.error}
                  onError={checkout.setError}
                />
              </div>
          )}
            </div>

            <div className="order-2 space-y-4 lg:order-none lg:sticky lg:top-28">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-sm">
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                  Order summary
                </p>
                <h2 className="mb-5 text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                  {selectedProgramme.title}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Payment option
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {isFullPayment ? "Full programme" : "Monthly"}
                    </span>
                  </div>

                  {isFullPayment && (
                    <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 text-sm">
                      <span className="text-[var(--color-text-secondary)]">
                        Programme duration
                      </span>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {selectedProgramme.fullPaymentMonths} months
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Base amount
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {formatGhs(breakdown.baseAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4 text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Maintenance fee
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {formatGhs(breakdown.maintenanceFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Speso processing fee
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {formatGhs(breakdown.spesoFee)}
                    </span>
                  </div>
                </div>

                <div className="my-5 flex items-center justify-between gap-4 rounded-[var(--radius-sm)] bg-[var(--color-primary)]/10 px-4 py-4">
                  <span className="text-sm font-semibold text-[var(--color-primary-deep)]">
                    Total payable
                  </span>
                  <span className="text-xl font-bold text-[var(--color-primary)]">
                    {formatGhs(breakdown.customerTotal)}
                  </span>
                </div>

                <div className="space-y-3">
                  {feesError && (
                    <p role="alert" className="max-w-full break-words rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm leading-relaxed text-red-700">
                      {feesError}
                    </p>
                  )}
                  <Link
                    to="/payments"
                    className="btn-outline w-full justify-center"
                  >
                    Back to enrolment &amp; dues
                  </Link>
                </div>
              </div>

              <p className="flex items-center justify-center gap-2 text-center text-xs text-[var(--color-text-muted)]">
                <Lock size={14} strokeWidth={2} aria-hidden="true" />
                Payments are processed securely via Speso.
              </p>
            </div>

            <div className="order-3 rounded-[var(--radius-md)] border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/10 p-6 md:p-7 lg:order-none lg:col-start-1 lg:row-start-2">
              <h3 className="mb-5 text-sm font-semibold tracking-tight text-[var(--color-primary-deep)]">
                What happens next
              </h3>
              <ul className="space-y-4">
                {NEXT_STEPS.map((step) => (
                  <li key={step} className="flex items-start gap-3">
                    <Check
                      size={15}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                    />
                    <span className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
