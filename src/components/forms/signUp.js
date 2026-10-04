/**
 * The rules behind the programme and Student Chapter sign-up details (see
 * SignUpDetails.jsx): what an empty answer is, when a parent or guardian has
 * to agree, what is missing, and what is sent. The server applies the same
 * rules (server/controllers/websiteEnrolmentsController.js, readSigner).
 */

export const EMPTY_SIGNUP = {
  who: "",
  school: null,
  addGuardian: false,
  guardian: { name: "", phone: "", relationship: "", consent: false },
  organisation: { name: "", contact: "", phone: "" },
};

const GUARDIAN_LEVELS = ["basic", "junior_high", "senior_high"];

export function needsGuardian(value) {
  return value.who === "guardian" || GUARDIAN_LEVELS.includes(value.school?.level);
}

/** The learner's details are about someone else unless they are signing up themselves. */
export function learnerLabel(value, label) {
  return value.who && value.who !== "learner" ? `Learner's ${label.charAt(0).toLowerCase()}${label.slice(1)}` : label;
}

/** The first thing to put right, or "" when the section is complete. */
export function signUpProblem(value, { schoolRequired = false } = {}) {
  if (!value.who) return "Please say who is signing up.";
  if (schoolRequired && !value.school) return value.who === "learner" ? "Please choose your school." : "Please choose the learner's school.";
  if (value.school?.other !== undefined && !value.school.other.trim()) return "Please type the school's name, or choose it from the list.";
  if (value.school?.other !== undefined && !value.school.level) return "Please say what kind of school it is.";
  if (value.who === "organisation") {
    const o = value.organisation;
    if (!o.name.trim() || !o.contact.trim() || !o.phone.trim()) return "Please give the organisation's name, a contact person and their phone number.";
  }
  if (needsGuardian(value) || value.addGuardian) {
    const g = value.guardian;
    if (!g.name.trim() || !g.phone.trim() || !g.relationship.trim()) return "Please give the parent or guardian's name, phone number and how they are related to the learner.";
    if (!g.consent) return "A parent or guardian needs to agree to the learner taking part.";
  }
  return "";
}

/** What the sign-up sends, in the server's words. */
export function signUpPayload(value) {
  const guardian = needsGuardian(value) || value.addGuardian ? value.guardian : null;
  return {
    signed_up_by: value.who,
    school_id: value.school?.schoolId || undefined,
    school_other: value.school?.other?.trim() || undefined,
    school_level: value.school?.other !== undefined ? value.school.level : undefined,
    guardian_name: guardian?.name.trim() || undefined,
    guardian_phone: guardian?.phone.trim() || undefined,
    guardian_relationship: guardian?.relationship.trim() || undefined,
    guardian_consent: guardian ? guardian.consent === true : undefined,
    organisation_name: value.who === "organisation" ? value.organisation.name.trim() : undefined,
    organisation_contact: value.who === "organisation" ? value.organisation.contact.trim() : undefined,
    organisation_phone: value.who === "organisation" ? value.organisation.phone.trim() : undefined,
    // Kept for the staff view, in the words it used before.
    learner_type: { learner: "Learner", guardian: "Parent/guardian paying", organisation: "Sponsor paying for learner" }[value.who],
  };
}

