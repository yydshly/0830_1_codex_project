# Sketchbook 柔性翻页实际效果展厅 · Coverage manifest · Revision 7

状态词仅使用：`continue`、`pass`、`defer`、`blocked`。下表是 Revision 7 的活动范围；Revision 6 及更早证据保留在后表，仅作为未受影响基线。

## Revision 7 active coverage

| 用户阶段 | 要求或产物 | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 第一：覆盖盘点 | 区分 10/10 已实现创意书型与 0/8 独立非书 renderer，不把邻近机制算完成 | docs / baseline | 源码映射、线上浏览器五入口/18 form/0 surface 证据 | Stage 0/1 | pass | 已闭合 |
| 第二：核心非书形态 | 标签剥离、双向幕布、折叠地图拥有独立条带/铰链 renderer | surfaces / progress | 标签 14 strips/28 faces；幕布 20 strips；地图 8 panels + route + 5 stops；逐项 transform 改变 | Stage 3/5/6 | pass | 已闭合 |
| 第二：其余原描述 | 对比百叶、时间轴、材质墙、包装盒、portal 均在中央舞台实际运行 | surfaces / progress/step | 18 slats、7 events、8 samples、6 box panels、6 portal frames | Stage 3/5/6 | pass | 已闭合 |
| 第三：更多扩展 | 卷轴海报、径向扇、撕取券、数据丝带拥有不同拓扑与释放行为 | surfaces / action | 12 bands/24 faces、10 wedges、16 holes + detached、8 nodes/7 segments | Stage 3/5/6 | pass | 已闭合 |
| 第四：正交组合 | 8 内容上下文 × 12 surface × 5 material 独立选择且互不重置 | surface controls / URL | context/surface/material 数据集与 URL 分别同步；cycle 刷新 step 保真；480 为可寻址空间 | Stage 4/5/6 | pass | 已闭合 |
| 第四：统一操作 | 中央拖动、range、主动作、左右导航、键盘、Escape 驱动 12 项 | pointer/range/action/nav/key | 具名方向手势、progress/step/detached/status/transform、radio roving tabindex 与退出清理均通过 | Stage 4/5/6 | pass | 已闭合 |
| 第四：材质边界 | paper/card/vellum/textile/foil 实际改变表面变量与外观，物理边界诚实 | material / five presets | 12 项各有 5 个不同舞台截图哈希；computed vars/data-material/边界文案完整 | Stage 3/6 | pass | 已闭合 |
| 第五：跨表面 | 1440/768/390、键盘、reduced-motion、fallback、直达 URL 保持可达可解释 | viewport/input/motion/capability | 三档 overflow=false；cycle reload 保真；reduce=`1e-06s`；fallback static/action-range disabled | Stage 7/8 | pass | 已闭合 |
| Performance | 12 renderer 与材质不引入外部资源或明显加载退化 | 1440px runtime | 8 local/0 external、decoded≈387KB、DOM=478、navigation≈235ms、errors=[] | Stage 8 | pass | 已闭合 |
| 研究记录与边界 | README、日志、根索引解释从翻页到通用表面及 CSS/WebGL 边界 | project/root docs | README/E14/contract/validation/handoff 均明确独立实现与布料/材质/portal 边界 | Stage 9 | pass | 已闭合 |
| 工程与交付 | 自动测试、浏览器证据、handoff、GitHub Pages 完整 | Node/repository/browser/pages | tests、validator、≤6 张最终证据、Actions/HTTP、无 continue | Stage 9 | continue | 完成测试后发布 |

## Revision 6 retained baseline

