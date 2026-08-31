import {
  applyStripChainState,
  clampStripValue,
  createStripChain
} from './strip-surface-engine.mjs';

export const SURFACE_ORDER = Object.freeze([
  'label-peel',
  'fold-map',
  'split-curtain',
  'comparison-blind',
  'accordion-timeline',
  'material-wall',
  'box-net',
  'portal',
  'rollup-poster',
  'radial-fan',
  'tearoff-coupon',
  'data-ribbon'
]);

export const MATERIAL_ORDER = Object.freeze(['paper', 'card', 'vellum', 'textile', 'foil']);

export const MATERIAL_DEFINITIONS = Object.freeze({
  paper: Object.freeze({
    name: '柔性纸',
    englishName: 'Paper',
    thickness: 1,
    opacity: 1,
    stiffness: 0.62,
    curl: 0.86,
    texture: 'fiber',
    reflection: 0.16,
    translucency: 0.02,
    boundary: '纸纤维、厚度与曲率均为 CSS 视觉近似。'
  }),
  card: Object.freeze({
    name: '硬卡纸',
    englishName: 'Card',
    thickness: 3.2,
    opacity: 1,
    stiffness: 0.94,
    curl: 0.48,
    texture: 'pressed',
    reflection: 0.11,
    translucency: 0,
    boundary: '较高刚度只改变视觉响应，不计算真实弯曲模量。'
  }),
  vellum: Object.freeze({
    name: '透明胶片',
    englishName: 'Vellum',
    thickness: 0.72,
    opacity: 0.7,
    stiffness: 0.68,
    curl: 0.76,
    texture: 'translucent',
    reflection: 0.3,
    translucency: 0.48,
    boundary: '透明度与叠色为 CSS 合成近似，不包含真实折射。'
  }),
  textile: Object.freeze({
    name: '织物',
    englishName: 'Textile',
    thickness: 1.7,
    opacity: 0.96,
    stiffness: 0.24,
    curl: 1.26,
    texture: 'woven',
    reflection: 0.08,
    translucency: 0.05,
    boundary: '仅表达织物视觉与低刚度；不是布料、自碰撞或任意褶皱仿真。'
  }),
  foil: Object.freeze({
    name: '金属薄片',
    englishName: 'Foil',
    thickness: 0.5,
    opacity: 0.98,
    stiffness: 0.46,
    curl: 1.08,
    texture: 'metallic',
    reflection: 0.88,
    translucency: 0,
    boundary: '高光与金属感为 CSS 视觉近似，不是 PBR 或真实塑性形变。'
  })
});

function definition(value) {
  return Object.freeze(value);
}

