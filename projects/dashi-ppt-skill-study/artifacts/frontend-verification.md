# Dashi PPT Skill 研究展厅 · 浏览器验收

## 验收对象

- 路由：`http://127.0.0.1:4175/projects/dashi-ppt-skill-study/showcase/`
- 浏览器：bundled Chromium / Playwright
- 页面：`showcase/index.html`、`showcase/styles.css`、`showcase/app.js`
- 日期：2026-08-30

## 2026-08-31 · REAL RUN 01 复验

- 新增真实运行审计台：8 个逻辑页、32 个 3+1 PowerPoint 渲染、逐候选对象统计、5 步失败修正轨迹和 5 个产物/报告入口。
- `scripts/verify-showcase.mjs` 在 1440×1000 与 390×844 切换到逻辑页 2 / v2，均得到 `slide-6.png`、HTTP 200、横向溢出 0、console/page errors 0。
- 精选 PPTX 下载入口 HTTP 200；站点契约测试 12/12；真实 8 页 PPTX 经 `slides_test.py` 检查为 0 overflow。
- 视觉抽查确认桌面审计台三栏关系清楚，390px 按“页签 → 画布 → 方案 → 审计”单列展开；真实候选本身保留其通用模板观感，不做站点二次美化。
- 证据：`frontend-evidence/desktop-real-run.png`、`mobile-real-run.png`、`real-run-browser-report.json`。

## 结构与内容

- HTTP 状态 `200`，页面标题与主标题正确。
- 主内容含 7 个一级 section；能力、原理、效果、完整样例、受众、场景、扩展与风险均可见。
- 完整样例包含 9 页；受众包含 7 类；扩展路线包含近期、中期和长期。
- “已核验 / 上游自述 / 交互模拟 / 待验证”在静态或交互内容中都有明确标签。

## 响应式矩阵

| 视口 | HTTP | 横向溢出 | 页面错误 | 结果 |
| --- | ---: | ---: | ---: | --- |
| 1440 × 1000 | 200 | 0 px | 0 | 通过 |
| 768 × 1024 | 200 | 0 px | 0 | 通过 |
| 390 × 844 | 200 | 0 px | 0 | 通过 |

首轮 390px 检查发现样例工作台横向溢出 684px，原因是 Grid 子项的最小内容宽度参与轨道计算。给工作台及其子项补充 `min-width: 0` 和窄屏单列约束后复验为 0px。该失败与修复保留在本记录中。

## 交互验收

| 交互 | 结果 |
| --- | --- |
| 能力筛选“交付” | 4 张相关能力卡可见 |
| 原理流程方向键 | 从步骤 0 移到步骤 1，`aria-selected` 同步 |
| 输出格式切换 | PPTX panel 可见，其余 panel 隐藏 |
| Deck 页面导航 | 可到第 9 页，状态为“第 9 页 · 决策与下一步” |
| 四方案切换 | V4 后 canvas 为 `variant-bespoke` |
| 标题编辑 | 页脚同步显示“组织级演示生产试点” |
| 决策强调 | 可关闭，状态和样式同步 |
| 样例重置 | 回到第 1 页、V1、平衡密度、默认标题和强调开启 |
| 受众切换 | 可切换到“教育 / 培训”并更新四项说明 |
| 扩展筛选“近期” | 3 个方向可见 |
| 主题切换 | DOM、`aria-pressed` 和 localStorage 同步为 dark |

## Motion 与键盘

- 390 × 844 的 reduced-motion context 中，`prefers-reduced-motion: reduce` 为 true，计算后的 `scroll-behavior` 为 `auto`，核心内容和 9 页样例仍存在。
- 流程、格式、Deck 和受众 tablist 使用 roving `tabindex`，支持方向键、Home、End；按钮和表单控件保留 `:focus-visible`。
- 开关的透明 input 覆盖视觉轨道，支持鼠标、触控与键盘直接操作。

## 视觉证据

- [桌面样例](frontend-evidence/desktop-demo.png)
- [桌面暗色首屏](frontend-evidence/desktop-dark-overview.png)
- [平板能力段落](frontend-evidence/tablet-capabilities.png)
- [手机首屏](frontend-evidence/mobile-hero.png)

## 边界

原有四场景工作台仍是本站模拟；`REAL RUN 01` 已升级为锁定上游的真实 HTML/PDF/PPTX 证据。Token 成本、跨主题与跨 Office 兼容性仍属于后续实验。

## 2026-08-30 · 补全版复验

