const TIERS = Object.freeze(['LIVE', 'REMIX', 'HORIZON']);

const DEMO_FORMS = Object.freeze([
  'gatefold',
  'accordion',
  'popup',
  'diecut',
  'layers',
  'tunnel',
  'volvelle',
  'flipbook',
  'carousel',
  'infinite',
  'mixmatch',
  'pulltab',
  'iris',
  'waterfall',
  'venetian',
  'dosados',
  'jacob',
  'flexagon'
]);

function freezeAxis(axis) {
  return Object.freeze({ ...axis });
}

function freezeDirection(direction) {
  return Object.freeze({
    ...direction,
    scenarios: Object.freeze([...direction.scenarios]),
    combinationSuggestion: Object.freeze([...direction.combinationSuggestion])
  });
}

function freezeCombination(combination) {
  return Object.freeze({
    ...combination,
    directions: Object.freeze([...combination.directions])
  });
}

/**
 * Six independent lenses for asking what a book-like interaction can become.
 * The order moves from physical structure to increasingly systemic behaviour.
 */
export const AXES = Object.freeze([
  freezeAxis({
    id: 'topology',
    index: 'A',
    name: '阅读拓扑与装订',
    englishName: 'Reading topology & binding',
    question: '页与页还能怎样连接，读者又能从哪里进入？',
    accent: '#d9614b'
  }),
  freezeAxis({
    id: 'mechanism',
    index: 'B',
    name: '纸张机构与联动',
    englishName: 'Paper mechanisms & linkage',
    question: '一次手势能否同时驱动多层纸构件？',
    accent: '#de8b42'
  }),
  freezeAxis({
    id: 'optics',
    index: 'C',
    name: '材料、光学与显影',
    englishName: 'Material, optics & reveal',
    question: '内容能否由光、热、角度和时间而不是翻页来显现？',
    accent: '#4b8db8'
  }),
  freezeAxis({
    id: 'narrative',
    index: 'D',
    name: '组合叙事与状态',
    englishName: 'Combinatorial narrative & state',
    question: '故事能否重组、记忆、分岔，甚至反向阅读？',
    accent: '#a4639b'
  }),
  freezeAxis({
    id: 'embodied',
    index: 'E',
    name: '身体、尺度与环境',
    englishName: 'Body, scale & environment',
    question: '当身体、他人或场地成为装订的一部分，会发生什么？',
    accent: '#4e9a77'
  }),
  freezeAxis({
    id: 'generative',
    index: 'F',
    name: '数据、生成与生命性',
    englishName: 'Data, generation & living books',
    question: '一本书能否持续接收世界、重写自己并回应读者？',
    accent: '#4f78c7'
  })
]);

