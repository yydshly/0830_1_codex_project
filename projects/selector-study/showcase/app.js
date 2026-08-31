(function () {
  "use strict";

  const root = document.documentElement;
  if (root.classList.contains("no-js")) return;

  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeLabel = document.querySelector("[data-theme-label]");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const workbench = document.querySelector("[data-demo-workbench]");
  const targetSurface = document.querySelector("[data-target-surface]");
  const targets = Array.from(document.querySelectorAll("[data-demo-target]"));
  const modeButtons = Array.from(document.querySelectorAll("[data-mode]"));
  const instruction = document.querySelector("[data-instruction]");
  const compileButton = document.querySelector("[data-compile]");
  const copyButton = document.querySelector("[data-copy]");
  const simulateButton = document.querySelector("[data-simulate]");
  const resetButton = document.querySelector("[data-reset]");
  const promptOutput = document.querySelector("[data-prompt-output]");
  const outputLabel = document.querySelector("[data-output-label]");
  const charCount = document.querySelector("[data-char-count]");
  const lineCount = document.querySelector("[data-line-count]");
  const targetNumber = document.querySelector("[data-target-number]");
  const targetName = document.querySelector("[data-target-name]");
  const targetSelector = document.querySelector("[data-target-selector]");
  const feedback = document.querySelector("[data-demo-feedback]");

  if (!workbench || targets.length === 0) return;

  let selectedTarget = targets.find((target) => target.dataset.demoTarget === "cta") || targets[0];
  let activeMode = "prompt";
  let generated = false;

  function setTheme(theme, persist) {
    const next = theme === "dark" ? "dark" : "light";
    root.dataset.theme = next;
    const isDark = next === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "切换为浅色主题" : "切换为深色主题");
    themeLabel.textContent = isDark ? "浅色" : "深色";
    if (themeMeta) themeMeta.setAttribute("content", isDark ? "#0b1410" : "#f2f1e9");
    if (persist) {
      try { localStorage.setItem("selector-showcase-theme", next); } catch (_) {}
    }
  }

  setTheme(root.dataset.theme || "light", false);
  themeToggle.addEventListener("click", function () {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  function quote(value) {
    return String(value || "").replace(/"/g, '\\"');
  }

  function sampleOuterHtml(target) {
    if (target.dataset.demoTarget === "cta") {
      return '<button data-testid="create-campaign" class="mock-create">创建活动</button>';
    }
    if (target.dataset.demoTarget === "nav") {
      return '<a data-nav="campaigns" href="/campaigns" aria-current="page">活动 <span>12</span></a>';
    }
    return '<article class="campaign-conversion-card"><span>本月转化</span><strong>18.4%</strong><small>较上月 +2.1%</small></article>';
  }

  function buildPrompt(target) {
    const note = instruction.value.trim() || "说明希望如何修改这个元素。";
    return [
      "Page: http://localhost:3000/campaigns",
      "Query: tab=overview",
      "",
      `1. ${target.dataset.title} <${target.dataset.tag}>`,
      `   selector: ${target.dataset.selector}`,
      `   locator: ${target.dataset.locator}`,
      `   inside: ${target.dataset.inside}`,
      `   source: ${target.dataset.source}`,
      `   react: ${target.dataset.react}`,
      `   instruction: ${note}`,
    ].join("\n");
  }

  function buildSharingan(target) {
    const rect = target.getBoundingClientRect();
    const style = getComputedStyle(target);
    const note = instruction.value.trim() || "说明希望如何修改这个元素。";
    const identity = [
      `title: ${target.dataset.title}`,
      `selector: ${target.dataset.selector}`,
      `locator: ${target.dataset.locator}`,
      `source: ${target.dataset.source}`,
      `react: ${target.dataset.react}`,
    ].join("\n");
    const geometry = [
      `viewportRect: x=${rect.x.toFixed(1)}, y=${rect.y.toFixed(1)}, width=${rect.width.toFixed(1)}, height=${rect.height.toFixed(1)}`,
      `devicePixelRatio: ${window.devicePixelRatio || 1}`,
    ].join("\n");
    const styles = [
      `display: ${style.display};`,
      `position: ${style.position};`,
      `color: ${style.color};`,
      `background-color: ${style.backgroundColor};`,
      `border-radius: ${style.borderRadius};`,
      `padding: ${style.padding};`,
      `font-size: ${style.fontSize};`,
      `font-weight: ${style.fontWeight};`,
    ].join("\n");

    return [
      "# Selector Sharingan Report · 研究页示例",
      "",
      `- Page: http://localhost:3000/campaigns?tab=overview`,
      `- Viewport: ${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio || 1}x`,
      `- Selected: 1`,
      "- Note: 这是根据当前模拟元素生成的缩略报告；真实上游还会采集更多邻近上下文。",
      "",
      "## Element 1",
      "",
      "### Instruction",
      note,
      "",
      "### Identity",
      "```text",
      identity,
      "```",
      "",
      "### Geometry",
      "```text",
      geometry,
      "```",
      "",
      "### DOM Snapshot",
      "```html",
      sampleOuterHtml(target),
      "```",
      "",
      "### Effective Style",
      "```css",
      styles,
      "```",
      "",
      "### Additional sections in upstream",
      "CSS Custom Properties · Matched Rules · Interactive States · Ancestor Chain · Pseudo Elements · Fonts · Animation · Media · React Details",
    ].join("\n");
  }

  function contextText() {
    return activeMode === "sharingan" ? buildSharingan(selectedTarget) : buildPrompt(selectedTarget);
  }

  function updateCounts(text) {
    charCount.textContent = String(text.length);
    lineCount.textContent = String(text.split("\n").length);
  }

  function updateFeedback(message, isAgent) {
    feedback.classList.toggle("is-agent", Boolean(isAgent));
    feedback.querySelector("b").textContent = message;
  }

  function updateOutput(announce) {
    const text = contextText();
    promptOutput.textContent = text;
    outputLabel.textContent = activeMode === "sharingan" ? "SHARINGAN REPORT · SAMPLE" : "SELECTOR PROMPT";
    updateCounts(text);
    if (announce) {
      generated = true;
      updateFeedback(activeMode === "sharingan" ? "Sharingan 示例报告已生成，可交给 Agent 进行高保真复刻" : "普通上下文已生成，目标身份和 instruction 已打包", false);
      promptOutput.scrollTop = 0;
    }
  }

  function clearAgentPreview() {
    targets.forEach((target) => target.classList.remove("is-agent-updated"));
  }

  function visibleTargets() {
    return targets.filter((target) => target.getClientRects().length > 0);
  }

  function selectTarget(target, options) {
    if (!target) return;
    const settings = options || {};
    selectedTarget = target;
    targets.forEach((item) => {
      const selected = item === target;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    clearAgentPreview();
    const index = targets.indexOf(target);
    targetNumber.textContent = `目标 ${String(index + 1).padStart(2, "0")} / ${String(targets.length).padStart(2, "0")}`;
    targetName.textContent = target.dataset.title.replace(/^([^\"]+) \"(.+)\"$/, "$1 “$2”");
    targetSelector.textContent = target.dataset.selector;
    instruction.value = target.dataset.instruction;
    generated = false;
    updateOutput(false);
    updateFeedback("目标已锁定，等待生成上下文", false);
    if (settings.focus) target.focus({ preventScroll: true });
  }

  targets.forEach((target) => {
    target.setAttribute("aria-pressed", String(target === selectedTarget));
    target.addEventListener("click", function (event) {
      event.preventDefault();
      selectTarget(target);
    });
  });

  targetSurface.addEventListener("keydown", function (event) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    const available = visibleTargets();
    if (available.length === 0) return;
    const currentIndex = available.indexOf(selectedTarget);
    const index = currentIndex < 0 ? 0 : currentIndex;
    const next = available[(index + direction + available.length) % available.length];
    selectTarget(next, { focus: true });
  });

  let resizeFrame = 0;
  window.addEventListener("resize", function () {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(function () {
      if (selectedTarget.getClientRects().length > 0) return;
      const available = visibleTargets();
      if (available.length > 0) selectTarget(available[0]);
    });
  });

  function setMode(mode, options) {
    activeMode = mode === "sharingan" ? "sharingan" : "prompt";
    modeButtons.forEach((button) => {
      const active = button.dataset.mode === activeMode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    generated = false;
    updateOutput(false);
    updateFeedback(activeMode === "sharingan" ? "Sharingan 模式已启用，等待生成高保真示例" : "普通模式已启用，等待生成紧凑 prompt", false);
    if (options && options.focus) {
      const active = modeButtons.find((button) => button.dataset.mode === activeMode);
      active.focus();
    }
  }

  modeButtons.forEach((button, index) => {
    button.addEventListener("click", function () { setMode(button.dataset.mode); });
    button.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      const next = modeButtons[(index + direction + modeButtons.length) % modeButtons.length];
      setMode(next.dataset.mode, { focus: true });
    });
  });

  instruction.addEventListener("input", function () {
    generated = false;
    updateOutput(false);
    updateFeedback("instruction 已更新，等待重新生成上下文", false);
  });

  instruction.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      updateOutput(true);
    }
  });

  compileButton.addEventListener("click", function () {
    updateOutput(true);
  });

  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {}
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let copied = false;
    try { copied = document.execCommand("copy"); } catch (_) {}
    area.remove();
    return copied;
  }

  copyButton.addEventListener("click", async function () {
    const original = copyButton.textContent;
    const copied = await copyText(promptOutput.textContent);
    copyButton.textContent = copied ? "已复制" : "复制失败";
    updateFeedback(copied ? "上下文已复制；粘贴前仍应检查敏感内容" : "浏览器阻止了复制，请手动选择输出文本", false);
    window.setTimeout(function () { copyButton.textContent = original; }, 1400);
  });

  simulateButton.addEventListener("click", function () {
    if (!generated) updateOutput(true);
    clearAgentPreview();
    selectedTarget.classList.add("is-agent-updated");
    updateFeedback("下游 Codex 修改已模拟：Selector 提供证据，Agent 才负责改代码", true);
  });

  function resetDemo(options) {
    activeMode = "prompt";
    clearAgentPreview();
    setMode("prompt");
    selectTarget(targets.find((target) => target.dataset.demoTarget === "cta") || targets[0]);
    if (options && options.focus) resetButton.focus({ preventScroll: true });
  }

  resetButton.addEventListener("click", function () { resetDemo(); });

  workbench.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    resetDemo({ focus: true });
    updateFeedback("演示已重置到默认目标", false);
  });

  const scenarioLab = document.querySelector("[data-scenario-lab]");
  const scenarioTabs = Array.from(document.querySelectorAll("[data-scenario-id]"));
  const scenarioStage = document.querySelector("[data-scenario-stage]");
  const scenarioRun = document.querySelector("[data-scenario-run]");
  const scenarioFields = {
    kicker: document.querySelector("[data-scenario-kicker]"),
    title: document.querySelector("[data-scenario-title]"),
    task: document.querySelector("[data-scenario-task]"),
    score: document.querySelector("[data-scenario-score]"),
    fitLabel: document.querySelector("[data-scenario-fit-label]"),
    baseline: document.querySelector("[data-scenario-baseline]"),
    target: document.querySelector("[data-scenario-target]"),
    evidence: document.querySelector("[data-scenario-evidence]"),
    outputTitle: document.querySelector("[data-scenario-output-title]"),
    outputState: document.querySelector("[data-scenario-output-state]"),
    output: document.querySelector("[data-scenario-output]"),
    cost: document.querySelector("[data-scenario-cost]"),
    risk: document.querySelector("[data-scenario-risk]"),
    next: document.querySelector("[data-scenario-next]"),
    alternative: document.querySelector("[data-scenario-alternative]"),
    notUse: document.querySelector("[data-scenario-not-use]"),
    feedback: document.querySelector("[data-scenario-feedback]"),
  };

  const scenarios = [
    {
      id: "ui",
      kicker: "PRODUCT DESIGNER → CODE AGENT",
      title: "把一句“改这个按钮”，变成不会改错对象的任务包。",
      task: "在本地 React 活动后台中，把“创建活动”提升为明确主操作，同时保留现有布局。",
      score: "9.2",
      fitLabel: "很高",
      baseline: "“右上角绿色按钮”依赖截图坐标；同色按钮、响应式布局和重构都会让描述失效。",
      target: "button “创建活动”",
      evidence: [
        ["稳定身份", "data-testid + semantic locator"],
        ["结构位置", "main › campaign header"],
        ["源码线索", "CampaignHeader.tsx:42"],
        ["修改意图", "逐元素 instruction"],
      ],
      outputTitle: "Agent task prompt",
      outputState: "COMPILED",
      output: [
        "UI CHANGE CONTEXT",
        "page: /campaigns?tab=overview",
        "target: button “创建活动”",
        "selector: [data-testid=\"create-campaign\"]",
        "locator: getByRole('button', { name: '创建活动' })",
        "inside: main > CampaignHeader",
        "source: src/features/campaigns/CampaignHeader.tsx:42",
        "react: CampaignPage > CampaignHeader > Button",
        "instruction: 提升为实心主按钮；保持位置与点击行为",
      ].join("\n"),
      cost: "低",
      risk: "开发信息外泄",
      next: "Codex 修改组件",
      alternative: "批量改造时直接使用 AST / codemod",
      notUse: "目标已经能从源码精确定位时，不需要再从页面反推。",
      feedback: "已编译 UI 修改任务：元素身份、源码线索和 instruction 可以一起交给代码 Agent。",
    },
    {
      id: "qa",
      kicker: "QA ENGINEER → BUG OWNER",
      title: "把“偶尔点两次会出错”，冻结成可复核的缺陷现场。",
      task: "在结算页复现提交按钮加载中仍可二次点击的瞬间，把目标、状态和邻近上下文交给缺陷负责人。",
      score: "7.8",
      fitLabel: "高",
      baseline: "截图只能证明页面长什么样，不能准确指出触发元素、当前属性和它所在的表单边界。",
      target: "button “提交订单” · aria-busy=true",
      evidence: [
        ["交互身份", "role + accessible name"],
        ["当前状态", "aria-busy / disabled / attributes"],
        ["祖先上下文", "form › order summary"],
        ["视觉证据", "DOM 片段 + 裁剪截图"],
      ],
      outputTitle: "Bug evidence brief",
      outputState: "CAPTURED",
      output: [
        "BUG EVIDENCE BRIEF",
        "page: /checkout?step=confirm",
        "target: button “提交订单”",
        "locator: getByRole('button', { name: '提交订单' })",
        "observed-state: aria-busy=\"true\"; disabled=false",
        "inside: form#checkout > OrderSummary",
        "nearby: spinner “正在提交”",
        "instruction: 检查 loading 状态为何没有阻止二次提交",
        "missing-evidence: network trace · backend logs",
      ].join("\n"),
      cost: "中",
      risk: "只记录瞬时状态",
      next: "缺陷负责人复现",
      alternative: "时序或接口问题改用 DevTools trace",
      notUse: "根因依赖网络瀑布、后端日志或长时间序列时，Selector 只能补充页面证据。",
      feedback: "已冻结缺陷现场：当前 DOM 状态可复核，但网络时间线和后端日志仍需另行采集。",
    },
    {
      id: "replica",
      kicker: "VISUAL DESIGNER → IMPLEMENTATION AGENT",
      title: "把参考页的一块视觉语言，拆成可复刻的运行时证据。",
      task: "选择一张定价卡片，采集尺寸、有效样式、字体、交互态和媒体线索，用于合法的内部设计迁移。",
      score: "7.4",
      fitLabel: "中高",
      baseline: "单张截图混合了视觉结果，却没有 DOM 结构、实际字体、响应式规则和 hover/focus 差异。",
      target: "article “Pro 方案” pricing card",
      evidence: [
        ["结构与几何", "DOM snapshot + viewport rect"],
        ["有效样式", "computed style + matched rules"],
        ["设计资源", "fonts + media + CSS variables"],
        ["动态表现", "pseudo + interaction + animation"],
      ],
      outputTitle: "Sharingan report",
      outputState: "REPORTED",
      output: [
        "# SHARINGAN REPORT · ELEMENT 1",
        "target: article.pricing-card[data-plan=\"pro\"]",
        "geometry: 368 × 492 @ viewport 1440 × 900",
        "display: grid; gap: 24px; padding: 32px",
        "font: 600 16px/1.45 'Inter'",
        "background: rgb(12 23 18); radius: 16px",
        "states: :hover border-color · :focus-within outline",
        "assets: check.svg · gradient CSS variable",
        "note: 仍需验证版权、跨域资源和响应式状态",
      ].join("\n"),
      cost: "高",
      risk: "报告体积与版权",
      next: "Agent 重建组件",
      alternative: "有设计源文件时优先使用 Figma / tokens",
      notUse: "已有设计系统、Figma 原稿或组件源码时，运行时反推不是最可靠来源。",
      feedback: "已生成高保真证据范围：信息更完整，也意味着更高 token、复核和版权成本。",
    },
    {
      id: "content",
      kicker: "RESEARCHER → KNOWLEDGE NOTE",
      title: "把网页局部内容摘成有结构的 Markdown，而不是一团纯文本。",
      task: "从公开技术文章中选择一个包含标题、列表、表格和代码块的章节，保存到研究笔记。",
      score: "6.6",
      fitLabel: "中",
      baseline: "直接复制常丢失标题层级、链接地址、表格列关系和代码块边界，后续整理成本高。",
      target: "section “Caching strategies”",
      evidence: [
        ["内容结构", "heading + paragraph + list"],
        ["富文本", "table + link + image"],
        ["代码语义", "pre / code fence"],
        ["选择边界", "只导出目标子树"],
      ],
      outputTitle: "Markdown fragment",
      outputState: "SERIALIZED",
      output: [
        "## Caching strategies",
        "",
        "Use explicit lifetimes for each data class.",
        "",
        "| Layer | Lifetime |",
        "| --- | --- |",
        "| Browser | 5 min |",
        "| Edge | 1 hour |",
        "",
        "- Revalidate tagged content",
        "- Keep user data private",
        "",
        "Source: [Architecture guide](/docs/cache)",
      ].join("\n"),
      cost: "低",
      risk: "版权与来源丢失",
      next: "进入研究笔记",
      alternative: "批量知识同步改用 Reader / crawler",
      notUse: "需要整站抓取、增量同步、去重或权限治理时，应使用专门采集管线。",
      feedback: "已序列化局部内容：结构被保留，但来源、授权和更新责任仍需单独记录。",
    },
    {
      id: "source",
      kicker: "FRONTEND ENGINEER → SOURCE OWNER",
      title: "从页面上的结果，反向找到负责它的组件与源码入口。",
      task: "在开发构建中选择订单汇总价格，确认它属于哪个 React 组件、可能来自哪一行源码。",
      score: "8.1",
      fitLabel: "高 · 开发态",
      baseline: "从 DOM class 搜仓库容易命中样式或包装层，无法说明真实组件所有权和渲染链。",
      target: "strong “¥1,299.00”",
      evidence: [
        ["React 链", "CheckoutPage › OrderSummary › Price"],
        ["源码位置", "debug source / stack"],
        ["受限状态", "filtered props + hooks summary"],
        ["DOM 对照", "selected element outerHTML"],
      ],
      outputTitle: "Framework source trace",
      outputState: "TRACED",
      output: [
        "FRAMEWORK SOURCE TRACE",
        "target: strong.total-price",
        "react: CheckoutPage > OrderSummary > Price",
        "source: src/checkout/OrderSummary.tsx:118:9",
        "props: { currency: 'CNY', emphasis: true }",
        "state-summary: cartItems[3] · discountApplied=true",
        "dom: <strong class=\"total-price\">¥1,299.00</strong>",
        "confidence: development-debug-fields",
        "warning: production builds may omit this mapping",
      ].join("\n"),
      cost: "中",
      risk: "依赖框架私有字段",
      next: "打开对应源码",
      alternative: "生产级映射应接 source map / dev server",
      notUse: "生产构建移除调试信息后，不应把缺失的组件链当作代码不存在。",
      feedback: "已连接 DOM 与开发态组件线索；这个结果有用，但不能被当作跨版本稳定协议。",
    },
    {
      id: "test",
      kicker: "TEST ENGINEER → E2E SUITE",
      title: "把肉眼选中的控件，变成一组可验证的 Locator 候选。",
      task: "为登录表单的“继续”按钮起草 Playwright locator，同时检查测试属性和语义名称是否一致。",
      score: "6.9",
      fitLabel: "中",
      baseline: "复制一条脆弱 CSS path 很快，但 DOM 包装层或 class 改名后就会让回归测试失效。",
      target: "button “继续” inside form “登录”",
      evidence: [
        ["语义 locator", "role + accessible name"],
        ["稳定属性", "data-testid / stable id"],
        ["容器限定", "form / landmark / table header"],
        ["唯一性提示", "querySelectorAll validation"],
      ],
      outputTitle: "Locator candidates",
      outputState: "DRAFTED",
      output: [
        "LOCATOR CANDIDATES · REVIEW REQUIRED",
        "1  page.getByRole('button', { name: '继续' })",
        "2  page.getByTestId('login-continue')",
        "3  page.getByRole('form', { name: '登录' })",
        "     .getByRole('button', { name: '继续' })",
        "css fallback: form#login [data-action=\"continue\"]",
        "current uniqueness: 1 match",
        "verify: accessible-name algorithm · async state · fixture",
      ].join("\n"),
      cost: "低",
      risk: "候选不等于稳定测试",
      next: "在 Playwright 中验证",
      alternative: "批量回归直接使用测试框架与 codegen",
      notUse: "需要录制完整流程、等待策略、网络 mock 或 CI 执行时，Selector 不是测试运行器。",
      feedback: "已生成 locator 候选；它缩短起草时间，但唯一性、等待和可访问名称必须在测试中验证。",
    },
  ];

  let activeScenarioId = scenarios[0].id;

  function scenarioById(id) {
    return scenarios.find((item) => item.id === id) || scenarios[0];
  }

  function resetScenarioOutput(scenario) {
    scenarioStage.classList.remove("is-complete");
    scenarioFields.outputState.textContent = "READY";
    scenarioFields.output.textContent = [
      `// ${scenario.outputTitle}`,
      "// 点击“运行此场景”",
      "// 查看这个任务会生成哪一种证据交付物",
    ].join("\n");
    scenarioFields.feedback.textContent = "场景已就绪；运行后展示字段级交付物。";
    scenarioRun.innerHTML = '运行此场景 <span aria-hidden="true">→</span>';
  }

  function selectScenario(id, focus) {
    const scenario = scenarioById(id);
    activeScenarioId = scenario.id;
    scenarioStage.dataset.scenario = scenario.id;
    scenarioStage.setAttribute("aria-labelledby", `scenario-tab-${scenario.id}`);
    scenarioTabs.forEach((tab) => {
      const active = tab.dataset.scenarioId === scenario.id;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    scenarioFields.kicker.textContent = scenario.kicker;
    scenarioFields.title.textContent = scenario.title;
    scenarioFields.task.textContent = scenario.task;
    scenarioFields.score.textContent = scenario.score;
    scenarioFields.fitLabel.textContent = scenario.fitLabel;
    scenarioFields.baseline.textContent = scenario.baseline;
    scenarioFields.target.textContent = scenario.target;
    scenarioFields.evidence.innerHTML = scenario.evidence
      .map(([label, value]) => `<li><b>${label}</b><span>${value}</span></li>`)
      .join("");
    scenarioFields.outputTitle.textContent = scenario.outputTitle;
    scenarioFields.cost.textContent = scenario.cost;
    scenarioFields.risk.textContent = scenario.risk;
    scenarioFields.next.textContent = scenario.next;
    scenarioFields.alternative.textContent = scenario.alternative;
    scenarioFields.notUse.textContent = scenario.notUse;
    resetScenarioOutput(scenario);
  }

  if (scenarioLab && scenarioTabs.length && scenarioStage && scenarioRun) {
    scenarioTabs.forEach((tab, index) => {
      tab.addEventListener("click", function () {
        selectScenario(tab.dataset.scenarioId, false);
      });
      tab.addEventListener("keydown", function (event) {
        let nextIndex = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % scenarioTabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + scenarioTabs.length) % scenarioTabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = scenarioTabs.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        selectScenario(scenarioTabs[nextIndex].dataset.scenarioId, true);
      });
    });

    scenarioRun.addEventListener("click", function () {
      const scenario = scenarioById(activeScenarioId);
      scenarioStage.classList.remove("is-complete");
      void scenarioStage.offsetWidth;
      scenarioFields.output.textContent = scenario.output;
      scenarioFields.outputState.textContent = scenario.outputState;
      scenarioFields.feedback.textContent = scenario.feedback;
      scenarioRun.innerHTML = '重新运行 <span aria-hidden="true">↻</span>';
      scenarioStage.classList.add("is-complete");
    });

    scenarioStage.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      resetScenarioOutput(scenarioById(activeScenarioId));
      scenarioRun.focus({ preventScroll: true });
    });

    selectScenario(activeScenarioId, false);
  }

  const decisionConsole = document.querySelector("[data-decision-console]");
  const decisionForm = document.querySelector("[data-decision-form]");
  const decisionResult = document.querySelector("[data-decision-result]");
  const decisionReset = document.querySelector("[data-decision-reset]");
  const decisionFields = {
    status: document.querySelector("[data-decision-status]"),
    score: document.querySelector("[data-decision-score]"),
    mode: document.querySelector("[data-decision-mode]"),
    reason: document.querySelector("[data-decision-reason]"),
    collect: document.querySelector("[data-decision-collect]"),
    supplement: document.querySelector("[data-decision-supplement]"),
    handoff: document.querySelector("[data-decision-handoff]"),
    gate: document.querySelector("[data-decision-gate]"),
    signals: document.querySelector("[data-decision-signals]"),
    alternative: document.querySelector("[data-decision-alternative]"),
  };

  const decisionProfiles = {
    ui: {
      score: 92,
      mode: "Selector · 普通 Prompt",
      reason: "单个 UI 目标最适合使用紧凑上下文：身份与源码线索收益高，信息成本低。",
      collect: "selector、locator、组件链、instruction",
      supplement: "页面路径、验收标准和禁止改动项",
      handoff: "交给 Codex 修改组件并人工审查 diff",
      alternative: "如果目标已知源码位置，直接编辑组件更快。",
    },
    qa: {
      score: 78,
      mode: "Selector · Prompt + 局部截图",
      reason: "页面瞬时状态和目标身份值得采集，但网络时间线与后端证据仍要补充。",
      collect: "locator、attributes、祖先上下文、局部截图",
      supplement: "复现步骤、网络 trace、console 与后端日志",
      handoff: "生成 bug evidence brief 交给缺陷负责人",
      alternative: "时序与接口问题优先使用 DevTools Performance / Network。",
    },
    replica: {
      score: 74,
      mode: "Selector · Sharingan 报告",
      reason: "复刻需要几何、DOM、CSSOM、字体和状态证据，普通 Prompt 信息不足。",
      collect: "DOM、几何、computed style、字体、动画、媒体",
      supplement: "响应式状态、设计授权与不可复制资产清单",
      handoff: "把报告交给实现 Agent 重建组件",
      alternative: "有 Figma、tokens 或组件源码时优先使用原始设计来源。",
    },
    content: {
      score: 70,
      mode: "Selector · Markdown 导出",
      reason: "局部内容摘录重在保留标题、列表、表格、链接和代码结构。",
      collect: "选中子树的标题、段落、列表、表格、链接、代码",
      supplement: "来源 URL、作者、许可与采集日期",
      handoff: "保存为研究笔记并人工核对引用",
      alternative: "整站或持续同步应使用 Reader、crawler 或知识库连接器。",
    },
    source: {
      score: 82,
      mode: "Selector · Prompt + 框架追踪",
      reason: "开发构建中的 React/Vue 调试线索能把页面结果连接回组件所有权。",
      collect: "DOM 身份、组件链、debug source、受限 props/state",
      supplement: "仓库分支、source map 与构建模式",
      handoff: "打开候选源码并由工程师确认所有权",
      alternative: "生产级定位应接入 dev server、source map 或框架 DevTools。",
    },
    test: {
      score: 69,
      mode: "Selector · Locator Prompt",
      reason: "role、可访问名称和测试属性适合起草 locator，但不等于稳定回归测试。",
      collect: "role、accessible name、testid、容器与唯一性",
      supplement: "fixture、等待策略、异步状态和浏览器断言",
      handoff: "在 Playwright/Cypress 中验证候选 locator",
      alternative: "完整流程录制、mock 与 CI 应直接使用测试框架。",
    },
  };

  const batchAlternatives = {
    ui: "换用 AST / codemod，并用视觉回归验证批量结果。",
    qa: "换用 Playwright、CDP trace 与可重复 fixture。",
    replica: "换用浏览器自动化截图管线、设计 tokens 或 Figma 来源。",
    content: "换用 crawler / Reader / 内容同步管线。",
    source: "换用 source map 索引、代码搜索或静态分析。",
    test: "换用 Playwright codegen、测试生成器与 CI runner。",
  };

  function selectedDecisionValue(name) {
    const input = decisionForm.querySelector(`input[name="decision-${name}"]:checked`);
    return input ? input.value : "";
  }

  function updateDecision() {
    const task = selectedDecisionValue("task");
    const environment = selectedDecisionValue("environment");
    const sensitivity = selectedDecisionValue("sensitivity");
    const scale = selectedDecisionValue("scale");
    const fidelity = selectedDecisionValue("fidelity");
    const profile = decisionProfiles[task] || decisionProfiles.ui;
    let score = profile.score;
    let status = "recommended";
    let statusLabel = "RECOMMENDED";
    let mode = profile.mode;
    let reason = profile.reason;
    let collect = profile.collect;
    let supplement = profile.supplement;
    let handoff = profile.handoff;
    let gate = "复制前检查 URL、文本、表单值与 props/state";
    let alternative = profile.alternative;
    const signals = [];

    if (environment === "local") {
      signals.push("本地开发态通常能获得更完整的组件和 source 线索");
    } else if (environment === "public") {
      score -= 6;
      signals.push("公开可见不等于允许复制，仍需记录来源与许可");
      gate = "先确认版权、跨域资源和页面条款，再复核导出内容";
      if (task === "replica" || task === "content") {
        status = "caution";
        statusLabel = "USE WITH REVIEW";
      }
    } else {
      score -= 18;
      status = "caution";
      statusLabel = "CAUTION";
      signals.push("已登录或生产页面可能包含账号、业务与运行时敏感信息");
      gate = "未经批准不得直接复制；先用测试数据复现并逐字段预览";
      if (fidelity === "high") {
        mode = "先审查 · 再考虑紧凑 Prompt";
        reason = "生产页面不适合直接生成高保真报告；先缩小范围并完成数据审查。";
      }
    }

    if (fidelity === "high") {
      if (task === "replica") {
        score += 8;
        mode = environment === "production" ? mode : "Selector · Sharingan 报告";
        signals.push("复刻任务的高保真要求与 Sharingan 证据范围匹配");
      } else if (task === "content") {
        score -= 4;
        mode = "Selector · Markdown + 局部截图";
        collect += "、局部截图";
        signals.push("内容结构仍以 Markdown 为主，截图只补充版式证据");
      } else {
        score -= 6;
        mode = environment === "production" ? mode : "Selector · Sharingan（限选中范围）";
        collect += "、几何与必要有效样式";
        signals.push("高保真会显著提高报告体积和复核成本");
      }
    } else {
      signals.push("紧凑模式优先控制信息量，只在必要时追加上下文");
    }

    if (scale === "multiple") {
      score -= 5;
      collect += "、逐元素 instruction";
      signals.push("少量多选仍可管理，但必须给每个目标独立说明");
    }

    if (sensitivity === "sensitive") {
      score -= 22;
      status = "caution";
      statusLabel = "REVIEW REQUIRED";
      gate = "先替换为模拟数据；导出前逐字段脱敏并获得授权";
      supplement += "、敏感字段清单与批准记录";
      signals.push("启发式脱敏不能替代数据分类、预览和人工批准");
    }

    if (scale === "batch") {
      score = Math.min(score - 24, 32);
      status = "alternative";
      statusLabel = "USE OTHER TOOL";
      mode = "换用批量自动化工具";
      reason = "Selector 是交互式单次选择工具，不是批处理、持续同步或 CI runner。";
      collect = "先定义批量目标规则、数据边界和可重复 fixture";
      supplement = "日志、重试、并发、权限与回归策略";
      handoff = batchAlternatives[task];
      gate = "不要用手工书签流程伪装成可重复批处理";
      alternative = batchAlternatives[task];
      signals.push("批量规模要求可重复执行、失败恢复和机器可审计输出");
    }

    if (environment === "production" && sensitivity === "sensitive") {
      score = Math.min(score, 8);
      status = "stop";
      statusLabel = "STOP AND REVIEW";
      mode = "停止直接导出";
      reason = "敏感生产页面同时触发数据与权限闸门；当前启发式脱敏不足以支持直接复制。";
      collect = "仅记录任务描述，不采集真实页面内容";
      supplement = "用脱敏 fixture 重现目标，并完成审批与字段白名单";
      handoff = "安全负责人批准后，在隔离环境重新评估模式";
      gate = "禁止把页面报告直接发送给外部 Agent 或服务";
      alternative = "优先使用脱敏测试环境、内部 DevTools 与经批准的审计流程。";
      signals.push("生产权限与敏感数据叠加时，应先停止而不是依赖工具默认规则");
    }

    score = Math.max(0, Math.min(100, score));
    decisionResult.dataset.status = status;
    decisionResult.classList.remove("is-updated");
    void decisionResult.offsetWidth;
    decisionResult.classList.add("is-updated");
    decisionFields.status.textContent = statusLabel;
    decisionFields.score.textContent = String(score);
    decisionFields.mode.textContent = mode;
    decisionFields.reason.textContent = reason;
    decisionFields.collect.textContent = collect;
    decisionFields.supplement.textContent = supplement;
    decisionFields.handoff.textContent = handoff;
    decisionFields.gate.textContent = gate;
    decisionFields.signals.innerHTML = signals.map((signal) => `<li>${signal}</li>`).join("");
    decisionFields.alternative.textContent = alternative;
  }

  if (decisionConsole && decisionForm && decisionResult) {
    decisionForm.addEventListener("change", updateDecision);
    decisionForm.addEventListener("reset", function () {
      window.setTimeout(function () {
        updateDecision();
        if (decisionReset) decisionReset.focus({ preventScroll: true });
      }, 0);
    });
    updateDecision();
  }

  const navigationLinks = Array.from(document.querySelectorAll(".primary-nav a"));
  const observedSections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navigationLinks.forEach((link) => {
        const current = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("is-current", current);
        if (current) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-30% 0px -60%", threshold: [0, 0.2, 0.55] });
    observedSections.forEach((section) => observer.observe(section));
  }

  updateOutput(false);
})();
