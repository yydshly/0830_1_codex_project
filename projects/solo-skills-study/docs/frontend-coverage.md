# Solo Skills 研究展厅 · Coverage manifest

状态词仅使用：`continue`、`pass`、`defer`、`blocked`。

| 用户阶段 | 要求或产物 | Surface / state | Evidence needed | Owning stage | Status | Evidence / decision |
| --- | --- | --- | --- | --- | --- | --- |
| 能力 | 首屏说明定位、规模、价值和边界 | 1440px，明暗主题 | 截图、DOM 文本 | Stage 2 | pass | `showcase-desktop.png`；H1、26/49/9/MIT 与“不是框架”结论可见 |
| 能力 | 展示全部 26 个技能并按类型筛选 | 默认、知识、脚本、耦合 | DOM 数量、鼠标与键盘交互 | Stage 3/5 | pass | 静态测试确认 26 项；浏览器“脚本增强”显示 9 项并更新计数 |
| 能力总览 | 用普通业务结果汇总整个库 | 8 个能力域、数量合计 26 | DOM 文本、数量与桌面/平板/手机布局 | Stage 3/7 | pass | 静态与 Chromium 确认 8 类按 4/3/5/5/4/2/2/1 分布并合计 26；三视口计算为 4/2/1 栏 |
| 一句话能力 | 26 个 Skill 各自说明“能完成什么” | 全部、三类筛选、代表项 | DOM 数量、文本契约、筛选后可读性 | Stage 3/5/7 | pass | 26 条结果导向描述通过长度契约；视频、会议、简报、Notion 归档和多 Agent 编排代表句经 DOM 验证；脚本筛选仍为 9 |
| 实现原理 | 发现到审批的五步流程可操作 | 五个节点、选中态 | 交互记录、证据链接 | Stage 4/5 | pass | 浏览器按 End 从首节点切至“经过护栏”，对应面板可见 |
| 使用场景 | 三类受众可切换并有采用判断 | 默认与选中状态 | DOM、交互记录 | Stage 5 | pass | ArrowRight 从“个人经营者”切至“研究团队”并同步内容 |
| 真实旗舰案例 | 本项目真实证据到研究交付包 | 案例选择、五阶段、完整运行、重置 | DOM、交互、真实文件与测试证据 | Stage 3/5/6 | pass | `LIVE PROJECT` 案例显示 README、research-log、固定 SHA、26/9、4/4、URL 与有边界采用结论；完整运行到 5/5 READY |
| 多案例演示 | 七案例目录覆盖研究、会议、工作坊、视频、发布、情报与清理 | 七案例默认、切换、五阶段结果 | DOM 数量、鼠标和键盘切换、逐步与完整运行 | Stage 4/5/6 | pass | 静态测试确认 7×6 状态；Chromium 逐项观察 READY/HOLD/SETUP/DRY RUN/REVIEW，切换案例会取消旧运行并回到 0/5 |
| 数据边界 | 区分真实项目证据、脱敏 fixture、建议增强 | 每个案例来源标签与最终门禁 | DOM 文本、视觉观察 | Stage 3/6 | pass | `LIVE PROJECT`、`LIVE TARGET + DRY RUN`、`SANITIZED FIXTURE`、`PROPOSED GUARDRAIL` 标签和边界说明可见 |
| 目标场景调用 | 七案例说明“如何使用该库” | 业务目标、调用示例、材料、Skill 贡献、环境贡献、效果 | DOM 数量、内容契约、场景切换 | Stage 3/5/6 | pass | 静态测试确认七条自然语言请求和每例 4×4 职责事实；聚焦截图显示目标、请求、四方职责和边界 |
| 使用说明同步 | 场景切换同时更新调用指南与演示 | research → meeting → cleanup，重置状态 | 真实浏览器交互、ARIA 与 DOM 观察 | Stage 4/5/6 | pass | Chromium 验证 research → cleanup prompt 含阈值 10、Home 返回 research；切 meeting 后 prompt 含 `product-sync.txt` 且回到 0/5 |
| 真实视频生成 | 直接使用当前网页完成 `web-demo-video` 真实场景 | 960×540 舞台、640 帧、1920×1080 MP4 | 舞台文件、渲染脚本、MP4、ffprobe、接触表 | Stage 5/6/8/9 | pass | 同源 `video-stage.html` 与渲染脚本已交付；640 帧编码为 32.00 秒 H.264/yuv420p 无声 MP4，ffprobe、六格接触表与临时帧清理通过 |
| 视频案例升级 | 网页内直接播放实际产物并显示媒体验证 | video 案例默认/运行/完成，其他案例隐藏 | 浏览器播放元素、DOM、媒体元数据、跨视口截图 | Stage 3/5/6/7 | pass | video 终态升级为 READY；Chromium 读取 duration=32、1920×1080，其他案例隐藏媒体卡；桌面双栏、768/390px 单栏且无溢出 |
| 可扩展方向 | 优先级、目标、实施入口与收益 | 默认完整状态 | DOM、截图 | Stage 3 | pass | 6 张扩展卡，P0/P1/P2 与实施入口通过静态检查 |
| 对我们的意义 | 连接研究证据链与 Skill 生命周期 | 桌面与移动 | DOM、截图 | Stage 3/7 | pass | 六步研究链和三档采用建议在桌面、平板、手机可读 |
| 可信度 | 区分上游事实、研究判断、模拟演示 | 全页面标签 | DOM、视觉观察 | Stage 3 | pass | `上游事实`、`本地证据`、`研究判断`、`模拟演示`统一标识 |
| 主题 | 能力总览、一句话能力与既有页面在明→暗、暗→明时保持层级和可读性 | 两主题 | 双向切换、截图/观察 | Stage 7 | pass | Chromium 完成 light → dark → light；平板深色完整截图中总览卡、描述、筛选与焦点保持层级 |
| 视口 | 能力总览、Skill 清单、调用卡、案例目录和媒体无横向溢出或遮挡 | 1440、768、390px | 三档新截图、尺寸检查 | Stage 7 | pass | 三档截图更新，能力总览 4/2/1 栏，描述正常换行，横向溢出 false，手机最小按钮边 ≥32px |
| 键盘 | 新案例目录、阶段、运行、重置和主题可达 | Tab、Enter、方向键、Home/End | 键盘路径和焦点观察 | Stage 7 | pass | 案例 End 选择 cleanup、Home 返回 research；阶段 End 选择 5/5 门禁；真实 Tab 焦点轮廓可见 |
| Motion | 新案例进度与切换在 reduced-motion 下不隐藏信息 | reduced motion | 浏览器模拟、计算样式 | Stage 7/8 | pass | Chromium reduced-motion 媒体查询命中；进度过渡 ≤0.00001s，五阶段结果仍可见 |
| Fallback | JS 不可用时核心内容仍可读 | no-JS | 静态 DOM、CSS | Stage 8 | pass | `noscript` 边界存在；隐藏面板在无 JS CSS 下展开 |
| 工程 | 能力索引仍为零依赖静态页面且不调用真实 API | 本地服务 | 文件、更新后的自动测试、HTTP 结果 | Stage 9 | pass | 静态与浏览器契约确认 8 类、26 句话、26 项、9/9/8 筛选、外部 API 0；HTTP 页面 200 |
| R-007 编号 | 根索引、项目入口与展厅统一标识第 7 个研究子项目 | README、index、Web 首屏/页脚 | 文件、DOM、线上页面 | Stage 3/9 | continue | 更新四处编号并加入“不随排序变化”说明 |
| 外部摘要与索引 | 根 README 提供摘要、锁定上游、研究源码、在线研究页、在线 Web | GitHub README | Markdown diff、链接 HTTP 状态 | Stage 3/9 | continue | 仅修改和暂存 R-007 对应 hunk，避免并行项目变更 |
| GitHub 发布 | R-007 原创研究、演示和媒体提交到 `origin/main` | Git index、远端 commit、Actions | staged diff、push、workflow 结果 | Stage 9 | continue | 审计文件和媒体后提交，等待 quality/pages 工作流成功 |
| 线上 Web | GitHub Pages 研究页、展厅与 MP4 可用 | 1440/390、案例、视频 | HTTP、真实 Chromium、媒体元数据 | Stage 7/8/9 | continue | 部署完成后运行线上 Playwright 验收并记录结果 |
| 交付 | 浏览器验收、证据、研究日志与交接记录反映 revision 6 | 最终状态 | validation/handoff/research-log 文档 | Stage 9 | continue | 回写 commit、Actions、线上 URL 与浏览器证据后完成第二次同步 |

Revision 6 保留 revision 5 的全部本地与媒体证据，并重新打开编号、外部摘要、GitHub 发布、线上 Web 与交付记录；这些 `continue` 项将在本轮推送、部署与线上验收后关闭。
