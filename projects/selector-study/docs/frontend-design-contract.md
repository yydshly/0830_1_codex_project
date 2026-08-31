# Selector 研究展厅 · 前端设计契约

## Contract

| 字段 | 决策 |
| --- | --- |
| Entry mode | Brief-led implementation，在现有 Selector 研究子项目中新增可运行网页展厅 |
| Request revision | 1 |
| Target user and context | 想在 5–10 分钟内判断 Selector 能做什么、如何实现、何时值得采用的开发者、设计师和 Agent 工作流研究者 |
| Desired first impression | 像一份可以亲手操作的浏览器检查档案：精确、克制、可信，第一眼就理解“选中元素，复制时把结构化上下文一起带走” |
| Visual ambition | Editorial |
| Experience architecture | Editorial Flow，首屏结论后紧接一个占据主视觉的交互工作台 |
| Visual constraints | 不依赖外部字体或图片；浏览器检查器式深色工作台与浅色研究正文并置；薄线框、坐标标记和选择框表达技术语义；不使用 WebGL 或装饰性大图 |
| Information constraints | 必须覆盖能力、实现原理、使用场景、可扩展方向、对我们的意义；区分上游已实现、研究判断、尚待验证；全部源码证据固定到 commit `d88e9a6c3c10821a5cc6d87447693d9507a76b35` |
| Operation constraints | 演示支持鼠标点击与键盘选择元素、编辑 instruction、生成普通/Sharingan 两种上下文、模拟交给 Codex 后的视觉结果、重置、主题切换；无后端、无登录、无真实 Agent 调用 |
| State constraints | 默认锁定“创建活动”按钮；目标切换后身份和 prompt 同步；Sharingan 展示报告范围而不是伪造完整数据；下游修改明确标注为模拟；JS 不可用时全部研究内容和静态示例仍可阅读 |
| Environment constraints | 项目内零依赖静态 HTML/CSS/JS；兼容 GitHub Pages；本地使用 Python `http.server`；不增加根级运行时 |
| Primary journey | 读者理解定位 → 在模拟后台中选择目标 → 输入修改指令 → 查看 Selector 生成的结构化上下文 → 模拟交给 Codex → 对照能力边界和采用建议 |
| User-defined phases | 能力、实现原理、使用场景、可扩展方向、对我们的意义、最佳场景演示 |
| Required artifacts | 可运行网页、交互演示、固定源码证据、自动结构测试、桌面/平板/390px 浏览器截图、浏览器验收记录、覆盖清单和交接说明 |
| Autonomy authorization | 用户明确要求“用网页的方式整理”并指定内容与演示，授权在 `projects/selector-study` 内直接完成可逆前端实现和验证 |
| User-decision boundary | 不部署公网、不调用真实 AI、不复制上游源码进展厅、不触碰已登录真实页面、不修改 Selector 上游工作副本 |

## Observable completion criteria

1. 首屏在 5 秒内回答“Selector 是什么、输入是什么、输出是什么”，且不把它称为代码生成器。
2. 六个用户要求的主题都有可导航内容，并把主张链接到固定提交或明确标注为研究判断。
3. 最佳场景演示可完成“选中目标 → 写 instruction → 生成上下文 → 模拟下游修改 → 重置”的完整路径。
4. 演示至少包含三个可选择元素，输出 stable selector、semantic locator、source、React 链、inside 和 instruction；Sharingan 模式展示扩展报告章节。
5. 页面明确标示 Selector 与 Codex 的职责边界、隐私风险、Shadow DOM/iframe/跨域限制。
6. 1440px、768px、390px 视口无横向溢出、遮挡或不可达控件，触控目标和正文可读。
7. 明暗主题、键盘焦点、方向键目标切换、Escape 重置、reduced-motion 和无 JavaScript 基线成立。
8. 自动结构测试、能力契约、上游构建和仓库结构验证通过；浏览器验收有可复现证据。

## Brief-led design direction

