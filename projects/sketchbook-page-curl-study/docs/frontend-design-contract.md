# Sketchbook 柔性翻页与可变表面研究展厅 · 前端设计契约

## Contract

| 字段 | 决策 |
| --- | --- |
| Entry mode | Revision-led implementation：Revision 6 已完成 18 种书型与 36 方向图谱；用户指出“书只是包装”，要求核对并继续扩展真正的非书可变形表面 |
| Request revision | 7 |
| Target user and context | 想快速判断该效果能做什么、如何实现、何时值得采用的前端开发者、交互设计师与创意技术人员 |
| Desired first impression | 第一眼仍是可操作的中央物体；“可变表面”入口直接显示标签、幕布、地图、包装与传送门等非书对象，用户无需把它们理解成书型别名 |
| Visual ambition | Immersive |
| Experience architecture | Spatial Stage（独立 demo 入口）+ 次级研究报告入口 |
| Visual constraints | 保留核心柔性翻页、18 书型、36 方向与 Spatial Stage；新增表面使用原创 HTML/CSS/SVG、3D transform、mask 与渐变构造独立轮廓；不得用换标题、静态截图或书本外框冒充非书 renderer；零外部字体、图片、Canvas 或 WebGL |
| Information constraints | 表面选择器先呈现实际几何，详情再说明锚点、切片、形变、拓扑、释放方式、场景和技术边界；明确区分 CSS 3D 条带近似与布料/WebGL 物理，不把 portal 过渡冒充真实三维场景连续性 |
| Operation constraints | 新增“可变表面 12”面板：8 个用户列举形态 + 4 个新增形态；内容上下文、surface、material 三项独立选择；中央对象、拖动、滑杆、专属动作、左右导航和键盘共同驱动真实几何 |
| State constraints | 保留既有状态并新增 surface/material/surfaceProgress/surfaceStep/surfaceTurn；表面切换必须清理拖动和旧节点；内容上下文与材质不重置几何选择；URL 可固定 panel/surface/material/scene/progress 以便验收与分享 |
| Environment constraints | 项目内零依赖静态 HTML/CSS/ES modules；兼容 GitHub Pages；本地通过 `python -m http.server` 或等价静态服务运行 |
| Primary journey | 打开 demo → 进入“可变表面 12” → 选择内容上下文、非书表面与材质 → 在中央对象直接拖动/吸附/循环 → 用详情理解锚点、切片、拓扑与边界 → 深链分享当前组合 → 返回既有书型/图谱不回归 |
| User-defined phases | 第一：诚实盘点描述项是否真正 LIVE；第二：把标签、地图、幕布、百叶、时间轴、材质墙、包装盒、传送门做成独立表面；第三：追加卷轴海报、径向扇、撕取券、数据丝带；第四：拆分内容/几何/材质并接入统一控制；第五：跨视口、键盘、reduced-motion、fallback、测试和发布闭环 |
| Required artifacts | `demo/` 12 种原创非书 renderer、5 种材质预设、8 个内容上下文、surface 深链与真实状态反馈、更新后的设计/覆盖/测试/README/研究记录，以及桌面/390px/关键表面的浏览器证据 |
| Autonomy authorization | 用户在连续实现语境中明确指出“也可以更多扩展”；结合此前“网页中实现效果、根据场景构建演示、扩展场景也要演示”的授权，允许当前子项目内可逆实现、测试、文档、提交与既有 GitHub Pages 发布 |
| User-decision boundary | 不重新分发无许可证的上游源码/素材，不修改上游仓库，不调用付费服务；不把 CSS 视觉材质称为真实物理，不把无自碰撞的幕布称为布料仿真，不把 CSS portal 称为 WebGL 场景连续穿越 |
| Observable completion criteria | Revision 2–6 已通过标准继续有效；Revision 7 追加 16 条通用可变表面标准 |
| Coverage record | `docs/frontend-coverage.md` |

