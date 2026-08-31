# Dashi PPT Skill 研究专题页 · Coverage manifest

状态词仅使用：`continue`、`pass`、`defer`、`blocked`。最终验收无未解决的 `continue` 项。

| 用户阶段 | 要求或产物 | Surface / state | Evidence | Status |
| --- | --- | --- | --- | --- |
| 第一：能力 | 首屏定位和四个核验指标 | 1440px，明暗主题 | `frontend-evidence/mobile-hero.png`、`desktop-dark-overview.png`、DOM 检查 | pass |
| 第一：能力 | 能力地图和分类筛选 | 全部/内容/视觉/交付/治理 | 浏览器筛选“交付”得到 4 项；`showcase-contract.test.mjs` | pass |
| 第二：原理 | 可点击生产流程及 Agent/引擎分工 | 7 个节点、输入/处理/输出 | 方向键从节点 0 到 1；面板 DOM 同步 | pass |
| 第三：效果 | HTML/PDF/PPTX 效果差异 | 3 个格式状态 | 浏览器切换 PPTX 后对应 panel 可见 | pass |
| 第四：完整样例 | 9 页研究汇报 deck 可浏览 | 首尾页、正文页、键盘导航 | 9 个页面按钮；`desktop-demo.png`；首尾导航实测 | pass |
| 第四：完整样例 | 4 方案和编辑参数可操作 | v1/v2/v3/v4、密度、强调、标题编辑、重置 | 浏览器验证 V4、标题、强调关闭和完整重置 | pass |
| 第四补充：场景 | 受众覆盖及价值/风险切换 | 7 类受众 | 7 个 tabs；教育/培训状态切换实测 | pass |
| 第四补充：场景 | 高适配、条件适配、低适配场景 | 默认完整状态 | 场景矩阵 DOM 与 `showcase-contract.test.mjs` | pass |
| 第四补充：扩展 | 按近期/中期/长期查看扩展路线 | 3 个周期状态 | 近期筛选显示 3 项 | pass |
| 第五：补充 | 许可证、隐私、成本、证据边界与采用清单 | 默认完整状态 | 页面补充卡与采用门槛 DOM | pass |
| 可信度 | 区分已核验、上游自述、交互模拟、待验证 | 全页面状态标签 | 四种标签文案契约测试；样例边界声明 | pass |
| 主题 | 明→暗、暗→明层级和控件均可读 | 两主题 | 切换状态、localStorage、ARIA；暗色截图 | pass |
| 视口 | 无横向溢出、遮挡或不可达控件 | 1440、768、390px | 三档 Chromium 检查均 overflow=0、HTTP 200、console errors=0 | pass |
| 键盘 | 流程、格式、deck、受众等适用项可达 | Tab、Enter、方向键 | tablist roving tabindex；流程和 deck 方向键实测 | pass |
| Motion | reduced-motion 不隐藏信息 | reduce 状态 | 390px context 中 media=true、scrollBehavior=auto、9 页仍存在 | pass |
| Fallback | JS 不可用时核心内容和样例目录仍可读 | 静态 DOM、noscript | 核心研究静态 DOM；noscript 含九页目录 | pass |
| 工程 | 零依赖静态页面、测试、canonical URL | 本地服务 | HTTP 200；无外部资源契约；运行说明 | pass |
| 交付 | 浏览器验收、最终证据与交接记录 | 最终状态 | `frontend-verification.md`、`frontend-handoff.md` | pass |
| 补全：证据 | 源码证据账本与状态筛选 | 已核验/上游自述/待验证，8 条 | 8 条 DOM；已核验筛选显示 6 条；`desktop-evidence.png` | pass |
| 补全：比较 | Dashi 与三类替代方案的决策比较 | 默认完整状态、390px 可读 | 4 个方案；三档最大右边界均在视口内；`tablet-comparison.png` | pass |
| 补全：采用 | 六维采用评估器与三级建议 | 24/14/0 分、重置 | 高/中/低建议实测；默认值完整恢复；`desktop-adoption.png` | pass |
| 补全：反馈 | 复制决策摘要及成功/失败反馈 | clipboard 可用与 fallback | 授权 clipboard 路径显示“决策摘要已复制”；实现 execCommand fallback | pass |
| 补全：导航 | 移动端导航抽屉 | 390px，打开/关闭/Escape/焦点返回 | `main.inert=true`、Escape 关闭、焦点返回；`mobile-menu.png` | pass |
| 补全：主题/视口 | 新增区域双主题与三档布局 | 1440、768、390px | 双向主题均成功；三档 overflow=0、console errors=0 | pass |
| 补全：Fallback | 新增证据、比较、采用清单在无 JS 时可读 | 静态 DOM、noscript | 三类内容均在静态 HTML；noscript 解释默认评估状态 | pass |
| 补全：交付 | 测试、验收、研究日志和交接更新 | 最终状态 | 专题页契约 8/8；浏览器记录与 handoff 已更新 | pass |
| 场景样例：研究咨询 | 证据型市场进入研究完整 Deck | 9 页、模拟访谈/竞品数据 | 场景首尾页和证据矩阵实测；`desktop-demo.png` | pass |
| 场景样例：经营复盘 | KPI、诊断、行动型季度复盘完整 Deck | 9 页、模拟经营数据 | 指标页显示 ARR/NRR/CAC/毛利率；`desktop-scenarios.png` | pass |
| 场景样例：企业培训 | 目标、课程、案例、测验型培训完整 Deck | 9 页、模拟培训数据 | 情境测验页与分栏版式复验；`tablet-training.png` | pass |
| 场景样例：方案路演 | 问题、架构、价值、实施型项目方案完整 Deck | 9 页、模拟目标数据 | 七层架构页与九页路线实测；`mobile-pitch.png` | pass |
| 场景状态 | 受众/目标/能力标签/目录/标题/故事弧同步 | 4 个 tab、切换、重置 | 四场景均为 9 个导航和 9 个故事节点；切换与重置 DOM 通过 | pass |
| 场景键盘 | 场景 tab 与原有页面/方案控件可连续操作 | 方向键、Home、End、Tab | ArrowRight→经营复盘、End→方案路演、Home→研究咨询 | pass |
| 场景主题/视口 | 新工作台在双主题和三档视口完整可达 | 1440、801、768、390px | 四档 HTTP 200、overflow=0、console errors=0；明暗往返通过 | pass |
| 场景 Fallback | 无 JS 时可读四场景名称、用途和 36 页目录概述 | 静态 DOM、noscript | 4 个场景标题、36 个目录项与模拟数据声明通过契约测试 | pass |
| 场景交付 | 测试、验收、日志、handoff 和截图更新 | 最终状态 | 专题页契约 9/9；浏览器记录、交接和四张场景证据已更新 | pass |
| 差异化首屏 | 直接说明 Dashi 与通用 AI PPT 的机制差异 | 1440、768、390px；明暗主题 | `desktop-dark-overview.png`、`mobile-hero.png`；首屏包含两条链路对照 | pass |
| Dashi 实验：内容约束 | 条目、数值、媒体输入驱动版式容量筛选 | 默认、预设、超载状态 | 默认 3/5 通过；8 条目+0 数值+媒体后仅 dense-grid 通过 | pass |
| Dashi 实验：3+1 | 三个模板候选与一个 Agent 定制共享内容指纹 | 四个方案、键盘切换 | 四方案均保持 `CC-117D96E` 与 6/6 内容字段；`desktop-dashi-compiler.png` | pass |
| Dashi 实验：导出映射 | 原生对象与截图回退边界可见 | 默认方案与 bespoke 方案 | 模板提示原生映射；bespoke 提示复杂背景可能回退 | pass |
| 样例机制追踪 | 四场景 36 页显示内容映射、布局、复用和导出提示 | 方案路演第 4 页、Agent 定制 | PIPELINE 7 块、process-07、复用惩罚、截图回退同步；`desktop-mechanism-trace.png` | pass |
| 差异化主题/视口 | 新机制实验台在双主题和三档视口完整可达 | 1440、768、390px | 三档 HTTP 200、overflow=0、console errors=0；明暗往返通过 | pass |
| 差异化键盘/Fallback | 实验台与 3+1 方案键盘可用，无 JS 时机制说明仍可读 | 箭头、Home、End、noscript | 预设 End/Home 与方案 ArrowRight/End/Home 实测；静态机制说明存在 | pass |
| 差异化交付 | 测试、验收、研究日志、handoff、截图与根索引更新 | 最终状态 | 专题页契约 11/11；能力契约、仓库验证与最终截图已更新 | pass |
| 真实实验：固定输入 | 锁定提交、theme07、固定 seed、原创 6+ 页研究材料 | goal、run manifest、重复运行 | `experiment-report.json`：goal/replay SHA-256 完全一致 | pass |
| 真实实验：3+1 | 每个逻辑页 3 template + 1 bespoke 均真实渲染 | HTML、逐方案截图 | 8 逻辑页、32 物理页；真实 PPTX render 逐页可查 | pass |
| 真实实验：内容一致性 | required facts、关键数字和标题语义不随模板方案漂移 | 四方案自动审计 | 26 required facts；contentMap canonical roots 通过 | pass |
| 真实实验：导出 | 输出 PPTX/PDF 并检查页数、可编辑文字与回退边界 | 本机导出、对象检查 | 32/8 页 PPTX+PDF；对象统计；两份 PPTX 0 overflow | pass |
| 真实实验：网页呈现 | 真实逻辑页/方案切换、证据状态、下载入口 | 默认、末页、v1-v4、下载链接 | `verify-showcase.mjs` 交互通过，页面与 PPTX HTTP 200 | pass |
| 真实实验：跨表面 | 新实验区在双主题和三档视口完整可用 | 1440、768、390px、键盘、reduced-motion | 1440 与 390 实测 overflow 0 / console 0；既有 768 契约保持 | pass |
| 真实实验：交付 | 测试、日志、README、根索引、验收和 handoff 更新 | 最终状态 | 12/12 站点测试；研究日志、README、根索引已更新 | pass |
| 第二轮场景 | 园区能源协同试点形成完整 8 页决策故事 | Dashi v4、直接编程基线 | 两份 8 页 PPTX、逐页 PowerPoint render、模拟数据声明 | pass |
| 第二轮媒体/图表 | 生成媒体和图表进入真实产物并保留来源/编辑性边界 | 图片页、负荷结构页 | 图片 SHA-256；Dashi SVG fallback；基线 1 个 native chart | pass |
| 第二轮品牌 | 请求 palette、theme03 token 与基线 token 并列比较 | 默认路线、路线切换 | 页面品牌契约；报告记录 approximate / exact | pass |
| 第二轮效率 | 只显示实际测得的生成、渲染、导出和基线构建时间 | 指标与机器报告 | `real-run-02-brand-media/experiment-report.json` 数字一致 | pass |
| 第二轮对比器 | Dashi/基线双路线与 8 页切换同步预览和证据 | 鼠标、键盘、1440/768/390 | 三档键盘切到 direct / slide 4；overflow 0、console 0 | pass |
| 第二轮下载 | Dashi v4 PPTX/PDF、32 页稿、基线 PPTX、报告可打开 | 静态服务器与相对路径 | 三档视口 5 个链接 HEAD 均为 200；契约测试 | pass |
| 第二轮交付 | README、日志、根索引、浏览器验收和 handoff 更新 | 最终状态 | README、日志、验收、handoff 与 14/14 契约测试 | pass |
| R-003 公开编号 | 根 README、项目 README、项目页、Web 统一显示第 3 个研究子项目 | 默认状态 | 三类文档与 Web DOM 均含 `R-003`；契约测试 | pass |
| 外部 README 摘要 | 结论摘要、源库/commit、研究页、在线 Web 索引完整 | GitHub 根入口与项目入口 | 根索引与项目首屏文案/链接契约通过 | pass |
| 多示例目录 | 2 个真实实验 + 4 个模拟场景可扫描、可跳转 | 1440、768、390px | 6 卡、2 实测、4 模拟；培训卡切换到 training | pass |
| 第二轮公开归档 | README/日志/实验矩阵纳入品牌媒体与直接编程基线结果 | 文档与机器报告 | 对象、品牌、耗时、QA 数字与报告一致 | pass |
| 发布文件范围 | 排除 upstream/缓存/重复中间文件，保留网页依赖产物 | Git staging candidate | 356 个候选文件 / 65,405,831 bytes；最大公开文件 22,170,805 bytes；上游 checkout、缓存和重复中间 HTML 均未进入候选 | pass |
| 发布候选浏览器 | 修复 1440px overflow，并复验主题/键盘/reduced-motion | 1440、768、390px | 三档 HTTP 200、overflow 0、console 0；主题往返与 mobile reduce 通过 | pass |
| GitHub 远端提交 | 意图明确的 R-003 文件提交并推送 `origin/main` | main branch | 首次公开提交 `e916b29f45d0de738205d5195d96a3448a05db13` 已推送 `origin/main`；未纳入并行的 R-006 工作区变更 | pass |
| GitHub Pages 上线 | Actions 成功，研究索引/Web/下载公开可达 | canonical online URL | Repository checks `33371746745`、Deploy research site `33371746832` 通过；在线三视口与 5 个下载链接均 HTTP 200 | pass |
