const root = document.documentElement;

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in private or restricted contexts.
  }
}

function setTheme(theme) {
  const resolvedTheme = theme === "light" ? "light" : "dark";
  root.dataset.theme = resolvedTheme;

  const toggle = document.querySelector("[data-theme-toggle]");
  const label = document.querySelector("[data-theme-label]");
  const icon = document.querySelector("[data-theme-icon]");
  if (!toggle || !label || !icon) return;

  const nextTheme = resolvedTheme === "dark" ? "浅色" : "深色";
  label.textContent = nextTheme;
  icon.textContent = resolvedTheme === "dark" ? "☼" : "◐";
  toggle.setAttribute("aria-label", `切换到${nextTheme}主题`);
}

const preferredTheme = safeStorageGet("vimax-showcase-theme")
  || (window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark");
setTheme(preferredTheme);

document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  safeStorageSet("vimax-showcase-theme", nextTheme);
});

const capabilityButtons = [...document.querySelectorAll("[data-capability-filter]")];
const capabilityCards = [...document.querySelectorAll("[data-capability]")];
const capabilityCount = document.querySelector("[data-capability-count]");

function filterCapabilities(filter) {
  let visible = 0;
  capabilityCards.forEach((card) => {
    const tags = card.dataset.capability?.split(/\s+/) || [];
    const show = filter === "all" || tags.includes(filter);
    card.hidden = !show;
    if (show) visible += 1;
  });

  capabilityButtons.forEach((button) => {
    const selected = button.dataset.capabilityFilter === filter;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  if (capabilityCount) capabilityCount.textContent = String(visible);
}

capabilityButtons.forEach((button) => {
  button.addEventListener("click", () => filterCapabilities(button.dataset.capabilityFilter || "all"));
});

function activateRovingControl(controls, activeControl, selectedAttribute, panelResolver) {
  controls.forEach((control) => {
    const selected = control === activeControl;
    control.setAttribute(selectedAttribute, String(selected));
    control.tabIndex = selected ? 0 : -1;
    const panel = panelResolver(control);
    if (panel) panel.hidden = !selected;
  });
}

function addArrowNavigation(controls, activate) {
  controls.forEach((control, index) => {
    control.addEventListener("keydown", (event) => {
      const horizontal = event.key === "ArrowRight" || event.key === "ArrowLeft";
      const vertical = event.key === "ArrowDown" || event.key === "ArrowUp";
      if (!horizontal && !vertical && event.key !== "Home" && event.key !== "End") return;

      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % controls.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + controls.length) % controls.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = controls.length - 1;
      activate(controls[nextIndex]);
      controls[nextIndex].focus();
    });
  });
}

const caseStudies = Array.isArray(window.VIMAX_CASES) ? window.VIMAX_CASES : [];
const caseLab = document.querySelector("[data-case-lab]");
const caseSurface = document.querySelector("[data-case-surface]");
const caseTabs = [...document.querySelectorAll("[data-case-id]")];
const caseStageNav = document.querySelector("[data-case-stage-nav]");
const caseShotGrid = document.querySelector("[data-case-shot-grid]");
const lineageButtons = [...document.querySelectorAll("[data-lineage-mode]")];
const lineageVimaxLabel = document.querySelector("[data-lineage-vimax-label]");
const lineageHeading = document.querySelector("[data-lineage-heading]");

const caseFields = {
  pipeline: document.querySelector("[data-case-pipeline]"),
  sourceType: document.querySelector("[data-case-source-type]"),
  subtitle: document.querySelector("[data-case-subtitle]"),
  title: document.querySelector("[data-case-title]"),
  source: document.querySelector("[data-case-source]"),
  format: document.querySelector("[data-case-format]"),
  audience: document.querySelector("[data-case-audience]"),
  sourceLabel: document.querySelector("[data-case-source-label]"),
  truth: document.querySelector("[data-case-truth]"),
  input: document.querySelector("[data-case-input]"),
};

const stageFields = {
  number: document.querySelector("[data-stage-number]"),
  title: document.querySelector("[data-stage-title]"),
  status: document.querySelector("[data-stage-status]"),
  description: document.querySelector("[data-stage-description]"),
  artifact: document.querySelector("[data-stage-artifact]"),
  preview: document.querySelector("[data-stage-preview]"),
  observation: document.querySelector("[data-stage-observation]"),
  gate: document.querySelector("[data-stage-gate]"),
};

const shotFields = {
  label: document.querySelector("[data-shot-label]"),
  title: document.querySelector("[data-shot-title]"),
  framing: document.querySelector("[data-shot-framing]"),
  lineage: document.querySelector("[data-shot-lineage]"),
  risk: document.querySelector("[data-shot-risk]"),
};

const stageStatusMeta = {
  source: { label: "上游真实输入", className: "status-source" },
  implemented: { label: "源码已实现", className: "status-implemented" },
  conditional: { label: "依赖模型实测", className: "status-paper" },
  "not-run": { label: "尚未实跑", className: "status-pending" },
};

let activeCaseIndex = 0;
let activeStageIndex = 0;
let activeShotIndex = 0;
let activeLineageMode = "vimax";

function setText(element, value) {
  if (element) element.textContent = value || "—";
}

function shortText(value, maxLength = 64) {
  if (!value || value.length <= maxLength) return value || "—";
  return `${value.slice(0, maxLength - 1)}…`;
}

function getActiveCase() {
  return caseStudies[activeCaseIndex] || null;
}

function activateCaseStage(index) {
  const currentCase = getActiveCase();
  if (!currentCase?.stages?.length) return;
  activeStageIndex = Math.max(0, Math.min(index, currentCase.stages.length - 1));
  const stage = currentCase.stages[activeStageIndex];

  [...caseStageNav.querySelectorAll("button")].forEach((button, buttonIndex) => {
    button.setAttribute("aria-pressed", String(buttonIndex === activeStageIndex));
    button.tabIndex = buttonIndex === activeStageIndex ? 0 : -1;
  });

  setText(stageFields.number, `STEP ${String(activeStageIndex + 1).padStart(2, "0")} / ${stage.label}`);
  setText(stageFields.title, stage.title);
  setText(stageFields.description, stage.description);
  setText(stageFields.artifact, stage.artifact);
  setText(stageFields.preview, stage.preview);
  setText(stageFields.observation, stage.observation);
  setText(stageFields.gate, stage.gate);

  const meta = stageStatusMeta[stage.status] || stageStatusMeta["not-run"];
  if (stageFields.status) {
    stageFields.status.className = `status ${meta.className}`;
    stageFields.status.textContent = meta.label;
  }
}

function renderCaseStages() {
  const currentCase = getActiveCase();
  if (!caseStageNav || !currentCase?.stages) return;
  const buttons = currentCase.stages.map((stage, index) => {
    const button = document.createElement("button");
    const number = document.createElement("span");
    const label = stage.label.split("·").slice(1).join("·").trim() || stage.label;
    button.type = "button";
    button.dataset.stageIndex = String(index);
    button.setAttribute("aria-pressed", String(index === activeStageIndex));
    button.tabIndex = index === activeStageIndex ? 0 : -1;
    number.textContent = String(index + 1).padStart(2, "0");
    button.append(number, document.createTextNode(label));
    button.addEventListener("click", () => activateCaseStage(index));
    return button;
  });
  caseStageNav.replaceChildren(...buttons);
  addArrowNavigation(buttons, (button) => activateCaseStage(Number(button.dataset.stageIndex)));
  activateCaseStage(activeStageIndex);
}

function activateCaseShot(index) {
  const currentCase = getActiveCase();
  if (!currentCase?.shots?.length) return;
  activeShotIndex = Math.max(0, Math.min(index, currentCase.shots.length - 1));
  const shot = currentCase.shots[activeShotIndex];

  [...caseShotGrid.querySelectorAll("button")].forEach((button, buttonIndex) => {
    const selected = buttonIndex === activeShotIndex;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });

  setText(shotFields.label, `SHOT ${String(activeShotIndex + 1).padStart(2, "0")} / ${currentCase.pipeline}`);
  setText(shotFields.title, shot.title);
  setText(shotFields.framing, shot.framing);
  setText(
    shotFields.lineage,
    activeLineageMode === "vimax"
      ? shot.lineage
      : "孤立生成只消费当前镜头 Prompt，不携带角色参考、父镜头或共享场景状态。",
  );
  setText(shotFields.risk, shot.risk);
}

function renderCaseShots() {
  const currentCase = getActiveCase();
  if (!caseShotGrid || !currentCase?.shots) return;
  const isBenchmarkFixture = currentCase.sourceType === "Upstream benchmark fixture";
  const buttons = currentCase.shots.map((shot, index) => {
    const button = document.createElement("button");
    const label = document.createElement("span");
    const title = document.createElement("strong");
    const lineage = document.createElement("small");
    button.type = "button";
    button.className = `case-shot-card${index === activeShotIndex ? " is-active" : ""}`;
    button.dataset.shotIndex = String(index);
    button.setAttribute("aria-pressed", String(index === activeShotIndex));
    button.tabIndex = index === activeShotIndex ? 0 : -1;
    label.textContent = `SHOT ${String(index + 1).padStart(2, "0")}`;
    title.textContent = shot.title.replace(/^\d+\s*·\s*/, "");
    lineage.textContent = activeLineageMode === "vimax"
      ? `${isBenchmarkFixture ? "输入锚" : "继承"}：${shortText(shot.lineage, 54)}`
      : "孤立：仅使用本镜头 Prompt";
    button.append(label, title, lineage);
    button.addEventListener("click", () => activateCaseShot(index));
    return button;
  });
  caseShotGrid.replaceChildren(...buttons);
  addArrowNavigation(buttons, (button) => activateCaseShot(Number(button.dataset.shotIndex)));
  activateCaseShot(activeShotIndex);
}

function setLineageMode(mode) {
  activeLineageMode = mode === "isolated" ? "isolated" : "vimax";
  const isBenchmarkFixture = getActiveCase()?.sourceType === "Upstream benchmark fixture";
  if (caseLab) caseLab.dataset.lineageView = activeLineageMode;
  setText(lineageVimaxLabel, isBenchmarkFixture ? "假设接入 ViMax" : "ViMax 参考链");
  setText(lineageHeading, isBenchmarkFixture ? "输入锚 / 假设接入" : "ViMax 参考链");
  lineageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lineageMode === activeLineageMode));
  });
  const note = document.querySelector("[data-lineage-note]");
  setText(
    note,
    activeLineageMode === "vimax"
      ? (isBenchmarkFixture
        ? "假设接入示意：fixture 只有重复的首帧与视频提示，并未被上游 runner 转换成真实参考链；这里展示输入锚以及接入 ViMax 后可能如何传播。"
        : "机制示意：镜头会携带角色参考、父镜头或空间锚点；这解释了控制方式，不代表质量已经通过实测。")
      : "对照示意：每个镜头从自己的 Prompt 独立生成，没有共享角色参考、父镜头或场景状态。",
  );
  renderCaseShots();
}

