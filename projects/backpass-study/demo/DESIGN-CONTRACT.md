# Backpass 交互研究网页设计契约

```text
Entry mode: Revision-led（在既有研究展厅内扩展使用场景）
Request revision: 4
Target user and context: 本研究仓库的维护者与协作者，需要快速判断 Backpass 的机制、价值、边界和采用优先级。
Desired first impression: 严谨、证据优先、像一次可操作的研究推演，而不是营销落地页。
Visual ambition: Editorial
Experience architecture: Editorial Flow
Visual constraints: 纸张式浅色主题与深色研究终端主题；薄边框、克制阴影、数据/证据色；不依赖图片或重型特效。
Information constraints: 必须覆盖能力、实现原理、使用场景、可扩展方向、对我们的意义，并明确“不是模型训练”；扩展场景必须区分当前可用、近邻扩展与领域扩展；真实历史演示必须区分上游确定性输出、研究者解释与尚未执行的 LLM 阶段；公开表面统一标识 `R-002 / 第 2 个研究子项目`，并提供固定源库、GitHub 研究目录、在线研究页和在线 Web 索引。
Operation constraints: 纯静态、无框架、无后端；只读取一条明确属于当前仓库的 Codex 历史；原始记录不进入仓库、不调用外部模型、不修改 AGENTS.md；网页交互可由鼠标、触摸和键盘完成。
State constraints: 真实历史演示展示发现、归属、压缩、信号、单会话证据门槛五个状态；合成演示保留建议、接受、拒绝和重置；场景地图支持筛选；主题可切换并持久化。
Environment constraints: 项目内零依赖；支持 GitHub Pages 与 Node 22 本地静态服务；桌面、平板和 390px 手机；发布目标为 `yydshly/0830_1_codex_project` 的 `main` 与现有 Pages 工作流。
Primary journey: 从根 README 识别 R-002 与公开摘要 → 打开在线研究页 → 进入在线 Web → 查看真实历史如何被发现和压缩 → 理解单会话为何只能形成候选信号 → 浏览场景与采用判断 → 追溯固定上游和 GitHub 研究目录。
User-defined phases: 单条真实历史获取；本地脱敏分析；能力演示及说明；原合成闭环与场景地图；R-002 GitHub 与 GitHub Pages 发布。
Required artifacts: 单会话分析脚本、脱敏结构化证据、index.html、styles.css、app.js、项目 README/index/research-log、根 README 摘要、发布契约测试、浏览器验收记录、桌面/深色/平板/手机最终截图、远端提交与 Pages 证据。
Autonomy authorization: 用户明确允许从大量 Codex 历史中获取一条进行 Backpass 能力演示，并明确要求把总结提交到远端 GitHub、把 Web 部署到 GitHub Pages；授权本地修改、提交、推送与远端发布验证。
User-decision boundary: 不把原始会话或可还原路径提交到仓库；不调用 acpx/外部模型；不写入 AGENTS.md；只提交 Backpass 项目和根 README 对应索引行，不混入其他未完成研究；若未来要执行真实 LLM analysis/synthesis 或应用建议，需要另行授权。
Observable completion criteria: 一条当前仓库历史经上游 Codex adapter、distill 和 redact 处理；仓库只保存不可逆派生证据；网页明确 1<2 因而不生成规则；R-002 在根 README、项目页和 Web 一致；固定上游、GitHub 目录、在线研究页和在线 Web 均可追溯；目标提交推送到 `origin/main`；Pages workflow 成功；公开 URL 返回 200 且真实浏览器无错误。
```

## 设计方向

| 决策 | 选择 | 服务目标的原因 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- | --- |
| 信息层级 | 结论先行，机制与演示居中，采用判断收束 | 用户先判断“是什么”，再投入阅读细节 | 首屏只能有一个主标题和一个主行动 | 5 秒内可读出“项目记忆优化器、不是模型训练” |
| 排版 | 中文编辑式长文 + 等宽证据标签 | 同时承载解释与源码/实验语义 | 正文行宽受控，数据和状态独立成块 | 390px 至 1440px 无难读超长行 |
| 色彩 | 纸白/墨黑为底，青绿表示证据，蓝紫表示建议，赤色表示风险 | 状态不只依赖饱和装饰 | 每个状态同时有文字、形状或边框线索 | 浅/深主题含义一致且可辨 |
| 材质与深度 | 细网格、薄描边、轻微纸张层次 | 呼应研究工作台而不压过内容 | 无大面积模糊玻璃和连续高成本动画 | 关闭装饰后内容和交互仍完整 |
| 动效 | 只用于流水线推进和状态切换 | 解释“一个梯度步”的顺序 | reduced-motion 下取消位移与渐进动画 | 信息不依赖动画出现 |
| 响应式 | 桌面双栏、平板压缩、手机单栏 | 保持阅读与演示顺序 | 演示控制不横向溢出 | 390px 可完整完成主旅程 |

## 覆盖清单