| 用户阶段 | 要求或产物 | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 第一：更多真实形态 | 书型面板从 10 扩展到 18，新增选项拥有独立 renderer | forms / selection | buttons=18、surface data-form 与直属结构逐项变化 | Stage 3/4/5 | pass | 已闭合 |
| 第一：组合与机关 | 分栏组合、拉条联动、虹膜快门、瀑布翻片产生不同连续/离散状态 | mixmatch/pulltab/iris/waterfall | 3 bands、3 linked classes、8 blades、6 cards 及 transform 差异 | Stage 5/6 | pass | 已闭合 |
| 第一：拓扑与视角 | 百叶交错、双首背靠背、雅各布梯、万花折面产生不同轮廓与隐藏面 | venetian/dosados/jacob/flexagon | slats≥16、two entries、boards≥6、triangles≥6/face group=3 | Stage 5/6 | pass | 已闭合 |
| 第一：统一操作 | 八种新增形态均支持主动作；连续形态支持拖动/range；左右导航和键盘可比较 18 项 | pointer/range/action/nav/key | state/output/transform 改变，18→classic 状态清理 | Stage 4/5/6 | pass | 已闭合 |
| 第二：创意图谱 | 新增六轴 36 方向与 LIVE/REMIX/HORIZON 分层 | explore / filters | axes=6、directions=36、ID 唯一、层级计数与筛选一致 | Stage 3/4/5 | pass | 已闭合 |
| 第二：详细探索 | 单项详情显示结构、动作、场景、机制、风险、层级、组合与下一步 | selected direction | 九个字段非空；选择后标题/详情/状态同步 | Stage 3/4/5 | pass | 已闭合 |
| 第二：图谱回舞台 | 有映射的 LIVE 方向可一键打开对应真实书型；其他层级不冒充实作 | direction→form | target form 正确、panel=forms、book surface 更新；非 LIVE 无伪动作 | Stage 4/5/6 | pass | 已闭合 |
| 第三：组合场景 | 至少 12 个跨轴组合场景说明问题、组合机制与首要风险 | combinations / selection | cards/items≥12、三项说明完整 | Stage 3/5 | pass | 已闭合 |
| 第三：跨表面 | 1440/768/390、键盘、reduced-motion、fallback 与直达 URL 保持可达和可解释 | viewport/input/motion/capability | overflow=false；focus path；fallback static；deep-link stable | Stage 7/8 | pass | 已闭合 |
| Performance | 18 renderer + 36 data 不引入外部资源或明显加载退化 | 1440px runtime | resource count、DOM count、navigation、errors=[] | Stage 8 | pass | 已闭合 |
| 研究记录与边界 | README、日志、根索引记录六轴地图、18 实作、成熟度边界与许可证 | project/root docs | 独立扩展不归因上游；失败实验可追溯 | Stage 9 | pass | 已闭合 |
| 工程与交付 | 自动测试、浏览器证据和 handoff 完整 | Node/repository/docs | tests、validator、≤6 张最终证据、无 continue | Stage 9 | pass | 已闭合 |
| 公开发布 | 根 README 摘要、固定源库、GitHub 研究目录、Pages 研究页/Demo/showcase/深链均可追溯 | GitHub / Pages / Chromium | R-001 元数据测试；Actions build+deploy success；5 个公开入口 HTTP 200；深链选中虹膜快门且 errors=[] | Stage 9 | pass | 已闭合 |

## Revision 5 retained baseline