function activateCase(caseId) {
  const nextIndex = caseStudies.findIndex((item) => item.id === caseId);
  if (nextIndex < 0) return;
  activeCaseIndex = nextIndex;
  activeStageIndex = 0;
  activeShotIndex = 0;
  const currentCase = getActiveCase();
  const activeTab = caseTabs.find((button) => button.dataset.caseId === currentCase.id);

  caseTabs.forEach((button) => {
    const selected = button === activeTab;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  if (caseSurface && activeTab) caseSurface.setAttribute("aria-labelledby", activeTab.id);

  setText(caseFields.pipeline, currentCase.pipeline);
  setText(caseFields.sourceType, currentCase.sourceType);
  setText(caseFields.subtitle, currentCase.subtitle);
  setText(caseFields.title, currentCase.title);
  setText(caseFields.format, currentCase.format);
  setText(caseFields.audience, currentCase.audience);
  setText(caseFields.sourceLabel, currentCase.sourceLabel);
  setText(caseFields.truth, currentCase.truthNote);
  setText(caseFields.input, currentCase.input);
  if (caseFields.source) caseFields.source.href = currentCase.sourceUrl;

  renderCaseStages();
  setLineageMode(activeLineageMode);
}

if (caseStudies.length && caseTabs.length) {
  caseTabs.forEach((tab) => tab.addEventListener("click", () => activateCase(tab.dataset.caseId)));
  addArrowNavigation(caseTabs, (tab) => activateCase(tab.dataset.caseId));
  lineageButtons.forEach((button) => button.addEventListener("click", () => setLineageMode(button.dataset.lineageMode)));
  activateCase(caseTabs[0].dataset.caseId);
  setLineageMode("vimax");
}

const flowButtons = [...document.querySelectorAll("[data-flow-step]")];

function activateFlow(button) {
  activateRovingControl(flowButtons, button, "aria-pressed", (control) => {
    const panelId = control.getAttribute("aria-controls");
    return panelId ? document.getElementById(panelId) : null;
  });
}

flowButtons.forEach((button) => button.addEventListener("click", () => activateFlow(button)));
addArrowNavigation(flowButtons, activateFlow);

const demoButtons = [...document.querySelectorAll("[data-demo-src]")];
const demoVideo = document.querySelector("[data-demo-video]");
const demoTitle = document.querySelector("[data-demo-title]");
const demoSource = document.querySelector("[data-demo-source]");
const demoFallback = document.querySelector("[data-video-fallback]");
const demoConsent = document.querySelector("[data-video-consent]");
const loadDemoButton = document.querySelector("[data-load-demo]");
let selectedDemo = demoButtons[0] || null;
let mediaPermissionGranted = false;

function selectDemo(button) {
  selectedDemo = button;
  demoButtons.forEach((candidate) => {
    const selected = candidate === button;
    candidate.classList.toggle("is-active", selected);
    candidate.setAttribute("aria-pressed", String(selected));
  });

  const title = button.dataset.demoTitle || "官方演示";
  const source = button.dataset.demoSrc || "";
  if (demoTitle) demoTitle.textContent = title;
  if (demoSource) demoSource.href = source;
  if (loadDemoButton) loadDemoButton.textContent = `加载${title}`;
  if (demoVideo) demoVideo.setAttribute("aria-label", `ViMax ${title}视频`);

  if (mediaPermissionGranted) loadSelectedDemo();
}

function loadSelectedDemo() {
  if (!selectedDemo || !demoVideo) return;
  const source = selectedDemo.dataset.demoSrc;
  if (!source) return;

  mediaPermissionGranted = true;
  if (demoConsent) demoConsent.hidden = true;
  if (demoFallback) demoFallback.hidden = true;
  demoVideo.hidden = false;
  demoVideo.src = source;
  demoVideo.load();
}

demoButtons.forEach((button) => button.addEventListener("click", () => selectDemo(button)));
loadDemoButton?.addEventListener("click", loadSelectedDemo);

demoVideo?.addEventListener("loadedmetadata", () => {
  if (demoFallback) demoFallback.hidden = true;
});

demoVideo?.addEventListener("error", () => {
  demoVideo.hidden = true;
  if (demoFallback) demoFallback.hidden = false;
});

const upstreamImage = document.querySelector("[data-upstream-image]");
const imageFallback = document.querySelector("[data-image-fallback]");
upstreamImage?.addEventListener("error", () => {
  upstreamImage.hidden = true;
  if (imageFallback) imageFallback.hidden = false;
});

const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-22% 0px -58%", threshold: [0.05, 0.2, 0.45] });

  observedSections.forEach((section) => observer.observe(section));
}