| 用户阶段 | 要求或产物 | 表面/状态 | 证据 | 阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 综合整理 | 首屏定位与五类内容 | 桌面浅色 1440px | `web-demo-desktop.png`、7 个 section DOM | 2-3 | pass | 已完成 |
| 综合整理 | 深色主题完整性 | 桌面深色 | `web-demo-dark.png`、light→dark | 6-7 | pass | 已完成 |
| 可扩展使用场景 | 三层成熟度与至少 9 个场景 | 桌面浅色、全部状态 | 12 张卡片、3 层各 4 项、截图 | 3 | pass | 已完成 |
| 可扩展使用场景 | 按成熟度筛选与计数 | 全部/当前/近邻/领域 | 点击→4/12、ArrowRight/Home、aria-pressed | 4-6 | pass | 已完成 |
| 可扩展使用场景 | 输入/写回/收益/前置条件 | 每张场景卡片 | 48 个字段、场景契约测试 | 3 | pass | 已完成 |
| 单条真实历史获取 | 从当前仓库筛选一条 Codex 会话 | 本地只读、严格归属 | Tier 1 / exact、不可逆指纹、recorded commit 可解析 | 1-3 | pass | 已完成 |
| 本地脱敏分析 | 运行 read → distill → redact | 单会话、无外部模型 | 175 events、99.5% 字节缩减、派生 JSON | 3-6 | pass | 已完成 |
| 能力演示及说明 | 展示五阶段真实历史流水线 | 桌面浅色、逐步状态 | READY→HOLD、DOM、`web-demo-real-session.png` | 3-6 | pass | 已完成 |
| 能力边界 | 明确单会话不越过新增规则门槛 | `1 < 2`、无写入 | 页面文案、证据门槛测试、`filesWritten=0` | 6 | pass | 已完成 |
| 最佳场景演示 | 运行五步 Backpass 推演 | 初始→建议 | `READY`→`REVIEW`，step 4 | 5-6 | pass | 已完成 |
| 最佳场景演示 | 接受与拒绝 | 建议→接受/拒绝→重置 | `ACCEPTED`、`REJECTED`、Escape→`READY` | 5-6 | pass | 已完成 |
| 采用判断 | 对本仓库的意义与边界 | 正文与优先级卡片 | `#meaning` DOM、桌面截图 | 3 | pass | 已完成 |
| 跨表面 | 平板布局 | 820px 浅色 | 单列 757px、`web-demo-tablet.png`、无溢出 | 7 | pass | 已完成 |
| 跨表面 | 手机主旅程 | 390px 浅色 | 单列 345px、五等分 tab、`web-demo-mobile.png` | 7 | pass | 已完成 |
| 跨表面 | 键盘与焦点 | 桌面/手机 | End→HOLD、Escape→READY；焦点回到运行按钮 | 4-7 | pass | 已完成 |
| 跨表面 | reduced-motion | 模拟 reduce | media=true、transition `1e-06s`、主旅程通过 | 7-8 | pass | 已完成 |
| 跨表面 | 中文标签宽度 | 所有断点 | 桌面、820、390 三档无整页或 tab 溢出 | 7 | pass | 已完成 |
| 邻接回归 | 原五步演示与场景筛选保持可用 | READY→REVIEW→ACCEPTED→READY | reduced-motion 浏览器状态；adjacent 4/12；错误数组为空 | 5-7 | pass | 已完成 |
| 工程 | 静态服务与无错误 | canonical URL | 16/16 测试、资源 200、errors=[]、仓库验证通过 | 1/9 | pass | 已完成 |
| 交付 | 文档、派生证据与最终截图 | 文件 | README/research-log/VALIDATION、派生 JSON 与五张截图 | 9 | pass | 已完成 |
| R-002 公开身份 | 根 README、项目 README/index、在线 Web 使用同一编号 | 本地公开表面 | `R-002` 与“第 2 个研究子项目”DOM/文件断言 | 3/9 | pass | 已完成 |
| 外部索引 | 固定源库、GitHub 目录、在线研究页、在线 Web 可达 | README、页脚、根索引 | 精确 URL 与发布契约测试 4/4 | 3/9 | pass | 已完成 |
| 隔离提交 | 只提交 Backpass 与根索引单行 | Git index / `main` | `afdddbd6c1999440c6e4e5136b41b93b93527fdc`；27 个目标文件；无其他项目 | 9 | pass | 已完成 |
| GitHub Pages | 现有 Jekyll workflow 构建部署成功 | Actions / Pages | quality `33369455904`、Pages `33369455942` 均 success | 9 | pass | 已完成 |
| 线上复验 | 研究页和 Web 返回 200 且包含 R-002 | GitHub Pages / Chromium | 目录/研究页/Web/CSS/JS 200；桌面与手机 DOM、交互、errors=[] | 7/9 | pass | 已完成 |
| 发布证据回写 | 远端 commit、workflow、公开 URL 可追溯 | research-log / VALIDATION | 发布记录、Actions 链接、HTTP 与浏览器证据均已写入 | 9 | pass | 已完成 |
