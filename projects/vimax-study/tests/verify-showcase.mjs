import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const testRoot = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(testRoot, "..");
const showcaseRoot = join(projectRoot, "showcase");

function source(name) {
  const path = join(showcaseRoot, name);
  assert.ok(existsSync(path), `Missing showcase file: ${name}`);
  return readFileSync(path, "utf8");
}

const html = source("index.html");
const css = source("styles.css");
const js = source("app.js");
const caseDataSource = source("case-data.js");
const projectReadme = readFileSync(join(projectRoot, "README.md"), "utf8");
const projectIndex = readFileSync(join(projectRoot, "index.md"), "utf8");

const researchId = "R-004";
const onlineResearchUrl = "https://yydshly.github.io/0830_1_codex_project/projects/vimax-study/";
const onlineShowcaseUrl = `${onlineResearchUrl}showcase/`;
for (const publicSurface of [html, projectReadme, projectIndex]) {
  assert.ok(publicSurface.includes(researchId), `${researchId} must identify every public project surface`);
}
assert.ok(projectReadme.includes(onlineResearchUrl), "Project README must link the online research page");
assert.ok(projectReadme.includes(onlineShowcaseUrl), "Project README must link the online showcase");
assert.ok(projectReadme.includes("https://github.com/HKUDS/ViMax"), "Project README must index the upstream repository");

const caseDataSandbox = { window: {} };
runInNewContext(caseDataSource, caseDataSandbox, { filename: "case-data.js" });
const caseStudies = caseDataSandbox.window.VIMAX_CASES;

const requiredSections = ["overview", "capabilities", "scenarios", "architecture", "demos", "extensions"];
for (const id of requiredSections) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `Missing required section #${id}`);
}

for (const phrase of [
  "ViMax 不是一个新的视频基础模型",
  "Idea2Video",
  "Script2Video",
  "Novel2Video",
  "真实案例实验室",
  "实现方式",
  "演示效果",
  "可扩展方向",
  "VLM best-of-k",
  "值得研究，适合做样片",
]) {
  assert.ok(html.includes(phrase), `Missing required research statement: ${phrase}`);
}

