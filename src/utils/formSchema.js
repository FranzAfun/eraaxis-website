// Generated from server/utils/formSchema.js — do not edit.
// The server's copy is the one that decides; this is the same rules so the builder
// preview and the form itself can say the same thing before anything is sent.
// Regenerate with: npm run sync:form-schema (inside server/).

/**
 * What a form is, and what an answer to one must look like.
 *
 * One module, pure and dependency-free, in the discipline of lmsEligibility.js: no
 * database, no clock, no imports. It is the single description of the rules, run
 * by the builder's live preview, by the public form as someone types, and by the
 * API when the answers arrive. The server's run is the one that counts; the other
 * two exist so a person is told about a problem before they press the button.
 *
 * Two entry points:
 *   validateDefinition(definition)  — is this form well formed? (publish-time)
 *   validateAnswers(definition, answers) — are these answers acceptable? (submit-time)
 *
 * Two rules do most of the structural work:
 *   - A question key is generated once and never reused, so an answer stored
 *     against it stays readable even after the form has moved on.
 *   - A condition may only refer to a question that comes earlier in the form.
 *     That removes cycles, makes one forward pass enough, and means the server and
 *     the browser cannot disagree about what was on screen.
 */

const SCHEMA_VERSION = 1;

const LIMITS = Object.freeze({
  sections: 20,
  questionsPerSection: 60,
  questions: 150,
  options: 80,
  label: 200,
  help: 500,
  shortText: 240,
  longText: 5000,
  optionLabel: 160,
  files: 5,
  fileMb: 25,
});

// The fields the LMS itself reads off a submission. A question bound to one of
// these is promoted to a column when the response is saved, which is what lets a
// registration become a learner without anybody re-typing it.
const BINDINGS = Object.freeze(['full_name', 'email', 'phone', 'gender', 'school', 'location']);

const OPERATORS = Object.freeze(['equals', 'not_equals', 'in', 'not_in', 'answered', 'not_answered', 'gt', 'lt']);

const SECTION_KEY = /^s_[a-z0-9]{4,32}$/;
const QUESTION_KEY = /^q_[a-z0-9]{6,32}$/;
// Deliberately permissive, and not the last word: the address is confirmed by
// email when the form asks for that. Rejecting unusual but legal addresses costs
// more than accepting one that bounces.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9][0-9\s-]{6,19}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const problem = (code, message) => ({ code, message });
const isBlank = (value) =>
  value === undefined
  || value === null
  || (typeof value === 'string' && value.trim() === '')
  || (Array.isArray(value) && value.length === 0)
  || (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0);

const text = (value) => String(value).replace(/\r\n/g, '\n').trim();

function lengthError(value, { min, max }) {
  if (min && value.length < min) return problem('TOO_SHORT', `Please write at least ${min} characters.`);
  if (value.length > max) return problem('TOO_LONG', `Please keep this under ${max} characters.`);
  return null;
}

function optionValues(question) {
  return (question.options || []).map((option) => option.value);
}

/**
 * How each type reads an answer, and what its own settings must look like.
 * `answer` returns the value to store, or the problem to show the person.
 */
