import assert from "node:assert/strict";
import test from "node:test";
import {
  AXES,
  COMBINATIONS,
  DIRECTIONS,
  directionStats,
  getAxisById,
  getCombinationById,
  getDirectionById,
  getDirections,
  getDirectionsForForm,
  validateCreativeDirectionData
} from "../demo/creative-direction-data.mjs";

const REQUIRED_FIELDS = [
  "name",
  "englishName",
  "coreStructure",
  "primaryAction",
  "technicalMechanism",
  "largestRisk",
  "nextExperiment"
];

test("Revision 6 creative atlas contains six axes, thirty-six directions, and twelve combinations", () => {
  assert.equal(AXES.length, 6);
  assert.equal(DIRECTIONS.length, 36);
  assert.equal(COMBINATIONS.length, 12);
  const validation = validateCreativeDirectionData();
  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);

  const stats = directionStats();
  assert.deepEqual(stats.byTier, { LIVE: 8, REMIX: 15, HORIZON: 13 });
  assert.equal(stats.mappedForms, 18);
  assert.equal(new Set(DIRECTIONS.map((direction) => direction.id)).size, 36);
  assert.equal(new Set(COMBINATIONS.map((combination) => combination.id)).size, 12);
});

test("every creative direction is detailed, classified, and attached to a valid axis", () => {
  for (const direction of DIRECTIONS) {
    assert.ok(getAxisById(direction.axis), `${direction.id} has an axis`);
    assert.ok(["LIVE", "REMIX", "HORIZON"].includes(direction.tier));
    for (const field of REQUIRED_FIELDS) {
      assert.equal(typeof direction[field], "string", `${direction.id}.${field} is text`);
      const minimum = field === "name" || field === "englishName" ? 2 : 12;
      assert.ok(direction[field].length > minimum, `${direction.id}.${field} is detailed`);
    }
    assert.ok(direction.scenarios.length >= 3, `${direction.id} has scenarios`);
    assert.ok(direction.combinationSuggestion.length >= 2, `${direction.id} has combinations`);
    assert.equal(getDirectionById(direction.id), direction);
  }
});

test("axis and maturity filters are deterministic and form links cover all live prototypes", () => {
  for (const axis of AXES) assert.equal(getDirections({ axis: axis.id }).length, 6);
  assert.equal(getDirections({ tier: "LIVE" }).length, 8);
  assert.equal(getDirections({ tier: "REMIX" }).length, 15);
  assert.equal(getDirections({ tier: "HORIZON" }).length, 13);
  assert.deepEqual(getDirections({ axis: "missing" }), []);

  const mappedForms = new Set(DIRECTIONS.map((direction) => direction.form).filter(Boolean));
  assert.equal(mappedForms.size, 18);
  for (const form of mappedForms) assert.ok(getDirectionsForForm(form).length >= 1, `${form} is linked`);
});

test("combination scenarios link existing directions and explain problem, mechanism, and risk", () => {
  for (const combination of COMBINATIONS) {
    assert.equal(getCombinationById(combination.id), combination);
    assert.ok(combination.problem.length > 20);
    assert.ok(combination.mechanism.length > 20);
    assert.ok(combination.risk.length > 12);
    assert.ok(combination.directions.length >= 3);
    for (const directionId of combination.directions) assert.ok(getDirectionById(directionId));
  }
});