| 用户阶段 | 要求或产物 | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 第一：书型独立维度 | 顶部新增“书型”入口，控制台紧凑展示 10 种具名书型 | forms panel / selected | DOM count=10、互斥选中、中央直属 renderer 改变 | Stage 3/4/5 | pass | 已闭合 |
| 第二：10 种实际形态 | 对开门双门与手风琴 6 折面具有不同连续几何 | gatefold / accordion 0–100% | 双门角度、accordion panels=6 与交替 transform | Stage 5/6 | pass | 已闭合 |
| 第二：10 种实际形态 | 立体书纸构升起，镂空窗口揭示下层 | popup / diecut 0–100% | popup pieces≥2 transform 改变；mask radius 改变 | Stage 5/6 | pass | 已闭合 |
| 第二：10 种实际形态 | 透明叠层逐层加入，隧道书形成四层纵深 | layers / tunnel step/progress | vellum layers=3 与 active 数；tunnel frames≥4/translateZ | Stage 5/6 | pass | 已闭合 |
| 第二：10 种实际形态 | 轮盘可转区段，翻动画册可推进至少 8 帧 | volvelle / flipbook cycle/play | wheel transform/segment；frame index 随播放改变 | Stage 5/6 | pass | 已闭合 |
| 第二：10 种实际形态 | 星形书展开 6 叶，无限书在六态间首尾循环 | carousel / infinite open/cycle | leaves=6/transform；loop step 0→5→0 | Stage 5/6 | pass | 已闭合 |
| 第三：统一操作 | 中央拖动、range、主动作、左右导航和键盘均改变实际书体 | pointer/range/button/keyboard | 各触发后的 progress/step 与 computed transform | Stage 4/5/6 | pass | 已闭合 |
| 第三：状态隔离 | 切书型停止旧 timer 并清空旧节点；退出书型恢复传统柔性书 | switch/exit/recovery | flipbook timer off、renderer 1、返回后 halves=2/turn strips=18 | Stage 5/6 | pass | 已闭合 |
| 第三：跨表面 | 1440/768/390、reduced-motion、fallback 下可辨认且无横溢 | viewport/input/motion/capability | 三档 overflow=false；reduce 单帧；fallback 静态终态/disabled | Stage 7/8 | pass | 已闭合 |
| Performance | 十种 CSS/SVG 书型不增加外部资源或明显加载退化 | 1440px runtime | local resources、navigation、errors=[] | Stage 8 | pass | 已闭合 |
| 研究记录与边界 | README、研究日志和根索引记录十种书型、统一控制、CSS/DOM 3D 原理、降级与许可证边界 | project/root docs | E11 可追溯；不把独立扩展归因给上游；不新增无证据的性能结论 | Stage 9 | pass | 已闭合 |
| 工程与交付 | 自动测试、README、日志、证据与 handoff 完整 | Node/repository/docs | tests、validator、≤6 张最终证据、无 continue | Stage 9 | pass | 已闭合 |

## Revision 4 retained baseline

| 用户阶段 | 要求或产物 | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 第二：更多扩展场景 | 场景面板分组展示 4 个基础场景与 4 个扩展场景，八套内容均替换主书完整页稿 | scenes panel / selection | 浏览器计数 base=4、extended=4、all=8；扩展场景各有 4 页原创 data SVG | Stage 3/4/5 | pass | 已闭合 |
| 第二：更多扩展场景 | 旅行手账显示路线、4 个站点并逐次改变当前站点 | travel / action cycle | effect=`route`、stops=4、step 0→1、翻页到 02 后 effect=1 | Stage 5/6 | pass | 已闭合 |
| 第二：更多扩展场景 | 食谱显示步骤轨道、逐步完成并到达“可以上桌” | recipe / ordered state | steps=4、finalStep=4、completed=4、ready=`可以上桌` | Stage 5/6 | pass | 已闭合 |
| 第二：更多扩展场景 | 漫画用暗幕窗口依次聚焦至少 3 个不同画格 | comic / focus cycle | 三态 `7/16/37/34`、`55/12/36/30`、`49/52/43/34` 坐标互异 | Stage 5/6 | pass | 已闭合 |
| 第二：更多扩展场景 | 商品图册循环 3 套配色并重生成当前 SVG 页稿 | catalog / palette cycle | accent `#b75f4f`→`#2d79b7`、background-image 改变、swatches=3/active=1 | Stage 5/6 | pass | 已闭合 |
| 第三：扩展共存 | 专属效果启用后主书仍可翻页，切场景时旧效果状态清理 | active effect / turn / switch | travel 翻页后层保留；切 portfolio 后直属 effect=0、action pressed=false | Stage 5/6 | pass | 已闭合 |
| 第三：跨表面 | 新场景在 1440/768/390、键盘、reduced-motion、fallback 下保持边界 | desktop/tablet/mobile/input/capability | 键盘 Enter 选择；390/768 overflow=false；reduce route=1e-06s；fallback 8 按钮 disabled、2 halves | Stage 7/8 | pass | 已闭合 |
| 工程与交付 | 更新自动测试、README、日志、浏览器证据与 handoff | Node/repository/docs | `node --check`、14/14 项目测试、repository validator、4 张 Revision 4 证据均通过 | Stage 9 | pass | 已闭合 |