export const DIRECTIONS = Object.freeze([
  // A · Reading topology & binding
  freezeDirection({
    id: 'topology-dos-a-dos',
    axis: 'topology',
    tier: 'LIVE',
    name: '双首背靠背书',
    englishName: 'Dos-à-dos book',
    coreStructure: '两册书共享同一块后封或书脊，两个封面朝向相反，读者必须把整册翻转才能进入另一条叙事。',
    primaryAction: '从一端读到中点后，把整本书翻面，从相反方向重新进入。',
    scenarios: ['双主角故事', '正反观点展陈', '品牌与幕后制造', '双语平行出版'],
    technicalMechanism: '以整册 Y 轴翻转表达入口切换；两组页面保持各自阅读方向，并在共享中缝处交换当前叙事状态。',
    largestRisk: '读者可能把第二入口误判为封底，移动端整册旋转也容易遮挡操作提示。',
    combinationSuggestion: ['多视角证词', '场地锚定 AR', '合作阅读'],
    nextExperiment: '验证 180° 翻转后标题、进度和左右方向能否在 300 ms 内完成认知重置。',
    form: 'dosados'
  }),
  freezeDirection({
    id: 'topology-scrollbook-hybrid',
    axis: 'topology',
    tier: 'REMIX',
    name: '卷轴折本混合书',
    englishName: 'Scrollbook hybrid',
    coreStructure: '长卷被折叠成可携带的册页，局部可像书一样翻，整体又能拉开成为连续全景。',
    primaryAction: '先逐折阅读细节，再一次性拉开全卷观察完整关系。',
    scenarios: ['城市漫游路线', '历史长时间线', '供应链全景', '长幅叙事插画'],
    technicalMechanism: '手风琴折面负责离散段落，横向连续坐标负责全景模式；展开阈值触发从分页吸附到自由平移。',
    largestRisk: '局部页码与全局位置可能互相冲突，长内容也会放大性能和可读性问题。',
    combinationSuggestion: ['语义缩放', '实时数据历书', '地点触发内容'],
    nextExperiment: '做一个六折路线样机，对比逐折阅读与全卷扫视时用户对空间顺序的记忆。',
    form: 'accordion'
  }),
  freezeDirection({
    id: 'topology-venetian-blind',
    axis: 'topology',
    tier: 'LIVE',
    name: '百叶交错书',
    englishName: 'Venetian-blind book',
    coreStructure: '两幅完整画面被切成相间窄条，并装在同一组可转动叶片的正反两面。',
    primaryAction: '拖动或倾斜叶片，在画面 A、过渡混合和画面 B 之间连续切换。',
    scenarios: ['城市昼夜对照', '修复前后对比', '服装换色', '科学过程显影'],
    technicalMechanism: '等距叶片以相同角度旋转，奇偶条分别承载 A/B 图像切片；进度决定可见面和条缝宽度。',
    largestRisk: '条带错位会立即破坏图像完整性，小屏幕上的高频纹理还可能产生摩尔纹。',
    combinationSuggestion: ['声景切换', '热致变色', '多视角证词'],
    nextExperiment: '在 16、20、24 条叶片之间测试画面辨识度、动画顺滑度与 DOM 成本。',
    form: 'venetian'
  }),
  freezeDirection({
    id: 'topology-jacobs-ladder',
    axis: 'topology',
    tier: 'LIVE',
    name: '雅各布梯书',
    englishName: "Jacob's ladder book",
    coreStructure: '六块硬板以交替缎带连接；翻动顶板会让下方板块依次“跌落”，并交替露出正反面。',
    primaryAction: '翻动首块板，观察一次动作沿整条结构级联传播。',
    scenarios: ['因果链教学', '误解逐层纠正', '状态迁移演示', '节奏化品牌故事'],
    technicalMechanism: '相邻板块围绕交替轴旋转，延迟曲线模拟缎带传力；每完成半周便交换可见面。',
    largestRisk: '若级联时序过快只像普通卡片动画，过慢又会失去机械“啪嗒”感。',
    combinationSuggestion: ['多视角证词', '纸机械自动机', '触觉反馈'],
    nextExperiment: '对比线性、弹簧和逐板延迟三种级联曲线，选择最接近真实硬板跌落的节奏。',
    form: 'jacob'
  }),
  freezeDirection({
    id: 'topology-palm-leaf-fan',
    axis: 'topology',
    tier: 'REMIX',
    name: '贝叶扇形书',
    englishName: 'Palm-leaf fan book',
    coreStructure: '狭长页片由单一铆钉穿接，可像扇子一样展开；页序由旋转角度而非左右翻页决定。',
    primaryAction: '围绕铆钉旋开页片，并把目标页带到正面。',
    scenarios: ['材料样本册', '色彩选择器', '菜谱步骤卡', '便携式田野图鉴'],
    technicalMechanism: '每页分配固定极角，展开进度控制角间距；选中页提高层级并回转到可读角度。',
    largestRisk: '大角度展开会超出视口，页片重叠时命中区域和阅读顺序也不直观。',
    combinationSuggestion: ['旋转轮盘', '个性化生成版本', '触觉浮雕'],
    nextExperiment: '用 9 张窄页验证拇指拖动、点选页签和自动聚焦三种选页方式。',
    form: 'carousel'
  }),
  freezeDirection({
    id: 'topology-reconfigurable-signatures',
    axis: 'topology',
    tier: 'HORIZON',
    name: '可重组书帖',
    englishName: 'Reconfigurable signatures',
    coreStructure: '书不再有固定装订顺序；章节以磁吸、卡扣或数字模块存在，可被抽出、交换和重新成册。',
    primaryAction: '拆下一个章节并插入新位置，让全书的路径、索引与结论随之重排。',
    scenarios: ['参与式档案', '模块课程包', '旅行记忆册', '可配置产品目录'],
    technicalMechanism: '章节拥有稳定标识和前后依赖图，排序变化后重新计算导航、交叉引用和持久化版本。',
    largestRisk: '自由度过高会让读者丢失作者意图，也会制造难以恢复的无效章节组合。',
    combinationSuggestion: ['协作覆写本', '程序化世界书', '地点锚定 AR'],
    nextExperiment: '限制为四个可交换书帖，先验证系统能否解释“为什么这两章不能相邻”。'
  }),

  // B · Paper mechanisms & linkage
  freezeDirection({
    id: 'mechanism-pull-tab',
    axis: 'mechanism',
    tier: 'LIVE',
    name: '拉条联动书',
    englishName: 'Pull-tab linkage book',
    coreStructure: '一根可见拉条穿过纸槽，并通过隐蔽连杆同时牵引多个图层、遮罩或指针。',
    primaryAction: '拉动单一把手，让因果相关的多个部件以不同速度同步变化。',
    scenarios: ['机械原理说明', '身体解剖联动', '产品功能拆解', '能量流可视化'],
    technicalMechanism: '主进度经过比例、延迟和方向映射，分别驱动位移、旋转与遮罩；限位器约束有效行程。',
    largestRisk: '联动关系若缺少视觉连杆会像无关动画堆叠，过多部件也会削弱主因果。',
    combinationSuggestion: ['镂空窗口', '多视角证词', '实时数据'],
    nextExperiment: '让一个 0–1 拉条同时驱动外壳剖开、齿轮旋转和能量路径显现，并测试因果复述率。',
    form: 'pulltab'
  }),
  freezeDirection({
    id: 'mechanism-waterfall',
    axis: 'mechanism',
    tier: 'LIVE',
    name: '瀑布翻片书',
    englishName: 'Waterfall flip book',
    coreStructure: '多张卡片沿同一拉带阶梯排列；拉带移动时，卡片按顺序越过折线并翻到背面。',
    primaryAction: '向下拉动带尾，让步骤卡连续翻过，形成清晰的前后因果。',
    scenarios: ['流程教学', '年度里程碑', '食谱步骤', '数据变化解释'],
    technicalMechanism: '总进度分割成多个局部阈值，每张卡获得错峰的 rotateX 与位移曲线，拉带位置保持同步。',
    largestRisk: '卡片层级错误会出现穿插；如果翻片内容不成序列，瀑布动作只剩装饰性。',
    combinationSuggestion: ['实时数据历书', '翻动画册', '因果注释'],
    nextExperiment: '用六张卡比较均匀阈值与内容加权阈值，验证重要步骤是否获得足够停留时间。',
    form: 'waterfall'
  }),
  freezeDirection({
    id: 'mechanism-flexagon',
    axis: 'mechanism',
    tier: 'LIVE',
    name: '万花折面书',
    englishName: 'Flexagon book',
    coreStructure: '六个三角折面组成可翻转的闭环，看似只有正反两面，折叠后却会露出第三组隐藏表面。',
    primaryAction: '捏合相对折缝并向外翻开，在三个稳定图案状态间循环。',
    scenarios: ['三态科学模型', '角色三种身份', '品牌核心三原则', '谜题与隐藏线索'],
    technicalMechanism: '三角单元围绕共享折线进行分段 3D 旋转，状态机控制三组纹理的显隐与面朝向。',
    largestRisk: '屏幕上的单指手势难以模拟真实双手捏合，折面拓扑也容易产生视觉自相交。',
    combinationSuggestion: ['生成规则', '荧光余像', '组合叙事'],
    nextExperiment: '先用单一滑杆完成三态闭环，再测试双点捏合是否真正提升“发现隐藏面”的惊喜。',
    form: 'flexagon'
  }),
  freezeDirection({
    id: 'mechanism-iris-aperture',
    axis: 'mechanism',
    tier: 'LIVE',
    name: '虹膜快门书',
    englishName: 'Iris-aperture book',
    coreStructure: '八片重叠叶片围绕中心旋转，形成可连续开合的多边形孔径。',
    primaryAction: '旋转外圈或拖动控制柄，精确决定中心内容被揭示多少。',
    scenarios: ['隐私权限说明', '摄影与光学教学', '高价值产品揭晓', '层级访问控制'],
    technicalMechanism: '叶片共享角速度与偏心旋转中心，clip-path 或 mask 计算中央孔径，内容曝光量绑定开合进度。',
    largestRisk: '复杂遮罩在低端设备上可能掉帧，叶片开合若无物理重叠感会退化为普通圆形蒙版。',
    combinationSuggestion: ['透明叠层', '热致变色', '权限状态'],
    nextExperiment: '比较 CSS clip-path 叶片与 SVG mask 两种实现，在移动端测量连续拖动的帧稳定性。',
    form: 'iris'
  }),
  freezeDirection({
    id: 'mechanism-paper-automata',
    axis: 'mechanism',
    tier: 'REMIX',
    name: '纸机械自动机',
    englishName: 'Paper automata book',
    coreStructure: '凸轮、曲柄、连杆与立体纸景被装进跨页，书页本身成为一台可操作的小机器。',
    primaryAction: '转动摇柄或滑动曲柄，让角色执行循环动作。',
    scenarios: ['机械科普', '角色剧场', '博物馆互动', '叙事性产品展示'],
    technicalMechanism: '输入角度驱动多组不同相位的正弦/凸轮曲线，再映射到部件的旋转、升降和往复运动。',
    largestRisk: '机构真实性与可维护性成本很高，复杂动作也可能让用户忽略内容含义。',
    combinationSuggestion: ['立体书', '拉条联动', '声效反馈'],
    nextExperiment: '把现有立体舞台增加一个虚拟曲柄，只驱动三件有明确叙事关系的构件。',
    form: 'popup'
  }),
  freezeDirection({
    id: 'mechanism-nested-flaps',
    axis: 'mechanism',
    tier: 'REMIX',
    name: '套层揭页书',
    englishName: 'Nested lift-the-flap book',
    coreStructure: '一个问题下面不是单层答案，而是门中有门、层下有层的递归揭页结构。',
    primaryAction: '按由外到内的顺序掀开多个小门，逐步缩小问题范围。',
    scenarios: ['故障诊断', '儿童探索', '信息分级披露', '器物结构剖析'],
    technicalMechanism: '嵌套容器维护独立打开状态和焦点层级；父层关闭时折叠并保留或重置子层状态。',
    largestRisk: '深层嵌套会造成返回困难和点击目标过小，读者也可能错过未开启的分支。',
    combinationSuggestion: ['对开门', '镂空窗口', '状态记忆书'],
    nextExperiment: '限制为三层、每层两个入口，验证面包屑提示是否足以维持空间定位。',
    form: 'gatefold'
  }),

  // C · Material, optics & reveal
  freezeDirection({
    id: 'optics-lenticular',
    axis: 'optics',
    tier: 'REMIX',
    name: '光栅变图书',
    englishName: 'Lenticular shift book',
    coreStructure: '两到三幅图被切成交错细条，再由柱状光栅按观察角度选择性放大。',
    primaryAction: '左右倾斜书页或移动视点，在多个时刻、视角或状态间瞬时切换。',
    scenarios: ['运动分解', '历史前后对照', '表情变化', '空间深度错觉'],
    technicalMechanism: '根据指针或设备姿态偏移条带采样位置，使用遮罩/背景位移近似角度选择性显像。',
    largestRisk: '条纹频率、屏幕像素和视点范围不匹配时会眩目或看不清任一完整图像。',
    combinationSuggestion: ['百叶交错', '设备陀螺仪', '翻动画册'],
    nextExperiment: '用同一组素材并排比较百叶转面与连续光栅位移，记录哪种更适合叙事而非炫技。',
    form: 'venetian'
  }),
  freezeDirection({
    id: 'optics-mirror-kaleidoscope',
    axis: 'optics',
    tier: 'HORIZON',
    name: '镜面万花书',
    englishName: 'Mirror-kaleidoscope book',
    coreStructure: '折页内侧模拟多面镜腔，单个图形经反射成为随开合角度变化的连续纹样。',
    primaryAction: '改变书页夹角或旋转输入图案，观察对称阶数与空间感实时变化。',
    scenarios: ['数学对称教学', '珠宝与纹样展示', '冥想视觉', '生成式封面'],
    technicalMechanism: '复制扇区或着色器镜像采样模拟多次反射；折页角度决定镜面法线与重复次数。',
    largestRisk: '真实反射需要 WebGL 或高成本合成，快速变化的高频图案也可能引发视觉不适。',
    combinationSuggestion: ['旋转木马书', '程序化世界书', '光影投射'],
    nextExperiment: '先做 3、5、8 重对称的静态剖面，确定无需 WebGL 也能成立的最低保真度。'
  }),
  freezeDirection({
    id: 'optics-thermochromic',
    axis: 'optics',
    tier: 'HORIZON',
    name: '热致显影书',
    englishName: 'Thermochromic reveal book',
    coreStructure: '内容被温敏材料覆盖，手掌、环境温度或模拟热源经过后才短暂显现。',
    primaryAction: '按住、摩擦或沿路径移动热源，让隐藏信息逐渐显影并再次消退。',
    scenarios: ['气候教育', '身体记忆艺术', '安全验证', '亲密互动叙事'],
    technicalMechanism: '以热场网格记录局部温度和衰减，mask-opacity 根据阈值变化；实体版可用热致变色油墨。',
    largestRisk: '数字模拟容易失去触觉意义，实体材料则受环境温度、寿命和可逆性约束。',
    combinationSuggestion: ['透明叠层', '实时气候数据', '状态记忆书'],
    nextExperiment: '以指针轨迹建立会冷却的低分辨率热场，测试内容在 3–5 秒消退是否足以形成记忆感。',
    form: 'layers'
  }),
  freezeDirection({
    id: 'optics-scratch-reveal',
    axis: 'optics',
    tier: 'REMIX',
    name: '刮擦显影书',
    englishName: 'Scratch-reveal book',
    coreStructure: '不透明表层覆盖内容，读者必须以路径化动作擦除局部，而非一次性打开整页。',
    primaryAction: '持续刮擦感兴趣区域，自己决定答案出现的顺序和范围。',
    scenarios: ['谜题线索', '诊断图像', '抽奖仪式', '探索式地图'],
    technicalMechanism: '离屏 canvas 或 SVG mask 累积擦除笔触，同时计算已揭示面积并提供重置。',
    largestRisk: '自由刮擦可能导致键盘不可用、性能抖动和内容永远只露出一部分。',
    combinationSuggestion: ['镂空深度', '分支迷宫', '个性化版本'],
    nextExperiment: '对比自由刮擦与有限路径擦除，确定可访问性替代操作和完成判定阈值。',
    form: 'diecut'
  }),
  freezeDirection({
    id: 'optics-phosphorescent-afterimage',
    axis: 'optics',
    tier: 'HORIZON',
    name: '荧光余像书',
    englishName: 'Phosphorescent afterimage book',
    coreStructure: '页面被“光”写入后逐渐褪色，过去动作不会立刻消失，而以余辉留在当前阅读层。',
    primaryAction: '用光束扫过页面、合上再打开，观察短时记忆如何叠在新内容上。',
    scenarios: ['记忆主题艺术', '夜间星图', '动作轨迹教学', '诗歌余韵'],
    technicalMechanism: '衰减纹理缓存记录每帧曝光，使用时间常数降低亮度；实体版使用蓄光颜料。',
    largestRisk: '没有暗环境时余像难以感知，持续纹理更新也会增加 GPU 与电量消耗。',
    combinationSuggestion: ['状态记忆书', '万花折面', '身体编舞谱'],
    nextExperiment: '用 CSS/canvas 做 10 秒衰减轨迹，测试读者是否能看懂“前一次动作仍在影响本页”。',
    form: 'layers'
  }),
  freezeDirection({
    id: 'optics-shadow-casting',
    axis: 'optics',
    tier: 'REMIX',
    name: '投影成像书',
    englishName: 'Shadow-casting book',
    coreStructure: '立体纸构件本身并非最终画面；只有特定光位下，多个碎片的投影才拼出完整信息。',
    primaryAction: '移动光源或改变开页角度，让散乱构件的影子对齐成像。',
    scenarios: ['隐藏信息', '天文光影教学', '舞台式叙事', '博物馆装置'],
    technicalMechanism: '简化光源向量投射各构件轮廓，或用预制阴影图层按光位插值；正确区间触发对齐反馈。',
    largestRisk: '实时阴影计算成本高，二维近似若不可信会破坏“光创造内容”的核心惊喜。',
    combinationSuggestion: ['立体书', '镜面万花书', '时间敏感叙事'],
    nextExperiment: '只使用三个纸构件和一个水平光源滑杆，先验证影子拼字是否在无需说明时可被发现。',
    form: 'popup'
  }),

  // D · Combinatorial narrative & state
  freezeDirection({
    id: 'narrative-mix-and-match',
    axis: 'narrative',
    tier: 'LIVE',
    name: '分栏组合书',
    englishName: 'Mix-and-match split-page book',
    coreStructure: '页面被水平切成头部、身体、脚部等独立翻条，每条拥有自己的页序，组合数呈乘法增长。',
    primaryAction: '分别翻动任一栏，用局部变化创造新的角色、句子或方案。',
    scenarios: ['角色生成剧场', '穿搭搭配', '产品模块配置', '创意写作提示'],
    technicalMechanism: '每个分栏维护独立索引，统一状态把多个索引编码为组合 ID；切片需共享对齐基线。',
    largestRisk: '大量组合中多数可能无意义或视觉断裂，需要规则约束而不能只追求数量。',
    combinationSuggestion: ['立体角色剧场', '个性化生成版本', '程序化规则'],
    nextExperiment: '先实现 3 栏 × 5 状态共 125 种组合，并标记哪些组合值得保存或分享。',
    form: 'mixmatch'
  }),
  freezeDirection({
    id: 'narrative-branching-labyrinth',
    axis: 'narrative',
    tier: 'REMIX',
    name: '分支迷宫书',
    englishName: 'Branching labyrinth book',
    coreStructure: '每次开页都不是前进一页，而是选择一条空间路径；走过的路线成为可回看的个人地图。',
    primaryAction: '在多个洞口或页签中选择下一层，并可沿留下的线索返回分岔点。',
    scenarios: ['互动小说', '决策培训', '博物馆探索', '复杂流程导航'],
    technicalMechanism: '以有向图存储节点、边和访问历史；空间隧道负责表达深度，面包屑负责可逆导航。',
    largestRisk: '路径数量会指数增长，读者也可能因不知道错过了什么而产生焦虑。',
    combinationSuggestion: ['隧道书', '套层揭页', '协作覆写'],
    nextExperiment: '构建 7 节点、2 个回环的小图，测试路径地图能否让用户无损返回任一已访问节点。',
    form: 'tunnel'
  }),
  freezeDirection({
    id: 'narrative-palindrome',
    axis: 'narrative',
    tier: 'REMIX',
    name: '回文双向书',
    englishName: 'Palindrome book',
    coreStructure: '从前向后与从后向前都能成立，但同一页面在方向改变后产生不同含义。',
    primaryAction: '抵达中点后反向阅读，让先前事件在新语境下被重新解释。',
    scenarios: ['悬疑反转', '循环时间叙事', '正反论证', '诗歌实验'],
    technicalMechanism: '维护阅读方向和对称页配对，反向时重排转场、语态与强调元素但保持同一素材身份。',
    largestRisk: '结构约束可能压过内容，自称双向但逆读不成立会迅速失去可信度。',
    combinationSuggestion: ['无限循环书', '双首背靠背', '多视角证词'],
    nextExperiment: '只写 5 个节点，要求正读是出发、逆读是归来，再测试读者是否主动发现第二意义。',
    form: 'infinite'
  }),
  freezeDirection({
    id: 'narrative-stateful-memory',
    axis: 'narrative',
    tier: 'HORIZON',
    name: '有记忆的书',
    englishName: 'Stateful memory book',
    coreStructure: '书会记住读者触碰、停留、跳过与重读的内容，并让这些行为在后续页面留下痕迹。',
    primaryAction: '重复阅读或改变选择，观察书如何保留、淡化或回应过去行为。',
    scenarios: ['长期反思日记', '个性化学习', '关系叙事', '行为艺术档案'],
    technicalMechanism: '事件日志生成可解释的阅读状态，状态通过颜色、叠层和内容权重回写到后续视图。',
    largestRisk: '隐私、误推断与不可控持久化会让“记忆”变成监视，必须提供透明查看和清除。',
    combinationSuggestion: ['荧光余像', '协作覆写', '个性化生成版本'],
    nextExperiment: '仅记录三类本地事件，并增加可见的“这本书记得什么”面板和一键清空。',
    form: 'layers'
  }),
  freezeDirection({
    id: 'narrative-chrono-sensitive',
    axis: 'narrative',
    tier: 'REMIX',
    name: '时间敏感书',
    englishName: 'Chrono-sensitive book',
    coreStructure: '同一页根据时刻、季节、阅读间隔或倒计时呈现不同版本，时间成为不可见的翻页器。',
    primaryAction: '拨动时间轮或在不同时间回来，比较页面状态如何变化。',
    scenarios: ['物候历', '倒计时礼物', '轮班工作手册', '长期艺术项目'],
    technicalMechanism: '时间源映射到离散刻度或连续周期；轮盘可覆盖真实时间并用于预演所有状态。',
    largestRisk: '只有特定时刻可见的内容可能造成错失感，系统时区与离线状态也必须明确。',
    combinationSuggestion: ['旋转轮盘', '实时数据历书', '热致显影'],
    nextExperiment: '实现一个可手动预演的 24 小时时间轮，避免测试必须等待真实时间。',
    form: 'volvelle'
  }),
  freezeDirection({
    id: 'narrative-multiperspective-witness',
    axis: 'narrative',
    tier: 'REMIX',
    name: '多证词书',
    englishName: 'Multiperspective witness book',
    coreStructure: '同一事件由互不完全一致的多位见证者讲述，结构允许并置差异而不急于给出唯一真相。',
    primaryAction: '翻转、并排或同步拖动不同证词，寻找重合、遗漏与矛盾。',
    scenarios: ['历史教育', '冲突调解', '新闻素养', '复杂事故复盘'],
    technicalMechanism: '事件节点共享时间锚点，各视角保持独立叙述；差异层按主题和可信度做可解释标记。',
    largestRisk: '视觉对称可能被误读为观点等价，必须区分事实冲突、感受差异与证据强弱。',
    combinationSuggestion: ['双首背靠背', '透明叠层', '拉条真相机'],
    nextExperiment: '选择一个三节点事件，只提供两名证词与证据层，测试差异标记是否避免“各打五十大板”。',
    form: 'dosados'
  }),

  // E · Body, scale & environment
  freezeDirection({
    id: 'embodied-walk-through',
    axis: 'embodied',
    tier: 'HORIZON',
    name: '可步入地面书',
    englishName: 'Walk-through floor book',
    coreStructure: '页面被放大为房间或地面区块，读者以走动代替翻页，转身与回头成为重读。',
    primaryAction: '穿过门框、跨越折线或站到某个区域，触发下一页空间。',
    scenarios: ['展览导览', '儿童空间教育', '品牌快闪', '沉浸式档案'],
    technicalMechanism: '位置与朝向进入空间状态机，投影/AR/传感器把物理区域映射为页面节点。',
    largestRisk: '无障碍、容量与安全边界比视觉效果更重要，单人网页原型也无法证明多人现场体验。',
    combinationSuggestion: ['隧道书', '地点锚定 AR', '身体编舞谱'],
    nextExperiment: '先用键盘和俯视小地图模拟四个地面页，验证空间顺序是否比按钮导航更易记。',
    form: 'tunnel'
  }),
  freezeDirection({
    id: 'embodied-wearable',
    axis: 'embodied',
    tier: 'HORIZON',
    name: '可穿戴书',
    englishName: 'Wearable book',
    coreStructure: '书页附着在衣服、配件或身体关节上，展开动作与穿戴者姿态共同决定可读内容。',
    primaryAction: '抬臂、转身、环抱或展开衣片，让章节在身体上依次出现。',
    scenarios: ['时装叙事', '行为表演', '身份档案', '康复动作指导'],
    technicalMechanism: '姿态传感或摄像头关键点驱动折面状态；数字版以可访问的替代控件复现动作路径。',
    largestRisk: '身体数据敏感且姿态识别有偏差，错误要求也可能排除行动能力不同的读者。',
    combinationSuggestion: ['手风琴折本', '身体编舞谱', '触觉浮雕'],
    nextExperiment: '只选择“抬臂展开三折”一种动作，并提供等价按钮，比较两种输入的理解差异。',
    form: 'accordion'
  }),
  freezeDirection({
    id: 'embodied-site-anchored-ar',
    axis: 'embodied',
    tier: 'HORIZON',
    name: '场地锚定 AR 书',
    englishName: 'Site-anchored AR book',
    coreStructure: '书的章节不全部存在于册页中，而被锚定在建筑、街道、展品或自然地点上。',
    primaryAction: '带着书抵达指定地点，将页面与现场对准，解锁只属于该处的叠层。',
    scenarios: ['城市文化路线', '遗址复原', '生态观察', '校园导览'],
    technicalMechanism: 'GPS/视觉锚点确认场地，设备姿态将内容图层注册到现实坐标，并缓存离线降级版本。',
    largestRisk: '定位漂移、网络与设备权限会直接中断阅读，场地变化也可能让内容永久失效。',
    combinationSuggestion: ['双首背靠背', '可重组书帖', '实时数据历书'],
    nextExperiment: '先用一张打印标记和单个透明叠层，验证从书页到现场对象的空间对应是否清楚。'
  }),
  freezeDirection({
    id: 'embodied-two-person-cooperative',
    axis: 'embodied',
    tier: 'REMIX',
    name: '双人协作书',
    englishName: 'Two-person cooperative book',
    coreStructure: '页面故意不能被单人完整开启；两侧输入必须在时间、方向或力度上协调。',
    primaryAction: '两人分别控制一扇门或一条叙事线，同步到达阈值后共同揭晓。',
    scenarios: ['关系工作坊', '亲子共读', '团队培训', '双人解谜'],
    technicalMechanism: '两个独立输入流进入同步判定，网络版需处理延迟、缺席与重连，单设备版用多点触控。',
    largestRisk: '强制合作会让单人和辅助技术用户无法进入，必须提供不削弱意义的替代模式。',
    combinationSuggestion: ['对开门书', '双首背靠背', '多证词书'],
    nextExperiment: '将左右门分成两个独立拖拽区，并提供“模拟伙伴”辅助，测量协作是否产生真实沟通。',
    form: 'gatefold'
  }),
  freezeDirection({
    id: 'embodied-choreographic-score',
    axis: 'embodied',
    tier: 'REMIX',
    name: '身体编舞谱书',
    englishName: 'Choreographic score book',
    coreStructure: '页面不是描述动作，而是以时间、方向、力度和空间轨迹直接编排读者身体。',
    primaryAction: '跟随连续翻动的动作帧执行姿态，再回看自身动作留下的轨迹。',
    scenarios: ['舞蹈教学', '体育动作分解', '表演艺术', '康复训练'],
    technicalMechanism: '翻动画册提供时序，轨迹线编码空间路径；可选姿态检测只用于反馈而不是准入。',
    largestRisk: '动作指令如果脱离能力差异与安全提示，可能造成挫败或伤害。',
    combinationSuggestion: ['翻动画册', '荧光余像', '可穿戴书'],
    nextExperiment: '把一个 12 帧动作拆成准备、发力、缓冲三段，并验证不用视频也能被准确模仿。',
    form: 'flipbook'
  }),
  freezeDirection({
    id: 'embodied-tactile-relief',
    axis: 'embodied',
    tier: 'HORIZON',
    name: '触觉浮雕书',
    englishName: 'Tactile-relief book',
    coreStructure: '信息以可触摸的高度、纹理、边界和温度编码，视觉只是其中一种读取通道。',
    primaryAction: '沿轮廓触摸和比较纹理，通过空间触感建立对象关系。',
    scenarios: ['无障碍图册', '地形与建筑教学', '材料档案', '幼儿感官阅读'],
    technicalMechanism: '实体使用压凸、激光切割或触觉材料；网页原型以高度图、声音与触觉设备反馈做有限映射。',
    largestRisk: '纯视觉屏幕无法验证真正触觉质量，模拟器只能说明信息架构而不能宣称已实现体验。',
    combinationSuggestion: ['立体书', '贝叶扇形书', '可步入地面书'],
    nextExperiment: '输出三种实体纹理小样并配套数字音频标签，邀请低视力用户共同评估编码差异。',
    form: 'popup'
  }),

  // F · Data, generation & living books
  freezeDirection({
    id: 'generative-live-data-almanac',
    axis: 'generative',
    tier: 'REMIX',
    name: '实时数据历书',
    englishName: 'Live-data almanac',
    coreStructure: '传统历书的固定图表改为持续接收天气、生态、交通或个人传感数据的活页。',
    primaryAction: '拨动时间与地点，比较实时值、历史基线和未来情景。',
    scenarios: ['气候观察', '运营指挥', '家庭能源报告', '公民科学'],
    technicalMechanism: '数据适配层统一采样、单位与时间戳，轮盘和叠层分别承担选择与解释；离线显示最后更新时间。',
    largestRisk: '数据延迟、错误与不确定性容易被漂亮动效掩盖，来源和时间必须始终可见。',
    combinationSuggestion: ['旋转轮盘', '热致显影', '透明叠层'],
    nextExperiment: '接入一组静态气候夹具，先验证正常、过期、缺失三种数据状态的叙事是否诚实。',
    form: 'volvelle'
  }),
  freezeDirection({
    id: 'generative-semantic-zoom',
    axis: 'generative',
    tier: 'REMIX',
    name: '语义缩放书',
    englishName: 'Semantic-zoom book',
    coreStructure: '缩放不是简单放大字体，而是在概览、章节、证据和原始材料之间切换信息语义。',
    primaryAction: '向内推进以获得证据，向外退回以重新看见全局关系。',
    scenarios: ['研究报告', '产品架构', '历史档案', '复杂系统教育'],
    technicalMechanism: '每个缩放层级对应独立内容模型和转场锚点；隧道深度连接同一对象的多尺度表示。',
    largestRisk: '层级切换若改变对象位置会破坏连续性，用户也可能不知道更深处仍有内容。',
    combinationSuggestion: ['隧道书', '镂空书', '分支迷宫'],
    nextExperiment: '对一个主题只做概览、解释、证据三层，验证共享锚点能否保留对象恒常性。',
    form: 'diecut'
  }),
  freezeDirection({
    id: 'generative-personal-edition',
    axis: 'generative',
    tier: 'HORIZON',
    name: '个性化生成版本',
    englishName: 'Personalized generative edition',
    coreStructure: '相同内容种子根据读者目标、能力、历史与审美规则编排成不同但可追溯的版本。',
    primaryAction: '选择需求并生成一册，可比较“为什么我的版本与他人不同”。',
    scenarios: ['个性化学习', '旅行计划', '儿童故事', '产品配置提案'],
    technicalMechanism: '约束式生成器选择模块、语气和难度，版本清单记录来源、规则与可复现随机种子。',
    largestRisk: '过度个性化形成信息茧房，模型错误和不可解释选择会损害出版物可信度。',
    combinationSuggestion: ['分栏组合书', '可重组书帖', '有记忆的书'],
    nextExperiment: '不用模型，先用明确规则生成三种读者版本，并让每个差异都能被解释。',
    form: 'mixmatch'
  }),
  freezeDirection({
    id: 'generative-collaborative-palimpsest',
    axis: 'generative',
    tier: 'HORIZON',
    name: '协作覆写本',
    englishName: 'Collaborative palimpsest',
    coreStructure: '多人批注、删改和重写不覆盖旧版本，而是像羊皮纸覆写一样留下可追踪的透明时间层。',
    primaryAction: '写入当前层、降低旧层透明度，或沿时间轴还原任一版本。',
    scenarios: ['社区档案', '共同创作', '设计评审', '公共记忆工程'],
    technicalMechanism: '不可变事件日志生成版本图，叠层按作者与时间过滤；冲突并置而不是静默覆盖。',
    largestRisk: '权属、骚扰、隐私与撤回权远比视觉叠层复杂，必须先设计治理再设计规模。',
    combinationSuggestion: ['透明叠层', '可重组书帖', '有记忆的书'],
    nextExperiment: '限定三位匿名参与者和五次编辑，验证版本来源、撤回与冲突提示是否足够清楚。',
    form: 'layers'
  }),
  freezeDirection({
    id: 'generative-procedural-worldbook',
    axis: 'generative',
    tier: 'HORIZON',
    name: '程序化世界书',
    englishName: 'Procedural worldbook',
    coreStructure: '页面是同一套世界规则的局部观测；每次进入可以生成新地点，但地理、生态与历史因果保持一致。',
    primaryAction: '沿循环页探索并改变世界，回到旧地点时看到规则累积的后果。',
    scenarios: ['游戏设定集', '系统思维教学', '生成式地图', '科幻叙事实验'],
    technicalMechanism: '确定性随机种子、规则图和持久化状态共同生成页面；无限环结构负责空间回访。',
    largestRisk: '内容数量增加不等于意义增加，规则漏洞也会在长时间探索中放大。',
    combinationSuggestion: ['无限循环书', '镜面万花书', '场地锚定 AR'],
    nextExperiment: '只定义三条世界规则和六个地点，验证回访时能否看见清晰、可解释的因果变化。',
    form: 'infinite'
  }),
  freezeDirection({
    id: 'generative-agentic-manuscript',
    axis: 'generative',
    tier: 'HORIZON',
    name: '代理型活稿',
    englishName: 'Agentic living manuscript',
    coreStructure: '书拥有持续目标，会主动收集新材料、提出问题、修订章节并向读者请求判断。',
    primaryAction: '审阅书提出的改写与证据请求，批准、拒绝或纠正其下一步。',
    scenarios: ['长期研究助手', '动态操作手册', '个人知识传记', '持续更新展览'],
    technicalMechanism: '代理工作流把检索、论证、版本提交和人工审批分开；每次改写保留证据链和回滚点。',
    largestRisk: '未经批准的自动改写会污染知识、制造错误来源并模糊作者责任。',
    combinationSuggestion: ['实时数据历书', '协作覆写本', '个性化生成版本'],
    nextExperiment: '只允许代理提出带来源的章节补丁，不允许自动发布，并评估十次建议的采纳与纠错成本。'
  })
]);

