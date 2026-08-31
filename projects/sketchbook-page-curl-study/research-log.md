# Research log

实验记录按时间倒序排列。失败和证据不足的实验不会删除。

## 2026-08-31 · E13 GitHub 公开发布与可访问性闭环

- **发布目标：** 将本项目固定为公开研究编号 `R-001 / 第 1 个研究子项目`，在仓库外部入口提供摘要、上游固定版本、GitHub 源码目录、在线研究页、实际 Demo、技术展厅与可复现深链，而不是只把本地文件推到远端。
- **公开摘要：** 根 README 的研究索引新增 R-001 行，说明条带链核心、8 套原创场景、18 种可操作书型、六轴 36 个方向和 12 个跨轴组合；项目 README 同时列出源库、研究源码与四个在线入口，并明确放大镜只是增强层而非翻页算法。
- **版本证据：** 公开基线提交为 `84ae99c2144100fb4f85495a70acc1abe8704315`（`research: publish R-001 Sketchbook study`），已推送至 `origin/main`。上游索引固定到 MengTo/sketchbook commit `c1e477814c4c9e204452ebf9b298aa13629cbfc2`，未改为不稳定的分支首页。
- **自动化证据：** GitHub Actions `Repository checks` run `33366112690` 成功；`Deploy research site` run `33366112730` 的 build 与 deploy 两个 job 均成功，Pages 部署于 2026-08-31 完成。
- **HTTP 证据：** GitHub 研究目录、在线研究页、`demo/`、`showcase/` 与 `?rev=6&panel=explore&direction=mechanism-iris-aperture&intro=0` 深链均返回 HTTP 200，四个 Pages 表面都包含 R-001 标识。
- **真实浏览器证据：** 1440×1000 Chromium 直接打开线上深链后，标题为 `R-001 · FOLD / 18 · 柔性翻页实际效果`，品牌为 `R-001 · 柔性纸张实际效果`，活动面板为 `explore`，选中方向为 `mechanism-iris-aperture / 虹膜快门书`，方向数为 36；全页无横向溢出，console errors、page errors 与 failed requests 均为空。
- **工程闭环：** 26/26 项项目测试与 repository validator 通过；公开元数据回归测试覆盖项目 README、Pages 入口、Demo、showcase、根 README、固定上游链接和全部在线索引。
- **隔离边界：** 本次只提交 R-001 目录与根 README 中对应的一行；工作区里其他未完成研究条目和子项目保持未提交，未被混入 R-001 发布提交。
- **结果：** R-001 已完成“远端源码可查、外部摘要可读、在线能力可操作、深链状态可复现、发布证据可追溯”的公开交付。真实 iOS/Android 触控竞争与持续性能仍按原条件延期，不因 Pages 发布而被提升为已验证。

## 2026-08-31 · E12 六轴创意图谱与八种新增实作

