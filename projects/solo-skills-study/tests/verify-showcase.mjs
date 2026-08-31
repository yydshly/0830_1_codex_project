import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const testRoot = dirname(fileURLToPath(import.meta.url));
const showcaseRoot = resolve(testRoot, "..", "showcase");
const projectRoot = resolve(testRoot, "..");
const repositoryRoot = resolve(projectRoot, "..", "..");

function source(name) {
  const path = join(showcaseRoot, name);
  assert.ok(existsSync(path), `Missing showcase file: ${name}`);
  return readFileSync(path, "utf8");
}

const html = source("index.html");
const css = source("styles.css");
const js = source("app.js");
const caseDataSource = source("case-data.js");
const videoStage = source("video-stage.html");
const renderScript = readFileSync(join(projectRoot, "scripts", "render-real-demo.mjs"), "utf8");
const projectReadme = readFileSync(join(projectRoot, "README.md"), "utf8");
const projectIndex = readFileSync(join(projectRoot, "index.md"), "utf8");
const rootReadme = readFileSync(join(repositoryRoot, "README.md"), "utf8");

const requiredSections = ["overview", "capabilities", "mechanics", "scenarios", "demo", "extensions", "value", "evidence"];
for (const id of requiredSections) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `Missing required section #${id}`);
}

for (const phrase of [
  "Solo Skills 不是 Agent 框架",
  "它做的是上下文工程，不是训练一个新模型",
  "先看能力，再看 Skill 名：一句话知道它能完成什么",
  "使用场景",
  "同一套 Skill 思路，跑过七种真实工作形态",
  "你实际要怎么使用这个库？",
  "YOU SAY TO THE AGENT",
  "按这个请求运行演示",
  "真实项目证据",
  "脱敏拟真 fixture",
  "可扩展方向",
  "对我们的意义",
  "确定性模拟",
  "格式可迁移 ≠ 运行可迁移",
  "R-007 / STUDY 07",
  "第 7 个研究子项目",
]) {
  assert.ok(html.includes(phrase), `Missing required research statement: ${phrase}`);
}

const skillNames = [
  "book-pdf",
  "claude-codex-fallback",
  "community-launch",
  "computer-use",
  "daangn-search",
  "daily-brief-bot",
  "discord-agent-fleet",
  "discord-reminder",
  "event-sales-script",
  "harness",
  "humanize-korean",
  "kakaotalk-cli",
  "measured-ui-callouts",
  "meeting-minutes",
  "meeting-summary",
  "multi-method-image-generation",
  "naver-blog-post",
  "naver-mail",
  "notion-delete",
  "orchestration",
  "remote-offload",
  "style-skill-creator",
  "threads-reply",
  "voice-dna-creator",
  "web-demo-video",
  "workshop-prep",
];

assert.equal((html.match(/\sdata-skill(?:\s|>)/g) || []).length, 26, "Expected 26 skill entries");
assert.equal((html.match(/data-capability-domain/g) || []).length, 8, "Expected eight result-oriented capability domains");
const domainCounts = [...html.matchAll(/data-capability-domain data-count="(\d+)"/g)].map((match) => Number(match[1]));
assert.deepEqual(domainCounts, [4, 3, 5, 5, 4, 2, 2, 1]);
assert.equal(domainCounts.reduce((sum, count) => sum + count, 0), 26, "Capability domain counts must cover all 26 skills");
assert.equal((html.match(/data-type="knowledge"/g) || []).length, 9, "Expected nine knowledge skills");
assert.equal((html.match(/data-type="script"/g) || []).length, 9, "Expected nine script-enhanced skills");
assert.equal((html.match(/data-type="coupled"/g) || []).length, 8, "Expected eight environment-coupled skills");

for (const skill of skillNames) {
  assert.ok(html.includes(`<code>${skill}</code>`), `Missing skill: ${skill}`);
}

const oneLineAbilities = [...html.matchAll(/<article class="skill-item"[^>]*>[\s\S]*?<h3><code>[^<]+<\/code><\/h3><p>([^<]+)<\/p>/g)].map((match) => match[1]);
assert.equal(oneLineAbilities.length, 26, "Every skill must expose one one-line ability");
assert.ok(oneLineAbilities.every((ability) => ability.length >= 15 && ability.length <= 45), "One-line abilities must stay concrete and scannable");
for (const statement of [
  "把真实网页自动生成可复现的产品演示视频。",
  "从长会议记录中提取决定、行动项、负责人和期限。",
  "每天自动收集、筛选并把个性化情报简报发送到 Discord。",
  "把指定 Notion 页面安全移入可恢复归档，而不是永久删除。",
  "把复杂目标拆成任务 DAG，并协调多个 Agent 完成。",
]) {
  assert.ok(oneLineAbilities.includes(statement), `Missing representative one-line ability: ${statement}`);
}