## Revision 7 baseline and scope correction

- **2026-08-31 browser baseline:** 线上 `?rev=6&panel=forms&form=venetian&intro=0` 在 1440×1000 Chromium 中显示五个顶部入口、18 个书型和 `data-form=venetian`，但没有 `surface` 入口或 `data-surface` 控件；全页无横向溢出且 errors=[]。
- **Truthful coverage:** 用户列举的 10 种创意书型 10/10 为真实 renderer；用户列举的 8 种非书形态按“独立具名非书 renderer”严格计为 0/8。百叶、手风琴、纸角和隧道只提供邻近机制，不能替代独立表面。
- **Combination gap:** 现状是“8 场景传统跨页 / 18 固定内容书型 / 参数扩展”三套互斥展示，不是可自由组合的 `scene × geometry × material`。Revision 7 的 surface API 必须把内容、几何与材质分离。

## Revision 7 spatial-stage boundary

- **Preserved operating surface:** 中央 Spatial Stage 保持第一焦点；新增顶部“可变表面 12”，不把 12 项放成舞台外的说明卡。
- **Twelve live surfaces:** 标签剥离、折叠地图、双向条带幕布、对比百叶屏、手风琴时间轴、材质样本墙、包装盒展开、层叠传送门、卷轴海报、径向样本扇、撕取优惠券和数据丝带全部拥有独立 DOM 轮廓与状态映射。
- **Orthogonal choices:** 8 个既有场景作为内容上下文；12 个表面负责拓扑与形变；paper/card/vellum/textile/foil 五个材质预设负责可见厚度、透明度、纹理、反射与曲率响应。材质是 CSS 视觉/力学近似，不是物理仿真。
- **Shared strip capability:** 标签、幕布与卷轴复用一套条带链创建与逐带曲率/光照逻辑；地图/时间轴使用多铰链；百叶使用独立双面叶片；包装盒使用六面铰接拓扑；portal 使用六层空间框与双场景阈值过渡。
- **Foreground controls:** surface、内容和材质互不重置；中央拖动与 range 使用连续进度，主动作处理吸附/循环/释放，左右导航比较 12 项，Escape 复位。
- **Truthful capability boundary:** `textile` 仅表达织物视觉和低刚度；幕布不模拟连续布料、自碰撞或任意褶皱；portal 只验证 CSS 空间阈值和背面场景揭示；真实穿越、任意方向形变与碰撞留给 WebGL 网格/物理。
- **Mobile/fallback:** 390px 仍先显示完整对象；选择器可局部滚动/紧凑网格但页面不横溢；fallback 显示每个对象可理解的静态终态并禁用动态控制；reduced-motion 不连续播放。

## Revision 7 observable completion criteria

1. 顶部出现“可变表面 12”，选择任一项都在中央舞台生成独立 `data-surface` 根节点，不复用书本外框。
2. 标签剥离至少包含 12 条双面条带、角点 grip、底层内容与 attached/snapped/detached 状态；进度改变真实 transform 和揭示面积。
3. 双向幕布至少有左右各 10 条镜像条带，进度同时改变中心 gap、条带曲率和底层舞台可见度。
4. 折叠地图至少有 8 个山/谷交替面及跨面路线/站点；手风琴时间轴至少有 7 个事件折面且当前事件随 step 改变。
5. 对比百叶至少有 18 条双面叶片；材质样本墙至少显示 8 个具有不同可见纹理/高光的样本。
6. 包装盒至少有 6 个铰接面并从立体盒体展开为十字 net；层叠传送门至少有 6 个空间框层并在阈值后显示第二场景。
7. 卷轴海报至少有 12 条横向带并从边缘卷起；径向扇至少有 10 个扇片；撕取券具备穿孔、释放与 detached 状态；数据丝带至少有 8 个路径节点。
8. 内容上下文、surface 和 material 是三个独立控件；改变任一项不重置另外两项，当前组合进入 URL 与状态输出。
9. 五种材质预设实际改变 CSS 变量/属性和可见外观；textile/foil 的文案明确属于视觉近似而非真实物理。
10. 12 种表面均支持主动作和状态文本；连续形态支持中央拖动与 range；cycle 形态支持离散 step；释放行为具体说明回弹、吸附、循环或脱离。
11. `?rev=7&panel=surfaces&surface=...&material=...&scene=...&progress=...&intro=0` 可复现当前组合。
12. 切换表面、退出面板、resize、Escape 和 pagehide 不残留旧节点、拖动或播放状态；既有传统翻页、8 场景、18 书型与 36 图谱不回归。
13. 1440、768、390 三档无全页横向溢出；选择器、材质、滑杆和动作键盘可达且焦点可见。
14. reduced-motion 不运行连续动画；fallback 保留可辨认终态和边界文案，并禁用不可用动态控件。
15. 12 个 renderer 的几何计数、状态映射、clamp、材质、深链和结构固化为自动测试；真实浏览器无 console/page/request error。
16. README、研究日志、coverage、handoff、项目测试与 repository validator 更新；最终无 `continue`，发布后 GitHub Pages 在线深链通过。