- **用户目标：** 在十种书型基础上继续“尽可能详细、多、创意性更多”地描述与探索，同时延续先前纠偏：中央舞台必须有实际效果，不能退回技术拆分或仅用说明卡替代演示。
- **体验决策：** 保留 Spatial Stage 为主要操作面；“书型 18”直接比较所有实作，“创意图谱”承担大量方向的筛选与深读。图谱采用“六轴 → 方向列表 → 单项详情 → 回到舞台”的渐进披露，不让 36 项文字同时压过模型。
- **八种新增实作：** 分栏组合书含 3 条独立页带与 15 个候选面，可编码 125 种组合；拉条联动书用一条输入同时驱动遮罩、齿轮和能量路径；虹膜快门用 8 片交叠叶片控制孔径；瀑布翻片以 6 张阶梯卡逐片翻落；百叶交错用 20 条双面叶片完成昼夜变图；双首背靠背书共享书脊并整体翻面切换两个入口；雅各布梯用 6 块硬板和 2 条纸带传播翻转；万花折面用 6 个三角单元、18 个面元素循环显示 3 组隐藏面。
- **创意地图：** 六条轴分别为阅读拓扑与装订、纸张机构与联动、材料/光学与显影、组合叙事与状态、身体/尺度与环境、数据/生成与生命性；每轴 6 项，共 36 项。每项都有中英文名、核心结构、主要动作、适用场景、技术机制、最大风险、对采用者的意义、组合建议和下一步实验。
- **成熟度边界：** `LIVE=8` 表示本页有真实交互 renderer；`REMIX=15` 表示当前架构可可信模拟关键机制；`HORIZON=13` 表示需要摄像头、传感器、多人同步、实时后端或 WebGL。32 个方向有邻近 form 映射并覆盖全部 18 个书型，但 REMIX/HORIZON 的按钮和边界文案明确不把邻近模型冒充完整实现。
- **跨轴组合：** 增加 12 个组合场景：气候记忆历书、城市昼夜切片、产品真相机、角色组合剧场、隐私权限书、因果瀑布、双面博物馆、误解阶梯、三态科学折面、活的旅行档案、触摸记忆花园与双人和解书。每项说明问题、组合机制、首要风险，并可把其中一条可运行或邻近机制送入中央舞台。
- **八形态浏览器证据：** progress=`.730` 时八种新增书型均出现可观察几何变化；结构计数依次为 3 bands、3 linked parts、8 blades、6 cards、20 slats、2 entries、6 boards、6 triangles。中央直接拖动把拉条进度更新到 `.405`；分栏主动作令组合 `001→002`；左右导航 gatefold→accordion；键盘令进度 `.000→.100`；退出后恢复 2 个传统 half。
- **图谱浏览器证据：** 页面显示 7 个轴按钮（含“全部”）、4 个成熟度按钮、36 个方向、6 个详细内容区和 12 个组合场景。机构轴筛选得到 6 项，再筛 LIVE 得 4 项；HORIZON 得 13 项。`narrative-mix-and-match` 正确映射到 `mixmatch` 并可打开完整书型控制；HORIZON 详情明确写出“当前不冒充已实现”。
- **跨表面与降级：** 1440、768、390 三档均无全页横向溢出；390px 五个顶部入口在自身容器内横向滚动且主书位于控制台之前。reduced-motion 下 flipbook 只从 step 0 推进到 1，`playing=false`。fallback 以 progress=`1.000` 展示静态终态，书型/图谱选择仍可用，而 action/range 禁用。
- **失败与修正：** 第一张万花折面截图中，六角星底部越过导航并被视口裁切。将 `.form-flexagon__body` 从 `min(77%,430px)` 收敛为 `min(52%,300px)` 后，六个三角面、中心面组和导航可以同时完整辨认。创意图谱最初让 36 项把详情推得过远；为方向列表增加 324px 内部滚动和选中项自动定位后，详情不再被长列表无限推后。
- **性能与工程证据：** 当前路由请求 5 个本地运行时资源、0 个外部资源；图谱态 DOM 797 节点，navigation 约 232ms，console/page errors=[]。25/25 项 Node 测试与 repository validator 通过；该证据不代表真实移动设备持续帧时、热量或功耗。
- **来源边界：** 上游仍固定为 commit `c1e477814c4c9e204452ebf9b298aa13629cbfc2` 且未发现标准 `LICENSE`。八种新增书型、36 方向、12 组合与全部视觉/交互均为本项目独立实现，不归因给上游、不复制上游源码或素材。
- **结果：** Revision 6 coverage 全部通过。最终证据为 `browser-r6-explore-iris.png`、`browser-r6-atlas-detail.png`、`browser-r6-mixmatch.png`、`browser-r6-pulltab.png`、`browser-r6-flexagon.png` 与 `browser-r6-mobile-atlas.png`。物理触控与真实移动设备持续性能继续有效延期。

## 2026-08-31 · E11 书籍结构作为界面的十种创意书型

