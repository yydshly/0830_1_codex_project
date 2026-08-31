import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const testRoot = dirname(fileURLToPath(import.meta.url));
const showcaseRoot = resolve(testRoot, "..", "showcase");

function source(name) {
  const path = join(showcaseRoot, name);
  assert.ok(existsSync(path), `Missing showcase file: ${name}`);
  return readFileSync(path, "utf8");
}

const html = source("index.html");
const css = source("styles.css");
const js = source("app.js");

const requiredSections = ["overview", "demo", "source-live", "capabilities", "architecture", "scenarios", "decision", "extensions", "meaning", "limits"];
for (const id of requiredSections) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `Missing required section #${id}`);
}

for (const phrase of [
  "选中元素",
  "复制时把",
  "它不理解意图，也不改代码",
  "本地 React 管理后台的精准 UI 修改",
  "不用相信示意图，直接运行 v0.4.1",
  "启动真实 Selector",
  "锁定上游源码",
  "Selector 到此为止",
  "它给一次复制补上六类上下文",
  "实现原理",
  "使用场景",
  "先别问怎么用，先判断该不该用",
  "可扩展方向",
  "对我们的意义",
  "本地运行，不等于可以盲目复制",
  "Shadow DOM",
  "data-ai-id",
]) {
  assert.ok(html.includes(phrase), `Missing required research statement: ${phrase}`);
}

for (const phrase of ["VISUAL INTENT COMPILER", "AI 就知道", "生成 AI 上下文", "Selector 编译"]) {
  assert.ok(!html.includes(phrase), `Overstated wording must not return: ${phrase}`);
}

assert.equal((html.match(/data-demo-target=/g) || []).length, 3, "Expected three selectable demo targets");
assert.equal((html.match(/data-scenario-id=/g) || []).length, 6, "Expected six interactive scenario tabs");
assert.equal((html.match(/class="scenario-static"/g) || []).length, 1, "Expected a static multi-scenario fallback");
assert.equal((html.match(/name="decision-(?:task|environment|sensitivity|scale|fidelity)"/g) || []).length, 16, "Expected sixteen decision inputs across five dimensions");
assert.equal((html.match(/class="decision-static"/g) || []).length, 1, "Expected a static decision fallback");
assert.equal((html.match(/class="capability-item"/g) || []).length, 6, "Expected six capability items");
assert.equal((html.match(/<article><span class="priority">/g) || []).length, 6, "Expected six extension directions");
assert.equal((html.match(/<article><span>(?:DOM|ORIGIN|DEBUG|PRIVACY|PAGE|MATURITY)<\/span>/g) || []).length, 6, "Expected six limitation items");
assert.ok(html.includes("d88e9a6c3c10821a5cc6d87447693d9507a76b35"), "Evidence links must pin the audited commit");
assert.ok(html.includes('src="source-demo/"'), "Showcase must embed the actual-source demo");
assert.ok(html.includes('allow="clipboard-write; display-capture"'), "Source demo iframe must declare the capabilities used by upstream export paths");

const externalScripts = [...html.matchAll(/<script[^>]+src=["'](https?:\/\/[^"']+)/g)];
const externalStyles = [...html.matchAll(/<link[^>]+href=["'](https?:\/\/[^"']+)/g)];
assert.equal(externalScripts.length, 0, "Showcase must not depend on external JavaScript");
assert.equal(externalStyles.length, 0, "Showcase must not depend on external stylesheets");

for (const anchor of html.match(/<a\b[^>]*target=["']_blank["'][^>]*>/g) || []) {
  assert.match(anchor, /\brel=["'][^"']*noopener[^"']*["']/, `External target=_blank link must use rel=noopener: ${anchor}`);
}

for (const pattern of [
  'html[data-theme="dark"]',
  "prefers-reduced-motion: reduce",
  "@media (max-width: 1100px)",
  "@media (max-width: 820px)",
  "@media (max-width: 560px)",
  ":focus-visible",
  ".no-js",
  ".demo-target.is-selected",
]) {
  assert.ok(css.includes(pattern), `Missing CSS coverage: ${pattern}`);
}

for (const pattern of [
  "setTheme",
  "buildPrompt",
  "buildSharingan",
  "selectTarget",
  "setMode",
  "updateOutput",
  "simulateButton",
  "resetDemo",
  "selectScenario",
  "resetScenarioOutput",
  "updateDecision",
  "batchAlternatives",
  "IntersectionObserver",
]) {
  assert.ok(js.includes(pattern), `Missing interaction implementation: ${pattern}`);
}

for (const control of ["data-theme-toggle", "data-compile", "data-copy", "data-simulate", "data-reset"]) {
  assert.ok(html.includes(control), `Missing required control: ${control}`);
}

for (const dimension of ["task", "environment", "sensitivity", "scale", "fidelity"]) {
  assert.ok(html.includes(`name="decision-${dimension}"`), `Missing decision dimension: ${dimension}`);
}

for (const routeMarker of ["RECOMMENDED", "USE OTHER TOOL", "STOP AND REVIEW", "Sharingan 报告", "Markdown 导出"]) {
  assert.ok(html.includes(routeMarker) || js.includes(routeMarker), `Missing decision route marker: ${routeMarker}`);
}

assert.ok(html.includes("<noscript>"), "Core page must declare a no-JavaScript boundary");
assert.ok(html.includes('aria-live="polite"'), "Dynamic output must expose a polite live region");
assert.ok(js.includes('event.key !== "Escape"'), "Demo must support Escape reset");
assert.ok(js.includes('event.key === "ArrowLeft"'), "Demo must support arrow-key target navigation");
assert.ok(js.includes('event.key === "Home"'), "Scenario tabs must support Home navigation");
assert.ok(js.includes('event.key === "End"'), "Scenario tabs must support End navigation");

for (const scenarioId of ["ui", "qa", "replica", "content", "source", "test"]) {
  assert.ok(js.includes(`id: "${scenarioId}"`), `Missing scenario data: ${scenarioId}`);
}

for (const outputMarker of [
  "UI CHANGE CONTEXT",
  "BUG EVIDENCE BRIEF",
  "SHARINGAN REPORT",
  "Markdown fragment",
  "FRAMEWORK SOURCE TRACE",
  "LOCATOR CANDIDATES",
]) {
  assert.ok(js.includes(outputMarker), `Missing differentiated scenario output: ${outputMarker}`);
}

assert.ok(html.includes('role="tablist"'), "Scenario switcher must expose a tablist");
assert.ok(html.includes('role="tabpanel"'), "Scenario detail must expose a tabpanel");

console.log(JSON.stringify({
  status: "passed",
  showcaseRoot,
  sections: requiredSections,
  selectableTargets: 3,
  interactiveScenarios: 6,
  differentiatedScenarioOutputs: 6,
  decisionDimensions: 5,
  decisionInputs: 16,
  explainableDecisionRoutes: 4,
  capabilityItems: 6,
  extensionDirections: 6,
  limitationItems: 6,
  externalRuntimeDependencies: 0,
  lockedUpstreamRuntimeDemos: 1,
  responsiveBreakpoints: [1100, 820, 560],
  reducedMotion: true,
  lightAndDarkThemes: true,
  keyboardJourney: true,
}, null, 2));