## Revision 6 spatial-stage boundary

- **Preserved operating surface:** 中央舞台仍是第一焦点；图谱是为模型选择、解释和组合服务的控制面，不把页面退回“技术拆分卡片墙”。
- **Eighteen live forms:** 保留 Gatefold、Accordion、Pop-up、Die-cut、Transparent layers、Tunnel、Volvelle、Flipbook、Carousel、Infinite；新增 Mix-and-match、Pull-tab、Iris、Waterfall、Venetian、Dos-à-dos、Jacob’s ladder、Flexagon。每种新增形态都使用独立 DOM 轮廓和状态映射。
- **Six exploration axes:** 阅读拓扑与装订、纸上机械、材料与显影、组合叙事、身体与环境、数据与生成；每轴六项，共 36 项。
- **Truthful maturity:** `LIVE` 表示页面内有真实可操作原型；`REMIX` 表示可在当前架构做可信模拟；`HORIZON` 表示需要摄像头、传感器、多人系统、实时服务或 WebGL 的远期方向。筛选和详情始终显示该标签。
- **Progressive disclosure:** 默认只显示轴、名称、层级与一句核心命题；选中后才展开结构、动作、适用场景、技术机制、最大风险和组合建议。详情区必须保持单一选中状态。
- **Atlas-to-stage linkage:** 至少八个新 LIVE 方向可从图谱直接切到中央书型并立即操作；既有 LIVE 方向也可映射到最接近的实作。REMIX/HORIZON 不使用“查看实作”措辞。
- **State-to-scene mapping:** 分栏书把三条页面序列组合；拉条同时驱动外壳、齿轮与能量路径；虹膜使八叶连续开合；瀑布页按阈值逐张翻落；百叶在 A/B 图间交错；双首书整本翻面；雅各布梯传播翻转波；万花折面切换隐藏面组。
- **Cross-surface:** 1440/768/390 下中央舞台先于图谱详情；窄屏的轴、层级和方向列表允许横向局部滚动或紧凑网格，但页面本身不得横向溢出。键盘、reduced-motion 与 fallback 均保留可解释状态。

## Revision 6 observable completion criteria