- **用户纠偏：** 用户继续追问“为什么只有书籍这种形态”以及“书籍的创意形态”，并要求把此前提到的不同形态都做成实际效果，而不是再增加技术拆分或文字卡片。
- **范围决策：** 将“场景”和“书型”拆成正交维度。场景回答书里承载什么任务；书型回答纸页怎样连接、展开、遮挡、叠合、转动与循环。顶部新增独立“书型”入口，选择后中央 Spatial Stage 直接更换 renderer。
- **十种实作：** 对开门书使用两扇反向铰接硬页；手风琴书使用 6 个山折/谷折交替面；立体书让多个纸构件分阶段抬升；镂空书以开窗面罩揭示多层景深；透明叠层书依次叠合 3 张半透明页；隧道书以 5 层纸框形成透视纵深；旋转轮盘书在固定指针下旋转 8 个扇区；翻动画册以 12 张页片推进动作帧；旋转木马书把 6 片书页围绕中心放射；无限循环书让 6 个面板首尾成环并保留循环计数。
- **统一控制：** 书型按钮互斥选择；中央书体水平拖动与进度滑杆共享连续 `progress`；主动作根据书型执行开合、逐层、逐档或播放；左右导航切换相邻书型；键盘可调进度、触发主动作和复位。切换或退出会停止翻动画册 timer、移除旧 renderer，并恢复传统柔性翻页舞台。
- **实现原理：** 每种书型拥有独立、可检查的 HTML/SVG DOM 拓扑；CSS `transform-style: preserve-3d`、`perspective`、`transform-origin` 与 CSS 变量负责连续几何，`clip-path`/mask 负责镂空窗口，透明度与 `translateZ` 负责叠层和纵深。JavaScript 只维护统一的 `progress / step / turn / playing` 状态并把它映射到各 renderer，不使用 Canvas、WebGL 或外部运行时资源。
- **运动与降级：** `prefers-reduced-motion` 下翻动画册不启动连续 timer，主动作只推进单帧；`?fallback=1` 使用静态可辨认终态并禁用动态控制。该策略保留内容与结构辨识，不冒充真实触屏或辅助技术验收。
- **来源边界：** 上游仍固定为 MengTo/sketchbook commit `c1e477814c4c9e204452ebf9b298aa13629cbfc2`；锁定提交仍未发现标准 `LICENSE`，README 的 educational-use 表述不变。十种书型的文案、几何、SVG、DOM 与控制逻辑均为本项目独立实现，不归因给上游，也不复制其源码或素材。
- **十形态浏览器证据：** 逐一选择、驱动并比较全部书型，`geometryChanged=10/10`。直属结构计数依次为对开门 2 扇、手风琴 6 面、立体书 3 个纸构件、镂空书 4 层、透明叠层 3 张、隧道书 5 框、轮盘 8 扇区、翻动画册 12 张、旋转木马 6 叶、无限书 6 面板。
- **输入与生命周期证据：** 中央直接拖动把 progress 更新到 `.540`；右导航从 gatefold 切换到 accordion；键盘把连续进度推进到 `.100`；退出书型后恢复 2 个传统 half，下一次柔性翻页仍生成 18 条 strip。
- **跨表面与降级证据：** 1440、768、390 三档均无全页横向溢出。reduced-motion 下 flipbook 从 step 0 只推进到 1 且 `playing=false`；fallback 中 popup 处于静态终态 progress=1，书型控制全部 disabled。
- **浏览器修正：** 第一轮隧道书截图中，前层在嵌套 perspective 下投影过大并压到标题区域。将每层 `translateZ` 从 48px 级收敛到 26px 级、前层 scale 上限降至 `1.1`，并把 tunnel well 向舞台下方内收；复验后标题、五层间距和尽头光源可同时辨认。
- **性能与工程证据：** console/page errors=[]；R5 路由加载 4 个本地资源、transfer 约 148.5KB，交互态 DOM 为 312 个节点。自动测试 21/21 通过，repository validator 通过。它们证明当前静态演示没有新增外部请求或结构回归，不代表持续动画帧时、热量和功耗。
- **结果：** Revision 5 coverage 全部通过；最终证据为 `browser-r5-gatefold.png`、`browser-r5-popup.png`、`browser-r5-layers.png`、`browser-r5-tunnel.png`、`browser-r5-volvelle.png` 与 `browser-r5-mobile-carousel.png`。真实物理触控和移动设备持续性能继续有效延期。

