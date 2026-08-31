# Browser validation

## Reproducible environment

| 字段 | 值 |
| --- | --- |
| Date / timezone | 2026-08-30–31 · Asia/Shanghai |
| Canonical start command | `python -m http.server 4173 --bind 127.0.0.1 --directory projects\sketchbook-page-curl-study` |
| Canonical URL | 实际效果 `http://127.0.0.1:4173/demo/`；技术拆分 `http://127.0.0.1:4173/showcase/` |
| Browser route | Revision 1/2：Chromium via agent-browser 0.27.0；Revision 3/4/5/6/7：Chromium via bundled Playwright |
| Viewports | 1440×1000、768×900、390×844；浏览器滚动条后的 layout widths 为 1425、753、375 |
| Themes / states | light、dark、idle、28%/50% turn、commit、cancel、independent magnifier、zoom、auto、eight scenarios、four scene-specific effects、three shared extensions、eighteen creative book forms、twelve deformable surfaces、five material presets、480 addressable combinations、six-axis atlas、36 directions、12 cross-axis combinations、reduced-motion、fallback |

## Revision 7 · twelve non-book deformable surfaces

### Scope

- **User correction:** 书只是包装；要核对此前列举的扩展是否真的在网页中运行，并把非书形态与更多扩展做成可操作演示。
- **Strict baseline:** Revision 6 的创意书型 10/10 已有独立 renderer，但原列举 8 种非书形态按严格口径为 0/8；邻近书型、纸角或说明文字不计完成。
- **Intervention:** 新增 12 个独立 surface renderer、五材质和共享条带链；8 个既有内容上下文、surface、material 三项正交选择，形成 480 个可寻址状态组合。
- **Originality boundary:** 12 个 surface、五材质、视觉与控制均为本项目原创扩展，不代表 MengTo/sketchbook 原生能力。织物、金属与 portal 分别是 CSS 视觉/响应、反射和空间阈值近似，不是物理布料、PBR 或 WebGL 连续场景。

### Executable browser evidence

| 检查 | 触发与观察 | 结果 |
| --- | --- | --- |
| 十二种独立结构 | 标签/地图/幕布/百叶/时间轴/材质墙/盒网/portal/卷轴/径向扇/票券/丝带分别为 14/8/20/18/7/8/6/6/12/10/16 holes/8 nodes | pass |
| 共享条带能力 | 标签 14 条=28 faces；幕布左右各 10 条；卷轴 12 条=24 faces；progress 改变逐带 transform 与光照 | pass |
| 原描述补齐 | 原列举的 8 项均拥有独立 `.deformable-surface--<id>`、不同直属几何和具名状态，不再借用书型 | pass |
| 更多扩展 | 卷轴、径向扇、穿孔票券和数据丝带分别验证顶边卷起、径向锚点、真实 detached 状态与 8 节点路径 | pass |
| 三维正交状态 | surface 保持不变时切换 8 内容与 5 材质；context/material 数据集和 URL 同步，480 为可寻址组合空间 | pass |
| 五材质可见性 | 每个 surface 的 paper/card/vellum/textile/foil 舞台截图均得到 5 个不同 SHA-256 前缀；computed 变量也不同 | pass |
| Cycle 深链 | 数据丝带 `progress=.43` 刷新前后均为 step=3、节点 4/8；地图、时间轴、材质墙、扇和丝带均由 progress 恢复 step | pass |
| 定向手势 | 标签右下→左上、幕布从起点半区向外、盒网向下、portal/卷轴向上、票券向右均增加 progress；票券可得到 `detached=1` | pass |
| 统一输入与恢复 | range/action/reset、舞台键盘、radio 方向键、左右导航与 Escape 可用；退出后 URL=`panel=experience`、surface=0、classic halves=2 | pass |
| Radio / 状态输出 | 12 个 surface 只有当前项 `tabIndex=0/aria-checked=true`；状态同时包含 surface、material、progress/step 和内容上下文 | pass |
| Desktop/tablet/mobile | 1440×1000、768×900、390×844 均 `scrollWidth===clientWidth`；390px 舞台先于完整控制台 | pass |
| Reduced motion / fallback | reduced-motion 过渡时长 `1e-06s`；fallback 静态终态可辨，action/range disabled，内容/表面/材质仍可选 | pass |
| Console/network/performance | console/page/request errors=[]；8 个本地资源、0 external、decoded≈387KB、DOM=478、navigation≈235ms | pass |
| Static tests | `node --test projects/sketchbook-page-curl-study/tests/*.test.mjs`：35/35 | pass |
| Public release | commit `4e21b99`；checks run `33371045085`、deploy run `33371045153` success；研究页/Demo/showcase/深链 HTTP 200；线上优惠券 `detached=1` | pass |