const TYPES = Object.freeze({
  short_text: {
    answer(raw, question) {
      const value = text(raw);
      const error = lengthError(value, { min: question.validation?.minLength, max: question.validation?.maxLength || LIMITS.shortText });
      return error ? { error } : { value };
    },
  },
  long_text: {
    answer(raw, question) {
      const value = text(raw);
      const error = lengthError(value, { min: question.validation?.minLength, max: question.validation?.maxLength || LIMITS.longText });
      return error ? { error } : { value };
    },
  },
  number: {
    answer(raw, question) {
      const value = Number(String(raw).trim());
      if (!Number.isFinite(value)) return { error: problem('NOT_A_NUMBER', 'Please enter a number.') };
      const { min, max, integer } = question.validation || {};
      if (integer && !Number.isInteger(value)) return { error: problem('NOT_A_WHOLE_NUMBER', 'Please enter a whole number.') };
      if (Number.isFinite(min) && value < min) return { error: problem('OUT_OF_RANGE', `Please enter ${min} or more.`) };
      if (Number.isFinite(max) && value > max) return { error: problem('OUT_OF_RANGE', `Please enter ${max} or less.`) };
      return { value };
    },
    define(question, add, path) {
      const { min, max } = question.validation || {};
      if (Number.isFinite(min) && Number.isFinite(max) && min > max) add(path, 'RANGE_BACKWARDS', 'The smallest number allowed is larger than the largest.');
    },
  },
  email: {
    answer(raw) {
      const value = text(raw);
      if (value.length > 254 || !EMAIL.test(value)) return { error: problem('NOT_AN_EMAIL', 'That does not look like an email address.') };
      return { value };
    },
  },
  phone: {
    answer(raw) {
      const value = text(raw);
      if (!PHONE.test(value)) return { error: problem('NOT_A_PHONE', 'Please enter a phone number.') };
      return { value };
    },
  },
  date: {
    answer(raw, question) {
      const value = text(raw);
      // Checked against the calendar, not just the shape: 2026-02-31 matches the
      // pattern and is not a day.
      const parsed = ISO_DATE.test(value) ? new Date(`${value}T00:00:00Z`) : null;
      if (!parsed || Number.isNaN(parsed.getTime()) || !value.startsWith(parsed.toISOString().slice(0, 10))) {
        return { error: problem('NOT_A_DATE', 'Please choose a date.') };
      }
      const { min, max } = question.validation || {};
      if (min && value < min) return { error: problem('OUT_OF_RANGE', `Please choose a date on or after ${min}.`) };
      if (max && value > max) return { error: problem('OUT_OF_RANGE', `Please choose a date on or before ${max}.`) };
      return { value };
    },
  },
  single_choice: {
    answer(raw, question) {
      const value = text(raw);
      if (!optionValues(question).includes(value)) return { error: problem('NOT_AN_OPTION', 'Please choose one of the options given.') };
      return { value };
    },
    define: defineOptions,
  },
  dropdown: {
    answer(raw, question) {
      const value = text(raw);
      if (!optionValues(question).includes(value)) return { error: problem('NOT_AN_OPTION', 'Please choose one of the options given.') };
      return { value };
    },
    define: defineOptions,
  },
  multiple_choice: {
    answer(raw, question) {
      const given = Array.isArray(raw) ? raw.map(text) : [text(raw)];
      const allowed = optionValues(question);
      if (given.some((value) => !allowed.includes(value))) return { error: problem('NOT_AN_OPTION', 'Please choose from the options given.') };
      const unique = [...new Set(given)];
      const { minSelected, maxSelected } = question.validation || {};
      if (Number.isFinite(minSelected) && unique.length < minSelected) {
        return { error: problem('TOO_FEW', `Please choose at least ${minSelected}.`) };
      }
      if (Number.isFinite(maxSelected) && unique.length > maxSelected) {
        return { error: problem('TOO_MANY', `Please choose no more than ${maxSelected}.`) };
      }
      return { value: unique };
    },
    define(question, add, path) {
      defineOptions(question, add, path);
      const { minSelected, maxSelected } = question.validation || {};
      if (Number.isFinite(minSelected) && Number.isFinite(maxSelected) && minSelected > maxSelected) {
        add(path, 'RANGE_BACKWARDS', 'The fewest choices allowed is more than the most allowed.');
      }
      if (Number.isFinite(minSelected) && minSelected > (question.options || []).length) {
        add(path, 'IMPOSSIBLE_RULE', 'This asks for more choices than there are options.');
      }
    },
  },
  linear_scale: {
    answer(raw, question) {
      const value = Number(String(raw).trim());
      const { min, max } = question.scale || {};
      if (!Number.isInteger(value) || value < min || value > max) {
        return { error: problem('OUT_OF_RANGE', `Please choose a number from ${min} to ${max}.`) };
      }
      return { value };
    },
    define(question, add, path) {
      const { min, max } = question.scale || {};
      if (!Number.isInteger(min) || !Number.isInteger(max)) return add(path, 'SCALE_INVALID', 'A scale needs a whole first and last number.');
      if (min < 0 || min > 1) add(path, 'SCALE_INVALID', 'A scale starts at 0 or 1.');
      if (max <= min || max > 10) add(path, 'SCALE_INVALID', 'A scale ends between two and ten.');
      const style = question.scale?.style;
      if (style !== undefined && !['stars', 'numbers'].includes(style)) add(path, 'SCALE_INVALID', 'A scale shows as stars or as numbers.');
      // Nobody can click "no stars", so a scale drawn as stars starts at one.
      if (style === 'stars' && min !== 1) add(path, 'SCALE_INVALID', 'A star rating starts at one star.');
    },
  },
  yes_no: {
    answer(raw) {
      if (typeof raw === 'boolean') return { value: raw };
      const value = text(raw).toLowerCase();
      if (['yes', 'true', '1'].includes(value)) return { value: true };
      if (['no', 'false', '0'].includes(value)) return { value: false };
      return { error: problem('NOT_A_CHOICE', 'Please answer yes or no.') };
    },
  },
  school: {
    answer(raw, question) {
      const allowOther = question.school?.allowOther !== false;
      const given = typeof raw === 'string' ? { other: raw } : raw || {};
      if (given.schoolId) {
        const id = text(given.schoolId);
        if (!/^[0-9a-f-]{36}$/i.test(id)) return { error: problem('NOT_A_SCHOOL', 'Please choose a school from the list.') };
        return { value: { schoolId: id } };
      }
      const other = text(given.other || '');
      if (!other) return { error: problem('NOT_A_SCHOOL', 'Please choose your school.') };
      if (!allowOther) return { error: problem('NOT_A_SCHOOL', 'Please choose a school from the list.') };
      if (other.length > LIMITS.shortText) return { error: problem('TOO_LONG', `Please keep this under ${LIMITS.shortText} characters.`) };
      // Kept verbatim. It becomes a proposal for staff, and resolving it reaches
      // back to everyone who typed the same thing.
      return { value: { other } };
    },
    define(question, add, path) {
      const registers = question.school?.registers;
      if (!Array.isArray(registers) || !registers.length) return add(path, 'SCHOOL_INVALID', 'Choose which list this question offers.');
      if (registers.some((register) => !['gtec', 'ges'].includes(register))) add(path, 'SCHOOL_INVALID', 'A school question offers the tertiary list, the senior high list, or both.');
    },
  },
  file: {
    answer(raw, question) {
      const given = Array.isArray(raw) ? raw : [raw];
      const max = question.file?.maxFiles || 1;
      if (given.length > max) return { error: problem('TOO_MANY', `Please attach no more than ${max}.`) };
      const files = [];
      for (const entry of given) {
        // The upload itself already happened and was checked there; what arrives
        // here is the reference to it.
        if (!entry || typeof entry !== 'object' || !entry.key || !entry.name) {
          return { error: problem('NOT_A_FILE', 'Please attach the file again.') };
        }
        files.push({ key: text(entry.key), name: text(entry.name).slice(0, LIMITS.shortText), size: Number(entry.size) || null, type: entry.type ? text(entry.type) : null });
      }
      return { value: files };
    },
    define(question, add, path) {
      const { maxFiles, maxSizeMb } = question.file || {};
      if (maxFiles !== undefined && (!Number.isInteger(maxFiles) || maxFiles < 1 || maxFiles > LIMITS.files)) {
        add(path, 'FILE_INVALID', `A file question takes between one and ${LIMITS.files} files.`);
      }
      if (maxSizeMb !== undefined && (!Number.isFinite(maxSizeMb) || maxSizeMb <= 0 || maxSizeMb > LIMITS.fileMb)) {
        add(path, 'FILE_INVALID', `A file can be up to ${LIMITS.fileMb}MB.`);
      }
    },
  },
});