1. “书型”显示 18 个具名选项，新增八项选择后中央舞台直属结构、轮廓和状态映射均实际改变。
2. 分栏组合书至少有三条独立视觉页带并报告组合编号；主动作循环出不同组合。
3. 拉条联动书一次进度同时改变至少三类部件（位移、旋转、遮罩/路径）。
4. 虹膜快门至少有八片交叠叶片，进度连续改变孔径；中心内容不是单纯 opacity 切换。
5. 瀑布翻片至少有六张阶梯卡，随着进度/步骤依次翻落；百叶书至少有 16 条奇偶反向条片。
6. 双首背靠背书翻面时入口、标题和方向一起改变；雅各布梯至少六块板片按延迟传播翻转。
7. 万花折面至少六个三角单元、三组隐藏面；每次动作显示此前不可见的一组内容。
8. 新增书型均支持专属动作；适合连续几何的形态支持中央拖动和滑杆；状态文本具体说明当前组合、孔径、翻片、视角或面组。
9. 顶部新增“创意图谱”，呈现六轴、36 个唯一方向，LIVE/REMIX/HORIZON 数量可检验且筛选结果正确。
10. 每个方向详情完整展示中文名、英文名、核心结构、主要动作、适用场景、技术机制、最大风险、成熟度和至少一个可组合方向。
11. 所有有实际映射的 LIVE 方向提供“在舞台查看”并正确选中对应书型；未实作方向明确显示下一步验证条件，不伪装成已实现。
12. 至少展示 12 个跨轴组合场景，并说明它解决的问题、组合机制和应先验证的风险。
13. 1440px、768px、390px、键盘、reduced-motion、`?fallback=1` 和可直达 URL 下可辨认、可达且无全页横向溢出；旧 10 书型与传统柔性跨页不回归。
14. 新增数据与状态固化为自动测试；真实浏览器无 page/console error；项目测试和 repository validator 通过；coverage 最终无 `continue`。

## Revision 5 spatial-stage boundary

- **Scene base:** 同一个 `.book` 舞台按 `form renderer` 重建语义 DOM；传统柔性书继续使用 18 条 CSS 3D 链，创意书型使用独立的 CSS 3D、SVG、mask 与分层表面。
- **Form dimension:** 场景负责“书里讲什么”，书型负责“书本如何存在”，材质控制继续负责纸面表现。进入书型面板时只切换几何维度；离开书型面板恢复传统柔性书，避免无效控制混杂。
- **Ten forms:** Gatefold、Accordion、Pop-up、Die-cut、Transparent layers、Tunnel book、Volvelle、Flipbook、Carousel/Star、Infinite loop 全部拥有不同的 DOM 轮廓和状态映射。
- **Foreground controls:** 10 项紧凑书型选择、一个随书型变化的主动作、一个连续进度滑杆；中央书体本身支持水平拖动，左右导航用于比较相邻书型。
- **State-to-scene mapping:** 对开门改变双门角度；手风琴改变交替折面；立体书抬升纸构；镂空扩大窗口；透明书逐层叠加；隧道拉开纵深；轮盘旋转内盘；翻动画册推进帧；星形书展开叶片；无限书循环页序。
- **Motion and recovery:** 选择新书型必须停止翻动画册计时器、释放拖动并重置进度/步骤；Escape 复位当前书型。reduced-motion 下所有状态即时结算，翻动画册只推进单帧。
- **Mobile transformation:** 390px 下仍先显示完整书体，书型选择采用紧凑两列网格，操作区在其下；任何展开形态不得造成全页横向溢出。
- **Fallback:** 无 3D 时展示每种书型的可读静态终态，禁用连续动作；传统 demo 的静态双页 fallback 保持不变。

## Revision 5 observable completion criteria

1. 顶部新增“书型”入口，控制台显示 10 个具名书型；选择后中央舞台的直属 DOM 结构与轮廓实际改变。
2. 对开门书含左右两扇独立门页，并可从闭合连续拖到打开。
3. 手风琴书至少含 6 个交替折面，进度改变各面旋转角而不是只缩放整图。
4. 立体书至少有两个纸构随进度从页面平躺抬升。
5. 镂空书的窗口尺寸随进度改变并真实揭示下层内容；透明叠层书至少可推进 3 个独立半透明层。
6. 隧道书至少包含 4 个具有不同 `translateZ`/缩放状态的框层；轮盘书的内盘可旋转并报告当前区段。
7. 翻动画册可播放/暂停并推进至少 8 帧；reduced-motion 下不连续播放但可单帧推进。
8. 星形/旋转木马书至少展开 6 个叶片；无限循环书至少在 4 个页面状态间首尾循环。
9. 所有书型都支持面板动作；适合连续几何的书型还支持中央书体拖动和进度滑杆。
10. 左右导航可在 10 种书型间移动；切换书型或退出书型面板时旧计时器、旧节点与旧状态不残留，传统柔性翻页恢复可用。
11. 1440px、768px、390px、键盘、reduced-motion 与 `?fallback=1&panel=forms` 下书型可辨认、控制可达且无全页横向溢出。
12. 新增结构与状态固化成自动测试，真实浏览器无 page/console error，项目测试和 repository validator 通过，coverage 无 `continue`。

