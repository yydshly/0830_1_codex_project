# Research log

实验记录按时间倒序排列。失败实验保留，不以重写历史的方式删除。

## 2026-08-31 · R-004 发布到 GitHub 与 GitHub Pages

- **目标：** 把 ViMax 研究结论、固定源库索引和交互展厅发布为公开、可追溯的研究子项目。
- **研究编号：** `R-004`，表示当前根研究索引的第 4 项；作为稳定标识，不随表格排序变化，也不声称是可由 Git 历史证明的创建顺序。
- **提交：** `8577a6d`（`research: publish R-004 ViMax study`）已推送到 `yydshly/0830_1_codex_project` 的 `main`。提交范围仅包含根 README 的 ViMax 单行索引和 `projects/vimax-study/`，未带入工作区中其他未跟踪研究。
- **自动化：** Repository checks [run 33363677741](https://github.com/yydshly/0830_1_codex_project/actions/runs/33363677741) 通过；Deploy research site [run 33363677872](https://github.com/yydshly/0830_1_codex_project/actions/runs/33363677872) 的 Jekyll build 与 Pages deploy 均通过。
- **HTTP 验证：** [仓库研究站首页](https://yydshly.github.io/0830_1_codex_project/)、[R-004 研究页](https://yydshly.github.io/0830_1_codex_project/projects/vimax-study/)、[在线展厅](https://yydshly.github.io/0830_1_codex_project/projects/vimax-study/showcase/)和 [GitHub 研究目录](https://github.com/yydshly/0830_1_codex_project/tree/main/projects/vimax-study) 均返回 200，并包含 `R-004`。
- **浏览器验证：** 线上展厅加载 6 张能力卡、4 个真实案例、6 个实现节点和 3 个官方演示入口；切换到厨房案例得到 14 个镜头，运行类筛选得到“Agent 工作区”和“模型调度与恢复”。CSS、`case-data.js`、`app.js` 和上游 Web UI 图均正常加载，无横向溢出、错误遮罩、控制台错误或页面错误。
- **公开摘要：** 根 README 与项目 README 同时提供固定上游 commit、GitHub 研究目录、在线研究页和在线展厅入口，并明确真实成片质量、成本和 best-of-k 主流程闭环仍待实测。
- **限制：** 官方视频和上游 Web UI 图片仍是外部热链；页面保留延迟加载与错误回退，但不能控制 GitHub 附件未来的可用性。

## 2026-08-31 · GitHub 发布前检查发现旧文案断言

- **目标：** 在把 R-004 研究页与交互展厅发布到 GitHub Pages 前，重新执行项目与仓库验证。
- **执行：** `node .\tests\verify-showcase.mjs`、`node .\tests\verify-capabilities.mjs`、`node .\scripts\validate-repository.mjs`。
- **观察：** 能力测试和仓库结构校验通过；网页测试因仍要求旧标题“使用场景”而失败。当前页面已经把该表面升级为“四个真实上游案例”的“真实案例实验室”，页面、案例数据和交互均存在。
- **判断：** 这是测试契约落后于已记录的案例实验室改版，不是网页能力回退。
- **修正：** 把断言更新为“真实案例实验室”，并新增对稳定研究编号 `R-004`、上游源库、在线研究页和在线展厅索引的验证；随后重新执行完整检查。

## 2026-08-31 · 用四个真实上游案例完成能力解释器

- **目标：** 不再用抽象“内容创作者/研究者”场景解释 ViMax，而是让用户用固定上游输入观察 Idea2Video、Script2Video 和一致性 fixture 到底约束了什么。
- **案例：** README 的猫狗儿童创意；`main_script2video.py` 的校园篮球纠错剧本；`barista_coffee_cultures_typeA.json` 的 2 场 8 镜头；`cooking_competition_restaurant_typeB.json` 的 3 场 14 镜头。来源均固定到 commit `05a48943878312d88fe5a016c12a9654940ecc43`。
- **变更：** 将“使用场景”改成真实案例实验室；每例提供 8 个生产阶段、镜头板、输入/参考锚、风险和人工门禁；加入“孤立生成 / 参考链”机制对照；Benchmark 模式单独标为“假设接入 ViMax”。
- **真实性边界：** 猫狗与篮球的 8 镜头是按上游输入做的教学拆分，不是仓库提交的 storyboard；两个 Benchmark 是真实 JSON fixture，但上游没有读取其 schema 的 runner、配对生成媒体或评分程序；九个 README 视频也没有可核验的案例映射。Novel2Video 因缺少小说—总成片对，只保留边界说明。
- **源码复核修正：** 将每镜头产物修正为 `shots/<idx>/shot_description.json`；说明 `last_frame.png` 只对 medium/large 变化镜头需要；移除 Script2Video 不存在的肖像失败回退；将 Mara 纠正为 2 场、8 镜头、7 类地点。
- **静态验证：** `node .\tests\verify-showcase.mjs` 通过，确认 4 个案例、每例 8 阶段、镜头数 8/8/8/14、固定 commit 来源、真实性文案和 `case-data.js → app.js` 加载顺序。能力验证使用进程级 `safe.directory` 配置后通过。
- **浏览器验证：** HeadlessChrome 151 + agent-browser 0.27.0；四案例可用 Enter/方向键切换，篮球为 8 镜头、Mara 为 8 镜头、厨房为 14 镜头；End 可到厨房第 8 阶段和第 14 镜头；两种参考模式同步更新说明。1440×1000、768×1024、390×844 均无横向溢出，明暗主题可读，控制台与页面错误为空。
- **失败记录：** 直接运行能力测试首次被 Git 的 `dubious ownership` 检查拦截；这是本地上游副本的 Windows SID 差异，不是代码失败。没有修改全局 Git 配置，改用该进程的 `GIT_CONFIG_COUNT/GIT_CONFIG_KEY_0/GIT_CONFIG_VALUE_0` 声明唯一安全目录后复验通过。
- **证据：** `showcase/case-data.js`、`tests/verify-showcase.mjs`、[Revision 2 浏览器验收](docs/frontend-validation.md)、[`showcase-case-lab.png`](artifacts/showcase-case-lab.png) 及三档截图。
- **判断：** 页面现在能说明“想法如何变成一组可审阅的视频生产产物”，但没有证明这些案例已经在本机渲染成片；真实生成质量、成本、延迟和一致性提升仍属于后续实验。

## 2026-08-30 · 完成交互式研究展厅与多视口验收

- **目标：** 用网页清晰展示 ViMax 的能力、使用场景、实现链路、上游演示、能力边界与可扩展方向。
- **环境：** Windows；Python 3.10 静态服务；Node.js v22.15.0；agent-browser 0.27.0；HeadlessChrome 151.0.0.0。
- **上游：** 所有源码证据链接继续固定到 HKUDS/ViMax v1.2.0、commit `05a48943878312d88fe5a016c12a9654940ecc43`；官方视频使用 GitHub user-attachments 原地址，官方 Web UI 使用固定 commit 的 raw 地址。
- **变更：** 新增零依赖静态研究展厅、响应式明暗主题、能力筛选、场景与流程切换、点击后加载的三组上游视频、错误回退、网页结构测试、设计契约、覆盖清单和交接文档。
- **执行：** `node .\tests\verify-showcase.mjs`、`node .\tests\verify-capabilities.mjs`；在 1440×1000、768×1024、390×844 三档视口进行浏览器验收，并模拟 reduced-motion 和媒体错误。
- **观察：** 三档视口均无横向溢出；能力筛选、方向键标签、Home/End 流程导航、主题持久化、视频延迟加载和 A/B 切换均正常。视频点击后达到 `readyState=4`。控制台与页面错误为空。本地静态服务测得 TTFB 2.8ms、FCP/LCP 40ms、CLS 0。
- **修正：** 首轮整页截图无法触发位于页面后部的懒加载 Web UI 图片，导致证据区空白；改为页面加载时获取关键证据图，保留三个大型视频的用户触发加载，复验通过。
- **证据：** [浏览器验收](docs/frontend-validation.md)、[覆盖清单](docs/frontend-coverage.md)、`artifacts/showcase-*.png`、`tests/verify-showcase.mjs`。
- **判断：** 网页已能可信展示固定版本的能力和边界；它是研究成果的交互表达，不是 ViMax 真实生成质量实验。
- **限制：** 公网视频与 raw 图片仍受 GitHub 可达性影响，页面已提供文字回退；真实模型的质量、费用、延迟和隐私风险仍未验证。
- **下一步：** 在设定预算和 API 策略后运行 planning-only 冒烟，再决定是否进行小规模真实渲染与一致性消融。

## 2026-08-30 · 固定上游版本并完成能力静态审查

- **目标：** 获取 ViMax 源码，回答固定版本实际实现了哪些能力，并区分代码事实与宣传或论文主张。
- **环境：** Windows；Git；Node.js v22.15.0；uv 0.11.2；系统默认 Python 3.10.11，另有 Python 3.12；FFmpeg 6.1.3；NVIDIA GeForce RTX 4070 Laptop GPU 8 GB。
- **上游：** HKUDS/ViMax v1.2.0，commit `05a48943878312d88fe5a016c12a9654940ecc43`，提交时间 2026-07-29T16:56:44+08:00。
- **变更：** 新建研究项目；增加固定提交获取脚本、源码结构验证脚本和能力证据清单；未修改上游代码。
- **执行：** `powershell -ExecutionPolicy Bypass -File .\scripts\fetch-upstream.ps1`，随后执行 `node .\tests\verify-capabilities.mjs`。
- **观察：** 上游工作副本可以固定到目标 commit；三个核心 Pipeline、FAISS/RAG、相机依赖图、转场视频、生成器协议、TUI 和 Web UI 均存在。BestImageSelector 只在自身模块出现，未发现主 Pipeline 调用。主视频生成把 `audio_desc` 拼入视频提示词，未发现独立 TTS、口型同步或配音模块。
- **证据：** [能力证据清单](artifacts/capability-evidence.md)、`tests/verify-capabilities.mjs` 的通过输出、被忽略的本地 `upstream/ViMax` 工作副本。
- **判断：** H1、H2、H3、H4 获得静态证据支持；H5 被当前固定版本代码否定；H6 尚需真实生成实验。
- **限制：** 本轮未安装全部 Python 依赖，也未配置或调用收费模型 API，因此不能评价最终视频观感、成本和运行成功率。
- **下一步：** 运行 planning-only 冒烟实验，先验证结构化故事、角色、分镜和相机树产物，不启动图像或视频渲染。

## 2026-08-30 · 获取脚本首次运行失败

- **目标：** 使用新建的 PowerShell 脚本获取锁定的 ViMax commit。
- **环境：** Windows PowerShell；空的 `upstream/ViMax` Git 仓库。
- **变更：** 首版脚本通过 `git remote get-url origin` 判断 origin 是否存在。
- **执行：** `powershell -ExecutionPolicy Bypass -File .\scripts\fetch-upstream.ps1`。
- **观察：** `git remote get-url origin` 对新仓库返回 `No such remote 'origin'`；在 `$ErrorActionPreference = "Stop"` 下，stderr 在脚本检查 `$LASTEXITCODE` 之前中止了执行。脚本仅初始化了空 Git 仓库，尚未 fetch 或 checkout。
- **证据：** 终端错误 `error: No such remote 'origin'`；`upstream/ViMax/.git` 存在但没有 origin。
- **判断：** 失败来自 remote 探测方式，不是上游网络、commit 或权限问题。
- **下一步：** 先执行无错误的 `git remote` 列举，再决定添加或校验 origin，并重新运行同一脚本。
