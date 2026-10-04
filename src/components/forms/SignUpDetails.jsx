import { Building2, HeartHandshake, UserRound } from "lucide-react";
import ChoiceCards from "./ChoiceCards";
import SchoolPicker from "./SchoolPicker";
import { searchSignupSchools } from "../../services/formsService";
import { needsGuardian } from "./signUp";

/**
 * Who is signing up, the learner's school, and the parent or guardian or
 * organisation behind them, for the programme and Student Chapter sign-ups.
 *
 * Whether a parent or guardian has to agree is decided by who is signing up
 * and the kind of school, never by an age: a parent signing up always gives
 * their details; a learner at a basic school or senior high needs a guardian's
 * agreement; a learner at a university or college answers for themselves, at
 * 17 as at 30. The server applies the same rule.
 */

const WHO = [
  { value: "learner", title: "I'm the learner", hint: "Signing myself up", Icon: UserRound },
  { value: "guardian", title: "I'm a parent or guardian", hint: "Signing up my child or ward", Icon: HeartHandshake },
  { value: "organisation", title: "An organisation", hint: "A school, NGO or sponsor signing up one learner", Icon: Building2 },
];

/** `part`: "who" for the choice alone, "details" for the rest, or both. */
export default function SignUpDetails({ value, onChange, schoolRequired = false, fieldCls, labelCls, optionalTag, part = "all" }) {
  const set = (patch) => onChange({ ...value, ...patch });
  const setGuardian = (patch) => set({ guardian: { ...value.guardian, ...patch } });
  const setOrganisation = (patch) => set({ organisation: { ...value.organisation, ...patch } });
  const guardianRequired = needsGuardian(value);
  const showGuardian = guardianRequired || value.addGuardian;
  const parentSigning = value.who === "guardian";

  return (
    <div className="space-y-5">
      {part !== "details" && (
        <ChoiceCards
          name="signed-up-by"
          legend={part === "who" ? null : "Who is signing up?"}
          legendCls={labelCls}
          options={WHO}
          value={value.who}
          onChange={(who) => set({ who })}
        />
      )}

      {part !== "who" && value.who && (
        <div>
          <label className={labelCls} htmlFor="q-signup-school">
            {value.who === "learner" ? "Your school" : "Learner's school"} {schoolRequired ? null : optionalTag}
          </label>
          <SchoolPicker
            question={{ key: "signup-school", school: { allowOther: true } }}
            searchSchools={searchSignupSchools}
            askLevel
            placeholder={value.who === "learner" ? "Choose your school" : "Choose the learner's school"}
            value={value.school}
            onChange={(school) => set({ school })}
            fieldClass={fieldCls}
          />
          {!schoolRequired && !value.school && (
            <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">Leave this empty if the learner is not in school.</p>
          )}
        </div>
      )}

      {part !== "who" && value.who === "organisation" && (
        <div className="space-y-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/60 p-5">
          <p className="text-base font-semibold text-[var(--color-text-primary)]">The organisation</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="org-name">Organisation name</label>
              <input id="org-name" className={fieldCls} maxLength={200} value={value.organisation.name} onChange={(e) => setOrganisation({ name: e.target.value })} />
            </div>
            <div>
              <label className={labelCls} htmlFor="org-contact">Contact person</label>
              <input id="org-contact" className={fieldCls} maxLength={160} value={value.organisation.contact} onChange={(e) => setOrganisation({ contact: e.target.value })} />
            </div>
            <div>
              <label className={labelCls} htmlFor="org-phone">Contact phone</label>
              <input id="org-phone" type="tel" className={fieldCls} maxLength={40} value={value.organisation.phone} onChange={(e) => setOrganisation({ phone: e.target.value })} />
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">Signing up several learners? Request a group quote from the Enrolment &amp; Dues page instead.</p>
        </div>
      )}

      {part !== "who" && value.who && !guardianRequired && (
        <label className="flex cursor-pointer items-start gap-3 text-[15px] text-[var(--color-text-primary)]">
          <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-primary)]" checked={value.addGuardian} onChange={(e) => set({ addGuardian: e.target.checked })} />
          <span>Add a parent or guardian {optionalTag}</span>
        </label>
      )}

      {part !== "who" && value.who && showGuardian && (
        <div className="space-y-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/60 p-5">
          <p className="text-base font-semibold text-[var(--color-text-primary)]">
            {parentSigning ? "Your details, as their parent or guardian" : value.who === "learner" ? "Your parent or guardian" : "The learner's parent or guardian"}
          </p>
          {guardianRequired && !parentSigning && (
            <p className="text-sm text-[var(--color-text-secondary)]">Needed for learners at a basic or senior high school.</p>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="guardian-name">{parentSigning ? "Your full name" : "Their full name"}</label>
              <input id="guardian-name" className={fieldCls} maxLength={160} value={value.guardian.name} onChange={(e) => setGuardian({ name: e.target.value })} />
            </div>
            <div>
              <label className={labelCls} htmlFor="guardian-phone">{parentSigning ? "Your phone number" : "Their phone number"}</label>
              <input id="guardian-phone" type="tel" className={fieldCls} maxLength={40} value={value.guardian.phone} onChange={(e) => setGuardian({ phone: e.target.value })} />
            </div>
            <div>
              <label className={labelCls} htmlFor="guardian-relationship">
                {parentSigning ? "How you are related to the learner" : value.who === "learner" ? "How they are related to you" : "How they are related to the learner"}
              </label>
              <input id="guardian-relationship" className={fieldCls} maxLength={60} placeholder="For example mother, uncle, guardian" value={value.guardian.relationship} onChange={(e) => setGuardian({ relationship: e.target.value })} />
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-[15px] text-[var(--color-text-primary)]">
            <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-primary)]" checked={value.guardian.consent} onChange={(e) => setGuardian({ consent: e.target.checked })} />
            <span>
              {parentSigning
                ? "I am the learner's parent or guardian, and I agree to them taking part."
                : value.who === "learner"
                  ? "My parent or guardian knows about this and agrees to me taking part."
                  : "The learner's parent or guardian has agreed to them taking part."}
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