export const COMBINATIONS = Object.freeze([
  freezeCombination({
    id: 'combo-climate-memory-almanac',
    name: '气候记忆历书',
    problem: '抽象气候数据难以被感知为正在发生、且会留下痕迹的长期变化。',
    mechanism: '轮盘选择日期，实时数据写入透明层，热场让异常值像短暂伤痕一样显影。',
    risk: '感性显影可能夸大单日波动，必须同时展示基线、不确定性与来源。',
    directions: ['generative-live-data-almanac', 'optics-thermochromic', 'narrative-stateful-memory']
  }),
  freezeCombination({
    id: 'combo-city-day-night-slice',
    name: '城市昼夜切片',
    problem: '同一地点在昼夜中的人群、光线与声音差异难以同时比较。',
    mechanism: '百叶叶片连续切换昼夜图像，角度中点混合两套声景并显示时间刻度。',
    risk: '声画同步和条带密度处理不好会产生认知噪声与眩目。',
    directions: ['topology-venetian-blind', 'narrative-chrono-sensitive', 'embodied-site-anchored-ar']
  }),
  freezeCombination({
    id: 'combo-product-truth-machine',
    name: '产品真相机',
    problem: '产品宣传经常把外观、内部结构、供应链和限制拆成互不相干的信息。',
    mechanism: '拉条剖开外壳，镂空窗口追踪内部层，并切换品牌、工人和维修者三种证词。',
    risk: '视角并置不能替代证据核验，也不能把事实问题包装成审美冲突。',
    directions: ['mechanism-pull-tab', 'optics-scratch-reveal', 'narrative-multiperspective-witness']
  }),
  freezeCombination({
    id: 'combo-character-theatre',
    name: '角色组合剧场',
    problem: '角色创作工具常提供大量选项，却缺少组合后立即可见的叙事后果。',
    mechanism: '分栏改变头、身、足，选定组合后立体舞台升起对应场景与一句行动提示。',
    risk: '部件库可能固化身份刻板印象，需要语义规则与内容审查。',
    directions: ['narrative-mix-and-match', 'mechanism-paper-automata', 'generative-personal-edition']
  }),
  freezeCombination({
    id: 'combo-privacy-permission-book',
    name: '隐私权限书',
    problem: '权限弹窗只有允许/拒绝，不能表达不同数据范围与后续影响。',
    mechanism: '虹膜决定暴露范围，透明层分别说明数据、用途与保留时间，系统记住并可撤销选择。',
    risk: '戏剧化界面不能拖慢或诱导关键隐私决定。',
    directions: ['mechanism-iris-aperture', 'narrative-stateful-memory', 'generative-semantic-zoom']
  }),
  freezeCombination({
    id: 'combo-causal-waterfall',
    name: '因果瀑布',
    problem: '流程图能显示步骤，却很难说明一次变化如何逐级影响后续指标。',
    mechanism: '瀑布卡依次翻过，每一片携带当时数据与对下一片的因果注释。',
    risk: '线性瀑布会过度简化真实系统中的反馈回路。',
    directions: ['mechanism-waterfall', 'generative-live-data-almanac', 'topology-jacobs-ladder']
  }),
  freezeCombination({
    id: 'combo-double-faced-museum',
    name: '双面博物馆',
    problem: '展品官方说明与物件原属社区的记忆往往不能在同一观看位置相遇。',
    mechanism: '双首书的一端为馆方目录、另一端为社区证词；到达展品现场后解锁叠加材料。',
    risk: '机构若控制所有编辑权，双面结构可能只制造参与假象。',
    directions: ['topology-dos-a-dos', 'embodied-site-anchored-ar', 'narrative-multiperspective-witness']
  }),
  freezeCombination({
    id: 'combo-misconception-ladder',
    name: '误解阶梯',
    problem: '纠错内容常直接给答案，读者看不到错误信念如何逐步崩解。',
    mechanism: '雅各布梯的每次级联翻面暴露一条反证，并让多名证人的重合处形成结论。',
    risk: '机械节奏可能把复杂争议压成过于确定的单一路线。',
    directions: ['topology-jacobs-ladder', 'narrative-multiperspective-witness', 'mechanism-waterfall']
  }),
  freezeCombination({
    id: 'combo-three-state-science',
    name: '三态科学折面',
    problem: '三种稳定状态及其转换关系常被拆成三张互不关联的图。',
    mechanism: '万花折面在三组隐藏面间循环，程序规则阻止不可能的跳转并解释转换条件。',
    risk: '折面拓扑可能盖过科学模型，必须让每一折与真实转换条件对应。',
    directions: ['mechanism-flexagon', 'generative-procedural-worldbook', 'generative-semantic-zoom']
  }),
  freezeCombination({
    id: 'combo-living-travel-archive',
    name: '活的旅行档案',
    problem: '旅行记录按日期堆积，难以随着地点重访和同行者补充而重新组织。',
    mechanism: '可重组书帖按地点重排，现场 AR 解锁旧记录，协作者以可追踪层补写。',
    risk: '位置隐私、共同记忆归属和长期链接失效都需要治理。',
    directions: ['topology-reconfigurable-signatures', 'embodied-site-anchored-ar', 'generative-collaborative-palimpsest']
  }),
  freezeCombination({
    id: 'combo-touch-memory-garden',
    name: '触摸记忆花园',
    problem: '数字纪念空间往往只保存静态文本，缺少时间、动作与消逝感。',
    mechanism: '触碰为页面写入会衰减的余光，书只保留经过同意的短期行为痕迹。',
    risk: '把哀伤行为量化或永久存储会造成伦理伤害。',
    directions: ['narrative-stateful-memory', 'optics-phosphorescent-afterimage', 'embodied-tactile-relief']
  }),
  freezeCombination({
    id: 'combo-two-person-reconciliation',
    name: '双人和解书',
    problem: '冲突双方常各自讲述，缺少必须同时在场才能完成的共同阅读动作。',
    mechanism: '双方分别从双首书进入，在共享中缝同步开启对开门，再查看证词差异层。',
    risk: '合作机制不能强迫和解，也不能替代专业调解与安全边界。',
    directions: ['embodied-two-person-cooperative', 'topology-dos-a-dos', 'narrative-multiperspective-witness']
  })
]);