function defineOptions(question, add, path) {
  const options = question.options;
  if (!Array.isArray(options) || options.length < 1) return add(path, 'NO_OPTIONS', 'This question needs at least one option.');
  if (options.length > LIMITS.options) return add(path, 'TOO_MANY_OPTIONS', `A question can offer up to ${LIMITS.options} options.`);
  const seen = new Set();
  options.forEach((option, index) => {
    const value = option && typeof option === 'object' ? String(option.value ?? '').trim() : '';
    const label = option && typeof option === 'object' ? String(option.label ?? '').trim() : '';
    if (!value || !label) return add(`${path}.options[${index}]`, 'OPTION_INCOMPLETE', 'An option needs both a value and a label.');
    if (label.length > LIMITS.optionLabel) add(`${path}.options[${index}]`, 'TOO_LONG', `Keep an option under ${LIMITS.optionLabel} characters.`);
    if (seen.has(value)) add(`${path}.options[${index}]`, 'OPTION_REPEATED', 'Two options share the same value, so an answer could mean either.');
    seen.add(value);
  });
}

// Which types a binding can sit on. A "school" binding on a text question would
// store a spelling where the rest of the system expects a school.
const BINDING_TYPES = Object.freeze({
  full_name: ['short_text'],
  email: ['email'],
  phone: ['phone', 'short_text'],
  gender: ['single_choice', 'dropdown'],
  school: ['school', 'short_text'],
  location: ['short_text', 'single_choice', 'dropdown'],
});

