import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readDemo = (name) => readFile(resolve(projectRoot, "demo", name), "utf8");

test("研究网页覆盖用户要求的五类内容", async () => {
  const html = await readDemo("index.html");
  for (const section of ["capabilities", "mechanism", "scenes", "extensions", "meaning"]) {
    assert.match(html, new RegExp(`id=["']${section}["']`), `缺少 #${section} 章节`);
  }
  assert.match(html, /不是训练模型权重/);
  assert.match(html, /对我们的意义/);
});

test("最佳场景包含五步推演和人工审核的两条分支", async () => {
  const [html, script] = await Promise.all([readDemo("index.html"), readDemo("app.js")]);
  assert.equal((html.match(/data-step=/g) ?? []).length, 5);
  for (const id of ["run-demo", "next-step", "accept-edit", "reject-edit", "reset-demo"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `缺少 #${id}`);
  }
  assert.match(script, /finishReview\("accepted"\)/);
  assert.match(script, /finishReview\("rejected"\)/);
  assert.match(script, /event\.key === "Escape"/);
});

test("真实历史实测区展示五阶段、派生数据与单会话停止门槛", async () => {
  const [html, script, evidenceText] = await Promise.all([
    readDemo("index.html"),
    readDemo("app.js"),
    readFile(resolve(projectRoot, "artifacts", "real-codex-session-analysis.json"), "utf8"),
  ]);
  const evidence = JSON.parse(evidenceText);

  assert.match(html, /id="real-session"/);
  assert.equal((html.match(/data-real-step=/g) ?? []).length, 5);
  for (const id of ["run-real-demo", "next-real-step", "reset-real-demo", "real-stage-panel", "real-gate"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `缺少 #${id}`);
  }
  assert.match(html, /1\s*&lt;\s*2\s*·\s*HOLD/);
  assert.match(html, /0<\/strong> 次外部模型调用/);
  assert.match(html, /0<\/strong> 个规则文件写入/);
  assert.match(html, new RegExp(evidence.scope.fingerprint.replace(":", ":")));
  assert.match(html, new RegExp(String(evidence.deterministicPipeline.normalizedEvents)));
  assert.match(script, new RegExp(String(evidence.deterministicPipeline.compressionPercent).replace(".", "\\.")));
  assert.match(script, new RegExp(String(evidence.deterministicPipeline.toolCalls)));

  assert.match(script, /window\.__realHistoryState/);
  assert.match(script, /externalModelCalled:\s*false/);
  assert.match(script, /filesWritten:\s*0/);
  assert.match(script, /result:\s*"HOLD"/);
  for (const key of ["ArrowLeft", "ArrowRight", "Home", "End"]) assert.match(script, new RegExp(key));

  assert.doesNotMatch(html + script, /rollout-20\d{2}/i);
  assert.doesNotMatch(html + script, /D:\\codex\\home/i);
  assert.doesNotMatch(html + script, /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i);
});

test("使用场景地图区分成熟度并声明落地条件", async () => {
  const [html, script] = await Promise.all([readDemo("index.html"), readDemo("app.js")]);
  assert.equal((html.match(/data-scene-card(?:\s|>)/g) ?? []).length, 12);
  assert.equal((html.match(/data-scene-tier="native"/g) ?? []).length, 4);
  assert.equal((html.match(/data-scene-tier="adjacent"/g) ?? []).length, 4);
  assert.equal((html.match(/data-scene-tier="domain"/g) ?? []).length, 4);
  assert.equal((html.match(/data-scene-filter=/g) ?? []).length, 4);
  for (const label of ["证据输入", "记忆写回", "可观察收益", "前置条件"]) {
    assert.equal((html.match(new RegExp(`<dt>${label}</dt>`, "g")) ?? []).length, 12, `${label} 应覆盖每个场景`);
  }
  assert.match(script, /window\.__sceneState/);
  assert.match(script, /ArrowLeft/);
  assert.match(script, /aria-pressed/);
  assert.match(script, /requestAnimationFrame\(updateActiveNav\)/);
});

test("页面具备主题、键盘焦点和低动态适配", async () => {
  const [html, styles, script] = await Promise.all([
    readDemo("index.html"),
    readDemo("styles.css"),
    readDemo("app.js"),
  ]);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(script, /localStorage/);
  assert.match(script, /window\.__demoState/);
  assert.match(script, /window\.__consoleErrors/);
});