| 决策层 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| Composition | “结论 + 工作台”首屏，之后按原理、场景、扩展、意义和边界纵向推进 | 首屏只保留一个核心命题和一个主要操作面 | 首次扫描先看到“点选 → 上下文”而不是版本数据 |
| Focal hierarchy | 大标题与荧光选择框为主，版本和统计为辅 | 导航和徽标不得抢过交互工作台 | 读者无需滚动即可找到“开始演示” |
| Typography | 系统无衬线承载正文，等宽体承载 locator、代码和证据 | 中文正文行长控制在约 38–72 字符 | 桌面和手机无需缩放阅读 |
| Palette | 象牙白/墨绿色双主题，荧光绿表示已选择，珊瑚色表示风险与边界 | 状态同时使用文字、线框和图标，不只依赖颜色 | 两主题中选择态、焦点和风险提示可区分 |
| Material | 浏览器窗框、细网格、编号和测量标尺；避免通用玻璃卡片 | 每个容器表达明确的信息或操作边界 | 页面更像研究工具而不是营销模板 |
| Depth | 仅 sticky 导航、选择覆盖层、代码输出面板有层级 | 装饰层不覆盖正文或截断焦点 | 滚动、选择和活动面板关系清楚 |
| Density | 演示区高信息密度，研究正文用大段留白和对照表 | 单区块只回答一个主问题 | 用户能顺序阅读，无需来回拼接结论 |
| Motion | 选择框、prompt 生成和预览修改使用短过渡 | reduced-motion 下立即切换，不依赖动画传达结果 | 动画不延迟操作、不制造假进度 |

## Scope revision 2 · 多场景、多角度演示

| 字段 | 修订决策 |
| --- | --- |
| Revision trigger | 用户要求“继续补全”，从单一最佳场景扩展为多个使用场景的多角度演示 |
| Authorization | 用户明确要求继续，授权在现有展厅内直接完成可逆的场景交互、布局、文案、测试和证据更新 |
| Preserved decisions | 保留首屏命题、原最佳场景工作台、零依赖静态技术、明暗主题、固定提交证据和 Selector/Codex 职责边界 |
| Affected surfaces | `#scenarios`、场景导航、场景状态和输出、响应式布局、键盘路径、静态 fallback、最终截图与交付文档 |
| New experience goal | 读者不仅知道“本地 UI 修改最好用”，还能通过同一实验台比较 Selector 在产品、QA、设计复刻、内容提取、源码追踪和测试自动化中的不同输入、输出、收益与边界 |
| Revised primary journey | 选择一个场景角色 → 阅读任务与失败基线 → 运行示例 → 观察证据包和交付物 → 比较适合度、成本、风险与替代工具 → 切换其他场景 |
| State constraints | 至少六个场景；每个场景有不同任务、目标、证据字段、输出预览、适合度、成本、风险、下游动作和“何时不该用”；标签支持鼠标、左右键、Home/End，状态通过 live region 宣告 |
| Information constraints | 严格区分上游已实现能力、研究页模拟和研究判断；不伪造真实 Agent 成功率、真实 token 或真实脱敏保障 |
| Required artifacts | 更新后的网页、场景结构测试、桌面/平板/手机最终截图、浏览器验收、覆盖清单、研究日志和交接说明 |

### Revision 2 completion criteria

1. 场景实验台至少覆盖产品/UI、QA/缺陷、设计/复刻、内容/Markdown、工程/源码和测试/自动化六个角度。
2. 每个场景都能生成明显不同、与上游能力对应的输出预览，而不是仅替换标题。
3. 同一视图同时回答：适不适合、收集什么、交给谁、主要收益、主要代价、何时换工具。
4. 场景切换可由鼠标和键盘完成，选中状态、tabpanel 关系和 live feedback 语义完整。
5. 原最佳场景工作台功能不回归；三档视口、双主题、reduced-motion 和静态 fallback 重新验收。

## Scope revision 3 · 采用决策台

| 字段 | 修订决策 |
| --- | --- |
| Revision trigger | 用户再次要求继续；在已完成的多场景展示内补足“我现在究竟该不该用、该用哪种模式” |
| Authorization | `jixu` 视为继续既有网页完善的明确授权；不扩展到真实后端、Agent 调用或生产数据采集 |
| Preserved decisions | 保留六场景实验台、原最佳场景、静态比较表、采用评分、零依赖和所有安全边界 |
| Affected surfaces | 在场景与扩展之间新增 `#decision`，增加导航入口、选择控件、推荐状态、风险闸门、响应式和静态 fallback |
| New primary journey | 选择任务 → 选择环境 → 选择数据敏感度 → 选择规模 → 选择保真要求 → 获得 Selector 模式/替代工具/补充证据/操作边界建议 |
| Decision constraints | 推荐必须由可解释规则生成；批量任务优先替代工具；敏感生产页不得推荐“直接复制”；高保真复刻才推荐 Sharingan；所有分数是研究页相对评分而非实测成功率 |
| Input constraints | 全部使用原生 radio/select-like button 语义，不需要表单提交；键盘可完成选择，状态通过 live region 更新，可一键恢复推荐基线 |
| Fallback constraints | 无 JavaScript 时显示一张静态路由表，覆盖普通 Prompt、Sharingan、Markdown 和替代工具四类结果 |

