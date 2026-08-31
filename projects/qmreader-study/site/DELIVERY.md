# QMReader 研究网页设计契约

## Design contract

```text
Entry mode: Revision-led publication of an existing verified build
Request revision: 2
Target user and context: 需要快速判断 QMReader 是否值得采用或借鉴的中文技术研究者、内容创作者与小团队负责人
Desired first impression: 一眼看懂“它不是普通 RSS，而是一条把信息加工成资产的流水线”
Visual ambition: Editorial
Experience architecture: Editorial Flow
Visual constraints: 克制的研究编辑风格；暖白纸面、墨色正文、酸橙绿信号色；深浅双主题；不依赖插画或高成本视觉
Information constraints: 必须覆盖能力、实现原理、使用场景、扩展方向、对我们的意义，并明确证据边界；扩展场景须区分直接适用、轻量扩展和深度改造
Operation constraints: 用户可在至少三个代表性场景间切换；每个场景都可一键运行、暂停后继续、重置；导航、主题、场景和演示控件均可键盘访问；公开入口必须能返回研究页、交互展厅和锁定上游源码
State constraints: 三个场景模板各自覆盖 idle、running、paused、complete、reset；切换场景必须重置任务并同步改变标题、适用人群、队列、管线、文章、日志和资产类型
Environment constraints: 纯 HTML/CSS/JavaScript；由现有 GitHub Pages/Jekyll 工作流发布；不引入根级包管理器、后端、登录、真实 RSS 或真实模型调用
Primary journey: 扫描场景版图 → 选择代表性模板 → 运行五阶段演示 → 比较信息如何变成不同研究资产 → 阅读实现门槛与采用判断
User-defined phases: 扩展使用场景；多场景能力演示；采用与改造判断；R-005 GitHub 发布
Required artifacts: index.html、styles.css、app.js、server.mjs、多场景桌面截图、移动端截图、browser-evidence.md、项目 README、根研究索引、GitHub 研究目录与在线入口
Autonomy authorization: 用户明确要求继续整理、提交远端 GitHub 并用 GitHub Pages 发布，授权在 qmreader-study 和根研究索引内实施、提交和推送
User-decision boundary: 只有引入真实模型/API、改变研究结论或修改其他研究子项目才需要新授权
Observable completion criteria: 页面可运行；至少八个扩展场景按改造级别分类；AI 情报、论文雷达、产品信号三个模板均能完成五阶段演示；切换场景会安全重置；桌面/平板/390px 无遮挡；深浅主题可读；键盘焦点清晰；reduced-motion 不隐藏信息；R-005 在公开表面一致；外部 README 同时给出摘要、锁定源库、研究页和在线展厅；GitHub Pages 两个入口返回 200
```

## Revision 2 delta

| 层面 | 保留 | 本轮补全 | 验收标准 |
| --- | --- | --- | --- |
| 研究身份 | 已验证的能力结论、八场景与三套演示 | 稳定编号 `R-005` 与“第 5 个研究子项目”说明 | README、Jekyll 入口和展厅使用同一编号 |
| 公开索引 | 仓库内相对链接与本地运行方式 | 锁定上游源码、GitHub 研究目录、在线研究页、在线展厅 | 外部 README 与根研究索引可直接到达四类入口 |
| 网页表面 | 现有编辑式页面、主题、状态机和响应式行为 | 在品牌、副标题与页脚加入紧凑研究身份及公开返回路径 | 1440px 与 390px 不新增溢出，主演示仍可完成 |
| 发布 | 现有 `pages.yml` Jekyll 工作流 | 提交目标文件、推送 `main`、等待部署并检查在线内容 | Pages 工作流成功，研究页和展厅均返回 200 且包含 `R-005` |

## Revision 1 delta

| 层面 | 保留 | 本轮补全 | 验收标准 |
| --- | --- | --- | --- |
| 构图 | 现有编辑式长页与暗色演示工作台 | 在演示标题前加入紧凑场景切换器，在场景段落中扩展为分层版图 | 场景选择不压过主操作，不破坏原阅读顺序 |
| 信息 | 现有能力、原理、扩展与意义结论 | 八个场景，明确“直接适用 / 轻量扩展 / 深度改造”及缺口 | 每个场景说明输入、产出和新增能力边界 |
| 状态 | 现有五阶段 AI 技术情报演示 | 增加论文雷达、产品与竞品信号两套完整数据 | 三套模板均到达 100%、PUBLISHED、资产 1 |
| 控件 | 运行、暂停、继续、重置、主题 | 场景选择按钮组，切换时重置并更新可见上下文 | 鼠标和键盘均可切换，`aria-pressed` 唯一 |
| 响应式 | 1440 / 768 / 390 三档基线 | 重新验证选择器、场景卡与工作台 | 无页面级横向溢出，主操作可达 |

## Design direction

| 决策 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| 首屏层级 | 结论在左、实时加工样本在右 | 首屏只有一个主操作“运行完整演示” | 不滚动即可说明产品本质并启动演示 |
| 阅读路径 | 结论 → 演示 → 能力 → 原理 → 场景 → 扩展 → 意义 | 每一节回答一个决策问题 | 导航与标题顺序一致，无重复长文堆叠 |
| 字体角色 | 中文无衬线正文 + 等宽数据标签 | 数据、状态、提交 SHA 与正文有明显角色差异 | 中英文混排清晰，390px 不产生横向滚动 |
| 色彩语义 | 酸橙绿=完成/资产；琥珀=处理中；红=边界；蓝=原始信息 | 状态不只依赖颜色，始终配合文字和图标 | 深浅主题均能辨认状态和正文层级 |
| 材质与深度 | 纸张式底色、细线、少量实色面板 | 不使用大面积玻璃模糊或装饰性渐变 | 卡片边界明确但不压过内容主线 |
| 动效 | 仅用于解释管线状态变化 | reduced-motion 下改为即时切换 | 关闭动效后仍能完成演示和理解结果 |
| 响应式 | 桌面双栏、平板单栏、手机纵向流程 | 所有操作保留，不用横向滑动完成任务 | 1440、768、390px 均无裁切和遮挡 |

