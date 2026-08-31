# Research log

实验记录按时间倒序排列。每次记录说明目标、环境、执行、观察、证据、判断和下一步；失败实验不得删除。

## 2026-08-31 · R-007 GitHub 与 GitHub Pages 公开发布

- **目标：** 把 Solo Skills 的能力、原理、使用场景、扩展方向和研究价值作为第 7 个研究子项目公开发布；外部 README 同时提供摘要、锁定源库、研究源码、在线研究页、Web 展厅与真实视频索引。
- **环境：** GitHub `yydshly/0830_1_codex_project`；现有 Jekyll Pages 工作流；Playwright 1.62.1 + Headless Chromium；上游锁定提交 `d5789f592af17980054052fc7c05fe8a8e46be79`。
- **执行：** 用独立 Git 索引审计发布边界，研究提交 `d2f8e6702b0c4568ebd038f7350ce79baecbed66` 只引入根 README 的 R-007 索引与 `projects/solo-skills-study/**`；等待仓库检查 33371045085 与 Pages 33371045153 完成；随后直接访问正式 Pages，重跑七案例、三档视口、键盘、主题、reduced-motion 和 MP4 播放验收，并单独请求研究页、Web、源码和媒体端点。
- **观察：** 两个 Actions 均为 `success`；在线研究页、Web 展厅、研究源码与 MP4 均返回 HTTP 200，MP4 为 `video/mp4`、3,297,168 bytes。线上 Chromium 确认 8 类能力、26 条一句话能力、七案例门禁、无横向溢出、可见焦点、32 秒 1920×1080 视频可播放，console/page errors 和外部 API 调用均为 0。
- **并发与隔离：** 同一工作区的 R-001 任务在 R-007 提交后更新 `main`；最终部署基线 `4e21b998073003a0248b70edc1cda882633bcf8e` 完整保留 R-007 的 34 个公开文件。Dashi、Selector 与其他未提交工作没有进入 R-007 研究提交。
- **证据：** [`github-publication.json`](artifacts/github-publication.json)、[`showcase-browser-results.json`](artifacts/showcase-browser-results.json)、[`frontend-validation.md`](docs/frontend-validation.md)、[研究提交](https://github.com/yydshly/0830_1_codex_project/commit/d2f8e6702b0c4568ebd038f7350ce79baecbed66)、[Pages 工作流](https://github.com/yydshly/0830_1_codex_project/actions/runs/33371045153)。
- **判断：** R-007 已形成“固定上游 → 有边界结论 → 多场景可操作演示 → 真实媒体 → 公开源码与网页 → 线上复验”的可复核闭环。发布不改变研究边界：除 `web-demo-video` 外，其余上游 Skill 的真实模型表现、账号集成和外部副作用仍待授权环境验证。
- **下一步：** 选择用户授权的真实会议材料验证 `meeting-summary`，或把本研究的收口流程制作成仓库内可执行 Skill；涉及消息、删除、远程执行或账号写入时继续保持 preview / approval / recovery 护栏。

## 2026-08-31 · 8 类能力总览与 26 条一句话说明

- **目标：** 让读者不必先理解仓库目录名、FFmpeg、DAG、IMAP 等实现术语，就能直接回答“整个库有哪些实际能力”和“每个 Skill 一句话能完成什么”。
- **环境：** Windows；页面 `http://127.0.0.1:4192/#capabilities`；Playwright 1.62.1；Headless Chromium；上游提交 `d5789f592af17980054052fc7c05fe8a8e46be79`。
- **变更：** 在能力区增加 8 个面向结果的能力域：内容与媒体 4、写作与风格 3、会议与活动 5、消息与触达 5、Agent 工程 4、计算与模型路由 2、搜索与证据 2、数据安全操作 1；数量合计 26。重写全部 26 条描述为“动词 + 对象 + 可观察结果”，同时保留 Skill 原名、知识/脚本/耦合类型和业务域。
- **执行：** 静态契约检查 8 类分布 `4+3+5+5+4+2+2+1=26`、26 条一句话长度和五个代表性结果描述；真实 Chromium 检查默认 DOM、脚本增强筛选 9 项、总览 1440/768/390 的 4/2/1 栏、两主题、横向溢出、焦点、既有视频播放和七案例门禁。
- **观察：** 静态与浏览器套件首轮通过。代表项现在明确显示：`web-demo-video`“把真实网页自动生成可复现的产品演示视频”、`meeting-summary`“从长会议记录中提取决定、行动项、负责人和期限”、`notion-delete`“把指定 Notion 页面安全移入可恢复归档，而不是永久删除”。三档视口无横向溢出，console/page errors 为 0；既有 9/9/8 类型计数不变。
- **失败与替代：** 首轮能力实现的静态测试与 Chromium 验收通过；文档同步后的最终复核因前一轮静态服务已经退出而收到 `ERR_CONNECTION_REFUSED`。重新按规范命令启动同一个 `4192` 服务后原样重跑，不修改实现来规避环境问题。交付前再次验收时误设通用 `NODE_PATH`，脚本按约定拒绝启动并提示缺少 `WORKSPACE_NODE_MODULES`；改用文档规定的变量名后完整浏览器套件通过。能力域是研究层面的结果汇总，不等于新增了 8 个上游 Skill；一句话能力刻意省略部分实现细节，依赖和成熟度仍由旁边的类型标签及后续边界说明承担。
- **证据：** `showcase/index.html`、`showcase/styles.css`、`tests/verify-showcase.mjs`、`tests/verify-showcase-browser.mjs`、`artifacts/showcase-capability-index.png`、`artifacts/showcase-browser-results.json`。
- **判断：** 对这个库最有效的第一层解释不是逐个翻译 `SKILL.md`，而是先说明它覆盖哪些可交付结果，再用一句话连接到具体 Skill；技术原理和运行边界属于第二层。
- **下一步：** 若继续补充，应在不增加信息负担的前提下为每条能力增加“已真实验证 / 仅有规程 / 需要账号环境”的成熟度结论；当前类型标签已经提供基础版本，不需要重复扩写说明。

## 2026-08-31 · `web-demo-video` 真实网页交付

- **目标：** 不做提示词或 Skill 对照实验，直接把当前 Solo Skills 研究展厅作为真实业务对象，按上游 `web-demo-video` 和 `measured-ui-callouts` 的方法交付一条可播放、可复现、可验证的产品演示视频。
- **环境：** Windows；页面 `http://127.0.0.1:4192/`；Playwright 1.62.1；Headless Chromium；FFmpeg/FFprobe n6.1.3；上游提交 `d5789f592af17980054052fc7c05fe8a8e46be79`。
- **真实输入：** 当前研究网页、26 个锁定 Skill、五层机制、七案例实验室及其真实研究结论；输出规格沿用已确认案例契约：16:9、1920×1080、32 秒、20fps 源帧、无音乐。
- **变更：** 新增永久同源舞台 `showcase/video-stage.html` 和可复现脚本 `scripts/render-real-demo.mjs`。舞台以 `window.__tick(frameIndex)` 决定每一帧，使用 `getBoundingClientRect()` 测量真实 DOM 坐标并向 iframe 派发真实 `MouseEvent`；网页新增只在视频案例出现的原生播放器、规格和证据入口。
- **执行：** 先运行七检查点冒烟测试，确认第 104 帧筛选 `script`、244 帧进入 `guardrails`、350 帧进入 `video`、530 帧到达 5/5；随后捕获 640 个 1920×1080 PNG，使用 libx264 CRF 22、yuv420p 和 faststart 编码，抽取播放器海报与六格接触表，用 ffprobe 校验最终容器，最后清理系统临时帧目录。
- **观察：** 最终 `solo-skills-real-demo.mp4` 为 3,297,168 bytes、32.00 秒、1920×1080、640 帧、H.264 High、yuv420p、无音轨。六个代表帧显示首屏、技能筛选、机制护栏、视频案例、5/5 阶段和结束卡，没有裁切或个人数据；渲染浏览器 console/page errors 为 0。整合后 Chromium 能从页面读取视频 duration=32、videoWidth=1920、videoHeight=1080，视频门禁升级为 `READY / 真实媒体已交付`。
- **失败与替代：** 正式执行前发现上一轮静态服务已结束，`4192` 连接被拒；重新启动同一规范服务并完成舞台 HTTP 与状态冒烟检查后再渲染，没有改变目标 URL。首次正式 640 帧捕获、编码、海报、接触表和探针全部通过，无渲染重试。播放器证据链接最初指向服务根目录之外的 `artifacts/`，浏览器不可访问；改为在 `showcase/media/` 保留一份小型公开 evidence 副本，原始研究证据继续留在 `artifacts/`。
- **证据：** `showcase/media/solo-skills-real-demo.mp4`、`showcase/media/solo-skills-real-demo-poster.jpg`、`showcase/video-stage.html`、`scripts/render-real-demo.mjs`、`artifacts/solo-skills-real-demo-evidence.json`、`artifacts/solo-skills-real-demo-contact-sheet.jpg`、`artifacts/showcase-video-delivery.png`。
- **判断：** 这次已经证明至少一个 Solo Skills 场景能够从规程走到真实本地交付：Skill 提供确定性时间轴、同源约束、坐标证据、编码和清理规则，运行环境提供 Chromium 与 FFmpeg，真实网页提供业务对象。它仍不证明其他 25 个 Skill 或任何外部账号集成已经可用。
- **下一步：** 若继续坚持“直接真实场景”路线，下一项应选择低风险但不同运行形态的真实任务，例如用一份用户授权的真实会议记录生成可追溯纪要，或把本研究项目收口方法真正发布为仓库内可执行 Skill；不需要先做对比实验。

## 2026-08-31 · 七个目标场景调用与效果演示

- **目标：** 回答“在真实目标下到底怎样使用这个库”，让读者不只看到 Skill 列表和内部阶段，还能从业务目标出发获得可直接发给 Agent 的请求、所需材料、Skill 与运行环境的职责边界，以及可观察结果。
- **环境：** Windows；Python 3.10 静态服务；Playwright 1.62.1；Headless Chromium；页面 `http://127.0.0.1:4192/`；上游提交 `d5789f592af17980054052fc7c05fe8a8e46be79`。
- **变更：** 为研究交付、会议纪要、Skill 工作坊、网页演示视频、跨渠道发布、每日情报和 Notion 安全清理七个案例分别增加 `goal`、`prompt`、`provide`、`skillDoes`、`runtimeDoes` 与 `effect`；在案例简介和执行台之间新增目标调用面板及“按这个请求运行演示”入口。四栏在桌面、平板、手机分别按 4/2/1 栏重排。
- **执行：** 静态契约检查七条 prompt 和 28 组职责清单；真实 Chromium 从目标调用按钮运行研究案例到 5/5，并在 research、meeting、cleanup 间切换验证目标、请求和状态同步；逐项检查七种门禁、运行取消、明暗主题、键盘焦点、reduced-motion、1440/768/390 视口与控制台错误。
- **观察：** 静态测试和 Chromium 均通过。七个场景各有四项用户材料、四项 Skill 贡献、四项运行时职责和四项结果；目标按钮可以完成所选确定性案例；平板与手机职责网格分别计算为 2 栏和 1 栏；无横向溢出、错误遮罩、console error 或 pageerror。最终首屏绘制约 428ms，仍只代表本机静态服务。
- **失败与替代：** `agent-browser` 仍不在 PATH，继续使用已验证的 Playwright + Chromium 路线。仓库级复核首轮因沙箱用户与工作区所有者不同触发 Git `dubious ownership`，导致固定 SHA 子测试 3/4 通过、1 项被环境拦截；未修改全局 Git 配置，改用进程级 `GIT_CONFIG_* safe.directory` 后 4/4 通过。所有演示保持本地确定性：不调用真实模型、Token、Notion、Discord、Threads 或 FFmpeg，因此页面展示的是正确调用方式与门禁，不声称生产集成已经成功。
- **证据：** `showcase/case-data.js`、`showcase/index.html`、`tests/verify-showcase.mjs`、`tests/verify-showcase-browser.mjs`、`artifacts/showcase-usage-desktop.png`、`artifacts/showcase-browser-results.json`、`docs/frontend-validation.md`。
- **判断：** Solo Skills 不是简单的“能力插件集合”。在实际使用中，Skill 提供任务规程与判断边界，Agent 运行时提供模型、文件、浏览器、API 与权限，用户提供业务材料和授权；三者组合后才构成可执行能力。目标场景调用面板把这一区分变成了可直接操作的证据。
- **下一步：** 从会议纪要、DOM 实测标注和网页演示视频中选一个，接入固定脱敏输入和真实模型/工具，比较无 Skill、上游 Skill、本地化 Skill 三组结果；只有完成外部依赖、质量指标与副作用验收后才升级对应门禁。

## 2026-08-30 · 七案例真实能力实验室

- **目标：** 将单一会议纪要模拟升级为使用完整输入、执行轨迹、产物、依赖、副作用和门禁的多案例实验室，让读者理解 Solo Skills 在不同风险与运行形态下的能力和扩展方式。
- **环境：** Windows；Python 3.10 静态服务；Playwright 1.62.1；Headless Chromium；上游提交 `d5789f592af17980054052fc7c05fe8a8e46be79`。
- **真实输入：** 旗舰案例使用当前子项目的 README、research-log、锁定 SHA、26/9 结构计数、4/4 结构测试与 `http://127.0.0.1:4192/`；演示视频案例使用同一真实网页作为目标。涉及会议、工作坊、内容账号与候选文章的案例采用明确标记的脱敏 fixture。
- **变更：** 新增 `showcase/case-data.js`，将研究交付、会议运营、Skill 设计、演示视频、内容发布、每日情报和安全清理组织为 7 个案例；每例包含运行契约和 5 个执行阶段，终态覆盖 READY、HOLD、SETUP、DRY RUN 与 REVIEW。安全清理明确区分上游“立即归档”与本研究建议的 preview/approval/recovery 护栏。
- **执行：** 更新静态契约测试；用真实 Chromium 遍历 7 个案例终态，验证运行中切换案例会取消旧 token 并重置为 0/5；检查案例与阶段 Home/End 键盘路径、明暗主题、reduced-motion、1440/768/390 视口、控制台错误与横向溢出。
- **观察：** 静态测试确认 7 个案例、每例 6 个可见状态、至少一个具体产物预览、5 类门禁、网页外部 API 调用 0。Chromium 首轮与最终完整运行均通过：七种门禁与预期一致，三档视口无横向溢出，焦点可见，console/page errors 为 0；最终运行本地首屏绘制约 444ms、资源数 3。
- **失败与替代：** `agent-browser` 命令仍不在 PATH，沿既有替代路线使用工作区 Playwright + Chromium；revision 2 浏览器套件首轮通过，没有消耗修复重试。页面不执行真实 FFmpeg、调度、发送或归档，因此这些案例的最终门禁刻意停在 DRY RUN、REVIEW、SETUP 或 HOLD。
- **证据：** `showcase/case-data.js`、`tests/verify-showcase.mjs`、`tests/verify-showcase-browser.mjs`、`artifacts/showcase-browser-results.json`、三档最终截图、`docs/frontend-validation.md`。
- **判断：** Solo Skills 的核心价值不是统一生成答案，而是让不同工作拥有不同输入契约、执行顺序、验证和停止条件。真实研究交付案例足以证明这种方法可以直接强化本仓库；外部平台案例仍只支持工程设计结论，不支持生产成功结论。
- **下一步：** 选 `meeting-summary`、`measured-ui-callouts`、`web-demo-video` 三个低风险技能，使用脱敏固定样本比较无 Skill、上游原始 Skill、本地化 Skill 的正确率、遗漏率、耗时和人工修改量；视频案例只有实际生成并目检 MP4 后才能从 DRY RUN 升级。

## 2026-08-30 · 交互研究展厅与会议纪要演示

- **目标：** 用可运行网页整理 Solo Skills 的能力、原理、场景、扩展方向和研究价值，并选择一个能体现 Skill 核心机制的代表场景。
- **环境：** Windows；Python 3.10 静态服务；Playwright 1.62.1；Headless Chromium；上游提交 `d5789f592af17980054052fc7c05fe8a8e46be79`。
- **变更：** 新增零依赖 `showcase/`、静态结构测试、浏览器验证脚本、设计契约、覆盖清单、验收和交接记录；不修改上游源码。
- **执行：** 运行 `tests/verify-showcase.mjs`；在 `127.0.0.1:4192` 启动页面；用真实 Chromium 检查 1440、768、390 三档视口、26 技能筛选、原理和受众键盘切换、明暗主题、会议纪要演示和 reduced-motion。
- **观察：** 静态契约通过，网页运行依赖和外部 API 调用均为 0。三档视口无横向溢出和控制台错误；演示先识别四分钟转录缺失，再提取时间戳证据、生成行动项，并因价格和缺失材料未确认而输出 HOLD。
- **失败与修正：** `agent-browser` 命令不在 PATH，改用工作区 Playwright；浏览器脚本先后修正 main section 数量、程序化 focus 与真实键盘 focus 的差异、`0.01ms` 被序列化为 `1e-05s` 的数值比较。失败路径和重试上限保留在 `docs/frontend-validation.md`。
- **证据：** `tests/verify-showcase.mjs`、`tests/verify-showcase-browser.mjs`、`docs/frontend-validation.md`、`artifacts/showcase-desktop.png`、`showcase-tablet.png`、`showcase-mobile.png`。
- **判断：** 网页能够证据化说明 Solo Skills 的定位和边界；会议纪要是最能同时展示流程知识、事实约束、结构化输出与人工审批的安全演示。但确定性模拟不证明真实 `meeting-minutes` 的模型质量和外部发布可靠性。
- **下一步：** 使用脱敏固定会议样本，对无技能、原始技能和本地化技能的行动项正确率、遗漏率与人工修改量做对照实验。

## 2026-08-30 · 上游获取与首轮结构基线

- **目标：** 固定 Solo Skills 上游版本，建立技能数量、目录结构、许可证和随附代码的首轮可复现基线。
- **环境：** Windows；PowerShell 7；Git；Node.js；上游提交 `d5789f592af17980054052fc7c05fe8a8e46be79`。
- **变更：** 不修改上游源码；新增固定提交获取脚本、研究说明、结构契约测试和验证报告。
- **执行：** 运行 `scripts/fetch-upstream.ps1` 获取上游；运行 `node --test tests/skill-structure.test.mjs`；对 Node 与 Python 脚本做语法检查；在不提供 Notion Token 的条件下启动归档脚本。
- **观察：** 结构测试确认 26 个技能目录、9 个 Python/Shell/Node 代码文件和 MIT 许可证。Node 与 Python 语法检查通过；`notion_archive.py` 的无凭证启动因在函数定义前调用 `_load_from_env_files()` 而抛出 `NameError`。
- **证据：** `tests/skill-structure.test.mjs`、`artifacts/baseline-verification.md`、锁定上游检出目录。
- **判断：** H1、H2 得到支持；H5 只得到部分支持。仓库结构适合继续研究，但随附代码不能因为“作者正在使用”就视为已经通用验证。
- **下一步：** 建立技能可迁移性与副作用清单，从 `meeting-summary`、`measured-ui-callouts` 和 `web-demo-video` 中选择首批行为实验。
