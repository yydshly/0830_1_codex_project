import { clamp, cssDegrees, progressFromDrag, shouldCommit } from '../showcase/page-turn-model.mjs';
import {
  FORM_DEFINITIONS,
  FORM_ORDER,
  applyFormState,
  createFormSurface,
  formActionLabel,
  formStatusText
} from './book-form-demos.mjs';
import {
  MATERIAL_DEFINITIONS,
  MATERIAL_ORDER,
  SURFACE_DEFINITIONS,
  SURFACE_ORDER,
  applyDeformableSurfaceState,
  createDeformableSurface,
  surfaceActionLabel,
  surfaceStatusText
} from './deformable-surface-demos.mjs';
import {
  AXES,
  COMBINATIONS,
  DIRECTIONS,
  directionStats,
  getAxisById,
  getDirectionById,
  getDirections
} from './creative-direction-data.mjs';

const SVG_W = 1200;
const SVG_H = 760;
const MAGNIFICATION = 2.05;
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const params = new URLSearchParams(window.location.search);
const initialDirection = getDirectionById(params.get('direction')) || DIRECTIONS[0];
const initialPanel = ['experience', 'scenes', 'forms', 'surfaces', 'explore', 'extensions'].includes(params.get('panel'))
  ? params.get('panel')
  : 'experience';
const explicitForm = FORM_DEFINITIONS[params.get('form')] ? params.get('form') : null;
const initialForm = initialPanel === 'surfaces' ? 'classic' : explicitForm
  || (initialPanel === 'forms' ? FORM_ORDER[0] : null)
  || (initialPanel === 'explore' && FORM_DEFINITIONS[initialDirection.form] ? initialDirection.form : null)
  || 'classic';
const explicitSurface = SURFACE_DEFINITIONS[params.get('surface')] ? params.get('surface') : null;
const initialSurface = explicitSurface || SURFACE_ORDER[0];
const initialMaterial = MATERIAL_DEFINITIONS[params.get('material')] ? params.get('material') : MATERIAL_ORDER[0];

const SCENES = {
  portfolio: {
    kicker: 'CURATED PORTFOLIO',
    title: '把作品交给纸张。',
    dek: '拖动右页。纸面会沿宽度连续弯曲，而不是像硬卡片一样整体旋转。',
    accent: '#f06a50',
    behavior: 'note',
    actionKind: 'toggle',
    action: '显示策展字幕',
    activeAction: '隐藏策展字幕',
    note: '策展字幕：翻页为每件作品建立明确的进入、停留与离开时刻。',
    pages: [
      ['FORM / 01', '轻盈与重量', '一组关于日常器物的形态研究', 'orbs'],
      ['FIELD / 02', '海岸之后', '颜色不是背景，而是作品的气候', 'coast'],
      ['SPACE / 03', '纸上建筑', '折线、阴影与可触摸的结构', 'blocks'],
      ['INDEX / 04', '留下空白', '最后一页只保存观看后的余韵', 'void']
    ]
  },
  atlas: {
    kicker: 'LIVING ATLAS',
    title: '把观察变成探索。',
    dek: '翻页保存章节，观察镜留在纸面。打开“场景动作”后移动镜片，寻找局部细节。',
    accent: '#58b7a6',
    behavior: 'loupe',
    actionKind: 'toggle',
    action: '打开观察镜',
    activeAction: '收起观察镜',
    note: '观察提示：叶脉、潮线和飞行路径都可以成为画册中的探索目标。',
    pages: [
      ['BOTANY / 01', '叶脉如何分流', '一片叶子里的输送网络', 'leaf'],
      ['TIDAL / 02', '潮池的一小时', '海藻、贝壳与不断改变的水线', 'tide'],
      ['FLIGHT / 03', '昆虫的导航灯', '光、距离与夜间飞行路径', 'flight'],
      ['SEED / 04', '一颗种子的远行', '风把微小结构带向新的土壤', 'seed']
    ]
  },
  launch: {
    kicker: 'PRODUCT REVEAL',
    title: '让产品逐页揭晓。',
    dek: '从轮廓、材质到系统结构，每次翻页只交付一个关键卖点。',
    accent: '#9a83ec',
    behavior: 'note',
    actionKind: 'toggle',
    action: '展开材质注解',
    activeAction: '收起材质注解',
    note: '材质注解：柔光外壳、无缝结构、自适应亮度。信息叠层只在需要时出现。',
    pages: [
      ['OBJECT / 01', '一体成形', '从轮廓开始，而不是从参数表开始', 'product'],
      ['MATERIAL / 02', '触感有了颜色', '柔光表面回应纸张自身的阴影', 'material'],
      ['SYSTEM / 03', '光会跟随', '环境感知让亮度变得安静', 'system'],
      ['DAILY / 04', '回到日常', '最后一页交付完整功能结构', 'daily']
    ]
  },
  kiosk: {
    kicker: 'EXHIBITION KIOSK',
    title: '让展台保持呼吸。',
    dek: '自动翻页吸引远处观众；任何触摸都会暂停导览，把控制权交还给人。',
    accent: '#e3a841',
    behavior: 'auto',
    actionKind: 'toggle',
    action: '开始自动导览',
    activeAction: '暂停自动导览',
    note: '展览模式：循环播放已开启。点击纸页即可接管并暂停。',
    pages: [
      ['ROOM A / 01', '风从哪里来', '入口展厅 · 声音与悬挂装置', 'wind'],
      ['ROOM B / 02', '城市的切片', '主展厅 · 影像与档案材料', 'city'],
      ['ROOM C / 03', '把光带走', '出口展厅 · 观众共同完成的作品', 'light'],
      ['MAP / 04', '下一段路径', '在空间里继续，而不是在页面里结束', 'map']
    ]
  },
  travel: {
    kicker: 'ROUTE JOURNAL',
    title: '让路线长在纸上。',
    dek: '翻页保存旅途章节；路线层把地点重新连成可以逐站探索的空间叙事。',
    accent: '#df765e',
    behavior: 'route',
    actionKind: 'cycle',
    action: '显示旅行路线',
    stops: ['旧站台', '河岸市集', '山顶剧场', '夜航码头'],
    pages: [
      ['ARRIVAL / 01', '从旧站台出发', '车票、时间与第一段步行路线', 'journey'],
      ['RIVER / 02', '午后的河岸', '市集气味沿水面慢慢展开', 'postcard'],
      ['RIDGE / 03', '山顶剧场', '日落前抵达城市最高的座位', 'ridge'],
      ['NIGHT / 04', '最后一班夜航', '路线结束，手账留下可以重访的坐标', 'stamp']
    ]
  },
  recipe: {
    kicker: 'COOKING SEQUENCE',
    title: '让步骤跟着手走。',
    dek: '食谱不再只是四页文字；步骤轨道保留进度，翻页负责展开食材、火候与完成时刻。',
    accent: '#dc6b42',
    behavior: 'steps',
    actionKind: 'cycle',
    action: '开始烹饪',
    steps: ['备料', '入锅', '慢炖', '装盘'],
    pages: [
      ['PREP / 01', '先把颜色备齐', '番茄、香草与根茎切成不同节奏', 'ingredients'],
      ['HEAT / 02', '听见第一声沸腾', '热量不是数字，而是食材的状态变化', 'pan'],
      ['TIME / 03', '把时间调慢', '保持小火，让味道在纸页之间累积', 'timer'],
      ['SERVE / 04', '现在可以上桌', '最后一页把流程收束成一只盘子', 'plate']
    ]
  },
  comic: {
    kicker: 'PANEL STORY',
    title: '让视线逐格前进。',
    dek: '暗幕不是装饰，它把同一跨页切成镜头；每次动作都会把注意力移到下一格。',
    accent: '#4079c7',
    behavior: 'focus',
    actionKind: 'cycle',
    action: '聚焦第一格',
    frames: [
      { x: 7, y: 16, w: 37, h: 34, label: 'FRAME 01 · 建立' },
      { x: 55, y: 12, w: 36, h: 30, label: 'FRAME 02 · 转折' },
      { x: 49, y: 52, w: 43, h: 34, label: 'FRAME 03 · 回应' }
    ],
    pages: [
      ['OPENING / 01', '风偷走了一封信', '三个镜头建立一场很小的冒险', 'panels'],
      ['CHASE / 02', '屋顶开始移动', '速度线把翻页方向变成故事方向', 'burst'],
      ['PAUSE / 03', '城市忽然安静', '夜色让读者停在第三格里', 'night-panel'],
      ['RETURN / 04', '信回到了窗边', '结尾保留下一次翻开的可能', 'finale']
    ]
  },
  catalog: {
    kicker: 'CONFIGURABLE CATALOG',
    title: '让选择立即成形。',
    dek: '同一套商品页稿可以响应配色变量重新生成；翻页结构不需要为每个版本重做。',
    accent: '#b75f4f',
    variants: ['#b75f4f', '#2d79b7', '#2d8b72'],
    variantNames: ['陶土红', '湖面蓝', '松针绿'],
    behavior: 'palette',
    actionKind: 'cycle',
    action: '切换商品配色',
    pages: [
      ['SEAT / 01', '一把安静的椅子', '轮廓保持不变，材质颜色回应空间', 'chair'],
      ['LIGHT / 02', '桌面上的一束光', '灯罩、底座与环境形成同一色系', 'lamp'],
      ['OBJECT / 03', '器物的第二表情', '换一种色彩就得到不同的视觉重量', 'vase'],
      ['SYSTEM / 04', '把整套带回家', '变体跨页保持，目录仍是一条连续体验', 'shelf']
    ]
  }
};

const refs = {
  root: document.documentElement,
  stage: document.querySelector('#demo-stage'),
  bookShell: document.querySelector('#book-shell'),
  book: document.querySelector('#book'),
  viewTabs: [...document.querySelectorAll('[data-view]')],
  panels: [...document.querySelectorAll('.deck-panel')],
  deckTitle: document.querySelector('#deck-title'),
  sceneKicker: document.querySelector('#scene-kicker'),
  sceneTitle: document.querySelector('#scene-title'),
  sceneDek: document.querySelector('#scene-dek'),
  sceneButtons: [...document.querySelectorAll('.scene-picker [data-scene]')],
  formButtons: [...document.querySelectorAll('.form-picker [data-form]')],
  surfaceButtons: [...document.querySelectorAll('.surface-picker [data-surface]')],
  materialButtons: [...document.querySelectorAll('.material-picker [data-material]')],
  surfaceContext: document.querySelector('#surface-context'),
  surfaceAction: document.querySelector('#surface-action'),
  surfaceReset: document.querySelector('#surface-reset'),
  surfaceExit: document.querySelector('#surface-exit'),
  surfaceProgress: document.querySelector('#surface-progress'),
  surfaceProgressLabel: document.querySelector('#surface-progress-label'),
  surfaceProgressOutput: document.querySelector('#surface-progress-output'),
  surfaceStateOutput: document.querySelector('#surface-state-output'),
  surfaceAnchor: document.querySelector('#surface-anchor'),
  surfaceSlicing: document.querySelector('#surface-slicing'),
  surfaceDeformation: document.querySelector('#surface-deformation'),
  surfaceTopology: document.querySelector('#surface-topology'),
  surfaceRelease: document.querySelector('#surface-release'),
  surfaceBoundary: document.querySelector('#surface-boundary'),
  surfaceValueName: document.querySelector('#surface-value-name'),
  surfaceMeaning: document.querySelector('#surface-meaning'),
  surfaceScenarios: document.querySelector('#surface-scenarios'),
  materialBoundary: document.querySelector('#material-boundary'),
  axisFilter: document.querySelector('#axis-filter'),
  tierFilter: document.querySelector('#tier-filter'),
  atlasResultCount: document.querySelector('#atlas-result-count'),
  directionList: document.querySelector('#direction-list'),
  directionDetail: document.querySelector('#direction-detail'),
  combinationList: document.querySelector('#combination-list'),
  sceneAction: document.querySelector('#scene-action'),
  formAction: document.querySelector('#form-action'),
  formReset: document.querySelector('#form-reset'),
  formExit: document.querySelector('#form-exit'),
  formProgress: document.querySelector('#form-progress'),
  formProgressLabel: document.querySelector('#form-progress-label'),
  formProgressOutput: document.querySelector('#form-progress-output'),
  formStateOutput: document.querySelector('#form-state-output'),
  sceneNote: document.querySelector('#scene-note'),
  status: document.querySelector('#status-output'),
  prev: document.querySelector('#prev-page'),
  next: document.querySelector('#next-page'),
  current: document.querySelector('#page-current'),
  total: document.querySelector('#page-total'),
  auto: document.querySelector('#auto-play'),
  loupeToggle: document.querySelector('#loupe-toggle'),
  loupe: document.querySelector('#loupe'),
  loupeContent: document.querySelector('#loupe-content'),
  zoomOut: document.querySelector('#zoom-out'),
  zoomIn: document.querySelector('#zoom-in'),
  zoomOutput: document.querySelector('#zoom-output'),
  reset: document.querySelector('#reset-demo'),
  renderLabel: document.querySelector('#render-label'),
  quality: document.querySelector('#quality-range'),
  qualityOutput: document.querySelector('#quality-output'),
  softness: document.querySelector('#softness-range'),
  softnessOutput: document.querySelector('#softness-output'),
  light: document.querySelector('#light-range'),
  lightOutput: document.querySelector('#light-output'),
  cornerToggle: document.querySelector('#corner-toggle'),
  cornerGrip: document.querySelector('#corner-grip'),
  gestureHint: document.querySelector('#gesture-hint')
};

