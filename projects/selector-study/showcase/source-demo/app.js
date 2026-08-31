(function () {
  "use strict";

  const launchButton = document.querySelector("[data-launch-selector]");
  const runtimeState = document.querySelector("[data-runtime-state]");
  const runtimeLabel = document.querySelector("[data-runtime-label]");
  const launchHelp = document.querySelector("[data-launch-help]");
  const pasteOutput = document.querySelector("[data-paste-output]");
  const pasteChars = document.querySelector("[data-paste-chars]");
  const pasteLines = document.querySelector("[data-paste-lines]");
  const clearPaste = document.querySelector("[data-clear-paste]");
  let loading = false;

  function editorIsActive() {
    return Boolean(document.querySelector(".ai-editor-root"));
  }

  function setRuntimeState(state, message) {
    if (runtimeState.dataset.runtimeState === state && runtimeLabel.textContent === message) return;
    runtimeState.dataset.runtimeState = state;
    runtimeLabel.textContent = message;
    launchButton.dataset.state = state;
    if (state === "active") {
      launchButton.querySelector("span").textContent = "Selector 正在运行";
      launchButton.querySelector("b").textContent = "●";
      launchHelp.textContent = "现在点击页面元素；右下角绿色面板和选框均来自上游运行时。";
    } else if (state === "loading") {
      launchButton.querySelector("span").textContent = "正在加载锁定源码…";
      launchButton.querySelector("b").textContent = "···";
    } else {
      launchButton.querySelector("span").textContent = "启动真实 Selector";
      launchButton.querySelector("b").textContent = "↗";
      launchHelp.textContent = "加载本项目内已锁定并校验哈希的源码构建产物。";
    }
  }

  function activateSelector() {
    if (editorIsActive()) {
      if (typeof window.__SELECTOR_ON_REACTIVATE__ === "function") {
        window.__SELECTOR_ON_REACTIVATE__();
      }
      setRuntimeState("active", "上游 Selector v0.4.1 正在运行");
      return;
    }
    if (loading) return;
    loading = true;
    setRuntimeState("loading", "正在加载锁定上游构建产物");

    const script = document.createElement("script");
    script.src = "runtime/selector-0.4.1.js";
    script.dataset.selectorUpstreamRuntime = "0.4.1";
    script.addEventListener("load", function () {
      loading = false;
      window.setTimeout(function () {
        setRuntimeState(editorIsActive() ? "active" : "error", editorIsActive() ? "上游 Selector v0.4.1 正在运行" : "运行时已载入，但控制面板未出现");
      }, 0);
    });
    script.addEventListener("error", function () {
      loading = false;
      setRuntimeState("error", "上游运行时加载失败，请刷新后重试");
      launchHelp.textContent = "请确认 runtime/selector-0.4.1.js 可访问。";
    });
    document.body.append(script);
  }

  function updatePasteMetrics() {
    const value = pasteOutput.value;
    pasteChars.textContent = String(value.length);
    pasteLines.textContent = String(value ? value.split(/\r?\n/).length : 0);
  }

  function mirrorCopiedText(text) {
    if (typeof text !== "string" || !text) return;
    window.__SELECTOR_DEMO_LAST_COPY__ = text;
    pasteOutput.value = text;
    updatePasteMetrics();
  }

  function installCopyMirror() {
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") return false;
      const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
      Object.defineProperty(navigator.clipboard, "writeText", {
        configurable: true,
        value: async function (text) {
          mirrorCopiedText(String(text || ""));
          return originalWriteText(text);
        },
      });
      return true;
    } catch (_) {
      return false;
    }
  }

  launchButton.addEventListener("click", activateSelector);
  pasteOutput.addEventListener("input", updatePasteMetrics);
  clearPaste.addEventListener("click", function () {
    pasteOutput.value = "";
    updatePasteMetrics();
    pasteOutput.focus();
  });

  function reconcileRuntimeState() {
    if (loading) return;
    if (editorIsActive()) setRuntimeState("active", "上游 Selector v0.4.1 正在运行");
    else if (runtimeState.dataset.runtimeState === "active") setRuntimeState("idle", "Selector 已关闭；可粘贴并核对输出");
  }

  const observer = new MutationObserver(function () {
    window.setTimeout(reconcileRuntimeState, 0);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.setInterval(reconcileRuntimeState, 750);
  installCopyMirror();
}());
