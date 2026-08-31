import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../showcase/", import.meta.url);
const [html, css, js, experimentText, experiment2Text, projectReadme, repositoryReadme] = await Promise.all([
  readFile(new URL("index.html", root), "utf8"),
  readFile(new URL("styles.css", root), "utf8"),
  readFile(new URL("app.js", root), "utf8"),
  readFile(new URL("../experiments/real-run-01/experiment-report.json", root), "utf8"),
  readFile(new URL("../experiments/real-run-02-brand-media/experiment-report.json", root), "utf8"),
  readFile(new URL("../README.md", root), "utf8"),
  readFile(new URL("../../../README.md", root), "utf8")
]);
const experiment = JSON.parse(experimentText);
const experiment2 = JSON.parse(experiment2Text);

test("覆盖用户要求的研究段落与 Dashi 差异化实验入口", () => {
  for (const id of ["examples", "real-run", "dashi-lab", "capabilities", "mechanism", "outcomes", "demo", "audiences", "extensions"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
});

test("R-003 公开索引包含源库、在线 Web 和六个示例", () => {
  for (const content of [html, projectReadme, repositoryReadme]) assert.match(content, /R-003/);
  assert.match(projectReadme, /第 3 个研究子项目/);
  assert.match(repositoryReadme, /chuspeeism\/dashi-ppt-skill/);
  assert.match(repositoryReadme, /yydshly\.github\.io\/0830_1_codex_project\/projects\/dashi-ppt-skill-study\/showcase/);
  assert.equal((html.match(/class="example-card/g) || []).length, 6);
  assert.equal((html.match(/data-example-scenario=/g) || []).length, 4);
  assert.match(js, /setupExampleAtlas/);
});

test("真实运行审计台连接 8×3+1 产物与可复现报告", () => {
  assert.equal((html.match(/data-real-page="/g) || []).length, 8);
  assert.equal((html.match(/data-real-variant="/g) || []).length, 4);
  for (const output of ["selected-v4.pptx", "selected-v4.pdf", "comparison.pptx", "experiment-report.json"]) assert.match(html, new RegExp(output.replaceAll(".", "\\.")));
  assert.equal(experiment.input.logicalSlides, 8);
  assert.equal(experiment.exports.comparison.slideCount, 32);
  assert.equal(experiment.exports.selectedV4.slideCount, 8);
  assert.equal(experiment.exports.selectedV4.objects.text, 118);
  assert.equal(experiment.presentationQa.selectedV4.status, "passed");
  assert.equal(experiment.reproducibility.byteIdentical, true);
  assert.equal(experiment.contracts.contentMapCanonicalRoots, true);
  assert.match(js, /realRunPages/);
  assert.match(js, /slide-\$\{physical\}\.png/);
});

test("第二轮真实实验公开品牌、媒体、图表与直接编程对照", () => {
  assert.equal((html.match(/data-run02-route=/g) || []).length, 2);
  assert.equal((html.match(/data-run02-page=/g) || []).length, 8);
  for (const output of ["dashi-brand-media-selected-v4.pptx", "dashi-brand-media-selected-v4.pdf", "dashi-brand-media-comparison.pptx", "direct-programmatic-baseline.pptx"]) assert.match(html, new RegExp(output.replaceAll(".", "\\.")));
  assert.equal(experiment2.scenario.logicalSlides, 8);
  assert.equal(experiment2.input.generatedMedia.count, 1);
  assert.equal(experiment2.exports.comparison.slideCount, 32);
  assert.equal(experiment2.exports.selectedV4.objects.total, 203);
  assert.equal(experiment2.exports.directProgrammaticBaseline.objects.nativeCharts, 1);
  assert.equal(experiment2.presentationQa.selectedV4.status, "passed");
  assert.equal(experiment2.brandAndEditability.dashiTheme03.brandFidelity, "approximate");
  assert.equal(experiment2.brandAndEditability.directProgrammaticBaseline.brandFidelity, "exact-for-the-requested-palette");
});

test("补全源码证据账本、替代方案比较与采用评估闭环", () => {
  for (const id of ["evidence", "comparison", "adoption"]) assert.match(html, new RegExp(`id=["']${id}["']`));
  assert.equal((html.match(/data-evidence-status=/g) || []).length, 8);
  assert.equal((html.match(/class="comparison-card/g) || []).length, 4);
  assert.equal((html.match(/data-adoption-factor=/g) || []).length, 6);
  for (const outcome of ["建议进入受控试点", "建议有条件试点", "暂不建议进入生产"]) assert.match(js, new RegExp(outcome));
});

test("完整样例包含四个实际场景、每场景九页和四条设计路线", () => {
  assert.equal((html.match(/data-scenario=/g) || []).length, 4);
  for (const scenario of ["研究咨询", "季度经营复盘", "企业培训", "项目方案路演"]) assert.match(html + js, new RegExp(scenario));
  for (const uniqueSlide of ["建议与门槛", "责任与目标", "行为承诺", "试点决策"]) assert.match(js, new RegExp(uniqueSlide));
  const noscript = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] || "";
  assert.equal((noscript.match(/<li>/g) || []).length, 36);
  assert.equal((html.match(/data-variant=/g) || []).length, 4);
});

test("覆盖七类受众和三档扩展周期", () => {
  assert.equal((html.match(/data-audience=/g) || []).length, 7);
  for (const horizon of ["near", "mid", "long"]) assert.match(html, new RegExp(`data-horizon=["']${horizon}["']`));
});

test("证据状态和演示边界在页面中可见", () => {
  for (const label of ["已核验", "上游自述", "交互模拟", "待验证"]) assert.match(html + js, new RegExp(label));
  assert.match(html, /不冒充真实客户案例或上游导出成品/);
});

test("页面是零外部依赖的静态实现", () => {
  assert.doesNotMatch(html, /\bsrc=["']https?:\/\//i);
  assert.doesNotMatch(html, /<link\b[^>]*\bhref=["']https?:\/\//i);
  assert.doesNotMatch(html, /<iframe\b/i);
  assert.match(html, /\.\/styles\.css/);
  assert.match(html, /\.\/app\.js/);
});

test("键盘、主题、渐进增强和 reduced-motion 契约存在", () => {
  assert.match(js, /ArrowRight/);
  assert.match(js, /aria-selected/);
  assert.match(html, /data-theme-toggle/);
  assert.match(html, /<noscript>/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
});

test("移动导航和复制反馈具有可验证的可访问状态", () => {
  assert.match(html, /data-mobile-menu-toggle/);
  assert.match(html, /aria-modal="true"/);
  assert.match(js, /event\.key === "Escape"/);
  assert.match(js, /target\.inert = true/);
  assert.match(html, /data-copy-decision/);
  assert.match(js, /决策摘要已复制/);
});

test("场景切换同步内容状态并保持模拟数据边界", () => {
  assert.match(js, /scenarioDecks/);
  assert.match(js, /applyScenario/);
  assert.match(js, /updateScenarioUI/);
  assert.match(js, /data-story-list/);
  assert.match(js, /模拟数据/);
  assert.match(html, /所有业务数字均为演示数据/);
});

test("Dashi 机制实验台展示容量筛选、3+1 与内容一致性", () => {
  assert.match(html, /data-dashi-lab/);
  assert.equal((html.match(/data-lab-preset=/g) || []).length, 3);
  assert.equal((html.match(/data-lab-variant=/g) || []).length, 4);
  assert.equal((html.match(/data-status="(?:pass|reject)"/g) || []).length, 5);
  for (const control of ["data-lab-items", "data-lab-number-count", "data-lab-media-toggle"]) assert.match(html, new RegExp(control));
  for (const mechanism of ["canonical content", "容量约束", "全稿分配", "contentMap", "截图回退"]) assert.match(html + js, new RegExp(mechanism, "i"));
  assert.match(js, /contentFingerprint/);
  assert.match(js, /labLayouts/);
  assert.match(js, /REJECT/);
});

test("场景样例用机制追踪和 3+1 语义解释每一页", () => {
  for (const field of ["data-trace-content", "data-trace-layout", "data-trace-allocation", "data-trace-export"]) assert.match(html, new RegExp(field));
  for (const label of ["模板候选 A", "模板候选 B", "模板候选 C", "Agent 定制"]) assert.match(html + js, new RegExp(label));
  assert.match(js, /slideTraceProfiles/);
  assert.match(js, /复用惩罚已计入/);
});