function validateCondition(condition, { path, earlier, add }) {
  if (condition === null || condition === undefined) return;
  if (typeof condition !== 'object') return add(path, 'CONDITION_INVALID', 'A rule must be a set of conditions.');

  for (const group of ['all', 'any']) {
    if (condition[group] !== undefined) {
      if (!Array.isArray(condition[group]) || !condition[group].length) return add(path, 'CONDITION_INVALID', `"${group}" needs at least one condition.`);
      condition[group].forEach((inner, index) => validateCondition(inner, { path: `${path}.${group}[${index}]`, earlier, add }));
      return;
    }
  }
  if (condition.not !== undefined) return validateCondition(condition.not, { path: `${path}.not`, earlier, add });

  const asked = earlier.get(condition.question);
  if (!asked) {
    // The forward-reference rule. A rule about a later answer cannot be decided
    // when the question is drawn, and a pair of them can wait on each other for ever.
    return add(path, 'CONDITION_FORWARD', 'A rule can only depend on a question that comes before it.');
  }
  if (!OPERATORS.includes(condition.op)) return add(path, 'CONDITION_INVALID', `Unknown rule: ${condition.op}.`);

  if (['in', 'not_in'].includes(condition.op)) {
    if (!Array.isArray(condition.value) || !condition.value.length) add(path, 'CONDITION_INVALID', 'This rule needs a list of values to compare against.');
  } else if (['answered', 'not_answered'].includes(condition.op)) {
    if (condition.value !== undefined) add(path, 'CONDITION_INVALID', 'This rule takes no value.');
  } else if (condition.value === undefined || condition.value === null) {
    add(path, 'CONDITION_INVALID', 'This rule needs a value to compare against.');
  }

  if (['gt', 'lt'].includes(condition.op) && !['number', 'linear_scale', 'date'].includes(asked.type)) {
    add(path, 'CONDITION_INVALID', 'Greater and less than only apply to numbers, scales and dates.');
  }
  // A rule comparing against an option that no longer exists is silently dead,
  // which is worse than being told at publish time.
  if (['equals', 'not_equals', 'in', 'not_in'].includes(condition.op) && ['single_choice', 'dropdown', 'multiple_choice'].includes(asked.type)) {
    const allowed = optionValues(asked);
    const wanted = Array.isArray(condition.value) ? condition.value : [condition.value];
    if (wanted.some((value) => !allowed.includes(String(value)))) {
      add(path, 'CONDITION_DEAD', 'This rule compares against an option that question does not offer.');
    }
  }
}

