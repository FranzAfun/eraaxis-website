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
  { value: "learner", title: "I'm the learner", hint: "Signing myself up" },
  { value: "guardian", title: "I'm a parent or guardian", hint: "Signing up my child or ward" },
  { value: "organisation", title: "An organisation", hint: "A school, NGO or sponsor signing up one learner" },
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
      {part !== "details" && <fieldset>
        <legend className={labelCls}>Who is signing up?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {WHO.map((option) => {
            const chosen = value.who === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer flex-col rounded-[var(--radius-sm)] border-2 px-3.5 py-3 text-sm transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-primary)] has-[:focus-visible]:ring-offset-2 ${
                  chosen
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25"
                    : "border-[var(--color-border)] bg-white hover:-translate-y-0.5 hover:border-[var(--color-primary)]"
                }`}
              >
                <span className={`flex items-center gap-2 font-semibold ${chosen ? "text-white" : "text-[var(--color-text-primary)]"}`}>
                  <input
                    type="radio"
                    name="signed-up-by"
                    className="sr-only"
                    checked={chosen}
                    onChange={() => set({ who: option.value })}
                  />
                  <span
                    aria-hidden="true"
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${chosen ? "border-white" : "border-[var(--color-border)]"}`}
                  >
                    {chosen && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  {option.title}
                </span>
                <span className={`mt-0.5 pl-6 text-xs ${chosen ? "text-white/85" : "text-[var(--color-text-secondary)]"}`}>{option.hint}</span>
              </label>
            );
          })}
        </div>
      </fieldset>}

      {part !== "who" && value.who && (
        <div>
          <label className={labelCls} htmlFor="q-signup-school">
            {value.who === "learner" ? "Your school" : "Learner's school"} {schoolRequired ? null : optionalTag}
          </label>
          <SchoolPicker
            question={{ key: "signup-school", school: { allowOther: true } }}
            searchSchools={searchSignupSchools}
            askLevel
            value={value.school}
            onChange={(school) => set({ school })}
            fieldClass={fieldCls}
          />
          {!schoolRequired && !value.school && (
            <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">Leave this empty if the learner is not in school.</p>
          )}
        </div>
      )}

      {part !== "who" && value.who === "organisation" && (
        <div className="space-y-4 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">The organisation</p>
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
          <p className="text-xs text-[var(--color-text-muted)]">Signing up several learners? Request a group quote from the Enrolment &amp; Dues page instead.</p>
        </div>
      )}

      {part !== "who" && value.who && !guardianRequired && (
        <label className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]" checked={value.addGuardian} onChange={(e) => set({ addGuardian: e.target.checked })} />
          <span>Add a parent or guardian {optionalTag}</span>
        </label>
      )}

      {part !== "who" && value.who && showGuardian && (
        <div className="space-y-4 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {parentSigning ? "Your details, as their parent or guardian" : value.who === "learner" ? "Your parent or guardian" : "The learner's parent or guardian"}
          </p>
          {guardianRequired && !parentSigning && (
            <p className="text-xs text-[var(--color-text-secondary)]">Needed for learners at a basic or senior high school.</p>
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
          <label className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]" checked={value.guardian.consent} onChange={(e) => setGuardian({ consent: e.target.checked })} />
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
