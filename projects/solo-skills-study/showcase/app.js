const root = document.documentElement;

function setTheme(theme) {
  root.dataset.theme = theme;
  const toggle = document.querySelector("[data-theme-toggle]");
  const label = document.querySelector("[data-theme-label]");
  const nextTheme = theme === "light" ? "dark" : "light";
  if (toggle) toggle.setAttribute("aria-label", `切换到${nextTheme === "dark" ? "深色" : "浅色"}主题`);
  if (label) label.textContent = nextTheme === "dark" ? "深色" : "浅色";
  try {
    localStorage.setItem("solo-skills-theme", theme);
  } catch (_) {}
}

function toggleTheme() {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
}

function filterSkills(filter) {
  const items = [...document.querySelectorAll("[data-skill]")];
  const buttons = [...document.querySelectorAll("[data-skill-filter]")];
  let visible = 0;

  for (const item of items) {
    const show = filter === "all" || item.dataset.type === filter;
    item.hidden = !show;
    if (show) visible += 1;
  }

  for (const button of buttons) {
    const active = button.dataset.skillFilter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  }

  const counter = document.querySelector("[data-skill-count]");
  if (counter) counter.textContent = String(visible);
  return visible;
}

function activateMechanic(name, moveFocus = false) {
  const tabs = [...document.querySelectorAll("[data-mechanic]")];
  const panels = [...document.querySelectorAll("[data-mechanic-panel]")];

  for (const tab of tabs) {
    const active = tab.dataset.mechanic === name;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && moveFocus) tab.focus();
  }

  for (const panel of panels) {
    panel.hidden = panel.dataset.mechanicPanel !== name;
  }
}

function activateAudience(name, moveFocus = false) {
  const tabs = [...document.querySelectorAll("[data-audience]")];
  const panels = [...document.querySelectorAll("[data-audience-panel]")];

  for (const tab of tabs) {
    const active = tab.dataset.audience === name;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && moveFocus) tab.focus();
  }

  for (const panel of panels) {
    panel.hidden = panel.dataset.audiencePanel !== name;
  }
}

function bindRovingTabs(selector, activate) {
  const tabs = [...document.querySelectorAll(selector)];
  for (const tab of tabs) {
    tab.addEventListener("click", () => activate(tab.dataset.mechanic || tab.dataset.audience));
    tab.addEventListener("keydown", (event) => {
      const current = tabs.indexOf(tab);
      let next = current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === current) return;
      event.preventDefault();
      activate(tabs[next].dataset.mechanic || tabs[next].dataset.audience, true);
    });
  }
}

const cases = Array.isArray(window.SOLO_CASES) ? window.SOLO_CASES : [];
const requestedCaseId = new URLSearchParams(window.location.search).get("case");
let activeCaseId = cases.some((item) => item.id === requestedCaseId) ? requestedCaseId : (cases[0]?.id || "research");
let demoStage = 0;
let demoRunToken = 0;
let demoRunning = false;

function activeCase() {
  return cases.find((item) => item.id === activeCaseId) || cases[0];
}

function sourceBadgeLabel(item) {
  if (item.sourceClass === "live") return "真实项目";
  if (item.sourceClass === "proposal") return "建议增强";
  return "脱敏数据";
}

function renderTextList(selector, values) {
  const list = document.querySelector(selector);
  if (!list) return;
  list.innerHTML = values.map((value) => `<li>${escapeHtml(value)}</li>`).join("");
}

function setRunButtons(running) {
  const mainRun = document.querySelector("[data-demo-run]");
  const usageRun = document.querySelector("[data-usage-run]");
  if (mainRun) {
    mainRun.disabled = running;
    mainRun.textContent = running ? "正在运行…" : "运行完整案例";
  }
  if (usageRun) {
    usageRun.disabled = running;
    usageRun.textContent = running ? "演示运行中…" : "按这个请求运行演示";
  }
}