/** Is this form well formed? Run before a version is allowed to be published. */
function validateDefinition(definition) {
  const problems = [];
  const add = (path, code, message) => problems.push({ path, code, message });

  if (!definition || typeof definition !== 'object') {
    add('definition', 'INVALID', 'A form needs a definition.');
    return problems;
  }
  if (definition.schemaVersion !== SCHEMA_VERSION) {
    add('schemaVersion', 'UNSUPPORTED_VERSION', `This form was built for version ${definition.schemaVersion}, and this is version ${SCHEMA_VERSION}.`);
    return problems;
  }
  const sections = definition.sections;
  if (!Array.isArray(sections) || !sections.length) {
    add('sections', 'EMPTY', 'A form needs at least one section.');
    return problems;
  }
  if (sections.length > LIMITS.sections) add('sections', 'TOO_MANY', `A form can have up to ${LIMITS.sections} sections.`);

  const sectionKeys = new Set();
  const earlier = new Map();
  const bindings = new Map();
  let questionCount = 0;

  sections.forEach((section, sectionIndex) => {
    const sectionPath = `sections[${sectionIndex}]`;
    if (!section || typeof section !== 'object') return add(sectionPath, 'INVALID', 'A section must be a section.');
    if (!SECTION_KEY.test(String(section.key || ''))) add(`${sectionPath}.key`, 'KEY_INVALID', 'A section needs a generated key.');
    else if (sectionKeys.has(section.key)) add(`${sectionPath}.key`, 'KEY_REPEATED', 'Two sections share a key.');
    sectionKeys.add(section.key);

    if (section.title !== undefined && String(section.title).length > LIMITS.label) {
      add(`${sectionPath}.title`, 'TOO_LONG', `Keep a section title under ${LIMITS.label} characters.`);
    }
    // A section is a page of the form: a title and a line or two saying what it is
    // about, never a second introduction.
    if (section.description !== undefined && String(section.description).length > LIMITS.help) {
      add(`${sectionPath}.description`, 'TOO_LONG', `Keep a section description under ${LIMITS.help} characters.`);
    }
    validateCondition(section.visibleWhen, { path: `${sectionPath}.visibleWhen`, earlier, add });

    const questions = section.questions;
    if (!Array.isArray(questions) || !questions.length) return add(`${sectionPath}.questions`, 'EMPTY', 'A section needs at least one question.');
    if (questions.length > LIMITS.questionsPerSection) add(`${sectionPath}.questions`, 'TOO_MANY', `A section can hold up to ${LIMITS.questionsPerSection} questions.`);

    questions.forEach((question, questionIndex) => {
      const path = `${sectionPath}.questions[${questionIndex}]`;
      questionCount += 1;
      if (!question || typeof question !== 'object') return add(path, 'INVALID', 'A question must be a question.');
      if (!QUESTION_KEY.test(String(question.key || ''))) add(`${path}.key`, 'KEY_INVALID', 'A question needs a generated key.');
      else if (earlier.has(question.key)) add(`${path}.key`, 'KEY_REPEATED', 'Two questions share a key, so an answer could belong to either.');

      const label = String(question.label ?? '').trim();
      if (!label) add(`${path}.label`, 'LABEL_MISSING', 'A question needs something to ask.');
      else if (label.length > LIMITS.label) add(`${path}.label`, 'TOO_LONG', `Keep a question under ${LIMITS.label} characters.`);
      if (question.help !== undefined && String(question.help).length > LIMITS.help) {
        add(`${path}.help`, 'TOO_LONG', `Keep the help text under ${LIMITS.help} characters.`);
      }

      const type = TYPES[question.type];
      if (!type) add(`${path}.type`, 'TYPE_UNKNOWN', `Unknown question type: ${question.type}.`);
      else if (type.define) type.define(question, add, path);

      if (question.binding !== undefined && question.binding !== null) {
        if (!BINDINGS.includes(question.binding)) add(`${path}.binding`, 'BINDING_UNKNOWN', `Unknown field: ${question.binding}.`);
        else if (bindings.has(question.binding)) add(`${path}.binding`, 'BINDING_REPEATED', `Two questions both claim to be the ${question.binding.replace('_', ' ')}.`);
        else if (question.type && !BINDING_TYPES[question.binding].includes(question.type)) {
          add(`${path}.binding`, 'BINDING_TYPE', `A ${question.binding.replace('_', ' ')} cannot be collected by a ${question.type.replace('_', ' ')} question.`);
        }
        bindings.set(question.binding, question.key);
      }

      validateCondition(question.visibleWhen, { path: `${path}.visibleWhen`, earlier, add });
      // Added after its own rules are checked, so a question cannot depend on itself.
      if (question.key) earlier.set(question.key, question);
    });
  });

  if (questionCount > LIMITS.questions) add('sections', 'TOO_MANY', `A form can hold up to ${LIMITS.questions} questions.`);
  return problems;
}

