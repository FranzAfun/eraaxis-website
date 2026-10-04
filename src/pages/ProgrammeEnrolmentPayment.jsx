import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import {
  getPaymentCategoryBySlug,
  calculatePaymentBreakdown,
  calculateFullProgrammeBase,
  formatGhs,
} from "../data/payments";
import { api, ApiError } from "../services/api";
import BackLinkButton from "../components/navigation/BackLinkButton";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";
import { EMAIL_RE } from "../utils/validateEmail";
import useSpesoFees from "../hooks/useSpesoFees";

import BusyLabel from "../components/ui/BusyLabel";
import ChoiceCards, { PillChoice } from "../components/forms/ChoiceCards";
import SignUpDetails from "../components/forms/SignUpDetails";
import SignUpEmail from "../components/forms/SignUpEmail";
import SignUpSteps from "../components/forms/SignUpSteps";
import OrderSummary from "../components/forms/OrderSummary";
import ConfirmEmailStep from "../components/forms/ConfirmEmailStep";
import useSignUpCheckout from "../components/forms/useSignUpCheckout";
import { EMPTY_SIGNUP, learnerLabel, signUpPayload, signUpProblem } from "../components/forms/signUp";
import { fieldCls, growingTextCls, labelCls, optionalCls } from "../components/forms/signUpStyles";

const category = getPaymentCategoryBySlug("programme-enrolment");

const NEXT_STEPS = [
  "Your enrolment details will be attached to your payment record.",
  "ERA AXIS will use your email/phone to match future receipts and payment history.",
  "After payment, the next steps and confirmation details will be shared with you.",
];

// Maps frontend static slugs to backend DB slugs (where they differ)
const SLUG_TO_BACKEND = {
  "junior-stem": "school-stem",
};

const optionalTag = <span className={optionalCls}>(optional)</span>;

