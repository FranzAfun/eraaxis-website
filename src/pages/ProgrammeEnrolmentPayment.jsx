import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import {
  getPaymentCategoryBySlug,
  calculatePaymentBreakdown,
  calculateFullProgrammeBase,
} from "../data/payments";
import { api, ApiError } from "../services/api";
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
import FormPageHeader, { FormAside } from "../components/forms/FormPageHeader";
import { PROGRAMME_IMAGES } from "../data/programmeImages";
import ConfirmEmailStep from "../components/forms/ConfirmEmailStep";
import useSignUpCheckout from "../components/forms/useSignUpCheckout";
import { EMPTY_SIGNUP, learnerLabel, signUpPayload, signUpProblem } from "../components/forms/signUp";
import { fieldCls, growingTextCls, labelCls, optionalCls } from "../components/forms/signUpStyles";

const category = getPaymentCategoryBySlug("programme-enrolment");

const NEXT_STEPS = [
  "Your details are attached to your payment.",
  "Future receipts are matched to your email and phone.",
  "Next steps and confirmation follow once you've paid.",
];

// Each programme's photo, for its card.
const PHOTO = {
  "junior-stem": PROGRAMME_IMAGES.school_stem,
  "out-of-school-youth": PROGRAMME_IMAGES.out_of_school_youth,
  "online-learning": PROGRAMME_IMAGES.online_learning,
  "era-digital-skills": PROGRAMME_IMAGES.digital_skills,
};

// Whole cedis without ".00": GHS 200, GHS 1,200.
const cedis = (amount) => `GHS ${Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

// Maps frontend static slugs to backend DB slugs (where they differ)
const SLUG_TO_BACKEND = {
  "junior-stem": "school-stem",
};

const optionalTag = <span className={optionalCls}>(optional)</span>;

// The one programme someone came to enrol on: its photo, who it is for and what
// it costs, with a quiet way to choose a different one.
function ChosenProgramme({ programme, photo, price, onChange }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border-2 border-[var(--color-primary)] bg-white shadow-lg shadow-[var(--color-primary)]/10">
      <div className="grid sm:grid-cols-[minmax(0,15rem)_1fr]">
        {photo && (
          <img
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="(min-width: 640px) 240px, calc(100vw - 4rem)"
            alt=""
            className="h-40 w-full object-cover sm:h-full"
          />
        )}
        <div className="flex flex-col gap-1 p-5">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-xs font-semibold text-white">
            <Check size={12} strokeWidth={3} aria-hidden="true" />
            Your programme
          </p>
          <p className="mt-2 text-xl font-bold leading-snug text-[var(--color-text-primary)]">{programme.title}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{programme.audience}</p>
          <p className="mt-2 text-base font-bold text-[var(--color-primary)]">{price}</p>
          <button
            type="button"
            onClick={onChange}
            className="mt-3 w-fit min-h-[44px] text-sm font-medium text-[var(--color-text-secondary)] underline decoration-[var(--color-border)] underline-offset-4 transition-colors hover:text-[var(--color-primary)] hover:decoration-current"
          >
            Choose a different programme
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProgrammeEnrolmentPayment() {
  const { feeConfig, feesLoading, feesError } = useSpesoFees();
  const location = useLocation();
  // Arriving from a programme's own page chooses it; otherwise nothing is chosen
  // for them.
  const [programmeSlug, setProgrammeSlug] = useState(() => {
    const requested = location.state?.programmeSlug;
    return category.items.some((programme) => programme.slug === requested) ? requested : "";
  });
  // Came from a programme's own page: show just that programme, with a way to
  // look at the others if they meant a different one.
  const [showAllProgrammes, setShowAllProgrammes] = useState(() => !programmeSlug);
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
      heading: showAllProgrammes || !selectedProgramme ? "Choose your programme" : "Your programme",
      intro: showAllProgrammes || !selectedProgramme ? "Pick the programme, then how you'd like to pay for it." : "Check it's the right one, then choose how you'd like to pay.",
      problem: () => (selectedProgramme ? "" : "Please choose a programme."),
      body: (
        <>
          {!showAllProgrammes && selectedProgramme ? (
            <ChosenProgramme
              programme={selectedProgramme}
              photo={PHOTO[selectedProgramme.slug]}
              price={`${cedis(selectedProgramme.monthlyAmount)} a month`}
              onChange={() => setShowAllProgrammes(true)}
            />
          ) : <ChoiceCards
            name="programme"
            columns="sm:grid-cols-2"
            options={category.items.map((programme) => ({
              value: programme.slug,
              title: programme.title,
              hint: programme.audience,
              aside: `${cedis(programme.monthlyAmount)} a month`,
              image: PHOTO[programme.slug]?.src,
              srcSet: PHOTO[programme.slug]?.srcSet,
            }))}
            value={programmeSlug}
            onChange={setProgrammeSlug}
          />}
          <ChoiceCards
            name="payment-option"
            legend="How would you like to pay?"
            legendCls={labelCls}
            columns="sm:grid-cols-2"
            options={[
              {
                value: "monthly",
                title: "Monthly",
                hint: "Pay one month at a time.",
                aside: selectedProgramme ? `${cedis(selectedProgramme.monthlyAmount)} a month` : undefined,
              },
              {
                value: "full",
                title: "Full programme",
                hint: `All ${fullMonths} months at once.`,
                aside: selectedProgramme ? `${cedis(selectedProgramme.monthlyAmount * fullMonths)} once` : undefined,
              },
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
      <section className="bg-[var(--color-surface-soft)] pb-12 pt-6 md:pb-16 md:pt-8">
        <div className="container">
          <FormPageHeader eyebrow="Enrolment" title="Enrol on a programme." line="Choose a programme, then tell us who's learning." />
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
              {lastStep && <FormAside title="What happens next" items={NEXT_STEPS} Icon={Check} className="mt-6 lg:hidden" />}
            </div>

            {/* On a phone the summary waits for the last step, inside the form. */}
            <div className="hidden space-y-4 lg:sticky lg:top-28 lg:block">
              {summary}
              <FormAside title="What happens next" items={NEXT_STEPS} Icon={Check} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