## 2026-08-31 · E10 扩展场景的专属交互效果

- **目标：** 回应“除了这个场景，还能扩展的场景效果”，让新增场景不只替换封面或说明文字，而是在同一本柔性主书上表现不同产品行为。
- **变更：** 在作品集、自然图鉴、产品发布、展览导览四个基础场景之外，新增旅行手账、食谱、漫画和产品目录；页稿、交互与视觉叠层均为本项目原创独立实现，没有复制上游源码或素材。
- **旅行路线：** route effect 含 4 个 stops；专属动作把 step 从 0 推进到 1，翻页到 02 后路线层仍存在，证明它是跨页保留的旅程状态。
- **食谱步骤：** 连续完成 4 个步骤后，浏览器状态为 completed=4、ready=“可以上桌”，证明动作改变的是可完成的流程而非静态装饰。
- **漫画聚焦：** 连续触发得到三组不同 focus 坐标，聚焦框真实移动到不同分镜。
- **目录配色：** 专属动作把 accent 从 `#b75f4f` 切换为 `#2d79b7`；页面 SVG 数据随之变化（pageArtChanged=true），色板同时显示 3 个 swatches。
- **隔离与降级：** 切换场景后旧场景效果清理为 effect=0；reduced-motion 下动画时长为 `1e-06s`；`?fallback=1` 保留 2 个静态半页并禁用 8 个场景按钮。
- **跨表面证据：** 768px 和 390px 均无全页横向溢出；浏览器 console/page errors=[]。
- **结果：** 静态测试 14/14 通过。最终截图为 `browser-r4-travel-route.png`、`browser-r4-recipe-complete.png`、`browser-r4-catalog-colorway.png`、`browser-r4-mobile-comic.png`。
- **边界：** 本轮验证功能状态、降级与响应式布局，没有采集持续动画帧时、热量或功耗，因此不新增性能结论。

## 2026-08-31 · E9 实际效果优先的独立 Spatial Stage

- **用户纠偏：** 用户指出 Revision 2 仍像“技术拆分”，需要实际效果演示以及直接可玩的扩展效果。
- **基线观察：** 1440×1000 首屏以巨型研究标题、摘要和指标侧栏为主；主书页稿内容仍是“结构差异/十八段切线”。虽然功能存在，但信息层级把效果降成了报告里的实验组件。
- **结构改变：** 新增独立 `demo/` 入口。首屏只保留持续可见的主书、简短操作提示和右侧控制台；`showcase/` 作为“技术拆分”次级链接保留。
- **实际效果：** 四套原创视觉页稿（视觉画册、自然图鉴、产品发布、展览导览）在同一本 CSS 3D 主书运行；载入后自动执行一次 42% 左右的弯页预览，手动路径支持拖拽、点击、方向键、自动播放和独立观察镜。
- **扩展效果：** 曲面精度、纸张柔软度和曲面光照直接改变主书渲染模型；二维纸角在当前右页局部裁切并揭示下一页，而不是在独立卡片中模拟。
- **浏览器证据：** 主书翻页生成 18 strips；质量改为 9 后拖动生成 9 strips，根条带 computed transform 为有效 `matrix3d`；二维纸角 CSS 变量从 23% 调到 26%；观察镜包含 1 个主书克隆且键盘后位置改变；自动播放 pressed=`true`、`is-demoing=true`。
- **跨表面证据：** 1440、768、390 均无全页横向溢出；reduced-motion 等待 2.1 秒后 turn layer 为 0；`?fallback=1` 保留 2 个静态半页且动态控件 disabled；控制台/page errors 为空。
- **性能观察：** 本地 navigation duration 262ms，运行时资源 3 个，外部资源 0；该数据不代表移动端持续动画帧时。
- **失败与修复：** 第一轮验收脚本用 `[data-panel='extensions']` 同时匹配到 `<html>` 和扩展 section，触发 Playwright strict-mode violation。改为 `.deck-panel[data-panel='extensions']` 后重跑通过；这是验收选择器问题，不是产品运行错误。
- **结果：** 新增 3 个页面文件和 2 项结构回归测试；项目测试 12/12 通过。最终证据为 `browser-r3-demo-live.png`、`browser-r3-demo-extensions.png`、`browser-r3-demo-mobile.png`。

