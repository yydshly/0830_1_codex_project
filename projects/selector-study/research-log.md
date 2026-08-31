# Research log

实验记录按时间倒序排列。每次记录说明目标、变更、观察、证据和下一步；失败实验不会删除。

## 2026-08-31 · 修正为“复制时附带结构化上下文”的本质表述

- **触发：** 复核线上展厅时发现 `VISUAL INTENT COMPILER`、“点一下，AI 就知道”等首屏措辞高于源码实际行为，把人的选择、Selector 的收集/复制和下游 Agent 的理解/修改混成了一步。
- **源码边界：** Selector 负责点选目标、生成 selector / locator、收集必要的 DOM / 样式 / React/Vue 线索，并在复制时与 instruction 一起写入剪贴板；它不理解意图，不调用 Agent，也不修改项目代码。
- **修正：** 根 README、研究索引、项目 README、能力证据、网页首屏、演示步骤、场景文案和自动测试统一改为“选中元素，复制时附带结构化上下文”；删除或降级“编译意图 / AI 就知道”的过度主张。
- **浏览器证据：** Chrome 151 在 1280×900 与 390×844 下均命中新本质表述和边界说明，未命中旧主张；两档均无页面横向溢出，三档最终截图已更新。
- **运行时回归：** `verify-showcase.mjs`、`verify-source-demo.mjs`、`verify-capabilities.mjs` 与全仓结构验证通过；锁定上游 v0.4.1 的 JS/CSS 字节和 SHA-256 未变化。
- **边界：** 这是对研究结论和演示语义的修复，不新增 Selector 能力，也不把“携带更多上下文”外推为下游 Agent 成功率。
- **发布结果：** 修复提交 `2b91729` 已推送 main；Repository checks run `33376391419` 与 Pages run `33376391461` 均成功。根索引、研究页、展厅和源库实跑页均 HTTP 200 并命中新表述，线上首屏未命中旧主张，真实启动按钮仍可见。
- **下一步：** 表述修复范围关闭；后续研究回到 E3–E5 的 DOM / 浏览器边界、隐私红队与 Agent 效果对照。

## 2026-08-31 · 接入锁定源库实跑并准备 R-006 发布

- **目标：** 不再只用研究页模拟 Selector，而是在公开展厅内携带锁定上游 v0.4.1 的真实运行效果；同时建立 R-006、源库、研究页和在线 Web 的公开索引。
- **构建证据：** 从 commit `d88e9a6c3c10821a5cc6d87447693d9507a76b35` 执行 `npm run build`，只保留 `editor.js` / `editor.css`。SHA-256 分别为 `8680cfcb…fb50`、`09d2b376…d0e5`；`verify-source-demo.mjs` 与本地锁定上游逐字节比较通过。
- **真实主流程：** Chrome 151 启动面板后页面获得 186 个 `data-ai-id`；滚动并点击 `button[data-testid="create-campaign"]`，选框标签为 `button "创建活动"`；添加 instruction 后复制出 259 字符、9 行 prompt，包含 Page、selector、locator、inside、text、testid 和 instruction。
- **失败实验：** 首次启动时，我们自己的 MutationObserver 每次看到上游 DOM 变化都会重写同一状态文本，导致 observer 自触发循环和浏览器会话卡住。加入“状态与文本未变化则直接返回”后恢复；上游面板在 Shadow surface 内关闭时 body observer 不一定收到最终移除，补充 750ms 只读 reconcile 后 `panel=false / state=idle` 复验通过。
- **响应式：** 1280px 真实运行态和 390×844 启动页均无横向溢出；主展厅同源 iframe 成功加载真实启动按钮。
- **边界：** clipboard 镜像只在无真实数据的 fixture 中观察上游生成文本，不修改、不上传、不保存；本实验未调用 Codex，未证明 React/Vue source、跨浏览器或 Agent 成功率。
- **证据：** `artifacts/source-demo-runtime.png`、`source-demo-mobile.png`、`showcase-source-live.png`、`source-demo-runtime-prompt.md` 与 `showcase/source-demo/runtime/UPSTREAM.md`。
- **发布结果：** 研究提交 `df4ebc3` 已推送 main；Pages run `33374938190` 的 build/deploy 成功。根站、研究页、展厅和源库实跑页均 HTTP 200；线上运行时字节数与 SHA-256 保持一致。
- **线上实跑：** Chrome 从 GitHub Pages 启动 `v0.4.1`，生成 186 个 `data-ai-id`，选中标签为 `button "创建活动"`，无横向溢出。
- **下一步：** 网页发布范围关闭；研究继续时进入 E3 的其他浏览器、Shadow DOM 与 iframe fixture，再做 E5 隐私红队和 E4 Agent 效果对照。