## Revision 3 retained baseline

| 用户阶段 | 要求或产物 | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 第一：实际效果演示 | 新 demo 首屏以可翻曲面书为视觉中心，不出现研究报告式主标题和指标墙 | 1440px idle/intro | `browser-r3-demo-live.png`：935px 主书占据主体，默认弯页 | Stage 2/3 | pass | 已闭合 |
| 第一：实际效果演示 | 主书拖动/点击/键盘产生实际 18 条曲面、正反面和逐带光照 | drag/commit/cancel/keyboard | trusted mouse drag→18 strips；mid-turn screenshot | Stage 4/5/6 | pass | 已闭合 |
| 第一：实际效果演示 | 放大镜可开关和独立拖动，自动演示可播放/暂停 | loupe pointer/keyboard、auto | clone=1、键盘后 transform 改变；auto pressed=true | Stage 4/5/6 | pass | 已闭合 |
| 第一：实际效果演示 | 四套场景内容直接替换主书完整页稿 | portfolio/atlas/launch/kiosk | atlas stage/title/page reset；四套 data SVG | Stage 3/5/6 | pass | 已闭合 |
| 第二：扩展效果演示 | 条带质量改变实际曲面 strip 数 | 8–24 during turn | quality=9→DOM strips=9 | Stage 4/5/6 | pass | 已闭合 |
| 第二：扩展效果演示 | 柔软度与光照强度改变实际曲率和逐带明暗 | soft/firm、light range | range→peakCurl/light→当前 turn 角度与 shade/glow 重算 | Stage 4/5/6 | pass | 已闭合 |
| 第二：扩展效果演示 | 二维纸角直接作用于当前右页并揭示下一页 | corner on/drag/reset | corner-page=1；--corner-x 23%→26%；最终截图 | Stage 4/5/6 | pass | 已闭合 |
| 信息架构 | demo 只保留效果操作；技术研究页为次级链接 | top nav、research link | demo→showcase link；README 双入口 | Stage 3 | pass | 已闭合 |
| 视口与语义 | 1440/768/390 无溢出，主路径键盘可达且焦点可见 | desktop/tablet/mobile | 三档 overflow=false；方向键/原生 inputs/visible focus | Stage 7 | pass | 已闭合 |
| Motion/fallback | reduced-motion 不自动播放；无 3D 时保留静态双页 | media/fallback | reduced turn=0；fallback halves=2、auto disabled | Stage 7/8 | pass | 已闭合 |
| Performance | 零外部运行时资源且主舞台加载无明显退化 | 1440px | navigation 262ms、3 local resources、0 external、errors=[] | Stage 8 | pass | 已闭合 |
| 工程与交付 | 更新测试、README、日志、验收和 handoff | Node/repository | 12 项测试、validator、3 张最终证据 | Stage 9 | pass | 已闭合 |

## Revision 2 retained baseline