const AXIS_BY_ID = new Map(AXES.map((axis) => [axis.id, axis]));
const DIRECTION_BY_ID = new Map(DIRECTIONS.map((direction) => [direction.id, direction]));
const COMBINATION_BY_ID = new Map(COMBINATIONS.map((combination) => [combination.id, combination]));

function normalizedToken(value) {
  return String(value ?? '').trim().toLowerCase();
}

function directionSearchText(direction) {
  return [
    direction.id,
    direction.name,
    direction.englishName,
    direction.coreStructure,
    direction.primaryAction,
    direction.technicalMechanism,
    direction.largestRisk,
    direction.nextExperiment,
    direction.form,
    ...direction.scenarios,
    ...direction.combinationSuggestion
  ].join('\n').toLowerCase();
}

/** Return an axis or null; never exposes a mutable copy. */
export function getAxisById(axisId) {
  return AXIS_BY_ID.get(normalizedToken(axisId)) ?? null;
}

/** Return a direction or null; never exposes a mutable copy. */
export function getDirectionById(directionId) {
  return DIRECTION_BY_ID.get(normalizedToken(directionId)) ?? null;
}

/** Return a named combination or null. */
export function getCombinationById(combinationId) {
  return COMBINATION_BY_ID.get(normalizedToken(combinationId)) ?? null;
}

