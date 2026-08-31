(() => {
  const consoleErrors = [];
  const originalConsoleError = console.error.bind(console);
  console.error = (...args) => {
    consoleErrors.push(args.map(String).join(" "));
    originalConsoleError(...args);
  };
  window.addEventListener("error", (event) => consoleErrors.push(event.message || "window error"));
  window.addEventListener("unhandledrejection", (event) => consoleErrors.push(String(event.reason)));
  window.__consoleErrors = consoleErrors;

  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-toggle");
  const themeLabel = document.querySelector(".theme-label");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function readStoredTheme() {
    try {
      return localStorage.getItem("backpass-demo-theme");
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem("backpass-demo-theme", theme);
    } catch {
      // Storage can be unavailable in restricted browser contexts; the current page still works.
    }
  }

  function setTheme(theme, persist = true) {
    const next = theme === "dark" ? "dark" : "light";
    root.dataset.theme = next;
    themeButton.setAttribute("aria-pressed", String(next === "dark"));
    themeButton.setAttribute("aria-label", next === "dark" ? "切换到浅色主题" : "切换到深色主题");
    themeLabel.textContent = next === "dark" ? "浅色" : "深色";
    themeMeta.setAttribute("content", next === "dark" ? "#101512" : "#f3f0e7");
    if (persist) storeTheme(next);
  }

  setTheme(readStoredTheme() || (prefersDark.matches ? "dark" : "light"), false);
  themeButton.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

  const realHistorySteps = [
    {
      state: "DISCOVER",
      kicker: "Step 1 · upstream deterministic",
      title: "从大量历史中，只读取选定的这一条",
      copy: "Codex adapter 识别 session_meta，再把消息与工具调用规范化。网页只保留不可逆指纹和统计，不保存原文与本机路径。",
      data: [
        ["原始体积", "5.04 MiB"],
        ["规范化事件", "175"],
        ["选中历史", "1"],
      ],
    },
    {
      state: "ASSOCIATE",
      kicker: "Step 2 · upstream deterministic",
      title: "证明它确实属于当前研究仓库",
      copy: "会话工作目录与仓库根精确匹配，且记录的 Git commit 能在当前仓库解析；严格模式得到 Tier 1 / exact。",
      data: [
        ["归属层级", "Tier 1"],
        ["工作目录", "exact"],
        ["Git commit", "resolvable"],
      ],
    },
    {
      state: "DISTILL",
      kicker: "Step 3 · upstream deterministic",
      title: "把 5.04 MiB 过程记录压成 25.8 KiB 轨迹",
      copy: "distill 保留用户与 Agent 消息，工具输入/输出压成一行，并调用正则脱敏。99.5% 是字节缩减，不代表内容已经匿名化。",
      data: [
        ["压缩后", "25.8 KiB"],
        ["字节缩减", "99.5%"],
        ["工具调用", "147"],
      ],
    },
    {
      state: "SIGNAL",
      kicker: "Step 4 · researcher interpretation",
      title: "压缩轨迹让一个过程摩擦变得可复核",
      copy: "本次没有调用 Backpass 的 LLM 分析。研究者只标出候选：固定展示端口在交付末段冲突，导致端口迁移和部分复验；这还不是规则结论。",
      data: [
        ["候选摩擦", "1"],
        ["正向做法", "1"],
        ["判读来源", "研究者"],
      ],
      observation: true,
    },
    {
      state: "HOLD",
      kicker: "Step 5 · mechanical evidence gate",
      title: "一条历史只能形成候选，不能毕业为新规则",
      copy: "Backpass 对新 gap 的默认证据下限是两个独立会话。当前 1 < 2，因此停止；没有提案，也没有修改任何项目记忆。",
      data: [
        ["独立会话", "1"],
        ["默认门槛", "≥ 2"],
        ["提案", "0"],
      ],
      gate: true,
    },
  ];

  const realSection = document.querySelector("#real-session");
  const realTabs = [...document.querySelectorAll("[data-real-step]")];
  const realStateLabel = document.querySelector("#real-state");
  const realPanel = document.querySelector("#real-stage-panel");
  const realKicker = document.querySelector("#real-stage-kicker");
  const realTitle = document.querySelector("#real-stage-title");
  const realCopy = document.querySelector("#real-stage-copy");
  const realMetrics = document.querySelector("#real-stage-metrics");
  const realObservation = document.querySelector("#real-observation");
  const realGate = document.querySelector("#real-gate");
  const runRealButton = document.querySelector("#run-real-demo");
  const nextRealButton = document.querySelector("#next-real-step");
  const resetRealButton = document.querySelector("#reset-real-demo");
  let realStep = -1;
  let realRunning = false;
  let realRunToken = 0;

  function realPublicState(state = "READY") {
    window.__realHistoryState = {
      step: realStep,
      state,
      gate: { observed: 1, required: 2, result: "HOLD" },
      externalModelCalled: false,
      filesWritten: 0,
    };
  }

  function renderRealMetrics(data) {
    realMetrics.replaceChildren(
      ...data.map(([label, value]) => {
        const item = document.createElement("div");
        const labelNode = document.createElement("span");
        const valueNode = document.createElement("strong");
        labelNode.textContent = label;
        valueNode.textContent = value;
        item.append(labelNode, valueNode);
        return item;
      }),
    );
  }

  function renderRealStep(index) {
    const safeIndex = Math.max(0, Math.min(index, realHistorySteps.length - 1));
    const step = realHistorySteps[safeIndex];
    realStep = safeIndex;
    realStateLabel.textContent = step.state;
    realKicker.textContent = step.kicker;
    realTitle.textContent = step.title;
    realCopy.textContent = step.copy;
    renderRealMetrics(step.data);
    realObservation.hidden = !step.observation;
    realGate.hidden = !step.gate;

    realTabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === safeIndex;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (tabIndex < safeIndex) tab.dataset.complete = "true";
      else delete tab.dataset.complete;
    });
    realPanel.setAttribute("aria-labelledby", realTabs[safeIndex].id);
    realPublicState(step.state);
  }

  function waitForRealStep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async function runRealHistory() {
    if (realRunning) return;
    realRunning = true;
    const token = ++realRunToken;
    runRealButton.disabled = true;
    nextRealButton.disabled = true;
    resetRealButton.disabled = true;
    const delay = reducedMotion.matches ? 50 : 620;

    for (let index = 0; index < realHistorySteps.length; index += 1) {
      if (token !== realRunToken) break;
      renderRealStep(index);
      if (index < realHistorySteps.length - 1) await waitForRealStep(delay);
    }

    realRunning = false;
    runRealButton.disabled = false;
    nextRealButton.disabled = false;
    resetRealButton.disabled = false;
  }

  function resetRealHistory({ focus = false } = {}) {
    realRunToken += 1;
    realRunning = false;
    realStep = -1;
    realStateLabel.textContent = "READY";
    realKicker.textContent = "等待运行 · no raw transcript";
    realTitle.textContent = "先看真实输入怎样被缩成证据";
    realCopy.textContent = "点击“自动演示”连续查看五个阶段，或直接选择上方任一步。所有展示值都来自脱敏派生证据。";
    renderRealMetrics([
      ["样本", "1"],
      ["模型调用", "0"],
      ["规则写入", "0"],
    ]);
    realObservation.hidden = true;
    realGate.hidden = true;
    realTabs.forEach((tab, index) => {
      delete tab.dataset.complete;
      tab.setAttribute("aria-selected", String(index === 0));
      tab.tabIndex = index === 0 ? 0 : -1;
    });
    realPanel.setAttribute("aria-labelledby", realTabs[0].id);
    runRealButton.disabled = false;
    nextRealButton.disabled = false;
    resetRealButton.disabled = false;
    realPublicState();
    if (focus) runRealButton.focus({ preventScroll: true });
  }

  runRealButton.addEventListener("click", runRealHistory);
  nextRealButton.addEventListener("click", () => renderRealStep(realStep >= realHistorySteps.length - 1 ? 0 : realStep + 1));
  resetRealButton.addEventListener("click", () => resetRealHistory({ focus: true }));
  realTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => renderRealStep(Number(tab.dataset.realStep)));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? realTabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + realTabs.length) % realTabs.length;
      renderRealStep(nextIndex);
      realTabs[nextIndex].focus();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && realStep >= 0 && realSection.contains(document.activeElement)) {
      resetRealHistory({ focus: true });
    }
  });
  resetRealHistory();

  const sceneButtons = [...document.querySelectorAll("[data-scene-filter]")];
  const sceneCards = [...document.querySelectorAll("[data-scene-card]")];
  const sceneCount = document.querySelector("#scene-count");

  function setSceneFilter(requestedFilter) {
    if (!sceneButtons.length || !sceneCards.length || !sceneCount) return;
    const validFilters = new Set(["all", ...sceneCards.map((card) => card.dataset.sceneTier)]);
    const filter = validFilters.has(requestedFilter) ? requestedFilter : "all";
    let visible = 0;

    sceneCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.sceneTier === filter;
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    sceneButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.sceneFilter === filter)));
    sceneCount.textContent = `显示 ${visible} / ${sceneCards.length} 个场景`;
    window.__sceneState = { filter, visible, total: sceneCards.length };
  }

  sceneButtons.forEach((button, index) => {
    button.addEventListener("click", () => setSceneFilter(button.dataset.sceneFilter));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? sceneButtons.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + sceneButtons.length) % sceneButtons.length;
      sceneButtons[nextIndex].focus();
      setSceneFilter(sceneButtons[nextIndex].dataset.sceneFilter);
    });
  });
  setSceneFilter("all");

  const steps = [
    {
      state: "COLLECT",
      kicker: "Step 1 · collect samples",
      title: "找到属于这个仓库的三次会话",
      copy: "工作目录与 Git remote 将样本关联到当前仓库。严格模式只接受可确定归属的会话。",
      data: [
        ["扫描样本", "3"],
        ["确定归属", "3"],
        ["弱关联", "0"],
      ],
    },
    {
      state: "DISTILL",
      kicker: "Step 2 · deterministic distillation",
      title: "先去掉工具噪声，再让模型阅读",
      copy: "用户与 Agent 消息保留原文，工具输出压成摘要，明显 Token 被正则脱敏；真实产品还允许按需打开原始会话。",
      data: [
        ["原始体积", "184 KB"],
        ["压缩后", "7.1 KB"],
        ["减少", "96%"],
      ],
    },
    {
      state: "LOSS",
      kicker: "Step 3 · calculate loss",
      title: "识别出同一个未覆盖缺口",
      copy: "S-01 与 S-02 都缺少“完成研究后运行验证并记录结果”的项目级指令；S-03 说明这个动作可执行。",
      data: [
        ["正向证据", "1"],
        ["规则缺口", "2"],
        ["原文引用", "2"],
      ],
    },
    {
      state: "AGGREGATE",
      kicker: "Step 4 · aggregate gradients",
      title: "两次会话越过新增规则门槛",
      copy: "缺口账本按不同会话去重计数。默认门槛是 2：一次偶发失败不会直接进入建议。",
      data: [
        ["独立会话", "2"],
        ["门槛", "≥ 2"],
        ["可建议缺口", "1"],
      ],
    },
    {
      state: "REVIEW",
      kicker: "Step 5 · propose under budget",
      title: "生成一项可接受、也可拒绝的修改",
      copy: "高推理模型只编辑暂存副本；Backpass 从真实 diff 测量修改，并把两条会话引用附到审核卡片。",
      data: [
        ["修改", "1"],
        ["证据会话", "2"],
        ["Token Δ", "+ 28"],
      ],
      diff: true,
      review: true,
    },
  ];

  const stepButtons = [...document.querySelectorAll("[data-step]")];
  const stateLabel = document.querySelector("#console-state");
  const progressFill = document.querySelector("#progress-fill");
  const outputKicker = document.querySelector("#output-kicker");
  const outputTitle = document.querySelector("#output-title");
  const outputCopy = document.querySelector("#output-copy");
  const outputData = document.querySelector("#output-data");
  const diffBlock = document.querySelector("#diff-block");
  const reviewActions = document.querySelector("#review-actions");
  const runButton = document.querySelector("#run-demo");
  const nextButton = document.querySelector("#next-step");
  const resetButton = document.querySelector("#reset-demo");
  const acceptButton = document.querySelector("#accept-edit");
  const rejectButton = document.querySelector("#reject-edit");
  const outcome = document.querySelector("#demo-outcome");
  const outcomeLabel = document.querySelector("#outcome-label");
  const outcomeTitle = document.querySelector("#outcome-title");
  const outcomeCopy = document.querySelector("#outcome-copy");

  let currentStep = -1;
  let running = false;
  let runToken = 0;

  function renderData(data) {
    outputData.replaceChildren(
      ...data.map(([label, value]) => {
        const item = document.createElement("div");
        const labelNode = document.createElement("span");
        const valueNode = document.createElement("strong");
        labelNode.textContent = label;
        valueNode.textContent = value;
        item.append(labelNode, valueNode);
        return item;
      }),
    );
  }

  function renderStep(index) {
    const safeIndex = Math.max(0, Math.min(index, steps.length - 1));
    const step = steps[safeIndex];
    currentStep = safeIndex;
    stateLabel.textContent = step.state;
    outputKicker.textContent = step.kicker;
    outputTitle.textContent = step.title;
    outputCopy.textContent = step.copy;
    renderData(step.data);
    diffBlock.hidden = !step.diff;
    reviewActions.hidden = !step.review;
    progressFill.style.width = `${((safeIndex + 1) / steps.length) * 100}%`;
    outcome.hidden = true;

    stepButtons.forEach((button, buttonIndex) => {
      if (buttonIndex === safeIndex) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
      if (buttonIndex < safeIndex) button.dataset.complete = "true";
      else delete button.dataset.complete;
    });
    window.__demoState = { step: safeIndex, state: step.state, outcome: null };
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async function runAll() {
    if (running) return;
    running = true;
    const token = ++runToken;
    runButton.disabled = true;
    nextButton.disabled = true;
    resetButton.disabled = true;
    outcome.hidden = true;
    const delay = reducedMotion.matches ? 50 : 620;

    for (let index = 0; index < steps.length; index += 1) {
      if (token !== runToken) break;
      renderStep(index);
      if (index < steps.length - 1) await wait(delay);
    }

    running = false;
    runButton.disabled = false;
    nextButton.disabled = false;
    resetButton.disabled = false;
    if (!reviewActions.hidden) acceptButton.focus({ preventScroll: true });
  }

  function resetDemo({ focus = false } = {}) {
    runToken += 1;
    running = false;
    currentStep = -1;
    stateLabel.textContent = "READY";
    outputKicker.textContent = "等待运行";
    outputTitle.textContent = "一次小步，而不是重写整份规则";
    outputCopy.textContent = "点击“运行反向步骤”，观察三次研究会话如何变成一条有引用、有门槛、可拒绝的规则建议。";
    renderData([
      ["样本", "3"],
      ["重复缺口", "0"],
      ["待审核修改", "0"],
    ]);
    diffBlock.hidden = true;
    reviewActions.hidden = true;
    outcome.hidden = true;
    progressFill.style.width = "0";
    runButton.disabled = false;
    nextButton.disabled = false;
    resetButton.disabled = false;
    stepButtons.forEach((button, index) => {
      delete button.dataset.complete;
      if (index === 0) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    window.__demoState = { step: -1, state: "READY", outcome: null };
    if (focus) runButton.focus({ preventScroll: true });
  }

  function finishReview(type) {
    const accepted = type === "accepted";
    stateLabel.textContent = accepted ? "ACCEPTED" : "REJECTED";
    reviewActions.hidden = true;
    outcome.hidden = false;
    outcome.dataset.outcome = type;
    outcome.querySelector(".outcome-icon").textContent = accepted ? "✓" : "×";
    outcomeLabel.textContent = accepted ? "已接受" : "已拒绝";
    outcomeTitle.textContent = accepted ? "规则进入下一次 Agent 会话" : "仓库保持不变，拒绝理由被记住";
    outcomeCopy.textContent = accepted
      ? "写入前仍会检查文件是否变化、修改组合是否完整以及 Token 预算是否满足。"
      : "同一项建议不会在没有新证据时反复出现；这一次没有任何文件被写入。";
    window.__demoState = { step: currentStep, state: stateLabel.textContent, outcome: type };
    outcome.setAttribute("tabindex", "-1");
    outcome.focus({ preventScroll: true });
  }

  runButton.addEventListener("click", runAll);
  nextButton.addEventListener("click", () => renderStep(currentStep >= steps.length - 1 ? 0 : currentStep + 1));
  resetButton.addEventListener("click", () => resetDemo({ focus: true }));
  acceptButton.addEventListener("click", () => finishReview("accepted"));
  rejectButton.addEventListener("click", () => finishReview("rejected"));
  stepButtons.forEach((button) => button.addEventListener("click", () => renderStep(Number(button.dataset.step))));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && (!reviewActions.hidden || !outcome.hidden)) resetDemo({ focus: true });
  });

  const observedSections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".site-nav a")];
  let navFrame = 0;
  function updateActiveNav() {
    navFrame = 0;
    const readingLine = window.scrollY + Math.min(180, window.innerHeight * 0.28);
    const active = observedSections.reduce(
      (current, section) => (section.offsetTop <= readingLine ? section : current),
      observedSections[0],
    );
    navLinks.forEach((link) => {
      if (active && link.getAttribute("href") === `#${active.id}`) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  function requestNavUpdate() {
    if (!navFrame) navFrame = window.requestAnimationFrame(updateActiveNav);
  }

  window.addEventListener("scroll", requestNavUpdate, { passive: true });
  window.addEventListener("resize", requestNavUpdate);
  updateActiveNav();

  resetDemo();
})();