本轮在原有旅程上增加“源码证据 → 替代方案 → 采用评估 → 决策摘要”闭环和移动端目录。

### 新增内容

- 8 条证据账本：6 条已核验、1 条上游自述、1 条待验证；每条同时说明支持的结论与不能证明的内容。
- 4 类方案比较：人工 PowerPoint、在线 AI PPT、低层 PPTX 库、Dashi PPT Skill。
- 6 维采用评估器：24 分为“建议进入受控试点”，0 分为“暂不建议进入生产”，默认 14 分为“建议有条件试点”。
- 复制决策摘要：浏览器授权路径返回“决策摘要已复制”，同时保留 `execCommand` fallback 和失败反馈。
- 移动目录：打开后 `main.inert=true`，Escape 可关闭，关闭后焦点回到触发按钮。

### 最终浏览器矩阵

| 视口 | 明→暗→明 | 横向溢出 | 新增区域 | reduced-motion | 控制台错误 |
| --- | --- | ---: | --- | --- | ---: |
| 1440 × 1000 | 通过 | 0 px | 8 条证据、4 个比较、6 个维度 | false / smooth | 0 |
| 768 × 1024 | 通过 | 0 px | 同上，双列比较与移动目录 | false / smooth | 0 |
| 390 × 844 | 通过 | 0 px | 同上，单列比较与抽屉目录 | true / auto | 0 |

新增视觉证据：

- [桌面证据账本](frontend-evidence/desktop-evidence.png)
- [桌面采用评估](frontend-evidence/desktop-adoption.png)
- [平板方案比较](frontend-evidence/tablet-comparison.png)
- [手机目录](frontend-evidence/mobile-menu.png)

### 修正记录

暗色主题首轮检查发现采用结果面板随语义 token 反转成亮底，说明文字对比度不足。结果面板与 Dashi 比较卡改为固定深色决策面后，计算颜色为背景 `rgb(21, 23, 27)`、正文 `rgb(242, 240, 233)`、说明 `rgb(182, 187, 196)`，复验通过。

## 2026-08-30 · 实际使用场景样例复验

本轮把单一“技术采用评估”样例扩展为四套独立的实际任务 Deck，共 36 页。它们共享可编辑工作台，但受众、交付目标、能力标签、标题、目录、故事弧、内容组件和默认视觉参数均独立。

| 场景 | 受众与目标 | 9 页叙事 | 关键演示页 |
| --- | --- | --- | --- |
| 研究咨询 | CTO、战略与产品负责人；形成市场进入建议 | 决策问题→结论→范围→市场→证据→路径→场景→验证→门槛 | 28 次模拟访谈与 12 个竞品的证据矩阵 |
| 季度经营复盘 | CEO、业务负责人、产品与财务；把经营数据转为行动 | 目标→摘要→指标→漏斗→诊断→比较→行动→路线→责任 | 模拟 ARR ¥18.6M、NRR 108%、CAC 回收期 8.4 月、毛利率 73% |
| 企业培训 | 业务员工、主管与合规团队；从知识传达走向行为判断 | 任务→成果→课程→流程→案例→测验→岗位→推广→承诺 | 三个真实工作情境式测验 |
| 项目方案路演 | 园区负责人、工厂与 IT/OT 团队；获得 12 周试点决策 | 问题→价值→范围→架构→边界→收益→场景→实施→决策 | 从传感设备到行动工单的七层架构 |

所有业务数字明确标记为“模拟数据”，页面也声明其不是真实客户案例或上游导出成品。

### 场景交互

- 四个场景切换后均得到 9 个页面导航、9 个故事节点和独立页脚；状态文本同时显示场景、页码和页面职责。
- 从手动修改的研究咨询状态切换到经营复盘后，标题、设计路线、密度、页码和强调开关恢复经营场景默认值。
- “恢复样例默认值”只恢复当前场景；经营复盘从第 8 页和被改标题返回第 1 页与默认标题。
- 场景 tab 支持 ArrowRight、Home、End，实测顺序为研究咨询→经营复盘、End→方案路演、Home→研究咨询。
- 主题切换在四档视口均完成明→暗→明往返；手机 reduced-motion 环境仍保留全部 9 页和场景状态。

### 场景响应式矩阵

| 视口 | HTTP | 场景状态 | 横向溢出 | 主题往返 | 控制台错误 |
| --- | ---: | --- | ---: | --- | ---: |
| 1440 × 1000 | 200 | 方案路演 / 第 4 页 | 0 px | 通过 | 0 |
| 801 × 900 | 200 | 方案路演 / 第 4 页 | 0 px | 通过 | 0 |
| 768 × 1024 | 200 | 方案路演 / 第 4 页 | 0 px | 通过 | 0 |
| 390 × 844 | 200 | 方案路演 / 第 4 页 | 0 px | 通过 | 0 |

