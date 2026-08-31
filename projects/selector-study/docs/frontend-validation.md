# Selector 研究展厅 · 浏览器验收

## 结论

研究展厅、六场景实验台、五维采用决策台和锁定源库实跑均通过。网页在真实 Chromium 中完成原主流程、多场景切换与运行、决策路由、明暗主题、桌面/平板/手机、键盘、reduced-motion 和静态 fallback 验收；新增源库页还直接完成上游 v0.4.1 启动、目标选择、instruction 和普通 prompt 导出。

这份验收直接证明锁定版本 Selector 在 Chrome 的安全 Light DOM fixture 中能运行普通主流程，但不证明跨浏览器、Shadow DOM、frame 内部选择、隐私或真实 Agent 修改效果。

## 环境

| 项目 | 值 |
| --- | --- |
| 日期 | 2026-08-31 |
| 服务 | Python `http.server`，`http://127.0.0.1:4186/` |
| 自动化 | `agent-browser 0.27.0` |
| 浏览器 | Headless Chrome 151.0.0.0 / Windows |
| 视口 | 1440×1000、768×1024、390×844 |
| 页面依赖 | 研究页本地 CSS/JS；源库实跑另加载逐字节锁定的上游 `editor.js` / `editor.css`；无外部字体、图片、脚本或 API |

## Revision 4 · 锁定源库真实运行

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 构建身份 | `selector-0.4.1.js` / `.css` 与锁定上游 `npm run build` 输出逐字节一致 | [`verify-source-demo.mjs`](../tests/verify-source-demo.mjs)、[SHA-256 清单](../showcase/source-demo/runtime/UPSTREAM.md) |
| 启动 | 点击“启动真实 Selector”后出现上游面板，版本显示 `v0.4.1`，页面获得 186 个临时 `data-ai-id` | Chrome DOM 断言 |
| 选择 | 滚动到 fixture 后点击 `button[data-testid="create-campaign"]`，选框标签为 `button "创建活动"` | [运行截图](../artifacts/source-demo-runtime.png) |
| instruction / 导出 | 添加“提升为主操作…”后复制成功；输出 259 字符、9 行，包含 Page、selector、locator、inside、text、testid 与 instruction | [真实 prompt](../artifacts/source-demo-runtime-prompt.md) |
| 演示壳状态 | 首轮 MutationObserver 因重复写状态文本发生自触发循环；增加同值短路后恢复，随后补充 750ms reconcile 处理上游 Shadow surface 关闭事件 | 失败实验与修复后的 Chrome 断言 |
| 关闭恢复 | 关闭上游面板后 `panel=false`，演示状态在 1 秒内切换为 `idle`，已复制输出仍保留 | Chrome DOM 断言 |
| 响应式 | 1280px 运行态与 390×844 启动页均无横向溢出 | [桌面运行态](../artifacts/source-demo-runtime.png)、[手机入口](../artifacts/source-demo-mobile.png) |
| 主展厅嵌入 | `#source-live` 同源 iframe 加载成功，能看到真实启动按钮；主页面 `scrollWidth <= innerWidth` | [嵌入区截图](../artifacts/showcase-source-live.png) |

## 主流程

1. 默认选择“创建活动”，普通输出包含 selector、locator、inside、source、React 链和 instruction。
2. 鼠标选择“活动”导航后，目标名、指令和输出同步；桌面方向键从 CTA 切到指标卡。
3. 切换 Sharingan 并生成，输出标签变为 `SHARINGAN REPORT · SAMPLE`，包含 Geometry、DOM Snapshot、Effective Style 和上游附加章节说明。
4. 点击“模拟交给 Codex”，当前 CTA 进入明确标记的下游修改态，反馈再次说明 Selector 只交付证据。
5. 按 Escape 恢复普通模式和默认 CTA，并把焦点返回重置按钮。

## Revision 2 · 六场景流程

| 场景 | 浏览器运行结果 | 差异化输出 |
| --- | --- | --- |
| 产品 / UI | `COMPILED` | `UI CHANGE CONTEXT`：selector、locator、组件链、source 与 instruction |
| QA / 缺陷 | `CAPTURED` | `BUG EVIDENCE BRIEF`：交互态、祖先上下文、邻近元素与缺失证据 |
| 设计 / 复刻 | `REPORTED` | `SHARINGAN REPORT`：几何、样式、字体、状态、资源与版权边界 |
| 内容 / 知识 | `SERIALIZED` | `Markdown fragment`：标题、表格、列表和链接结构 |
| 工程 / 源码 | `TRACED` | `FRAMEWORK SOURCE TRACE`：React 链、source、受限 props/state 和置信边界 |
| 测试 / 自动化 | `DRAFTED` | `LOCATOR CANDIDATES`：role/testid/容器限定与验证清单 |

六个场景各有四项不同证据；浏览器逐一运行后首行输出唯一数为 6。物理点击完成 QA 场景，状态条三步全部完成；tabs 的 End 键从 QA 跳到最后一个 Locator 场景，焦点和 `aria-selected` 同步；场景内 Escape 恢复 `READY` 并把焦点返回运行按钮。

## Revision 3 · 采用决策路由