const state = {
  scene: SCENES[params.get('scene')] ? params.get('scene') : 'portfolio',
  form: initialForm,
  lastForm: explicitForm || (FORM_DEFINITIONS[initialDirection.form] ? initialDirection.form : FORM_ORDER[0]),
  direction: initialDirection.id,
  directionAxis: 'all',
  directionTier: 'ALL',
  combination: null,
  formProgress: 0,
  formStep: 0,
  formTurn: 0,
  formDrag: null,
  formTimer: null,
  surface: initialSurface,
  lastSurface: initialSurface,
  material: initialMaterial,
  surfaceProgress: 0,
  surfaceStep: 0,
  surfaceTurn: 0,
  surfaceDetached: false,
  surfaceDrag: null,
  index: 0,
  strips: 18,
  peakCurl: 0.67,
  light: 0.72,
  turn: null,
  drag: null,
  animationFrame: null,
  autoTimer: null,
  autoDirection: 'next',
  introRunning: false,
  view: { zoom: 1, tiltX: 2, tiltY: 0 },
  loupeOn: false,
  loupeX: null,
  loupeY: null,
  loupeDrag: null,
  cornerOn: params.get('corner') === '1',
  cornerX: 23,
  cornerY: 21,
  cornerDrag: null,
  sceneAction: false,
  effectStep: 0,
  fallback: params.get('fallback') === '1' || !CSS.supports('transform-style', 'preserve-3d')
};

function scene() { return SCENES[state.scene]; }

function sceneAccent() {
  const selected = scene();
  if (selected.behavior === 'palette') return selected.variants[state.effectStep % selected.variants.length];
  return selected.accent;
}

function isFormMode() { return state.form !== 'classic' && Boolean(FORM_DEFINITIONS[state.form]); }
function formDefinition() { return isFormMode() ? FORM_DEFINITIONS[state.form] : null; }
function isSurfaceMode() { return refs.root.dataset.panel === 'surfaces' && Boolean(SURFACE_DEFINITIONS[state.surface]); }
function surfaceDefinition() { return isSurfaceMode() ? SURFACE_DEFINITIONS[state.surface] : null; }
function isSpatialMode() { return isFormMode() || isSurfaceMode(); }
function activeAccent() { return isFormMode() ? formDefinition().accent : sceneAccent(); }
function selectedDirection() { return getDirectionById(state.direction) || DIRECTIONS[0]; }
function isExploreMode() { return refs.root.dataset.panel === 'explore'; }
function directionIndex() { return Math.max(0, DIRECTIONS.findIndex((direction) => direction.id === state.direction)); }
function setNodeText(node, value) {
  const next = String(value);
  if (node.textContent !== next) node.textContent = next;
}

function setTextList(node, values) {
  const signature = values.join('\u001f');
  if (node.dataset.items === signature) return;
  node.replaceChildren(...values.map((value) => {
    const item = document.createElement('li');
    item.textContent = value;
    return item;
  }));
  node.dataset.items = signature;
}

const TIER_COPY = Object.freeze({
  ALL: Object.freeze({ label: '全部', note: '全部成熟度' }),
  LIVE: Object.freeze({ label: 'LIVE', note: '真实可操作' }),
  REMIX: Object.freeze({ label: 'REMIX', note: '可信机制模拟' }),
  HORIZON: Object.freeze({ label: 'HORIZON', note: '远期系统方向' })
});

const AXIS_MEANING = Object.freeze({
  topology: '它让导航结构本身承担叙事：入口、方向与页序不再只是按钮，而是读者能理解和记住的空间关系。',
  mechanism: '它把一次输入变成可见的因果链，适合解释复杂产品、流程和系统，而不只是制造装饰动画。',
  optics: '它让信息在特定条件下显影，适合表达权限、对照、记忆和不确定性；关键是让触发条件可理解。',
  narrative: '它把线性章节升级成可组合、可分岔、可记忆的状态系统，内容架构会成为产品体验的一部分。',
  embodied: '它把阅读扩展到身体、他人和真实场所，能创造强参与感，但必须先解决可达性、隐私和替代路径。',
  generative: '它把书变成持续接收世界的容器；真正价值是可追溯、可复现和可校正，而不是简单加入生成效果。'
});

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function motif(kind, accent) {
  const ink = '#17383a';
  const pale = '#f5eedf';
  if (kind === 'orbs') return `<circle cx="895" cy="390" r="190" fill="${accent}"/><circle cx="1035" cy="235" r="112" fill="#f0b563" fill-opacity=".9"/><path d="M650 620C790 470 1020 540 1170 320" fill="none" stroke="${ink}" stroke-width="7"/>`;
  if (kind === 'coast') return `<path d="M600 550C720 275 830 610 955 360S1110 250 1200 165V760H600Z" fill="#9dcdc6"/><circle cx="1000" cy="210" r="96" fill="${accent}"/><path d="M625 575C800 435 980 585 1180 340" fill="none" stroke="${ink}" stroke-width="5"/>`;
  if (kind === 'blocks') return `<g transform="translate(680 180)"><path d="M0 300L150 180 315 270 155 390Z" fill="${accent}"/><path d="M150 180V390L315 270V70Z" fill="#df9c55"/><path d="M315 270L450 160V375L315 480Z" fill="${ink}" opacity=".82"/></g>`;
  if (kind === 'void') return `<circle cx="920" cy="375" r="220" fill="none" stroke="${accent}" stroke-width="2"/><circle cx="920" cy="375" r="8" fill="${accent}"/><path d="M690 610H1150" stroke="${ink}" stroke-width="3"/>`;
  if (kind === 'leaf') return `<path d="M650 610C670 235 900 150 1150 155 1100 480 915 640 650 610Z" fill="#b8d9bf" stroke="${accent}" stroke-width="6"/><path d="M680 580C810 430 930 300 1110 185M830 410L790 245M930 315L1045 400" fill="none" stroke="${accent}" stroke-width="5"/>`;
  if (kind === 'tide') return `<g fill="none" stroke="${accent}" stroke-linecap="round"><path d="M630 380C760 240 840 535 960 355S1110 300 1190 355" stroke-width="12"/><path d="M630 485C770 355 880 610 995 445S1120 390 1190 430" stroke-width="4" opacity=".48"/></g><g fill="#df8b67"><circle cx="770" cy="240" r="48"/><circle cx="1040" cy="560" r="31"/></g>`;
  if (kind === 'flight') return `<g fill="none" stroke="${accent}"><circle cx="930" cy="390" r="210" stroke-width="3"/><circle cx="930" cy="390" r="132" stroke-width="2"/><path d="M650 575C800 485 730 225 910 355S1100 515 1170 190" stroke-width="4" stroke-dasharray="12 14"/></g><circle cx="930" cy="390" r="38" fill="#e9ba61"/>`;
  if (kind === 'seed') return `<g fill="${accent}" opacity=".82"><ellipse cx="810" cy="375" rx="65" ry="175" transform="rotate(-28 810 375)"/><ellipse cx="965" cy="340" rx="55" ry="155" transform="rotate(24 965 340)"/><ellipse cx="1060" cy="480" rx="42" ry="120" transform="rotate(48 1060 480)"/></g><path d="M690 610C805 510 930 490 1130 190" fill="none" stroke="${ink}" stroke-width="4"/>`;
  if (kind === 'product') return `<path d="M820 150C930 115 1040 180 1065 305V595H735V305C755 225 785 175 820 150Z" fill="${accent}"/><ellipse cx="900" cy="320" rx="93" ry="118" fill="#ddd5ff"/><path d="M670 630H1150" stroke="${ink}" stroke-width="5"/>`;
  if (kind === 'material') return `<defs><linearGradient id="mat" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ded7ff"/><stop offset=".46" stop-color="${accent}"/><stop offset="1" stop-color="#352761"/></linearGradient></defs><path d="M650 605C715 145 905 120 1160 215L1095 625Z" fill="url(#mat)"/><circle cx="860" cy="305" r="116" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="3"/>`;
  if (kind === 'system') return `<g stroke="${accent}" fill="${pale}" stroke-width="5"><path d="M680 390H1140M810 390V230M1010 390V565"/><circle cx="680" cy="390" r="38"/><circle cx="810" cy="230" r="60"/><circle cx="920" cy="390" r="50"/><circle cx="1010" cy="565" r="60"/><circle cx="1140" cy="390" r="38"/></g>`;
  if (kind === 'daily') return `<rect x="715" y="170" width="365" height="420" rx="182" fill="${accent}"/><circle cx="898" cy="330" r="110" fill="#ddd5ff"/><path d="M650 635H1160" stroke="${ink}" stroke-width="4"/><path d="M790 220L1005 535" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>`;
  if (kind === 'wind') return `<g fill="none" stroke="${accent}" stroke-linecap="round"><path d="M650 320C790 180 900 455 1145 235" stroke-width="14"/><path d="M635 455C830 320 950 585 1180 360" stroke-width="6" opacity=".55"/></g><circle cx="1030" cy="180" r="78" fill="#e6ae4a"/>`;
  if (kind === 'city') return `<g fill="${accent}"><path d="M670 620V350H780V620ZM805 620V185H930V620ZM955 620V300H1055V620ZM1080 620V125H1185V620Z"/></g><g stroke="${pale}" opacity=".72" stroke-width="3"><path d="M835 250H900M835 305H900M1105 190H1165M1105 250H1165"/></g>`;
  if (kind === 'light') return `<defs><radialGradient id="light"><stop stop-color="#fff"/><stop offset=".2" stop-color="#f5d073"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs><circle cx="920" cy="390" r="300" fill="url(#light)"/><path d="M650 600L920 175 1170 600Z" fill="none" stroke="${accent}" stroke-width="5"/>`;
  if (kind === 'journey') return `<g fill="none" stroke="${accent}" opacity=".26"><path d="M650 520C735 410 760 255 900 285S1045 515 1180 350" stroke-width="5"/><path d="M635 585C755 465 785 330 905 350S1040 595 1195 430" stroke-width="3"/><path d="M690 430C760 350 780 210 905 225S1040 420 1145 300" stroke-width="2"/></g><g transform="translate(1035 155)" fill="none" stroke="${ink}" stroke-width="4"><circle cx="0" cy="0" r="54"/><path d="M0-42L13 0 0 42-13 0Z" fill="${accent}" stroke="none"/></g>`;
  if (kind === 'postcard') return `<g transform="translate(700 155) rotate(6 210 210)"><rect width="420" height="420" rx="8" fill="#fff" stroke="${ink}" stroke-width="4"/><path d="M24 300L145 205 240 270 330 150 396 215V395H24Z" fill="${accent}" opacity=".75"/><circle cx="92" cy="92" r="48" fill="#f0b563"/><path d="M250 65H375M250 95H350M250 125H380" stroke="${ink}" stroke-width="5" opacity=".5"/></g>`;
  if (kind === 'ridge') return `<path d="M635 600L775 340 870 455 985 190 1185 600Z" fill="${accent}" opacity=".76"/><path d="M635 600L775 340 870 455 985 190 1185 600" fill="none" stroke="${ink}" stroke-width="6"/><circle cx="1080" cy="180" r="72" fill="#f0b563"/>`;
  if (kind === 'stamp') return `<g transform="translate(720 150)"><rect width="370" height="440" rx="18" fill="none" stroke="${accent}" stroke-width="18" stroke-dasharray="26 14"/><circle cx="185" cy="205" r="118" fill="none" stroke="${ink}" stroke-width="6"/><path d="M80 205H290M185 100C130 160 130 250 185 310M185 100C240 160 240 250 185 310" fill="none" stroke="${ink}" stroke-width="5"/><path d="M70 355H300" stroke="${accent}" stroke-width="12"/></g>`;
  if (kind === 'ingredients') return `<g transform="translate(680 155)"><circle cx="150" cy="170" r="112" fill="${accent}"/><circle cx="340" cy="155" r="86" fill="#e8b95f"/><path d="M80 410C120 300 255 300 295 410" fill="#6ea878"/><path d="M280 430C340 280 440 325 470 430" fill="#9bbf74"/><g fill="${ink}"><circle cx="110" cy="145" r="8"/><circle cx="175" cy="195" r="8"/><circle cx="315" cy="135" r="7"/></g></g>`;
  if (kind === 'pan') return `<g transform="translate(650 150)"><ellipse cx="260" cy="285" rx="220" ry="175" fill="${ink}"/><ellipse cx="260" cy="270" rx="175" ry="128" fill="${accent}"/><path d="M450 280H550" stroke="${ink}" stroke-width="42" stroke-linecap="round"/><g fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".76"><path d="M180 230C160 185 205 175 190 130"/><path d="M270 220C250 170 300 155 280 110"/><path d="M350 240C325 190 370 180 355 135"/></g></g>`;
  if (kind === 'timer') return `<circle cx="910" cy="380" r="205" fill="${accent}" opacity=".18"/><circle cx="910" cy="380" r="155" fill="none" stroke="${accent}" stroke-width="18"/><path d="M910 380V260M910 380L1010 440" stroke="${ink}" stroke-width="14" stroke-linecap="round"/><rect x="840" y="145" width="140" height="54" rx="27" fill="${ink}"/>`;
  if (kind === 'plate') return `<circle cx="910" cy="380" r="225" fill="#fff" stroke="${ink}" stroke-width="5"/><circle cx="910" cy="380" r="168" fill="${accent}" opacity=".22"/><path d="M790 410C820 275 1000 270 1045 420 950 500 855 500 790 410Z" fill="${accent}"/><g fill="#6ea878"><ellipse cx="850" cy="290" rx="28" ry="55" transform="rotate(-35 850 290)"/><ellipse cx="975" cy="300" rx="25" ry="52" transform="rotate(38 975 300)"/></g>`;
  if (kind === 'panels') return `<g fill="none" stroke="${ink}" stroke-width="7"><rect x="650" y="150" width="235" height="190"/><rect x="910" y="150" width="250" height="190"/><rect x="650" y="365" width="510" height="250"/></g><circle cx="790" cy="245" r="60" fill="${accent}"/><path d="M960 295L1110 195" stroke="${accent}" stroke-width="14"/><path d="M735 545C840 405 990 560 1100 420" fill="none" stroke="${accent}" stroke-width="12"/>`;
  if (kind === 'burst') return `<path d="M920 125L965 285 1110 185 1015 330 1180 350 1015 395 1135 520 970 440 920 625 875 455 715 550 825 400 640 370 820 330 700 205 870 290Z" fill="${accent}"/><circle cx="920" cy="370" r="104" fill="${pale}"/><path d="M850 370H990" stroke="${ink}" stroke-width="18"/>`;
  if (kind === 'night-panel') return `<rect x="640" y="125" width="540" height="510" rx="6" fill="#17383a"/><circle cx="1020" cy="235" r="75" fill="${accent}"/><g fill="#f5eedf"><circle cx="735" cy="200" r="5"/><circle cx="845" cy="265" r="4"/><circle cx="1095" cy="360" r="5"/></g><path d="M680 570L800 405 890 500 1000 340 1140 570Z" fill="#2b5356"/>`;
  if (kind === 'finale') return `<g fill="none" stroke="${ink}" stroke-width="7"><rect x="690" y="165" width="420" height="430" rx="8"/><path d="M900 165V595M690 380H1110"/></g><path d="M805 415C860 310 955 310 1010 415" fill="${accent}"/><path d="M810 280C865 225 950 225 1000 280" fill="none" stroke="${accent}" stroke-width="16" stroke-linecap="round"/>`;
  if (kind === 'chair') return `<path d="M760 245C760 165 835 130 930 155L1015 178V430H760Z" fill="${accent}"/><path d="M760 430H1040V520H735V455C735 440 745 430 760 430Z" fill="${ink}"/><path d="M780 515L745 625M1000 515L1035 625" stroke="${ink}" stroke-width="22" stroke-linecap="round"/>`;
  if (kind === 'lamp') return `<path d="M820 190H1030L1090 390H760Z" fill="${accent}"/><rect x="900" y="390" width="26" height="180" fill="${ink}"/><ellipse cx="913" cy="585" rx="145" ry="38" fill="${ink}"/><circle cx="913" cy="385" r="170" fill="${accent}" opacity=".12"/>`;
  if (kind === 'vase') return `<path d="M820 175H1010C970 270 995 320 1045 410 1095 500 1020 610 915 610S735 500 785 410C835 320 860 270 820 175Z" fill="${accent}"/><path d="M835 225C900 265 950 265 995 225M805 430C880 390 955 390 1025 430" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="5"/>`;
  if (kind === 'shelf') return `<g fill="${accent}"><rect x="670" y="185" width="120" height="350"/><rect x="820" y="265" width="105" height="270"/><rect x="955" y="145" width="185" height="390"/></g><path d="M640 555H1180" stroke="${ink}" stroke-width="28"/><g fill="#fff" opacity=".42"><rect x="705" y="230" width="50" height="150"/><circle cx="1048" cy="300" r="56"/></g>`;
  return `<path d="M650 590C745 220 1010 160 1160 240" fill="none" stroke="${accent}" stroke-width="5"/><g fill="${accent}"><circle cx="720" cy="505" r="24"/><circle cx="835" cy="315" r="24"/><circle cx="990" cy="220" r="24"/><circle cx="1120" cy="310" r="24"/></g><path d="M720 505L835 315 990 220 1120 310" fill="none" stroke="${ink}" stroke-width="3" stroke-dasharray="8 10"/>`;
}