function answered(value) {
  return !isBlank(value);
}

function compare(answer, op, wanted) {
  if (op === 'answered') return answered(answer);
  if (op === 'not_answered') return !answered(answer);
  if (!answered(answer)) return op === 'not_equals' || op === 'not_in';

  const list = Array.isArray(wanted) ? wanted.map(String) : [String(wanted)];
  // A multiple-choice answer is a set, so "equals" means "picked that one", which
  // is what anybody building the rule means by it.
  const given = Array.isArray(answer) ? answer.map(String) : [String(answer)];
  const overlaps = given.some((value) => list.includes(value));

  switch (op) {
    case 'equals': return overlaps;
    case 'not_equals': return !overlaps;
    case 'in': return overlaps;
    case 'not_in': return !overlaps;
    case 'gt': return Number(answer) > Number(wanted);
    case 'lt': return Number(answer) < Number(wanted);
    default: return false;
  }
}

function evaluate(condition, values) {
  if (condition === null || condition === undefined) return true;
  if (Array.isArray(condition.all)) return condition.all.every((inner) => evaluate(inner, values));
  if (Array.isArray(condition.any)) return condition.any.some((inner) => evaluate(inner, values));
  if (condition.not !== undefined) return !evaluate(condition.not, values);
  return compare(values[condition.question], condition.op, condition.value);
}

/**
 * Read a set of answers against a definition.
 *
 * Questions are walked in the order they appear, so a rule can be decided from
 * what came before it. A question the rules hide is cleared rather than kept: its
 * required flag never fires, and its answer is not stored, because an answer to a
 * question somebody never saw is not an answer.
 */
function validateAnswers(definition, answers = {}) {
  const values = {};
  const errors = [];
  const hidden = [];
  const given = answers && typeof answers === 'object' ? answers : {};

  for (const section of definition.sections || []) {
    const sectionShown = evaluate(section.visibleWhen, values);
    for (const question of section.questions || []) {
      const shown = sectionShown && evaluate(question.visibleWhen, values);
      if (!shown) {
        hidden.push(question.key);
        continue;
      }

      const raw = given[question.key];
      if (isBlank(raw)) {
        if (question.required) errors.push({ questionKey: question.key, ...problem('REQUIRED', 'Please answer this.') });
        continue;
      }

      const type = TYPES[question.type];
      if (!type) {
        errors.push({ questionKey: question.key, ...problem('TYPE_UNKNOWN', 'This question cannot be answered. Please tell us.') });
        continue;
      }
      const result = type.answer(raw, question);
      if (result.error) errors.push({ questionKey: question.key, ...result.error });
      else values[question.key] = result.value;
    }
  }

  return { values, errors, hidden };
}

/** The fields the LMS reads, pulled out of a validated set of answers. */
function boundValues(definition, values) {
  const bound = {};
  for (const section of definition.sections || []) {
    for (const question of section.questions || []) {
      if (question.binding && values[question.key] !== undefined) bound[question.binding] = values[question.key];
    }
  }
  return bound;
}

// Keys identify a question inside its own form and are not secrets; they exist so
// that an answer stored years ago still knows what it was answering.
function newKey(prefix = 'q') {
  let key = '';
  while (key.length < 10) key += Math.random().toString(36).slice(2);
  return `${prefix}_${key.replace(/[^a-z0-9]/g, '').slice(0, 10)}`;
}

// Every export is a plain name, so the browser copy of this file is a mechanical
// rewrite of the line below and nothing else.
const QUESTION_TYPES = Object.freeze(Object.keys(TYPES));

export const RULES_SHA = '38a592848d79bd058fc9a832b529c82ca158fdfd91f6425f63bc7fb8010a40bd';

export {
  SCHEMA_VERSION,
  LIMITS,
  BINDINGS,
  OPERATORS,
  QUESTION_TYPES,
  validateDefinition,
  validateAnswers,
  boundValues,
  evaluate,
  newKey,
};
