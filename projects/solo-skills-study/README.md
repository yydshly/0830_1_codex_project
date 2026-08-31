# R-007 · Solo Skills 能力、可靠性与可迁移性研究

> 第 7 个研究子项目。研究 `bam-bam-2/solo-skills` 如何把个人自动化经验封装为 Agent Skills，并验证这些技能在不同客户端、操作系统和安全边界下的真实可用性。

| 字段 | 内容 |
| --- | --- |
| 研究编号 | `R-007`（当前研究索引第 7 项；编号不随排序变化） |
| 状态 | 进行中 |
| 研究对象 | [bam-bam-2/solo-skills](https://github.com/bam-bam-2/solo-skills) |
| 锁定版本 | [`d5789f592af17980054052fc7c05fe8a8e46be79`](https://github.com/bam-bam-2/solo-skills/commit/d5789f592af17980054052fc7c05fe8a8e46be79) |
| 上游版本字段 | 该提交无 Git tag；以 commit SHA 作为唯一版本标识 |
| 开始日期 | 2026-08-30 |
| 最近更新 | 2026-08-31 |
| 负责人 | yydshly |

## 公开摘要与索引

Solo Skills 不是新的 Agent 运行时，而是一套把个人经营经验写成 `SKILL.md`、参考资料、脚本和人工门禁的过程知识库。锁定版本包含 26 个 Skill，覆盖 8 类实际结果能力；本研究用七个目标场景解释调用方式，并已按上游 `web-demo-video` 规程对真实研究网页交付一条可复现的 32 秒 1080p 演示视频。它最值得我们复用的是“问题 → 规程 → 证据 → 门禁 → 测试”的沉淀方法；账号、调度、删除、远程执行和跨客户端兼容仍需本地化与安全评测。

| 公开入口 | 地址 |
| --- | --- |
| 锁定上游源码 | [bam-bam-2/solo-skills @ `d5789f5`](https://github.com/bam-bam-2/solo-skills/tree/d5789f592af17980054052fc7c05fe8a8e46be79) |
| 本研究源码 | [GitHub · R-007 项目目录](https://github.com/yydshly/0830_1_codex_project/tree/main/projects/solo-skills-study) |
| 在线研究页 | [GitHub Pages · R-007 研究说明](https://yydshly.github.io/0830_1_codex_project/projects/solo-skills-study/) |
| 在线 Web 展厅 | [能力、原理、七案例与扩展演示](https://yydshly.github.io/0830_1_codex_project/projects/solo-skills-study/showcase/) |
| 真实演示视频 | [32 秒 · 1920×1080 · H.264](https://yydshly.github.io/0830_1_codex_project/projects/solo-skills-study/showcase/media/solo-skills-real-demo.mp4) |
| 总研究索引 | [0830 Research Lab](https://yydshly.github.io/0830_1_codex_project/) |

## 当前结论

Solo Skills 不是新的 Agent 运行时，而是一套面向个人经营与内容运营的过程知识库：`SKILL.md` 负责描述触发条件、步骤、异常处理和审批边界，脚本与模板负责一部分确定性执行。

锁定版本包含 26 个技能目录和 9 个 Python、Shell 或 Node.js 代码文件。网页已将它们汇总为内容媒体、写作风格、会议活动、消息触达、Agent 工程、计算路由、搜索证据和数据操作 8 类实际能力，并为每个 Skill 提供一句话结果描述。结构契约已在 Windows 与 Node.js 环境通过；`web-demo-video` 已使用当前真实网页完成 640 帧捕获、FFmpeg 编码、ffprobe 和代表帧目检，交付 32 秒 1920×1080 MP4。“目录格式可被多个 Agent 读取”仍不等于所有技能都无需修改即可跨平台执行。

## 交互式研究展厅

[打开 Solo Skills 交互研究展厅](showcase/)：先用 8 类结果能力和 26 条一句话说明回答“每个 Skill 能完成什么”，再整理实现原理、使用场景、可扩展方向和对本研究仓库的意义。七个目标场景都给出可直接发给 Agent 的自然语言请求，并把“你提供 / Skill 负责 / 环境负责 / 最终效果”分开说明。实验室包含：

- 使用本项目真实 README、research-log、固定提交、测试和本地 URL 的研究交付旗舰案例；
- 会议运营、Skill 设计、真实网页演示视频、内容发布、每日情报和安全清理六个扩展案例；
- 每个案例的业务目标、可复制调用请求、四方职责、完整输入、Skill 栈、运行环境、五阶段执行、产物、验证、副作用与最终门禁；点击“按这个请求运行演示”即可观察对应确定性流程。

展厅运行时是零依赖静态 HTML/CSS/JavaScript。旗舰案例使用真实项目证据；视频案例通过单独的可复现脚本实际驱动 Chromium 和 FFmpeg，并在页面内直接播放最终 MP4；涉及会议、账号和客户信息的案例使用明确标记的脱敏 fixture。页面本身不调用真实模型、Notion、Discord、Threads 或其他外部 API，也不执行删除、调度或即时渲染，因此真实视频成功不能外推为其他外部集成已验证。

## 研究问题

1. 26 个公开技能分别提供什么能力，哪些只是操作知识，哪些包含可执行实现？
2. `SKILL.md`、引用资料、模板和脚本如何共同形成渐进加载的 Agent 能力？
3. 技能在 Claude Code、Codex、OpenCode 之间的格式兼容性和实际运行兼容性分别如何？
4. 哪些技能可直接复用，哪些依赖作者的 macOS、账号、服务、目录或专用 Agent？
5. dry-run、人工审批、秘密管理、删除保护、幂等和失败恢复是否足以支撑真实运营？
6. 哪些设计适合转化为本研究仓库自己的技能工程方法与验证规范？

## 范围

### 包含

- 固定上游提交、许可证和源码结构。
- 26 个技能的能力分类、依赖关系、平台耦合和副作用分级。
- `SKILL.md` 结构契约、随附脚本语法与无副作用烟雾测试。
- 代表性技能在 Codex + Windows 环境中的适配实验。
- 可移植性、安全性、可测试性和可扩展方向分析。

### 不包含

- 使用真实账号向 Threads、Discord、Notion、Naver 或 KakaoTalk 发送内容。
- 读取或提交真实 Token、邮件、会议转录、客户信息或个人数据。
- 绕过平台限制、批量抓取第三方服务或执行破坏性操作。
- 修改上游源码或把作者的 49 个后台自动化全部复刻到本机。
- 在缺少固定样本和对照组时宣称生成质量优于其他方案。

## 初始能力地图

| 能力域 | 代表技能 | 主要研究重点 |
| --- | --- | --- |
| 内容制作 | `web-demo-video`、`book-pdf`、`multi-method-image-generation` | 确定性渲染、模板资产、输出验证 |
| 写作与风格 | `humanize-korean`、`voice-dna-creator`、`style-skill-creator` | 规则、指标、风格保真与评测 |
| 内容发布 | `naver-blog-post`、`threads-reply`、`naver-mail` | 平台依赖、审批、dry-run、部分失败恢复 |
| 会议与运营 | `meeting-minutes`、`meeting-summary`、`workshop-prep`、`community-launch` | 证据边界、行动项抽取、业务配置分离 |
| 常驻自动化 | `daily-brief-bot`、`discord-agent-fleet`、`discord-reminder` | 调度、监控、秘密管理和故障恢复 |
| 计算与模型路由 | `remote-offload`、`claude-codex-fallback` | SSH 边界、命令安全、限额回退 |
| Agent 元能力 | `harness`、`orchestration`、`computer-use` | 客户端专用接口、能力发现和团队编排 |
| 界面与搜索 | `measured-ui-callouts`、`daangn-search`、`kakaotalk-cli` | 坐标证据、桌面自动化、地域和平台适配 |

## 验证标准

| 编号 | 假设或能力 | 验证方法 | 通过标准 |
| --- | --- | --- | --- |
| H1 | 上游源码与许可证可被精确复现 | 获取脚本与 Git 检查 | HEAD 等于锁定 SHA，许可证为 MIT |
| H2 | 仓库公开 26 个结构可发现的技能 | 本地结构契约测试 | 26 个技能目录都含合法 `name` 与 `description` frontmatter |
| H3 | 技能采用说明、引用、资产和脚本分层 | 目录与引用检查 | 代表性技能可以按需定位 `references`、`assets` 或代码文件 |
| H4 | 格式兼容与运行兼容可以被分开度量 | 客户端与平台矩阵 | 每个代表技能记录加载、执行、依赖和副作用结果 |
| H5 | 随附代码具备可运行基线 | 语法检查与无凭证烟雾测试 | 可解析；缺少配置时给出受控错误而不是异常崩溃 |
| H6 | 外部副作用受到明确保护 | 静态审计与沙箱集成测试 | 写入、发送、删除类技能具有预览、确认、幂等或恢复策略 |

## 实验矩阵

| 实验 | 变量 | 对照 | 证据位置 | 结果 |
| --- | --- | --- | --- | --- |
| E1 上游身份与许可证 | 锁定提交源码 | 上游仓库声明 | `tests/skill-structure.test.mjs` | 已通过 |
| E2 技能结构契约 | 技能目录与 frontmatter | Agent Skills 最小结构 | `tests/skill-structure.test.mjs` | 已通过 |
| E3 随附代码基线 | Python/Node/Shell 代码 | 无凭证、无网络执行 | `artifacts/baseline-verification.md` | 部分通过，发现初始化缺陷 |
| E4 跨客户端加载 | Codex、Claude Code、OpenCode | 同一请求与技能版本 | 待补充 | 未执行 |
| E5 代表技能行为评测 | 摘要、界面标注、Demo 视频 | 固定真实目标与可复现运行契约 | `video-stage.html`、`scripts/render-real-demo.mjs`、媒体证据 | 部分完成：`web-demo-video` 真实交付通过；摘要与其他工具仍待执行 |
| E6 外部副作用安全审计 | 发送、删除、SSH、模型回退 | 安全检查表 | 待补充 | 未执行 |
| E7 交互研究展厅 | 8 类能力、26 条一句话索引、原理、七个目标场景调用与实验室 | 研究 README | `showcase/`、`docs/frontend-validation.md`、`artifacts/showcase-browser-results.json` | 已通过能力汇总、成熟度筛选、真实视频播放、案例运行、三视口与键盘浏览器验收 |

## 获取与复现

环境基线：Windows、PowerShell 7、Git、Node.js。研究项目自身不引入根级依赖。

在仓库根目录执行：

```powershell
powershell -ExecutionPolicy Bypass -File .\projects\solo-skills-study\scripts\fetch-upstream.ps1
node --test .\projects\solo-skills-study\tests\skill-structure.test.mjs
node .\projects\solo-skills-study\tests\verify-showcase.mjs
powershell -ExecutionPolicy Bypass -File .\projects\solo-skills-study\scripts\serve-showcase.ps1
node .\scripts\validate-repository.mjs
```

获取脚本会把锁定提交检出到 `projects/solo-skills-study/upstream/solo-skills`。该目录用于本地研究并被项目 `.gitignore` 排除；主仓库只保存原创分析、获取脚本、测试和小型证据，不复制完整第三方源码。

首次验证结果见 [artifacts/baseline-verification.md](artifacts/baseline-verification.md)，网页浏览器验收见 [docs/frontend-validation.md](docs/frontend-validation.md)，实验过程见 [research-log.md](research-log.md)。

## 已知限制

- 当前能力地图以静态源码分析为主，尚未完成跨客户端行为实验。
- 多个技能需要作者环境中未随仓库提供的账号、专用 Agent、Orca CLI 或常驻服务。
- 韩国平台和韩文写作技能的结论不能直接外推到中文平台和中文文体。
- 无真实外部账号的测试只能验证结构、安全边界和失败方式，不能证明端到端发布成功。

## 后续问题

- 哪些依赖可以通过配置文件消除，哪些必须编写客户端或平台适配器？
- 同一任务在无技能、有技能和经过本地化技能三种条件下，正确率、耗时和人工修改量差多少？
- 如何为 Skill 定义只读、文件写入、网络、消息发送、删除和秘密访问等权限清单？
- 能否把本仓库的 `research-log` 自动提炼为带测试和证据链接的新技能？
- 哪三个技能最值得优先改造成 Codex + Windows + 中文工作流版本？

## 来源与许可证

- 上游仓库：[bam-bam-2/solo-skills](https://github.com/bam-bam-2/solo-skills)
- 锁定提交：[`d5789f592af17980054052fc7c05fe8a8e46be79`](https://github.com/bam-bam-2/solo-skills/commit/d5789f592af17980054052fc7c05fe8a8e46be79)
- 上游许可证：[MIT License](https://github.com/bam-bam-2/solo-skills/blob/d5789f592af17980054052fc7c05fe8a8e46be79/LICENSE)，Copyright (c) 2026 Ahn Taehyun (bam bam)。
- 本研究项目的分析与测试不改变上游授权关系；复用上游代码时仍需保留其版权与许可证文本。
