import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { getPaymentCategoryBySlug, calculatePaymentBreakdown } from "../data/payments";
import { api, ApiError } from "../services/api";
import BackLinkButton from "../components/navigation/BackLinkButton";
import studentChapterHeroImg from "../assets/images/programmes/student-chapter-hero.webp";
import SEO from "../components/SEO";
import { getPageSeo } from "../data/seo";
import { EMAIL_RE } from "../utils/validateEmail";
import useSpesoFees from "../hooks/useSpesoFees";

import BusyLabel from "../components/ui/BusyLabel";
import SignUpDetails from "../components/forms/SignUpDetails";
import SignUpEmail from "../components/forms/SignUpEmail";
import SignUpSteps from "../components/forms/SignUpSteps";
import OrderSummary from "../components/forms/OrderSummary";
import ConfirmEmailStep from "../components/forms/ConfirmEmailStep";
import useSignUpCheckout from "../components/forms/useSignUpCheckout";
import { EMPTY_SIGNUP, learnerLabel, signUpPayload, signUpProblem } from "../components/forms/signUp";
import { fieldCls, growingTextCls, labelCls, optionalCls } from "../components/forms/signUpStyles";

const category = getPaymentCategoryBySlug("student-chapter");
const item = category.items[0];

const BENEFITS = [
  "Student Chapter community access",
  "One practical class every month",
  "Collaborative project and build sessions",
  "Opportunities to connect with mentors and industry partners",
];

const optionalTag = <span className={optionalCls}>(optional)</span>;

export default function StudentChapterPayment() {
  const { feeConfig } = useSpesoFees();
  const breakdown = calculatePaymentBreakdown(item.baseAmount, feeConfig);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [signUp, setSignUp] = useState(EMPTY_SIGNUP);
  const [yearLevel, setYearLevel] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(0);
  const checkout = useSignUpCheckout();
  const self = !signUp.who || signUp.who === "learner";

  function finish() {
    checkout.start({
      findProgramme: async () => {
        const programmesData = await api.get("/programmes");
        const prog = programmesData.data?.find((p) => p.category === "student_chapter");
        if (!prog) throw new ApiError("Student Chapter sign-up isn't available right now. Please try again shortly.");
        return prog;
      },
      payload: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        other_names: otherNames.trim() || undefined,
        email: email.trim(),
        phone: phone.trim(),
        ...signUpPayload(signUp),
        year_level: yearLevel.trim() || undefined,
        notes: notes.trim() || undefined,
      },
    });
  }

  const steps = [
    {
      title: "Who's signing up",
      heading: "Who's signing up?",
      intro: "Use the learner's official details. They go on the Student Chapter membership and on certificates later.",
      problem: () => (signUp.who ? "" : "Please choose who is signing up."),
      body: <SignUpDetails part="who" value={signUp} onChange={setSignUp} fieldCls={fieldCls} labelCls={labelCls} optionalTag={optionalTag} />,
    },
    {
      title: "The learner",
      heading: self ? "About you" : "About the learner",
      intro: self ? "Your name as it should appear on your membership, and your school." : "The learner's name as it should appear on their membership, and their school.",
      problem: () => {
        if (!firstName.trim()) return self ? "Please enter your first name." : "Please enter the learner's first name.";
        if (!lastName.trim()) return self ? "Please enter your last name." : "Please enter the learner's last name.";
        return signUpProblem(signUp, { schoolRequired: true });
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
          <SignUpDetails part="details" value={signUp} onChange={setSignUp} schoolRequired fieldCls={fieldCls} labelCls={labelCls} optionalTag={optionalTag} />
          <div className="space-y-6 border-t border-[var(--color-border)] pt-6">
            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">Optional · helps us prepare for {self ? "you" : "them"}</p>
            <div className="sm:max-w-[50%] sm:pr-3">
              <label className={labelCls} htmlFor="signup-year">Year or level</label>
              <input id="signup-year" type="text" placeholder="Level 200" className={fieldCls} value={yearLevel} onChange={(e) => setYearLevel(e.target.value)} />
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Contact",
      heading: "How do we reach you?",
      intro: "Receipts, class reminders and chapter news go here.",
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

  const summary = (
    <OrderSummary
      title="Student Chapter, first payment"
      rows={[
        ...item.breakdown,
        { label: "Maintenance fee", amount: breakdown.maintenanceFee },
        { label: "Speso processing fee", amount: breakdown.spesoFee },
      ]}
      total={breakdown.customerTotal}
    />
  );

  return (
    <>
      <SEO {...getPageSeo("/payments/student-chapter")} />
      <section className="relative -mt-20 overflow-hidden bg-[var(--color-background-dark)] pb-14 pt-36 text-white md:pb-20 md:pt-44">
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
            className="mb-8 flex w-fit items-center gap-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white/70"
          >
            <ArrowLeft size={12} strokeWidth={2.5} aria-hidden="true" />
            Back
          </BackLinkButton>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="flex flex-col justify-center">
              <p className="mb-5 inline-flex w-fit self-start rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-xl">
                Student Chapter
              </p>
              <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[4rem]">
                Join the ERA AXIS Student Chapter.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
                Complete your first payment to access the Student Chapter
                community, monthly practical sessions, and collaborative build
                opportunities.
              </p>
            </div>

            <div className="relative hidden lg:block">
              <div className="hero-media-card">
                <img
                  src={studentChapterHeroImg}
                  alt="ERA AXIS Student Chapter learners in a practical session"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="hero-media-card-badge inline-block rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    Practical student learning
                  </span>
                </div>
              </div>
            </div>
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
                <h3 className="mb-5 text-base font-semibold tracking-tight text-[var(--color-primary-deep)]">What you get</h3>
                <ul className="space-y-4">
                  {BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <Check size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                      <span className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{benefit}</span>
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