assert.equal((html.match(/data-mechanic-panel=/g) || []).length, 5, "Expected five mechanic panels");
assert.equal((html.match(/class="extension-card/g) || []).length, 6, "Expected six extension cards");
assert.equal((html.match(/data-case="/g) || []).length, 7, "Expected seven case selectors");
assert.equal((html.match(/data-demo-step=/g) || []).length, 6, "Expected contract plus five execution stages");
assert.equal((html.match(/data-case-(?:provide|skill-does|runtime-does|effect)/g) || []).length, 4, "Expected four usage responsibility lists");
assert.ok(html.includes("data-real-delivery-video"), "Expected a real media delivery player");
assert.ok(html.includes("d5789f592af17980054052fc7c05fe8a8e46be79"), "Evidence links must pin the audited commit");

for (const text of [projectReadme, projectIndex, rootReadme]) {
  assert.ok(text.includes("R-007"), "Public research entry must expose the stable R-007 identifier");
  assert.ok(text.includes("第 7 个研究子项目"), "Public research entry must identify the seventh study");
}
for (const url of [
  "https://github.com/bam-bam-2/solo-skills/tree/d5789f592af17980054052fc7c05fe8a8e46be79",
  "https://github.com/yydshly/0830_1_codex_project/tree/main/projects/solo-skills-study",
  "https://yydshly.github.io/0830_1_codex_project/projects/solo-skills-study/",
  "https://yydshly.github.io/0830_1_codex_project/projects/solo-skills-study/showcase/",
]) {
  assert.ok(projectReadme.includes(url), `Project README must index ${url}`);
  assert.ok(rootReadme.includes(url), `Root README must index ${url}`);
}

const sandbox = { window: {} };
runInNewContext(caseDataSource, sandbox);
const cases = sandbox.window.SOLO_CASES;
assert.ok(Array.isArray(cases), "case-data.js must expose SOLO_CASES");
assert.equal(cases.length, 7, "Expected seven end-to-end cases");
assert.deepEqual(Array.from(cases, (item) => item.id), ["research", "meeting", "workshop", "video", "launch", "brief", "cleanup"]);
for (const item of cases) {
  assert.ok(item.goal.length >= 20, `${item.id} must state a concrete business goal`);
  assert.ok(item.prompt.length >= 80, `${item.id} must expose a usable natural-language request`);
  for (const field of ["provide", "skillDoes", "runtimeDoes", "effect"]) {
    assert.equal(item[field].length, 4, `${item.id}.${field} must expose four concise usage facts`);
  }
  assert.equal(item.stages.length, 6, `${item.id} must include a contract plus five execution stages`);
  assert.equal(item.logs.length, 5, `${item.id} must include five trace labels`);
  assert.ok(item.skills.length >= 1, `${item.id} must name at least one upstream skill`);
  assert.ok(item.stages.some((stage) => stage.artifact), `${item.id} must expose at least one concrete artifact preview`);
  assert.ok(item.stages.at(-1).status, `${item.id} must expose a final gate`);
}
const finalGateText = cases.map((item) => item.stages.at(-1).status).join(" ");
for (const gate of ["READY", "HOLD", "SETUP", "DRY RUN", "REVIEW"]) {
  assert.ok(finalGateText.includes(gate), `Missing distinct final gate: ${gate}`);
}
const videoCase = cases.find((item) => item.id === "video");
assert.ok(videoCase.realDelivery, "Video case must expose the real rendered deliverable");
assert.match(videoCase.stages.at(-1).status, /READY/);
assert.match(videoCase.stages.at(-1).calloutTitle, /REAL MEDIA DELIVERED/);

const videoPath = join(showcaseRoot, "media", "solo-skills-real-demo.mp4");
const posterPath = join(showcaseRoot, "media", "solo-skills-real-demo-poster.jpg");
const evidencePath = join(projectRoot, "artifacts", "solo-skills-real-demo-evidence.json");
const publicEvidencePath = join(showcaseRoot, "media", "solo-skills-real-demo-evidence.json");
const contactSheetPath = join(projectRoot, "artifacts", "solo-skills-real-demo-contact-sheet.jpg");
for (const path of [videoPath, posterPath, evidencePath, publicEvidencePath, contactSheetPath]) assert.ok(existsSync(path), `Missing real video artifact: ${path}`);
assert.ok(statSync(videoPath).size > 1_000_000, "Real MP4 is unexpectedly small");
const mediaEvidence = JSON.parse(readFileSync(evidencePath, "utf8"));
assert.equal(mediaEvidence.output.durationSeconds, 32);
assert.equal(mediaEvidence.output.video.width, 1920);
assert.equal(mediaEvidence.output.video.height, 1080);
assert.equal(mediaEvidence.output.video.frames, 640);
assert.equal(mediaEvidence.output.video.codec, "h264");
assert.equal(mediaEvidence.output.video.pixelFormat, "yuv420p");
assert.equal(mediaEvidence.output.audioStreams, 0);
assert.deepEqual(mediaEvidence.browserErrors, []);
for (const pattern of ["window.__tick", "getBoundingClientRect", "MouseEvent", "frameIndex", "index.html?render=video"]) {
  assert.ok(videoStage.includes(pattern), `Video stage must include ${pattern}`);
}
for (const pattern of ["640", "ffmpeg", "ffprobe", "libx264", "yuv420p", "mkdtempSync", "rmSync"]) {
  assert.ok(renderScript.includes(pattern), `Render script must include ${pattern}`);
}

const externalScripts = [...html.matchAll(/<script[^>]+src=["'](https?:\/\/[^"']+)/g)];
const externalStyles = [...html.matchAll(/<link[^>]+href=["'](https?:\/\/[^"']+)/g)];
assert.equal(externalScripts.length, 0, "Showcase must not depend on external JavaScript");
assert.equal(externalStyles.length, 0, "Showcase must not depend on external stylesheets");

for (const anchor of html.match(/<a\b[^>]*target=["']_blank["'][^>]*>/g) || []) {
  assert.match(anchor, /\brel=["'][^"']*noopener[^"']*["']/, `External target=_blank link must use rel=noopener: ${anchor}`);
}

for (const pattern of [
  "prefers-reduced-motion: reduce",
  "@media (max-width: 1120px)",
  "@media (max-width: 820px)",
  "@media (max-width: 560px)",
  ":focus-visible",
  'html[data-theme="dark"]',
  "html:not(.js)",
]) {
  assert.ok(css.includes(pattern), `Missing CSS coverage: ${pattern}`);
}

for (const pattern of [
  "filterSkills",
  "activateMechanic",
  "activateAudience",
  "activateCase",
  "URLSearchParams",
  "runDemo",
  "runUsageDemo",
  "data-case-prompt",
  "advanceDemo",
  "resetDemo",
  "IntersectionObserver",
  "prefers-reduced-motion: reduce",
]) {
  assert.ok(js.includes(pattern), `Missing interaction implementation: ${pattern}`);
}

assert.ok(!js.includes("fetch(") && !caseDataSource.includes("fetch("), "Deterministic cases must not call an external API");
assert.ok(html.includes("aria-live=\"polite\""), "Demo and filter feedback must be announced");
assert.ok(html.includes("<noscript>"), "Core page must declare a no-JavaScript boundary");

console.log(JSON.stringify({
  status: "passed",
  showcaseRoot,
  sections: requiredSections,
  skills: 26,
  capabilityDomains: { count: 8, distribution: domainCounts },
  oneLineAbilities: 26,
  skillTypes: { knowledge: 9, script: 9, coupled: 8 },
  mechanicStages: 5,
  cases: 7,
  usageContracts: 7,
  responsibilityListsPerCase: 4,
  realMediaDelivery: { durationSeconds: 32, frames: 640, resolution: "1920×1080", codec: "h264", audioStreams: 0 },
  stagesPerCase: 5,
  caseSources: { liveProject: 1, liveTargetRealRender: 1, sanitizedFixtures: 4, proposedGuardrail: 1 },
  extensionCards: 6,
  externalRuntimeDependencies: 0,
  externalApiCalls: 0,
  responsiveBreakpoints: [1120, 820, 560],
  reducedMotion: true,
  lightAndDarkThemes: true,
  publicResearchId: "R-007",
  publicIndexes: { upstream: true, researchSource: true, researchPage: true, onlineWeb: true, realVideo: true },
}, null, 2));