/**
 * Filter directions without coupling the data module to any DOM.
 * Unknown axis/tier/form values intentionally yield an empty list.
 */
export function getDirections({ axis, tier, form, query } = {}) {
  const axisToken = normalizedToken(axis);
  const tierToken = normalizedToken(tier).toUpperCase();
  const formToken = normalizedToken(form);
  const queryToken = normalizedToken(query);

  return DIRECTIONS.filter((direction) => {
    if (axisToken && axisToken !== 'all' && direction.axis !== axisToken) return false;
    if (tierToken && tierToken !== 'ALL' && direction.tier !== tierToken) return false;
    if (formToken && formToken !== 'all' && direction.form !== formToken) return false;
    if (queryToken && !directionSearchText(direction).includes(queryToken)) return false;
    return true;
  });
}

export function getDirectionsForForm(formName) {
  return getDirections({ form: formName });
}

export function getCombinationsForDirection(directionId) {
  const token = normalizedToken(directionId);
  if (!DIRECTION_BY_ID.has(token)) return [];
  return COMBINATIONS.filter((combination) => combination.directions.includes(token));
}

/** A small serialisable snapshot for UI badges and tests. */
export function directionStats() {
  const byTier = Object.fromEntries(TIERS.map((tier) => [tier, 0]));
  const byAxis = Object.fromEntries(AXES.map((axis) => [axis.id, 0]));
  const mappedForms = new Set();
  let mappedDirections = 0;

  DIRECTIONS.forEach((direction) => {
    byTier[direction.tier] += 1;
    byAxis[direction.axis] += 1;
    if (direction.form) {
      mappedDirections += 1;
      mappedForms.add(direction.form);
    }
  });

  return Object.freeze({
    total: DIRECTIONS.length,
    axes: AXES.length,
    combinations: COMBINATIONS.length,
    mappedDirections,
    mappedForms: mappedForms.size,
    byTier: Object.freeze(byTier),
    byAxis: Object.freeze(byAxis)
  });
}