export default function ProgrammeEnrolmentPayment() {
  const { feeConfig, feesLoading, feesError } = useSpesoFees();
  const location = useLocation();
  // Arriving from a programme's own page chooses it; otherwise nothing is chosen
  // for them.
  const [programmeSlug, setProgrammeSlug] = useState(() => {
    const requested = location.state?.programmeSlug;
    return category.items.some((programme) => programme.slug === requested) ? requested : "";
  });
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

  const selectedProgramme = category.items.find((programme) => programme.slug === programmeSlug) || null;
  const requiresInstitution = programmeSlug === "junior-stem";
  const isFullPayment = paymentOption === "full";
  const fullMonths = selectedProgramme?.fullPaymentMonths ?? 3;

  function finish() {
    checkout.start({
      findProgramme: async () => {
        const programmesData = await api.get("/programmes");
        const backendSlug = SLUG_TO_BACKEND[programmeSlug] || programmeSlug;
        const prog = programmesData.data?.find((p) => p.slug === backendSlug);
        if (!prog) throw new ApiError("This programme isn't available right now. Please try again shortly.");
        return prog;
      },
      payload: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        other_names: otherNames.trim() || undefined,
        email: email.trim(),
        phone: phone.trim(),
        ...signUpPayload(signUp),
        learning_goal: learningGoal.trim() || undefined,
        previous_experience: previousExperience.trim() || undefined,
        notes: notes.trim() || undefined,
        payment_option: paymentOption,
      },
      months: isFullPayment ? fullMonths : 1,
    });
  }

  const steps = [
    {
      title: "Programme",
      heading: "Choose your programme",
      intro: "Pick the programme, then how you'd like to pay for it.",
      problem: () => (selectedProgramme ? "" : "Please choose a programme."),
      body: (
        <>
          <ChoiceCards
            name="programme"
            columns="sm:grid-cols-2"
            options={category.items.map((programme) => ({
              value: programme.slug,
              title: programme.title,
              hint: programme.audience,
              aside: `${formatGhs(programme.monthlyAmount)} / month`,
            }))}
            value={programmeSlug}
            onChange={setProgrammeSlug}
          />
          <ChoiceCards
            name="payment-option"
            legend="How would you like to pay?"
            legendCls={labelCls}
            columns="sm:grid-cols-2"
            options={[
              { value: "monthly", title: "Monthly", hint: "Pay one month at a time." },
              { value: "full", title: "Full programme", hint: `All ${fullMonths} months at once.` },
            ]}
            value={paymentOption}
            onChange={setPaymentOption}
          />
        </>
      ),
    },
    {
      title: "Who's signing up",
      heading: "Who's signing up?",
      intro: "Use the learner's official details. They go on the enrolment and on certificates later.",
      problem: () => (signUp.who ? "" : "Please choose who is signing up."),
      body: <SignUpDetails part="who" value={signUp} onChange={setSignUp} fieldCls={fieldCls} labelCls={labelCls} optionalTag={optionalTag} />,
    },
    {
      title: "The learner",
      heading: self ? "About you" : "About the learner",
      intro: self ? "Your name as it should appear on your enrolment, and a little about your goals." : "The learner's name as it should appear on their enrolment, and a little about their goals.",
      problem: () => {
        if (!firstName.trim()) return self ? "Please enter your first name." : "Please enter the learner's first name.";
        if (!lastName.trim()) return self ? "Please enter your last name." : "Please enter the learner's last name.";
        return signUpProblem(signUp, { schoolRequired: requiresInstitution });
      },
      body: (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="signup-first-name">{learnerLabel(signUp, "First name")}</label>
              <input id="signup-first-name" type="text" autoComplete={self ? "given-name" : "off"} placeholder="Genny" className={fieldCls} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="signup-last-name">{learnerLabel(signUp, "Last name")}</label>
              <input id="signup-last-name" type="text" autoComplete={self ? "family-name" : "off"} placeholder="Amadapah" className={fieldCls} value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="signup-other-names">{learnerLabel(signUp, "Other names")}{optionalTag}</label>
              <input id="signup-other-names" type="text" placeholder="Ama" className={fieldCls} value={otherNames} onChange={(e) => setOtherNames(e.target.value)} />
            </div>
          </div>
          <SignUpDetails part="details" value={signUp} onChange={setSignUp} schoolRequired={requiresInstitution} fieldCls={fieldCls} labelCls={labelCls} optionalTag={optionalTag} />
          <div className="space-y-6 border-t border-[var(--color-border)] pt-6">
            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">Optional · helps us prepare for {self ? "you" : "them"}</p>
            <div>
              <label className={labelCls} htmlFor="signup-goal">Learning goal</label>
              <input id="signup-goal" type="text" placeholder="Build my first app" className={fieldCls} value={learningGoal} onChange={(e) => setLearningGoal(e.target.value)} />
            </div>
            <PillChoice
              name="experience"
              legend="Experience so far"
              legendCls={labelCls}
              options={["Beginner", "Some experience", "Advanced"]}
              value={previousExperience}
              onChange={setPreviousExperience}
            />
          </div>
        </>
      ),
    },
    {
      title: "Contact",
      heading: "How do we reach you?",
      intro: "Receipts, class reminders and programme news go here.",
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
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="signup-phone">{self ? "Phone number" : "Your phone, for updates"}</label>
              <input id="signup-phone" type="tel" autoComplete="tel" placeholder="+233 XX XXX XXXX" className={fieldCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="signup-notes">Anything we should know?{optionalTag}</label>
            <textarea id="signup-notes" rows={1} placeholder="A question, or access needs" className={growingTextCls} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </>
      ),
    },
  ];
  const lastStep = step === steps.length - 1;

  const baseAmount = selectedProgramme
    ? isFullPayment
      ? calculateFullProgrammeBase(selectedProgramme.monthlyAmount, fullMonths)
      : selectedProgramme.monthlyAmount
    : 0;
  const breakdown = calculatePaymentBreakdown(baseAmount, feeConfig);

  const summary = (
    <OrderSummary
      title={selectedProgramme ? selectedProgramme.title : "Programme enrolment"}
      empty={selectedProgramme ? null : "Choose a programme to see what it costs."}
      rows={[
        { label: "Payment option", value: isFullPayment ? "Full programme" : "Monthly" },
        ...(isFullPayment ? [{ label: "Programme duration", value: `${fullMonths} months` }] : []),
        { label: "Base amount", amount: breakdown.baseAmount },
        { label: "Maintenance fee", amount: breakdown.maintenanceFee },
        { label: "Speso processing fee", amount: breakdown.spesoFee },
      ]}
      total={breakdown.customerTotal}
      error={feesError}
    />
  );

  return (
    <>
      <SEO {...getPageSeo("/payments/programme-enrolment")} />
      <section className="dark-surface relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-14 pt-36 text-white md:pb-20 md:pt-44">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 18%, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, transparent 30%), radial-gradient(circle at 84% 8%, color-mix(in srgb, var(--color-primary) 38%, transparent) 0%, transparent 34%), linear-gradient(135deg, var(--color-background-dark) 0%, var(--color-primary-deep) 54%, var(--color-background-dark) 100%)",
          }}
        />
        <div aria-hidden="true" className="absolute -left-28 top-28 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-24 right-4 h-96 w-96 rounded-full bg-[var(--color-accent)]/[0.08] blur-3xl" />

        <div className="container relative z-10">
          <BackLinkButton
            fallbackTo="/payments"
            className="mb-8 flex w-fit items-center gap-1.5 text-xs font-medium text-[var(--color-text-on-dark-muted)] transition-colors hover:text-[var(--color-text-on-dark-muted)]"
          >
            <ArrowLeft size={12} strokeWidth={2.5} aria-hidden="true" />
            Back
          </BackLinkButton>

          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-text-on-hero)] backdrop-blur-xl">
              Programme Enrolment
            </p>
            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
              Choose your programme and payment option.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-lg">
              Select a programme, choose monthly or full payment, and complete
              the required enrolment details before checkout.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface-soft)] py-8 md:py-12">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
            <div>
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
                    <p className="text-[15px] text-[var(--color-text-secondary)]"><BusyLabel>Opening checkout…</BusyLabel></p>
                  )}
                </div>
              ) : (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8 md:p-10">
                  <SignUpSteps
                    steps={steps}
                    step={step}
                    onStep={setStep}
                    onFinish={finish}
                    busy={checkout.busy}
                    finishLabel="Continue to checkout"
                    error={checkout.error}
                    onError={checkout.setError}
                    lastStepExtra={summary}
                  />
                </div>
              )}
              <div
                className={`mt-6 rounded-[var(--radius-md)] border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/10 p-6 md:p-7 ${
                  lastStep ? "" : "hidden lg:block"
                }`}
              >
                <h3 className="mb-5 text-base font-semibold tracking-tight text-[var(--color-primary-deep)]">What happens next</h3>
                <ul className="space-y-4">
                  {NEXT_STEPS.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                      <span className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* On a phone the summary waits for the last step, inside the form. */}
            <div className="hidden lg:sticky lg:top-28 lg:block">{summary}</div>
          </div>
        </div>
      </section>
    </>
  );
}
