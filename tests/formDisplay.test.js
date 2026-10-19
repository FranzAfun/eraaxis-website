import { test } from "node:test";
import assert from "node:assert/strict";
import { keepOffered } from "../src/components/forms/formDisplay.js";

test("answers brought back leave out a course that has closed since", () => {
  const questions = [
    { key: "course", options: [{ value: "c-open", label: "CAD" }] },
    { key: "days", options: [{ value: "mon", label: "Monday" }, { value: "tue", label: "Tuesday" }] },
    { key: "name" },
  ];
  assert.deepEqual(
    keepOffered({ course: "c-closed", days: ["mon", "sun"], name: "Genny Amadapah" }, questions),
    { days: ["mon"], name: "Genny Amadapah" },
  );
  assert.deepEqual(keepOffered({ course: "c-open" }, questions), { course: "c-open" });
  assert.deepEqual(keepOffered(null, questions), {});
});