export const SURFACE_DEFINITIONS = Object.freeze({
  'label-peel': definition({
    name: '撕贴标签',
    kicker: 'CORNER LABEL PEEL',
    title: '从角点揭开产品的第二层信息。',
    dek: '十四条双面带沿固定斜向传播曲率，显露背胶面与包装底层。',
    accent: '#ef674f',
    action: '揭开标签',
    kind: 'release',
    progressLabel: '剥离行程',
    release: '回弹、吸附或脱离',
    dragAxis: 'diagonal',
    dragDirection: -1,
    gesture: '从右下向左上剥离',
    anchor: '右下角点',
    slicing: '14 条固定斜向双面条带',
    deformation: '局部剥离与卷曲传播',
    topology: '单片标签覆盖单一底层',
    boundary: 'CSS 只验证固定方向角点剥离；任意方向纸角曲面需要 WebGL 网格。',
    fallbackProgress: 0.72
  }),
  'fold-map': definition({
    name: '折叠地图',
    kicker: 'MULTI-HINGE MAP',
    title: '八个折面展开成一条连续路线。',
    dek: '山折与谷折交替，跨面路线和站点随展开进度进入视野。',
    accent: '#d8873f',
    action: '展开下一折',
    kind: 'cycle',
    maxStep: 7,
    progressLabel: '地图展开',
    release: '折痕吸附',
    dragAxis: 'x',
    dragDirection: 1,
    gesture: '向右展开折面',
    anchor: '左侧边缘',
    slicing: '8 个等宽铰链面',
    deformation: '交替山折 / 谷折',
    topology: '八面连续长卷',
    boundary: '多铰链为刚性面近似，不计算纸张自碰撞。',
    fallbackProgress: 1
  }),
  'split-curtain': definition({
    name: '双向条带幕布',
    kicker: 'SPLIT STRIP CURTAIN',
    title: '二十条褶带从中央向两侧退场。',
    dek: '左右各十条镜像带共享开合进度，中央舞台随间隙扩大而出现。',
    accent: '#b64f68',
    action: '拉开幕布',
    kind: 'toggle',
    progressLabel: '中央开场',
    release: '两端吸附',
    dragAxis: 'split',
    dragDirection: 1,
    gesture: '从中央向外拉幕',
    anchor: '左右外缘',
    slicing: '左右各 10 条纵向带',
    deformation: '镜像聚拢与条带褶曲',
    topology: '双片对称表面',
    boundary: '这是条带褶幕近似，不是连续布料、自碰撞或任意褶皱仿真。',
    fallbackProgress: 1
  }),
  'comparison-blind': definition({
    name: '对比百叶屏',
    kicker: 'COMPARISON BLIND',
    title: '十八片百叶在两个状态之间换面。',
    dek: '每片叶片拥有独立正反面，连续旋转让前后对比保持同一空间坐标。',
    accent: '#397e9e',
    action: '切换到背面状态',
    kind: 'toggle',
    progressLabel: '百叶换面',
    release: '正反面吸附',
    dragAxis: 'x',
    dragDirection: 1,
    gesture: '横向翻转叶片',
    anchor: '水平中轴',
    slicing: '18 片双面纵向叶片',
    deformation: '同步翻面与轻微错峰',
    topology: '并列独立叶片',
    boundary: '叶片是刚性条带，不模拟柔性屏风。',
    fallbackProgress: 1
  }),
  'accordion-timeline': definition({
    name: '手风琴时间轴',
    kicker: 'ACCORDION TIMELINE',
    title: '七个事件沿折线依次展开。',
    dek: '每个铰链面承载一个节点，离散 step 决定当前事件与已展开历史。',
    accent: '#9a659f',
    action: '展开下一事件',
    kind: 'cycle',
    maxStep: 6,
    progressLabel: '事件进度',
    release: '逐折吸附',
    dragAxis: 'x',
    dragDirection: 1,
    gesture: '向右展开事件',
    anchor: '首个事件',
    slicing: '7 个事件折面',
    deformation: '多铰链连续展开',
    topology: '线性事件链',
    boundary: '只验证空间顺序，不替代完整时间轴信息架构。',
    fallbackProgress: 1
  }),
  'material-wall': definition({
    name: '材质样本墙',
    kicker: 'MATERIAL SAMPLE WALL',
    title: '八块样本在同一面墙上比较纹理与反射。',
    dek: '选择样本会改变翻转、突出和高光方向；全局材质预设仍独立生效。',
    accent: '#a86d43',
    action: '选择下一块样本',
    kind: 'cycle',
    maxStep: 7,
    progressLabel: '样本选择',
    release: '网格吸附',
    dragAxis: 'x',
    dragDirection: 1,
    gesture: '横向选择样本',
    anchor: '墙面网格',
    slicing: '8 块独立样本',
    deformation: '局部翻出与材质切换',
    topology: '2 × 4 样本网格',
    boundary: '纹理、高光和透明度是 CSS 视觉说明，不是扫描材质或物理测量。',
    fallbackProgress: 1
  }),
  'box-net': definition({
    name: '包装盒展开',
    kicker: 'BOX TO NET',
    title: '六个铰接面从盒体展开成十字平面。',
    dek: '底面保持锚定，前后左右与顶盖沿各自折线转到包装说明图。',
    accent: '#4b8e77',
    action: '展开包装盒',
    kind: 'toggle',
    progressLabel: '盒体展开',
    release: '盒体 / 平面吸附',
    dragAxis: 'y',
    dragDirection: 1,
    gesture: '向下展开盒网',
    anchor: '中央底面',
    slicing: '6 个盒体面板',
    deformation: '多轴刚性铰接',
    topology: '六面体到十字 net',
    boundary: '不计算面板碰撞、锁扣与真实纸盒厚度。',
    fallbackProgress: 1
  }),
  portal: definition({
    name: '层叠传送门',
    kicker: 'LAYERED PORTAL',
    title: '六层空间框把前景过渡到另一幅场景。',
    dek: '推进时框层穿越观察面，阈值后背面场景进入中央窗口。',
    accent: '#6559bd',
    action: '穿过表面',
    kind: 'toggle',
    progressLabel: '穿越阈值',
    release: '入口 / 背景吸附',
    dragAxis: 'y',
    dragDirection: -1,
    gesture: '向上穿越表面',
    anchor: '中心视线',
    slicing: '6 个同心空间框',
    deformation: '纵深推进与阈值揭示',
    topology: '分层框连接两幅平面场景',
    boundary: '只验证 CSS 空间阈值和背面揭示；不是真实三维场景连续穿越。',
    fallbackProgress: 0.72
  }),
  'rollup-poster': definition({
    name: '卷轴海报',
    kicker: 'ROLL-UP POSTER',
    title: '十二条横向带从上缘卷起。',
    dek: '横向带共享卷曲与逐带光照，底层信息随卷轴行程出现。',
    accent: '#d4604c',
    action: '卷起海报',
    kind: 'toggle',
    progressLabel: '卷轴行程',
    release: '顶边 / 展开态吸附',
    dragAxis: 'y',
    dragDirection: -1,
    gesture: '向上卷起海报',
    anchor: '顶部卷轴',
    slicing: '12 条横向双面带',
    deformation: '边缘卷起与曲率传播',
    topology: '单片长幅表面',
    boundary: '卷曲沿单一轴传播，不模拟纸筒接触和自碰撞。',
    fallbackProgress: 0.72
  }),
  'radial-fan': definition({
    name: '径向样本扇',
    kicker: 'RADIAL SAMPLE FAN',
    title: '十个样本围绕同一铆钉展开。',
    dek: '每片样本获得固定极角，当前 step 把目标材质带到前景。',
    accent: '#cc8545',
    action: '选择下一扇片',
    kind: 'cycle',
    maxStep: 9,
    progressLabel: '扇片选择',
    release: '角度吸附',
    dragAxis: 'x',
    dragDirection: 1,
    gesture: '横向展开扇片',
    anchor: '底部铆钉',
    slicing: '10 个径向扇片',
    deformation: '围绕单点旋开',
    topology: '单铰点放射页片',
    boundary: '扇片为刚性样本，不模拟互相挤压。',
    fallbackProgress: 1
  }),
  'tearoff-coupon': definition({
    name: '撕取优惠券',
    kicker: 'TEAR-OFF COUPON',
    title: '沿穿孔拉动，并让票券真正进入脱离态。',
    dek: '连续行程先拉伸连接区；达到释放状态后票券成为独立对象。',
    accent: '#db7043',
    action: '沿穿孔撕取',
    kind: 'release',
    progressLabel: '撕取行程',
    release: '阈值脱离',
    dragAxis: 'x',
    dragDirection: 1,
    gesture: '沿穿孔向右撕取',
    anchor: '左侧存根',
    slicing: '存根、穿孔与活动票券',
    deformation: '位移、轻卷与拓扑脱离',
    topology: '可分离双片',
    boundary: '只表达释放阈值，不模拟真实纸纤维断裂。',
    fallbackProgress: 1
  }),
  'data-ribbon': definition({
    name: '数据丝带',
    kicker: 'DATA RIBBON',
    title: '八个数据节点沿可变路径依次显现。',
    dek: '丝带曲率把数值变化变成空间节奏，step 负责当前节点与已读路径。',
    accent: '#417fbe',
    action: '推进下一数据点',
    kind: 'cycle',
    maxStep: 7,
    progressLabel: '数据路径',
    release: '节点吸附',
    dragAxis: 'x',
    dragDirection: 1,
    gesture: '沿路径横向推进',
    anchor: '首个数据点',
    slicing: '8 个路径节点与 7 段连接',
    deformation: '路径起伏与节点推进',
    topology: '单条连续数据路径',
    boundary: '当前数据为演示上下文，不代表实时数据服务。',
    fallbackProgress: 1
  })
});

