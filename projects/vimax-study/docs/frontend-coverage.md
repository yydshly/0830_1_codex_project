# ViMax 研究展厅 · Coverage manifest

状态词仅使用：`continue`、`pass`、`defer`、`blocked`。

| 用户阶段 | 要求或产物 | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 能力 | 首屏说明定位与三种输入模式 | 1440px，明暗主题 | 截图、DOM 文本 | Stage 2 | pass | `showcase-desktop.png`；H1 和正文存在 |
| 能力 | 能力卡支持分类筛选 | 鼠标、键盘、筛选结果 | 交互记录、DOM 计数 | Stage 5 | pass | “视觉”3 项，“运行”2 项；Enter 可触发 |
| 真实场景样例 | 官方 README 猫狗创意案例展示 Idea2Video 输入与推导产物 | 默认案例、阶段与镜头 | DOM、截图、来源链接 | Stage 3/5 | pass | 原始 idea/requirement/style、8 阶段与 8 教学镜头可读 |
| 真实场景样例 | 当前 `main_script2video.py` 篮球剧本展示 Script2Video | 案例切换、阶段与镜头 | DOM、交互、固定源码链接 | Stage 3/5 | pass | ArrowRight/Enter 切换后标题、8 阶段、8 镜头和来源同步 |
| 真实场景样例 | Mara 咖啡师 Type A fixture 展示跨环境人物锚点 | 8 镜头与来源状态 | DOM、交互、fixture 链接 | Stage 3/5 | pass | 2 场、8 镜头、7 类地点；固定 fixture 链接与“假设接入”状态可读 |
| 真实场景样例 | 餐厅厨房 Type B fixture 展示固定空间、遮挡与道具状态 | 14 镜头与来源状态 | DOM、交互、fixture 链接 | Stage 3/5 | pass | 3 场 14 镜头；End 到第 14 镜头与第 8 阶段 |
| 可信度 | 案例不冒充实跑结果，披露视频无法映射和 Novel2Video 配对样例缺口 | 所有案例、边界说明 | DOM 文本与视觉观察 | Stage 6 | pass | 上游输入/教学推导/无配对成片分层；Benchmark 无 runner、Novel 无配对样例显式披露 |
| 实现方式 | 可点击流程展示输入、产物、代码证据和依赖 | 六个流程节点 | 交互记录、证据链接 | Stage 5 | pass | End 切至“装配与恢复”；固定提交链接存在 |
| 演示效果 | 使用上游真实视频，提供来源与加载失败回退 | 三个演示、媒体错误态 | 浏览器媒体/回退观察 | Stage 6/8 | pass | 点击前无 `src`；加载后 `readyState=4`；错误态可见 |
| 可扩展方向 | 以影响和实现入口展示扩展路线 | 默认完整状态 | DOM、截图 | Stage 3 | pass | 6 张扩展卡及优先级标签通过静态测试 |
| 可信度 | 区分已实现、论文主张、待验证 | 全页面状态标签 | DOM 与视觉观察 | Stage 3 | pass | 既有状态组件保留；best-of-k 与音频边界显式披露 |
| 主题 | 新案例区在明暗主题保持层级和状态可读 | 两主题、四案例 | 双向切换截图/观察 | Stage 7 | pass | 明暗主题案例区均无溢出，状态色和正文可读 |
| 视口 | 新案例区无横向溢出、遮挡或不可达控件 | 1440、768、390px | 三张截图、尺寸检查 | Stage 7 | pass | 三档 `scrollWidth - clientWidth = 0`；截图已更新 |
| 键盘 | 案例、阶段、镜头、原有导航均可达，焦点可见 | Tab、Enter、方向键适用项 | 键盘路径记录 | Stage 7 | pass | ArrowRight 切案例；End 到阶段 08、镜头 14；Enter 切 lineage |
| Motion | reduced-motion 不隐藏信息 | reduced motion | 浏览器模拟/计算样式 | Stage 7/8 | pass | 媒体模拟命中；滚动为 auto，过渡近 0 秒 |
| Fallback | JS 或外部媒体不可用时核心信息仍存在 | noscript、video error | DOM/浏览器错误态 | Stage 8 | pass | `noscript` 和无 JS CSS 通过静态测试；图像/视频错误回退通过 |
| 工程 | 零依赖静态页面、案例结构测试、启动命令 | 本地服务 | 文件、测试和 HTTP 结果 | Stage 9 | pass | `verify-showcase.mjs` 覆盖 4 案例、来源、真实性与 8/8/8/14 镜头 |
| 交付 | 更新后的浏览器证据、验收与交接记录 | 最终状态 | validation/handoff 文档 | Stage 9 | pass | Revision 2 验收、交接、研究日志与截图已更新 |
