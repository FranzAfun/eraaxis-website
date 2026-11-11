import { useEffect, useRef, useState } from "react";
import { ArrowDown, Check, Sparkles } from "lucide-react";
import ChapterRequestForm from "../components/forms/ChapterRequestForm";
import DraftNotice from "../components/forms/DraftNotice";
import { useKeepDraft, useSavedDraft } from "../components/forms/useSignUpDraft";
import { findChapterSchools } from "../services/formsService";
import { getPaymentCategoryBySlug, calculatePaymentBreakdown } from "../data/payments";
import { api, ApiError } from "../services/api";
import FormPageHeader, { FormAside } from "../components/forms/FormPageHeader";
import SEO from "../components/SEO";
import { buildCanonicalUrl, getPageSeo } from "../data/seo";
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
  "12 months of membership for GHS 200, with no monthly dues. Renew yearly for GHS 200.",
  "Practical sessions and builds, real projects, and national sessions and support.",
  "Choose a track: Electronics & Embedded Systems, Software Development, or CAD & Product Design.",
  "The chance to build a verified portfolio.",
  "Payment gives access. Completion credentials require attendance, assignments and verified work.",
];

const optionalTag = <span className={optionalCls}>(optional)</span>;

// What a returning visitor gets back (useSavedDraft); blank is a fresh page.
const BLANK_DRAFT = { firstName: "", lastName: "", otherNames: "", email: "", phone: "", signUp: EMPTY_SIGNUP, yearLevel: "", notes: "", step: 0 };

export default function StudentChapterPayment() {
  const { feeConfig } = useSpesoFees();
  const breakdown = calculatePaymentBreakdown(item.baseAmount, feeConfig);
  // Fields start from what this visitor typed last time, if anything.
  const draft = useSavedDraft("campus-chapter", BLANK_DRAFT);
  const start = draft.initial;
  const [firstName, setFirstName] = useState(start.firstName);
  const [lastName, setLastName] = useState(start.lastName);
  const [otherNames, setOtherNames] = useState(start.otherNames);
  const [email, setEmail] = useState(start.email);
  const [phone, setPhone] = useState(start.phone);
  const [signUp, setSignUp] = useState(() => ({ ...EMPTY_SIGNUP, ...start.signUp }));
  const [yearLevel, setYearLevel] = useState(start.yearLevel);
  const [notes, setNotes] = useState(start.notes);
  const [step, setStep] = useState(Number(start.step) || 0);
  useKeepDraft(draft.key, { firstName, lastName, otherNames, email, phone, signUp, yearLevel, notes, step }, BLANK_DRAFT);
  const startAgain = () => {
    setFirstName(""); setLastName(""); setOtherNames(""); setEmail(""); setPhone("");
    setSignUp(EMPTY_SIGNUP); setYearLevel(""); setNotes(""); setStep(0);
  };
  const checkout = useSignUpCheckout({ draftKey: draft.key });
  const self = !signUp.who || signUp.who === "learner";
  // Sign-up opens only at schools where a chapter is established; until one
  // is, and for anyone whose school is not listed, the page asks for a chapter
  // instead, in place of the form (no leaving the page).
  const [established, setEstablished] = useState(null);
  const [requesting, setRequesting] = useState(false);
  useEffect(() => {
    let live = true;
    findChapterSchools("")
      .then((result) => { if (live) setEstablished(result.established); })
      .catch(() => { if (live) setEstablished(-1); }); // unknown: keep the sign-up
    return () => { live = false; };
  }, []);
  const askForChapter = established === 0 || requesting;
  // On a phone the benefits come first; this takes people straight to the form.
  const formRef = useRef(null);
  const goToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    formRef.current?.focus({ preventScroll: true });
  };

  function finish() {
    checkout.start({
      findProgramme: async () => {
        const programmesData = await api.get("/programmes");
        const prog = programmesData.data?.find((p) => p.category === "student_chapter");
        if (!prog) throw new ApiError("Campus Chapter sign-up isn't available right now. Please try again shortly.");
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
      intro: "Use the member's official details for their Campus Chapter membership.",
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
        return signUpProblem(signUp, { schoolRequired: true, tertiaryOnly: true });
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
          <SignUpDetails part="details" value={signUp} onChange={setSignUp} schoolRequired tertiaryOnly onSchoolNotListed={() => setRequesting(true)} fieldCls={fieldCls} labelCls={labelCls} optionalTag={optionalTag} />
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
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="signup-phone">{self ? "Phone number" : "Your phone, for updates"}</label>
              <input id="signup-phone" type="tel" autoComplete="tel" placeholder="+233 XX XXX XXXX" className={fieldCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
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
          <div>
            <label className={labelCls} htmlFor="signup-notes">Anything we should know?{optionalTag}</label>
            <textarea id="signup-notes" rows={1} placeholder="A question, or access needs" className={growingTextCls} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </>
      ),
    },
  ];
  const summary = (
    <OrderSummary
      title="Campus Chapter membership"
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
      <SEO {...getPageSeo("/payments/campus-chapter")} />
      <section className="bg-[var(--color-surface-soft)] pb-12 pt-6 md:pb-16 md:pt-8">
        <div className="container">
          <FormPageHeader
            eyebrow="Campus Chapter"
            title="Join ERA AXIS Campus Chapters."
            line="An ERA AXIS learning and innovation network on campuses. Learn by building, with 12 months of membership for GHS 200."
            share={{ url: buildCanonicalUrl("/payments/campus-chapter"), title: "Join ERA AXIS Campus Chapters" }}
          >
            <p className="mt-4 flex max-w-2xl flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[15px] text-[var(--color-text-secondary)]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                <Sparkles size={13} strokeWidth={2.2} aria-hidden="true" />
                Purple Innovators
              </span>
              Every Campus Chapter member is a Purple Innovator.
            </p>
          </FormPageHeader>
          <FormAside title="What membership includes" items={BENEFITS} Icon={Check} className="mb-4 lg:hidden" />
          <button
            type="button"
            onClick={goToForm}
            className="btn-primary mb-8 min-h-[52px] w-full justify-center text-base lg:hidden"
          >
            {askForChapter ? "Request a chapter at your school" : draft.restored ? "Continue where you left off" : "Continue to register"}
            <ArrowDown size={18} strokeWidth={2.2} aria-hidden="true" />
          </button>
          <div className="land-in-late grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div ref={formRef} tabIndex={-1} className="min-w-0 scroll-mt-24 outline-none focus-visible:outline-none">
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
              ) : askForChapter ? (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8 md:p-10">
                  <ChapterRequestForm
                    standalone={established === 0}
                    initial={{ fullName: [firstName, lastName].filter((part) => part.trim()).join(" "), email, phone }}
                    onBack={established === 0 ? null : () => setRequesting(false)}
                  />
                </div>
              ) : (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8 md:p-10">
                  <DraftNotice draft={draft} onStartAgain={startAgain} className="mb-6" />
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
            </div>

            {/* On a phone the summary waits for the last step, inside the form. */}
            <div className="hidden space-y-4 lg:sticky lg:top-28 lg:block">
              {summary}
              <FormAside title="What membership includes" items={BENEFITS} Icon={Check} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
