# Research log

实验记录按时间倒序排列。每次记录说明目标、环境、执行、观察、证据、判断和下一步；失败实验保留在记录中。

## 2026-08-31 · R-003 GitHub 公开发布与线上验收

- **目标：** 把锁定源码分析、两轮真实实验和四类模拟场景整理成第 3 个研究子项目，并让根索引、项目摘要、源库与在线 Web 形成可公开追溯的入口。
- **执行：** 统一使用 `R-003`；Web 增加 2 个真实实验 + 4 个模拟场景的六案例索引；发布候选保留被页面直接引用的 PPTX/PDF/render，排除上游 checkout、缓存、重复中间 HTML、montage 和临时对象检查文件。首次公开提交为 `e916b29f45d0de738205d5195d96a3448a05db13`。
- **质量：** 能力契约 8/8、专题页契约 14/14、仓库结构验证通过。本地和 GitHub Pages 均在 1440×1000、768×1024、390×844 验证 HTTP 200、0 overflow、0 console error；手机 reduced-motion 生效。第二轮 5 个 PPTX/PDF/报告链接在线均为 HTTP 200。
- **发布：** Repository checks run `33371746745` 与 Deploy research site run `33371746832` 通过；根索引、R-003 研究页和 canonical Web 均公开可达。
- **判断：** 当前子项目已从“是否分析”进入“源码分析、实跑、对照、演示与公开部署均完成”的状态。后续研究空间仍包括跨主题、PowerPoint/WPS/LibreOffice 兼容性、Token 与人工审阅时间；这些是新增研究，不是本次发布缺口。
- **证据：** `docs/frontend-coverage.md`、`artifacts/frontend-verification.md`、`artifacts/frontend-evidence/real-run-browser-report.json`、GitHub commit 与两条 Actions runs。
- **下一步：** 仅在有新的实际采用问题时追加实验；现有 R-003 版本作为公开研究基线维护。

## 2026-08-31 · REAL RUN 02：品牌、媒体、图表与直接编程基线

- **目标：** 在第一轮“视觉仍偏通用”的结论上继续验证：加入明确品牌契约、生成媒体和负荷图表后，Dashi 能否形成更接近真实业务决策的完整演示；同时用同一输入的直接编程 PPTX 作为控制组。
- **执行：** 锁定 `0.4.11` / `7cb23347`、`theme03`、8 页 GRIDWISE LAB 园区能源协同试点、seed `dashi-study-20260831-brand-media-r01`；生成 32 页 Dashi 3+1 候选、8 页 v4 PPTX/PDF，并用同一内容生成 8 页直接编程基线。全部业务、运营与财务数字为原创模拟数据。
- **观察：** 首次带图 v4 组合没有把 canonical media 的 `src/alt` 映射到可见元素，工作流失败 2 次；补齐 media 字段和 contentMap 后通过。Dashi 精选稿含 115 文字、78 形状、10 图像；直接编程基线含 117 文字、34 形状、1 图像和 1 个原生图表。Dashi theme03 只能近似请求的 navy/cyan/lime，直接编程可精确落实。
- **质量：** Dashi 32 页对照稿与 8 页精选稿均为 0 overflow；直接编程基线经三次可见排版修正后也达到 0 overflow。Dashi scaffold/render/v4 PPTX 本机墙钟时间约 2.1s/3.8s/8.1s；直接编程构建约 3.9s，但两者都未计内容创作、模型 Token 和人工审阅。
- **判断：** 品牌化媒体和决策叙事能显著提升最终可读性，但不会改变底层取舍。高频标准化、需要候选与审计时，Dashi 更有杠杆；严格品牌和原生图表必须保证时，直接编程或新增 Dashi 主题/导出 recipe 更稳妥。
- **证据：** `experiments/real-run-02-brand-media/experiment-report.json`、两套 PPTX、Dashi PDF、逐页 PowerPoint render、失败记录与来源说明。
- **下一步：** 把第二轮纳入 R-003 在线研究发布；后续只在明确需要时追加跨主题和 PowerPoint/WPS/LibreOffice 兼容性对照。

## 2026-08-31 · REAL RUN 01：8 页 × 3+1 真实导出

