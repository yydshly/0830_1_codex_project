# Selector 研究展厅 · Coverage manifest

状态词仅使用：`continue`、`pass`、`defer`、`blocked`。交付时所有必需项均为 `pass`。

| 用户阶段 | 要求或产物 | Surface / state | Evidence | Owning stage | Status |
| --- | --- | --- | --- | --- | --- |
| 能力 | 首屏说明“选中元素，复制时附带结构化上下文”的定位 | 1440px，明暗主题 | 桌面/平板截图、DOM 文本 | Stage 2 | pass |
| 最佳场景演示 | 选择三个模拟后台元素 | 默认、鼠标、方向键 | 浏览器 DOM 状态；桌面/手机方向键记录 | Stage 4/5 | pass |
| 最佳场景演示 | 编辑 instruction 并生成普通上下文 | 输入、生成、复制 | 输出断言、结构测试 | Stage 5/6 | pass |
| 最佳场景演示 | 切换 Sharingan 报告范围 | 普通/Sharingan | 浏览器确认 Geometry 与 Effective Style | Stage 5/6 | pass |
| 最佳场景演示 | 模拟交给 Codex 并重置 | 修改前/后、Escape | 浏览器确认 CTA 修改态与 Escape 焦点恢复 | Stage 5/6 | pass |
| 实现原理 | 展示注入、选择、定位、框架信息和导出流水线 | 默认完整状态 | 五步 DOM、固定提交源码链接 | Stage 3 | pass |
| 使用场景 | 给出适合度、收益和不适用边界 | 桌面/手机 | 场景矩阵、三档截图 | Stage 3/7 | pass |
| 可扩展方向 | 展示协议、源码映射、DOM 穿透、状态、安全和 QA 路线 | 默认完整状态 | 六项路线、研究判断标识 | Stage 3 | pass |
| 对我们的意义 | 区分日常工具、仓库依赖和研究对象 | 默认完整状态 | 采用评分、研究闭环文案 | Stage 3 | pass |
| 可信度 | 明示 Selector/Codex 边界和已知限制 | 全页面 | 六项限制、职责标识 | Stage 3/6 | pass |
| 主题 | 明→暗、暗→明层级和控件均可读 | 两主题 | 浏览器双向切换、平板暗色截图 | Stage 7 | pass |
| 视口 | 无横向溢出、遮挡或不可达控件 | 1440、768、390px | 三档截图；`scrollWidth === clientWidth` | Stage 7 | pass |
| 键盘 | 目标、模式、生成和重置可达 | Tab、方向键、Ctrl/⌘+Enter、Escape | 浏览器真实按键；3px 焦点轮廓 | Stage 7 | pass |
| Locale | 中文长标签和说明在窄屏不溢出 | zh-CN、390px | 手机截图、宽度断言 | Stage 7 | pass |
| Motion | reduced-motion 不隐藏信息 | reduced motion | Chrome 媒体模拟；过渡为 `1e-06s`、滚动为 `auto` | Stage 7/8 | pass |
| Fallback | JS 不可用时核心内容和静态 prompt 可读 | `?static=1` 等价静态模式 | 浏览器确认 3973 字符正文、6 项能力、5 步原理和 prompt | Stage 8 | pass |
| Performance | 零外部依赖且首屏无高成本视觉 | 本机静态服务 | FCP 约 360 ms；资源仅本地 CSS/JS | Stage 8 | pass |
| 工程 | 零依赖静态页面、启动命令和结构测试 | 本地服务 | `verify-showcase.mjs`、HTTP 浏览器运行 | Stage 9 | pass |
| 交付 | 浏览器验收、最终证据和交接记录 | 最终状态 | validation/handoff 文档与三张截图 | Stage 9 | pass |

## Scope revision 2 · reopened coverage