assert.equal((html.match(/class="capability-card"/g) || []).length, 6, "Expected six capability cards");
assert.equal((html.match(/class="extension-card/g) || []).length, 6, "Expected six extension cards");
assert.equal((html.match(/data-demo-src=/g) || []).length, 3, "Expected three upstream demo selectors");
assert.ok(html.includes("05a48943878312d88fe5a016c12a9654940ecc43"), "Evidence links must pin the audited commit");

const expectedCaseIds = [
  "cat-dog-new-cat",
  "basketball-coaching",
  "barista-type-a",
  "kitchen-type-b",
];
const expectedShotCounts = [8, 8, 8, 14];
const auditedCommit = "05a48943878312d88fe5a016c12a9654940ecc43";
const requiredCaseFields = [
  "id",
  "pipeline",
  "sourceType",
  "sourceLabel",
  "sourceUrl",
  "title",
  "subtitle",
  "format",
  "audience",
  "input",
  "truthNote",
  "stages",
  "shots",
];
const requiredStageFields = [
  "id",
  "label",
  "title",
  "artifact",
  "description",
  "preview",
  "observation",
  "gate",
  "status",
];
const requiredShotFields = ["title", "framing", "lineage", "risk"];

assert.ok(Array.isArray(caseStudies), "case-data.js must define window.VIMAX_CASES as an array");
assert.equal(caseStudies.length, 4, "Expected four real upstream cases");
assert.deepEqual([...caseStudies].map(({ id }) => id), expectedCaseIds, "Case IDs or order changed unexpectedly");
assert.deepEqual([...caseStudies].map(({ shots }) => shots.length), expectedShotCounts, "Unexpected case shot counts");

for (const [caseIndex, caseStudy] of [...caseStudies].entries()) {
  for (const field of requiredCaseFields) {
    assert.ok(Object.hasOwn(caseStudy, field), `Case ${caseStudy.id || caseIndex} is missing field ${field}`);
  }
  assert.equal(caseStudy.stages.length, 8, `Case ${caseStudy.id} must expose eight production stages`);
  assert.ok(caseStudy.sourceUrl.includes(auditedCommit), `Case ${caseStudy.id} source must pin the audited commit`);
  assert.ok(caseStudy.truthNote.length >= 80, `Case ${caseStudy.id} needs a substantive truth boundary`);
  assert.match(
    caseStudy.truthNote,
    /(没有|未|不是).*(配对|storyboard|生成成片)/,
    `Case ${caseStudy.id} must distinguish source/fixture evidence from paired generated output`,
  );

  for (const [stageIndex, stage] of caseStudy.stages.entries()) {
    for (const field of requiredStageFields) {
      assert.ok(Object.hasOwn(stage, field), `Case ${caseStudy.id} stage ${stageIndex + 1} is missing field ${field}`);
    }
  }

  for (const [shotIndex, shot] of caseStudy.shots.entries()) {
    for (const field of requiredShotFields) {
      assert.ok(Object.hasOwn(shot, field), `Case ${caseStudy.id} shot ${shotIndex + 1} is missing field ${field}`);
    }
  }
}

const [ideaCase, scriptCase, baristaCase, kitchenCase] = [...caseStudies];
assert.match(ideaCase.input, /Requirement: For children, do not exceed 3 scenes\./, "Idea example must retain the upstream requirement");
assert.match(ideaCase.input, /Style: Cartoon\./, "Idea example must retain the upstream style");
assert.match(scriptCase.input, /上游脚本摘要/, "Condensed basketball text must identify itself as a summary");
assert.ok(!caseDataSource.includes("shot_descriptions.json"), "Per-shot descriptions must not be presented as a nonexistent aggregate file");
assert.ok(!caseDataSource.includes("回退复用正面图"), "Script2Video must not claim Idea2Video's portrait fallback");
assert.match(baristaCase.subtitle, /8 个镜头、7 类地点/, "Barista fixture must distinguish shots from distinct locations");
assert.match(
  baristaCase.stages.find(({ id }) => id === "reference-plan")?.description || "",
  /没有直接读取 benchmark JSON 的 runner/,
  "Benchmark reference plan must disclose the missing runner",
);
assert.equal(
  kitchenCase.stages.find(({ id }) => id === "camera-graph")?.status,
  "conditional",
  "Generic camera-tree support must not imply this fixture was processed",
);

assert.ok(html.includes("data-case-lab"), "Missing the real-case laboratory surface");
assert.equal((html.match(/data-case-id=/g) || []).length, 4, "Expected four case tabs in the real-case laboratory");
for (const caseId of expectedCaseIds) {
  assert.ok(html.includes(`data-case-id="${caseId}"`), `Missing case tab for ${caseId}`);
}
for (const phrase of [
  "不把推导产物冒充本机生成结果",
  "没有配对成片",
  "真实 fixture，不是实跑成绩",
]) {
  assert.ok(html.includes(phrase), `Missing real-case truth boundary: ${phrase}`);
}

const localScriptTags = [...html.matchAll(/<script\b[^>]*\bsrc=["'](\.\/[^"']+)["'][^>]*><\/script>/g)];
const localScriptSources = localScriptTags.map((match) => match[1]);
assert.deepEqual(localScriptSources, ["./case-data.js?rev=4", "./app.js?rev=4"], "Local scripts must load case data before app logic");
for (const [scriptIndex, scriptTag] of localScriptTags.entries()) {
  assert.match(scriptTag[0], /\bdefer\b/, `Local script ${localScriptSources[scriptIndex]} must remain deferred`);
}

const externalScripts = [...html.matchAll(/<script[^>]+src=["'](https?:\/\/[^"']+)/g)];
const externalStyles = [...html.matchAll(/<link[^>]+href=["'](https?:\/\/[^"']+)/g)];
assert.equal(externalScripts.length, 0, "Showcase must not depend on external JavaScript");
assert.equal(externalStyles.length, 0, "Showcase must not depend on external stylesheets");

for (const imageTag of html.match(/<img\b[^>]*>/g) || []) {
  assert.match(imageTag, /\balt=["'][^"']+["']/, `Image is missing useful alt text: ${imageTag}`);
}

for (const anchor of html.match(/<a\b[^>]*target=["']_blank["'][^>]*>/g) || []) {
  assert.match(anchor, /\brel=["'][^"']*noopener[^"']*["']/, `External target=_blank link must use rel=noopener: ${anchor}`);
}

for (const pattern of [
  "prefers-reduced-motion: reduce",
  "@media (max-width: 1100px)",
  "@media (max-width: 820px)",
  "@media (max-width: 560px)",
  ":focus-visible",
  'html[data-theme="light"]',
  "html:not(.js)",
]) {
  assert.ok(css.includes(pattern), `Missing CSS coverage: ${pattern}`);
}

for (const pattern of [
  "filterCapabilities",
  "activateCase",
  "activateFlow",
  "window.VIMAX_CASES",
  "renderCaseStages",
  "renderCaseShots",
  "loadSelectedDemo",
  "IntersectionObserver",
  "prefers-color-scheme: light",
]) {
  assert.ok(js.includes(pattern), `Missing interaction implementation: ${pattern}`);
}

assert.ok(html.includes("data-video-fallback"), "External video must have a fallback state");
assert.ok(html.includes("data-image-fallback"), "External image must have a fallback state");
assert.ok(html.includes("<noscript>"), "Core page must declare a no-JavaScript boundary");

console.log(JSON.stringify({
  status: "passed",
  showcaseRoot,
  sections: requiredSections,
  capabilityCards: 6,
  extensionCards: 6,
  upstreamDemos: 3,
  realCases: expectedCaseIds,
  caseStages: [...caseStudies].map(({ stages }) => stages.length),
  caseShotCounts: expectedShotCounts,
  caseSourcesPinnedTo: auditedCommit,
  localScriptLoadOrder: localScriptSources,
  externalRuntimeDependencies: 0,
  responsiveBreakpoints: [1100, 820, 560],
  reducedMotion: true,
  lightAndDarkThemes: true,
  researchId,
  onlineResearchUrl,
  onlineShowcaseUrl,
}, null, 2));