const DEFAULT_CONTEXT = Object.freeze({
  id: 'portfolio',
  kicker: 'DEFORMABLE CONTEXT',
  title: '同一内容，换一种空间表面。',
  front: '表层信息',
  back: '背面信息',
  detail: '隐藏结构',
  labels: Object.freeze([])
});

const TIMELINE_COPY = Object.freeze(['起点', '发现', '转向', '试作', '验证', '发布', '继续']);
const MAP_COPY = Object.freeze(['入口', '河岸', '市集', '山径', '剧场', '塔楼', '码头', '终点']);
const MATERIAL_COPY = Object.freeze(['亚麻纹', '细砂纹', '高光面', '雾面', '压纹', '半透明', '金属光', '织物格']);
const RIBBON_COPY = Object.freeze(['12', '28', '19', '44', '37', '63', '58', '82']);

function node(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function add(parent, child) {
  parent.append(child);
  return child;
}

function numberedLabel(index, text, className = 'deformable-surface__label') {
  const label = node('span', className);
  add(label, node('b', '', String(index + 1).padStart(2, '0')));
  add(label, node('span', '', text));
  return label;
}

function safeAccent(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const candidate = value.trim();
  return /^#[0-9a-f]{3,8}$/i.test(candidate) ? candidate : fallback;
}

function stringValue(value, fallback) {
  const text = typeof value === 'string' ? value.trim() : '';
  return text ? text.slice(0, 160) : fallback;
}

function normalizeContext(context) {
  if (typeof context === 'string') {
    return { ...DEFAULT_CONTEXT, id: context.slice(0, 48), title: context.slice(0, 160) };
  }
  if (!context || typeof context !== 'object') return { ...DEFAULT_CONTEXT };
  const pages = Array.isArray(context.pages) ? context.pages : [];
  const labels = Array.isArray(context.labels) ? context.labels.map((item) => String(item).slice(0, 80)) : [];
  return {
    id: stringValue(context.id ?? context.scene ?? context.key, DEFAULT_CONTEXT.id).slice(0, 48),
    kicker: stringValue(context.kicker, DEFAULT_CONTEXT.kicker),
    title: stringValue(context.title, DEFAULT_CONTEXT.title),
    front: stringValue(context.front ?? pages[0]?.[1], DEFAULT_CONTEXT.front),
    back: stringValue(context.back ?? pages[1]?.[1], DEFAULT_CONTEXT.back),
    detail: stringValue(context.detail ?? context.dek ?? pages[0]?.[2], DEFAULT_CONTEXT.detail),
    labels
  };
}

function assertSurface(surfaceId) {
  const selected = SURFACE_DEFINITIONS[surfaceId];
  if (!selected) throw new RangeError(`Unknown deformable surface: ${String(surfaceId)}`);
  return selected;
}

function materialDefinition(materialId) {
  return MATERIAL_DEFINITIONS[materialId] || MATERIAL_DEFINITIONS.paper;
}

function normalizeMaterial(materialId) {
  return MATERIAL_DEFINITIONS[materialId] ? materialId : 'paper';
}

function buildLabel(root, context) {
  const stage = add(root, node('div', 'surface-label__stage'));
  const underlay = add(stage, node('div', 'surface-label__underlay'));
  add(underlay, node('small', '', context.kicker));
  add(underlay, node('strong', '', context.detail));
  const sticker = createStripChain({
    prefix: 'surface-label', count: 14, axis: 'x', anchor: 'corner',
    frontLabel: context.front, backLabel: context.back
  });
  stage.append(sticker);
  add(sticker, node('span', 'surface-label__copy', context.title));
  add(stage, node('span', 'surface-label__grip', '↖'));
}

function buildMap(root, context) {
  const stage = add(root, node('div', 'surface-map__stage'));
  const track = add(stage, node('div', 'surface-map__track'));
  MAP_COPY.forEach((copy, index) => {
    const panel = add(track, node('section', 'surface-map__panel'));
    panel.dataset.panel = String(index);
    panel.dataset.fold = index % 2 === 0 ? 'mountain' : 'valley';
    add(panel, node('span', 'surface-map__terrain'));
    add(panel, numberedLabel(index, context.labels[index] || copy, 'surface-map__label'));
  });
  const route = add(stage, node('div', 'surface-map__route'));
  add(route, node('span', 'surface-map__route-line'));
  [0, 2, 4, 6, 7].forEach((panelIndex, index) => {
    const stop = add(route, node('i', 'surface-map__stop', String(index + 1)));
    stop.dataset.stop = String(index);
    stop.dataset.panel = String(panelIndex);
    stop.style.setProperty('--stop-x', `${8 + index * 21}%`);
    stop.style.setProperty('--stop-y', `${index % 2 === 0 ? 40 : 62}%`);
  });
}

function buildCurtain(root, context) {
  const stage = add(root, node('div', 'surface-curtain__stage'));
  const reveal = add(stage, node('div', 'surface-curtain__reveal'));
  add(reveal, node('small', '', context.kicker));
  add(reveal, node('strong', '', context.title));
  ['left', 'right'].forEach((side) => {
    const wing = add(stage, node('div', `surface-curtain__wing surface-curtain__wing--${side}`));
    wing.dataset.side = side;
    wing.append(createStripChain({
      prefix: 'surface-curtain', count: 10, axis: 'x', anchor: side,
      frontLabel: side === 'left' ? context.front : '', backLabel: context.back
    }));
  });
}

function buildBlind(root, context) {
  const stage = add(root, node('div', 'surface-blind__stage'));
  add(stage, node('span', 'surface-blind__caption surface-blind__caption--front', context.front));
  add(stage, node('span', 'surface-blind__caption surface-blind__caption--back', context.back));
  for (let index = 0; index < 18; index += 1) {
    const slat = add(stage, node('div', 'surface-blind__slat'));
    slat.dataset.slat = String(index);
    slat.style.setProperty('--slat-index', String(index));
    const front = add(slat, node('span', 'surface-blind__face surface-blind__face--front'));
    const back = add(slat, node('span', 'surface-blind__face surface-blind__face--back'));
    front.dataset.face = 'front';
    back.dataset.face = 'back';
  }
}

function buildTimeline(root, context) {
  const stage = add(root, node('div', 'surface-timeline__stage'));
  add(stage, node('div', 'surface-timeline__axis'));
  TIMELINE_COPY.forEach((copy, index) => {
    const event = add(stage, node('article', 'surface-timeline__event'));
    event.dataset.event = String(index);
    event.dataset.fold = index % 2 === 0 ? 'mountain' : 'valley';
    add(event, node('i', 'surface-timeline__dot'));
    add(event, numberedLabel(index, context.labels[index] || copy, 'surface-timeline__label'));
  });
}

function buildMaterialWall(root, context) {
  const stage = add(root, node('div', 'surface-material__stage'));
  add(stage, node('strong', 'surface-material__title', context.title));
  MATERIAL_COPY.forEach((copy, index) => {
    const sample = add(stage, node('article', 'surface-material__sample'));
    sample.dataset.sample = String(index);
    sample.dataset.finish = copy;
    sample.style.setProperty('--sample-index', String(index));
    sample.style.setProperty('--sample-hue', String((index * 41 + 18) % 360));
    add(sample, node('span', 'surface-material__texture'));
    add(sample, numberedLabel(index, context.labels[index] || copy, 'surface-material__label'));
  });
}

function buildBox(root, context) {
  const stage = add(root, node('div', 'surface-box__stage'));
  const box = add(stage, node('div', 'surface-box__object'));
  ['base', 'front', 'right', 'back', 'left', 'top'].forEach((faceName, index) => {
    const panel = add(box, node('section', `surface-box__panel surface-box__panel--${faceName}`));
    panel.dataset.panel = faceName;
    add(panel, numberedLabel(index, index === 0 ? context.title : faceName.toUpperCase(), 'surface-box__label'));
  });
  add(stage, node('span', 'surface-box__fold-guide', 'BOX ↔ NET'));
}

function buildPortal(root, context) {
  const stage = add(root, node('div', 'surface-portal__stage'));
  const sceneA = add(stage, node('div', 'surface-portal__scene surface-portal__scene--a'));
  const sceneB = add(stage, node('div', 'surface-portal__scene surface-portal__scene--b'));
  add(sceneA, node('strong', '', context.front));
  add(sceneB, node('strong', '', context.back));
  for (let index = 0; index < 6; index += 1) {
    const frame = add(stage, node('div', 'surface-portal__frame'));
    frame.dataset.frame = String(index);
    add(frame, node('span', 'surface-portal__opening'));
  }
  add(stage, node('span', 'surface-portal__threshold', 'THRESHOLD'));
}

function buildRollup(root, context) {
  const stage = add(root, node('div', 'surface-rollup__stage'));
  const underlay = add(stage, node('div', 'surface-rollup__underlay'));
  add(underlay, node('strong', '', context.detail));
  const chain = createStripChain({
    prefix: 'surface-rollup', count: 12, axis: 'y', anchor: 'top',
    frontLabel: context.title, backLabel: context.back
  });
  [...chain.querySelectorAll('.surface-rollup__strip')].forEach((band) => {
    band.className += ' surface-rollup__band';
  });
  stage.append(chain);
  add(stage, node('span', 'surface-rollup__roller'));
}

function buildFan(root, context) {
  const stage = add(root, node('div', 'surface-fan__stage'));
  for (let index = 0; index < 10; index += 1) {
    const wedge = add(stage, node('article', 'surface-fan__wedge'));
    wedge.dataset.wedge = String(index);
    wedge.style.setProperty('--wedge-index', String(index));
    add(wedge, numberedLabel(index, context.labels[index] || MATERIAL_COPY[index % MATERIAL_COPY.length], 'surface-fan__label'));
  }
  add(stage, node('span', 'surface-fan__hub'));
}

function buildCoupon(root, context) {
  const stage = add(root, node('div', 'surface-coupon__stage'));
  const stub = add(stage, node('div', 'surface-coupon__stub'));
  add(stub, node('small', '', 'KEEP / 存根'));
  const perforation = add(stage, node('div', 'surface-coupon__perforation'));
  for (let index = 0; index < 16; index += 1) {
    const hole = add(perforation, node('i', 'surface-coupon__hole'));
    hole.dataset.hole = String(index);
  }
  const ticket = add(stage, node('article', 'surface-coupon__ticket'));
  add(ticket, node('small', '', context.kicker));
  add(ticket, node('strong', '', context.title));
  add(ticket, node('span', '', context.detail));
  add(ticket, node('b', 'surface-coupon__value', '20%'));
}

function buildRibbon(root, context) {
  const stage = add(root, node('div', 'surface-ribbon__stage'));
  const path = add(stage, node('div', 'surface-ribbon__path'));
  for (let index = 0; index < 7; index += 1) {
    const segment = add(path, node('span', 'surface-ribbon__segment'));
    segment.dataset.segment = String(index);
    segment.style.setProperty('--segment-index', String(index));
  }
  RIBBON_COPY.forEach((value, index) => {
    const point = add(stage, node('article', 'surface-ribbon__node'));
    point.dataset.node = String(index);
    point.style.setProperty('--node-index', String(index));
    add(point, node('i', 'surface-ribbon__point'));
    add(point, node('strong', '', context.labels[index] || value));
  });
  add(stage, node('span', 'surface-ribbon__caption', context.title));
}

const BUILDERS = Object.freeze({
  'label-peel': buildLabel,
  'fold-map': buildMap,
  'split-curtain': buildCurtain,
  'comparison-blind': buildBlind,
  'accordion-timeline': buildTimeline,
  'material-wall': buildMaterialWall,
  'box-net': buildBox,
  portal: buildPortal,
  'rollup-poster': buildRollup,
  'radial-fan': buildFan,
  'tearoff-coupon': buildCoupon,
  'data-ribbon': buildRibbon
});

function numberOr(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizedState(surfaceId, root, state = {}) {
  const selected = assertSurface(surfaceId);
  const maxStep = selected.maxStep ?? 0;
  const rawStep = Math.trunc(numberOr(state.step));
  const step = maxStep > 0 ? Math.min(maxStep, Math.max(0, rawStep)) : Math.max(0, rawStep);
  return {
    progress: clampStripValue(state.progress),
    step,
    turn: clampStripValue(state.turn, -1, 1),
    material: normalizeMaterial(state.material ?? root.dataset.material),
    fallback: Boolean(state.fallback),
    detached: Boolean(state.detached)
  };
}

function applyMaterial(root, materialId) {
  const material = materialDefinition(materialId);
  root.dataset.material = materialId;
  root.dataset.materialTexture = material.texture;
  root.style.setProperty('--material-thickness', `${material.thickness}px`);
  root.style.setProperty('--material-opacity', material.opacity.toFixed(3));
  root.style.setProperty('--material-stiffness', material.stiffness.toFixed(3));
  root.style.setProperty('--material-curl', material.curl.toFixed(3));
  root.style.setProperty('--material-reflection', material.reflection.toFixed(3));
  root.style.setProperty('--material-translucency', material.translucency.toFixed(3));
  return material;
}

function writeRootState(root, current) {
  root.dataset.progress = current.progress.toFixed(3);
  root.dataset.step = String(current.step);
  root.dataset.turn = current.turn.toFixed(3);
  root.dataset.fallback = String(current.fallback);
  root.dataset.detached = String(current.detached);
  root.style.setProperty('--surface-progress', current.progress.toFixed(3));
  root.style.setProperty('--surface-step', String(current.step));
  root.style.setProperty('--surface-turn', current.turn.toFixed(3));
}

function applyLabel(root, current, material) {
  const chain = root.querySelector('.surface-label__chain');
  applyStripChainState(chain, current, {
    axis: 'x', mode: 'peel', direction: -1, travel: 24,
    stiffness: material.stiffness / Math.max(0.35, material.curl), lighting: 0.76
  });
  const detached = current.detached;
  const chainX = detached ? -34 : -current.progress * 7;
  const chainY = detached ? -22 : -current.progress * 4;
  chain.style.transform = `translate3d(${chainX.toFixed(2)}%, ${chainY.toFixed(2)}%, ${detached ? 62 : 0}px) rotateZ(${(-8 - current.turn * 4).toFixed(2)}deg)`;
  root.querySelector('.surface-label__underlay').style.clipPath = `circle(${(8 + current.progress * 76).toFixed(2)}% at 84% 82%)`;
  root.querySelector('.surface-label__grip').style.transform = `translate(${(-current.progress * 48).toFixed(2)}%, ${(-current.progress * 42).toFixed(2)}%) rotate(${(-current.progress * 28).toFixed(2)}deg)`;
  root.dataset.attachment = detached ? 'detached' : current.progress >= 0.94 ? 'snapped' : current.progress <= 0.03 ? 'attached' : 'peeling';
}

function applyMap(root, current) {
  const panels = [...root.querySelectorAll('.surface-map__panel')];
  const unfolded = Math.max(current.progress, current.step / Math.max(1, panels.length - 1));
  panels.forEach((panel, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    const local = clampStripValue(unfolded * panels.length - index * 0.28);
    const angle = direction * (1 - local) * 78 + current.turn * direction * 3;
    panel.dataset.state = index < current.step ? 'settled' : index === current.step ? 'active' : 'folded';
    panel.style.setProperty('--fold-angle', `${angle.toFixed(2)}deg`);
    panel.style.transform = current.fallback
      ? `translateX(${(direction * (1 - local) * 5).toFixed(2)}%) scaleX(${(0.68 + local * 0.32).toFixed(3)})`
      : `rotateY(${angle.toFixed(2)}deg) translateZ(${(Math.sin(local * Math.PI) * 12).toFixed(2)}px)`;
  });
  root.querySelector('.surface-map__route').style.setProperty('--route-progress', unfolded.toFixed(3));
  [...root.querySelectorAll('.surface-map__stop')].forEach((stop, index) => {
    const threshold = index / Math.max(1, root.querySelectorAll('.surface-map__stop').length - 1);
    stop.dataset.state = unfolded > threshold + 0.08 ? 'passed' : Math.abs(unfolded - threshold) <= 0.14 ? 'active' : 'ahead';
    stop.style.transform = `scale(${unfolded >= threshold ? '1' : '.62'})`;
    stop.style.opacity = unfolded >= threshold * 0.82 ? '1' : '0.28';
  });
}

function applyCurtain(root, current, material) {
  const wings = [...root.querySelectorAll('.surface-curtain__wing')];
  wings.forEach((wing) => {
    const side = wing.dataset.side;
    const direction = side === 'left' ? -1 : 1;
    const chain = wing.querySelector('.surface-curtain__chain');
    applyStripChainState(chain, current, {
      axis: 'x', mode: 'gather', direction, travel: 28,
      stiffness: material.stiffness / Math.max(0.35, material.curl), lighting: 0.64
    });
    wing.style.transform = `translateX(${(direction * current.progress * 42).toFixed(2)}%) scaleX(${(1 - current.progress * 0.28).toFixed(3)})`;
  });
  const gap = current.progress * 72;
  root.style.setProperty('--curtain-gap', `${gap.toFixed(2)}%`);
  root.querySelector('.surface-curtain__reveal').style.clipPath = `inset(0 ${(50 - gap / 2).toFixed(2)}%)`;
  root.querySelector('.surface-curtain__reveal').style.opacity = clampStripValue(current.progress * 1.3).toFixed(3);
  root.dataset.curtainState = current.progress >= 0.96 ? 'open' : current.progress <= 0.03 ? 'closed' : 'moving';
}

function applyBlind(root, current) {
  const slats = [...root.querySelectorAll('.surface-blind__slat')];
  slats.forEach((slat, index) => {
    const delay = Math.abs(index - (slats.length - 1) / 2) * 0.006;
    const local = clampStripValue((current.progress - delay) / Math.max(0.01, 1 - delay));
    const angle = local * 180 + current.turn * (index % 2 === 0 ? 2.5 : -2.5);
    slat.dataset.face = local < 0.5 ? 'front' : 'back';
    slat.style.setProperty('--slat-angle', `${angle.toFixed(2)}deg`);
    slat.style.transform = current.fallback
      ? `translateY(${((index % 2 ? 1 : -1) * local * 3).toFixed(2)}%)`
      : `rotateY(${angle.toFixed(2)}deg) translateZ(${(Math.sin(local * Math.PI) * 9).toFixed(2)}px)`;
  });
  root.querySelector('.surface-blind__caption--front').style.opacity = (1 - current.progress).toFixed(3);
  root.querySelector('.surface-blind__caption--back').style.opacity = current.progress.toFixed(3);
  root.dataset.visibleSide = current.progress < 0.5 ? 'front' : 'back';
}

function applyTimeline(root, current) {
  const events = [...root.querySelectorAll('.surface-timeline__event')];
  const unfolded = Math.max(current.progress, current.step / Math.max(1, events.length - 1));
  events.forEach((event, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    const local = clampStripValue(unfolded * events.length - index * 0.36);
    const angle = direction * (1 - local) * 66;
    event.dataset.state = index < current.step ? 'past' : index === current.step ? 'current' : 'future';
    event.style.transform = current.fallback
      ? `translateX(${(direction * (1 - local) * 5).toFixed(2)}%) scaleX(${(0.74 + local * 0.26).toFixed(3)})`
      : `rotateY(${angle.toFixed(2)}deg) translateZ(${(index === current.step ? 22 : local * 5).toFixed(2)}px)`;
    event.style.opacity = index <= current.step || local > 0.5 ? '1' : '0.4';
  });
  root.dataset.currentEvent = String(current.step);
  root.querySelector('.surface-timeline__axis').style.transform = `scaleX(${unfolded.toFixed(3)})`;
}

function applyMaterialWall(root, current) {
  const samples = [...root.querySelectorAll('.surface-material__sample')];
  samples.forEach((sample, index) => {
    const selected = index === current.step;
    const distance = Math.abs(index - current.step);
    const angle = selected ? current.turn * 5 - current.progress * 12 : (index % 2 === 0 ? 1 : -1) * Math.min(8, distance * 2);
    sample.dataset.state = selected ? 'selected' : distance === 1 ? 'adjacent' : 'idle';
    sample.style.setProperty('--sample-reflection-angle', `${(index * 17 + current.progress * 80).toFixed(2)}deg`);
    sample.style.transform = current.fallback
      ? `scale(${selected ? '1.04' : '.96'})`
      : `translate3d(0, ${selected ? '-5' : '0'}%, ${selected ? '34' : '0'}px) rotateY(${angle.toFixed(2)}deg) scale(${selected ? '1.04' : '.96'})`;
    sample.style.opacity = distance > 3 ? '0.68' : '1';
  });
  root.dataset.selectedSample = String(current.step);
}

const BOX_TRANSFORMS = Object.freeze({
  base: Object.freeze({ from: [0, 0, 0, 76, 0], to: [0, 0, 0, 0, 0] }),
  front: Object.freeze({ from: [0, 48, 38, -88, 0], to: [0, 100, 0, 0, 0] }),
  right: Object.freeze({ from: [48, 0, 38, 0, 88], to: [100, 0, 0, 0, 0] }),
  back: Object.freeze({ from: [0, -48, 38, 88, 0], to: [0, -100, 0, 0, 0] }),
  left: Object.freeze({ from: [-48, 0, 38, 0, -88], to: [-100, 0, 0, 0, 0] }),
  top: Object.freeze({ from: [0, 0, 76, 0, 0], to: [0, -200, 0, 0, 0] })
});

function interpolate(from, to, progress) {
  return from + (to - from) * progress;
}

function applyBox(root, current) {
  const panels = [...root.querySelectorAll('.surface-box__panel')];
  panels.forEach((panel) => {
    const face = panel.dataset.panel;
    const transform = BOX_TRANSFORMS[face];
    const [x, y, z, rotateX, rotateY] = transform.from.map((value, index) =>
      interpolate(value, transform.to[index], current.progress)
    );
    panel.dataset.state = current.progress >= 0.96 ? 'net' : current.progress <= 0.03 ? 'box' : 'unfolding';
    panel.style.setProperty('--box-progress', current.progress.toFixed(3));
    if (current.fallback) {
      panel.style.transform = `translate(${transform.to[0]}%, ${transform.to[1]}%) scale(${(0.82 + current.progress * 0.18).toFixed(3)})`;
    } else {
      panel.style.transform = `translate3d(${x.toFixed(2)}%, ${y.toFixed(2)}%, ${z.toFixed(2)}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    }
  });
  root.dataset.boxState = current.progress >= 0.96 ? 'net' : current.progress <= 0.03 ? 'box' : 'unfolding';
}

function applyPortal(root, current) {
  const frames = [...root.querySelectorAll('.surface-portal__frame')];
  frames.forEach((frame, index) => {
    const local = clampStripValue(current.progress * 1.25 - index * 0.045);
    const z = (frames.length - index) * 22 - local * 165;
    const scale = 0.7 + index * 0.055 + local * 0.42;
    frame.dataset.state = z < -18 ? 'passed' : Math.abs(z) <= 24 ? 'crossing' : 'ahead';
    frame.style.transform = current.fallback
      ? `scale(${scale.toFixed(3)})`
      : `translateZ(${z.toFixed(2)}px) scale(${scale.toFixed(3)}) rotateZ(${((index % 2 ? -1 : 1) * current.turn * 2).toFixed(2)}deg)`;
    frame.style.opacity = z < -52 ? '0.12' : '1';
  });
  const crossed = current.progress >= 0.58;
  const sceneB = root.querySelector('.surface-portal__scene--b');
  sceneB.style.clipPath = `circle(${Math.max(0, (current.progress - 0.42) / 0.58 * 72).toFixed(2)}% at 50% 50%)`;
  sceneB.style.transform = `scale(${(0.78 + current.progress * 0.22).toFixed(3)})`;
  root.querySelector('.surface-portal__scene--a').style.opacity = (1 - clampStripValue((current.progress - 0.36) * 1.7)).toFixed(3);
  root.dataset.portalScene = crossed ? 'back' : 'front';
}

function applyRollup(root, current, material) {
  const chain = root.querySelector('.surface-rollup__chain');
  applyStripChainState(chain, current, {
    axis: 'y', mode: 'roll', direction: -1, travel: 68,
    stiffness: material.stiffness / Math.max(0.35, material.curl), lighting: 0.78, stagger: 0.18
  });
  const roller = root.querySelector('.surface-rollup__roller');
  roller.style.transform = `translateY(${(current.progress * -32).toFixed(2)}%) rotate(${(current.progress * 540).toFixed(2)}deg)`;
  root.querySelector('.surface-rollup__underlay').style.clipPath = `inset(${(100 - current.progress * 100).toFixed(2)}% 0 0)`;
  root.dataset.rollState = current.progress >= 0.96 ? 'rolled' : current.progress <= 0.03 ? 'open' : 'rolling';
}

function applyFan(root, current) {
  const wedges = [...root.querySelectorAll('.surface-fan__wedge')];
  wedges.forEach((wedge, index) => {
    const angle = -54 + index * (108 / Math.max(1, wedges.length - 1)) * current.progress;
    const selected = index === current.step;
    wedge.dataset.state = selected ? 'selected' : 'idle';
    wedge.style.zIndex = String(selected ? wedges.length + 3 : index + 1);
    wedge.style.transform = current.fallback
      ? `rotate(${angle.toFixed(2)}deg) translateY(${selected ? '-4' : '0'}%)`
      : `rotateZ(${angle.toFixed(2)}deg) translate3d(0, ${selected ? '-5' : '0'}%, ${selected ? '28' : index * 1.2}px) rotateY(${(selected ? current.turn * 6 : 0).toFixed(2)}deg)`;
  });
  root.dataset.selectedWedge = String(current.step);
}

function applyCoupon(root, current) {
  const ticket = root.querySelector('.surface-coupon__ticket');
  const released = current.detached;
  const x = released ? 62 : current.progress * 38;
  const y = released ? -16 : -Math.sin(current.progress * Math.PI) * 5;
  const angle = released ? -11 : current.progress * -4 + current.turn * 3;
  ticket.style.transform = current.fallback
    ? `translate(${x.toFixed(2)}%, ${y.toFixed(2)}%) rotate(${angle.toFixed(2)}deg)`
    : `translate3d(${x.toFixed(2)}%, ${y.toFixed(2)}%, ${released ? '58' : (current.progress * 22).toFixed(2)}px) rotateZ(${angle.toFixed(2)}deg) rotateY(${(current.progress * -9).toFixed(2)}deg)`;
  root.querySelector('.surface-coupon__perforation').style.transform = `scaleY(${(1 + current.progress * 0.16).toFixed(3)})`;
  root.querySelector('.surface-coupon__stub').style.opacity = (1 - current.progress * 0.28).toFixed(3);
  root.dataset.releaseState = released ? 'detached' : current.progress >= 0.78 ? 'ready' : current.progress <= 0.03 ? 'attached' : 'tearing';
}

function applyRibbon(root, current) {
  const points = [...root.querySelectorAll('.surface-ribbon__node')];
  points.forEach((point, index) => {
    const relative = index / Math.max(1, points.length - 1);
    const reached = index <= current.step || current.progress >= relative;
    const active = index === current.step;
    const y = Math.sin((relative * 2.6 + current.progress * 0.42) * Math.PI) * (18 + current.turn * 3);
    const z = Math.cos((relative + current.progress) * Math.PI) * 16;
    point.dataset.state = active ? 'active' : reached ? 'reached' : 'waiting';
    point.style.transform = current.fallback
      ? `translate(${(relative * 640).toFixed(2)}%, ${y.toFixed(2)}%) scale(${active ? '1.15' : '.9'})`
      : `translate3d(${(relative * 640).toFixed(2)}%, ${y.toFixed(2)}%, ${z.toFixed(2)}px) rotateZ(${(Math.cos(relative * Math.PI * 2) * 6).toFixed(2)}deg) scale(${active ? '1.15' : '.9'})`;
    point.style.opacity = reached ? '1' : '0.34';
  });
  [...root.querySelectorAll('.surface-ribbon__segment')].forEach((segment, index) => {
    const threshold = (index + 1) / 7;
    const local = clampStripValue(current.progress / threshold);
    segment.dataset.state = index < current.step ? 'reached' : index === current.step ? 'active' : 'waiting';
    segment.style.transform = `scaleX(${local.toFixed(3)}) rotate(${((index % 2 ? -1 : 1) * 5).toFixed(2)}deg)`;
  });
  root.dataset.activeNode = String(current.step);
}

const APPLIERS = Object.freeze({
  'label-peel': applyLabel,
  'fold-map': applyMap,
  'split-curtain': applyCurtain,
  'comparison-blind': applyBlind,
  'accordion-timeline': applyTimeline,
  'material-wall': applyMaterialWall,
  'box-net': applyBox,
  portal: applyPortal,
  'rollup-poster': applyRollup,
  'radial-fan': applyFan,
  'tearoff-coupon': applyCoupon,
  'data-ribbon': applyRibbon
});

export function createDeformableSurface(surfaceId, options = {}) {
  const selected = assertSurface(surfaceId);
  const materialId = normalizeMaterial(options.material);
  const context = normalizeContext(options.context);
  const root = node('div', `deformable-surface deformable-surface--${surfaceId}`);
  root.dataset.surface = surfaceId;
  root.dataset.context = context.id;
  root.setAttribute('role', 'img');
  root.setAttribute('aria-label', `${selected.name}：${selected.title}`);
  root.style.setProperty('--surface-accent', safeAccent(options.accent, selected.accent));
  BUILDERS[surfaceId](root, context);
  applyMaterial(root, materialId);
  applyDeformableSurfaceState(root, surfaceId, {
    progress: 0,
    step: 0,
    turn: 0,
    material: materialId,
    fallback: false,
    detached: false
  });
  return root;
}

export function applyDeformableSurfaceState(root, surfaceId, state = {}) {
  assertSurface(surfaceId);
  if (!(root instanceof Element)) throw new TypeError('applyDeformableSurfaceState requires a DOM Element root.');
  const current = normalizedState(surfaceId, root, state);
  root.dataset.surface = surfaceId;
  writeRootState(root, current);
  const material = applyMaterial(root, current.material);
  APPLIERS[surfaceId](root, current, material);
  return root;
}

export function surfaceActionLabel(surfaceId, state = {}) {
  const selected = assertSurface(surfaceId);
  const material = normalizeMaterial(state.material);
  const current = normalizedState(surfaceId, { dataset: { material } }, state);
  const open = current.progress >= 0.5;

  if (surfaceId === 'label-peel') {
    if (current.detached) return '重新贴上标签';
    return open ? '让标签重新吸附' : selected.action;
  }
  if (surfaceId === 'fold-map') return current.step >= selected.maxStep ? '重新折叠地图' : `展开第 ${current.step + 2} 折`;
  if (surfaceId === 'split-curtain') return open ? '合上幕布' : selected.action;
  if (surfaceId === 'comparison-blind') return open ? '切回正面状态' : selected.action;
  if (surfaceId === 'accordion-timeline') return current.step >= selected.maxStep ? '收回全部事件' : `展开事件 ${current.step + 2}`;
  if (surfaceId === 'material-wall') return current.step >= selected.maxStep ? '回到第一块样本' : `选择样本 ${String(current.step + 2).padStart(2, '0')}`;
  if (surfaceId === 'box-net') return open ? '重新折成包装盒' : selected.action;
  if (surfaceId === 'portal') return open ? '返回入口场景' : selected.action;
  if (surfaceId === 'rollup-poster') return open ? '放下完整海报' : selected.action;
  if (surfaceId === 'radial-fan') return current.step >= selected.maxStep ? '合回第一扇片' : `选择扇片 ${current.step + 2}`;
  if (surfaceId === 'tearoff-coupon') return current.detached ? '放回演示优惠券' : selected.action;
  if (surfaceId === 'data-ribbon') return current.step >= selected.maxStep ? '回到第一个数据点' : `推进到节点 ${current.step + 2}`;
  return selected.action;
}

export function surfaceStatusText(surfaceId, state = {}) {
  const selected = assertSurface(surfaceId);
  const materialId = normalizeMaterial(state.material);
  const current = normalizedState(surfaceId, { dataset: { material: materialId } }, state);
  const material = materialDefinition(current.material);
  const percent = Math.round(current.progress * 100);
  const prefix = `${selected.name} · ${material.name}`;

  if (surfaceId === 'label-peel') return `${prefix} · ${current.detached ? '已脱离' : current.progress >= 0.94 ? '已吸附到揭示端' : current.progress <= 0.03 ? '完整贴合' : `剥离 ${percent}%`}`;
  if (surfaceId === 'fold-map') return `${prefix} · 第 ${current.step + 1} / 8 折 · 路线显现 ${percent}%`;
  if (surfaceId === 'split-curtain') return `${prefix} · 左右 20 条褶带 · 中央开场 ${percent}%`;
  if (surfaceId === 'comparison-blind') return `${prefix} · 18 片百叶 · ${current.progress < 0.5 ? '正面内容' : '背面内容'} ${percent}%`;
  if (surfaceId === 'accordion-timeline') return `${prefix} · 当前事件 ${current.step + 1} / 7「${TIMELINE_COPY[current.step]}」`;
  if (surfaceId === 'material-wall') return `${prefix} · 当前样本 ${current.step + 1} / 8「${MATERIAL_COPY[current.step]}」`;
  if (surfaceId === 'box-net') return `${prefix} · 六面包装 ${current.progress >= 0.96 ? '已展开为十字 net' : current.progress <= 0.03 ? '保持盒体' : `展开 ${percent}%`}`;
  if (surfaceId === 'portal') return `${prefix} · 六层空间框 · ${current.progress >= 0.58 ? '背面场景进入视野' : `接近阈值 ${percent}%`}`;
  if (surfaceId === 'rollup-poster') return `${prefix} · 12 条横向带 · 卷起 ${percent}%`;
  if (surfaceId === 'radial-fan') return `${prefix} · 当前扇片 ${current.step + 1} / 10 · 展开 ${percent}%`;
  if (surfaceId === 'tearoff-coupon') return `${prefix} · ${current.detached ? '优惠券已脱离存根' : `沿穿孔拉动 ${percent}%`}`;
  if (surfaceId === 'data-ribbon') return `${prefix} · 数据节点 ${current.step + 1} / 8 · 路径 ${percent}%`;
  return `${prefix} · ${selected.progressLabel} ${percent}%`;
}
