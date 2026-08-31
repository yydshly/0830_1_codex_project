import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  cssDegrees,
  curveGeometry,
  normalizeStripCount,
  progressFromDrag,
  qualityForBudget,
  segmentTangents,
  shouldCommit
} from "../showcase/page-turn-model.mjs";

const projectRoot = new URL("../", import.meta.url);

test("curve is flat at both settled endpoints", () => {
  const start = curveGeometry(0, 18);
  const end = curveGeometry(1, 18);

  assert.equal(start.beta, 0);
  assert.equal(start.rootAngle, 0);
  assert.equal(start.segmentAngle, 0);
  assert.ok(Math.abs(end.beta) < 1e-12);
  assert.ok(Math.abs(end.rootAngle - Math.PI) < 1e-12);
  assert.ok(Math.abs(end.segmentAngle) < 1e-12);
});

test("browser transform angles use the CSS deg unit rather than a display glyph", () => {
  assert.equal(cssDegrees(Math.PI), "180.000deg");
  assert.equal(cssDegrees(-Math.PI / 2, 1), "-90.0deg");
});

test("mid-turn distributes the full bend across the strip chain", () => {
  const geometry = curveGeometry(0.5, 18);
  assert.ok(Math.abs(geometry.beta - 0.6) < 1e-12);
  assert.ok(Math.abs(geometry.segmentAngle - 1.2 / 18) < 1e-12);

  const tangents = segmentTangents(0.5, 18);
  assert.equal(tangents.length, 18);
  assert.ok(tangents[0] > tangents.at(-1));
});

test("strip count accepts only the exposed quality presets", () => {
  assert.equal(normalizeStripCount(8), 8);
  assert.equal(normalizeStripCount("24"), 24);
  assert.equal(normalizeStripCount(19), 18);
});

test("adaptive quality budget selects deterministic rendering tiers", () => {
  assert.deepEqual(qualityForBudget(30), { hz: 30, strips: 8, tier: "省电档", lighting: false });
  assert.equal(qualityForBudget(60).strips, 12);
  assert.equal(qualityForBudget(90).strips, 18);
  assert.equal(qualityForBudget(120).strips, 24);
  assert.equal(qualityForBudget(500).hz, 120);
});

test("drag direction maps leftward next and rightward previous to progress", () => {
  assert.equal(progressFromDrag(-310, 1000, "next"), 0.5);
  assert.equal(progressFromDrag(310, 1000, "prev"), 0.5);
  assert.equal(progressFromDrag(50, 1000, "next"), 0);
  assert.equal(progressFromDrag(-1000, 1000, "next"), 1);
});

test("release commits by progress or forward velocity, otherwise cancels", () => {
  assert.equal(shouldCommit(0.43, 0), true);
  assert.equal(shouldCommit(0.2, 1.11), true);
  assert.equal(shouldCommit(0.42, 1.1), false);
  assert.equal(shouldCommit(0.2, -3), false);
});

