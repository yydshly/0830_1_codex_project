# R-002 · Backpass Agent 记忆优化研究

> 第 2 个研究子项目。研究 Backpass 能否依据真实 Agent 会话，以可审查、可回滚的方式持续改进项目级 `AGENTS.md`、`CLAUDE.md` 与 Skills。

| 字段 | 内容 |
| --- | --- |
| 研究编号 | `R-002`（当前研究索引第 2 项；编号不随排序变化） |
| 状态 | 进行中 |
| 锁定上游 | [kunchenguid/backpass 0.1.14 @ `d8cbdb68`](https://github.com/kunchenguid/backpass/tree/d8cbdb68ca20a9ad6626810e0c24a576e43223c7) |
| GitHub 研究目录 | [查看源码、测试与证据](https://github.com/yydshly/0830_1_codex_project/tree/main/projects/backpass-study) |
| 在线研究页 | [阅读完整研究](https://yydshly.github.io/0830_1_codex_project/projects/backpass-study/) |
| 在线交互 Web | [运行能力演示](https://yydshly.github.io/0830_1_codex_project/projects/backpass-study/demo/) |
| 上游包版本 | `0.1.14`；锁定提交晚于 `backpass-v0.1.14` tag |
| 开始日期 | 2026-08-30 |
| 最近更新 | 2026-08-31 |
| 负责人 | yydshly |

## 公开摘要

Backpass 是一个本地优先、证据约束、人工审核的 **Agent 项目记忆优化器**，不是模型训练框架。它从历史会话中发现重复摩擦，把跨会话证据折叠成对 `AGENTS.md`、`CLAUDE.md` 或 Skills 的小步修改建议，并在人工接受后才写入。我们的单条真实 Codex 历史实测验证了 Tier 1 精确归属、`5,282,189 B → 26,455 B` 的确定性处理（字节缩减 `99.5%`）以及停止门槛：候选缺口只有 1 条会话，低于默认 2 条独立会话要求，因此保持 `HOLD`、没有生成规则。当前结论是“值得继续研究，但不宜直接接入主流程”。

## 交互研究网页

已将本研究整理为可运行的交互网页：[打开在线 Web](https://yydshly.github.io/0830_1_codex_project/projects/backpass-study/demo/)（[仓库内入口](demo/)）。它覆盖能力、实现原理、使用场景、可扩展方向和对本仓库的意义，并分两层演示：先用一条已授权真实 Codex 历史展示“发现 → 归属 → 压缩 → 候选信号 → 证据门槛”，再用三条合成会话展示“收集 → 压缩 → 损失 → 聚合 → 建议 → 人工接受/拒绝”的完整闭环。

本地运行：

```powershell
node .\projects\backpass-study\demo\serve.mjs
```

然后打开 <http://127.0.0.1:4173>。网页运行时不会重新读取本机历史；真实历史区只展示已经生成且可提交的派生统计与研究者释义。网页不调用模型，也不会修改仓库文件；浏览器验收见 [demo/VALIDATION.md](demo/VALIDATION.md)。

## 当前判断

Backpass 不是模型微调框架，而是一个本地优先、证据约束、人工审核的 Agent 项目记忆优化器。它把项目指令与 Skill 描述视为“权重”，把历史会话视为前向传播，把会话中的成功、违规、伤害和规则缺口视为损失信号，再让模型在机械门槛内提出小步修改。

其核心闭环是：

```text
AGENTS.md / CLAUDE.md / Skills
              ↓
         Agent 会话
              ↓
       本地历史会话记录
              ↓
发现归属 → 确定性压缩与脱敏 → 单会话分析
              ↓
   跨会话证据折叠与缺口账本
              ↓
    暂存区内生成小步修改建议
              ↓
      人工接受或拒绝后写入
```

它的研究价值高于当前直接采用价值：锁定版本仍处于 `0.1.x`，上游只声明验证了 macOS/Linux；本仓库又是包含异构研究项目的单体仓库，若不能按 `projects/<name>` 约束证据，局部经验可能被错误提升为根级规则。

2026-08-31 的单条真实历史实测进一步确认了这条边界：Backpass 能在不调用外部模型的情况下完成严格归属、事件规范化、压缩和正则脱敏，但语义损失判断仍需要模型或人工解释；而单个候选缺口因 `1 < 2` 未达到默认跨会话门槛，只能保持 `HOLD`，不能生成规则提案。

## 研究问题

1. Backpass 实际能够发现哪些 Agent 会话，并如何证明会话属于当前仓库？
2. “梯度下降”隐喻中，哪些步骤是确定性算法，哪些依赖 LLM 判断？
3. 引用、跨会话门槛、Token 预算、暂存区和人工审核能否有效阻止错误规则落盘？
4. 仅根据会话文本推断规则效果，会产生哪些因果归因偏差？
5. 在 Windows 与 Codex Desktop 环境中，哪些路径可运行，哪些存在兼容性问题？
6. 对多研究项目仓库，如何设计目录级记忆，避免项目特有经验污染根 `AGENTS.md`？

## 范围

### 包含

- 固定上游提交、许可证、运行时和外部工具依赖。
- 会话发现、仓库关联、压缩、脱敏、采样、分析、证据折叠和缺口账本。
- 建议生成、Token 预算、Skill 抽取、人工审核、写入新鲜度和回滚保护。
- Windows/Codex 环境下的源码契约、上游测试、单条已授权真实历史的派生证据实验和合成会话实验。
- 对本研究仓库的适用性、风险和扩展方案。

### 不包含

- 把真实个人会话内容或秘密提交为研究证据。
- 未经逐项审核自动修改本仓库的 `AGENTS.md`。
- 把 Backpass 误作代码审查器、CI 系统或模型微调框架。
- 当前阶段对云模型质量、价格或不同厂商模型做大规模排名。

## 能力地图

| 能力域 | 锁定版本实现 | 主要证据位置 |
| --- | --- | --- |
| 会话发现 | Claude、Codex、Pi、OpenCode、Grok、Cursor CLI、Hermes；Cursor IDE 为实验性入口 | `src/discovery/`、`src/config.js` |
| 仓库归属 | 活跃 worktree、Git remote、目录名/配置 glob 三层关联；`--strict` 排除弱关联 | `src/discovery/association.js` |
| 会话压缩 | 保留用户和 Agent 消息，压缩工具调用，截断长输出与超长会话 | `src/distill.js` |
| 隐私处理 | 对常见 API Key、Token、JWT、私钥和环境变量赋值做正则脱敏；匹配数为零也不等于内容已经匿名化 | `src/redact.js` |
| 成本控制 | 内容与记忆表面哈希缓存、并发分析、近期加权且稳定的会话采样 | `src/analyze.js`、`src/sample.js` |
| 损失分析 | 正向证据、伤害、未遵循、无关和未覆盖缺口；每项必须附原文引用 | `src/analyze.js`、`src/prompts/analysis.md` |
| 证据聚合 | 按规则计数、相关度、伤害会话数、缺口聚类和跨运行缺口账本 | `src/fold.js`、`src/gap-ledger.js` |
| 修改建议 | ADD、REMOVE、REWRITE、EXTRACT→SKILL；在暂存副本中原生编辑 | `src/synthesize.js`、`src/proposal.js` |
| 机械门槛 | 修改数、跨会话证据、删除伤害证据、引用、Token 预算和变更归属 | `src/proposal.js` |
| 人工应用 | 浏览器或终端逐项接受/拒绝；版本校验、组合预检、原子写入和回滚 | `src/commands/apply.js`、`src/apply/writer.js` |

## 实现原理

| 机器学习术语 | Backpass 中的实际对象 |
| --- | --- |
| 权重 | 项目 `AGENTS.md`、`CLAUDE.md` 和 Skills |
| 前向传播 | 一次 Agent 会话 |
| 损失信号 | 会话中规则的正负影响、未遵循和规则缺口 |
| 梯度 | 跨会话折叠后的定性证据 |
| 优化器 | 在暂存副本中编辑文件的高推理模型 |
| 学习率 | 单次最多允许的修改数 |
| 模型容量 | 常驻记忆文件和 Skill 描述的 Token 预算 |
| 稀疏化 | 将低频长规则抽取为按触发加载的 Skill |

这里不存在神经网络反向传播或数值梯度。更准确的技术描述是“LLM-as-judge 驱动、证据和机械门槛约束的提示词/项目记忆优化”。

会话超过默认上限时，采样权重按 `2^(-age / halfLife)` 衰减，再使用 `-ln(u) / weight` 的加权无放回采样键；`u` 由会话稳定标识与 seed 的哈希产生，因此重复运行不会无故重排同一批样本。

## 单条真实 Codex 历史实测

本次从当前仓库的大量 Codex 历史中显式选择一条顶层会话，只读执行 Backpass `0.1.14`（提交 `d8cbdb68`）的 Codex adapter、仓库关联、事件读取、压缩和正则脱敏。工作目录与仓库根精确匹配，记录的 Git commit 可在当前仓库解析，因此严格关联为 Tier 1 / exact。

| 指标 | 结果 |
| --- | --- |
| 选择范围 | 1 条已授权历史；不扫描或分析其他正文 |
| 输入与输出体积 | `5,282,189 B → 26,455 B`，字节缩减 `99.5%` |
| 规范化结构 | 175 events；4 user turns；23 assistant turns；147 tool calls |
| 压缩边界 | trace 发生截断；正则脱敏标记 0 个，**不代表已经匿名化** |
| 外部作用 | 0 次外部模型调用；未创建 `.backpass`；未修改任何规则文件 |
| 证据门槛 | 新 gap 默认至少 2 条独立会话；本次 `1 < 2`，状态 `HOLD`，未生成提案 |

本地人工阅读压缩轨迹后，研究者标记的候选摩擦是：交付末段才发现固定演示端口冲突，因而发生端口迁移和部分复验。它不是上游 LLM 判定，也不是已经成立的新规则，只是等待另一条独立会话佐证的候选。

锁定版本的官方 CLI 没有“只读取这个精确路径”的输入，也没有完全禁止按需读取原文的模式。为缩小授权范围，本研究使用 [单会话脚本](scripts/analyze-one-codex-session.mjs) 调用上游内部 API，要求显式传入唯一文件，并只把派生统计、不可逆指纹、门槛状态和研究者释义写入 [结构化证据](artifacts/real-codex-session-analysis.json)。原始路径、完整会话 ID、消息正文和压缩轨迹均未进入仓库。

## 可扩展使用场景

Backpass 当前的实现边界仍是“Git 仓库中的本地 Agent 会话 → `AGENTS.md` / `CLAUDE.md` / Skills”。下表把可扩展场景按落地距离分层，领域扩展不是锁定版本已经具备的即插即用能力。

| 落地距离 | 使用场景 | 需要补齐的能力 |
| --- | --- | --- |
| 当前近似可用 | 代码仓库规范治理、研究项目质量门禁、文档与知识库维护、Skill 与常驻记忆瘦身 | 稳定的仓库归属、足够独立会话、人工审核 |
| 近邻扩展 | 测试与缺陷修复闭环、CI/发布/回滚经验、事故响应 Runbook、多 Agent 交接与编排 | 测试和 CI 结果适配器、任务谱系去重、环境与目录作用域 |
| 领域扩展 | 数据分析与经营报告、客服 SOP、安全合规审查、内容生产与品牌规范 | 新会话源、业务真值、PII/DLP、权限治理、专用记忆载体与责任人批准 |

一个场景适合采用这种机制，需要同时满足四个条件：任务会重复；结果信号可观察；经验有稳定的写回载体；领域责任人能够审核和拒绝建议。只有聊天记录、没有客观结果或无人承担审核时，不应使用 Backpass 自动演化规则。

交互网页的“使用场景扩展地图”逐项给出了 12 个场景的证据输入、记忆写回、可观察收益与前置条件，并可按成熟度筛选。

## 关键风险

1. **因果归因不足：** 会话显示 Agent 遵守了某条规则，不等于结果由该规则造成；会话文本也不能可靠替代测试与最终验收。
2. **“不同会话”不等于独立样本：** 同一任务的重试、分支或并行 Agent 可能被计为多份支持证据。
3. **压缩会丢失信息：** 工具输出和长消息被截断；分析 Agent 虽可按需读取原始会话，但这会扩大隐私暴露面。
4. **脱敏不是数据防泄漏保证：** 正则只覆盖显著秘密格式，无法识别所有个人数据、业务数据和自定义凭据。
5. **上游会话格式不稳定：** 多个适配器依赖未正式承诺的本地存储格式。
6. **根级规则污染：** 当前以 Git 仓库为主要学习边界，不天然等价于本仓库的 `projects/<name>` 研究边界。
7. **平台成熟度：** 锁定版本为早期 `0.1.x`，上游说明只验证了 macOS/Linux。

## 可扩展方向

### P0：建立可信评测和平台基线

- 将测试、构建、CI、用户返工和最终 diff 接受情况加入损失信号。
- 对修改前后的指令运行同一组合成任务，形成反事实回放与回归测试。
- 修复 Windows 路径、测试替身和会话目录隔离问题，建立平台矩阵。
- 默认禁止读取原始会话，增加路径白名单、DLP 检测和纯本地模型模式。

### P1：适配异构研究仓库

- 按会话工作目录映射到最近的 `projects/<name>/AGENTS.md`。
- 只把跨多个项目重复出现的证据提升到根级规则。
- 为项目特定规则、跨项目规则和个人偏好建立明确层级。
- 识别同一任务的 fork、重试和并行子 Agent，避免伪独立证据。

### P2：团队与治理

- 通过 PR 提交建议，接入 Code Owners、审计记录和可回滚版本效果。
- 只共享经过脱敏和审核的派生证据，不共享原始会话。
- 对规则建立有效期、漂移检测、冲突图和长期效果统计。

## 验证标准

| 编号 | 假设或能力 | 验证方法 | 通过标准 |
| --- | --- | --- | --- |
| H1 | 上游身份、运行时和许可证可复现 | 获取脚本与契约测试 | HEAD 等于锁定 SHA；包名、版本、Node 要求和 MIT 许可证一致 |
| H2 | 核心流程确实覆盖发现、分析、折叠、建议和人工应用 | 源码契约与上游测试 | 对应阶段和 CLI 命令存在，关键测试通过 |
| H3 | 新增和删除规则受到代码级证据门槛约束 | 合成 evidence/proposal 测试 | 单会话新增被拒绝；非伤害负证据不能支持删除 |
| H4 | 建议不能在未审核或文件已变化时静默落盘 | apply 测试 | 未决定、过期 proposal 和部分组合失败均不写入 |
| H5 | Windows/Codex 路径可稳定运行 | 上游测试与合成会话 | 核心测试全通过，严格扫描结果稳定且无路径串扰 |
| H6 | 修改后的记忆可改善任务结果 | 固定任务的旧/新指令对照回放 | 成功率或返工率改善，且无已定义回归 |
| H7 | 多项目证据不会污染根规则 | 目录级合成数据集 | 项目特定缺口只进入目标项目记忆 |

## 实验矩阵

| 实验 | 变量 | 对照 | 证据位置 | 状态 |
| --- | --- | --- | --- | --- |
| E1 上游身份与能力契约 | 锁定提交源码 | 上游文档声明 | `tests/capability-contract.test.mjs` | 5/5 通过 |
| E2 Windows 上游测试基线 | Windows、Node 22.15 | 上游支持声明 | `artifacts/baseline-verification.md` | 266 通过、88 失败、2 跳过 |
| E3 单条真实 Codex 历史确定性处理 | 唯一显式路径、strict、无外部模型 | exact cwd 与 recorded commit 双重校验 | `artifacts/real-codex-session-analysis.json` | Tier 1 / exact；压缩 99.5%；`1 < 2` HOLD |
| E4 证据与修改门槛 | 会话数、负证据类型 | 单样本与多样本 | `tests/real-session-analysis.test.mjs`、源码契约 | 单样本 HOLD 已验证；多样本真实分析待开始 |
| E5 修改前后任务回放 | 旧版/新版记忆 | 固定任务集 | 待新增 benchmarks | 待开始 |
| E6 多项目证据隔离 | 根目录/项目目录会话 | 目录级期望规则 | 待新增 tests | 待开始 |

## 获取与复现

当前环境基线：Windows、PowerShell 7、Git、Node.js 22.15.0。完整模型分析还需要安装并认证 `acpx`；浏览器审核界面另依赖 `lavish-axi`，也可以用 `backpass apply --no-ui` 绕过。

在仓库根目录执行：

```powershell
powershell -ExecutionPolicy Bypass -File .\projects\backpass-study\scripts\fetch-upstream.ps1
node --test .\projects\backpass-study\tests\capability-contract.test.mjs

$selectedSession = "ABSOLUTE_PATH_TO_ONE_AUTHORIZED_ROLLOUT_JSONL"
node .\projects\backpass-study\scripts\analyze-one-codex-session.mjs --file $selectedSession --artifact .\projects\backpass-study\artifacts\real-codex-session-analysis.json

Push-Location .\projects\backpass-study\upstream\backpass
npm test
Pop-Location

node .\scripts\validate-repository.mjs
```

获取脚本会把锁定提交检出到 `upstream/backpass`。该目录用于本地实验并被项目 `.gitignore` 排除，不会把完整第三方仓库复制进主仓库。

## 结果与证据

- 上游身份、能力契约与 Windows 测试基线：[artifacts/baseline-verification.md](artifacts/baseline-verification.md)。
- 单条真实 Codex 历史的隐私收敛派生证据：[artifacts/real-codex-session-analysis.json](artifacts/real-codex-session-analysis.json)。它验证了严格归属、确定性压缩和单样本停止门槛，不包含原始路径、完整会话 ID、消息正文或压缩轨迹。
- 当前已证实：锁定提交、MIT 许可证、Node 要求、核心流水线和代码级门槛与记录一致，研究契约测试 5/5 通过。
- 当前新增证实：一条真实历史可经内部 API 归属为 Tier 1 / exact，并从 `5,282,189 B` 压缩到 `26,455 B`；单条候选缺口会因 `1 < 2` 保持 `HOLD`，未生成提案。
- 当前工程验证：能力、真实派生证据、网页与发布契约共 16/16 通过；仓库结构验证通过；三档视口、深色、键盘与 reduced-motion 浏览器路径通过。
- 当前被否定：锁定提交的完整上游测试套件在当前 Windows 环境中不能干净通过；356 项中 88 项失败，其中多项是少数平台假设造成的级联。
- 证据不足：真实建议质量、规则修改后的任务改善、多项目证据隔离和隐私边界仍需控制实验。
- 实验过程与失败记录：[research-log.md](research-log.md)。

## 后续问题

- 被接受的规则在后续会话中是否减少了同类错误，还是只改变了 Agent 的表述？
- 怎样将测试失败与用户返工作为比 LLM 判断更可靠的损失信号？
- 两个来自同一父任务的会话应如何降权或合并？
- 对本仓库，根记忆与 `projects/<name>` 记忆的提升规则应该是什么？
- 原始会话禁止读取后，确定性压缩能否保留足够的判断信号？

## 来源与许可证

- 锁定上游：[kunchenguid/backpass 0.1.14 @ `d8cbdb68`](https://github.com/kunchenguid/backpass/tree/d8cbdb68ca20a9ad6626810e0c24a576e43223c7)
- 提交详情：[`d8cbdb68ca20a9ad6626810e0c24a576e43223c7`](https://github.com/kunchenguid/backpass/commit/d8cbdb68ca20a9ad6626810e0c24a576e43223c7)
- 对应发布基线：[`backpass-v0.1.14`](https://github.com/kunchenguid/backpass/releases/tag/backpass-v0.1.14)，tag 指向 `c3302a8325ba835d976f545ab0fdf0997f5878a9`。
- 上游许可证：[MIT License](https://github.com/kunchenguid/backpass/blob/d8cbdb68ca20a9ad6626810e0c24a576e43223c7/LICENSE)，Copyright (c) 2026 Kun Chen。
- 外部执行层：[openclaw/acpx](https://github.com/openclaw/acpx)，MIT License，仍处于 pre-1.0。
- 本研究项目只提交原创分析、获取脚本和测试；上游源码保持其原许可证，不因被研究而改变授权关系。