手机端场景 tab 使用容器内横向滚动，实测容器宽 361px、内容宽 880px，但文档级横向溢出仍为 0px；页面导航、画布和控制台保持可达。

### 本轮失败与修正

首次自动化脚本使用了不存在的 `[data-slide]` 与 `[data-highlight-toggle]` 测试选择器，导致测试会话等待超时；改为实际契约 `[data-slide-index]` 与 `[data-highlight]` 后，完整路径通过。该问题属于测试脚本，不是页面缺陷。

首次视觉检查发现旧的 V3 分栏样式通过负边距把培训测验标题挤入左侧暗区，正文首部被裁切。分栏结构改为固定深色论证带和右侧完整内容区后，标题边界位于画布内 `511.6–1036.8px`，画布边界为 `253.2–1086.8px`，复验无裁切。

新增或更新的视觉证据：

- [研究咨询证据矩阵](frontend-evidence/desktop-demo.png)
- [四场景与经营指标页](frontend-evidence/desktop-scenarios.png)
- [平板培训情境测验](frontend-evidence/tablet-training.png)
- [手机方案架构页](frontend-evidence/mobile-pitch.png)

## 2026-08-31 · Dashi 差异化机制复验

### 用户反馈与基线

用户指出页面“看起来就是一个基础的生成 PPT 的 Skill，并且也是通用 PPT，没有特色”。修改前浏览器基线为 HTTP 200、overflow 0、console errors 0，但首屏主张仍是“它不是一个写 PPT 的模型”，四个方案标签是“编辑叙事 / 指标仪表 / 左右论证 / 定制海报”，页面只有静态文字提到 canonical content，没有可操作的 Dashi 机制表面。这支持用户判断：场景覆盖充分，但产品差异不可见。

### 本轮可观察变化

- 首屏改为“内容只存一份，方案生成四套”，并直接比较 `Prompt → 单一成品` 与 `内容契约 → 约束 → 3+1 → DOM 导出`。
- 新增 Dashi Compiler：研究摘要、经营指标、图文方案三个输入预设，以及事实条目、数值字段、主媒体三个可编辑条件。
- 五个候选版式同时显示 PASS / REJECT、模拟分数和具体拒绝原因；默认研究摘要有 3/5 个候选通过。
- 四个方案改为模板候选 A/B/C 和 Agent 定制 +1；方案结构变化时内容指纹与内容字段数量保持一致。
- 四场景样例新增 CONTENT MAP、LAYOUT QUERY、ALLOCATOR、EXPORT HINT 追踪条，四个视觉按钮同步采用 3+1 语义。
- 所有计算均标记为“机制模拟”；schema v2、layout-query、layout-allocation 和 DOM 导出属于源码已核验机制，真实审美与导出质量仍保持待验证边界。

### 交互证据

| 路径 | 观察结果 |
| --- | --- |
| 默认研究摘要 | 3 个候选通过、2 个拒绝；内容指纹 `CC-117D96E`；6/6 内容字段一致 |
| 切换模板 A/B/C 与 bespoke | 四种预览 class 明显不同；指纹始终为 `CC-117D96E` |
| bespoke 导出提示 | “复杂背景可能回退；文本仍优先原生映射” |
| 输入改为 8 条目、0 数值、需要媒体 | 仅 `dense-grid` 通过；其余分别显示容量、数值或媒体限制 |
| 方案路演第 4 页 + Agent 定制 | `PIPELINE · 7 个事实块`、`process-07`、第 4/9 页、复用惩罚和复杂背景回退同步 |
| 输入预设键盘 | End→图文方案，Home→研究摘要 |
| 3+1 键盘 | ArrowRight→模板 B，End→bespoke，Home→模板 A |

### 响应式与主题矩阵

| 视口 | HTTP | 文档横向溢出 | 候选 / 方案 | 主题 | reduced-motion | 控制台错误 |
| --- | ---: | ---: | --- | --- | --- | ---: |
| 1440 × 1000 | 200 | 0 px | 5 / 4 | 明→暗→明通过 | false | 0 |
| 768 × 1024 | 200 | 0 px | 5 / 4 | 继承双主题边界 | false | 0 |
| 390 × 844 | 200 | 0 px | 5 / 4 | 继承双主题边界 | true | 0 |