function spreadUrl(sceneData, page, pageIndex) {
  const [label, title, subtitle, kind] = page;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_W} ${SVG_H}">
    <defs><pattern id="grain" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="4" cy="8" r="1" fill="#4a3924" opacity=".045"/><circle cx="26" cy="26" r=".8" fill="#4a3924" opacity=".035"/></pattern></defs>
    <rect width="1200" height="760" fill="#f5eedf"/><rect width="1200" height="760" fill="url(#grain)"/><path d="M600 0V760" stroke="#725f49" stroke-opacity=".13"/>
    <text x="68" y="76" fill="#667577" font-family="monospace" font-size="14" letter-spacing="4">${escapeXml(label)}</text>
    <text x="1132" y="76" fill="#667577" font-family="monospace" font-size="14" text-anchor="end">${String(pageIndex + 1).padStart(2, '0')} / 04</text>
    <text x="68" y="300" fill="#17383a" font-family="Georgia,serif" font-size="66">${escapeXml(title)}</text>
    <text x="72" y="365" fill="#667577" font-family="Arial,sans-serif" font-size="20">${escapeXml(subtitle)}</text>
    <rect x="70" y="600" width="116" height="34" rx="17" fill="${sceneData.accent}"/><text x="128" y="622" text-anchor="middle" fill="#fff" font-family="monospace" font-size="11">LIVE EDITION</text>
    ${motif(kind, sceneData.accent)}
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function urls() {
  const selected = { ...scene(), accent: sceneAccent() };
  return selected.pages.map((page, index) => spreadUrl(selected, page, index));
}