- **目标：** 回应“看起来只是基础通用 PPT”的判断，用固定输入真实运行上游，而不是继续增加模拟样例。
- **执行：** 锁定 `0.4.11` / `7cb23347`、`theme07`、8 页中文研究 brief、seed `dashi-study-20260831-r03`；生成 32 页 3+1 HTML，对照导出 PPTX/PDF，再导出 8 页 v4 精选稿。上游 Windows HTTPS 包装器因缺少 OpenSSL 预检失败，研究 harness 保持导出引擎与浏览器启动器不变，改用同一 loopback HTTP 产物。
- **观察：** schema、props、Swiss HTML 与 goal-copy 均通过，但首轮 PowerPoint 渲染仍在物理页 15、18 发现越界。换 seed 和调整页面角色没有消除危险布局；确定性替换 `theme07_page057→page035`、`theme07_page026→page007` 后，32 页和 8 页 PPTX 均为 0 overflow。最终对照稿 577 文字 / 1,036 形状 / 97 图像；精选稿 118 文字 / 76 形状 / 6 图像。
- **复现：** 相同 briefs、主题、角色、seed、workflow id 与两条布局替换规则得到 SHA-256 完全一致的 `goal.json`。v4 专项验证器仍对 8 页主题装饰 bleed 报警；8 页均完成 hydration，浏览器无错误，PowerPoint QA 无正文裁切，故保留为启发式限制。
- **判断：** 用户的视觉判断成立：精选稿整洁但仍像通用研究模板。Dashi 的真正差异在内容契约、候选对照、可复现分配、分层导出和能暴露失败的审计链；固定 seed 提升复现性，不会自动提升审美。
- **证据：** `experiments/real-run-01/experiment-report.json`、两份 PPTX/PDF、PowerPoint render montages、`artifacts/frontend-evidence/real-run-browser-report.json`；站点桌面与 390px 验证均 HTTP 200、overflow 0、console errors 0。
- **下一步：** 只在有明确价值时扩展到第二主题、WPS/PowerPoint 对照和带媒体场景，不再用更多通用模板数量替代质量结论。

## 2026-08-31 · 从通用 PPT Demo 到 Dashi 内容编译实验台

- **目标：** 回应“当前看起来只是基础、通用的 PPT Skill，没有特色”的反馈，让用户不依赖长篇说明就能看见 Dashi 相对通用单次生成的独有机制。
- **环境：** canonical route `http://127.0.0.1:4175/projects/dashi-ppt-skill-study/showcase/`；零依赖 HTML/CSS/JavaScript；bundled Chromium / Playwright；1440×1000、768×1024、390×844。
- **基线：** 页面 HTTP 200、overflow 0、console errors 0，已有四场景 36 页，但首屏仍以“不是写 PPT 的模型”为主张，四个视觉方案只是编辑叙事、指标、左右分栏、海报等通用风格；DOM 中没有 `data-dashi-lab`，canonical content 仅作为文字出现。该基线支持用户反馈：应用覆盖充分，差异化机制不可见。
- **变更：** 首屏改为“内容只存一份 / 方案生成四套”，并对照通用 `Prompt→单一成品` 与 Dashi `内容契约→约束→3+1→DOM 导出`。新增 Dashi Compiler，可调整事实条目、数值字段和主媒体，观察五个示例版式的 PASS/REJECT 与拒绝原因；新增模板 A/B/C 与 Agent 定制 +1 的内容指纹一致性预览；四场景工作台增加 CONTENT MAP、LAYOUT QUERY、ALLOCATOR、EXPORT HINT 追踪条。
- **执行：** 默认研究摘要得到 3/5 通过、2/5 拒绝；四方案预览均保持 `CC-117D96E` 和 6/6 内容字段一致。把输入改为 8 条目、0 数值并要求媒体后，仅 `dense-grid` 通过，其他候选分别给出容量、数值或媒体原因。键盘实测预设 End/Home 与方案 ArrowRight/End/Home；方案路演第 4 页在 Agent 定制状态同步显示 7 个事实块、`process-07`、复用惩罚与复杂背景回退提示。
- **观察：** 首轮新版截图出现两个视觉问题：首屏旧措辞最后一个字形成孤行，机制锚点跳转后标题被 sticky header 压住；手机四阶段轨道的第 4 步需横向滚动才能发现。标题改为两行稳定结构，机制区增加 `scroll-margin-top`，手机轨道压缩为四列同屏后复验通过。最终三档 HTTP 200、overflow 0、console errors 0；明→暗→明和 reduced-motion 通过。最终能力测试首跑又因沙箱用户与上游 checkout 的 Windows SID 不同触发 Git `dubious ownership`，使用单次进程级 `safe.directory` 环境配置后 8/8 通过，没有修改全局 Git 配置。
- **证据：** `docs/frontend-design-contract.md` revision 4、`docs/frontend-coverage.md`、`tests/showcase-contract.test.mjs` 11/11、`artifacts/frontend-verification.md`、`desktop-dashi-compiler.png`、`desktop-mechanism-trace.png` 与 `mobile-dashi-compiler.png`。
- **判断：** 站点现在展示的核心不再是“能做四种通用 PPT”，而是 Dashi 如何冻结内容、按容量筛布局、生成 3+1 方案、控制全稿复用并解释分层导出。实验台计算仍是对锁定源码机制的缩小模拟，因此不会提升真实生成审美、PPTX 可编辑率或成本的证据等级。
- **下一步：** 在锁定上游中用同一 canonical content 真实生成 3+1 方案，比较四方案事实一致率、布局选择记录和 PPTX 原生对象比例，用实测替换当前机制模拟。

