# Research log

实验记录按时间倒序排列。每次记录说明目标、环境、执行、观察、证据、判断和下一步；失败实验保留在记录中。

## 2026-08-30 · 可扩展场景版图与三模板演示

- **目标：** 回答 QMReader 还能扩展到哪些使用场景，并证明同一条信息管线能够映射到不同输入、判断方式和资产类型。
- **环境：** Windows 11；Node.js 22.15.0；本地静态服务 `127.0.0.1:4217`；Chromium；1440×1000、768×1024、390×844。
- **变更：** 将使用场景扩展为 8 个，按直接适用、轻量扩展、深度改造分层；主演示增加 AI 技术情报、论文雷达、产品与竞品信号三个模板；场景切换同步更新队列、管线、正文、日志、证据边界和资产类型。
- **执行：** 分别完成三套五阶段演示；检查运行中切换、暂停、继续、重置、唯一 `aria-pressed`、键盘 Enter、深浅双向切换、减弱动效和三档视口；运行页面契约、能力契约、语法和仓库结构检查。
- **观察：** 三个模板均到达 `PUBLISHED` 和资产 1，结构计数分别为 18/18、22/22、14/14；运行中切换会安全回到 idle / 00%。平板选择器保持三列、手机改为单列，均无页面级溢出。深色主题首次复验发现纸面 `PUBLISHED` 标签对比不足，固定纸面色板后复验通过；浏览器错误和控制台为空。
- **证据：** `site/browser-evidence.md`、`site/DELIVERY.md`、`tests/site-contract.test.mjs`、`artifacts/qmreader-site-scenarios.png`、`artifacts/qmreader-site-demo.png`、`artifacts/qmreader-site-scenarios-mobile.png`。
- **判断：** QMReader 最容易扩展到“来源相对固定、处理链稳定、输出可资产化”的任务。产品监测需要轻量业务规则；企业知识和合规监测只能借鉴工作流，不能把当前单机实现直接放大。
- **下一步：** 若继续产品化，优先把场景配置抽成版本化模板，并用固定真实样本评测每个模板的完整性、准确性、时延和成本。

## 2026-08-30 · 交互研究网页与跨视口验收

- **目标：** 用网页完整解释 QMReader 的能力、实现原理、使用场景、扩展方向与研究价值，并以最适合的“AI 技术情报加工”场景展示其核心工作流。
- **环境：** Windows 11；Node.js 22.15.0；本地静态服务 `127.0.0.1:4217`；Chromium 真实浏览器。
- **变更：** 新增纯 HTML/CSS/JavaScript 研究展厅、五阶段交互演示、深浅主题、响应式布局、静态服务器、页面契约测试、设计契约和浏览器证据。
- **执行：** 在 1440×1000、768×1024、390×844 三档视口检查首屏、全文和演示；走查 idle、running、paused、complete、reset；测试主题双向切换、Tab/Enter 键盘路径、`prefers-reduced-motion`、控制台和页面溢出。
- **观察：** 三档视口均无页面级横向溢出；平板主题按钮首次检查出现两字换行，补充 `white-space: nowrap` 后复验通过。演示完成态为 100%、`PUBLISHED`、公开资产 1；暂停、继续和重置均符合状态契约，重置后焦点返回运行按钮。深浅主题可读，减弱动效不丢失信息，控制台与浏览器错误均为空。
- **证据：** `site/browser-evidence.md`、`site/DELIVERY.md`、`tests/site-contract.test.mjs`、`artifacts/qmreader-site-desktop.png`、`artifacts/qmreader-site-demo.png`、`artifacts/qmreader-site-mobile.png`。
- **判断：** 网页足以说明 QMReader 的真实产品边界及值得复用的工作流；受控演示只能证明交互和概念闭环，不能替代真实 RSS、模型质量、成本和规模化实验。
- **下一步：** 选择固定文章样本和真实模型，测量正文可见时间、结构翻译遗漏率、改写质量、成本与失败重试。

## 2026-08-30 · 首轮源码、测试与依赖基线

- **目标：** 固定 QMReader 上游版本，验证其能力边界和关键架构声明，并建立后续实验可复现基线。
- **环境：** Windows 11；PowerShell 7；Git；Node.js 22.15.0；上游提交 `95efab925273924963d2fdb474a67890261402e3`。
- **变更：** 不修改上游源码；新增研究项目、固定提交获取脚本和源码契约测试。
- **执行：** 运行 `scripts/fetch-upstream.ps1`；在上游目录运行 `npm ci`、`npm test` 和核心文件 `node --check`；在研究项目运行 `node --test tests/capability-contract.test.mjs`；运行 `npm audit --json`。
- **观察：** 固定提交成功获取；研究项目源码契约测试 8/8 通过；8 个核心 JavaScript 文件语法检查通过。上游完整测试为 71 项中 66 项通过、5 项失败：4 项是 Windows 删除仍被占用的 SQLite 文件时产生的 `EBUSY` 清理失败，另 1 项是并行完整测试中的服务器启动超时。隔离复跑 `admin-submissions.test.js` 时 6 个功能测试均通过，启动超时未复现，但 SQLite 清理失败仍复现。`npm audit` 报告 1 high、1 moderate、1 low，共 3 个可修复告警。
- **证据：** `artifacts/baseline-verification.md`、`tests/capability-contract.test.mjs`、锁定上游源码。
- **判断：** H1、H2、H3、H4、H5、H6 均获得源码与静态契约证据支持；上游功能测试覆盖面较好，但 Windows 资源释放、并行测试稳定性和依赖安全基线需要修复。真实 AI 输出质量、线上抓取可靠性和规模化能力仍证据不足。
- **下一步：** 建立固定文章样本，评测结构化翻译的完整性、成本和时延。