## 2026-08-30 · E6–E8 完整效果、场景 Demo 与扩展原型

- **目标：** 回应“网页中实现库效果、按场景构建演示、扩展场景也要演示”，把 Revision 1 的静态说明升级为可操作证据。
- **修订前基线：** 浏览器计数为主书 `1`、场景说明卡 `6`，但 `scenarioControls=0`、`extensionControls=0`；用户判断正确，后两部分只有文字，没有产品行为。
- **核心效果：** 保留 18 条嵌套曲面、正反面与逐带光照；放大镜改为独立 pointer capture 工具，并补齐键盘微调、指针视差、82–122% 缩放和六步自动演示。
- **场景 Demo：** 新增作品集、教学图鉴、产品发布、展览导览四套原创 SVG 页稿；每套均使用独立 12 条曲面链，并分别验证策展注记、移动观察镜、特性叠层和循环自动导览。
- **扩展原型：** 新增设备预算→8/12/18/24 条带映射、二维纸角 x/y 抓取，以及 SVG/DOM snapshot/component capture/Canvas texture 四类内容适配预览。
- **浏览器证据：** 主书点击时生成 18 strips，场景翻页生成 12 strips 且完成后页索引更新；35Hz 预算输出 8 strips；纸角方向键从 x20/y20 更新到 x23/y23；产品适配器输出 `Component capture`；展览自动导览从 01 运行到 03 后可暂停。
- **可访问与降级：** accessibility snapshot 能到达核心书、放大镜、四个场景 tab/action 和全部扩展输入；reduced-motion 下主/场景自动播放均不启动且手动翻页直接结算；`?fallback=1` 禁用所有动态输入并保留说明。
- **失败与修复：** 首次深色扩展截图中，插画适配器沿用了深色主题文字，落在浅色页稿上对比不足；为 illustration adapter 固定深墨文字与说明色后复验。
- **性能与网络：** 1440×1000 本地 TTFB 7.3ms、FCP/LCP 208ms、CLS 0；控制台为空；请求仅本地 HTML、CSS 和四个 ES module，没有第三方资源。
- **结果：** 10 项项目测试通过；1440、768、390 三档布局无全页横向溢出；Revision 2 浏览器范围通过，物理触控与实机持续性能继续有效延期。
- **证据：** `artifacts/browser-r2-core.png`、`browser-r2-scenarios.png`、`browser-r2-extensions-dark.png`、`browser-r2-mobile.png` 和更新后的 `browser-validation.md`。

## 2026-08-30 · E1–E5 独立重建与浏览器验收