### Revision 7 evidence set

| Capture | State |
| --- | --- |
| `browser-r7-label-peel.png` | 14 条双面带、角点 grip、底层揭示与产品发布内容 |
| `browser-r7-curtain.png` | 左右 20 条镜像幕带、中央舞台和织物近似边界 |
| `browser-r7-fold-map.png` | 8 个山/谷折面、跨面路线、5 个站点与卡纸材质 |
| `browser-r7-box-net.png` | 六面盒体向十字 net 展开与金属薄片视觉预设 |
| `browser-r7-coupon-detached.png` | 16 个穿孔、保留存根和真正独立的 detached 票券 |
| `browser-r7-mobile-fan.png` | 390px 下 10 个径向扇片、胶片材质与完整控制台 |

## Revision 6 · eighteen live forms and a six-axis creative atlas

### Scope

- **User need:** 在十种书型之外继续扩展更多创意形态，并且要“尽可能详细、多”，同时保持此前的核心要求：中央区域必须是可操作效果，不是技术卡片或只读概念清单。
- **Intervention:** 书型由 10 扩展到 18；新增“创意图谱”入口，以六条创意轴组织 36 个方向、三档成熟度与 12 个跨轴组合。选择方向会同步中央舞台；有真实 renderer 的方向可继续进入完整书型控制。
- **Originality boundary:** 新增八种书型、36 个方向、12 个组合、视觉与交互均为本项目原创研究；它们不代表 MengTo/sketchbook 原生能力。`LIVE` 是本页可运行模型，`REMIX` 是可由当前架构可信验证的邻近机制，`HORIZON` 需要额外硬件、实时后端、多人同步或 WebGL，页面明确不冒充已实现。

### Executable browser evidence

| 检查 | 触发与观察 | 结果 |
| --- | --- | --- |
| 十八种入口 | 书型选择器 buttons=18；原十种与新增八种均有独立 `data-form` 和 renderer | pass |
| 八种新增拓扑 | mixmatch/pulltab/iris/waterfall/venetian/dosados/jacob/flexagon 的直属结构数依次为 3/3/8/6/20/2/6/6 | pass |
| 连续几何 | 八种新增书型在 progress=`.730` 时主运动节点 transform 均相对初始态改变 | pass |
| 专属动作 | 分栏组合从 `001→002`；拉条联动三部分同步；虹膜、瀑布、百叶、双首、梯板、折面均产生各自状态变化 | pass |
| 统一输入与恢复 | 拉条中央拖动得到 progress=`.405`；键盘得到 `.100`；左右导航 gatefold→accordion；退出后恢复 classic halves=2 | pass |
| 六轴图谱 | 7 个轴按钮（含全部）、4 个成熟度按钮（含全部）、36 个方向、6 个详情区、12 个组合场景 | pass |
| 筛选一致性 | 机构轴得到 6 项；机构轴 + LIVE 得 4 项；HORIZON 总计 13 项；计数与数据定义一致 | pass |
| 图谱回舞台 | `narrative-mix-and-match` 选择后 stage=`mixmatch`；CTA 打开 forms 面板和完整控制 | pass |
| 成熟度诚实性 | HORIZON 示例“可重组书帖”显示额外系统需求，并明确“当前不冒充已实现” | pass |
| 跨轴组合 | 12 个组合均可选择；“气候记忆历书”显示活动说明并把邻近 volvelle 模型送入舞台 | pass |
| Desktop/tablet/mobile | 1440/768/390 下全页 overflow=false；390px 顶部五入口仅在自身容器内横向滚动，舞台仍先于控制台 | pass |
| Reduced motion / fallback | reduced-motion 下 flipbook 只推进 1 帧且不播放；fallback 保留静态终态，书型/图谱筛选可用，动态 action/range 禁用 | pass |
| Console/network/performance | console/page errors=[]；5 个本地运行时资源、0 个外部资源；图谱态 DOM 797；navigation 约 232ms | pass |
| Static tests | `node --test projects/sketchbook-page-curl-study/tests/*.test.mjs`：25/25 | pass |