function element(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function setSlice(node, url, width, height, sourceX) {
  node.style.backgroundImage = `url("${url}")`;
  node.style.backgroundSize = `${width}px ${height}px`;
  node.style.backgroundPosition = `${-sourceX}px 0`;
}

function createHalf(side, url, width, height) {
  const half = element('div', `book-half ${side}`);
  setSlice(half, url, width, height, side === 'left' ? 0 : width / 2);
  half.setAttribute('aria-hidden', 'true');
  return half;
}

function geometry(progress) {
  const t = clamp(Number(progress) || 0);
  const theta = Math.PI * t;
  const beta = state.peakCurl * Math.sin(Math.PI * t);
  return { progress: t, theta, beta, rootAngle: theta + beta, segmentAngle: (2 * beta) / state.strips };
}

function createCurvedLeaf(turn, pageUrls, width, height) {
  const curl = element('div', `turn-curved ${turn.direction}`);
  const stripWidth = width / 2 / state.strips;
  let host = curl;
  turn.strips = [];

  for (let index = 0; index < state.strips; index += 1) {
    const strip = element('div', 'strip');
    strip.style.width = `${stripWidth + 0.5}px`;
    const front = element('div', 'strip-face front');
    const back = element('div', 'strip-face back');
    const frontX = turn.direction === 'next'
      ? width / 2 + index * stripWidth
      : width / 2 - (index + 1) * stripWidth;
    const backX = turn.direction === 'next'
      ? width / 2 - (index + 1) * stripWidth
      : width / 2 + index * stripWidth;
    setSlice(front, pageUrls[turn.from], width, height, frontX);
    setSlice(back, pageUrls[turn.to], width, height, backX);
    front.append(element('i', 'strip-light'));
    back.append(element('i', 'strip-light'));
    strip.append(front, back);
    host.append(strip);
    host = strip;
    turn.strips.push(strip);
  }
  return curl;
}

function createCornerPage(url, width, height) {
  const page = element('div', 'corner-page');
  setSlice(page, url, width, height, width / 2);
  page.style.setProperty('--corner-x', `${state.cornerX}%`);
  page.style.setProperty('--corner-y', `${state.cornerY}%`);
  page.setAttribute('aria-hidden', 'true');
  return page;
}

function createSceneEffect() {
  const selected = scene();
  if (!state.sceneAction || !['route', 'steps', 'focus', 'palette'].includes(selected.behavior)) return null;
  const effect = element('div', `scene-effect-layer scene-effect-layer--${selected.behavior}`);
  effect.id = 'scene-effect-layer';
  effect.dataset.effect = selected.behavior;
  effect.dataset.step = String(state.effectStep);
  effect.setAttribute('aria-hidden', 'true');

  if (selected.behavior === 'route') {
    const points = [[680,540],[820,315],[1000,455],[1140,225]];
    effect.innerHTML = `<svg viewBox="0 0 ${SVG_W} ${SVG_H}" preserveAspectRatio="none">
      <path class="route-track" d="M680 540C735 475 755 330 820 315S920 490 1000 455 1075 270 1140 225"/>
      <path class="route-progress" d="M680 540C735 475 755 330 820 315S920 490 1000 455 1075 270 1140 225"/>
      ${points.map(([x,y], index) => `<g><circle class="route-stop ${index < state.effectStep ? 'is-passed' : ''} ${index === state.effectStep ? 'is-active' : ''}" cx="${x}" cy="${y}" r="28"/><text class="route-label" x="${x}" y="${y + 1}">${index + 1}</text></g>`).join('')}
    </svg><div class="scene-effect__caption"><span>LIVE ROUTE · ${String(state.effectStep + 1).padStart(2, '0')}/04</span><strong>${escapeXml(selected.stops[state.effectStep])}</strong></div>`;
  }

  if (selected.behavior === 'steps') {
    const ready = state.effectStep >= selected.steps.length;
    effect.innerHTML = `${ready ? '<div class="recipe-ready">✓ 可以上桌</div>' : ''}<div class="scene-effect__steps">${selected.steps.map((label, index) => {
      const complete = ready || index < state.effectStep;
      const active = !ready && index === state.effectStep;
      return `<div class="recipe-step ${complete ? 'is-complete' : ''} ${active ? 'is-active' : ''}"><i>${complete ? '✓' : index + 1}</i><span>${escapeXml(label)}</span></div>`;
    }).join('')}</div>`;
  }

  if (selected.behavior === 'focus') {
    const frame = selected.frames[state.effectStep % selected.frames.length];
    effect.style.setProperty('--focus-x', `${frame.x}%`);
    effect.style.setProperty('--focus-y', `${frame.y}%`);
    effect.style.setProperty('--focus-w', `${frame.w}%`);
    effect.style.setProperty('--focus-h', `${frame.h}%`);
    effect.innerHTML = `<div class="comic-focus"><span>${escapeXml(frame.label)}</span></div>`;
  }

  if (selected.behavior === 'palette') {
    effect.innerHTML = `<div class="catalog-palette"><span>LIVE COLORWAY</span>${selected.variants.map((color, index) => `<i class="catalog-swatch ${index === state.effectStep ? 'is-active' : ''}" style="--swatch:${color}" title="${escapeXml(selected.variantNames[index])}"></i>`).join('')}</div>`;
  }
  return effect;
}

function canTurn(direction) {
  return direction === 'next' ? state.index < scene().pages.length - 1 : state.index > 0;
}

function cancelAnimation() {
  if (state.animationFrame !== null) cancelAnimationFrame(state.animationFrame);
  state.animationFrame = null;
  state.introRunning = false;
}

function applyView() {
  refs.book.style.setProperty('--book-zoom', state.view.zoom.toFixed(2));
  refs.book.style.setProperty('--tilt-x', `${state.view.tiltX.toFixed(2)}deg`);
  refs.book.style.setProperty('--tilt-y', `${state.view.tiltY.toFixed(2)}deg`);
  refs.zoomOutput.textContent = `${Math.round(state.view.zoom * 100)}%`;
  refs.zoomOut.disabled = state.view.zoom <= .84 || state.fallback;
  refs.zoomIn.disabled = state.view.zoom >= 1.16 || state.fallback;
}

function sceneActionLabel(selected) {
  if (!state.sceneAction) return selected.action;
  if (selected.behavior === 'route') return `下一站 · ${String((state.effectStep + 1) % selected.stops.length + 1).padStart(2, '0')}/04`;
  if (selected.behavior === 'steps') {
    if (state.effectStep >= selected.steps.length) return '重新开始烹饪';
    if (state.effectStep === selected.steps.length - 1) return '完成烹饪';
    return `下一步骤 · ${selected.steps[state.effectStep + 1]}`;
  }
  if (selected.behavior === 'focus') return `下一格 · ${String((state.effectStep + 1) % selected.frames.length + 1).padStart(2, '0')}/03`;
  if (selected.behavior === 'palette') return `下一配色 · ${selected.variantNames[(state.effectStep + 1) % selected.variants.length]}`;
  return selected.activeAction;
}

function currentFormState() {
  return {
    progress: state.formProgress,
    step: state.formStep,
    turn: state.formTurn,
    fallback: state.fallback,
    playing: state.formTimer !== null
  };
}

function stopFormPlayback(message = '') {
  if (state.formTimer !== null) window.clearInterval(state.formTimer);
  state.formTimer = null;
  if (message) setStatus(message);
}

function releaseFormDrag() {
  const pointerId = state.formDrag?.pointerId;
  if (pointerId !== undefined && refs.book.hasPointerCapture?.(pointerId)) {
    try { refs.book.releasePointerCapture(pointerId); } catch { /* capture may already be gone */ }
  }
  state.formDrag = null;
  state.formTurn = 0;
  refs.book.classList.remove('is-dragging');
}

function syncFormSurface({ announce = false } = {}) {
  if (!isFormMode()) return;
  const surface = refs.book.querySelector('.form-surface');
  if (surface) applyFormState(surface, state.form, currentFormState());
  if (announce) setStatus(formStatusText(state.form, currentFormState()));
}

function setFormProgress(value, { announce = true } = {}) {
  if (!isFormMode() || state.fallback) return;
  state.formProgress = clamp(Number(value) || 0);
  syncFormSurface({ announce });
  updateControls();
}

function resetForm({ announce = true } = {}) {
  if (!isFormMode()) return;
  stopFormPlayback();
  releaseFormDrag();
  state.formProgress = 0;
  state.formStep = 0;
  state.formTurn = 0;
  state.formDrag = null;
  syncFormSurface();
  updateControls();
  if (announce) setStatus(`${formDefinition().name} 已复位`);
}

function selectForm(name, { announce = true } = {}) {
  if (!FORM_DEFINITIONS[name]) return;
  stopIntro();
  stopAuto();
  stopFormPlayback();
  releaseFormDrag();
  cancelAnimation();
  state.turn = null;
  state.drag = null;
  state.cornerOn = false;
  state.loupeOn = false;
  state.form = name;
  state.lastForm = name;
  state.formProgress = state.fallback ? 1 : 0;
  state.formStep = 0;
  state.formTurn = 0;
  state.formDrag = null;
  render();
  if (announce) setStatus(`${formDefinition().name} · 拖动中央书体体验`);
}

function selectAdjacentForm(delta) {
  if (!isFormMode()) return;
  const index = FORM_ORDER.indexOf(state.form);
  const target = clamp(index + delta, 0, FORM_ORDER.length - 1);
  if (target === index) {
    setStatus(delta < 0 ? '已是第一种书型' : '已是最后一种书型');
    return;
  }
  selectForm(FORM_ORDER[target]);
}

function surfaceContextData() {
  const selected = scene();
  return {
    id: state.scene,
    kicker: selected.kicker,
    title: selected.title,
    dek: selected.dek,
    pages: selected.pages,
    labels: selected.stops || selected.steps || selected.frames?.map((frame) => frame.label) || selected.pages.map((page) => page[1])
  };
}

function currentSurfaceState() {
  return {
    progress: state.surfaceProgress,
    step: state.surfaceStep,
    turn: state.surfaceTurn,
    detached: state.surfaceDetached,
    fallback: state.fallback,
    material: state.material,
    context: state.scene
  };
}

function syncSurfaceUrl() {
  if (!isSurfaceMode()) return;
  const url = new URL(window.location.href);
  url.searchParams.set('rev', '7');
  url.searchParams.set('panel', 'surfaces');
  url.searchParams.set('surface', state.surface);
  url.searchParams.set('material', state.material);
  url.searchParams.set('scene', state.scene);
  url.searchParams.set('progress', state.surfaceProgress.toFixed(2));
  url.searchParams.set('intro', '0');
  if (state.surfaceDetached) url.searchParams.set('detached', '1');
  else url.searchParams.delete('detached');
  url.searchParams.delete('form');
  url.searchParams.delete('direction');
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

function syncPanelUrl(name) {
  const url = new URL(window.location.href);
  url.searchParams.set('rev', '7');
  url.searchParams.set('panel', name);
  url.searchParams.set('scene', state.scene);
  url.searchParams.set('intro', '0');
  url.searchParams.delete('surface');
  url.searchParams.delete('material');
  url.searchParams.delete('detached');
  if (name === 'forms') {
    url.searchParams.set('form', state.form);
    url.searchParams.set('progress', state.formProgress.toFixed(2));
    url.searchParams.delete('direction');
  } else if (name === 'explore') {
    url.searchParams.set('direction', state.direction);
    url.searchParams.delete('form');
    url.searchParams.delete('progress');
  } else {
    url.searchParams.delete('form');
    url.searchParams.delete('direction');
    url.searchParams.delete('progress');
  }
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

function releaseSurfaceDrag() {
  const pointerId = state.surfaceDrag?.pointerId;
  if (pointerId !== undefined && refs.book.hasPointerCapture?.(pointerId)) {
    try { refs.book.releasePointerCapture(pointerId); } catch { /* capture may already be gone */ }
  }
  state.surfaceDrag = null;
  state.surfaceTurn = 0;
  refs.book.classList.remove('is-dragging');
}

function surfacePointerDelta(event, drag) {
  const definition = surfaceDefinition();
  const deltaX = (event.clientX - drag.startX) / Math.max(1, drag.width);
  const deltaY = (event.clientY - drag.startY) / Math.max(1, drag.height);
  if (definition.dragAxis === 'diagonal') return -(deltaX + deltaY) / 1.35;
  if (definition.dragAxis === 'split') return deltaX * drag.outwardDirection;
  if (definition.dragAxis === 'y') return deltaY * definition.dragDirection;
  return deltaX * definition.dragDirection;
}

function syncSurface({ announce = false, syncUrl = false } = {}) {
  if (!isSurfaceMode()) return;
  const surface = refs.book.querySelector('.deformable-surface');
  if (surface) applyDeformableSurfaceState(surface, state.surface, currentSurfaceState());
  if (announce) setStatus(surfaceStatusText(state.surface, currentSurfaceState()));
  if (syncUrl) syncSurfaceUrl();
}

function setSurfaceProgress(value, { announce = true, syncUrl = true } = {}) {
  if (!isSurfaceMode() || state.fallback) return;
  state.surfaceProgress = clamp(Number(value) || 0);
  if (surfaceDefinition().kind === 'cycle') {
    state.surfaceStep = Math.round(state.surfaceProgress * (surfaceDefinition().maxStep ?? 0));
  }
  if (state.surfaceProgress < .98) state.surfaceDetached = false;
  syncSurface({ announce, syncUrl });
  updateControls();
}

function resetSurface({ announce = true } = {}) {
  if (!isSurfaceMode()) return;
  releaseSurfaceDrag();
  state.surfaceProgress = state.fallback ? (surfaceDefinition().fallbackProgress ?? 1) : 0;
  state.surfaceStep = 0;
  state.surfaceTurn = 0;
  state.surfaceDetached = false;
  syncSurface({ syncUrl: true });
  updateControls();
  if (announce) setStatus(`${surfaceDefinition().name} 已复位`);
}

function selectSurface(name, { announce = true } = {}) {
  if (!SURFACE_DEFINITIONS[name]) return;
  stopIntro();
  stopAuto();
  stopFormPlayback();
  releaseFormDrag();
  releaseSurfaceDrag();
  cancelAnimation();
  state.turn = null;
  state.drag = null;
  state.form = 'classic';
  state.cornerOn = false;
  state.loupeOn = false;
  state.surface = name;
  state.lastSurface = name;
  state.surfaceProgress = state.fallback ? (SURFACE_DEFINITIONS[name].fallbackProgress ?? 1) : 0;
  state.surfaceStep = 0;
  state.surfaceTurn = 0;
  state.surfaceDetached = false;
  render();
  syncSurfaceUrl();
  if (announce) setStatus(`${SURFACE_DEFINITIONS[name].name} · 拖动中央表面体验`);
}

function selectAdjacentSurface(delta) {
  if (!isSurfaceMode()) return;
  const index = SURFACE_ORDER.indexOf(state.surface);
  const target = clamp(index + delta, 0, SURFACE_ORDER.length - 1);
  if (target === index) {
    setStatus(delta < 0 ? '已是第一种可变表面' : '已是最后一种可变表面');
    return;
  }
  selectSurface(SURFACE_ORDER[target]);
}

function selectSurfaceMaterial(name) {
  if (!MATERIAL_DEFINITIONS[name] || name === state.material) return;
  state.material = name;
  render();
  syncSurfaceUrl();
  setStatus(`${MATERIAL_DEFINITIONS[name].name} · ${MATERIAL_DEFINITIONS[name].boundary}`);
}

function selectSurfaceContext(name) {
  if (!SCENES[name] || name === state.scene) return;
  state.scene = name;
  state.sceneAction = false;
  state.effectStep = 0;
  render();
  syncSurfaceUrl();
  setStatus(`${scene().title} 已作为当前表面内容`);
}

function performSurfaceAction() {
  if (!isSurfaceMode() || state.fallback) return;
  const definition = surfaceDefinition();
  if (definition.kind === 'release') {
    if (state.surfaceDetached || state.surfaceProgress >= .98) {
      state.surfaceDetached = false;
      state.surfaceProgress = 0;
    } else if (state.surfaceProgress < .42) {
      state.surfaceProgress = .62;
    } else {
      state.surfaceProgress = 1;
      state.surfaceDetached = true;
    }
  } else if (definition.kind === 'cycle') {
    const maxStep = definition.maxStep ?? 0;
    state.surfaceStep = state.surfaceStep >= maxStep ? 0 : state.surfaceStep + 1;
    state.surfaceProgress = state.surfaceStep === 0 ? 0 : state.surfaceStep / Math.max(1, maxStep);
    state.surfaceDetached = false;
  } else {
    state.surfaceProgress = state.surfaceProgress >= .5 ? 0 : 1;
    state.surfaceDetached = false;
  }
  syncSurface({ announce: true, syncUrl: true });
  updateControls();
}

function selectAdjacentDirection(delta) {
  const index = directionIndex();
  const target = clamp(index + delta, 0, DIRECTIONS.length - 1);
  if (target === index) {
    setStatus(delta < 0 ? '已是图谱第一项' : '已是图谱最后一项');
    return;
  }
  selectDirection(DIRECTIONS[target].id);
}

function atlasFilteredDirections() {
  return getDirections({ axis: state.directionAxis, tier: state.directionTier });
}

function tierBoundaryCopy(direction) {
  if (direction.tier === 'LIVE') {
    return `当前页面包含「${FORM_DEFINITIONS[direction.form]?.name || direction.name}」的真实 DOM / CSS 交互原型。`;
  }
  if (direction.tier === 'REMIX') {
    return direction.form
      ? `当前舞台借用「${FORM_DEFINITIONS[direction.form].name}」解释相邻机制；材料或系统行为仍是可信模拟，不代表完整复刻。`
      : '当前方向可在现有网页架构中做可信模拟，但还没有被包装成独立书型。';
  }
  return direction.form
    ? `当前舞台只展示与它最接近的「${FORM_DEFINITIONS[direction.form].name}」；完整方向仍需要额外硬件、实时服务、多人同步或 WebGL。`
    : '这是远期系统方向；需要额外硬件、实时服务、多人同步或 WebGL，当前不冒充已实现。';
}

function renderAtlasFilters() {
  if (!refs.axisFilter || !refs.tierFilter) return;
  refs.axisFilter.innerHTML = [
    `<button type="button" data-axis="all" aria-pressed="${String(state.directionAxis === 'all')}"><b>∞</b><span>全部</span></button>`,
    ...AXES.map((axis) => `<button type="button" data-axis="${axis.id}" aria-pressed="${String(state.directionAxis === axis.id)}" style="--axis-accent:${axis.accent}"><b>${axis.index}</b><span>${escapeXml(axis.name)}</span></button>`)
  ].join('');

  const stats = directionStats();
  refs.tierFilter.innerHTML = Object.keys(TIER_COPY).map((tier) => {
    const count = tier === 'ALL' ? stats.total : stats.byTier[tier];
    return `<button type="button" data-tier="${tier}" aria-pressed="${String(state.directionTier === tier)}"><strong>${TIER_COPY[tier].label}</strong><small>${escapeXml(TIER_COPY[tier].note)} · ${count}</small></button>`;
  }).join('');
}

function renderDirectionList() {
  if (!refs.directionList) return;
  const directions = atlasFilteredDirections();
  refs.atlasResultCount.textContent = String(directions.length);
  if (directions.length === 0) {
    refs.directionList.innerHTML = '<p class="direction-list__empty">这组筛选暂时没有方向。切换成熟度或研究轴继续探索。</p>';
    return;
  }
  refs.directionList.innerHTML = directions.map((direction) => {
    const axis = getAxisById(direction.axis);
    const selected = direction.id === state.direction;
    return `<button class="direction-item" type="button" role="option" data-direction="${direction.id}" data-tier="${direction.tier.toLowerCase()}" aria-selected="${String(selected)}" style="--axis-accent:${axis.accent}">
      <span class="direction-item__index">${axis.index}.${String(DIRECTIONS.indexOf(direction) % 6 + 1).padStart(2, '0')}</span>
      <span class="direction-item__name"><strong>${escapeXml(direction.name)}</strong><small>${escapeXml(direction.englishName)}</small></span>
      <b class="direction-tier">${direction.tier}</b>
    </button>`;
  }).join('');
  requestAnimationFrame(() => {
    const selectedItem = refs.directionList.querySelector('[aria-selected="true"]');
    if (!selectedItem || refs.directionList.scrollHeight <= refs.directionList.clientHeight) return;
    const localTop = selectedItem.offsetTop - refs.directionList.offsetTop;
    refs.directionList.scrollTop = Math.max(0, localTop - refs.directionList.clientHeight / 2 + selectedItem.offsetHeight / 2);
  });
}

function renderDirectionDetail() {
  if (!refs.directionDetail) return;
  const direction = selectedDirection();
  const axis = getAxisById(direction.axis);
  const activeCombination = COMBINATIONS.find((combination) => combination.id === state.combination && combination.directions.includes(direction.id));
  const formName = direction.form && FORM_DEFINITIONS[direction.form]?.name;
  const actionLabel = direction.tier === 'LIVE' ? '打开完整书型控制' : '查看邻近机制原型';
  const combinationCallout = activeCombination ? `<section class="direction-detail__combo-callout">
    <span>ACTIVE COMBINATION</span><h4>${escapeXml(activeCombination.name)}</h4>
    <p>${escapeXml(activeCombination.mechanism)}</p><small>首要风险 · ${escapeXml(activeCombination.risk)}</small>
  </section>` : '';

  refs.directionDetail.dataset.tier = direction.tier.toLowerCase();
  refs.directionDetail.innerHTML = `<header class="direction-detail__header" style="--axis-accent:${axis.accent}">
      <div><span>${axis.index} · ${escapeXml(axis.name)}</span><b class="direction-tier">${direction.tier}</b></div>
      <h3>${escapeXml(direction.name)}</h3><p>${escapeXml(direction.englishName)}</p>
    </header>
    ${combinationCallout}
    <div class="direction-detail__essentials">
      <section><span>CORE STRUCTURE</span><h4>核心结构</h4><p>${escapeXml(direction.coreStructure)}</p></section>
      <section><span>PRIMARY ACTION</span><h4>主要动作</h4><p>${escapeXml(direction.primaryAction)}</p></section>
    </div>
    <section class="direction-detail__section"><span>SCENARIOS</span><h4>适用场景</h4><div class="direction-chips">${direction.scenarios.map((scenario) => `<i>${escapeXml(scenario)}</i>`).join('')}</div></section>
    <section class="direction-detail__section"><span>TECHNICAL MECHANISM</span><h4>技术机制</h4><p>${escapeXml(direction.technicalMechanism)}</p></section>
    <section class="direction-detail__section direction-detail__section--meaning"><span>WHY THIS MATTERS</span><h4>对你的意义</h4><p>${escapeXml(AXIS_MEANING[direction.axis])} 在「${escapeXml(direction.scenarios.slice(0, 2).join('、'))}」中，它能把内容关系转成可操作的体验。</p></section>
    <section class="direction-detail__section direction-detail__section--risk"><span>LARGEST RISK</span><h4>最大风险</h4><p>${escapeXml(direction.largestRisk)}</p></section>
    <section class="direction-detail__section"><span>COMBINE WITH</span><h4>可组合方向</h4><div class="direction-chips">${direction.combinationSuggestion.map((item) => `<i>${escapeXml(item)}</i>`).join('')}</div></section>
    <section class="direction-detail__section direction-detail__section--next"><span>NEXT EXPERIMENT</span><h4>下一步验证</h4><p>${escapeXml(direction.nextExperiment)}</p></section>
    <footer class="direction-detail__boundary"><p><strong>${direction.tier}</strong>${escapeXml(tierBoundaryCopy(direction))}</p>
      ${formName ? `<button class="action action--primary" type="button" data-open-form="${direction.form}">${actionLabel} · ${escapeXml(formName)}</button>` : ''}
    </footer>`;
}

function renderCombinationList() {
  if (!refs.combinationList) return;
  refs.combinationList.innerHTML = COMBINATIONS.map((combination, index) => {
    const labels = combination.directions.map((id) => getDirectionById(id)?.name).filter(Boolean);
    return `<details class="combination-item" data-active="${String(combination.id === state.combination)}" ${index === 0 ? 'open' : ''}>
      <summary><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeXml(combination.name)}</strong><small>${escapeXml(combination.problem)}</small></summary>
      <div class="combination-item__body"><p><b>组合机制</b>${escapeXml(combination.mechanism)}</p><p><b>首要风险</b>${escapeXml(combination.risk)}</p>
      <div class="direction-chips">${labels.map((label) => `<i>${escapeXml(label)}</i>`).join('')}</div>
      <button type="button" data-combination-demo="${combination.id}">把相邻实作送入舞台 <span aria-hidden="true">→</span></button></div>
    </details>`;
  }).join('');
}

function renderCreativeAtlas() {
  const hasResults = atlasFilteredDirections().length > 0;
  refs.directionDetail.hidden = !hasResults;
  renderAtlasFilters();
  renderDirectionList();
  if (hasResults) renderDirectionDetail();
  renderCombinationList();
}

function selectDirection(directionId, { announce = true, combinationId = null } = {}) {
  const direction = getDirectionById(directionId);
  if (!direction) return;
  state.direction = direction.id;
  state.combination = combinationId;
  if (direction.form && FORM_DEFINITIONS[direction.form]) {
    selectForm(direction.form, { announce: false });
  } else {
    updateControls();
  }
  renderCreativeAtlas();
  if (!announce) return;
  if (direction.tier === 'LIVE' && direction.form) {
    setStatus(`${direction.name} · LIVE 实作已送入中央舞台`);
  } else if (direction.form) {
    setStatus(`${direction.name} · 舞台显示邻近机制「${FORM_DEFINITIONS[direction.form].name}」`);
  } else {
    setStatus(`${direction.name} · ${direction.tier} 概念边界已展开`);
  }
}

function applyDirectionFilter(kind, value) {
  if (kind === 'axis') state.directionAxis = getAxisById(value) ? value : 'all';
  if (kind === 'tier') state.directionTier = TIER_COPY[value] ? value : 'ALL';
  const filtered = atlasFilteredDirections();
  if (filtered.length && !filtered.some((direction) => direction.id === state.direction)) {
    state.direction = filtered[0].id;
    selectDirection(state.direction, { announce: false });
  } else {
    renderCreativeAtlas();
  }
  setStatus(`${filtered.length} 个创意方向符合当前筛选`);
}

function demonstrateCombination(combinationId) {
  const combination = COMBINATIONS.find((item) => item.id === combinationId);
  if (!combination) return;
  const directions = combination.directions.map((id) => getDirectionById(id)).filter(Boolean);
  const target = directions.find((direction) => direction.tier === 'LIVE' && direction.form)
    || directions.find((direction) => direction.form)
    || directions[0];
  if (!target) return;
  state.directionAxis = 'all';
  state.directionTier = 'ALL';
  selectDirection(target.id, { announce: false, combinationId: combination.id });
  setStatus(`${combination.name} · 以「${target.name}」演示其中一条机制链`);
}

function advanceFormFrame() {
  const definition = formDefinition();
  if (!definition) return;
  const count = (definition.maxStep ?? 0) + 1;
  state.formStep = (state.formStep + 1) % Math.max(1, count);
  state.formProgress = 0;
  if (state.formStep === 0) state.formTurn = state.formTurn >= .8 ? -.8 : state.formTurn + .2;
  syncFormSurface();
  updateControls();
}

function performFormAction() {
  if (!isFormMode() || state.fallback) return;
  const definition = formDefinition();
  if (definition.kind === 'toggle') {
    stopFormPlayback();
    state.formProgress = state.formProgress >= .5 ? 0 : 1;
  } else if (definition.kind === 'play') {
    if (state.formTimer !== null) {
      stopFormPlayback('翻动画面已暂停');
      syncFormSurface();
      updateControls();
      return;
    }
    if (motionQuery.matches) {
      advanceFormFrame();
      setStatus('已遵循减少动态偏好 · 单帧推进');
      return;
    }
    state.formTimer = window.setInterval(advanceFormFrame, 150);
    syncFormSurface();
    updateControls();
    setStatus('十二帧翻动画面播放中');
    return;
  } else {
    const maxStep = definition.maxStep ?? 0;
    const nextStep = state.formStep >= maxStep ? 0 : state.formStep + 1;
    if (state.form === 'infinite' && nextStep === 0) {
      state.formTurn = state.formTurn >= .8 ? -.8 : state.formTurn + .2;
    }
    state.formStep = nextStep;
    state.formProgress = nextStep === 0 ? 0 : nextStep / Math.max(1, maxStep);
  }
  syncFormSurface({ announce: true });
  updateControls();
}

function updateControls() {
  const selected = scene();
  const formMode = isFormMode();
  const surfaceMode = isSurfaceMode();
  const spatialMode = formMode || surfaceMode;
  const exploreMode = isExploreMode();
  const selectedForm = formDefinition();
  const selectedSurface = surfaceDefinition();
  const formIndex = formMode ? FORM_ORDER.indexOf(state.form) : -1;
  const surfaceIndex = surfaceMode ? SURFACE_ORDER.indexOf(state.surface) : -1;
  const atlasDirection = selectedDirection();
  const atlasAxis = getAxisById(atlasDirection.axis);
  const atlasIndex = directionIndex();
  refs.stage.dataset.scene = state.scene;
  refs.stage.dataset.form = formMode ? state.form : 'classic';
  refs.stage.dataset.surface = surfaceMode ? state.surface : '';
  refs.stage.dataset.material = surfaceMode ? state.material : '';
  refs.stage.dataset.tier = exploreMode ? atlasDirection.tier.toLowerCase() : '';
  refs.stage.style.setProperty('--scene-accent', activeAccent());
  if (exploreMode) {
    setNodeText(refs.sceneKicker, `${atlasAxis.index} · ${atlasDirection.tier} · ${atlasDirection.englishName}`);
    setNodeText(refs.sceneTitle, atlasDirection.name);
    setNodeText(refs.sceneDek, atlasDirection.tier === 'LIVE'
      ? atlasDirection.primaryAction
      : `邻近机制演示 · ${atlasDirection.primaryAction}`);
  } else if (surfaceMode) {
    setNodeText(refs.sceneKicker, `${selectedSurface.kicker} · ${MATERIAL_DEFINITIONS[state.material].name}`);
    setNodeText(refs.sceneTitle, selectedSurface.title);
    setNodeText(refs.sceneDek, `${selectedSurface.dek} 当前内容：${selected.title}`);
  } else {
    setNodeText(refs.sceneKicker, formMode ? selectedForm.kicker : selected.kicker);
    setNodeText(refs.sceneTitle, formMode ? selectedForm.title : selected.title);
    setNodeText(refs.sceneDek, formMode ? selectedForm.dek : selected.dek);
  }
  refs.current.textContent = String(exploreMode ? atlasIndex + 1 : surfaceMode ? surfaceIndex + 1 : formMode ? formIndex + 1 : state.index + 1).padStart(2, '0');
  refs.total.textContent = String(exploreMode ? DIRECTIONS.length : surfaceMode ? SURFACE_ORDER.length : formMode ? FORM_ORDER.length : selected.pages.length).padStart(2, '0');
  refs.prev.disabled = exploreMode
    ? atlasIndex <= 0
    : surfaceMode ? surfaceIndex <= 0 : formMode ? formIndex <= 0 : state.fallback || !canTurn('prev') || Boolean(state.turn);
  refs.next.disabled = exploreMode
    ? atlasIndex >= DIRECTIONS.length - 1
    : surfaceMode ? surfaceIndex >= SURFACE_ORDER.length - 1 : formMode ? formIndex >= FORM_ORDER.length - 1 : state.fallback || !canTurn('next') || Boolean(state.turn);
  refs.prev.setAttribute('aria-label', exploreMode ? '上一个创意方向' : surfaceMode ? '上一种可变表面' : formMode ? '上一种书型' : '上一页');
  refs.next.setAttribute('aria-label', exploreMode ? '下一个创意方向' : surfaceMode ? '下一种可变表面' : formMode ? '下一种书型' : '下一页');
  refs.auto.setAttribute('aria-pressed', String(state.autoTimer !== null));
  refs.auto.innerHTML = state.autoTimer === null ? '<span aria-hidden="true">▶</span> 播放翻页' : '<span aria-hidden="true">■</span> 暂停播放';
  refs.auto.disabled = spatialMode || state.fallback;
  refs.loupeToggle.setAttribute('aria-pressed', String(state.loupeOn));
  refs.loupeToggle.disabled = spatialMode || state.fallback;
  refs.loupe.setAttribute('aria-hidden', String(!state.loupeOn));
  refs.loupe.tabIndex = state.loupeOn ? 0 : -1;
  refs.loupe.classList.toggle('is-on', state.loupeOn);
  refs.sceneButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.scene === state.scene)));
  refs.formButtons.forEach((button) => {
    button.setAttribute('aria-checked', String(button.dataset.form === state.form));
    button.disabled = false;
  });
  refs.surfaceButtons.forEach((button) => {
    button.setAttribute('aria-checked', String(button.dataset.surface === state.surface));
    button.tabIndex = button.dataset.surface === state.surface ? 0 : -1;
    button.disabled = false;
  });
  refs.materialButtons.forEach((button) => {
    button.setAttribute('aria-checked', String(button.dataset.material === state.material));
    button.tabIndex = button.dataset.material === state.material ? 0 : -1;
    button.disabled = false;
  });
  refs.surfaceContext.value = state.scene;
  refs.sceneAction.textContent = sceneActionLabel(selected);
  refs.sceneAction.dataset.actionKind = selected.actionKind;
  refs.sceneAction.disabled = spatialMode || state.fallback;
  if (selected.actionKind === 'toggle') refs.sceneAction.setAttribute('aria-pressed', String(state.sceneAction));
  else refs.sceneAction.removeAttribute('aria-pressed');
  refs.sceneNote.textContent = selected.note || '';
  refs.sceneNote.hidden = spatialMode || !state.sceneAction || selected.behavior !== 'note';
  if (formMode) {
    const formState = currentFormState();
    refs.formProgress.value = String(Math.round(state.formProgress * 100));
    refs.formProgressOutput.textContent = `${Math.round(state.formProgress * 100)}%`;
    refs.formProgressLabel.textContent = selectedForm.progressLabel;
    refs.formStateOutput.textContent = formStatusText(state.form, formState);
    refs.formAction.textContent = formActionLabel(state.form, formState);
    refs.formAction.dataset.actionKind = selectedForm.kind;
    if (selectedForm.kind === 'toggle') refs.formAction.setAttribute('aria-pressed', String(state.formProgress >= .5));
    else if (selectedForm.kind === 'play') refs.formAction.setAttribute('aria-pressed', String(state.formTimer !== null));
    else refs.formAction.removeAttribute('aria-pressed');
  }
  refs.formAction.disabled = !formMode || state.fallback;
  refs.formReset.disabled = !formMode || state.fallback;
  refs.formProgress.disabled = !formMode || state.fallback;
  if (surfaceMode) {
    const surfaceState = currentSurfaceState();
    const material = MATERIAL_DEFINITIONS[state.material];
    refs.surfaceProgress.value = String(Math.round(state.surfaceProgress * 100));
    refs.surfaceProgressOutput.textContent = `${Math.round(state.surfaceProgress * 100)}%`;
    refs.surfaceProgressLabel.textContent = selectedSurface.progressLabel;
    refs.surfaceStateOutput.textContent = `${surfaceStatusText(state.surface, surfaceState)} · 内容：${selected.title}`;
    refs.surfaceAction.textContent = surfaceActionLabel(state.surface, surfaceState);
    refs.surfaceAction.dataset.actionKind = selectedSurface.kind;
    if (selectedSurface.kind === 'toggle' || selectedSurface.kind === 'release') {
      refs.surfaceAction.setAttribute('aria-pressed', String(state.surfaceProgress >= .5));
    } else {
      refs.surfaceAction.removeAttribute('aria-pressed');
    }
    refs.surfaceAnchor.textContent = selectedSurface.anchor;
    refs.surfaceSlicing.textContent = selectedSurface.slicing;
    refs.surfaceDeformation.textContent = selectedSurface.deformation;
    refs.surfaceTopology.textContent = selectedSurface.topology;
    refs.surfaceRelease.textContent = selectedSurface.release;
    refs.surfaceBoundary.textContent = selectedSurface.boundary;
    setNodeText(refs.surfaceValueName, selectedSurface.name);
    setNodeText(refs.surfaceMeaning, selectedSurface.meaning);
    setTextList(refs.surfaceScenarios, selectedSurface.scenarios);
    refs.materialBoundary.textContent = material.boundary;
  }
  refs.surfaceAction.disabled = !surfaceMode || state.fallback;
  refs.surfaceReset.disabled = !surfaceMode || state.fallback;
  refs.surfaceProgress.disabled = !surfaceMode || state.fallback;
  refs.surfaceContext.disabled = !surfaceMode;
  refs.quality.value = String(state.strips);
  refs.quality.disabled = spatialMode || state.fallback;
  refs.qualityOutput.textContent = `${state.strips} strips`;
  refs.softness.value = String(Math.round((state.peakCurl - .2) / .75 * 100));
  refs.softness.disabled = spatialMode || state.fallback;
  refs.softnessOutput.textContent = state.peakCurl < .45 ? '硬卡纸' : state.peakCurl > .78 ? '柔软纸' : '柔性纸';
  refs.light.value = String(Math.round(state.light * 100));
  refs.light.disabled = spatialMode || state.fallback;
  refs.lightOutput.textContent = `${Math.round(state.light * 100)}%`;
  refs.cornerToggle.setAttribute('aria-pressed', String(state.cornerOn));
  refs.cornerToggle.disabled = spatialMode || state.fallback;
  refs.cornerToggle.querySelector('b').textContent = state.cornerOn ? 'ON' : 'OFF';
  refs.cornerGrip.hidden = spatialMode || !state.cornerOn || state.fallback;
  refs.gestureHint.innerHTML = surfaceMode
    ? `<span aria-hidden="true">↔</span> ${selectedSurface.gesture}`
    : formMode ? '<span aria-hidden="true">↔</span> 拖动形态' : '<span aria-hidden="true">↔</span> 拖动纸页';
  refs.renderLabel.textContent = exploreMode
    ? `ATLAS · ${atlasDirection.tier} · ${selectedForm?.name || 'CONCEPT'}`
    : surfaceMode ? `SURFACE · ${selectedSurface.name} · ${MATERIAL_DEFINITIONS[state.material].name}`
      : formMode ? `FORM · ${selectedForm.name}` : `CURVED · ${state.strips} STRIPS`;
  refs.book.setAttribute('aria-label', exploreMode
    ? `${atlasDirection.name}，${atlasDirection.tier} 创意方向的${selectedForm ? selectedForm.name : '概念'}舞台。水平拖动当前几何；上下一个按钮切换方向。`
    : surfaceMode
      ? `${selectedSurface.name}交互模型，当前内容${selected.title}，材质${MATERIAL_DEFINITIONS[state.material].name}。${selectedSurface.gesture}，也可使用方向键或右侧控件改变表面。`
    : formMode
      ? `${selectedForm.name}交互模型。水平拖动、使用方向键或右侧控件改变形态。`
      : '可拖动的柔性画册。点击或拖动左右页，也可使用方向键翻页。');
  applyView();
}