### Revision 3 completion criteria

1. 决策台至少组合任务、环境、敏感度、规模和保真度五个维度。
2. 浏览器验证至少四条不同路由：本地 UI → Prompt；高保真复刻 → Sharingan；内容摘录 → Markdown；批量或敏感生产任务 → 替代/停止。
3. 结果同时给出推荐、原因、补充证据、风险闸门和下一步，不伪造效果数据。
4. 控件具有 radio group 语义、选中状态、键盘可达、重置和 live feedback。
5. 1440/768/390、双主题、reduced-motion、静态 fallback 和原多场景交互重新验收。

## Scope revision 4 · 锁定源库实跑与 GitHub Pages 发布

| 字段 | 修订决策 |
| --- | --- |
| Revision trigger | 用户要求演示携带源库真实运行效果，并要求整理、提交远端 GitHub、部署 Web、在根 README 建立摘要/源库/在线索引和研究序号 |
| Research identity | 固定为 `R-006`，即第 6 个研究子项目 |
| Runtime boundary | 保留原研究模拟用于讲解；另建同源 iframe 安全 fixture，直接加载锁定上游构建，不调用真实 Agent、不放生产数据 |
| Provenance | 只保留演示所需 `editor.js` / `editor.css`，必须记录 commit、版本、SHA-256，并在本地上游存在时逐字节比较 |
| Output observability | 在安全 fixture 内镜像 Selector 交给 `clipboard.writeText` 的文本到内存核对区；不修改 prompt、不上传、不持久化 |
| Publication | GitHub Pages 沿用仓库既有 workflow；根 README 必须同时给出 R-006 摘要、上游源码、研究页、在线 Web 和源库实跑链接 |

### Revision 4 completion criteria

1. 浏览器能启动上游 v0.4.1 面板并选择 fixture 中明确的 UI 目标。
2. 真实输出包含 selector、locator、inside、text、testid 和用户 instruction，并保留为最小证据。
3. 页面明确区分“上游真实运行”“研究 fixture”“多场景模拟”“未调用 Agent”。
4. 运行时哈希固定，测试验证关键入口且不依赖外部网络脚本。
5. 根 README 使用 `R-006`，并给出源库、研究页、在线 Web、源库实跑四个入口。
6. 推送 main 后等待 Pages 成功并对线上 URL 做 HTTP 与内容验证。

## Scope revision 5 · 回归“复制时附带结构化上下文”的本质表述

| 字段 | 修订决策 |
| --- | --- |
| Entry mode | Repair-led；用户指出当前“视觉意图编译器 / AI 就知道”的表述高于源码实际行为 |
| Observed baseline | 线上首屏使用 `VISUAL INTENT COMPILER`、“点一下，AI 就知道”和“完成人的视觉意图交付”等措辞，容易把选择、复制和下游 AI 三个阶段混成一种理解能力 |
| Ground-truth statement | Selector 的直接动作是：用户选中元素，在复制时把 selector、locator、DOM/样式/框架等可用上下文与 instruction 一起放进剪贴板；下游 AI 是否理解和修改正确不属于 Selector 本身 |
| Preserved behavior | 保留现有交互、布局、源库实跑、六场景、决策台、主题和响应式；不改变上游运行时或真实 prompt |
| Affected surfaces | 根 README R-006 行、研究 README / index、展厅 title/meta/hero/图解/模拟工作台标签、对应测试和研究记录 |
| Autonomy authorization | 用户明确指出描述不合理，授权对事实表述进行就地修正，不需要重新确认视觉方向 |
| Acceptance criteria | 首屏第一眼出现“选中 → 复制 → 连同结构化上下文带走”；不再声称 AI 因“一点”就知道目标，也不把工具提升为意图理解器；技术细节和能力边界仍准确 |
| Adjacent checks | 1280px 与 390px 中文换行、导航和 hero 无溢出；真实运行区、复制主流程和测试不回归 |

### Revision 5 observable completion criteria

1. 根索引、研究摘要和展厅首屏都把“复制时附带上下文”作为第一层本质。
2. 删除或降级 `Visual intent compiler`、“AI 就知道”、“人的视觉意图 → 任务包”等过度抽象表达。
3. 清楚保留 Selector 只负责选取与复制、Agent 才负责理解和改代码的职责边界。
4. 新文案在桌面和手机不造成横向溢出，交互与真实源库示例保持通过。