### Revision 6 evidence set

| Capture | State |
| --- | --- |
| `browser-r6-explore-iris.png` | 1440px 创意图谱首屏；虹膜快门实作与六轴筛选同时可见 |
| `browser-r6-atlas-detail.png` | 单方向深读：结构、动作、场景、机制、意义、风险、组合与下一步实验 |
| `browser-r6-mixmatch.png` | 三段分栏组合书，实际表现 125 种角色/产品/叙事组合空间 |
| `browser-r6-pulltab.png` | 73% 拉条状态；遮罩、齿轮和能量路径由同一输入联动 |
| `browser-r6-flexagon.png` | 六三角单元、三组隐藏面与完整书型导航 |
| `browser-r6-mobile-atlas.png` | 390px 完整长页：舞台、筛选、详情和 12 个跨轴组合均可到达 |

## Revision 5 · creative book forms as the interaction surface

### Scope

- **User need:** 不再只给普通跨页书换内容，而是把此前提出的不同创意书型全部做成可以直接操作的实际效果。
- **Intervention:** 新增独立“书型”入口。每次选择都会重建中央 Spatial Stage 的 DOM 拓扑；场景仍回答“书里承载什么任务”，书型则回答“纸页如何连接、展开、遮挡、叠合、转动与循环”。
- **Originality boundary:** 十种书型的结构、文案、图形和控制逻辑均为本项目原创验证，不代表 MengTo/sketchbook 原生包含这些效果。

### Executable browser evidence

| 检查 | 触发与观察 | 结果 |
| --- | --- | --- |
| 十种独立结构 | gatefold/accordion/popup/diecut/layers/tunnel/volvelle/flipbook/carousel/infinite 的直属结构数依次为 2/6/3/4/3/5/8/12/6/6 | pass |
| 连续几何 | range 设为 64% 后，十种 renderer 的主运动节点 transform 均改变，`geometryChanged=10/10` | pass |
| 专属动作 | 双门和纸构开合；折页、景深、叠层、隧道、轮盘、木马与循环逐档推进；flipbook 计时推进帧 | pass |
| 统一输入 | 中央直接拖动得到 progress=`.540`；键盘 ArrowRight 得到 `.100`；左右导航从 gatefold 切到 accordion | pass |
| 生命周期恢复 | 离开书型后 `data-form=classic`、halves=2；再次拖动传统跨页生成 18 个 `.strip` | pass |
| Reduced motion | flipbook 主动作只令 step 0→1，`playing=false`、`aria-pressed=false` | pass |
| Fallback | `?fallback=1&form=popup`：progress=`1.000`、fallback=true、action/range disabled | pass |
| Desktop/tablet/mobile | 1440、768、390 均 overflow=false；书体和操作坞可见 | pass |
| Console/network | console/page errors=[]；4 个本地资源，transfer 约 148.5KB；交互态 DOM 312 节点 | pass |
| Static tests | `node --test projects/sketchbook-page-curl-study/tests/*.test.mjs`：21/21 | pass |

### Revision 5 evidence set

| Capture | State |
| --- | --- |
| `browser-r5-gatefold.png` | 24% 开合状态，可同时辨认双门、铰链方向和中央揭晓 |
| `browser-r5-popup.png` | 三个纸构件从床页抬升后的立体舞台 |
| `browser-r5-layers.png` | 三张透明图层叠合成完整图谱 |
| `browser-r5-tunnel.png` | 五层纸框、穿过态与尽头光源 |
| `browser-r5-volvelle.png` | 固定指针下旋转的八区纸轮 |
| `browser-r5-mobile-carousel.png` | 390×844 下六叶旋转木马与完整书型控制台 |