首轮新版截图发现首屏“编译成 3+1 套演示”的最后一个字形成孤行，机制区锚点也会被 sticky header 压住。标题改为两行稳定结构“内容只存一份 / 方案生成四套”，机制区增加 76px `scroll-margin-top`；手机四阶段轨道由横向隐藏改为四列同屏。复验后未再观察到裁切或不可达状态。

工程检查中，能力契约首跑因当前沙箱用户与上游 checkout 所有者 SID 不同触发 Git `dubious ownership`，结果为 7/8；使用仅对该测试进程生效的 `GIT_CONFIG_COUNT / safe.directory` 后复跑 8/8，通过过程中没有写入用户全局 Git 配置。专题页契约为 11/11，仓库结构验证通过。

最终视觉证据：

- [差异化暗色首屏](frontend-evidence/desktop-dark-overview.png)
- [Dashi 内容编译实验台](frontend-evidence/desktop-dashi-compiler.png)
- [完整样例机制追踪](frontend-evidence/desktop-mechanism-trace.png)
- [手机机制实验台](frontend-evidence/mobile-dashi-compiler.png)

## 2026-08-31 · R-003 GitHub Pages 发布候选复验

### 公开信息与案例覆盖

- 根 README、项目 README、Jekyll 研究页和 Web header 统一标识为 `R-003 / 第 3 个研究子项目`。
- 根研究索引同时给出固定上游源库、研究页和 canonical 在线 Web；项目 README 首屏补充执行摘要和两轮真实实验边界。
- Web 新增 6 个案例入口：REAL RUN 01、REAL RUN 02，以及研究咨询、季度经营复盘、企业培训、项目方案路演。
- 四个模拟案例卡点击后会打开相应场景工作台；浏览器实测培训卡将活动场景切换为 `training`。

### 第二轮公开证据

第二轮报告、两条路线逐页 PowerPoint render、Dashi v4 PPTX/PDF、32 页候选稿和直接编程基线 PPTX 已接入页面。浏览器通过键盘从 Dashi 路线切换到 direct，再选择第 4 页，预览同步为 `direct-programmatic-baseline/slide-4.png`。5 个公开下载/报告链接在本地静态服务器均返回 HTTP 200。

### 发布候选矩阵

| 视口 | HTTP | 六案例 | 案例→场景 | 第二轮键盘路线 | 横向溢出 | 主题 | reduced-motion | 控制台错误 |
| --- | ---: | ---: | --- | --- | ---: | --- | --- | ---: |
| 1440 × 1000 | 200 | 6 | training | direct / slide 4 | 0 px | 明→暗→明 | false | 0 |
| 768 × 1024 | 200 | 6 | training | direct / slide 4 | 0 px | 明→暗→明 | false | 0 |
| 390 × 844 | 200 | 6 | training | direct / slide 4 | 0 px | 明→暗→明 | true | 0 |

发布前第一次 1440px 基线检查发现文档横向溢出 75px。根因是品牌契约外层把三条完整横向 `brand-row` 分别压入三个约 299px 的列，而每条内部最小内容宽度约 474px。桌面结构改为“左侧标题 + 右侧三行”的两列布局后，文档溢出归零；800px 以下仍沿用单列布局。

新增证据：

- [桌面 R-003 案例索引](frontend-evidence/desktop-r003-release.png)
- [平板 R-003 案例索引](frontend-evidence/tablet-r003-release.png)
- [手机 R-003 案例索引](frontend-evidence/mobile-r003-release.png)
- [机器可读浏览器报告](frontend-evidence/real-run-browser-report.json)

### GitHub Pages 线上复验

- 首次公开提交：`e916b29f45d0de738205d5195d96a3448a05db13`，已推送至 `origin/main`。
- Repository checks：run `33371746745`，通过。
- Deploy research site：run `33371746832`，Jekyll build 与 Pages deploy 均通过。
- 线上根索引、R-003 研究页、GitHub 源码索引均为 HTTP 200。
- 对 canonical 在线 Web 重新运行同一浏览器矩阵；三档视口均为 HTTP 200、六案例、`training` 场景、direct / slide 4、0 overflow、0 console error，390px 的 reduced-motion 为 true。
- Dashi v4 PPTX/PDF、32 页候选稿、直接编程基线 PPTX、第二轮机器报告共 5 个线上链接在三档浏览器上下文中均为 HTTP 200。

机器可读报告中的 URL 已更新为 canonical GitHub Pages 地址，本地结果没有被当作线上发布证据。