function render() {
  const width = Math.max(300, refs.book.clientWidth || refs.bookShell.clientWidth);
  const height = width / (SVG_W / SVG_H);
  refs.book.replaceChildren();
  refs.book.classList.toggle('is-form-demo', isFormMode());
  refs.book.classList.toggle('is-surface-demo', isSurfaceMode());
  refs.book.dataset.form = isFormMode() ? state.form : 'classic';
  refs.book.dataset.surface = isSurfaceMode() ? state.surface : '';
  refs.book.dataset.material = isSurfaceMode() ? state.material : '';

  if (isFormMode()) {
    refs.book.append(createFormSurface(state.form, { accent: activeAccent() }));
    updateControls();
    syncFormSurface();
    return;
  }

  if (isSurfaceMode()) {
    refs.book.append(createDeformableSurface(state.surface, {
      accent: activeAccent(),
      material: state.material,
      context: surfaceContextData()
    }));
    updateControls();
    syncSurface();
    return;
  }

  const pageUrls = urls();

  if (!state.turn) {
    if (state.cornerOn && canTurn('next')) {
      refs.book.append(
        createHalf('left', pageUrls[state.index], width, height),
        createHalf('right', pageUrls[state.index + 1], width, height),
        createCornerPage(pageUrls[state.index], width, height)
      );
    } else {
      refs.book.append(
        createHalf('left', pageUrls[state.index], width, height),
        createHalf('right', pageUrls[state.index], width, height)
      );
    }
  } else {
    const leftIndex = state.turn.direction === 'next' ? state.turn.from : state.turn.to;
    const rightIndex = state.turn.direction === 'next' ? state.turn.to : state.turn.from;
    refs.book.append(
      createHalf('left', pageUrls[leftIndex], width, height),
      createHalf('right', pageUrls[rightIndex], width, height)
    );
    state.turn.element = createCurvedLeaf(state.turn, pageUrls, width, height);
    refs.book.append(state.turn.element);
  }

  const sceneEffect = createSceneEffect();
  if (sceneEffect) refs.book.append(sceneEffect);

  updateControls();
  applyProgress(state.turn ? state.turn.progress : 0);
  scheduleLoupeSync();
}

