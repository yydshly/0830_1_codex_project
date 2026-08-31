# Research log

实验记录按时间倒序排列。每次记录说明目标、环境、执行、观察、证据、判断和下一步；失败实验保留在记录中。

## 2026-08-31 · R-002 GitHub 与 GitHub Pages 公开发布

- **目标：** 将 Backpass 研究固定为 `R-002 / 第 2 个研究子项目`，让仓库外部读者可以从摘要追溯锁定上游、研究源码与在线交互 Web，并实际完成能力演示。
- **公开摘要：** 根 README 用一行说明“项目记忆优化器、不是模型训练”、Tier 1 精确归属、`99.5%` 字节缩减与 `1 < 2 · HOLD` 边界；项目 README 同时索引固定源库、GitHub 研究目录、在线研究页和在线 Web。
- **版本证据：** 公开基线提交为 [`afdddbd6c1999440c6e4e5136b41b93b93527fdc`](https://github.com/yydshly/0830_1_codex_project/commit/afdddbd6c1999440c6e4e5136b41b93b93527fdc)（`research: publish R-002 Backpass study`），远端 `main` 精确指向该提交；上游固定到 [`d8cbdb68ca20a9ad6626810e0c24a576e43223c7`](https://github.com/kunchenguid/backpass/tree/d8cbdb68ca20a9ad6626810e0c24a576e43223c7)，没有改用不稳定分支入口。
- **自动化证据：** GitHub Actions [`Repository checks` run `33369455904`](https://github.com/yydshly/0830_1_codex_project/actions/runs/33369455904) 成功；[`Deploy research site` run `33369455942`](https://github.com/yydshly/0830_1_codex_project/actions/runs/33369455942) 的 Jekyll build 与 Pages deploy 均成功。
- **HTTP 证据：** [GitHub 研究目录](https://github.com/yydshly/0830_1_codex_project/tree/main/projects/backpass-study)、[在线研究页](https://yydshly.github.io/0830_1_codex_project/projects/backpass-study/)、[在线 Web](https://yydshly.github.io/0830_1_codex_project/projects/backpass-study/demo/)、`styles.css` 与 `app.js` 均返回 HTTP 200；研究页与 Web 同时包含 R-002、序号、锁定提交和公开索引。
- **真实浏览器证据：** 1440×1200 Chromium 中，线上 Web 标题、品牌和页脚统一显示 R-002；真实历史到达 `HOLD` 且 `externalModelCalled=false / filesWritten=0`，场景筛选为 `adjacent 4/12`，合成闭环分别完成 `REVIEW → ACCEPTED` 与 `REVIEW → REJECTED`。390×844 手机下文档与五阶段 tab 均无横向溢出，深色切换成功，console/page errors 为空；同尺寸在线研究页也无页面级溢出。
- **隔离边界：** 发布提交只包含 `projects/backpass-study/**` 与根 README 的一条 R-002 索引，没有混入 Dashi、Selector、Solo 或并行 Sketchbook 工作；锁定上游 checkout 仍由 `.gitignore` 排除。
- **结果：** R-002 已完成“外部摘要可读、固定源库可追溯、研究源码可查、在线能力可操作、发布证据可复核”的公开闭环。发布不改变研究边界：真实 LLM 分析、规则因果效果和多项目隔离仍未被本次实验证实。

## 2026-08-31 · 单条真实 Codex 历史确定性处理

- **目标：** 从本机大量 Codex 历史中只选择一条属于当前仓库的顶层会话，实际演示 Backpass 在语义模型调用之前能完成什么，并验证单样本是否会被错误提升为规则。
- **对象与范围：** Backpass `0.1.14`、锁定提交 `d8cbdb68`；只读 1 条已授权历史。会话工作目录与仓库根精确匹配，记录的 Git commit 可解析，严格关联结果为 Tier 1 / exact。
- **执行：** 官方 CLI 不能指定唯一会话的精确路径，也没有完全禁止原始读取的模式；因此使用 `scripts/analyze-one-codex-session.mjs` 显式接收单个文件，并调用上游内部 `codex.classify`、association、`readTranscript` 与 `distill+redact` API。未运行 `acpx` 或外部模型。
- **定量观察：** 输入 `5,282,189 B`，规范化为 175 events，其中 4 user turns、23 assistant turns、147 tool calls；压缩轨迹为 `26,455 B`，字节缩减 `99.5%`，且发生 trace elision。
- **隐私边界：** 正则脱敏标记为 0，只说明该轨迹没有命中上游已知模式，**不等于内容已经匿名化或不含敏感信息**。提交的 JSON 只包含不可逆指纹、计数、压缩率、关联与门槛结果及研究者释义；不包含原始路径、完整会话 ID、消息正文或压缩轨迹。
- **研究者解释：** 本地审阅压缩轨迹后，将“交付末段出现固定展示端口冲突，导致端口迁移和部分复验”标为候选摩擦。该判断由研究者作出，不冒充 Backpass 的 LLM 分析结果。
- **证据门槛：** 新 gap 的默认下限是 2 条独立会话；当前只有 1 条，故 `1 < 2`、状态 `HOLD`，没有生成规则提案。实验未创建 `.backpass`，未修改 `AGENTS.md`、`CLAUDE.md` 或 Skills。
- **证据：** `artifacts/real-codex-session-analysis.json`、`scripts/analyze-one-codex-session.mjs` 与网页“单条真实历史实测”区。
- **网页验收：** 新增五阶段交互状态机与 `window.__realHistoryState`。桌面 1440×1200、平板 820×1180、手机 390×844、深色主题、End/Escape 键盘路径和 reduced-motion 均通过；390px 下修复了第一版标签条不必要的内嵌滚动条。原场景筛选仍为 adjacent 4/12，合成闭环仍可 REVIEW→ACCEPTED→READY。
- **工程结果：** 研究、派生证据与网页契约共 12/12 通过；仓库结构有效；`git diff --check` 无输出；页面、样式和脚本资源均返回 200；浏览器错误数组为空。
- **判断：** 本次支持“Backpass 可先把真实历史转成可归属、可压缩、可计数的候选证据”，但不支持“单条历史足以形成建议”或“压缩与正则脱敏已解决隐私问题”。
- **下一步：** 等待另一条独立、同类会话佐证候选摩擦后，再单独授权语义分析；在此之前保持 `HOLD`。

## 2026-08-30 · 使用场景扩展地图

- **目标：** 补全 Backpass 可扩展的使用场景，并区分锁定版本当前能力、近邻工程扩展与需要新领域基础设施的长期场景。
- **变更：** 网页新增 12 个场景，分为当前近似可用、近邻扩展、领域扩展三层；每项记录证据输入、记忆写回、可观察收益与前置条件，并支持鼠标和键盘筛选。
- **观察：** 当前四项仍以 Git 仓库、Agent 会话和项目记忆为边界；测试/CI/事故/多 Agent 场景需要客观结果与任务谱系；数据、客服、安全和内容场景还需要新的数据源、业务真值、DLP/权限和责任人治理。
- **边界：** 场景地图是基于源码机制的扩展分析，不表示锁定版本已经实现 CRM、CI、事故管理或数据平台连接器。
- **证据：** `demo/index.html`、`demo/app.js`、`tests/web-demo-contract.test.mjs`、`demo/VALIDATION.md` 与更新后的四档截图。
- **判断：** Backpass 最可复用的不是某一种 Agent 适配器，而是“重复任务 → 结果证据 → 小步记忆修改 → 人工审核”的闭环；缺少任何一环时，扩展价值会显著下降。
- **下一步：** 优先实现测试/CI 结果适配器与目录级记忆，因为它们离本仓库最近且能直接改善损失信号可信度。

## 2026-08-30 · 交互研究网页与最佳场景演示

- **目标：** 用一个可运行网页解释 Backpass 的能力、原理、场景、扩展和仓库价值，并让维护者亲自完成一次人工审核闭环。
- **场景：** 三条合成 Codex 研究会话中，两条重复遗漏根仓库验证或 `research-log.md` 记录；Backpass 将其折叠为一条带跨会话证据的验证规则建议。
- **边界：** 静态合成演示，不读取本机历史、不调用 `acpx` 或云模型、不写入 `AGENTS.md`。
- **实现：** 零依赖 HTML/CSS/JavaScript；含浅/深主题、五步状态机、接受/拒绝/重置、键盘焦点和 reduced-motion 适配。
- **证据：** `demo/DESIGN-CONTRACT.md`、`demo/VALIDATION.md`、`tests/web-demo-contract.test.mjs` 与 `artifacts/web-demo-*.png`。
- **判断：** 该场景能直接说明 Backpass 对本仓库的近期价值：把反复发生的流程遗漏变成可追溯、可拒绝的局部规则提案；它只演示机制，不证明上游模型建议质量。
- **下一步：** 用脱敏的合成会话驱动上游真实分析链路，并把网页状态替换为可复现的实验输出。

## 2026-08-30 · 首轮源码获取与 Windows 基线

- **目标：** 固定 Backpass 上游版本，验证核心能力声明、源码契约和 Windows 下的上游测试状态。
- **环境：** Windows；PowerShell 7；Git；Node.js 22.15.0；上游提交 `d8cbdb68ca20a9ad6626810e0c24a576e43223c7`。
- **变更：** 不修改上游源码；新增研究项目、固定提交获取脚本和能力契约测试。
- **执行：** 运行 `scripts/fetch-upstream.ps1`；运行研究项目能力契约测试；在上游目录运行 `npm test`；在仓库根运行结构验证。
- **观察：** 获取脚本成功检出锁定提交；研究契约测试 5/5 通过；基础 CLI 输出版本 `0.1.14`。上游 `npm test` 共 356 项，266 通过、88 失败、2 跳过。失败主要集中于真实 Windows 用户目录未被测试环境完全隔离、扩展名为空的 Unix 假可执行文件无法由 Windows `spawn` 执行、symlink 权限和带盘符路径编码。
- **证据：** `tests/capability-contract.test.mjs`、`artifacts/baseline-verification.md`、锁定上游源码。
- **判断：** H1 得到支持，H2 的静态源码契约得到支持；H5 在锁定提交和当前 Windows 环境下被否定。88 项失败包含大量级联，不能等同于 88 个独立运行时缺陷，后续需要按失败根因建立定向测试。
- **下一步：** 构造不含真实隐私数据的合成 Codex 会话，测量会话归属、证据折叠和建议门槛。