## Revision 4 · scene-specific extension effects

### Scope

- **User need:** 在既有四场景之外展示更多可以真实操作的场景效果，而不是继续增加说明卡。
- **Intervention:** 保留作品集、自然图鉴、产品发布、展览导览四个基础场景，在同一本主书中加入旅行手账、食谱、漫画和产品目录。四个新场景分别维护 route、steps、focus 和 colorway 状态。
- **Originality boundary:** 新增页稿、叠层和交互均为本项目原创独立实现；它们用于验证扩展方法，不代表上游仓库原生提供这些产品场景。

### Executable browser evidence

| 检查 | 触发与观察 | 结果 |
| --- | --- | --- |
| 八场景入口 | 页面存在 base 4 + travel/recipe/comic/catalog 共 8 个场景按钮 | pass |
| 旅行路线 | travel effect=`route`，路线含 4 stops；动作将 step 0→1，翻页到 02 后 effect 仍存在 | pass |
| 食谱步骤 | recipe 依次完成 4 steps；最终 completed=4、ready=“可以上桌” | pass |
| 漫画聚焦 | 连续触发得到三组互不相同的 focus 坐标，焦点在分镜间移动 | pass |
| 目录配色 | accent `#b75f4f`→`#2d79b7`；pageArtChanged=true；色板含 3 swatches | pass |
| 场景隔离 | 离开专属场景后旧叠层被清理，effect=0 | pass |
| Reduced motion | 动画时长为 `1e-06s`，不保留常规长动画 | pass |
| Fallback | `?fallback=1`：8 个场景按钮 disabled，书本保留 2 个静态 halves | pass |
| Tablet/mobile | 768px 与 390px 均 overflow=false，场景与操作仍可达 | pass |
| Runtime errors | console/page errors=[] | pass |
| Static tests | `node --test projects/sketchbook-page-curl-study/tests/*.test.mjs`：14/14 | pass |

### Revision 4 evidence set

| Capture | State |
| --- | --- |
| `browser-r4-travel-route.png` | 旅行手账的 4 站路线与跨页保留态 |
| `browser-r4-recipe-complete.png` | 食谱 4/4 完成并输出“可以上桌” |
| `browser-r4-catalog-colorway.png` | 产品目录切换到第二套强调色，页稿与三色色板同步 |
| `browser-r4-mobile-comic.png` | 390×844 下的漫画分镜聚焦 |

## Revision 3 · actual-effect-first Spatial Stage

### Baseline and intervention

- **Observed baseline:** `showcase/` 首屏先出现巨型研究标题、摘要、模型参数和指标侧栏；书内标题为“结构差异/十八段切线”。功能存在，但视觉上属于技术报告中的实验组件。
- **Root cause:** Hybrid Workspace 同时承担研究叙事与效果演示，技术信息在组成和页稿内容上都压过了实际使用感。
- **Intervention:** 新增 `demo/` 独立 Spatial Stage；中央主书持续可见，四场景和四项扩展都直接改变主书；原页面作为“技术拆分”链接保留。
- **Observed result:** 默认载入自动出现柔性弯页；首屏没有公式、比较表或指标墙。桌面书宽 935px，占据主内容区；右侧只保留操作控制。

### Executable browser evidence

| 检查 | 触发与观察 | 结果 |
| --- | --- | --- |
| 实际柔性翻页 | 点击/拖动右页立即生成 18 个 `.strip`；结算后页码到 02 | pass |
| 场景替换 | 选择自然图鉴后 stage=`atlas`、主书页码重置 01、标题与整套 SVG 页稿改变 | pass |
| 曲面精度扩展 | quality=9 后拖页生成 9 strips；根条带为有效 `matrix3d` | pass |
| 柔软度/光照 | range 输入更新 `state.peakCurl` / `state.light`，当前 turn 立即重算角度与 shade/glow | pass |
| 二维纸角 | 开启后主书出现 1 个 `.corner-page`；方向键令 `--corner-x` 从 23% 到 26% 并揭示下一页 | pass |
| 观察镜 | `aria-hidden=false`、镜内主书 clone count=1；方向键后 loupe transform 改变 | pass |
| 自动播放 | pressed=`true`、主书 `is-demoing=true`，立即生成 18 strips | pass |
| Reduced motion | `reduced_motion=reduce` 等待 2.1s 后 turn layer count=0 | pass |
| Fallback | `?fallback=1`：根类 `is-fallback`、2 个静态半页、auto disabled | pass |
| Desktop/tablet/mobile | 1440、768、390 均 overflow=false；书本和对应控制面板可见 | pass |
| Console/network | console/page errors=[]；navigation 262ms；3 个本地资源、0 个外部资源 | pass |

