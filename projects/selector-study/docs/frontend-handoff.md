# Selector 研究展厅 · 交接

## 1. 项目是什么，当前阶段是什么？

这是 R-006 `selector-study` 的交互式研究展厅，用网页解释 Selector 的能力、实现原理、六类使用场景、采用决策、扩展方向和对我们的意义。研究模拟、多场景实验台、五维决策台与锁定上游 v0.4.1 实跑页均已完成；Selector 本体的跨浏览器、框架和 Agent 对照实验仍保持“进行中”。

## 2. 完成了什么？

- 在 `showcase/` 实现了响应式明暗主题网页；
- 完成“选择目标 → instruction → 普通/Sharingan 上下文 → 模拟交给 Codex → 重置”的主流程；
- 增加产品、QA、设计复刻、内容摘录、组件源码和测试 Locator 六场景实验台，以及六种差异化输出、成本/风险/替代工具判断；
- 为场景 tabs 增加方向键、Home/End、ARIA 关系、运行反馈、Escape 重置和静态六场景 fallback；
- 增加 5 维、16 输入的采用决策台，可解释地路由到 Prompt、Sharingan、Markdown、替代工具或停止闸门；
- 为决策台增加原生 radio 键盘行为、推荐/警告/替代/停止状态、重置和四类静态 fallback；
- 用固定提交源码链接解释五步实现原理，并整理场景、六项扩展路线、采用评分和六项限制；
- 增加启动脚本、自动结构检查、三档截图、设计契约、覆盖清单和浏览器验收记录；
- 修复窄屏侧栏隐藏后键盘可能选中不可见目标的问题。
- 新增 `showcase/source-demo/` 安全 fixture，直接加载与锁定上游逐字节一致的 `editor.js` / `editor.css`；
- 浏览器真实完成 v0.4.1 启动、选择“创建活动”、添加 instruction、复制 259 字符 prompt 和关闭恢复；
- 增加运行时 SHA-256、真实 prompt、桌面运行截图、手机入口和演示壳失败实验记录。

## 3. 还剩什么，或刻意延后了什么？

网页实现与公开发布没有遗留项；commit `df4ebc3` 的 Pages run `33374938190` 已成功，三个公开入口和线上锁定运行时均验证。Chrome / Light DOM 普通主流程已有真实上游证据；研究矩阵 E3–E5 仍包括其他浏览器与 DOM 边界、真实 Agent 修改质量对照和敏感字段/侵入性实验。

## 4. 有哪些证据和验证？

- [浏览器验收](frontend-validation.md)记录 Chrome 151、三档视口、双主题、原主流程、六场景运行、五条决策路由、键盘、焦点、reduced-motion、静态 fallback 和性能观察；
- [覆盖清单](frontend-coverage.md)全部必需项为 `pass`；
- [桌面](../artifacts/showcase-desktop.png)、[平板](../artifacts/showcase-tablet.png)、[手机](../artifacts/showcase-mobile.png)完整页面截图；
- [真实运行桌面](../artifacts/source-demo-runtime.png)、[手机入口](../artifacts/source-demo-mobile.png)、[主展厅嵌入区](../artifacts/showcase-source-live.png)和[实际 prompt](../artifacts/source-demo-runtime-prompt.md)；
- `verify-showcase.mjs`、`verify-source-demo.mjs`、`verify-capabilities.mjs`、上游 `npm run check` 和仓库验证命令用于重复检查。

## 5. 下一次会话先做什么？

若继续 Selector 研究，先建立可离线重复的 Light DOM、open Shadow DOM、同源/跨域 iframe 和敏感字段 fixture，再运行 E3/E5；完成边界和安全基线后才进入 E4 Agent 效果对照。若只维护展厅，先运行 `serve-showcase.ps1` 和 `verify-showcase.mjs`，再针对变更重跑三档浏览器矩阵。

## 运行与维护

```powershell
powershell -ExecutionPolicy Bypass -File .\projects\selector-study\scripts\serve-showcase.ps1
node .\projects\selector-study\tests\verify-showcase.mjs
node .\projects\selector-study\tests\verify-source-demo.mjs
```

核心文件：`showcase/index.html`、`showcase/styles.css`、`showcase/app.js`。页面没有包管理器或构建步骤；默认端口是 4186，`?static=1` 用于运行静态阅读 fallback。