## 2026-08-30 · 新增五维采用决策台

- **目标：** 把“工具值得用”的静态结论升级为可配置、可解释的工具路由，回答具体任务该用哪种 Selector 输出或何时换工具。
- **输入：** 任务类型、页面环境、数据敏感度、任务规模和保真要求，共 5 个维度、16 个原生 radio 选项。
- **输出：** 相对适合度、推荐状态、输出模式、原因、收集字段、补充证据、下游动作、风险闸门、解释信号和替代工具。
- **路由验证：** 本地单个 UI → `RECOMMENDED / 普通 Prompt / 92`；高保真复刻 → `Sharingan / 82`；公开内容 → `USE WITH REVIEW / Markdown / 64`；批量内容 → `USE OTHER TOOL / crawler`；敏感生产 → `STOP AND REVIEW / 停止直接导出`。
- **交互验证：** 物理点击完成各路由；原生 radio 的 ArrowRight 从 UI 切到 QA，焦点轮廓为 3px；重置恢复五项默认值与 `92`。390px 首轮检查发现任务选项被通用规则覆盖为单列，随后修复为 2×3，并复验无横向溢出。
- **Surface：** 1440px 双栏；768px 输入和结果纵向排列；390px 任务 2×3、其余分组按信息密度排列。双主题、reduced-motion 和 `?static=1` 的四类静态路由通过。
- **性能观察：** 页面仍只有本地 CSS/JS；本机缓存态 DOMContentLoaded 约 37 ms、load 约 39 ms、FCP 约 56 ms，无外部运行时请求。
- **判断：** 决策台让研究页能够拒绝不适合 Selector 的任务，但规则仍是源码证据驱动的研究判断，不是成功率模型、隐私担保或法律意见。

## 2026-08-30 · 扩展为六场景、多角度交互实验台

- **目标：** 从单一最佳场景继续补全，让读者比较 Selector 在产品、QA、设计复刻、内容摘录、源码追踪和测试自动化中的不同角色。
- **范围修订：** 保留原 React UI 修改工作台；把静态使用场景表升级为“场景 tabs + 失败基线 + 证据包 + 差异化输出 + 采用决策”，并继续保留快速对照表。
- **变更：** 新增六个可切换场景、六类唯一输出、每场景四项证据、适合度/成本/风险/下游/替代工具判断、运行态、Escape 重置、方向键与 Home/End 导航，以及六场景静态 fallback。
- **浏览器验证：** 六个 tabs 全部切换并生成唯一输出；物理点击完成 QA 场景，键盘 End 跳到 Locator 场景，Escape 恢复 READY；原 Sharingan → 模拟 Codex 主流程复测通过。1440、768、390px 均无横向溢出，明暗主题可读，reduced-motion 下新增动画为 `1e-06s`。
- **静态与性能：** `?static=1` 隐藏交互面板并展示六张静态场景摘要；页面仍只有本地 `styles.css` 与 `app.js`。缓存态本机观察约为 DOMContentLoaded 44 ms、load 59 ms、FCP 92 ms。
- **证据：** [浏览器验收](docs/frontend-validation.md)、[覆盖清单](docs/frontend-coverage.md)、更新后的[桌面](artifacts/showcase-desktop.png)、[平板](artifacts/showcase-tablet.png)和[手机](artifacts/showcase-mobile.png)截图。
- **判断：** 多场景网页交付范围关闭；差异化演示改善了“什么时候有用、交付什么、什么时候换工具”的判断，但仍不构成真实 Agent 成功率或上游跨浏览器结论。