function renderRealDelivery(item) {
  const panel = document.querySelector("[data-real-delivery]");
  const video = document.querySelector("[data-real-delivery-video]");
  if (!panel || !video) return;
  const delivery = item.realDelivery;
  panel.hidden = !delivery;
  if (!delivery) {
    video.pause();
    return;
  }

  const title = panel.querySelector("[data-real-delivery-title]");
  const summary = panel.querySelector("[data-real-delivery-summary]");
  const stats = panel.querySelector("[data-real-delivery-stats]");
  const evidence = panel.querySelector("[data-real-delivery-evidence]");
  if (title) title.textContent = delivery.title;
  if (summary) summary.textContent = delivery.summary;
  if (stats) stats.innerHTML = delivery.stats.map((value) => `<li>${escapeHtml(value)}</li>`).join("");
  if (evidence) evidence.href = delivery.evidence;
  if (video.getAttribute("src") !== delivery.video) {
    video.src = delivery.video;
    video.poster = delivery.poster;
    video.load();
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function activateCase(id, moveFocus = false) {
  const item = cases.find((candidate) => candidate.id === id);
  if (!item) return;

  demoRunToken += 1;
  demoRunning = false;
  activeCaseId = item.id;

  for (const tab of document.querySelectorAll("[data-case]")) {
    const selected = tab.dataset.case === item.id;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && moveFocus) tab.focus();
  }

  const panel = document.querySelector("[data-case-brief]");
  if (panel) panel.setAttribute("aria-labelledby", `case-tab-${item.id}`);

  const source = document.querySelector("[data-case-source]");
  if (source) {
    source.textContent = item.source;
    source.className = `case-source is-${item.sourceClass}`;
  }
  const assignments = {
    "[data-case-type]": item.type,
    "[data-case-title]": item.title,
    "[data-case-summary]": item.summary,
    "[data-case-trigger]": item.trigger,
    "[data-case-environment]": item.environment,
    "[data-case-side-effect]": item.sideEffect,
    "[data-case-goal]": item.goal,
    "[data-case-input-label]": item.inputLabel,
    "[data-case-input-origin]": `source: ${item.source.toLowerCase()}`,
    "[data-demo-run-id]": `case: ${item.id} / deterministic-local-run`
  };
  for (const [selector, value] of Object.entries(assignments)) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  }

  const skillStack = document.querySelector("[data-case-skills]");
  if (skillStack) skillStack.innerHTML = item.skills.map((skill) => `<code>${skill}</code>`).join(" · ");

  const input = document.querySelector("[data-case-input]");
  if (input) input.innerHTML = item.input;
  const inputBadge = document.querySelector("[data-case-input-badge]");
  if (inputBadge) inputBadge.textContent = sourceBadgeLabel(item);

  const prompt = document.querySelector("[data-case-prompt]");
  if (prompt) prompt.textContent = item.prompt;
  renderTextList("[data-case-provide]", item.provide);
  renderTextList("[data-case-skill-does]", item.skillDoes);
  renderTextList("[data-case-runtime-does]", item.runtimeDoes);
  renderTextList("[data-case-effect]", item.effect);
  renderRealDelivery(item);

  setRunButtons(false);
  setDemoStage(0);
}

function renderDemoOutput(stage) {
  const item = activeCase();
  const data = item?.stages[stage];
  const output = document.querySelector("[data-demo-output]");
  if (!output || !data) return;
  const facts = data.facts?.length
    ? `<ul class="finding-list">${data.facts.map(([key, value]) => `<li><code>${key}</code><span>${value}</span></li>`).join("")}</ul>`
    : "";
  const artifact = data.artifact
    ? `<div class="artifact-preview"><span>${escapeHtml(data.artifactTitle || "ARTIFACT PREVIEW")}</span><pre>${escapeHtml(data.artifact)}</pre></div>`
    : "";
  output.innerHTML = `
    <p class="output-kicker">${data.kicker}</p>
    <h3>${data.title}</h3>
    <p>${data.body}</p>
    ${facts}
    ${artifact}
    <div class="output-callout ${data.tone}"><strong>${data.calloutTitle}</strong><p>${data.calloutBody}</p></div>
  `;
}

function renderDemoLog(stage) {
  const item = activeCase();
  const log = document.querySelector("[data-demo-log]");
  if (!log || !item) return;
  if (stage === 0) {
    log.innerHTML = `<li class="is-current">等待运行「${item.short}」案例</li>`;
    return;
  }
  log.innerHTML = item.logs.map((label, index) => {
    const number = index + 1;
    const state = number < stage ? "is-done" : number === stage ? "is-current" : "";
    return `<li class="${state}">${label}</li>`;
  }).join("");
}