function applyProgress(progress) {
  const curve = geometry(progress);
  if (state.turn?.element) {
    state.turn.progress = curve.progress;
    const sign = state.turn.direction === 'next' ? -1 : 1;
    state.turn.element.style.setProperty('--root-angle', cssDegrees(sign * curve.rootAngle));
    state.turn.element.style.setProperty('--segment-angle', cssDegrees(-sign * curve.segmentAngle));
    state.turn.strips.forEach((strip, index) => {
      const tangent = curve.rootAngle - index * curve.segmentAngle;
      const facing = Math.abs(Math.cos(tangent));
      strip.style.setProperty('--shade', ((1 - facing) * .72 * state.light).toFixed(3));
      strip.style.setProperty('--glow', (facing * .21 * state.light).toFixed(3));
    });
  }
  scheduleLoupeSync();
}

function setStatus(message) { refs.status.textContent = message; }

function beginTurn(direction, progress = 0) {
  if (isSpatialMode()) return false;
  cancelAnimation();
  if (!canTurn(direction)) {
    setStatus(direction === 'next' ? '已到最后一页' : '已到第一页');
    return false;
  }
  if (state.cornerOn) state.cornerOn = false;
  state.turn = {
    direction,
    from: state.index,
    to: state.index + (direction === 'next' ? 1 : -1),
    progress,
    element: null,
    strips: []
  };
  render();
  setStatus(direction === 'next' ? '纸面向左弯曲' : '纸面向右弯曲');
  return true;
}

function finishTurn(target) {
  if (!state.turn) return;
  if (target === 1) state.index = state.turn.to;
  state.turn = null;
  render();
  setStatus(target === 1 ? `第 ${state.index + 1} 页` : '纸页回弹');
}

function settleTurn(target, initialVelocity = 0) {
  if (!state.turn) return;
  cancelAnimation();
  if (motionQuery.matches) {
    applyProgress(target);
    finishTurn(target);
    return;
  }
  let velocity = Number(initialVelocity) || 0;
  let last = performance.now();
  const stiffness = target === 1 ? 175 : 155;
  const damping = target === 1 ? 27 : 24;
  function frame(now) {
    if (!state.turn) return;
    const dt = Math.min(.032, Math.max(.001, (now - last) / 1000));
    last = now;
    const distance = state.turn.progress - target;
    velocity += (-stiffness * distance - damping * velocity) * dt;
    state.turn.progress = clamp(state.turn.progress + velocity * dt, -.03, 1.03);
    applyProgress(state.turn.progress);
    if (Math.abs(state.turn.progress - target) < .002 && Math.abs(velocity) < .025) {
      applyProgress(target);
      state.animationFrame = null;
      finishTurn(target);
    } else {
      state.animationFrame = requestAnimationFrame(frame);
    }
  }
  state.animationFrame = requestAnimationFrame(frame);
}

function step(direction) {
  if (state.turn) finishTurn(state.turn.progress >= .5 ? 1 : 0);
  if (beginTurn(direction)) settleTurn(1);
}

function stopAuto(message) {
  if (state.autoTimer !== null) clearInterval(state.autoTimer);
  state.autoTimer = null;
  refs.book.classList.remove('is-demoing');
  if (scene().behavior === 'auto') state.sceneAction = false;
  updateControls();
  if (message) setStatus(message);
}

function autoStep() {
  if (state.turn) return;
  if (!canTurn(state.autoDirection)) state.autoDirection = state.autoDirection === 'next' ? 'prev' : 'next';
  step(state.autoDirection);
}

function toggleAuto() {
  if (isSpatialMode()) return;
  if (state.autoTimer !== null) {
    stopAuto('自动翻页已暂停');
    return;
  }
  if (motionQuery.matches) {
    setStatus('已遵循减少动态偏好');
    return;
  }
  state.autoDirection = canTurn('next') ? 'next' : 'prev';
  state.autoTimer = window.setInterval(autoStep, 1450);
  refs.book.classList.add('is-demoing');
  if (scene().behavior === 'auto') state.sceneAction = true;
  updateControls();
  setStatus('自动翻页中');
  autoStep();
}

function stopIntro() {
  if (!state.introRunning) return;
  cancelAnimation();
  state.turn = null;
  render();
}

function startIntroPreview() {
  if (isSpatialMode() || params.get('intro') === '0' || motionQuery.matches || state.fallback || state.cornerOn || !canTurn('next')) return;
  state.introRunning = true;
  if (!beginTurn('next')) return;
  state.introRunning = true;
  const started = performance.now();
  function frame(now) {
    if (!state.introRunning || !state.turn) return;
    const raw = Math.min(1, (now - started) / 1750);
    applyProgress(Math.sin(Math.PI * raw) * .42);
    if (raw >= 1) {
      state.animationFrame = null;
      state.introRunning = false;
      finishTurn(0);
      setStatus('拖动右页开始');
    } else {
      state.animationFrame = requestAnimationFrame(frame);
    }
  }
  state.animationFrame = requestAnimationFrame(frame);
}