| 用户阶段 | 要求或产物 | Surface / state | Evidence | Status |
| --- | --- | --- | --- | --- |
| 研究基线 | 固定上游、许可证边界和既有刚性对照保持可信 | 获取脚本、source analysis | commit、文件与既有测试 | pass |
| 第一：实现库的效果 | 柔性条带呈现连续曲率、正反面和逐带光照 | 1440px、drag/commit/cancel | 18 个浏览器条带、结算状态、既有半翻截图 | pass |
| 第一：实现库的效果 | 放大镜可独立拖动并在翻页时保持观察位置 | on/off、pointer/keyboard、turn | 可聚焦 group、位置 transform 变化、核心截图 | pass |
| 第一：实现库的效果 | 书本有指针视差、缩放和一键自动演示 | pointer、82–122% zoom、auto demo、reset | CSS view vars、按钮状态、自动翻页 | pass |
| 第一：实现库的效果 | 原创页稿形成完整画册体验 | 四页研究画册、两主题 | 原创 data SVG、light/dark 浏览器截图 | pass |
| 第二：场景演示 | 作品集具有独立页稿、柔性翻页和策展注记 | portfolio selected/turn/curated | 12 条曲面链、页索引、overlay 状态 | pass |
| 第二：场景演示 | 教学图鉴具有翻页与移动观察镜 | atlas selected/inspect | lens 位置随指针改变、aria 状态 | pass |
| 第二：场景演示 | 产品发布具有章节翻页和特性展开 | launch selected/reveal | feature overlay 与按钮状态 | pass |
| 第二：场景演示 | 展览导览具有自动播放和暂停/恢复 | kiosk selected/playing/paused | 计时后页索引从 01 到 03、接管暂停 | pass |
| 第三：扩展演示 | 自适应预算映射条带数并可视化 | slider 30–120Hz | 35Hz→8 strips；四档纯函数测试 | pass |
| 第三：扩展演示 | 二维纸角可改变 x/y 折角 | pointer/keyboard/reset | Arrow 后 x20/y20→x23/y23、CSS vars | pass |
| 第三：扩展演示 | 内容适配器切换插画/文章/产品/数据 | four adapters | product→Component capture、预览类型变化 | pass |
| 信息解释 | 原理、场景边界、路线、意义和证据仍完整 | 文档流 | accessibility snapshot 阅读顺序 | pass |
| 主题 | 新增场景与原型在 light→dark→light 可读 | 两主题、selected/disabled | `browser-r2-scenarios.png`、`browser-r2-extensions-dark.png` | pass |
| 视口 | 新增舞台和原型在 1440、768、390px 无全页溢出 | desktop/tablet/mobile | 1425/753/375 layout width 均无横向溢出 | pass |
| 键盘与语义 | 核心书、tabs/actions、扩展 inputs 可达且焦点可见 | Tab/Enter/Arrow/Escape | accessibility snapshot、方向键路径 | pass |
| 触控 | 核心、放大镜与纸角在真实 coarse pointer 上可抓取且不阻碍滚动 | iOS/Android 实机 | 当前浏览器设备预设仍 `maxTouchPoints=0` | defer |
| Motion | reduced-motion 下自动演示停用、翻页直接结算 | emulated preference | main auto=false、scene playing=false、page 直接到 02 | pass |
| Fallback | `?fallback=1` 保留静态说明并禁用动态输入 | fallback | main/scene/quality/adapter controls 均 disabled | pass |
| Performance | 多舞台不引入外部资源或明显首屏退化 | 1440px、four scenarios | TTFB 7.3ms、FCP/LCP 208ms、CLS 0、console 空 | pass |
| 实机性能 | 移动设备持续帧时、热与功耗 | iOS/Android 实机 | 当前无真实设备 | defer |
| 工程 | 纯函数、结构测试和仓库 validator | Node、HTTP | 10 项项目测试及 repository validator | pass |
| 交付 | Revision 2 浏览器验收、日志和 handoff | docs/artifacts | 本 manifest 与交付记录 | pass |

有效延期的重测条件：获得可派发 trusted touch 的 iOS/Android 实机后，以 24 条带连续操作 30 秒，复验 pointer capture、滚动竞争、帧时、热与功耗。