## Revision 4 spatial-stage boundary

- **Preserved anchor:** 18 条 CSS 3D 柔性页、拖拽/点击/键盘翻页、观察镜、自动翻页、几何控制和二维纸角保持为同一主书能力。
- **Scene grouping:** 场景控制台明确分为“四个基础场景”和“四个扩展场景”，不把新增用途混成技术说明或独立卡片墙。
- **Effect layer:** 扩展行为统一挂载在主书上方的语义效果层，但各自拥有不同状态模型：旅行是热点选择、食谱是有终点的步骤状态机、漫画是空间焦点坐标、商品图册是 SVG 内容与主题变量重生成。
- **State-to-scene mapping:** 旅行显示路线并逐站高亮；食谱显示步骤轨道并推进完成态；漫画以暗幕窗口依次聚焦画格；商品图册循环三套配色并重绘页稿。切换场景时专属状态清零，翻页引擎与效果层继续共存。
- **Mobile transformation:** 390px 下效果层必须留在书页范围内，路线、步骤、聚焦窗口和色板均不得阻挡翻页主区域或造成横向溢出。
- **Motion and fallback:** reduced-motion 下不运行路线绘制、热点脉冲等非必要动画，但专属状态仍立即可见；无 3D fallback 保留静态双页和场景内容，并禁用动态动作。

## Revision 4 observable completion criteria

1. 场景面板明确显示 4 个基础场景和 4 个扩展场景；八套内容都替换主书的完整原创 SVG 页稿。
2. 旅行手账的动作在书页上显示路线和至少 4 个站点；继续点击会改变当前站点高亮。
3. 食谱步骤的动作在书页上显示步骤轨道；继续点击会推进当前步骤、保留完成态，并最终显示“可以上桌”。
4. 漫画分镜的动作在同一本书上显示暗幕与清晰窗口；继续点击至少切换 3 个不同位置的分镜。
5. 商品图册的动作循环至少 3 套配色；主书 SVG 页稿、舞台强调色和色板选中态同步改变，而不只是按钮文字变化。
6. 任一扩展场景启用专属效果后仍可翻页；切换到其他场景不会残留前一个场景的效果或状态。
7. 桌面与 390px 下场景选择、专属动作和主书翻页均可操作且无全页横向溢出；键盘可到达新增控件。
8. reduced-motion 与 `?fallback=1` 保持可理解边界；项目测试、仓库验证和真实浏览器验收通过。

## Hybrid workspace boundary

- **Scene base:** CSS 3D + semantic HTML。
- **Scene persistence:** 桌面首屏固定在研究摘要旁；进入文档细节流后不强制吸顶。手机转为纵向舞台，控制条换行但不进入弹屉。
- **Scene actions:** 核心书完成翻页、放大镜拖动、缩放、视差和自动演示；场景舞台完成切换、翻页与场景专属动作；扩展原型直接操作参数与手势。
- **Document actions:** 阅读原理、采用边界、证据和扩展路线。
- **State-to-scene mapping:** 拖拽改变曲率与进度；放大镜保持独立桌面坐标；缩放/指针改变书本空间姿态；场景选项改变页稿与专属工具；扩展输入直接改变条带预算、纸角或内容类型。
- **Fallback:** 无 JS 或 3D 变换不可用时，静态展开页和全部研究正文仍可读。