| 输入组合 | 状态 / 分数 | 路由结果 | 关键闸门 |
| --- | --- | --- | --- |
| UI、本地、普通、单个、紧凑 | `RECOMMENDED / 92` | 普通 Prompt | 复制前检查 URL、文本、表单值和 props/state |
| 视觉复刻、本地、普通、单个、高保真 | `RECOMMENDED / 82` | Sharingan 报告 | 记录授权并控制选取范围 |
| 内容、公开、普通、单个、紧凑 | `USE WITH REVIEW / 64` | Markdown 导出 | 检查版权、条款和来源 |
| 内容、本地、普通、批量、紧凑 | `USE OTHER TOOL / 32` | crawler / Reader | 不把手工书签流程当批处理 |
| 任意任务、生产、敏感 | `STOP AND REVIEW / ≤8` | 停止直接导出 | 禁止直接发送给外部 Agent 或服务 |

五个 fieldset 均使用原生 radio。浏览器用 ArrowRight 从 UI 切到 QA，`checked`、焦点和结果同步，焦点样式为 3px 绿色轮廓；重置按钮恢复 UI/local/standard/single/compact 和 92 分基线。分数在页面中明确标注为相对适合度，不是实测成功率。

## 跨 Surface 结果

| Surface | 结果 | 证据 |
| --- | --- | --- |
| Light / dark | 双向切换成功；`aria-pressed`、标签与 `localStorage` 同步；场景 tabs、决策格和 code panel 均保留层级 | [桌面浅色](../artifacts/showcase-desktop.png)、[平板暗色](../artifacts/showcase-tablet.png) |
| 1440px | 六个 tabs 单行；场景三段流与四项决策同屏展开，无横向溢出 | 桌面完整截图；设计复刻场景完成态 |
| 768px | tabs 变为 3×2；证据两列、输出独占下一行，暗色状态可辨 | 平板完整截图；`scrollWidth = clientWidth = 753` |
| 390px | tabs 变为 2×3；场景详情、决策和操作纵向排列，无裁切 | [手机完整截图](../artifacts/showcase-mobile.png)；`scrollWidth = clientWidth = 375` |
| Decision desktop | 五维输入与结果双栏同屏，默认推荐的理由和四步路线完整 | 桌面完整截图 |
| Decision tablet | 输入与结果纵向排列；任务保持 3×2，结果紧随表单 | 平板截图与宽度断言 |
| Decision mobile | 任务 2×3、环境单列、紧凑组分栏；结果无横向滚动 | 手机截图；首轮单列问题修复后复验 |
| Keyboard | 原 CTA/模式键盘路径保持；场景 tabs 支持方向键、Home/End，场景 Escape 重置 | 浏览器真实 `press` 事件和 DOM 状态 |
| Focus | 生成按钮获得 `3px` 荧光绿实线、`3px` offset | Chrome computed style |
| Locale | zh-CN 长标题、操作标签和表格在 390px 保持换行与可读性 | 手机截图与无溢出断言 |
| Reduced motion | 媒体模拟命中；非必要过渡缩短到 `1e-06s`，平滑滚动关闭 | Chrome media emulation 与 computed style |
| Static fallback | `?static=1` 隐藏交互实验台与决策表单；六张场景摘要和 Prompt/Sharingan/Markdown/替代工具四类静态路由可读 | 浏览器 DOM/样式断言 |
| Foreground | 页面没有 dialog、popover 或遮罩层；此项不适用 | 设计契约明确采用内联工作台 |

## 性能观察

决策台版本在本机缓存态静态服务中，`DOMContentLoaded` 约 37 ms、`load` 约 39 ms、FCP 约 56 ms。页面只有本地 `styles.css` 和 `app.js`，没有外部运行时请求或高成本 canvas/WebGL/视频；这些数字用于发现明显回归，不是生产 SLA。

## 自动检查

```powershell
node .\projects\selector-study\tests\verify-showcase.mjs
node .\projects\selector-study\tests\verify-source-demo.mjs
node .\projects\selector-study\tests\verify-capabilities.mjs
node .\scripts\validate-repository.mjs
```

结构测试覆盖 10 个主题区段、1 个锁定源库实跑、3 个模拟选择目标、6 个交互场景、6 类差异化输出、5 个决策维度、16 个决策输入、4 类决策结果、6 项能力、6 个扩展方向、6 项限制、3 个断点、双主题、reduced-motion、键盘路径、无 JavaScript 边界和零外部网络运行时依赖。

## 保留边界

- 三张最终截图分别保留设计复刻/默认推荐、QA/敏感生产停止、Markdown/批量替代组合，用最小证据集覆盖场景与决策状态；平板同时覆盖暗色主题。
- `?static=1` 是为浏览器验收提供的显式静态阅读入口，与真正禁用 JavaScript 时保留 `.no-js` 的页面路径使用同一套 CSS；真正无脚本时还会显示 `<noscript>` 说明。
- 上游 Selector 的 Chrome / Light DOM 普通主流程已经有直接证据；其余浏览器、Shadow DOM、iframe 深层选择、Sharingan 完整报告和 Agent 效果仍属于 E3–E5，不从单一 fixture 外推。