## Coverage manifest

| 用户阶段 | 要求或产物 | 表面 / 状态 | 证据 | Owning stage | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 内容整理 | 六类研究内容完整且边界准确 | 1440px / light / idle | `qmreader-site-desktop.png`、DOM section 高度检查 | Stage 2-3 | pass | 无 |
| 扩展场景 | 八个场景按采用门槛分类并说明输入、产出、缺口 | 1440px / light | `qmreader-site-scenarios.png` 与 8 卡 DOM 检查 | Stage 3 | pass | 无 |
| 多场景演示 | AI 技术情报模板保持完整闭环 | 1440px / light / idle→complete | `/assets/rewrite/b71a90d4` 完成态 | Stage 5-6 | pass | 无 |
| 多场景演示 | 论文雷达模板完成五阶段加工 | 1440px / light / idle→complete | `/assets/paper/7c2e91a0`、22/22 与键盘路径 | Stage 5-6 | pass | 无 |
| 多场景演示 | 产品与竞品信号模板完成五阶段加工 | 1440px / light / idle→complete | `qmreader-site-demo.png`、14/14 与边界文本 | Stage 5-6 | pass | 无 |
| 多场景演示 | 切换、暂停、继续、重置保持确定性 | 1440px / running→switch→idle；paused→complete→reset | 00% reset、暂停继续、焦点返回检查 | Stage 5-6 | pass | 无 |
| 研究判断 | 能力、边界和意义可快速比较 | 1440px / light / populated | `qmreader-site-desktop.png`、DOM 内容检查 | Stage 3 | pass | 无 |
| 跨表面 | 平板保持场景选择与演示闭环 | 768px / light / idle | 3×239px 选择器、2 列卡片与无溢出检查 | Stage 7 | pass | 无 |
| 跨表面 | 手机保持场景选择与演示闭环 | 390px / light / idle+complete | `qmreader-site-scenarios-mobile.png` 与论文完成态 | Stage 7 | pass | 无 |
| 主题 | 深色主题保持场景层级与状态语义 | 1440px / dark / selected+complete | 双向主题、纸面状态色与无溢出检查 | Stage 7 | pass | 无 |
| 键盘 | 场景选择、主题和演示路径可达 | desktop / keyboard | 论文按钮 Enter、唯一 aria-pressed、运行 Enter | Stage 7 | pass | 无 |
| 动效 | reduced-motion 下三场景结果不丢失 | 390px / reduced-motion | 论文完成态 PUBLISHED / 22/22 / 资产 1 | Stage 7-8 | pass | 无 |
| 能力回退 | 无脚本时核心研究结论仍可读 | desktop / JS unavailable | 静态 HTML、`noscript` 与契约测试 | Stage 8 | pass | 无 |
| 工程交付 | 更新测试、截图、验证记录和仓库检查 | local runtime | `browser-evidence.md` 与验证命令 | Stage 9 | pass | 无 |
| R-005 发布 | 研究编号、摘要、源库与在线索引在公开表面一致 | README / Jekyll 入口 / 展厅 | 发布契约 3/3；Chromium 1440×1000、390×844 与完成态复验 | Stage 3、7、9 | pass | 无 |
| R-005 发布 | GitHub 研究目录只包含本研究交付文件 | Git index / remote main | staged diff、commit 与远端 SHA | Stage 9 | continue | 仅暂存 QMReader 与根索引对应行 |
| R-005 发布 | 在线研究页与交互展厅可访问 | GitHub Pages | workflow 结果、HTTP 200 与在线内容检查 | Stage 9 | continue | 推送后等待 Pages 并复验 |

## Revision 2 refinement ledger

```text
Current stage: Stage 7 · Cross-surface adaptation
User phase: R-005 GitHub 发布
Coverage item: 稳定研究编号在桌面与手机公开表面可见
User goal: 最好有序号标识第几个研究子项目
Browser environment: Chromium / 1440×1000 + 390×844 / light / reduced-motion
Observed evidence: 桌面品牌副标题可见 R-005；手机断点隐藏整行副标题，首屏失去编号
Problem category: 响应式信息层级
Root cause: R-005 最初只位于 @media (max-width: 560px) 会隐藏的 .brand-copy small
Minimal intervention: 将 R-005 提升到 .brand-copy strong；副标题仅保留锁定上游短 SHA
Adjacent regression surfaces: 桌面表头、手机表头、主题按钮、导航换行、页面横向溢出、主演示完成态
Observed result: 两档首屏均可见 R-005；无横向溢出；产品信号演示到达 PUBLISHED / complete / 资产 1；console/page error 为 0
Decision: pass
Next executable action: 无；进入 Git 暂存与 GitHub Pages 发布检查
New authority required: 否
```

## Canonical runtime

```text
Start command: node projects/qmreader-study/site/server.mjs
Canonical URL: http://127.0.0.1:4217/
Target viewports: 1440×1000, 768×1024, 390×844
Supported themes: light, dark
Primary scenarios: ai-intel, paper-radar, product-signals
Primary states: idle, running, paused, complete, reset, scenario-switch-reset
```
