# Solo Skills 研究展厅 · 交接说明

## 项目和当前阶段

`showcase/` 是 R-007（第 7 个研究子项目）的零依赖中文交互研究展厅。Revision 6 的设计、实现、本地/线上浏览器验证和 GitHub Pages 交付记录已经闭合，Coverage manifest 没有未完成项。

## 已完成

- 沿“能力 → 实现原理 → 使用场景 → 七案例实验室 → 可扩展方向 → 对我们的意义”组织研究内容；
- 完整列出 26 个技能，并按知识型、脚本增强型、环境耦合型筛选；
- 在逐项清单前用 8 个结果域汇总全库能力，数量分布为 4/3/5/5/4/2/2/1，合计 26；
- 为全部 26 个 Skill 提供“一句话能力”，用业务结果解释它能完成什么，同时保留原名、成熟类型和业务域；
- 用五步交互解释 Agent Skills 的渐进加载与执行护栏；
- 以当前仓库文件、固定 SHA、测试和本地 URL 运行真实研究交付旗舰案例；
- 提供会议运营、Skill 设计、演示视频、内容发布、每日情报和安全清理六个扩展案例，每个都有完整输入、五阶段轨迹、产物、依赖、副作用和门禁；
- 为七个目标场景提供可直接发给 Agent 的自然语言请求，并明确用户材料、Skill 规程、运行时工具与最终效果；
- “按这个请求运行演示”会把所选调用请求映射到对应确定性状态机，便于逐阶段观察；
- 使用当前真实研究网页完成 `web-demo-video` 场景：同源 DOM 实测、真实 MouseEvent、640 帧、FFmpeg、ffprobe、代表帧目检与临时帧清理全部闭环；
- 视频案例内可直接播放 32 秒、1920×1080、H.264/yuv420p 无声 MP4，并打开结构化渲染证据；
- 七个案例分别得到 READY、HOLD、SETUP、DRY RUN 或 REVIEW；视频本地媒体已经 READY，消息发送、删除和平台发布等外部动作仍保持关闭；
- 保留固定 commit 源码、研究说明和基线证据链接；
- 完成静态契约、媒体探针、三视口 Chromium 验收、播放器元数据检查、最终截图和视频接触表。

## 公开交付状态

- 研究源码：[GitHub · R-007 项目目录](https://github.com/yydshly/0830_1_codex_project/tree/main/projects/solo-skills-study)；
- 在线研究页：[GitHub Pages · R-007](https://yydshly.github.io/0830_1_codex_project/projects/solo-skills-study/)；
- 在线 Web：[能力、原理、七案例与扩展演示](https://yydshly.github.io/0830_1_codex_project/projects/solo-skills-study/showcase/)；
- 真实视频：[32 秒 1080p MP4](https://yydshly.github.io/0830_1_codex_project/projects/solo-skills-study/showcase/media/solo-skills-real-demo.mp4)；
- 发布证据：[研究提交 `d2f8e67`](https://github.com/yydshly/0830_1_codex_project/commit/d2f8e6702b0c4568ebd038f7350ce79baecbed66)、[仓库检查 33371045085](https://github.com/yydshly/0830_1_codex_project/actions/runs/33371045085)、[Pages 33371045153](https://github.com/yydshly/0830_1_codex_project/actions/runs/33371045153)；
- 公开端点均返回 HTTP 200；线上 Chromium 在 1440、768、390px 完成七案例、键盘、主题、reduced-motion 和视频播放复验，错误为 0。

## 如何使用

在仓库根目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\projects\solo-skills-study\scripts\serve-showcase.ps1
```

然后打开 `http://127.0.0.1:4192/?case=video#demo`，页面会直接选中“演示视频”。在真实交付卡播放成品，再点击“按这个请求运行演示”观察输入、计划、执行、验证和门禁。页面无需安装前端依赖；它不会在浏览时重新调用 FFmpeg，也不调用模型、Notion、Discord、Threads 或其他外部 API。

需要复现视频时，先启动上述服务，再设置 Playwright 路径并执行：

```powershell
$env:WORKSPACE_NODE_MODULES = '<包含 playwright 的 node_modules>'
node .\projects\solo-skills-study\scripts\render-real-demo.mjs --smoke
node .\projects\solo-skills-study\scripts\render-real-demo.mjs
```

## 关键设计判断

- 页面定位为研究档案与操作台，不伪装成 Solo Skills 的官方产品页面；
- 首屏先说明“过程知识库，不是 Agent 框架”，避免能力边界误读；
- 26 个技能保持完整，但用筛选控制信息密度；
- 能力阅读顺序改为“8 类工作结果 → 26 条一句话能力 → 知识/脚本/耦合边界”，避免从文件名和实现术语开始解释；
- 真实研究交付选择为旗舰场景，因为它直接使用本项目可复核证据；会议纪要保留为最清楚展示“证据不足就暂停”的扩展案例；
- 调用说明采用“目标 → 自然语言请求 → 你提供 / Skill / 环境 / 效果”，避免把 Skill 误解为自带账号、工具和权限的独立应用；
- 案例统一采用“契约 → 输入 → 计划 → 执行 → 验证 → 门禁”，但不强行得到相同成功终态；
- 上游事实、本地证据、研究判断和模拟演示使用不同标签；
- 核心信息不依赖 JavaScript，动画不承担唯一含义。

## 维护入口

- `showcase/index.html`：研究内容、26 技能、证据链接和语义结构；
- `showcase/styles.css`：档案式视觉、主题、响应式、焦点与 reduced-motion；
- `showcase/case-data.js`：七个案例的目标调用契约、真实/脱敏输入、Skill 栈、五阶段产物和门禁；
- `showcase/app.js`：筛选、原理、场景、主题、调用指南同步、案例切换和确定性状态机；
- `showcase/video-stage.html`：32 秒同源确定性视频舞台；
- `showcase/media/`：最终 MP4、海报和浏览器可读 evidence；
- `scripts/render-real-demo.mjs`：Chromium 帧捕获、FFmpeg 编码、ffprobe 断言、接触表与清理；
- `tests/verify-showcase.mjs`：零依赖静态结构与内容契约；
- `tests/verify-showcase-browser.mjs`：真实浏览器交互与视口检查；
- `docs/frontend-design-contract.md`：设计和验收边界；
- `docs/frontend-validation.md`：浏览器证据与复现结果。

## 尚未验证的研究边界

网页证明研究内容、目标调用方式、交互和七种流程契约成立；`web-demo-video` 已经证明一个本地媒体场景能真实端到端完成。它仍不证明其他上游 Skill 在真实 LLM、Notion、Discord、Threads、远程机器或作者的 macOS 环境中成功。若继续采用“直接真实场景”路线，下一阶段应选择用户授权的真实会议材料完成可追溯纪要，或把研究收口方法发布为仓库内可执行 Skill，而不是先做对照实验。