function setDemoStage(stage) {
  const item = activeCase();
  if (!item) return;
  const lastStage = item.stages.length - 1;
  demoStage = Math.max(0, Math.min(lastStage, Number(stage)));
  const data = item.stages[demoStage];
  const workbench = document.querySelector("[data-demo-workbench]");
  const status = document.querySelector("[data-demo-status]");
  const label = document.querySelector("[data-demo-output-label]");
  const count = document.querySelector("[data-demo-stage-count]");
  const progress = document.querySelector("[data-demo-progress]");
  const next = document.querySelector("[data-demo-next]");
  const reset = document.querySelector("[data-demo-reset]");

  if (workbench) workbench.dataset.demoState = data.state;
  if (status) status.textContent = data.status;
  if (label) label.textContent = data.label;
  if (count) count.textContent = `${demoStage} / ${lastStage}`;
  if (progress) progress.style.width = `${(demoStage / lastStage) * 100}%`;
  if (next) next.disabled = demoStage >= lastStage || demoRunning;
  if (reset) reset.disabled = demoStage === 0 && !demoRunning;

  for (const button of document.querySelectorAll("[data-demo-step]")) {
    const active = Number(button.dataset.demoStep) === demoStage;
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  }

  renderDemoOutput(demoStage);
  renderDemoLog(demoStage);
}

function advanceDemo() {
  const lastStage = (activeCase()?.stages.length || 1) - 1;
  if (demoStage < lastStage) setDemoStage(demoStage + 1);
}

function resetDemo() {
  demoRunToken += 1;
  demoRunning = false;
  setRunButtons(false);
  setDemoStage(0);
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function runDemo() {
  const token = ++demoRunToken;
  demoRunning = true;
  setRunButtons(true);
  setDemoStage(0);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const delay = reducedMotion ? 40 : 650;
  const lastStage = (activeCase()?.stages.length || 1) - 1;
  for (let stage = 1; stage <= lastStage; stage += 1) {
    await wait(delay);
    if (token !== demoRunToken) return;
    setDemoStage(stage);
  }

  demoRunning = false;
  setRunButtons(false);
  setDemoStage(lastStage);
}

function runUsageDemo() {
  const workbench = document.querySelector("[data-demo-workbench]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  workbench?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  runDemo();
}

function bindCaseTabs() {
  const tabs = [...document.querySelectorAll("[data-case]")];
  for (const tab of tabs) {
    tab.addEventListener("click", () => activateCase(tab.dataset.case));
    tab.addEventListener("keydown", (event) => {
      const current = tabs.indexOf(tab);
      let next = current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === current) return;
      event.preventDefault();
      activateCase(tabs[next].dataset.case, true);
    });
  }
}

function bindDemoStageTabs() {
  const tabs = [...document.querySelectorAll("[data-demo-step]")];
  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      demoRunToken += 1;
      demoRunning = false;
      setRunButtons(false);
      setDemoStage(tab.dataset.demoStep);
    });
    tab.addEventListener("keydown", (event) => {
      const current = tabs.indexOf(tab);
      let next = current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === current) return;
      event.preventDefault();
      setDemoStage(next);
      tabs[next].focus();
    });
  }
}

function observeSections() {
  if (!("IntersectionObserver" in window)) return;
  const links = [...document.querySelectorAll(".primary-nav a")];
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    for (const link of links) {
      link.toggleAttribute("aria-current", link.getAttribute("href") === `#${visible.target.id}`);
    }
  }, { rootMargin: "-28% 0px -58%", threshold: [0.01, 0.2, 0.5] });
  for (const section of sections) observer.observe(section);
}

document.querySelector("[data-theme-toggle]")?.addEventListener("click", toggleTheme);

for (const button of document.querySelectorAll("[data-skill-filter]")) {
  button.addEventListener("click", () => filterSkills(button.dataset.skillFilter));
}

bindRovingTabs("[data-mechanic]", activateMechanic);
bindRovingTabs("[data-audience]", activateAudience);
bindCaseTabs();
bindDemoStageTabs();

document.querySelector("[data-demo-next]")?.addEventListener("click", advanceDemo);
document.querySelector("[data-demo-reset]")?.addEventListener("click", resetDemo);
document.querySelector("[data-demo-run]")?.addEventListener("click", runDemo);
document.querySelector("[data-usage-run]")?.addEventListener("click", runUsageDemo);

setTheme(root.dataset.theme || "light");
filterSkills("all");
activateCase(activeCaseId);
observeSections();

window.__soloSkillsShowcase = {
  filterSkills,
  activateMechanic,
  activateAudience,
  activateCase,
  setDemoStage,
  advanceDemo,
  resetDemo,
  runDemo,
  runUsageDemo,
  setTheme
};