## 2026-08-30 · 四类实际任务与 36 页能力样例

- **目标：** 把原先偏“解释本库”的单一技术采用样例，扩展为受众能够直接代入的真实工作任务，展示相同生产模型如何处理不同叙事和信息结构。
- **环境：** canonical route `http://127.0.0.1:4175/projects/dashi-ppt-skill-study/showcase/`；零依赖 HTML/CSS/JavaScript；bundled Chromium / Playwright；1440×1000、801×900、768×1024、390×844。
- **基线：** 工作台只有一套 9 页技术采用 Deck，能够解释编辑参数，却不足以证明它如何分别组织证据、经营指标、学习行为和方案决策。
- **变更：** 增加研究咨询、季度经营复盘、企业培训、项目方案路演四个场景，每场景 9 页；补充场景受众、交付目标、重点能力、模拟数据边界、独立标题/目录/故事弧、场景默认视觉路线与键盘切换。无脚本目录同步扩展为 36 页。
- **执行：** 逐场景检查 9 个页面导航、9 个故事节点、页脚模拟数据标记与独立终页；验证手动编辑后切换场景会进入新场景默认状态，当前场景重置可恢复；实测场景 tab 的 ArrowRight、Home、End；四档视口均做明→暗→明、overflow、console 和手机 reduced-motion 检查。
- **观察：** 首次自动化脚本因使用过期选择器 `[data-slide]` 与 `[data-highlight-toggle]` 超时，改用页面契约中的 `[data-slide-index]` 与 `[data-highlight]` 后通过。首次目视检查发现 V3 旧分栏负边距会裁切培训测验标题；改为左侧固定深色论证带、右侧完整内容区后，标题和卡片均落在画布边界内。最终四档 HTTP 200、横向溢出 0、控制台错误 0。
- **证据：** `docs/frontend-design-contract.md` revision 3、`docs/frontend-coverage.md`、`tests/showcase-contract.test.mjs` 9/9、`artifacts/frontend-verification.md` 与 `desktop-scenarios.png`、`tablet-training.png`、`mobile-pitch.png` 等浏览器证据。
- **判断：** 站点现在能具体展示四种高频 PPT 任务的内容组织能力，而不只是抽象描述“能生成 PPT”。这些 Deck 仍是本站对 Dashi 工作模型的交互模拟，不能作为上游真实导出质量、客户效果或成本的证据。
- **下一步：** 用四类场景各选择一份脱敏材料，在锁定上游上执行真实 HTML/PDF/PPTX 生成，对照本站故事弧测量内容覆盖、返工量、原生可编辑对象比例和成本。

## 2026-08-30 · 证据、比较与采用决策闭环补全

- **目标：** 在已完成的研究展厅上继续补齐从源码事实到个人/组织采用判断的路径，并解决 390px 缺少可发现导航的问题。
- **环境：** 同一 canonical route；零依赖 HTML/CSS/JavaScript；bundled Chromium / Playwright；1440×1000、768×1024、390×844。
- **基线：** 页面 HTTP 200、overflow 0、console errors 0，但没有移动目录、独立证据账本或采用评估器，对“为什么相信”和“是否适合我”的回答仍分散在长页面中。
- **变更：** 新增 8 条源码证据账本及筛选、人工 PowerPoint/在线 AI PPT/低层 PPTX 库/Dashi 四方案比较、六维采用评估器、高中低三级建议、决策摘要复制反馈、最小试点协议和移动端研究目录。
- **执行：** 浏览器验证证据筛选为 6 条已核验；采用评估器 24/14/0 分分别进入建议试点/有条件试点/暂不建议，重置恢复六个默认值；复制路径成功；移动目录打开时背景 inert，Escape 关闭并返回焦点。三档视口均做明→暗→明、overflow、console 与 reduced-motion 检查。
- **观察：** 暗色主题首轮目视检查发现采用结果面板随通用 `--ink/--paper` token 反转为亮底，说明文字对比度不足；将决策面改为固定深色语义面后复验通过。390px 证据推理链首轮排列产生孤立箭头，改为单列纵向链后消除歧义。
- **证据：** `docs/frontend-design-contract.md` revision 2、`docs/frontend-coverage.md`、`tests/showcase-contract.test.mjs`、`artifacts/frontend-verification.md` 与新增四张浏览器截图。
- **判断：** 站点现在不仅回答“Dashi 是什么”，还提供“证据是否足够、与其他方案如何选择、我的条件是否值得试点”的可操作闭环。真实生成、导出保真和成本证据等级仍未改变。
- **下一步：** 当具备明确的宿主模型和成本授权时，执行真实 10 份材料基准，并用实测结果替换采用评估器中的定性假设。