### Revision 3 evidence set

| Capture | State |
| --- | --- |
| `browser-r3-demo-live.png` | 1440×1000 默认载入的自动柔性弯页 |
| `browser-r3-demo-extensions.png` | 1440×1000 扩展面板 + 二维纸角直接作用于主书 |
| `browser-r3-demo-mobile.png` | 390×844 主书优先的移动布局 |

## Revision 2 · executable demonstrations

| 用户要求 | 操作证据 | 结果 |
| --- | --- | --- |
| 完整库效果 | 主书下一页动作立即生成 18 个 `.strip`，完成后 page=`02`；放大镜可聚焦，键盘改变位置 transform；缩放输出 `120%`；自动演示设置 pressed=`true` 和 `is-demoing` | pass |
| 作品集 | 场景下一页立即生成 12 个 `.scene-strip`，完成后 counter=`02 / 03`；策展动作令 `is-curated=true` | pass |
| 教学图鉴 | 观察动作令 `is-inspecting=true`；pointer move 把 lens left 更新为 `27.4674%` | pass |
| 产品发布 | 特性动作令 `is-featured=true`，feature panel `aria-hidden=false` | pass |
| 展览导览 | 自动导览令 `is-playing=true`，计时后 counter 从 `01 / 03` 到 `03 / 03`；再次动作停止 | pass |
| 自适应预算 | slider 设为 35Hz 后 output=`8 strips`、fan child count=`8`，动态光照说明关闭 | pass |
| 二维纸角 | grip 方向键输入后 output 从 `x 20 · y 20` 到 `x 23 · y 23` | pass |
| 内容适配器 | product action 后 output=`Component capture`、preview dataset=`product` | pass |
| Reduced motion | main auto pressed=`false`、kiosk playing=`false`；手动主书直接到 page=`02` | pass |
| Fallback | main auto、scene next、quality slider、adapter button 均 disabled | pass |

修订前的量化基线是 `scenarioControls=0`、`extensionControls=0`；Revision 2 accessibility snapshot 已暴露四个场景 tab、场景翻页/action、预算 slider、纸角 grip/reset 和四个 adapter button。

## Refinement ledger

### Stage 2 · First-view hierarchy

- **Observed evidence:** 初始 1440px 截图中，两个研究链接落到大标题下方并与笔画重叠。
- **Root cause:** Grid 自动布局没有为标题、摘要和链接指定稳定区域。
- **Minimal intervention:** 用显式 `grid-template-areas` 固定 eyebrow/title/dek/links，并在窄屏改为单列顺序。
- **Adjacent checks:** 1440、768、390；摘要和链接均可见，实验台没有被推离阅读流。
- **Decision:** pass。

### Stage 5 · Curved geometry

- **Observed evidence:** 第一张 50% 翻页图只出现右页“百叶窗”，根条带 computed transform 为 `none`。
- **Root cause:** 角度变量用了显示字符 `°`，且取负依赖不稳定的 CSS 乘法表达式。
- **Minimal intervention:** JavaScript 直接输出带方向的 `deg` 变量，CSS 只消费已签名角度；新增 `cssDegrees` 单测。
- **Observed result:** 根条带 computed transform 为有效 `matrix3d`，28%/50% 状态跨书脊形成连续条带曲面。
- **Adjacent checks:** rigid 仍为单平面；next/prev 方向、0/1 端点、24 条带均可用。
- **Decision:** pass。

## Primary journey evidence