## Revision 3 spatial-stage boundary

- **Scene base:** CSS 3D 条带链 + 原创 data SVG 画册。
- **Scene persistence:** `demo/` 内书本在桌面始终占据主要画面；场景与扩展面板只改变书本，不把用户带入另一段长文。手机把面板放到书本下方，但保留顶部舞台和快捷标签。
- **Foreground controls:** 顶部“实际效果 / 场景 / 扩展效果”切换控制面板内容；右侧控制台管理自动演示、放大镜、场景内容、质量、柔软度、光照和二维纸角。
- **State-to-scene mapping:** 场景选项替换整套页稿；质量改变实际条带数量；柔软度改变实际曲率峰值；光照改变逐带明暗；纸角扩展在当前右页揭示下一页；自动导览持续翻动主书。
- **Mobile transformation:** 390px 下书本仍是首要内容，控制台变成其下方的紧凑面板；不使用遮挡书本的永久侧栏。
- **Fallback:** 无 3D 时显示静态双页和所有控制标签；reduced-motion 下不自动播放但手动状态立即结算。

## Revision 3 observable completion criteria

1. `demo/` 首屏没有研究报告式大标题、公式或指标墙，书本占据主要视觉面积。
2. 页面载入后通过一次温和的自动弯页预览直接证明柔性效果；reduced-motion 下不自动运动。
3. 用户可在主书上拖动、点击或用方向键翻页，并可拖动独立放大镜。
4. 画册、图鉴、产品发布、展览四个场景都替换主书的完整页稿，而不是在旁边显示说明卡。
5. 条带质量、纸张柔软度和光照强度直接改变主书下一次/当前翻页的几何与明暗。
6. 二维纸角扩展直接作用于当前右页，可拖动并揭示下一页内容。
7. 独立 demo 在 1440px 和 390px 可操作，研究展厅保留为“技术拆分”次级链接。

## Revision 3 direction

| 用户反馈 | Revision 2 浏览器证据 | 根因 | Revision 3 改变 | 验收标准 |
| --- | --- | --- | --- | --- |
| “这个网页是在做技术拆分吗？” | 首屏先出现巨型研究标题和文字摘要，书本包含技术词汇和参数侧栏 | 信息层级让解释压过了体验；Hybrid Workspace 对当前目标仍太像研究报告 | 新建独立 Spatial Stage，移除主视图公式、指标和长文，研究页仅作次级入口 | 第一眼先看到并操作书，不读说明也能理解效果 |
| “我需要实际效果演示” | 主书可翻但页稿内容仍是“结构差异/十八段切线” | 演示内容在讲机制，没有像真实产品那样使用机制 | 四套原创视觉内容全部在同一本主书上运行 | 切场景后主书页稿、色彩、状态均实际变化 |
| “以及可扩展效果演示” | 扩展原型位于长页面下方且与主书分离 | 扩展输入没有持续作用于视觉中心 | 质量、柔软度、光照、纸角直接控制主书 | 每个扩展输入都产生可截图、可观察的主舞台变化 |

## Observable completion criteria

1. 首屏主视觉本身就是完整可操作效果，不依赖继续向下阅读才知道库能做什么。
2. 柔性模式用 18 条或可调条带链呈现连续弯曲、正反面和逐带光照；刚性模式仍可作为基线。
3. 放大镜可以开关和独立拖动，书本可以缩放并随指针产生轻微视差；自动演示可展示完整翻页序列。
4. 作品集、教学图鉴、产品发布、展览导览四种场景都有独立页稿、交互目的和可执行动作，不再只是文字卡片。
5. 自适应条带预算、二维纸角、内容适配器三种扩展方向均有可操作原型，并明确其原型/实验边界。
6. 场景和扩展演示复用或对照核心几何，不用静态截图冒充运行效果。
7. 页面继续完整说明原理、适用/不适用边界、成本、证据和对既有研究的意义。
8. 所有上游事实固定到 commit `c1e477814c4c9e204452ebf9b298aa13629cbfc2`，不复制无许可证的源码或素材。
9. 1440px、768px、390px、明暗主题、键盘和 reduced-motion 下核心与新增演示可用，或有严格能力延期记录。
10. 项目测试、固定版本检查和仓库结构验证通过，浏览器验收与交接记录无 `continue` 项。

