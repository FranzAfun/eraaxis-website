import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MailCheck } from "lucide-react";
import SchoolPicker from "./SchoolPicker";
import { PillChoice } from "./ChoiceCards";
import { fieldCls, growingTextCls, labelCls, optionalCls } from "./signUpStyles";
import ConsentCheck from "../ui/ConsentCheck";
import BusyLabel from "../ui/BusyLabel";
import { requestCampusChapter, searchTertiarySchools } from "../../services/formsService";
import { EMAIL_RE } from "../../utils/validateEmail";

/**
 * "Bring a chapter to my school": shown in place of the Campus Chapter sign-up,
 * on the same page, when someone's school has no chapter yet (or when none is
 * open anywhere). It lands in EDOS, Website > Campus Chapters, and the people
 * who look after chapters are told. What they already typed in the sign-up
 * (`initial`: name, email, phone) is carried over.
 */

const ROLES = { Student: "student", Lecturer: "lecturer", Staff: "staff" };
const optionalTag = <span className={optionalCls}>(optional)</span>;

export default function ChapterRequestForm({ initial = {}, onBack = null, standalone = false }) {
  const [school, setSchool] = useState(null);
  const [fullName, setFullName] = useState(initial.fullName || "");
  const [email, setEmail] = useState(initial.email || "");
  const [phone, setPhone] = useState(initial.phone || "");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(null);
  const heading = useRef(null);
  const top = useRef(null);

  // Arriving from the sign-up, the keyboard and screen reader move here with them.
  useEffect(() => {
    if (standalone) return;
    heading.current?.focus({ preventScroll: true });
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [standalone]);

  useEffect(() => {
    if (sent) heading.current?.focus({ preventScroll: true });
  }, [sent]);

  const schoolName = (school?.name || school?.other || "").trim();

  function problem() {
    if (!schoolName) return "Please choose or type your school.";
    if (!fullName.trim()) return "Please give your name.";
    if (!EMAIL_RE.test(email.trim())) return "Please give a valid email address.";
    if (!role) return "Please say whether you are a student, lecturer or staff.";
    return "";
  }

  async function submit(event) {
    event.preventDefault();
    const issue = problem();
    if (issue) { setError(issue); return; }
    setBusy(true);
    setError("");
    try {
      await requestCampusChapter({
        ...(school?.schoolId ? { school_id: school.schoolId } : { school_other: schoolName }),
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        role: ROLES[role],
        message: message.trim() || undefined,
        consent: agreed,
      });
      setSent({ school: schoolName, email: email.trim() });
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const titleCls = "text-2xl font-black tracking-tight text-[var(--color-text-primary)] outline-none sm:text-3xl";

  if (sent) {
    return (
      <div className="space-y-4" aria-live="polite">
        <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white">
          <MailCheck size={22} strokeWidth={2} />
        </span>
        <h2 ref={heading} tabIndex={-1} className={titleCls}>Request received.</h2>
        <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
          Thank you. We have your request for a Campus Chapter at <span className="font-semibold text-[var(--color-text-primary)]">{sent.school}</span>.
          The ERA AXIS team will be in touch at <span className="font-semibold text-[var(--color-text-primary)]">{sent.email}</span>.
        </p>
        {onBack && (
          <button type="button" onClick={onBack} className="btn-outline min-h-[44px] text-sm">
            <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
            Back to the sign-up
          </button>
        )}
      </div>
    );
  }

  return (
    <form ref={top} noValidate onSubmit={submit} className="scroll-mt-28 space-y-5">
      {/* Pressed "My school is not listed" by mistake? One tap back, with
          everything typed in the sign-up still there. */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="-mt-1 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          <ArrowLeft size={15} strokeWidth={2.2} aria-hidden="true" />
          Back to the sign-up: my school is listed
        </button>
      )}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">Request a chapter</p>
        <h2 ref={heading} tabIndex={-1} className={`scroll-mt-28 ${titleCls}`}>Bring a chapter to your school.</h2>
        <p className="mt-2 text-base leading-relaxed text-[var(--color-text-secondary)]">
          {standalone
            ? "Campus Chapter sign-up opens at each university or college once its chapter is established. Tell us where you are and we will be in touch."
            : "There is no Campus Chapter at your school yet. Tell us where you are and we will be in touch."}
        </p>
      </div>

      <div>
        <label className={labelCls} htmlFor="q-chapter-request-school">Your university or college</label>
        <SchoolPicker
          question={{ key: "chapter-request-school", school: { allowOther: true } }}
          searchSchools={searchTertiarySchools}
          unlistedLevel="tertiary"
          placeholder="Choose your school"
          value={school}
          onChange={(value) => { setSchool(value); setError(""); }}
          fieldClass={fieldCls}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="chapter-request-name">Your name</label>
        <input id="chapter-request-name" className={fieldCls} maxLength={160} autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="chapter-request-email">Email</label>
          <input id="chapter-request-email" type="email" className={fieldCls} maxLength={255} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="chapter-request-phone">Phone {optionalTag}</label>
          <input id="chapter-request-phone" type="tel" className={fieldCls} maxLength={40} autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <PillChoice name="chapter-request-role" legend="You are a" legendCls={labelCls} options={Object.keys(ROLES)} value={role} onChange={setRole} />

      <div>
        <label className={labelCls} htmlFor="chapter-request-message">Why your school? {optionalTag}</label>
        <textarea
          id="chapter-request-message"
          className={growingTextCls}
          maxLength={1000}
          rows={2}
          placeholder="For example, how many students are interested."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div>
        <ConsentCheck checked={agreed} onChange={setAgreed} className="mb-3" />
        {error && <p role="alert" className="mb-3 text-sm text-[var(--color-field-danger)]">{error}</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={busy || !agreed}
            className={`btn-primary min-h-[44px] justify-center sm:px-8 disabled:cursor-not-allowed disabled:opacity-100${agreed ? "" : " needs-consent"}`}
          >
            {busy ? <BusyLabel>Sending…</BusyLabel> : "Send request"}
            {!busy && <ArrowRight size={16} aria-hidden="true" />}
          </button>
          {onBack && (
            <button type="button" onClick={onBack} className="min-h-[44px] w-fit text-sm font-medium text-[var(--color-text-secondary)] underline decoration-[var(--color-border)] underline-offset-4 hover:text-[var(--color-primary)]">
              Back to the sign-up
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