- **目标：** 用网页直接比较刚性页与柔性条带，验证拖拽、质量档位、放大镜、跨视口和 fallback。
- **环境：** Windows；Node.js；Python 静态服务器；Chromium via agent-browser 0.27.0；1440×1000、768×900、390×844。
- **变更：** 新增零依赖 `showcase/`、纯几何模型、8 项测试、原创 SVG 页稿和浏览器证据。
- **执行：** `node --test projects/sketchbook-page-curl-study/tests/*.test.mjs`；`python -m http.server 4173 --directory projects/sketchbook-page-curl-study`；浏览器拖拽、键盘、主题、fallback、reduced-motion 和三档视口检查。
- **观察：** 长拖从第 1 页提交到第 2 页；短拖留在第 2 页并回弹；刚性模式为 2 面，24 条带模式为 48 面；方向键翻到第 3 页，Escape 关闭放大镜；三档视口无全页横向溢出。
- **失败与修复：** 第一张首屏截图显示研究链接与超大标题重叠，改为显式 Grid areas。第一张半翻截图只有“百叶窗”而没有跨书脊曲面；根因一是 CSS 角度变量用了展示字符 `°` 而不是 `deg`，二是负方向不应依赖 CSS 乘法。改为 JavaScript 输出带符号的 `deg` 变量，并增加 CSS 单位回归测试。
- **性能观察：** 24 条带本地加载 TTFB 1.4ms、FCP/LCP 44ms、CLS 0；控制台无错误，网络仅本地 HTML/CSS/JS 和 data SVG。该数据不代表动画帧时或移动端功耗。
- **能力边界：** `agent-browser set device "iPhone 13"` 因不支持该别名失败；改用 iPhone 15 后视口生效，但仍为 `maxTouchPoints=0`、hover pointer，无法作为真实触屏证据。
- **证据：** `artifacts/browser-*.png`、`artifacts/browser-validation.md`、测试输出。
- **判断：** E1–E5 在桌面 Chromium 与响应式布局范围内通过；物理触控和移动端持续帧时有效延期。
- **下一步：** 在真实 iOS/Android 上复验 Pointer capture 与帧时，再决定是否进入统一渲染器抽象。

## 2026-08-30 · E1 固定上游获取

- **目标：** 确认研究对象可由脚本精确重建。
- **执行：** `powershell -ExecutionPolicy Bypass -File projects/sketchbook-page-curl-study/scripts/fetch-upstream.ps1`。
- **观察：** ignored 工作副本 HEAD 为 `c1e477814c4c9e204452ebf9b298aa13629cbfc2`。
- **判断：** 通过；第三方文件未进入本仓库跟踪范围。

## 2026-08-30 · E0 静态基线与既有研究纠偏

- **目标：** 确认上游真正的核心能力，并校正“我们以前实现过放大镜”的错误记忆。
- **环境：** Windows / Git / Node.js；上游 commit `c1e477814c4c9e204452ebf9b298aa13629cbfc2`。
- **变更：** 无；只读检查上游和内部 `matthewyu-effect-lab`。
- **执行：** 检查上游 `README.md`、`index.html`、资产清单和 Git 历史；运行既有基线测试。
- **观察：** 上游核心使用 18 条嵌套竖条构造柔性曲率；放大镜通过克隆书本 DOM 独立实现。既有项目使用左右半页和一个刚性临时 flap，40/40 测试通过，没有放大镜。
- **证据：** 固定提交链接；内部基线 commit `7137e9f`；本项目后续 `artifacts/source-analysis.md`。
- **判断：** 用户记忆正确：旧研究是刚性翻页；Sketchbook 的新知识主要是柔性条带链，放大镜属于额外增强。
- **下一步：** 建立独立的双模式实验台，令差异可直接操纵和观察。

## 2026-08-30 · E0a 上游来源与许可证边界

- **目标：** 判断能否直接复制上游源码和视觉资产到公开研究页面。
- **环境：** 同上。
- **执行：** 搜索仓库根目录与历史快照中的许可证声明；对照 README 与源码注释的图片来源表述。
- **观察：** 未发现标准许可证文件；README 仅写 educational use。README 将画稿归因于 GPT Image 2，源码注释写 Higgsfield。
- **判断：** 证据不足以支持复制或再分发，也不足以判断画稿的真实生成来源。本研究采用固定获取脚本 + ignored 工作副本 + 完全独立实现。
- **下一步：** 所有公开网页资产与代码从零编写，并在页面中公开标注该边界。
