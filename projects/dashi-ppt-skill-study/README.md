# R-003 · Dashi PPT Skill 能力与工程机制研究

> 第 3 个研究子项目。研究受约束 AI Agent 如何将材料转换为可编辑、可验证、可导出的演示文稿，并判断这套生产线对重复汇报、品牌交付和研究发布是否值得采用。

**在线入口：** [交互式研究 Web](https://yydshly.github.io/0830_1_codex_project/projects/dashi-ppt-skill-study/showcase/) · [GitHub Pages 研究页](https://yydshly.github.io/0830_1_codex_project/projects/dashi-ppt-skill-study/) · [上游源库](https://github.com/chuspeeism/dashi-ppt-skill) · [固定提交](https://github.com/chuspeeism/dashi-ppt-skill/tree/7cb23347f91cda1a5519eafc8c040704e389535a)

| 字段 | 内容 |
| --- | --- |
| 研究编号 | `R-003` / 第 3 个研究子项目 |
| 状态 | 两轮真实实验完成；跨主题与跨 Office 验证待续 |
| 研究对象 | [chuspeeism/dashi-ppt-skill](https://github.com/chuspeeism/dashi-ppt-skill) |
| 锁定版本 | `0.4.11` / [`7cb23347f91cda1a5519eafc8c040704e389535a`](https://github.com/chuspeeism/dashi-ppt-skill/commit/7cb23347f91cda1a5519eafc8c040704e389535a) |
| 开始日期 | 2026-08-30 |
| 最近更新 | 2026-08-31 |
| 负责人 | yydshly |

## 交互式研究展厅

[打开本地专题网页](showcase/)：先从六个案例中选择两轮本机真实实验或四类扩展场景，再逐页检查 PowerPoint 渲染、3+1 候选、品牌契约、对象数量、截图回退与修正轨迹。真实实验提供 PPTX/PDF/机器报告下载；Dashi Compiler 和四类场景明确标记为机制或业务数据模拟。

## 执行摘要

- **它是什么：** Dashi 不是独立模型或普通模板包，而是“宿主 Agent + canonical content + 容量约束 + 3+1 候选 + 浏览器编辑 + 分层导出”的本地 PPT 生产线。
- **实测支持什么：** 固定输入和规则可以复现同一 goal；两轮实验均实际生成 HTML/PDF/PPTX，并通过最终 PowerPoint 越界检查。
- **它何时更有价值：** 高频、结构重复、需要同时比较多套方案、需要留下输入/分配/导出证据的组织汇报。
- **它何时不是最优：** 一次性高价值页面、严格品牌色、必须使用原生可编辑图表或复杂 PowerPoint 动画时，直接编程或定制主题/导出 recipe 更可控。
- **证据边界：** 两轮业务数据均为原创模拟数据；尚未测量模型 Token、人工 PowerPoint 时间和跨 WPS/LibreOffice 兼容性。

## 示例索引

| 示例 | 证据等级 | 展示重点 | 入口 |
| --- | --- | --- | --- |
| REAL RUN 01 · 库能力审计稿 | 本机真实生成 | 8 页×3+1、固定 seed、PowerPoint 越界修正、对象与回退 | [在线查看](https://yydshly.github.io/0830_1_codex_project/projects/dashi-ppt-skill-study/showcase/#real-run) |
| REAL RUN 02 · 园区能源试点 | 本机真实生成 | 品牌契约、生成媒体、负荷图表、Dashi 与直接编程对照 | [在线查看](https://yydshly.github.io/0830_1_codex_project/projects/dashi-ppt-skill-study/showcase/#real-run-02) |
| AI Agent 市场进入研究 | 交互模拟 | 访谈归纳、竞品矩阵、路径比较与 90 天验证 | [场景工作台](https://yydshly.github.io/0830_1_codex_project/projects/dashi-ppt-skill-study/showcase/#demo) |
| AI 内容产品 Q3 复盘 | 交互模拟 | ARR/NRR/CAC/毛利率、漏斗诊断与 Q4 行动 | [场景工作台](https://yydshly.github.io/0830_1_codex_project/projects/dashi-ppt-skill-study/showcase/#demo) |
| 生成式 AI 安全培训 | 交互模拟 | 学习目标、风险案例、判断流程与情境测验 | [场景工作台](https://yydshly.github.io/0830_1_codex_project/projects/dashi-ppt-skill-study/showcase/#demo) |
| 工业园区数字孪生方案 | 交互模拟 | 七层架构、价值、数据边界和 12 周试点路线 | [场景工作台](https://yydshly.github.io/0830_1_codex_project/projects/dashi-ppt-skill-study/showcase/#demo) |

## 真实运行 01

- 固定上游 `0.4.11` / `7cb23347`、`theme07`、8 页中文研究材料与 seed `dashi-study-20260831-r03`，未修改上游源码。
- 相同输入加同一组确定性修正规则生成的 `goal.json` 与 replay SHA-256 完全一致。
- 32 页对照稿包含 577 个文字、1,036 个形状、97 个图像对象；8 页 v4 精选稿包含 118 个文字、76 个形状、6 个图像对象。
- 初始静态 schema、props 和文案校验全部通过，但 PowerPoint 渲染仍在物理页 15、18 捕获越界；替换两个同主题布局后，对照稿和精选稿均通过 0 overflow 检查。
- v4 专项验证器仍对 8 页主题装饰 bleed 报警；截图和 PowerPoint QA 未发现正文裁切，故记录为尚未修复的启发式误报，而非把它隐藏为“全绿”。

机器可读结果见 [experiment-report.json](experiments/real-run-01/experiment-report.json)，输入、失败记录、重放文件和导出报告均保留在 [experiments/real-run-01](experiments/real-run-01/)。

## 真实运行 02：品牌、媒体与原生图表对照

- 固定上游 `0.4.11` / `7cb23347`、`theme03`、8 页园区能源协同试点内容、1 张可追溯生成媒体和 seed `dashi-study-20260831-brand-media-r01`。
- Dashi 生成 32 页候选稿并精选 8 页 v4：115 个文字、78 个形状、10 个图像对象；Dashi 图表采用 SVG/图像回退，但 10 个标签仍提取为可编辑文字。
- 同一输入的直接编程基线为 8 页：117 个文字、34 个形状、1 张主视觉和 1 个原生可编辑图表；请求的 navy/cyan/lime 品牌色被精确落实。
- Dashi 的 theme03 只能近似请求品牌；它的优势是候选生成、全稿分配与统一验证。直接编程只提供一条路线，但品牌与对象控制更精确。
- 两份 8 页 PPTX 和 Dashi 32 页候选稿最终均为 0 overflow；人工制作时间、模型 Token 和人工审阅成本未测量。

机器可读结果见 [REAL RUN 02 报告](experiments/real-run-02-brand-media/experiment-report.json)，可下载产物见 [artifacts/real-run-02-brand-media](artifacts/real-run-02-brand-media/)。

本地运行和验收说明见 [showcase/README.md](showcase/README.md)，浏览器证据见 [artifacts/frontend-verification.md](artifacts/frontend-verification.md)。

## 当前结论

Dashi PPT Skill 不是独立的大模型，也不是传统 PowerPoint 模板包，而是一套由宿主 Agent 驱动的本地演示文稿生产线：Agent 负责理解材料、形成逐页叙事和结构化内容；确定性脚本负责版式查询、全稿分配、React/HTML 渲染、浏览器编辑、校验和导出。

锁定版本的版式清单包含 12 个主题、1020 个版式和 8576 个控制项。每个逻辑页共享一份 canonical content，并生成 3 个模板候选和 1 个受主题设计系统约束的 Agent 定制候选。HTML 是交互和编辑能力最完整的主产物；PPTX 由浏览器读取实时 DOM 后逐节点转换，无法稳定映射的区域使用截图回退，因此“可编辑”是分层保真而不是所有元素百分之百原生化。

两轮实测支持一个更克制的结论：它的特色主要是可复现、可对照、可审计的生产线，不是独特视觉风格。固定 seed 能稳定复现布局，也能稳定复现不合适的布局；固定主题能提供一致的视觉方向，但不能自动满足无关品牌契约。严格品牌和原生图表场景中，直接编程基线更可控；高频标准化汇报中，Dashi 的 3+1 候选和验证链更有杠杆。PowerPoint 级视觉 QA 和人工选稿仍不可省。主体采用 AGPL-3.0，但 HTML→PPTX 导出子包为专有组件，不能把整个仓库简单视为可任意拆分复用的纯开源库。

## 研究问题

1. Dashi PPT Skill 的 Agent 指令、结构化中间表示、版式选择、渲染、编辑、校验和导出链路如何协作？
2. “canonical content + 3 个模板候选 + 1 个定制候选”能否减少换版式造成的事实漂移？
3. 1020 个版式和 8576 个控件中，有多少能被内容容量约束可靠选中和填充？
4. 导出 PPTX 后，文字、形状、图表和复杂背景分别保留到什么程度？
5. 固定输入、主题和 seed 时，生成结果是否可复现，时间与 Token 成本是多少？
6. 其许可证、局域网预览和专有导出组件会给内部使用、分发或产品化带来哪些边界？
7. 哪些设计值得用于本研究仓库的“研究材料 → 汇报演示”发布链路？

## 范围

### 包含

- 固定上游提交、版本和许可证边界。
- Skill 工作流、JSON schema、版式元数据、选择与分配算法、HTML 编辑器、校验器和导出链路分析。
- 使用固定材料、固定主题和固定 seed 的真实 HTML/PDF/PPTX 生成实验。
- 内容覆盖、重复性、可编辑性、视觉缺陷、时间和 Token 成本测量。
- PowerPoint、WPS 或 LibreOffice 中至少两种打开环境的兼容性观察。

### 不包含

- 修改或再分发专有 HTML→PPTX 导出组件。
- 未经授权把上游源码或主题资产嵌入独立商业产品。
- 用真实涉密材料测试默认局域网预览服务。
- 在首轮研究中制作新的完整主题或大规模重写上游架构。
- 对 AGPL 或专有许可证给出替代专业法律意见的结论。

## 能力与原理基线

```text
用户材料
  → 宿主 Agent 形成逐页 brief 与 canonical content
  → goal:scaffold 按内容容量查询候选版式
  → 全稿分配 3 个模板方案 + 1 个主题化定制方案
  → React 服务端渲染为离线 HTML 与浏览器编辑器
  → 文字、媒体、布局和页面状态在浏览器中修改并保存
  → Playwright 读取实时 DOM，导出 PDF / PPTX
  → schema、文案、运行时与截图校验
```

| 能力域 | 锁定版本的实现 | 主要证据 |
| --- | --- | --- |
| Agent 编排 | `SKILL.md` 规定需求确认、内容规划、选页、媒体、渲染、验收与交付流程 | `skills/dashi-ppt/SKILL.md` |
| 内容中间表示 | schema v2 每页保留一份内容，通过 `contentMap` 投影到多个视觉方案 | `references/goal-spec.schema.json`、`src/variant-contract.mjs` |
| 版式资产 | 12 个主题、1020 个 layout、8576 个 controls | `project/layout-manifest.json` |
| 内容适配 | 标题长度、条目数量、数值、嵌套和媒体是硬条件，角色和重点参与排序 | `scripts/workflow/layout-query.mjs` |
| 全稿分配 | beam search、seed、版式/结构复用惩罚与重复再平衡 | `scripts/workflow/layout-allocation.mjs` |
| 渲染 | React 静态渲染并把实际使用主题的 runtime 与资源打包到 deck | `src/renderDeck.jsx` |
| 浏览器编辑 | 文字就地编辑、媒体拖放、控件调整、页面管理、本地草稿和服务端自动保存 | `assets/template-swiss.html` |
| 导出 | Playwright 驱动实时 DOM；PPTX 采用逐节点映射与截图回退，PDF 采用截图链路 | `packages/html-deck-to-pptx`、`scripts/export-pptx.mjs` |
| 校验 | goal schema、文案覆盖、HTML 结构、四方案与定制页截图检查 | `project/scripts/validate-*.mjs` |

## 使用场景与初步采用判断

| 场景 | 适合度 | 当前判断 |
| --- | --- | --- |
| 研究报告、竞品分析、项目复盘 | 高 | 内容结构明确、需要快速形成统一叙事和视觉 |
| 内部培训、方案汇报、路演初稿 | 高 | 浏览器可编辑，能在 Agent 初稿后人工修订 |
| 批量生成同类报告 | 中高 | 结构化 schema 与固定 seed 有利于自动化，但成本待测 |
| 严格企业品牌模板 | 中低 | 需要新增主题契约和大量导出 QA，不能只改少量 CSS |
| 高度原创艺术指导 | 低 | 系统有意限制自由度以换取稳定性 |
| PowerPoint 原生复杂动画与母版 | 低 | HTML 表现力较高，但 PPTX 是派生产物 |
| 直接嵌入商业 SaaS | 谨慎 | AGPL 主体与专有导出组件同时存在，需要单独核对授权 |

## 可扩展方向

1. **研究证据型演示：** 从 README、research-log 和实验数据生成带 commit、实验编号、来源链接与证据状态的页面。
2. **独立质量基准：** 测量内容覆盖率、默认文案残留、溢出率、原生对象比例、字体漂移和跨 Office 兼容性。
3. **组织级设计系统：** 将品牌字体、色板、Logo、安全区和图表规范编码为主题、字段契约与校验规则。
4. **开放导出适配层：** 为 HTML→PPTX 定义稳定接口，以便对比或替换不同导出后端。
5. **版本化协作：** 让浏览器编辑结果可回写 canonical JSON，并支持页面级 diff、评论、审批和来源追踪。
6. **输入适配器：** 增加 DOCX、PDF、Excel、数据库和研究站点的结构化抽取，减少 Agent 手工整理 canonical content 的成本。

## 已知限制与风险

- 项目 README 自报一套 10 页 PPT 约消耗 10 万 Token，该数字需要在固定模型和固定输入下独立复测。
- 导出组件文档提到 `editableFidelity 0.851` 和 benchmark，但锁定仓库没有提供所引用的完整公开 benchmark 目录，不能直接视作独立证据。
- `html-deck-to-pptx` 子包 README 仍残留旧的 MIT/open-core 描述，但实际 `LICENSE` 和源码入口明确声明当前分发版本为专有组件，研究与采用以实际许可证为准。
- PPTX 通过截图回退保护视觉保真，复杂背景和效果可能不是原生可编辑对象。
- 预览服务默认可绑定 `0.0.0.0`，在局域网内可达；敏感材料测试应显式设置 `DASHI_PPT_PREVIEW_HOST=127.0.0.1`。
- 主题和版式资产规模较大，新增主题需要同步维护元数据、内容容量、媒体槽、控件和导出校验。

## 验证标准

| 编号 | 假设或能力 | 验证方法 | 通过标准 |
| --- | --- | --- | --- |
| H1 | 上游版本和许可证边界可精确复现 | 获取脚本与契约测试 | HEAD、版本、AGPL 主体和专有子包均匹配锁定记录 |
| H2 | 版式资产规模与项目声明一致 | 解析 `layout-manifest.json` | 12 个主题、1020 个版式、8576 个控件 |
| H3 | 内容与视觉方案通过 schema v2 解耦 | schema 与源码契约测试 | canonical content、3 template、1 bespoke 和 `contentMap` 均存在 |
| H4 | 版式分配不仅是随机套模板 | 静态契约与固定 seed 对照 | 存在容量过滤、多样性评分、复用惩罚且相同 seed 结果一致 |
| H5 | HTML 产物可本地编辑并保存 | 浏览器端到端实验 | 文字、媒体、控件和页面顺序修改后重开仍保留 |
| H6 | PPTX 具有可量化的编辑能力 | 导出后对象检查与人工复核 | 文字对象可编辑；记录形状、图表和截图回退比例 |
| H7 | 适合研究汇报生产链 | 与现有方案对照 | 内容覆盖不下降，并给出时间、Token、人工返工和视觉缺陷数据 |

## 实验矩阵

| 实验 | 变量 | 对照 | 证据位置 | 状态 |
| --- | --- | --- | --- | --- |
| E1 上游身份与能力契约 | 锁定 commit | 上游 README 声明 | `tests/capability-contract.test.mjs`、`artifacts/baseline-verification.md` | 已通过 |
| E2 固定输入与 seed 复现 | 同主题同 seed 重复生成 | 不同 seed / 固定替换规则 | `experiments/real-run-01/experiment-report.json` | 已通过；goal/replay 字节一致 |
| E3 HTML 编辑与持久化 | 文字、图片、控件、页面顺序 | 初始生成物 | 待补充 | 未执行 |
| E4 PPTX/PDF 导出保真 | HTML、PDF、PPTX | 浏览器与 PowerPoint 渲染 | `experiments/real-run-01/`、`experiments/real-run-02-brand-media/` | 两轮完成；最终 0 overflow |
| E5 内容与制作路线对照 | Dashi PPT Skill | 同输入直接编程基线 | `experiments/real-run-02-brand-media/experiment-report.json` | 部分完成；品牌/对象/本机耗时已测，Token 和人工时间未测 |
| E6 隐私边界 | loopback 与默认监听地址 | 默认配置 | `tests/capability-contract.test.mjs` | 静态边界已验证；未使用真实敏感材料 |

## 获取与复现

环境要求：Git、PowerShell、Node.js 20+、npm；导出 PDF/PPTX 还需要 Chrome、Chromium 或 Edge。

在仓库根目录执行：

```powershell
powershell -ExecutionPolicy Bypass -File .\projects\dashi-ppt-skill-study\scripts\fetch-upstream.ps1
node --test .\projects\dashi-ppt-skill-study\tests\capability-contract.test.mjs
node .\scripts\validate-repository.mjs
```

获取脚本把锁定提交检出到 `upstream/dashi-ppt-skill`。该目录仅供本地实验，并被本项目 `.gitignore` 排除，不会把上游完整源码和资产复制进主仓库。

首次执行真实生成实验时，再在上游的 `skills/dashi-ppt/project` 中按锁文件安装依赖。不要在仓库根目录引入该研究专用的 Node 运行时或依赖。

原始观察见 [research-log.md](research-log.md)，首轮结构验证结果见 [artifacts/baseline-verification.md](artifacts/baseline-verification.md)，研究展厅浏览器验收见 [artifacts/frontend-verification.md](artifacts/frontend-verification.md)。

## 后续问题

- 同一份研究材料在三种主题下的内容覆盖率、版式匹配和人工返工量有何差异？
- 固定 seed 是否能在上游依赖和浏览器版本变化后仍保持足够可复现？
- PPTX 中多少文字、图形和图表保持原生编辑，哪些效果被截图回退？
- canonical content 是否能保存事实来源和引用，而不只是展示文案？
- 对本研究仓库而言，最小可用集成应是安装 Skill、调用 CLI，还是抽象独立的研究演示发布层？

## 来源与许可证

- 上游仓库：[chuspeeism/dashi-ppt-skill](https://github.com/chuspeeism/dashi-ppt-skill)
- 锁定提交：[`7cb23347f91cda1a5519eafc8c040704e389535a`](https://github.com/chuspeeism/dashi-ppt-skill/commit/7cb23347f91cda1a5519eafc8c040704e389535a)
- 上游版本：`0.4.11`
- 主体许可证：[GNU AGPL-3.0](https://github.com/chuspeeism/dashi-ppt-skill/blob/7cb23347f91cda1a5519eafc8c040704e389535a/LICENSE)
- 导出子包许可证：[Dashi PPT Export Engine Proprietary License](https://github.com/chuspeeism/dashi-ppt-skill/blob/7cb23347f91cda1a5519eafc8c040704e389535a/skills/dashi-ppt/project/packages/html-deck-to-pptx/LICENSE)
- 本研究项目只提交原创分析、固定提交获取脚本和验证代码；上游源码及其资产保持各自原许可证，不因被研究而改变授权关系。