## Revision 2 direction

| 用户纠偏 | Revision 1 证据 | Revision 2 最小完整改变 | 验收标准 |
| --- | --- | --- | --- |
| 网页中实现库的效果 | 只有一个偏“几何实验”的书本，放大镜跟随但不可拖，缺少视差、缩放和自动展示 | 把首屏舞台升级为完整体验复刻，补齐独立放大镜、视差、缩放和自动演示 | 不阅读正文也能连续体验上游主要交互 |
| 根据场景构建演示效果 | 六张场景卡只有文字，`#scenarios` 内交互控件数为 0 | 建立四场景切换舞台，每个场景有页稿、翻页和专属动作 | 每个场景至少一个真实状态变化可在浏览器观察 |
| 扩展场景最好演示 | 六条 roadmap 只有文字，`#extensions` 内交互控件数为 0 | 建立三个扩展原型：质量预算、二维纸角、内容适配器 | 三个原型均有输入、视觉结果和语义状态反馈 |

## Reference-led gap table

| 比较层 | 上游/基线证据 | 本研究需要回答的缺口 | 最小实验 | 验收标准 |
| --- | --- | --- | --- | --- |
| Composition | 上游把整本画册作为单一舞台 | 仅看效果无法理解研究结论 | 舞台与证据摘要并排，细节按研究问题纵向展开 | 首屏同时可操作、可读结论 |
| Focal hierarchy | 上游视觉稿主导，操作提示很轻 | 用户不知道该拖哪里、该比较什么 | 在书页上放拖拽提示，在侧栏放模式与可观察指标 | 第一操作与第一结论不依赖猜测 |
| Typography | 上游自带字体与手写视觉 | 无许可证时不能复用字体/画稿 | 使用系统字体与原创 SVG 页稿 | 零外部资产仍具明确排版层级 |
| Palette/material | 上游水彩、纸张阴影、圆形放大镜 | 视觉风格可能掩盖机制 | 保留纸张材质隐喻，改用研究档案色和机制标注 | 颜色区分状态但不替代文字 |
| Motion | 上游 18 条嵌套链 + 拖拽/速度提交 | 既有基线仅有刚性单页，差异不直观 | 同台切换 rigid/curved，并显示进度、曲率、DOM 面数 | 半翻状态能直接看出曲面与平面差异 |

## Design direction

| 决策层 | 选择 | 可观察约束 | 验收标准 |
| --- | --- | --- | --- |
| Composition | 首屏混合工作区，后续编辑式研究流 | 舞台是唯一大面积视觉焦点 | 初次扫描先看到书与一句话结论 |
| Typography | 系统无衬线作操作，中文衬线作长文，等宽体作指标 | 正文行长约 35–70 个中文字符 | 三档视口无需放大阅读 |
| Palette | 暖纸/黑墨 + 珊瑚强调；深色主题用靛蓝纸桌 | 状态带文本、图标或数值 | 两主题语义一致 |
| Material/depth | 纸页、细描边、装订中缝、轻阴影 | 深度只解释书页层级和焦点 | 控件不被装饰遮挡 |
| Density | 首屏只保留比较控制和四个指标；证据分区阅读 | 每张卡只回答一个问题 | 手机无横向滚动 |
| Motion | 拖拽实时反馈，释放后短弹簧提交/回退 | reduced-motion 下直接完成 | 动画不阻止翻页或正文阅读 |
