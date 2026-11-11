import { test } from "node:test";
import assert from "node:assert/strict";
import { REACH_FALLBACK, reachFigure } from "../src/data/reach.js";

// The hero and the impact section read the same figure (EDOS, Website > Settings).
test("reach figures come from the settings, with the old numbers only as a fallback", () => {
  assert.equal(reachFigure({ students: 4500 }, "students"), 4500);
  assert.equal(reachFigure({ students: 0 }, "students"), REACH_FALLBACK.students);
  assert.equal(reachFigure(null, "partners"), 13);
});
