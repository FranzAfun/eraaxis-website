import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signUpProblem, signUpPayload } from '../src/components/forms/signUp.js';

test('chapter sign-ups require a tertiary school, including unlisted schools; programmes keep every level', () => {
  const school = { schoolId: 'example-school', name: 'Example', level: 'senior_high' };
  const value = { who: 'learner', school, guardian: { name: 'Genny', phone: '0240000000', relationship: 'Parent', consent: true } };
  assert.equal(signUpProblem(value, { schoolRequired: true }), '');
  assert.match(signUpProblem(value, { schoolRequired: true, tertiaryOnly: true }), /tertiary/);
  value.school = { ...school, level: 'tertiary' };
  assert.equal(signUpProblem(value, { schoolRequired: true, tertiaryOnly: true }), '');
  value.school = { other: 'Example tertiary institute', level: 'tertiary' };
  assert.equal(signUpProblem(value, { schoolRequired: true, tertiaryOnly: true }), '');
  assert.equal(signUpPayload(value).school_level, 'tertiary');
  assert.equal(signUpPayload(value).school_other, 'Example tertiary institute');
});