## 2026-08-30 · 交互式研究展厅与跨视口验收

- **目标：** 用独立研究站点完整解释 Dashi 的能力、原理、交付效果、适用受众、场景和扩展方向，并用一个九页技术采用样例演示其“可编辑工作台”心智模型。
- **环境：** Windows；零依赖 HTML/CSS/JavaScript；本地 loopback HTTP；bundled Chromium / Playwright。
- **变更：** 新增 `showcase/` 静态专题页、九页 Deck 数据、能力和路线筛选、七步原理流程、三格式比较、七类受众、场景矩阵、扩展路线、结构契约测试与浏览器证据。
- **执行：** 在 1440×1000、768×1024、390×844 三档视口检查 HTTP、控制台错误、横向溢出、主题、筛选、tablist 键盘、九页导航、四种设计路线、密度、强调、标题编辑和重置；另模拟 reduced-motion。
- **观察：** 首轮 390px 浏览器检查出现 684px 横向溢出，原因是 Grid 子项的最小内容宽度撑大工作台；为工作台及子项加入 `min-width: 0` 和窄屏单列轨道后复验为 0px。最终三档视口均 HTTP 200、横向溢出 0、控制台错误 0。所有核心交互通过，reduced-motion 下信息完整。九页样例明确标记为本站交互模拟，不冒充上游真实导出结果。
- **证据：** `tests/showcase-contract.test.mjs`、`docs/frontend-coverage.md`、`artifacts/frontend-verification.md`、`artifacts/frontend-evidence/`。
- **判断：** 面向技术决策者的研究解释与交互展示已经完成，也覆盖管理、研究咨询、设计、Agent 开发、教育和合规受众。该成果回答“它是什么、如何工作、能产生什么、适合谁”，但不提升 H5/H6/H7 的上游真实生成证据等级。
- **下一步：** 使用锁定上游与固定材料真实生成 HTML/PDF/PPTX，测量可编辑对象比例、跨 Office 保真、时间和 Token 成本，并把结果回填到本站的“验证指标”页。

## 2026-08-30 · 固定上游与静态能力基线

- **目标：** 获取并固定 Dashi PPT Skill 上游源码，验证其版本、许可证边界、版式资产规模和主要工程链路，建立后续真实生成实验的可复现基线。
- **环境：** Windows；PowerShell；Git；Node.js；上游提交 `7cb23347f91cda1a5519eafc8c040704e389535a`。
- **变更：** 不修改上游源码；新增研究项目、固定提交获取脚本和能力契约测试。
- **执行：** 运行 `scripts/fetch-upstream.ps1`，再运行 `node --test tests/capability-contract.test.mjs` 和仓库结构验证。
- **观察：** 上游源码成功检出到锁定提交。首次能力契约测试 8 项中 7 项通过；失败项来自测试对许可证原文使用了不允许换行的正则，而原文在 `integrated` 与 `component` 之间换行。该失败不代表许可证内容缺失。修正为空白兼容匹配后复跑 8/8 通过。清单复算得到 12 个主题、1020 个版式和 8576 个控件；静态契约同时确认 schema v2 四方案模型、全稿多样性分配、浏览器编辑保存、DOM 驱动导出和默认监听边界。仓库级验证因无关的空目录 `projects/selector-study` 缺少入口文件而失败，本项目自身入口完整，未越权修改该目录。
- **证据：** `tests/capability-contract.test.mjs`、`artifacts/baseline-verification.md`、固定提交的本地 checkout。
- **判断：** H1、H2、H3 获得直接静态证据支持，H4 的算法结构获得源码支持；H5、H6、H7 涉及真实运行、导出和对照效果，仍证据不足。首次失败是研究测试误报，已保留并修正。
- **下一步：** 使用固定输入生成一份约 10 页研究汇报，测量内容覆盖、耗时、Token、视觉缺陷和 PPTX 可编辑对象比例。