| 检查 | 浏览器观察 | 结果 |
| --- | --- | --- |
| Pointer commit | 右页从 x=900 拖到 x=520，释放后 page=`02`，status=`已翻到第 2 页` | pass |
| Pointer cancel | 右页只拖约 80px，释放后仍为 page=`02`，status=`未越过阈值 · 已回弹` | pass |
| Keyboard | Book 获得焦点后 ArrowRight 翻到 `03`；Escape 令 magnifier pressed=`false` | pass |
| Renderer switch | rigid label=`RIGID · 1 PLANE`、faces=`2`、条带选择禁用 | pass |
| Quality switch | curved + 24 presets 令 faces=`48` | pass |
| Magnifier | pressed=`true`、可见类存在、镜内 `.book` clone count=`1` | pass |
| Theme | dark→light→dark 均更新根 theme；两主题截图可读 | pass |
| Reduced motion | media query 为 true，CSS transition=`0.00001s`，程序化点击后直接到下一页且无 turn layer | pass |
| Fallback | `?fallback=1`：static pages=2、dynamic halves=0、main sections=9、主控件禁用 | pass |

## Cross-surface evidence

| Surface | Layout observation | Evidence |
| --- | --- | --- |
| Desktop 1440×1000 light | 首屏两列、实验台 stage+telemetry；无全页横向溢出 | `browser-desktop-light.png` |
| Desktop 1440×1000 dark | 深墨层级与暖纸书页保持区分；24 条带状态可读 | `browser-desktop-dark.png` |
| Tablet 768×900 | 首屏单列、工具栏单行、28% 曲面可见；`scrollWidth=clientWidth=753` | `browser-tablet-768.png` |
| Mobile 390×844 | 导航收敛，控制条换行，书页保持 2:1 展开；`scrollWidth=clientWidth=375` | `browser-mobile-390.png` |
| Foreground enhancement | 放大镜跟随指针并正确放大当前书页，不遮蔽开关 | `browser-magnifier-state.png` |
| Geometry state | 50% 柔性页有有效逐段变换与可见曲率 | `browser-curved-half-turn.png` |
| Revision 2 core | 独立放大镜、完整工具栏和柔性主书 | `browser-r2-core.png` |
| Revision 2 scenarios | 四场景 tab、作品页稿和判断面板 | `browser-r2-scenarios.png` |
| Revision 2 extensions | 深色主题下三个可操作扩展原型 | `browser-r2-extensions-dark.png` |
| Revision 2 mobile | 390×844 下标题、工具栏和主书无横向溢出 | `browser-r2-mobile.png` |
| Revision 4 travel | 旅行路线含 4 个站点，翻页后路线状态保留 | `browser-r4-travel-route.png` |
| Revision 4 recipe | 4/4 步骤完成并进入“可以上桌”状态 | `browser-r4-recipe-complete.png` |
| Revision 4 catalog | 强调色与实际页稿同步切换，显示三色色板 | `browser-r4-catalog-colorway.png` |
| Revision 4 mobile comic | 390×844 下分镜聚焦可见且无横向溢出 | `browser-r4-mobile-comic.png` |

## Performance and network

- Revision 2（主实验 + 四场景 + 三扩展）本地加载：TTFB 7.3ms，FCP/LCP 208ms（h1），CLS 0。Revision 1 的 24 条带基线为 TTFB 1.4ms、FCP/LCP 44ms。
- 浏览器 console/errors 为空。
- 请求只有本地 document、CSS、四个 ES modules 和运行时原创 data SVG；没有第三方字体、图片或脚本请求。
- 以上不等于真实移动设备的动画帧时、热与功耗证据。

## Valid defers

1. **Physical touch:** 尝试 `set device "iPhone 13"`，工具不支持该别名；改用 iPhone 15 预设后 viewport 生效，但 `navigator.maxTouchPoints=0`、`(pointer: coarse)=false`，不能声称完成真实触控验证。重测触发条件：可用的 iOS/Android 实机或能派发 trusted touch 的浏览器环境。
2. **Mobile sustained performance:** 当前只有桌面 Chromium 加载指标与主观交互观察。重测触发条件：在实机上用 24 条带连续拖动 30 秒，采集帧时、长任务、温度和功耗。
