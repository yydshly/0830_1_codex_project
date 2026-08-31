# R-004 · ViMax 能力研究

> 基于固定源码版本，回答 ViMax 实际能做什么、如何实现、哪些能力尚不能视为生产级保证。

| 字段 | 内容 |
| --- | --- |
| 研究编号 | R-004（当前研究索引第 4 项；编号不随排序变化） |
| 状态 | 进行中 |
| 研究对象 | [HKUDS/ViMax](https://github.com/HKUDS/ViMax) |
| 上游版本 | v1.2.0 |
| 锁定提交 | [`05a48943878312d88fe5a016c12a9654940ecc43`](https://github.com/HKUDS/ViMax/commit/05a48943878312d88fe5a016c12a9654940ecc43) |
| 论文版本 | [ViMax: Agentic Video Generation, arXiv:2606.07649v2](https://arxiv.org/abs/2606.07649v2) |
| GitHub 研究目录 | [yydshly/0830_1_codex_project · projects/vimax-study](https://github.com/yydshly/0830_1_codex_project/tree/main/projects/vimax-study) |
| 在线研究页 | [R-004 · ViMax 能力研究](https://yydshly.github.io/0830_1_codex_project/projects/vimax-study/) |
| 在线交互展厅 | [能力、案例、实现、演示与扩展](https://yydshly.github.io/0830_1_codex_project/projects/vimax-study/showcase/) |
| 开始日期 | 2026-08-30 |
| 最近更新 | 2026-08-31 |
| 负责人 | yydshly |

## 当前结论

ViMax 不是视频基础模型，而是一套 Agentic 视频生产编排框架。它把 LLM、图像生成模型、视频生成模型、检索器和媒体拼接工具组织成以下流水线：

> 创意、剧本或小说 → 叙事规划 → 角色与分镜 → 关键帧 → 单镜头视频 → 顺序拼接

固定版本已经实现 Idea2Video、Script2Video、Novel2Video、角色参考图传播、相机依赖图、转场视频锚定、并行渲染、断点复用、TUI 和 Web 工作区。它适合生成多镜头 AI 视频样片和研究长叙事一致性，但当前代码不能证明可以稳定产生电影级成片。

论文描述的 VLM best-of-k 质量控制在源码中有独立选择器实现，但没有接入当前主渲染 Pipeline；README 的音视频绑定也不能等同于独立配音、口型同步和专业混音。详细证据见[能力证据清单](artifacts/capability-evidence.md)。

## 交互式网页展厅

[在线打开 ViMax 研究展厅](https://yydshly.github.io/0830_1_codex_project/projects/vimax-study/showcase/)（[仓库内入口](showcase/)）可以按“能力 → 真实案例 → 实现方式 → 上游演示 → 可扩展方向”的路径浏览本研究。真实案例实验室包含固定上游的 README 猫狗创意、默认篮球剧本、Mara 咖啡师 8 镜头 fixture、餐厅厨房 14 镜头 fixture；可逐步查看输入、阶段产物、镜头锚点和人工门禁。页面明确区分上游原文/fixture、教学推导和未实跑结果，不把镜头板冒充生成成片。

页面使用零依赖静态 HTML、CSS 和 JavaScript，适合直接由 GitHub Pages 托管。

本地运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\serve-showcase.ps1
```

然后打开 `http://127.0.0.1:4185/`。也可以通过 `-Port` 参数选择其他空闲端口。网页实现与验收资料见：

- [前端设计契约](docs/frontend-design-contract.md)；
- [覆盖清单](docs/frontend-coverage.md)；
- [浏览器验收记录](docs/frontend-validation.md)；
- [网页交接说明](docs/frontend-handoff.md)；
- `tests/verify-showcase.mjs`；
- [桌面、平板与手机视觉证据](artifacts/README.md)。

## 能力总览

| 输入模式 | 已实现处理 | 可得到的结果 |
| --- | --- | --- |
| Idea2Video | 扩写故事、提取角色、生成剧本、逐场景调用 Script2Video | 从简短创意生成多场景视频 |
| Script2Video | 提取角色、生成角色参考图、设计分镜和镜头、生成关键帧与视频片段 | 从明确剧本生成多镜头视频 |
| Novel2Video | 小说切块压缩、事件提取、FAISS 检索、rerank、场景规划、跨事件角色合并 | 将长篇文本规划为分事件、分场景的视频内容 |
| Agent 工作区 | 会话持久化、文件上传、规划与修订、产物预览、渲染检查点 | 在 TUI 或 Web UI 中分阶段审阅与恢复任务 |

ViMax 主要尝试改善以下效果：

- 同一角色在不同镜头中的外观相对一致；
- 同一场景从宽景切换到中景或特写时保留部分构图和空间关系；
- 长篇小说拆成多个场景后仍能找回相关原文信息；
- 失败或中断后复用已经生成的 JSON、图片和视频；
- 对可以独立生成的镜头分支进行并发处理。

它目前不提供确定性保证。复杂多人接触、拥挤画面、精确商品外观、对白口型、音乐节奏、专业时间线剪辑以及完全离线运行仍需要额外系统。

## 研究问题

1. 固定提交实际实现了哪些输入模式、产物和交互入口？
2. 长叙事规划、角色一致性和空间一致性分别依靠哪些代码机制？
3. 论文和 README 中的能力主张，哪些已接入主流程，哪些仅部分实现？
4. 接入其他图像或视频模型时，现有协议和配置是否提供足够清晰的扩展点？
5. 在固定生成模型和预算下，依赖图、RAG 和质量控制是否能带来可重复的质量提升？

## 范围

### 包含

- 固定并获取 ViMax 上游源码；
- 静态审查三个核心 Pipeline、Agent runtime、生成器协议和 Web/TUI 入口；
- 建立能力到源码的证据映射；
- 标记论文机制与当前主分支实现之间的差距；
- 为后续 planning-only 和小规模渲染实验定义验证标准。

### 不包含

- 本轮不修改 ViMax 上游源码；
- 不把上游完整仓库提交到本研究仓库；
- 不在未设成本上限时调用收费图像或视频 API；
- 不宣称静态代码审查已经验证最终视频质量；
- 不评估第三方模型和服务自身的商业授权、内容政策或稳定性。

## 背景与基线

朴素的多镜头生成基线是：为每个镜头独立编写提示词、独立调用视频模型，最后顺序拼接。这种方式没有共享的角色参考、场景状态或镜头依赖，容易出现人物、服装、物体和空间布局漂移。

ViMax 在该基线上增加三层控制：

1. 叙事层：层级拆分、事件链、RAG 和角色全局信息；
2. 视觉层：角色肖像、参考图选择、相机父子依赖和转场视频；
3. 运行层：Agent 工具调用、持久化产物、并行执行和断点恢复。

## 验证标准

| 编号 | 假设或能力 | 验证方法 | 通过标准 |
| --- | --- | --- | --- |
| H1 | 三种输入工作流均有独立实现 | 固定源码静态检查 | 三个 Pipeline 和对应入口存在，核心阶段可映射到代码 |
| H2 | 源码实现了跨镜头参考传播 | 检查角色注册表、相机树、转场视频和关键帧依赖 | 四类机制均有主流程调用证据 |
| H3 | Novel2Video 使用检索增强规划 | 检查分块、FAISS、embedding、rerank 和场景提取 | 检索结果实际作为场景规划输入 |
| H4 | 渲染后端可以被替换 | 检查 Protocol、工厂和现有适配器 | 新后端只需满足统一异步方法并通过配置实例化 |
| H5 | 论文质量控制已完整进入开源主流程 | 搜索 BestImageSelector 的生产调用点 | 主 Pipeline 实际生成多个候选并调用 VLM 选择器 |
| H6 | 依赖图能改善一致性 | 固定模型和种子的有/无依赖图对照实验 | 一致性指标和盲评均优于基线，且报告成本与时延 |

## 实验矩阵

| 实验 | 变量 | 对照 | 证据位置 | 结果 |
| --- | --- | --- | --- | --- |
| E1 上游获取 | 固定 commit | 远程 main 浮动版本 | `scripts/fetch-upstream.ps1`、Git HEAD | 已通过 |
| E2 能力静态核验 | Pipeline、Agent、协议和入口 | README 宣传文案 | `tests/verify-capabilities.mjs`、[能力证据](artifacts/capability-evidence.md) | 已通过 |
| E2b 真实案例解释器 | 4 个固定上游输入、8 阶段与镜头板 | 抽象场景文案 | `case-data.js`、`verify-showcase.mjs`、浏览器交互与截图 | 已通过（只验证解释与交互） |
| E3 planning-only 冒烟 | Idea、Script、Novel 三种输入 | 无规划基线 | 后续日志和结构化产物 | 待验证 |
| E4 视觉依赖消融 | 有/无相机图和参考传播 | 独立镜头生成 | 后续指标、视频与盲评 | 待验证 |
| E5 VLM 质量控制 | 单候选与 best-of-k | 相同图像模型和提示词 | 后续成本、质量和失败率 | 待验证 |

## 获取与复现

要求：Git、PowerShell、Node.js。运行 ViMax 本体还要求 Python 3.12 及 uv；Web UI 要求 Node.js 18 或更高版本。

在本项目目录执行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\fetch-upstream.ps1
node .\tests\verify-capabilities.mjs
node .\tests\verify-showcase.mjs
```

获取脚本只拉取锁定提交，并把工作副本放到忽略目录 `upstream/ViMax`。验证脚本会检查：

- Git HEAD 是否等于锁定提交；
- MIT 许可证、Python 版本和核心入口；
- 三个 Pipeline 与一致性机制；
- 图像和视频生成器适配器；
- BestImageSelector 是否接入主 Pipeline；
- 是否存在独立 TTS、口型或配音流水线。

如需安装上游依赖：

```powershell
Set-Location .\upstream\ViMax
uv sync --locked
```

运行真实生成前需要自行配置 LLM、图像、视频 API；Novel2Video 还需要 embedding 和 reranker。不得将密钥写入本仓库。

## 结果与证据

- [能力证据清单](artifacts/capability-evidence.md)：能力、实现路径、输出和边界；
- [交互式研究展厅](showcase/)：能力、场景、实现、演示和扩展方向；
- [浏览器验收](docs/frontend-validation.md)：三档视口、键盘、主题、回退与性能证据；
- [研究日志](research-log.md)：获取、审查、环境和判断记录；
- [`verify-capabilities.mjs`](tests/verify-capabilities.mjs)：可重复的源码结构核验；
- 本地上游副本：`upstream/ViMax`，HEAD 为锁定提交，不纳入版本控制。

## 结论

### 已证实

- ViMax 是生成模型之上的视频生产编排层，不是独立视频基础模型；
- Idea2Video、Script2Video 和 Novel2Video 在固定源码中均有实现；
- 角色参考图、相机依赖、转场锚点和 RAG 是其主要一致性手段；
- 当前实现支持持久化产物、断点复用、TUI、Web UI 和多种云端生成器；
- 后端协议较薄，适合继续接入新的图像和视频服务。

### 证据不足或未证实

- 尚未用真实 API 验证最终视频质量、成本、时延和故障恢复率；
- 论文的 VLM best-of-k 质量控制没有在当前主 Pipeline 中形成完整调用闭环；
- 尚不能把“音视频绑定”解释为完整的配音、口型和混音系统；
- 论文基准提升不能直接外推到中文短剧、产品广告或其他特定领域。

## 已知限制

- 最终质量高度依赖外部 LLM、图像和视频模型；
- 长视频本质上是多个短镜头的生成与拼接；
- 外部 API 会带来费用、速率、隐私和模型更新风险；
- 上游 MIT 许可证只覆盖仓库代码，不替代第三方模型和服务条款；
- 当前静态核验不等于端到端运行验证。

## 后续问题

- 先完成不调用图像和视频 API 的 planning-only 冒烟实验；
- 选择 2 个场景、8 个镜头的固定中文样例；
- 接入质量控制闭环，并记录每次重生成原因；
- 对比独立镜头、串行参考链和相机依赖图；
- 建立成本、延迟、失败率和人工修改次数的统一报告。

## 来源与许可证

- 上游源码：[HKUDS/ViMax](https://github.com/HKUDS/ViMax)，锁定提交 `05a48943878312d88fe5a016c12a9654940ecc43`；
- 上游版本：`pyproject.toml` 声明 v1.2.0；
- 上游许可证：[MIT License](https://github.com/HKUDS/ViMax/blob/05a48943878312d88fe5a016c12a9654940ecc43/LICENSE)，Copyright (c) 2025；
- 论文：[ViMax: Agentic Video Generation](https://arxiv.org/abs/2606.07649v2)，论文页面标注 CC BY 4.0；
- 图像、视频、LLM、embedding 和 reranker 服务分别受各自条款约束。