test("showcase exposes every research surface and no upstream media path", async () => {
  const html = await readFile(new URL("../showcase/index.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../showcase/app.mjs", import.meta.url), "utf8");

  for (const id of ["lab", "capabilities", "mechanism", "scenarios", "extensions", "meaning", "evidence"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }

  assert.match(html, /data-mode="rigid"/);
  assert.match(html, /data-mode="curved"/);
  assert.match(html, /id="strip-count"/);
  assert.match(html, /id="magnifier-toggle"/);
  assert.match(html, /id="auto-demo"/);
  assert.match(html, /id="zoom-readout"/);
  assert.equal((html.match(/role="tab"[^>]+data-scene="(?:portfolio|atlas|launch|kiosk)"/g) || []).length, 4);
  assert.equal((html.match(/<button[^>]+data-adapter="(?:illustration|editorial|product|data)"/g) || []).length, 4);
  for (const id of ["scene-book", "scene-action", "budget-slider", "corner-grip", "adapter-preview"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.doesNotMatch(`${html}\n${script}`, /sketchbook\/(?:.*\.(?:png|jpg|woff2))/i);
});

test("scenario and extension demonstrations are implemented as independent modules", async () => {
  const scenarios = await readFile(new URL("../showcase/scenario-demos.mjs", import.meta.url), "utf8");
  const extensions = await readFile(new URL("../showcase/extension-demos.mjs", import.meta.url), "utf8");

  for (const name of ["portfolio", "atlas", "launch", "kiosk"]) assert.match(scenarios, new RegExp(`${name}:`));
  assert.match(scenarios, /curveGeometry/);
  assert.match(scenarios, /scene-turn-curved/);
  assert.match(extensions, /qualityForBudget/);
  assert.match(extensions, /pointerdown/);
  assert.match(extensions, /dataAdapter|dataset\.adapter/);
});

test("dedicated demo route keeps the book as the operating surface", async () => {
  const html = await readFile(new URL("../demo/index.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../demo/app.mjs", import.meta.url), "utf8");

  for (const id of ["book", "loupe", "auto-play", "quality-range", "softness-range", "light-range", "corner-toggle", "corner-grip"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.equal((html.match(/class="deck-panel/g) || []).length, 5);
  assert.equal((html.match(/<button[^>]+data-scene="(?:portfolio|atlas|launch|kiosk)"/g) || []).length, 4);
  assert.match(html, /href="\.\.\/showcase\/"/);
  assert.doesNotMatch(html, /metric-progress|comparison-table|research-grid/);
  assert.match(script, /createCurvedLeaf/);
  assert.match(script, /createCornerPage/);
  assert.match(script, /startIntroPreview/);
});

test("demo extensions mutate the same live rendering model", async () => {
  const script = await readFile(new URL("../demo/app.mjs", import.meta.url), "utf8");

  assert.match(script, /state\.strips = Math\.round/);
  assert.match(script, /state\.peakCurl =/);
  assert.match(script, /state\.light =/);
  assert.match(script, /--corner-x/);
  assert.match(script, /state\.turn\.strips\.forEach/);
});

test("Revision 4 exposes eight selectable scenes and four live effect behaviors", async () => {
  const html = await readFile(new URL("../demo/index.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../demo/app.mjs", import.meta.url), "utf8");

  const baseScenes = ["portfolio", "atlas", "launch", "kiosk"];
  const extendedScenes = ["travel", "recipe", "comic", "catalog"];
  const sceneButtons = html.match(/<button[^>]+data-scene="[^"]+"/g) || [];

  assert.equal(sceneButtons.length, 8);
  for (const name of [...baseScenes, ...extendedScenes]) {
    assert.match(html, new RegExp(`data-scene=["']${name}["']`));
    assert.match(script, new RegExp(`\\b${name}:\\s*\\{`));
  }

  assert.match(html, /id="extended-scenes-label"/);
  assert.match(script, /function createSceneEffect\(\)/);
  assert.match(script, /effect\.id = ['"]scene-effect-layer['"]/);
  assert.match(script, /effect\.dataset\.effect = selected\.behavior/);

  const behaviorMap = {
    travel: "route",
    recipe: "steps",
    comic: "focus",
    catalog: "palette"
  };
  for (const [sceneName, behavior] of Object.entries(behaviorMap)) {
    const sceneStart = script.indexOf(`${sceneName}: {`);
    const sceneEnd = script.indexOf("\n  },", sceneStart);
    const sceneDefinition = script.slice(sceneStart, sceneEnd);
    assert.match(sceneDefinition, new RegExp(`behavior:\\s*['"]${behavior}['"]`));
    assert.match(script, new RegExp(`\\n  ${behavior}\\(\\) \\{`));
  }
});

test("Revision 4 scene actions update the same book and palette-driven artwork", async () => {
  const script = await readFile(new URL("../demo/app.mjs", import.meta.url), "utf8");

  assert.match(script, /const SCENE_ACTIONS = \{/);
  assert.match(script, /state\.sceneAction =/);
  assert.match(script, /state\.effectStep =/);
  assert.match(script, /function sceneAccent\(\)/);
  assert.match(script, /variants:\s*\[[^\]]+\]/);
  assert.match(script, /selected\.variants\[state\.effectStep % selected\.variants\.length\]/);

  const actionsStart = script.indexOf("const SCENE_ACTIONS = {");
  const actionsEnd = script.indexOf("function toggleSceneAction", actionsStart);
  const sceneActions = script.slice(actionsStart, actionsEnd);
  for (const behavior of ["route", "steps", "focus", "palette"]) {
    const actionStart = sceneActions.indexOf(`  ${behavior}() {`);
    assert.notEqual(actionStart, -1);
    const nextAction = sceneActions.indexOf("\n  },", actionStart);
    const actionBody = sceneActions.slice(actionStart, nextAction);
    assert.match(actionBody, /state\.(?:sceneAction|effectStep)/);
    assert.match(actionBody, /render\(\);/);
  }

  assert.match(script, /const sceneEffect = createSceneEffect\(\)/);
  assert.match(script, /refs\.book\.append\(sceneEffect\)/);
});

test("R-001 public metadata links the fixed source, GitHub directory, and online surfaces", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
  const index = await readFile(new URL("../index.md", import.meta.url), "utf8");
  const demo = await readFile(new URL("../demo/index.html", import.meta.url), "utf8");
  const showcase = await readFile(new URL("../showcase/index.html", import.meta.url), "utf8");
  const rootReadme = await readFile(new URL("../../../README.md", import.meta.url), "utf8");

  for (const content of [readme, index, demo, showcase, rootReadme]) assert.match(content, /R-001/);
  assert.match(readme, /MengTo\/sketchbook\/tree\/c1e477814c4c9e204452ebf9b298aa13629cbfc2/);
  assert.match(readme, /github\.com\/yydshly\/0830_1_codex_project\/tree\/main\/projects\/sketchbook-page-curl-study/);
  for (const suffix of ["/sketchbook-page-curl-study/", "/sketchbook-page-curl-study/demo/", "/sketchbook-page-curl-study/showcase/"]) {
    assert.match(readme, new RegExp(`yydshly\\.github\\.io/0830_1_codex_project/projects${suffix}`));
    assert.match(rootReadme, new RegExp(`yydshly\\.github\\.io/0830_1_codex_project/projects${suffix}`));
  }
});

test("upstream fetch script pins the reviewed commit", async () => {
  const fetchScript = await readFile(new URL("../scripts/fetch-upstream.ps1", import.meta.url), "utf8");
  assert.match(fetchScript, /c1e477814c4c9e204452ebf9b298aa13629cbfc2/);
  assert.match(fetchScript, /checkout --detach/);
});