let loupeSyncFrame = null;
function scheduleLoupeSync() {
  if (!state.loupeOn || loupeSyncFrame !== null) return;
  loupeSyncFrame = requestAnimationFrame(() => {
    loupeSyncFrame = null;
    syncLoupe();
  });
}

function syncLoupe() {
  if (isSpatialMode() && state.loupeOn) state.loupeOn = false;
  refs.loupe.classList.toggle('is-on', state.loupeOn);
  if (!state.loupeOn) {
    refs.loupeContent.replaceChildren();
    return;
  }
  const bookRect = refs.book.getBoundingClientRect();
  const shellRect = refs.bookShell.getBoundingClientRect();
  const width = refs.book.clientWidth;
  const height = refs.book.clientHeight;
  if (!width || !height) return;
  if (state.loupeX === null) {
    state.loupeX = width * .72;
    state.loupeY = height * .35;
  }
  state.loupeX = clamp(state.loupeX, 0, width);
  state.loupeY = clamp(state.loupeY, 0, height);
  const clone = refs.book.cloneNode(true);
  clone.removeAttribute('id');
  clone.removeAttribute('tabindex');
  clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
  clone.setAttribute('aria-hidden', 'true');
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  refs.loupeContent.replaceChildren(clone);
  const size = refs.loupe.querySelector('.loupe__glass').clientWidth || 155;
  const radius = size / 2;
  const x = bookRect.left - shellRect.left + state.loupeX;
  const y = bookRect.top - shellRect.top + state.loupeY;
  refs.loupe.style.transform = `translate3d(${(x - radius).toFixed(1)}px,${(y - radius).toFixed(1)}px,0) rotate(-10deg)`;
  refs.loupeContent.style.width = `${width}px`;
  refs.loupeContent.style.height = `${height}px`;
  refs.loupeContent.style.transform = `translate(${(radius - state.loupeX * MAGNIFICATION).toFixed(1)}px,${(radius - state.loupeY * MAGNIFICATION).toFixed(1)}px) scale(${MAGNIFICATION})`;
}

function setLoupe(on) {
  if (isSpatialMode()) return;
  state.loupeOn = Boolean(on);
  updateControls();
  syncLoupe();
  setStatus(state.loupeOn ? '观察镜可独立拖动' : '观察镜已收起');
}

function switchView(name, { syncUrl = true } = {}) {
  const titles = { experience: '实际效果', scenes: '场景', forms: '书型 18', surfaces: '可变表面 12', explore: '创意图谱', extensions: '扩展效果' };
  if (!titles[name]) return;
  const formView = name === 'forms' || name === 'explore';
  const wasFormMode = isFormMode();
  const wasSurfaceMode = isSurfaceMode();
  refs.root.dataset.panel = name;

  if (name === 'surfaces') {
    stopIntro();
    stopAuto();
    stopFormPlayback();
    releaseFormDrag();
    state.form = 'classic';
    state.cornerOn = false;
    state.sceneAction = false;
    if (state.loupeOn) {
      state.loupeOn = false;
      syncLoupe();
    }
    if (!wasSurfaceMode) selectSurface(state.lastSurface, { announce: false });
    else {
      render();
      syncSurfaceUrl();
    }
  } else if (formView) {
    if (wasSurfaceMode) releaseSurfaceDrag();
    const direction = selectedDirection();
    const target = name === 'explore' && direction.form && FORM_DEFINITIONS[direction.form]
      ? direction.form
      : wasFormMode ? state.form : state.lastForm;
    if (!wasFormMode || target !== state.form) {
      selectForm(target, { announce: false });
    } else {
      stopIntro();
      stopAuto();
      stopFormPlayback();
      state.cornerOn = false;
      state.sceneAction = false;
      if (state.loupeOn) {
        state.loupeOn = false;
        syncLoupe();
      }
      updateControls();
    }
  } else if (wasFormMode || wasSurfaceMode) {
    stopFormPlayback();
    releaseFormDrag();
    releaseSurfaceDrag();
    state.form = 'classic';
    render();
    setStatus(wasSurfaceMode ? '已退出可变表面，恢复传统柔性跨页' : '已恢复传统柔性跨页');
  }
  refs.deckTitle.textContent = titles[name];
  refs.viewTabs.forEach((tab) => tab.setAttribute('aria-pressed', String(tab.dataset.view === name)));
  refs.panels.forEach((panel) => {
    const active = panel.dataset.panel === name;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });
  if (name === 'explore') renderCreativeAtlas();
  if (syncUrl && name !== 'surfaces') syncPanelUrl(name);
}

function selectScene(name) {
  if (!SCENES[name] || (name === state.scene && !isSpatialMode())) return;
  stopIntro();
  stopAuto();
  stopFormPlayback();
  releaseSurfaceDrag();
  cancelAnimation();
  state.form = 'classic';
  state.scene = name;
  state.index = 0;
  state.turn = null;
  state.cornerOn = false;
  state.sceneAction = false;
  state.effectStep = 0;
  if (state.loupeOn) setLoupe(false);
  render();
  setStatus(`${scene().kicker} 已就绪`);
}

const SCENE_ACTIONS = {
  note() {
    state.sceneAction = !state.sceneAction;
    setStatus(state.sceneAction ? '场景注解已显示' : '场景注解已隐藏');
  },
  loupe() {
    state.sceneAction = !state.sceneAction;
    setLoupe(state.sceneAction);
  },
  auto() {
    toggleAuto();
    state.sceneAction = state.autoTimer !== null;
  },
  route() {
    const selected = scene();
    if (!state.sceneAction) {
      state.sceneAction = true;
      state.effectStep = 0;
    } else {
      state.effectStep = (state.effectStep + 1) % selected.stops.length;
    }
    render();
    setStatus(`当前站点 · ${selected.stops[state.effectStep]}`);
  },
  steps() {
    const selected = scene();
    if (!state.sceneAction) {
      state.sceneAction = true;
      state.effectStep = 0;
    } else if (state.effectStep >= selected.steps.length) {
      state.effectStep = 0;
    } else {
      state.effectStep += 1;
    }
    render();
    setStatus(state.effectStep >= selected.steps.length ? '四个步骤完成 · 可以上桌' : `当前步骤 · ${selected.steps[state.effectStep]}`);
  },
  focus() {
    const selected = scene();
    if (!state.sceneAction) {
      state.sceneAction = true;
      state.effectStep = 0;
    } else {
      state.effectStep = (state.effectStep + 1) % selected.frames.length;
    }
    render();
    setStatus(`正在聚焦第 ${state.effectStep + 1} 格`);
  },
  palette() {
    const selected = scene();
    state.sceneAction = true;
    state.effectStep = (state.effectStep + 1) % selected.variants.length;
    render();
    setStatus(`商品配色 · ${selected.variantNames[state.effectStep]}`);
  }
};

function toggleSceneAction() {
  if (isSpatialMode()) return;
  const action = SCENE_ACTIONS[scene().behavior];
  if (!action) return;
  action();
  updateControls();
}

function applyCornerPosition() {
  const page = refs.book.querySelector('.corner-page');
  if (page) {
    page.style.setProperty('--corner-x', `${state.cornerX}%`);
    page.style.setProperty('--corner-y', `${state.cornerY}%`);
  }
}

function toggleCorner() {
  if (isSpatialMode()) switchView('extensions');
  stopIntro();
  if (state.turn) finishTurn(state.turn.progress >= .5 ? 1 : 0);
  if (!state.cornerOn && !canTurn('next')) state.index = 0;
  state.cornerOn = !state.cornerOn;
  render();
  switchView('extensions');
  setStatus(state.cornerOn ? '拖动右下角揭示下一页' : '二维纸角已关闭');
}

function bindRadioNavigation(buttons, selectValue, dataKey) {
  buttons.forEach((button, index) => button.addEventListener('keydown', (event) => {
    const keyDelta = event.key === 'ArrowRight' || event.key === 'ArrowDown'
      ? 1
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
    if (!keyDelta && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const targetIndex = event.key === 'Home'
      ? 0
      : event.key === 'End' ? buttons.length - 1 : (index + keyDelta + buttons.length) % buttons.length;
    const target = buttons[targetIndex];
    selectValue(target.dataset[dataKey]);
    target.focus();
  }));
}

bindRadioNavigation(refs.surfaceButtons, selectSurface, 'surface');
bindRadioNavigation(refs.materialButtons, selectSurfaceMaterial, 'material');

refs.viewTabs.forEach((tab) => tab.addEventListener('click', () => switchView(tab.dataset.view)));
refs.sceneButtons.forEach((button) => button.addEventListener('click', () => selectScene(button.dataset.scene)));
refs.formButtons.forEach((button) => button.addEventListener('click', () => selectForm(button.dataset.form)));
refs.surfaceButtons.forEach((button) => button.addEventListener('click', () => selectSurface(button.dataset.surface)));
refs.materialButtons.forEach((button) => button.addEventListener('click', () => selectSurfaceMaterial(button.dataset.material)));
refs.surfaceContext.addEventListener('change', () => selectSurfaceContext(refs.surfaceContext.value));
refs.axisFilter?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-axis]');
  if (button) applyDirectionFilter('axis', button.dataset.axis);
});
refs.tierFilter?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-tier]');
  if (button) applyDirectionFilter('tier', button.dataset.tier);
});
refs.directionList?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-direction]');
  if (button) selectDirection(button.dataset.direction);
});
refs.directionDetail?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-open-form]');
  if (!button) return;
  selectForm(button.dataset.openForm, { announce: false });
  switchView('forms');
  setStatus(`${FORM_DEFINITIONS[button.dataset.openForm].name} · 完整控制已打开`);
});
refs.combinationList?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-combination-demo]');
  if (button) demonstrateCombination(button.dataset.combinationDemo);
});
refs.sceneAction.addEventListener('click', toggleSceneAction);
refs.formAction.addEventListener('click', performFormAction);
refs.formReset.addEventListener('click', () => resetForm());
refs.formExit.addEventListener('click', () => switchView('experience'));
refs.formProgress.addEventListener('input', () => setFormProgress(Number(refs.formProgress.value) / 100));
refs.surfaceAction.addEventListener('click', performSurfaceAction);
refs.surfaceReset.addEventListener('click', () => resetSurface());
refs.surfaceExit.addEventListener('click', () => switchView('experience'));
refs.surfaceProgress.addEventListener('input', () => setSurfaceProgress(Number(refs.surfaceProgress.value) / 100, { announce: false, syncUrl: false }));
refs.surfaceProgress.addEventListener('change', () => syncSurface({ announce: true, syncUrl: true }));
refs.auto.addEventListener('click', toggleAuto);
refs.loupeToggle.addEventListener('click', () => {
  const next = !state.loupeOn;
  if (scene().behavior === 'loupe') state.sceneAction = next;
  setLoupe(next);
});
refs.prev.addEventListener('click', () => {
  if (isExploreMode()) return selectAdjacentDirection(-1);
  if (isSurfaceMode()) return selectAdjacentSurface(-1);
  if (isFormMode()) return selectAdjacentForm(-1);
  stopIntro();
  stopAuto();
  step('prev');
});
refs.next.addEventListener('click', () => {
  if (isExploreMode()) return selectAdjacentDirection(1);
  if (isSurfaceMode()) return selectAdjacentSurface(1);
  if (isFormMode()) return selectAdjacentForm(1);
  stopIntro();
  stopAuto();
  step('next');
});
refs.cornerToggle.addEventListener('click', toggleCorner);

refs.zoomOut.addEventListener('click', () => {
  state.view.zoom = Math.max(.84, state.view.zoom - .08);
  applyView();
  scheduleLoupeSync();
  setStatus(`画册缩放 ${Math.round(state.view.zoom * 100)}%`);
});
refs.zoomIn.addEventListener('click', () => {
  state.view.zoom = Math.min(1.16, state.view.zoom + .08);
  applyView();
  scheduleLoupeSync();
  setStatus(`画册缩放 ${Math.round(state.view.zoom * 100)}%`);
});
refs.reset.addEventListener('click', () => {
  if (isSurfaceMode()) return resetSurface();
  if (isFormMode()) return resetForm();
  stopAuto();
  stopIntro();
  state.index = 0;
  state.strips = 18;
  state.peakCurl = .67;
  state.light = .72;
  state.view = { zoom: 1, tiltX: 2, tiltY: 0 };
  state.cornerOn = false;
  state.sceneAction = false;
  state.effectStep = 0;
  state.loupeOn = false;
  state.loupeX = null;
  state.loupeY = null;
  render();
  syncLoupe();
  setStatus('演示已复位');
});

refs.quality.addEventListener('input', () => {
  state.strips = Math.round(clamp(Number(refs.quality.value), 8, 24));
  if (state.turn) render(); else updateControls();
  setStatus(`下一次翻页使用 ${state.strips} 条曲面`);
});
refs.softness.addEventListener('input', () => {
  state.peakCurl = .2 + clamp(Number(refs.softness.value) / 100) * .75;
  if (state.turn) applyProgress(state.turn.progress);
  updateControls();
  setStatus(`曲率峰值 ${state.peakCurl.toFixed(2)}`);
});
refs.light.addEventListener('input', () => {
  state.light = clamp(Number(refs.light.value) / 100);
  if (state.turn) applyProgress(state.turn.progress);
  updateControls();
  setStatus(`曲面光照 ${Math.round(state.light * 100)}%`);
});