| 用户阶段 | 要求或产物 | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 多场景演示 | 六个角色/任务可切换 | 产品、QA、设计、内容、工程、测试 | 六项浏览器 DOM 断言；QA 物理点击 | Stage 4/5 | pass | 已完成 |
| 多角度解释 | 每个场景显示证据、交付物、收益、成本、风险和替代工具 | 六种 populated state | 每场景 4 项证据和 4 项决策字段 | Stage 3/6 | pass | 已完成 |
| 差异化输出 | 六种示例输出不是仅换标题 | prompt、bug brief、Sharingan、Markdown、source trace、locator candidates | 浏览器确认 6 个唯一首行与状态 | Stage 5/6 | pass | 已完成 |
| 键盘 | tabs 支持方向键、Home/End，运行和重置可达 | desktop/mobile | End 跳到末项；Escape 重置并返回焦点 | Stage 7 | pass | 已完成 |
| 主题与视口 | 新场景实验台在明暗主题、1440/768/390 无溢出 | default/running/completed | 三档新截图；宽度断言相等 | Stage 7 | pass | 已完成 |
| Motion | 场景切换在 reduced-motion 下不依赖动画 | reduced motion | `animationDuration = 1e-06s`，内容完整 | Stage 8 | pass | 已完成 |
| Fallback | 静态模式仍能比较全部场景 | `?static=1` | 六张静态摘要可见，交互面板隐藏 | Stage 8 | pass | 已完成 |
| Performance | 新场景不引入外部依赖或高成本资源 | normal | 资源仅本地 CSS/JS；FCP 约 92 ms | Stage 8 | pass | 已完成 |
| 工程 | 测试覆盖场景数量、唯一输出和 ARIA | source/test | `verify-showcase.mjs` 通过 | Stage 9 | pass | 已完成 |
| 交付 | 更新截图、验收、日志和交接 | final | 三张新截图与文档已更新 | Stage 9 | pass | 已完成 |

## Scope revision 3 · reopened coverage

| 用户阶段 | 要求或产物 | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 采用决策 | 五维输入可配置 | task/environment/sensitivity/scale/fidelity | 16 个原生 radio 与浏览器交互 | Stage 4/5 | pass | 已完成 |
| 推荐解释 | 输出模式、原因、证据、风险和下一步 | recommended/caution/alternative/stop | 五条路由结果与字段断言 | Stage 5/6 | pass | 已完成 |
| 语义与键盘 | radio group、checked、live、重置 | keyboard/focus | ArrowRight、3px 焦点与重置状态 | Stage 7 | pass | 已完成 |
| 主题与视口 | 决策台在两主题、1440/768/390 可用 | 多种结果状态 | 三档新截图；手机单列缺陷已修复 | Stage 7 | pass | 已完成 |
| Motion | 结果切换不依赖动画 | reduced motion | `animationDuration = 1e-06s`、内容完整 | Stage 8 | pass | 已完成 |
| Fallback | 静态路由表可读 | `?static=1` | 四张路由卡可见，交互区隐藏 | Stage 8 | pass | 已完成 |
| 工程 | 结构测试覆盖维度和路由标记 | source/test | `verify-showcase.mjs` 通过 | Stage 9 | pass | 已完成 |
| 交付 | 更新截图、验收、日志和交接 | final | 三张截图与文档已更新 | Stage 9 | pass | 已完成 |

## Scope revision 4 · source runtime and publication

| 用户阶段 | 要求或产物 | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 源库实跑 | 运行锁定上游代码，而非只看研究模拟 | source-demo / active | v0.4.1 面板、真实选框、目标标签 | Stage 4/5 | pass | 已完成 |
| 示例输出 | 用最适合的本地 UI 场景生成可核对 prompt | selected / annotated / copied | 259 chars / 9 lines，包含 testid、locator、instruction | Stage 5/6 | pass | 已完成 |
| 真实性 | 构建产物可追溯且未被研究页改写 | runtime / source | SHA-256、逐字节上游比较、固定 commit | Stage 6 | pass | 已完成 |
| 边界 | 明确区分源库效果、fixture、研究模拟和 Agent | all | 三类 truth cards、README 和真实 prompt 说明 | Stage 3/6 | pass | 已完成 |
| 响应式 | 源库入口和运行态在桌面/手机可用 | 1280 / 390 | 两张截图、无横向溢出断言 | Stage 7 | pass | 已完成 |
| 工程 | 新测试覆盖哈希、版本、入口和零外部网络依赖 | source/test | `verify-source-demo.mjs` | Stage 9 | pass | 已完成 |
| 发布 | 根 README 有 R-006 摘要、源库与在线 Web 索引 | GitHub / Pages | commit `df4ebc3`、Pages run `33374938190`、线上 HTTP/浏览器证据 | Stage 9 | pass | 已完成 |

## Scope revision 5 · copy-with-context wording repair

| 用户阶段 | 要求或产物 | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 本质表述 | 明确“选中元素，复制时附带结构化上下文” | root README / study README / hero | 三处首层摘要文本 | Stage 3 | pass | 已完成 |
| 职责边界 | 不声称 Selector 理解意图或保证 AI 知道/改对 | hero / diagram / scenario | 删除过度主张，保留 Agent 边界 | Stage 3/6 | pass | 已完成 |
| 相邻布局 | 中文新标题在桌面/手机不溢出 | 1280 / 390 | 浏览器 DOM 宽度和截图 | Stage 7 | pass | 已完成 |
| 工程与发布 | 测试、全仓校验、远端 Pages | source / GitHub | 自动检查、提交、Pages 与线上内容标记 | Stage 9 | continue | 本地通过后提交发布 |
