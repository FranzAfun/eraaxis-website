import { test } from "node:test";
import assert from "node:assert/strict";
import { enrolmentModeOf, getProgrammePrice, openProgrammeItems } from "../src/data/payments.js";

// Partnerships' pricing requirements (Nov 2026): schools by enquiry, Out-of-School
// Youth GHS 400 a month per learner, Digital Skills coming soon, Online Learning gone.
// EDOS's values (the API) win; the code's are only for when it cannot be reached.

test("without the API, the agreed defaults stand", () => {
  assert.equal(enrolmentModeOf("school_stem", null), "enquiry");
  assert.equal(enrolmentModeOf("out_of_school_youth", null), "online");
  assert.equal(enrolmentModeOf("digital_skills", null), "coming_soon");
  assert.deepEqual(getProgrammePrice("school_stem", null), { amount: "Customised pricing", per: "per semester/term" });
  assert.deepEqual(getProgrammePrice("out_of_school_youth", null), { amount: "GHS 400", per: "a month, per learner" });
  assert.deepEqual(getProgrammePrice("digital_skills", null), { badge: "Coming soon" });
  assert.equal(getProgrammePrice("online_learning", null), null);
});

test("EDOS's price and how-to-join replace the code's, from either API shape", () => {
  assert.deepEqual(getProgrammePrice("out_of_school_youth", { price: "450.00", enrolmentMode: "online" }), { amount: "GHS 450", per: "a month, per learner" });
  assert.deepEqual(getProgrammePrice("digital_skills", { price: "700.00", enrolment_mode: "online" }), { amount: "GHS 700", per: "a month, per learner" });
  assert.deepEqual(getProgrammePrice("out_of_school_youth", { price: "400.00", enrolmentMode: "coming_soon" }), { badge: "Coming soon" });
});

test("only programmes open online can be signed up for, at EDOS's price", () => {
  assert.deepEqual(openProgrammeItems(null).map((item) => [item.slug, item.monthlyAmount]), [["out-of-school-youth", 400]]);
  const catalogue = [
    { slug: "school-stem", category: "school_stem", price: "200.00", enrolmentMode: "enquiry" },
    { slug: "out-of-school-youth", category: "out_of_school_youth", price: "420.00", enrolmentMode: "online" },
    { slug: "era-digital-skills", category: "digital_skills", price: "700.00", enrolmentMode: "online" },
  ];
  assert.deepEqual(openProgrammeItems(catalogue).map((item) => [item.slug, item.monthlyAmount]), [["out-of-school-youth", 420], ["era-digital-skills", 700]]);
});