/**
 * Pure validation so build/tests can turn taxonomy assumptions into evidence.
 * Returns every issue instead of failing at the first one.
 */
export function validateCreativeDirectionData() {
  const issues = [];
  const axisIds = new Set();
  const directionIds = new Set();
  const combinationIds = new Set();
  const requiredTextFields = [
    'id',
    'axis',
    'tier',
    'name',
    'englishName',
    'coreStructure',
    'primaryAction',
    'technicalMechanism',
    'largestRisk',
    'nextExperiment'
  ];

  AXES.forEach((axis) => {
    if (!axis.id || axisIds.has(axis.id)) issues.push(`Invalid or duplicate axis id: ${axis.id}`);
    axisIds.add(axis.id);
  });

  DIRECTIONS.forEach((direction) => {
    if (!direction.id || directionIds.has(direction.id)) issues.push(`Invalid or duplicate direction id: ${direction.id}`);
    directionIds.add(direction.id);
    requiredTextFields.forEach((field) => {
      if (typeof direction[field] !== 'string' || !direction[field].trim()) {
        issues.push(`${direction.id || '(unknown direction)'} is missing ${field}`);
      }
    });
    if (!axisIds.has(direction.axis)) issues.push(`${direction.id} references unknown axis ${direction.axis}`);
    if (!TIERS.includes(direction.tier)) issues.push(`${direction.id} has invalid tier ${direction.tier}`);
    if (!Array.isArray(direction.scenarios) || direction.scenarios.length < 2) {
      issues.push(`${direction.id} needs at least two scenarios`);
    }
    if (!Array.isArray(direction.combinationSuggestion) || direction.combinationSuggestion.length < 2) {
      issues.push(`${direction.id} needs at least two combination suggestions`);
    }
    if (direction.form && !DEMO_FORMS.includes(direction.form)) {
      issues.push(`${direction.id} references unknown form ${direction.form}`);
    }
  });

  COMBINATIONS.forEach((combination) => {
    if (!combination.id || combinationIds.has(combination.id)) {
      issues.push(`Invalid or duplicate combination id: ${combination.id}`);
    }
    combinationIds.add(combination.id);
    ['name', 'problem', 'mechanism', 'risk'].forEach((field) => {
      if (typeof combination[field] !== 'string' || !combination[field].trim()) {
        issues.push(`${combination.id || '(unknown combination)'} is missing ${field}`);
      }
    });
    if (!Array.isArray(combination.directions) || combination.directions.length < 2) {
      issues.push(`${combination.id} needs at least two direction ids`);
    } else {
      combination.directions.forEach((directionId) => {
        if (!directionIds.has(directionId)) issues.push(`${combination.id} references unknown direction ${directionId}`);
      });
    }
  });

  AXES.forEach((axis) => {
    const count = DIRECTIONS.filter((direction) => direction.axis === axis.id).length;
    if (count !== 6) issues.push(`${axis.id} should contain 6 directions, found ${count}`);
  });

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    stats: directionStats()
  });
}

export function assertCreativeDirectionData() {
  const report = validateCreativeDirectionData();
  if (!report.valid) {
    throw new Error(`Creative direction data is invalid:\n- ${report.issues.join('\n- ')}`);
  }
  return report.stats;
}