## 2026-08-30 · 完成交互式研究展厅与跨视口验收

- **目标：** 用一个可亲手操作的网页解释 Selector 的能力、原理、场景、扩展和采用意义，并用最合适的“本地 React 后台精确 UI 修改”完整演示其价值。
- **环境：** Windows、Python 本地静态服务、`agent-browser 0.27.0`、Headless Chrome 151；视口 1440×1000、768×1024、390×844。
- **变更：** 新增零依赖 `showcase/`、本地启动脚本、结构验证、设计契约、覆盖清单、浏览器验收和交接记录。演示支持三个目标、普通/Sharingan 两种上下文、instruction 编辑、复制、下游 Codex 修改模拟、重置、主题与键盘操作。
- **执行：** 用真实浏览器复现目标切换、生成报告、模拟下游修改和 Escape 重置；双向切换主题；验证桌面/平板/手机无横向溢出；模拟 reduced-motion；用 `?static=1` 运行无交互静态 fallback；执行 `node tests/verify-showcase.mjs`。
- **观察：** 主流程、焦点样式和所有目标状态可达；窄屏隐藏侧栏后，方向键只在可见目标间导航；明暗主题和三档布局保持层级；浏览器无 console/page error。静态 fallback 保留 3973 字符正文、普通 prompt、6 项能力和 5 步原理，同时隐藏依赖 JavaScript 的操作。
- **性能观察：** 页面无外部运行时资源；缓存态导航 `DOMContentLoaded` 约 173 ms、`load` 约 234 ms、FCP 约 360 ms。数据是本机研究环境观察，不作为生产 SLA。
- **证据：** [浏览器验收](docs/frontend-validation.md)、[覆盖清单](docs/frontend-coverage.md)、[桌面截图](artifacts/showcase-desktop.png)、[平板暗色截图](artifacts/showcase-tablet.png)、[手机截图](artifacts/showcase-mobile.png)。
- **判断：** 网页交付范围关闭；它准确说明了已验证能力和边界，但没有替代 E3 上游浏览器 fixture、E4 Agent 效果对照或 E5 敏感数据实验。
- **下一步：** 研究继续时优先建立 Light DOM、Shadow DOM、iframe 与敏感字段 fixture；展厅本身没有未完成交付项。

## 2026-08-30 · 固定上游并建立能力基线

- **目标：** 获取可重复的 Selector 源码版本，验证基本构建，并把能力主张映射到实现证据。
- **环境：** Windows、PowerShell、Git 2.42.0.windows.2、Node.js 22.15.0、npm 10.9.2；上游 `0.4.1`，commit `d88e9a6c3c10821a5cc6d87447693d9507a76b35`。
- **变更：** 新建 `projects/selector-study`；增加固定提交获取脚本、静态能力测试、基线记录和能力证据清单。上游源码保存在被忽略的 `upstream/selector`。
- **执行：** 运行 `scripts/fetch-upstream.ps1`、`node tests/verify-capabilities.mjs`；在上游目录执行 `npm ci` 与 `npm run check`。
- **观察：** 固定 SHA 与 `package.json` 版本匹配；上游没有运行时 npm 依赖；构建成功并生成书签安装页和载荷。主要能力入口均存在。上游 `check` 仅等价于 build；README 声明 MIT，但没有独立 `LICENSE` 文件。
- **证据：** [基线验证记录](artifacts/baseline-verification.md)、[能力证据清单](artifacts/capability-evidence.md)、[`verify-capabilities.mjs`](tests/verify-capabilities.mjs)。
- **判断：** H1 通过；H2/H3 获得静态实现证据，但仍需浏览器 fixture；H4-H6 尚不足以判断。
- **下一步：** 建立 Light DOM、Shadow DOM、iframe 与敏感数据 fixture，先验证浏览器边界和脱敏，再进行 Agent 修改质量对照。
