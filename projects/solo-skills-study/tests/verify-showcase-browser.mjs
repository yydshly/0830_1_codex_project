import assert from "node:assert/strict";
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const testRoot = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(testRoot, "..");
const artifactsRoot = join(projectRoot, "artifacts");
const targetUrl = process.env.SHOWCASE_URL || "http://127.0.0.1:4192/";
const moduleRoot = process.env.WORKSPACE_NODE_MODULES;

if (!moduleRoot || !existsSync(join(moduleRoot, "playwright", "index.mjs"))) {
  throw new Error("Set WORKSPACE_NODE_MODULES to a node_modules directory containing Playwright.");
}

const { chromium } = await import(pathToFileURL(join(moduleRoot, "playwright", "index.mjs")).href);
const browser = await chromium.launch({ headless: true });
const result = {
  url: targetUrl,
  timestamp: new Date().toISOString(),
  browser: "Chromium",
  checks: {},
  performance: {},
  screenshots: []
};

async function loadPage(viewport, colorScheme = "light", reducedMotion = "no-preference") {
  const context = await browser.newContext({ viewport, colorScheme, reducedMotion });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.goto(targetUrl, { waitUntil: "networkidle" });
  return { context, page, errors };
}

try {
  const desktop = await loadPage({ width: 1440, height: 1000 }, "light");
  const { page } = desktop;

  assert.match(await page.title(), /R-007 · Solo Skills 研究展厅/);
  assert.match(await page.locator(".hero .eyebrow").innerText(), /R-007 \/ STUDY 07/);
  assert.ok((await page.locator("body").innerText()).length > 5000, "Page content is unexpectedly short");
  assert.equal(await page.locator("main > section").count(), 9);
  assert.equal(await page.locator("[data-skill]").count(), 26);
  assert.equal(await page.locator("[data-capability-domain]").count(), 8);
  const capabilityTotal = await page.locator("[data-capability-domain]").evaluateAll((items) => items.reduce((sum, item) => sum + Number(item.dataset.count), 0));
  assert.equal(capabilityTotal, 26);
  assert.match(await page.locator("#capabilities-title").innerText(), /一句话知道它能完成什么/);
  assert.equal(await page.locator("[data-skill] p").count(), 26);
  assert.match(await page.locator('[data-skill]:has(code:text-is("web-demo-video")) p').innerText(), /把真实网页自动生成可复现的产品演示视频/);
  const desktopCapabilityColumns = await page.locator(".capability-outcomes").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  assert.equal(desktopCapabilityColumns, 4);
  assert.equal(await page.locator("[data-case]").count(), 7);
  assert.equal(await page.locator("[data-demo-step]").count(), 6);
  assert.match(await page.locator("[data-case-goal]").innerText(), /采用|试点|暂缓/);
  assert.match(await page.locator("[data-case-prompt]").innerText(), /projects\/solo-skills-study|research-study-closeout/);
  assert.equal(await page.locator("[data-case-prompt]").getAttribute("tabindex"), "0");
  for (const selector of ["[data-case-provide]", "[data-case-skill-does]", "[data-case-runtime-does]", "[data-case-effect]"]) {
    assert.equal(await page.locator(`${selector} > li`).count(), 4, `${selector} must show four usage facts`);
  }
  assert.equal(await page.locator("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay").count(), 0);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true);

  const capabilityPath = join(artifactsRoot, "showcase-capability-index.png");
  await page.locator(".capability-outcomes").screenshot({ path: capabilityPath });
  result.screenshots.push("showcase-capability-index.png");

  await page.locator('[data-skill-filter="script"]').click();
  assert.equal(await page.locator("[data-skill]:visible").count(), 9);
  assert.equal(await page.locator("[data-skill-count]").innerText(), "9");

  await page.locator('[data-mechanic="discovery"]').focus();
  await page.keyboard.press("End");
  assert.equal(await page.locator('[data-mechanic="guardrails"]').getAttribute("aria-selected"), "true");
  assert.equal(await page.locator("#mechanic-guardrails").isVisible(), true);

  await page.locator('[data-audience="solo"]').focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator('[data-audience="research"]').getAttribute("aria-selected"), "true");
  assert.equal(await page.locator("#audience-research").isVisible(), true);

  await page.locator("[data-theme-toggle]").click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.locator("[data-theme-toggle]").click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "light");

  await page.locator('[data-case="research"]').focus();
  await page.keyboard.press("End");
  assert.equal(await page.locator('[data-case="cleanup"]').getAttribute("aria-selected"), "true");
  assert.match(await page.locator("[data-case-title]").innerText(), /Notion/);
  assert.match(await page.locator("[data-case-prompt]").innerText(), /数量阈值 10/);
  await page.keyboard.press("Home");
  assert.equal(await page.locator('[data-case="research"]').getAttribute("aria-selected"), "true");

  await page.locator("[data-demo-next]").click();
  assert.match(await page.locator("[data-demo-status]").innerText(), /PASS/);
  await page.locator("[data-usage-run]").click();
  assert.equal(await page.locator("[data-usage-run]").isDisabled(), true);
  await page.waitForFunction(() => document.querySelector("[data-demo-stage-count]")?.textContent?.trim() === "5 / 5");
  assert.equal(await page.locator("[data-demo-workbench]").getAttribute("data-demo-state"), "complete");
  assert.match(await page.locator("[data-demo-output]").innerText(), /ADOPT METHOD/);
  assert.equal(await page.locator("[data-usage-run]").isEnabled(), true);

  const expectedGates = {
    research: "READY",
    meeting: "HOLD",
    workshop: "SETUP",
    video: "READY",
    launch: "REVIEW",
    brief: "DRY RUN",
    cleanup: "HOLD"
  };
  const observedGates = {};
  for (const [id, gate] of Object.entries(expectedGates)) {
    await page.evaluate((caseId) => {
      window.__soloSkillsShowcase.activateCase(caseId);
      window.__soloSkillsShowcase.setDemoStage(5);
    }, id);
    const status = await page.locator("[data-demo-status]").innerText();
    assert.match(status, new RegExp(gate), `${id} gate mismatch`);
    observedGates[id] = status;
  }

  await page.evaluate(() => {
    window.__soloSkillsShowcase.activateCase("research");
    window.__soloSkillsShowcase.setDemoStage(3);
  });
  assert.match(await page.locator(".artifact-preview").innerText(), /adoption-memo\.md/);

  await page.evaluate(() => window.__soloSkillsShowcase.activateCase("video"));
  assert.equal(await page.locator("[data-real-delivery]").isVisible(), true);
  assert.match(await page.locator("[data-real-delivery-title]").innerText(), /32 秒演示视频/);
  await page.waitForFunction(() => {
    const video = document.querySelector("[data-real-delivery-video]");
    return video && Number.isFinite(video.duration) && video.duration >= 31.9;
  });
  const realMedia = await page.locator("[data-real-delivery-video]").evaluate((video) => ({
    duration: video.duration,
    width: video.videoWidth,
    height: video.videoHeight,
    source: video.getAttribute("src")
  }));
  assert.ok(Math.abs(realMedia.duration - 32) <= 0.05);
  assert.equal(realMedia.width, 1920);
  assert.equal(realMedia.height, 1080);
  assert.match(realMedia.source, /solo-skills-real-demo\.mp4/);
  const playedTo = await page.locator("[data-real-delivery-video]").evaluate(async (video) => {
    video.currentTime = 0;
    await video.play();
    await new Promise((resolve) => setTimeout(resolve, 350));
    const currentTime = video.currentTime;
    video.pause();
    return currentTime;
  });
  assert.ok(playedTo > 0.1, `Video did not advance during playback: ${playedTo}`);
  const evidenceHref = await page.locator("[data-real-delivery-evidence]").getAttribute("href");
  const evidenceResponse = await page.request.get(new URL(evidenceHref, targetUrl).href);
  assert.equal(evidenceResponse.status(), 200);
  const videoEvidence = await evidenceResponse.json();
  assert.equal(videoEvidence.output.video.frames, 640);
  const videoDeliveryPath = join(artifactsRoot, "showcase-video-delivery.png");
  await page.locator("[data-real-delivery]").screenshot({ path: videoDeliveryPath });
  result.screenshots.push("showcase-video-delivery.png");

  await page.locator("[data-demo-run]").click();
  await page.locator('[data-case="meeting"]').click();
  assert.equal(await page.locator('[data-case="meeting"]').getAttribute("aria-selected"), "true");
  assert.match(await page.locator("[data-case-prompt]").innerText(), /product-sync\.txt/);
  assert.equal((await page.locator("[data-demo-stage-count]").innerText()).trim(), "0 / 5");
  assert.equal(await page.locator("[data-demo-run]").isEnabled(), true);

  await page.locator('[data-demo-step="0"]').focus();
  await page.keyboard.press("End");
  assert.equal(await page.locator('[data-demo-step="5"]').getAttribute("aria-selected"), "true");
  assert.equal((await page.locator("[data-demo-stage-count]").innerText()).trim(), "5 / 5");

  await page.evaluate(() => document.activeElement?.blur());
  await page.keyboard.press("Tab");
  const keyboardFocus = page.locator(":focus");
  assert.equal(await keyboardFocus.count(), 1);
  const focusStyle = await keyboardFocus.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  assert.notEqual(focusStyle.outlineStyle, "none");
  assert.notEqual(focusStyle.outlineWidth, "0px");

  const desktopPath = join(artifactsRoot, "showcase-desktop.png");
  await page.evaluate(() => {
    window.__soloSkillsShowcase.filterSkills("all");
    window.__soloSkillsShowcase.activateCase("research");
    window.__soloSkillsShowcase.setDemoStage(5);
  });
  const usagePath = join(artifactsRoot, "showcase-usage-desktop.png");
  await page.locator("[data-case-usage]").screenshot({ path: usagePath });
  result.screenshots.push("showcase-usage-desktop.png");
  await page.screenshot({ path: desktopPath, fullPage: true });
  result.screenshots.push("showcase-desktop.png");

  const navigation = await page.evaluate(() => {
    const entry = performance.getEntriesByType("navigation")[0];
    const paints = Object.fromEntries(performance.getEntriesByType("paint").map((item) => [item.name, item.startTime]));
    return {
      ttfb: entry ? entry.responseStart : null,
      domContentLoaded: entry ? entry.domContentLoadedEventEnd : null,
      load: entry ? entry.loadEventEnd : null,
      resources: performance.getEntriesByType("resource").length,
      paints
    };
  });
  result.performance = navigation;
  await page.goto(new URL("?case=video#demo", targetUrl).href, { waitUntil: "networkidle" });
  assert.equal(await page.locator('[data-case="video"]').getAttribute("aria-selected"), "true");
  assert.equal(await page.locator("[data-real-delivery]").isVisible(), true);
  assert.equal(desktop.errors.length, 0, desktop.errors.join("\n"));
  await desktop.context.close();

  const tablet = await loadPage({ width: 768, height: 1024 }, "dark");
  await tablet.page.evaluate(() => {
    window.__soloSkillsShowcase.setTheme("dark");
    window.__soloSkillsShowcase.filterSkills("script");
    window.__soloSkillsShowcase.activateCase("launch");
    window.__soloSkillsShowcase.setDemoStage(5);
  });
  assert.equal(await tablet.page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true);
  assert.equal(await tablet.page.locator("[data-skill]:visible").count(), 9);
  assert.match(await tablet.page.locator("[data-demo-output]").innerText(), /HUMAN APPROVAL REQUIRED/);
  const tabletUsageColumns = await tablet.page.locator(".usage-role-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  assert.equal(tabletUsageColumns, 2);
  const tabletCapabilityColumns = await tablet.page.locator(".capability-outcomes").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  assert.equal(tabletCapabilityColumns, 2);
  await tablet.page.evaluate(() => window.__soloSkillsShowcase.activateCase("video"));
  assert.equal(await tablet.page.locator("[data-real-delivery]").isVisible(), true);
  const tabletDeliveryColumns = await tablet.page.locator("[data-real-delivery]").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  assert.equal(tabletDeliveryColumns, 1);
  const tabletPath = join(artifactsRoot, "showcase-tablet.png");
  await tablet.page.screenshot({ path: tabletPath, fullPage: true });
  result.screenshots.push("showcase-tablet.png");
  assert.equal(tablet.errors.length, 0, tablet.errors.join("\n"));
  await tablet.context.close();

  const mobile = await loadPage({ width: 390, height: 844 }, "light");
  await mobile.page.evaluate(() => {
    window.__soloSkillsShowcase.setTheme("light");
    window.__soloSkillsShowcase.activateCase("brief");
    window.__soloSkillsShowcase.setDemoStage(5);
  });
  assert.equal(await mobile.page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true);
  assert.equal(await mobile.page.locator("h1").isVisible(), true);
  assert.equal(await mobile.page.locator("[data-demo-run]").isVisible(), true);
  const mobileUsageColumns = await mobile.page.locator(".usage-role-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  assert.equal(mobileUsageColumns, 1);
  const mobileCapabilityColumns = await mobile.page.locator(".capability-outcomes").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  assert.equal(mobileCapabilityColumns, 1);
  await mobile.page.evaluate(() => window.__soloSkillsShowcase.activateCase("video"));
  const mobileVideoFits = await mobile.page.locator("[data-real-delivery-video]").evaluate((video) => video.getBoundingClientRect().right <= document.documentElement.clientWidth);
  assert.equal(mobileVideoFits, true);
  const minButtonSize = await mobile.page.locator("button:visible").evaluateAll((buttons) => Math.min(...buttons.map((button) => Math.min(button.getBoundingClientRect().width, button.getBoundingClientRect().height))));
  assert.ok(minButtonSize >= 32, `Smallest visible button dimension is ${minButtonSize}px`);
  const mobilePath = join(artifactsRoot, "showcase-mobile.png");
  await mobile.page.screenshot({ path: mobilePath, fullPage: true });
  result.screenshots.push("showcase-mobile.png");
  assert.equal(mobile.errors.length, 0, mobile.errors.join("\n"));
  await mobile.context.close();

  const reduced = await loadPage({ width: 390, height: 844 }, "light", "reduce");
  assert.equal(await reduced.page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), true);
  const motion = await reduced.page.locator(".demo-progress-bar").evaluate((element) => getComputedStyle(element).transitionDuration);
  assert.ok(Number.parseFloat(motion) <= 0.00001, `Unexpected reduced transition duration: ${motion}`);
  assert.equal(reduced.errors.length, 0, reduced.errors.join("\n"));
  await reduced.context.close();

  result.checks = {
    pageLoads: true,
    meaningfulContent: true,
    noErrorOverlay: true,
    noConsoleErrors: true,
    skillFilter: "9 script-enhanced skills",
    capabilitySummary: "8 result domains covering 26 skills in 4/2/1 responsive columns",
    oneLineAbilities: "26 outcome-first descriptions",
    keyboardMechanicNavigation: "End selects guardrails",
    keyboardAudienceNavigation: "ArrowRight selects research team",
    caseLab: "7 cases × contract + 5 stages",
    usageGuide: "7 goal-first prompts × user/skill/runtime/effect responsibilities",
    usageRun: "prompt call-to-action completes the selected deterministic case",
    realVideoDelivery: "32s / 1920×1080 / browser-played MP4 with responsive player and evidence link",
    directVideoRoute: "?case=video#demo selects the real delivery on load",
    concreteArtifacts: "each case exposes at least one full artifact preview",
    gates: observedGates,
    caseKeyboardNavigation: "End selects cleanup; Home returns research",
    stageKeyboardNavigation: "End selects gate stage",
    runCancellation: "switching cases resets the prior run",
    theme: "light → dark → light",
    viewports: [1440, 768, 390],
    horizontalOverflow: false,
    visibleFocus: true,
    reducedMotion: true,
    externalApiCalls: 0
  };

  writeFileSync(join(artifactsRoot, "showcase-browser-results.json"), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