refs.book.addEventListener('pointerdown', (event) => {
  if (state.fallback || event.button !== 0) return;
  if (isSurfaceMode()) {
    const rect = refs.book.getBoundingClientRect();
    refs.book.setPointerCapture(event.pointerId);
    refs.book.classList.add('is-dragging');
    state.surfaceDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startProgress: state.surfaceProgress,
      width: rect.width,
      height: rect.height,
      outwardDirection: event.clientX < rect.left + rect.width / 2 ? -1 : 1
    };
    refs.gestureHint.hidden = true;
    event.preventDefault();
    return;
  }
  if (isFormMode()) {
    stopFormPlayback();
    const rect = refs.book.getBoundingClientRect();
    refs.book.setPointerCapture(event.pointerId);
    refs.book.classList.add('is-dragging');
    state.formDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startProgress: state.formProgress,
      width: rect.width
    };
    refs.gestureHint.hidden = true;
    event.preventDefault();
    return;
  }
  stopIntro();
  stopAuto();
  if (state.turn) finishTurn(state.turn.progress >= .5 ? 1 : 0);
  const rect = refs.book.getBoundingClientRect();
  const direction = event.clientX < rect.left + rect.width / 2 ? 'prev' : 'next';
  if (!beginTurn(direction)) return;
  refs.book.setPointerCapture(event.pointerId);
  refs.book.classList.add('is-dragging');
  state.drag = {
    pointerId: event.pointerId,
    direction,
    startX: event.clientX,
    width: rect.width,
    moved: 0,
    velocity: 0,
    previousProgress: 0,
    previousTime: performance.now()
  };
  refs.gestureHint.hidden = true;
  event.preventDefault();
});

refs.book.addEventListener('pointermove', (event) => {
  if (state.surfaceDrag && isSurfaceMode() && event.pointerId === state.surfaceDrag.pointerId) {
    const delta = surfacePointerDelta(event, state.surfaceDrag);
    state.surfaceTurn = clamp(delta * 1.6, -1, 1);
    setSurfaceProgress(state.surfaceDrag.startProgress + delta * 1.35, { announce: false, syncUrl: false });
    return;
  }
  if (state.formDrag && isFormMode() && event.pointerId === state.formDrag.pointerId) {
    const delta = (event.clientX - state.formDrag.startX) / Math.max(1, state.formDrag.width);
    state.formTurn = clamp(delta * 1.6, -1, 1);
    setFormProgress(state.formDrag.startProgress + delta * 1.35);
    return;
  }
  if (!state.drag || !state.turn || event.pointerId !== state.drag.pointerId) return;
  const deltaX = event.clientX - state.drag.startX;
  const progress = progressFromDrag(deltaX, state.drag.width, state.drag.direction);
  const now = performance.now();
  const elapsed = Math.max(.001, (now - state.drag.previousTime) / 1000);
  state.drag.velocity = (progress - state.drag.previousProgress) / elapsed;
  state.drag.previousProgress = progress;
  state.drag.previousTime = now;
  state.drag.moved = Math.max(state.drag.moved, Math.abs(deltaX));
  applyProgress(progress);
  setStatus(`纸面弯曲 ${Math.round(progress * 100)}%`);
});

function endBookDrag(event) {
  if (state.surfaceDrag && event.pointerId === state.surfaceDrag.pointerId) {
    state.surfaceDrag = null;
    state.surfaceTurn = 0;
    refs.book.classList.remove('is-dragging');
    const definition = surfaceDefinition();
    if (definition?.kind === 'release') {
      if (state.surfaceProgress >= .74) {
        state.surfaceProgress = 1;
        state.surfaceDetached = true;
      } else if (state.surfaceProgress >= .3) {
        state.surfaceProgress = .58;
        state.surfaceDetached = false;
      } else {
        state.surfaceProgress = 0;
        state.surfaceDetached = false;
      }
    }
    syncSurface({ announce: true, syncUrl: true });
    updateControls();
    return;
  }
  if (state.formDrag && event.pointerId === state.formDrag.pointerId) {
    state.formDrag = null;
    state.formTurn = 0;
    refs.book.classList.remove('is-dragging');
    syncFormSurface({ announce: true });
    updateControls();
    return;
  }
  if (!state.drag || !state.turn || event.pointerId !== state.drag.pointerId) return;
  const drag = state.drag;
  state.drag = null;
  refs.book.classList.remove('is-dragging');
  const commit = drag.moved < 5 || shouldCommit(state.turn.progress, drag.velocity);
  settleTurn(commit ? 1 : 0, drag.velocity);
}
refs.book.addEventListener('pointerup', endBookDrag);
refs.book.addEventListener('pointercancel', endBookDrag);
refs.book.addEventListener('dragstart', (event) => event.preventDefault());
refs.book.addEventListener('keydown', (event) => {
  if (isSurfaceMode()) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      setSurfaceProgress(state.surfaceProgress + (event.key === 'ArrowRight' ? .1 : -.1));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      performSurfaceAction();
    } else if (event.key === 'Escape' || event.key === 'Home') {
      event.preventDefault();
      resetSurface();
    }
    return;
  }
  if (isFormMode()) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      stopFormPlayback();
      setFormProgress(state.formProgress + (event.key === 'ArrowRight' ? .1 : -.1));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      performFormAction();
    } else if (event.key === 'Escape' || event.key === 'Home') {
      event.preventDefault();
      resetForm();
    }
    return;
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    stopIntro();
    stopAuto();
    step(event.key === 'ArrowRight' ? 'next' : 'prev');
  } else if (event.key === 'Escape') {
    if (state.turn) finishTurn(0);
    if (state.loupeOn) setLoupe(false);
    if (state.cornerOn) toggleCorner();
  }
});

refs.loupe.addEventListener('pointerdown', (event) => {
  if (!state.loupeOn || event.button !== 0) return;
  refs.loupe.setPointerCapture(event.pointerId);
  refs.loupe.classList.add('is-dragging');
  state.loupeDrag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: state.loupeX, y: state.loupeY };
  event.preventDefault();
  event.stopPropagation();
});
refs.loupe.addEventListener('pointermove', (event) => {
  if (!state.loupeDrag || event.pointerId !== state.loupeDrag.pointerId) return;
  state.loupeX = state.loupeDrag.x + event.clientX - state.loupeDrag.startX;
  state.loupeY = state.loupeDrag.y + event.clientY - state.loupeDrag.startY;
  syncLoupe();
  event.stopPropagation();
});
function endLoupeDrag(event) {
  if (!state.loupeDrag || event.pointerId !== state.loupeDrag.pointerId) return;
  state.loupeDrag = null;
  refs.loupe.classList.remove('is-dragging');
  setStatus('观察位置已固定');
}
refs.loupe.addEventListener('pointerup', endLoupeDrag);
refs.loupe.addEventListener('pointercancel', endLoupeDrag);
refs.loupe.addEventListener('keydown', (event) => {
  const moves = { ArrowLeft: [-12,0], ArrowRight: [12,0], ArrowUp: [0,-12], ArrowDown: [0,12] };
  if (moves[event.key]) {
    event.preventDefault();
    state.loupeX = (state.loupeX || refs.book.clientWidth * .72) + moves[event.key][0];
    state.loupeY = (state.loupeY || refs.book.clientHeight * .35) + moves[event.key][1];
    syncLoupe();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    setLoupe(false);
    refs.loupeToggle.focus();
  }
});

refs.cornerGrip.addEventListener('pointerdown', (event) => {
  if (!state.cornerOn || event.button !== 0) return;
  refs.cornerGrip.setPointerCapture(event.pointerId);
  refs.cornerGrip.classList.add('is-dragging');
  state.cornerDrag = { pointerId: event.pointerId };
  event.preventDefault();
  event.stopPropagation();
});
refs.cornerGrip.addEventListener('pointermove', (event) => {
  if (!state.cornerDrag || event.pointerId !== state.cornerDrag.pointerId) return;
  const rect = refs.book.getBoundingClientRect();
  state.cornerX = clamp(((rect.right - event.clientX) / (rect.width / 2)) * 100, 8, 68);
  state.cornerY = clamp(((rect.bottom - event.clientY) / rect.height) * 100, 8, 68);
  applyCornerPosition();
  setStatus(`纸角 x${Math.round(state.cornerX)} · y${Math.round(state.cornerY)}`);
});
function endCornerDrag(event) {
  if (!state.cornerDrag || event.pointerId !== state.cornerDrag.pointerId) return;
  state.cornerDrag = null;
  refs.cornerGrip.classList.remove('is-dragging');
}
refs.cornerGrip.addEventListener('pointerup', endCornerDrag);
refs.cornerGrip.addEventListener('pointercancel', endCornerDrag);
refs.cornerGrip.addEventListener('keydown', (event) => {
  if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Escape'].includes(event.key)) return;
  event.preventDefault();
  if (event.key === 'Escape') return toggleCorner();
  if (event.key === 'ArrowLeft') state.cornerX = clamp(state.cornerX + 3, 8, 68);
  if (event.key === 'ArrowRight') state.cornerX = clamp(state.cornerX - 3, 8, 68);
  if (event.key === 'ArrowUp') state.cornerY = clamp(state.cornerY + 3, 8, 68);
  if (event.key === 'ArrowDown') state.cornerY = clamp(state.cornerY - 3, 8, 68);
  applyCornerPosition();
});

refs.stage.addEventListener('pointermove', (event) => {
  if (state.drag || state.formDrag || state.surfaceDrag || state.loupeDrag || state.cornerDrag || event.pointerType === 'touch') return;
  const rect = refs.book.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
  const x = (event.clientX - rect.left) / rect.width - .5;
  const y = (event.clientY - rect.top) / rect.height - .5;
  state.view.tiltX = 2 - y * 4;
  state.view.tiltY = x * 6;
  applyView();
});
refs.stage.addEventListener('pointerleave', () => {
  if (state.drag || state.formDrag || state.surfaceDrag || state.loupeDrag || state.cornerDrag) return;
  state.view.tiltX = 2;
  state.view.tiltY = 0;
  applyView();
});

let resizeFrame = null;
window.addEventListener('resize', () => {
  if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    resizeFrame = null;
    if (state.drag || state.formDrag || state.surfaceDrag || state.loupeDrag || state.cornerDrag) return;
    render();
    if (isExploreMode()) renderCreativeAtlas();
  });
});

motionQuery.addEventListener?.('change', (event) => {
  if (!event.matches) return;
  stopAuto();
  stopFormPlayback();
  updateControls();
  setStatus('已切换为减少动态模式 · 连续播放停止');
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) return;
  stopAuto();
  stopFormPlayback();
});
window.addEventListener('pagehide', () => {
  stopAuto();
  stopFormPlayback();
  releaseFormDrag();
  releaseSurfaceDrag();
});

if (state.fallback) {
  refs.root.classList.add('is-fallback');
  if (isFormMode()) state.formProgress = 1;
  if (initialPanel === 'surfaces') state.surfaceProgress = SURFACE_DEFINITIONS[state.surface].fallbackProgress ?? 1;
  [refs.sceneAction, refs.formAction, refs.formReset, refs.formProgress,
    refs.surfaceAction, refs.surfaceReset, refs.surfaceProgress,
    refs.auto, refs.loupeToggle,
    refs.zoomOut, refs.zoomIn, refs.reset, refs.cornerToggle,
    refs.quality, refs.softness, refs.light].forEach((control) => { control.disabled = true; });
  setStatus('静态预览 · 可继续切换书型、可变表面与创意图谱');
}
switchView(initialPanel, { syncUrl: false });
render();

const fixedProgress = clamp(Number(params.get('progress')) || 0, 0, 1);
if (isSurfaceMode()) {
  state.surfaceProgress = state.fallback ? (surfaceDefinition().fallbackProgress ?? 1) : fixedProgress;
  if (surfaceDefinition().kind === 'cycle') {
    state.surfaceStep = Math.round(state.surfaceProgress * (surfaceDefinition().maxStep ?? 0));
  }
  state.surfaceDetached = params.get('detached') === '1' && state.surfaceProgress >= .98;
  syncSurface({ syncUrl: true });
  updateControls();
  setStatus(`${surfaceDefinition().name} · 固定形变 ${Math.round(state.surfaceProgress * 100)}%`);
} else if (isFormMode() && fixedProgress > 0) {
  state.formProgress = fixedProgress;
  syncFormSurface();
  updateControls();
  setStatus(`${formDefinition().name} · 固定形态 ${Math.round(fixedProgress * 100)}%`);
} else if (!isSpatialMode() && fixedProgress > 0 && canTurn('next')) {
  beginTurn('next', fixedProgress);
  applyProgress(fixedProgress);
  setStatus(`固定弯曲 ${Math.round(fixedProgress * 100)}%`);
} else if (!isSpatialMode()) {
  window.setTimeout(startIntroPreview, 650);
}
