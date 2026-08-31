export const FORM_ORDER = Object.freeze([
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

export const FORM_DEFINITIONS = Object.freeze({
  gatefold: Object.freeze({
    name: '对开门书',
    kicker: 'GATEFOLD REVEAL',
    title: '双门打开，中央才出现。',
    dek: '两扇硬页从相反方向退场，把中央画面变成一次有仪式感的揭晓。',
    accent: '#ef644f',
    action: '打开双门',
    kind: 'toggle',
    progressLabel: '门扇开合'
  }),
  accordion: Object.freeze({
    name: '手风琴书',
    kicker: 'ACCORDION JOURNEY',
    title: '六个折面连成一条长路。',
    dek: '折痕正负交替，每次展开都会延长时间线，而不是切换到另一张页面。',
    accent: '#df8a42',
    action: '展开下一折',
    kind: 'cycle',
    progressLabel: '已展开折面',
    maxStep: 5
  }),
  popup: Object.freeze({
    name: '立体书',
    kicker: 'POP-UP STAGE',
    title: '纸上的城市站起来。',
    dek: '页面打开的同一进度驱动前景、拱门和主体分别抬升，形成真实层次。',
    accent: '#da5a76',
    action: '升起立体结构',
    kind: 'toggle',
    progressLabel: '立体抬升'
  }),
  diecut: Object.freeze({
    name: '镂空书',
    kicker: 'DIE-CUT DEPTH',
    title: '一个窗口提前看见后页。',
    dek: '镂空面罩保持在最前方，窗口尺寸和纵深层会随着探索进度改变。',
    accent: '#4e9a77',
    action: '查看下一深度',
    kind: 'cycle',
    progressLabel: '可见深度',
    maxStep: 3
  }),
  layers: Object.freeze({
    name: '透明叠层书',
    kicker: 'VELLUM LAYERS',
    title: '三张透明页合成一幅图。',
    dek: '结构、流向和标注分别印在透明页上；叠合之后才得到完整解释。',
    accent: '#4b8db8',
    action: '叠加下一层',
    kind: 'cycle',
    progressLabel: '叠合层数',
    maxStep: 2
  }),
  tunnel: Object.freeze({
    name: '隧道书',
    kicker: 'TUNNEL DEPTH',
    title: '五层纸框通向远处。',
    dek: '每层纸框拥有不同的空间距离，向前推进时视线会穿过连续开口。',
    accent: '#6a84cf',
    action: '深入下一景',
    kind: 'cycle',
    progressLabel: '空间层级',
    maxStep: 4
  }),
  volvelle: Object.freeze({
    name: '旋转轮盘书',
    kicker: 'VOLVELLE DIAL',
    title: '旋转纸盘改变同一页的答案。',
    dek: '底盘不动，八分轮盘在指针下切换季节、时间与参数组合。',
    accent: '#c36c3d',
    action: '旋转下一刻度',
    kind: 'cycle',
    progressLabel: '当前刻度',
    maxStep: 7
  }),
  flipbook: Object.freeze({
    name: '翻动画册',
    kicker: 'FLIPBOOK MOTION',
    title: '十二张纸组成一个动作。',
    dek: '页面依次从右侧翻到左侧，纸上的圆点因位置差形成连续运动。',
    accent: '#ed6f43',
    action: '播放翻动画面',
    kind: 'play',
    progressLabel: '动画帧',
    maxStep: 11
  }),
  carousel: Object.freeze({
    name: '旋转木马书',
    kicker: 'CAROUSEL BOOK',
    title: '六片书页围成一座小展厅。',
    dek: '完全打开后的书页不再平铺，而是围绕书脊形成可旋转的放射结构。',
    accent: '#b05b97',
    action: '转到下一扇',
    kind: 'cycle',
    progressLabel: '当前扇面',
    maxStep: 5
  }),
  infinite: Object.freeze({
    name: '无限循环书',
    kicker: 'INFINITE LOOP',
    title: '第六页之后重新抵达第一页。',
    dek: '六个面板首尾连接成环，阅读位置沿空间循环而不是抵达封底。',
    accent: '#30a097',
    action: '进入下一循环',
    kind: 'cycle',
    progressLabel: '循环节点',
    maxStep: 5
  }),
  mixmatch: Object.freeze({
    name: '分栏组合书',
    kicker: 'MIX & MATCH',
    title: '三条独立页面，组合出一百二十五个角色。',
    dek: '头部、身体与脚步分别拥有五种状态；翻动任意一栏，都不会打断另外两栏的阅读位置。',
    accent: '#d2576f',
    action: '生成下一组角色',
    kind: 'cycle',
    progressLabel: '组合编号',
    maxStep: 124
  }),
  pulltab: Object.freeze({
    name: '拉条联动书',
    kicker: 'PULL-TAB MECHANISM',
    title: '拉动一根纸条，三个部件同时回应。',
    dek: '同一条隐藏传动路径把遮罩、齿轮与能量轨迹连接起来，让一个动作产生连续因果。',
    accent: '#d77b3f',
    action: '拉出联动纸条',
    kind: 'toggle',
    progressLabel: '拉条行程'
  }),
  iris: Object.freeze({
    name: '虹膜快门书',
    kicker: 'IRIS APERTURE',
    title: '八片纸叶共同打开一个秘密窗口。',
    dek: '重叠叶片沿圆周同步旋转，中央孔径从针眼扩展成完整视野，适合控制信息揭示的节奏。',
    accent: '#6556ad',
    action: '打开虹膜窗口',
    kind: 'toggle',
    progressLabel: '孔径开合'
  }),
  waterfall: Object.freeze({
    name: '瀑布翻片书',
    kicker: 'WATERFALL FLAPS',
    title: '一条拉带，让六张卡片依次翻落。',
    dek: '阶梯排列的翻片共享同一条牵引带，每推进一步，新的因果节点就覆盖上一张卡片。',
    accent: '#3d8a89',
    action: '翻下下一张卡',
    kind: 'cycle',
    progressLabel: '已翻卡片',
    maxStep: 5
  }),
  venetian: Object.freeze({
    name: '百叶交错书',
    kicker: 'VENETIAN REVEAL',
    title: '二十条纸栅，在两幅图像之间换面。',
    dek: '交错纸条分别承载日与夜；视角或开合进度改变时，整幅画面会从一种叙事切换到另一种。',
    accent: '#347f9d',
    action: '翻到夜间画面',
    kind: 'toggle',
    progressLabel: '百叶换面'
  }),
  dosados: Object.freeze({
    name: '双首背靠背书',
    kicker: 'DOS-A-DOS',
    title: '同一条书脊，拥有两个相反的入口。',
    dek: '正向故事与反向证词背靠背装订；把整本书翻转一百八十度，另一位讲述者才会成为封面。',
    accent: '#a25d8f',
    action: '翻到反向入口',
    kind: 'toggle',
    progressLabel: '整书翻转'
  }),
  jacob: Object.freeze({
    name: '雅各布梯书',
    kicker: 'JACOB\'S LADDER',
    title: '六块硬板像瀑布一样连续换面。',
    dek: '交替穿过的纸带形成双稳态铰链；推动顶板后，翻转会沿着整列硬板逐级传递。',
    accent: '#d35f45',
    action: '推动下一块硬板',
    kind: 'cycle',
    progressLabel: '级联位置',
    maxStep: 5
  }),
  flexagon: Object.freeze({
    name: '万花折面书',
    kicker: 'FLEXAGON',
    title: '六个三角折面，藏着三组完整图案。',
    dek: '捏合与外翻会让原本朝内的面组转到外侧；同一个平面结构因此拥有三个可循环的内容状态。',
    accent: '#598b58',
    action: '翻出第二组折面',
    kind: 'cycle',
    progressLabel: '可见面组',
    maxStep: 2
  })
});

const INTERNAL_COPY = Object.freeze({
  gatefold: ['左门 · 线索', '中央 · 揭晓', '右门 · 回应'],
  accordion: ['出发', '转向', '穿行', '停留', '远眺', '抵达'],
  popup: ['地平线', '纸拱门', '主角'],
  diecut: ['远山', '树林', '河流', '近岸'],
  layers: ['结构', '流向', '标注'],
  tunnel: ['入口', '近景', '中景', '远景', '天光'],
  volvelle: ['晨', '昼', '昏', '夜', '春', '夏', '秋', '冬'],
  carousel: ['序章', '相遇', '离开', '回声', '归来', '再见'],
  infinite: ['种子', '生长', '开花', '迁徙', '沉睡', '种子'],
  mixmatch: Object.freeze({
    bands: ['身份 / HEAD', '行动 / BODY', '路径 / FEET'],
    faces: Object.freeze([
      ['观察者', '发明家', '园丁', '航海者', '守夜人'],
      ['记录', '建造', '培育', '寻找', '守护'],
      ['向城市', '向未来', '向森林', '向海面', '向星光']
    ])
  }),
  pulltab: ['遮罩揭示', '齿轮转动', '能量传递'],
  iris: ['线索', '焦点', '真相'],
  waterfall: ['触发', '变化', '传递', '反馈', '修正', '结果'],
  venetian: ['DAY / 城市表层', 'NIGHT / 城市暗线'],
  dosados: ['入口 A · 亲历者', '共享书脊', '入口 B · 观察者'],
  jacob: ['起因', '偏差', '证词', '反转', '校准', '新结论'],
  flexagon: ['物质', '能量', '生命']
});

function assertForm(formName) {
  const definition = FORM_DEFINITIONS[formName];
  if (!definition) throw new RangeError(`Unknown book form: ${String(formName)}`);
  return definition;
}

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

function numberedLabel(index, text) {
  const label = node('span', 'form-object__label');
  add(label, node('b', '', String(index + 1).padStart(2, '0')));
  add(label, node('span', '', text));
  return label;
}

function safeAccent(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const candidate = value.trim();
  if (!candidate || candidate.length > 72 || /[;{}<>]/.test(candidate)) return fallback;
  return candidate;
}

function buildGatefold(root) {
  const stage = add(root, node('div', 'form-gatefold__stage'));
  const reveal = add(stage, node('div', 'form-gatefold__reveal'));
  add(reveal, node('span', 'form-gatefold__halo'));
  add(reveal, node('small', '', 'CENTRAL REVEAL'));
  add(reveal, node('strong', '', INTERNAL_COPY.gatefold[1]));

  ['left', 'right'].forEach((side, index) => {
    const flap = add(stage, node('div', `form-gatefold__flap form-gatefold__flap--${side}`));
    flap.dataset.side = side;
    const face = add(flap, node('div', 'form-gatefold__face'));
    add(face, node('span', 'form-gatefold__arc'));
    add(face, numberedLabel(index * 2, INTERNAL_COPY.gatefold[index * 2]));
  });
}

function buildAccordion(root) {
  const track = add(root, node('div', 'form-accordion__track'));
  INTERNAL_COPY.accordion.forEach((copy, index) => {
    const panel = add(track, node('section', 'form-accordion__panel'));
    panel.dataset.panel = String(index);
    panel.dataset.fold = index % 2 === 0 ? 'mountain' : 'valley';
    add(panel, node('span', 'form-accordion__landmark'));
    add(panel, numberedLabel(index, copy));
  });
}

function buildPopup(root) {
  const bed = add(root, node('div', 'form-popup__bed'));
  add(bed, node('span', 'form-popup__crease form-popup__crease--left'));
  add(bed, node('span', 'form-popup__crease form-popup__crease--right'));
  const scene = add(bed, node('div', 'form-popup__scene'));

  ['ground', 'arch', 'subject'].forEach((kind, index) => {
    const piece = add(scene, node('div', `form-popup__piece form-popup__piece--${kind}`));
    piece.dataset.piece = kind;
    add(piece, node('span', 'form-popup__piece-face'));
    add(piece, numberedLabel(index, INTERNAL_COPY.popup[index]));
  });
}

function buildDiecut(root) {
  const stack = add(root, node('div', 'form-diecut__stack'));
  INTERNAL_COPY.diecut.forEach((copy, index) => {
    const layer = add(stack, node('div', `form-diecut__depth form-diecut__depth--${index + 1}`));
    layer.dataset.depth = String(index);
    add(layer, node('span', 'form-diecut__landscape'));
    add(layer, numberedLabel(index, copy));
  });

  const mask = add(stack, node('div', 'form-diecut__mask-sheet'));
  add(mask, node('div', 'form-diecut__window'));
  add(mask, node('span', 'form-diecut__mask-title', '窗口 / WINDOW'));
}

function buildLayers(root) {
  const stage = add(root, node('div', 'form-layers__stage'));
  add(stage, node('div', 'form-layers__base', 'BASE · 完整图谱'));
  INTERNAL_COPY.layers.forEach((copy, index) => {
    const vellum = add(stage, node('div', `form-layers__vellum form-layers__vellum--${index + 1}`));
    vellum.dataset.layer = String(index);
    add(vellum, node('span', 'form-layers__diagram'));
    add(vellum, numberedLabel(index, copy));
  });
}

function buildTunnel(root) {
  const well = add(root, node('div', 'form-tunnel__well'));
  add(well, node('div', 'form-tunnel__backdrop', '尽头仍有一页光'));
  INTERNAL_COPY.tunnel.forEach((copy, index) => {
    const frame = add(well, node('div', `form-tunnel__frame form-tunnel__frame--${index + 1}`));
    frame.dataset.frame = String(index);
    add(frame, node('div', 'form-tunnel__opening'));
    add(frame, numberedLabel(index, copy));
  });
}

function buildVolvelle(root) {
  const base = add(root, node('div', 'form-volvelle__base'));
  add(base, node('span', 'form-volvelle__base-title', '时间 / SEASON'));
  for (let index = 0; index < 12; index += 1) {
    const tick = add(base, node('i', 'form-volvelle__tick'));
    tick.style.setProperty('--tick-angle', `${index * 30}deg`);
    tick.style.transform = `rotate(${index * 30}deg)`;
  }

  const rotor = add(base, node('div', 'form-volvelle__rotor'));
  INTERNAL_COPY.volvelle.forEach((copy, index) => {
    const sector = add(rotor, node('span', 'form-volvelle__sector', copy));
    sector.dataset.sector = String(index);
    sector.style.setProperty('--sector-angle', `${index * 45}deg`);
    sector.style.transform = `rotate(${index * 45}deg) translateY(-42%)`;
  });
  add(base, node('div', 'form-volvelle__hub'));
  add(base, node('div', 'form-volvelle__pointer'));
}

function buildFlipbook(root) {
  const stack = add(root, node('div', 'form-flipbook__stack'));
  for (let index = 0; index < 12; index += 1) {
    const sheet = add(stack, node('div', 'form-flipbook__sheet'));
    sheet.dataset.frame = String(index);
    add(sheet, node('span', 'form-flipbook__frame-number', `FRAME ${String(index + 1).padStart(2, '0')}`));
    const actor = add(sheet, node('span', 'form-flipbook__actor'));
    actor.style.setProperty('--actor-x', `${10 + index * 6.4}%`);
    actor.style.setProperty('--actor-y', `${50 - Math.sin((index / 11) * Math.PI) * 28}%`);
    actor.style.left = `${10 + index * 6.4}%`;
    actor.style.top = `${50 - Math.sin((index / 11) * Math.PI) * 28}%`;
    add(sheet, node('span', 'form-flipbook__ground'));
  }
}

function buildCarousel(root) {
  const stage = add(root, node('div', 'form-carousel__stage'));
  const leaves = add(stage, node('div', 'form-carousel__leaves'));
  INTERNAL_COPY.carousel.forEach((copy, index) => {
    const leaf = add(leaves, node('article', 'form-carousel__leaf'));
    leaf.dataset.leaf = String(index);
    add(leaf, node('span', 'form-carousel__pattern'));
    add(leaf, numberedLabel(index, copy));
  });
  add(stage, node('div', 'form-carousel__hub'));
}

function buildInfinite(root) {
  const stage = add(root, node('div', 'form-infinite__stage'));
  const ring = add(stage, node('div', 'form-infinite__ring'));
  INTERNAL_COPY.infinite.forEach((copy, index) => {
    const panel = add(ring, node('article', 'form-infinite__panel'));
    panel.dataset.panel = String(index);
    add(panel, node('span', 'form-infinite__symbol'));
    add(panel, numberedLabel(index, copy));
  });
  add(stage, node('div', 'form-infinite__axis'));
}

function buildMixmatch(root) {
  const stage = add(root, node('div', 'form-mixmatch__stage'));
  add(stage, node('div', 'form-mixmatch__spine'));
  INTERNAL_COPY.mixmatch.bands.forEach((copy, bandIndex) => {
    const band = add(stage, node('section', 'form-mixmatch__band'));
    band.dataset.band = String(bandIndex);
    add(band, node('span', 'form-mixmatch__band-title', copy));
    const viewport = add(band, node('div', 'form-mixmatch__viewport'));
    const strip = add(viewport, node('div', 'form-mixmatch__strip'));
    INTERNAL_COPY.mixmatch.faces[bandIndex].forEach((faceCopy, faceIndex) => {
      const face = add(strip, node('article', 'form-mixmatch__face'));
      face.dataset.face = String(faceIndex);
      add(face, node('span', `form-mixmatch__portrait form-mixmatch__portrait--${bandIndex + 1}`));
      add(face, numberedLabel(faceIndex, faceCopy));
    });
  });
  add(stage, node('span', 'form-mixmatch__combination', '001 / 125'));
}

function buildPulltab(root) {
  const stage = add(root, node('div', 'form-pulltab__stage'));
  const housing = add(stage, node('div', 'form-pulltab__housing'));
  add(housing, node('span', 'form-pulltab__path'));
  INTERNAL_COPY.pulltab.forEach((copy, index) => {
    const part = add(housing, node('div', `form-pulltab__part form-pulltab__part--${index + 1}`));
    part.dataset.linkedPart = String(index);
    add(part, node('span', 'form-pulltab__part-shape'));
    add(part, numberedLabel(index, copy));
  });
  const track = add(stage, node('div', 'form-pulltab__track'));
  const ribbon = add(track, node('div', 'form-pulltab__ribbon'));
  add(ribbon, node('span', 'form-pulltab__arrow', 'PULL'));
  add(ribbon, node('span', 'form-pulltab__handle'));
}

function buildIris(root) {
  const stage = add(root, node('div', 'form-iris__stage'));
  const aperture = add(stage, node('div', 'form-iris__aperture'));
  const reveal = add(aperture, node('div', 'form-iris__reveal'));
  INTERNAL_COPY.iris.forEach((copy, index) => {
    const ring = add(reveal, node('span', `form-iris__reveal-ring form-iris__reveal-ring--${index + 1}`, copy));
    ring.dataset.reveal = String(index);
  });
  const blades = add(aperture, node('div', 'form-iris__blades'));
  for (let index = 0; index < 8; index += 1) {
    const blade = add(blades, node('i', 'form-iris__blade'));
    blade.dataset.blade = String(index);
    blade.style.setProperty('--blade-index', String(index));
    blade.style.setProperty('--blade-origin-angle', `${index * 45}deg`);
  }
  add(aperture, node('div', 'form-iris__rim'));
  add(stage, node('span', 'form-iris__caption', 'APERTURE · 00%'));
}

function buildWaterfall(root) {
  const stage = add(root, node('div', 'form-waterfall__stage'));
  const stack = add(stage, node('div', 'form-waterfall__stack'));
  INTERNAL_COPY.waterfall.forEach((copy, index) => {
    const card = add(stack, node('article', 'form-waterfall__card'));
    card.dataset.card = String(index);
    add(card, node('span', 'form-waterfall__card-mark'));
    add(card, numberedLabel(index, copy));
  });
  const ribbon = add(stage, node('div', 'form-waterfall__ribbon'));
  add(ribbon, node('span', 'form-waterfall__ribbon-line'));
  add(ribbon, node('strong', 'form-waterfall__handle', 'PULL ↓'));
}

function buildVenetian(root) {
  const stage = add(root, node('div', 'form-venetian__stage'));
  const frame = add(stage, node('div', 'form-venetian__frame'));
  const captions = add(frame, node('div', 'form-venetian__captions'));
  add(captions, node('span', 'form-venetian__caption form-venetian__caption--a', INTERNAL_COPY.venetian[0]));
  add(captions, node('span', 'form-venetian__caption form-venetian__caption--b', INTERNAL_COPY.venetian[1]));
  const slats = add(frame, node('div', 'form-venetian__slats'));
  for (let index = 0; index < 20; index += 1) {
    const slat = add(slats, node('span', 'form-venetian__slat'));
    slat.dataset.slat = String(index);
    slat.style.setProperty('--slat-index', String(index));
    add(slat, node('i', 'form-venetian__face form-venetian__face--a'));
    add(slat, node('i', 'form-venetian__face form-venetian__face--b'));
  }
  add(frame, node('span', 'form-venetian__sightline'));
}

function buildDosados(root) {
  const stage = add(root, node('div', 'form-dosados__stage'));
  const book = add(stage, node('div', 'form-dosados__book'));
  book.dataset.wholeBook = 'true';
  const entryA = add(book, node('article', 'form-dosados__entry form-dosados__entry--a'));
  entryA.dataset.entry = 'a';
  add(entryA, node('span', 'form-dosados__entry-mark', 'A →'));
  add(entryA, numberedLabel(0, INTERNAL_COPY.dosados[0]));
  const block = add(book, node('div', 'form-dosados__block'));
  add(block, node('span', 'form-dosados__page-edge form-dosados__page-edge--top'));
  add(block, node('span', 'form-dosados__page-edge form-dosados__page-edge--side'));
  const spine = add(book, node('div', 'form-dosados__spine'));
  spine.dataset.sharedSpine = 'true';
  add(spine, node('span', '', INTERNAL_COPY.dosados[1]));
  const entryB = add(book, node('article', 'form-dosados__entry form-dosados__entry--b'));
  entryB.dataset.entry = 'b';
  add(entryB, node('span', 'form-dosados__entry-mark', '← B'));
  add(entryB, numberedLabel(1, INTERNAL_COPY.dosados[2]));
  add(stage, node('span', 'form-dosados__turn-label', 'ENTRY A · 000°'));
}

function buildJacob(root) {
  const stage = add(root, node('div', 'form-jacob__stage'));
  const cascade = add(stage, node('div', 'form-jacob__cascade'));
  const ribbonLeft = add(cascade, node('span', 'form-jacob__ribbon form-jacob__ribbon--left'));
  ribbonLeft.dataset.ribbon = 'left';
  const ribbonRight = add(cascade, node('span', 'form-jacob__ribbon form-jacob__ribbon--right'));
  ribbonRight.dataset.ribbon = 'right';
  INTERNAL_COPY.jacob.forEach((copy, index) => {
    const board = add(cascade, node('article', 'form-jacob__board'));
    board.dataset.board = String(index);
    board.dataset.hinge = index % 2 === 0 ? 'left' : 'right';
    const front = add(board, node('span', 'form-jacob__board-face form-jacob__board-face--front'));
    add(front, numberedLabel(index, copy));
    const back = add(board, node('span', 'form-jacob__board-face form-jacob__board-face--back'));
    add(back, node('b', '', String(index + 1).padStart(2, '0')));
    add(back, node('span', '', '反面证词'));
  });
}

function buildFlexagon(root) {
  const stage = add(root, node('div', 'form-flexagon__stage'));
  const flexagon = add(stage, node('div', 'form-flexagon__body'));
  for (let index = 0; index < 6; index += 1) {
    const triangle = add(flexagon, node('div', 'form-flexagon__triangle'));
    triangle.dataset.triangle = String(index);
    triangle.style.setProperty('--triangle-index', String(index));
    INTERNAL_COPY.flexagon.forEach((copy, faceIndex) => {
      const face = add(triangle, node('span', `form-flexagon__face form-flexagon__face--${faceIndex + 1}`));
      face.dataset.faceGroup = String(faceIndex);
      add(face, node('b', '', String(index + 1).padStart(2, '0')));
      add(face, node('i', '', copy));
    });
  }
  const hub = add(flexagon, node('div', 'form-flexagon__hub'));
  add(hub, node('small', '', 'VISIBLE FACE'));
  add(hub, node('strong', 'form-flexagon__hub-label', INTERNAL_COPY.flexagon[0]));
}

const BUILDERS = Object.freeze({
  gatefold: buildGatefold,
  accordion: buildAccordion,
  popup: buildPopup,
  diecut: buildDiecut,
  layers: buildLayers,
  tunnel: buildTunnel,
  volvelle: buildVolvelle,
  flipbook: buildFlipbook,
  carousel: buildCarousel,
  infinite: buildInfinite,
  mixmatch: buildMixmatch,
  pulltab: buildPulltab,
  iris: buildIris,
  waterfall: buildWaterfall,
  venetian: buildVenetian,
  dosados: buildDosados,
  jacob: buildJacob,
  flexagon: buildFlexagon
});

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function numberOr(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizedState(formName, state = {}) {
  const definition = assertForm(formName);
  const maxStep = definition.maxStep ?? 0;
  const progress = clamp(numberOr(state.progress));
  const rawStep = Math.trunc(numberOr(state.step));
  const step = maxStep > 0 ? clamp(rawStep, 0, maxStep) : Math.max(0, rawStep);
  const turn = clamp(numberOr(state.turn), -1, 1);
  return {
    progress,
    step,
    turn,
    fallback: Boolean(state.fallback),
    playing: Boolean(state.playing)
  };
}

function writeRootState(root, current) {
  root.dataset.progress = current.progress.toFixed(3);
  root.dataset.step = String(current.step);
  root.dataset.turn = current.turn.toFixed(3);
  root.dataset.fallback = String(current.fallback);
  root.dataset.playing = String(current.playing);
  root.style.setProperty('--form-progress', current.progress.toFixed(3));
  root.style.setProperty('--form-step', String(current.step));
  root.style.setProperty('--form-turn', current.turn.toFixed(3));
}

function applyGatefold(root, current) {
  const open = current.progress;
  const leftAngle = -148 * open;
  const rightAngle = 148 * open;
  const left = root.querySelector('.form-gatefold__flap--left');
  const right = root.querySelector('.form-gatefold__flap--right');
  left.style.setProperty('--flap-angle', `${leftAngle.toFixed(2)}deg`);
  right.style.setProperty('--flap-angle', `${rightAngle.toFixed(2)}deg`);
  left.style.transform = current.fallback
    ? `translateX(${(-48 * open).toFixed(2)}%) scaleX(${(1 - open * 0.13).toFixed(3)})`
    : `rotateY(${leftAngle.toFixed(2)}deg)`;
  right.style.transform = current.fallback
    ? `translateX(${(48 * open).toFixed(2)}%) scaleX(${(1 - open * 0.13).toFixed(3)})`
    : `rotateY(${rightAngle.toFixed(2)}deg)`;
  [left, right].forEach((flap) => flap.style.setProperty('--flap-progress', open.toFixed(3)));
}

function applyAccordion(root, current) {
  const panels = [...root.querySelectorAll('.form-accordion__panel')];
  const unfolded = Math.max(current.progress, current.step / Math.max(1, panels.length - 1));
  panels.forEach((panel, index) => {
    const sign = index % 2 === 0 ? 1 : -1;
    const angle = sign * (1 - unfolded) * 72;
    const localProgress = clamp(unfolded * panels.length - index * 0.34);
    panel.dataset.state = index < current.step ? 'settled' : index === current.step ? 'active' : 'folded';
    panel.style.setProperty('--panel-progress', localProgress.toFixed(3));
    panel.style.setProperty('--fold-angle', `${angle.toFixed(2)}deg`);
    panel.style.transform = current.fallback
      ? `translateX(${(sign * (1 - unfolded) * 7).toFixed(2)}%) scaleX(${(0.62 + unfolded * 0.38).toFixed(3)})`
      : `rotateY(${angle.toFixed(2)}deg) translateZ(${(localProgress * 4).toFixed(2)}px)`;
  });
}

function applyPopup(root, current) {
  const pieces = [...root.querySelectorAll('.form-popup__piece')];
  pieces.forEach((piece, index) => {
    const weight = 0.78 + index * 0.11;
    const lift = clamp(current.progress * weight);
    const angle = -(46 + index * 16) * lift;
    const z = (14 + index * 22) * lift;
    piece.dataset.state = lift > 0.66 ? 'raised' : lift > 0.05 ? 'lifting' : 'flat';
    piece.style.setProperty('--popup-lift', lift.toFixed(3));
    piece.style.setProperty('--popup-angle', `${angle.toFixed(2)}deg`);
    piece.style.transform = current.fallback
      ? `translateY(${(-index * 7 * lift).toFixed(2)}%) scaleY(${(1 + lift * 0.08).toFixed(3)})`
      : `translate3d(0, ${(-index * 2 * lift).toFixed(2)}%, ${z.toFixed(2)}px) rotateX(${angle.toFixed(2)}deg)`;
  });
}

function applyDiecut(root, current) {
  const layers = [...root.querySelectorAll('.form-diecut__depth')];
  const radius = 17 + current.progress * 17 + current.step * 5;
  const window = root.querySelector('.form-diecut__window');
  const mask = root.querySelector('.form-diecut__mask-sheet');
  root.style.setProperty('--window-radius', `${radius.toFixed(2)}%`);
  window.style.setProperty('--window-radius', `${radius.toFixed(2)}%`);
  window.style.transform = `scale(${(0.76 + radius / 100).toFixed(3)})`;
  mask.style.transform = current.fallback ? 'none' : 'translateZ(64px)';
  layers.forEach((layer, index) => {
    const revealed = index <= current.step;
    const depth = (layers.length - index) * 17 + current.progress * index * 5;
    const scale = 1 - index * 0.025 + current.progress * 0.012;
    layer.dataset.state = index === current.step ? 'active' : revealed ? 'revealed' : 'hidden';
    layer.style.setProperty('--depth-z', `${depth.toFixed(2)}px`);
    layer.style.transform = current.fallback
      ? `scale(${scale.toFixed(3)}) translateY(${(-index * 1.1).toFixed(2)}%)`
      : `translateZ(${depth.toFixed(2)}px) scale(${scale.toFixed(3)})`;
    layer.style.opacity = revealed ? '1' : '0.34';
  });
}

function applyLayers(root, current) {
  const vellums = [...root.querySelectorAll('.form-layers__vellum')];
  vellums.forEach((vellum, index) => {
    const settled = index < current.step || (index === current.step && current.progress >= 0.98);
    const active = index === current.step && !settled;
    const layerState = settled ? 'settled' : active ? 'active' : 'waiting';
    const travel = active ? 1 - current.progress : index > current.step ? 1 : 0;
    const x = (index % 2 === 0 ? 1 : -1) * travel * (24 + index * 7);
    const y = -travel * (7 + index * 3);
    const z = (index + 1) * 18 + (active ? 28 * (1 - current.progress) : 0);
    const angle = (index % 2 === 0 ? 1 : -1) * travel * (4 + index * 1.5);
    vellum.dataset.layerState = layerState;
    vellum.classList.toggle('is-settled', settled);
    vellum.classList.toggle('is-active', active);
    vellum.classList.toggle('is-waiting', layerState === 'waiting');
    vellum.style.setProperty('--layer-progress', (active ? current.progress : settled ? 1 : 0).toFixed(3));
    vellum.style.transform = current.fallback
      ? `translate(${x.toFixed(2)}%, ${y.toFixed(2)}%) rotate(${angle.toFixed(2)}deg)`
      : `translate3d(${x.toFixed(2)}%, ${y.toFixed(2)}%, ${z.toFixed(2)}px) rotateZ(${angle.toFixed(2)}deg)`;
  });
}

function applyTunnel(root, current) {
  const frames = [...root.querySelectorAll('.form-tunnel__frame')];
  const travel = current.step + current.progress;
  frames.forEach((frame, index) => {
    const relative = index - travel;
    // Keep the front frame spatially dominant without letting nested perspective
    // project it over the stage title at desktop widths.
    const z = (frames.length - index) * 26 + travel * 10;
    const scale = clamp(1 - relative * 0.045, 0.76, 1.1);
    frame.dataset.state = index < current.step ? 'passed' : index === current.step ? 'active' : 'ahead';
    frame.style.setProperty('--tunnel-z', `${z.toFixed(2)}px`);
    frame.style.setProperty('--tunnel-scale', scale.toFixed(3));
    frame.style.transform = current.fallback
      ? `translate(${(relative * 1.4).toFixed(2)}%, ${(relative * 1.1).toFixed(2)}%) scale(${scale.toFixed(3)})`
      : `translateZ(${z.toFixed(2)}px) scale(${scale.toFixed(3)})`;
  });
}

function applyVolvelle(root, current) {
  const angle = (current.step + current.progress + current.turn * 0.08) * 45;
  const rotor = root.querySelector('.form-volvelle__rotor');
  const pointer = root.querySelector('.form-volvelle__pointer');
  rotor.style.setProperty('--rotor-angle', `${angle.toFixed(2)}deg`);
  rotor.style.transform = `rotate(${angle.toFixed(2)}deg)`;
  pointer.style.transform = `translateX(-50%) rotate(${(current.progress * 4 - 2).toFixed(2)}deg)`;
  root.dataset.sector = String(current.step);
}

function applyFlipbook(root, current) {
  const sheets = [...root.querySelectorAll('.form-flipbook__sheet')];
  const currentFrame = clamp(current.step, 0, sheets.length - 1);
  root.dataset.currentFrame = String(currentFrame);
  sheets.forEach((sheet, index) => {
    let side = 'right';
    let angle = 0;
    if (index < currentFrame) {
      side = 'left';
      angle = -178;
    } else if (index === currentFrame) {
      side = 'current';
      angle = -176 * current.progress + current.turn * 4;
    }
    const stackOffset = Math.abs(index - currentFrame);
    sheet.dataset.side = side;
    sheet.dataset.current = String(index === currentFrame);
    sheet.style.setProperty('--sheet-angle', `${angle.toFixed(2)}deg`);
    sheet.style.setProperty('--sheet-depth', `${stackOffset}px`);
    sheet.style.zIndex = String(index === currentFrame ? sheets.length + 2 : sheets.length - stackOffset);
    sheet.style.transform = current.fallback
      ? `translateX(${side === 'left' ? '-52' : side === 'current' ? (-52 * current.progress).toFixed(2) : '0'}%) scale(${(1 - stackOffset * 0.002).toFixed(3)})`
      : `translateZ(${(sheets.length - stackOffset).toFixed(2)}px) rotateY(${angle.toFixed(2)}deg)`;
  });
}

function applyCarousel(root, current) {
  const leaves = [...root.querySelectorAll('.form-carousel__leaf')];
  const rotation = (current.step + current.progress) * (360 / leaves.length);
  leaves.forEach((leaf, index) => {
    const polar = index * (360 / leaves.length) - rotation;
    const activeDistance = Math.abs((((polar + 180) % 360) + 360) % 360 - 180);
    leaf.dataset.state = activeDistance < 31 ? 'active' : 'around';
    leaf.style.setProperty('--leaf-angle', `${polar.toFixed(2)}deg`);
    leaf.style.transform = current.fallback
      ? `rotate(${polar.toFixed(2)}deg) translateY(-34%) scale(${(activeDistance < 31 ? 1 : 0.78).toFixed(3)})`
      : `rotateY(${polar.toFixed(2)}deg) translateZ(172px) rotateY(90deg)`;
  });
  const leavesRoot = root.querySelector('.form-carousel__leaves');
  leavesRoot.style.setProperty('--carousel-rotation', `${rotation.toFixed(2)}deg`);
}

function applyInfinite(root, current) {
  const panels = [...root.querySelectorAll('.form-infinite__panel')];
  const segment = 360 / panels.length;
  const rotation = -(current.step + current.progress + current.turn * 0.08) * segment;
  const ring = root.querySelector('.form-infinite__ring');
  ring.style.setProperty('--ring-angle', `${rotation.toFixed(2)}deg`);
  ring.style.transform = current.fallback
    ? `translateX(${(-current.progress * 9).toFixed(2)}%)`
    : `rotateY(${rotation.toFixed(2)}deg)`;
  panels.forEach((panel, index) => {
    const angle = index * segment;
    const normalized = ((index - current.step) % panels.length + panels.length) % panels.length;
    panel.dataset.state = normalized === 0 ? 'active' : normalized === 1 ? 'next' : 'loop';
    panel.style.setProperty('--loop-angle', `${angle.toFixed(2)}deg`);
    panel.style.transform = current.fallback
      ? `translateX(${((index - current.step) * 38).toFixed(2)}%) scale(${(normalized === 0 ? 1 : 0.84).toFixed(3)})`
      : `rotateY(${angle.toFixed(2)}deg) translateZ(190px)`;
  });
}

function applyMixmatch(root, current) {
  const bands = [...root.querySelectorAll('.form-mixmatch__band')];
  const combination = clamp(current.step, 0, 124);
  const selectedFaces = [
    Math.floor(combination / 25) % 5,
    Math.floor(combination / 5) % 5,
    combination % 5
  ];
  bands.forEach((band, bandIndex) => {
    const selected = selectedFaces[bandIndex];
    const direction = bandIndex % 2 === 0 ? -1 : 1;
    const dragOffset = direction * current.progress * (10 + bandIndex * 3) + current.turn * 4;
    band.dataset.selectedFace = String(selected);
    const strip = band.querySelector('.form-mixmatch__strip');
    strip.style.setProperty('--band-offset', `${dragOffset.toFixed(2)}%`);
    strip.style.transform = current.fallback
      ? `translateX(${dragOffset.toFixed(2)}%)`
      : `translate3d(${dragOffset.toFixed(2)}%, 0, ${(bandIndex * 7).toFixed(2)}px)`;
    [...band.querySelectorAll('.form-mixmatch__face')].forEach((face, faceIndex) => {
      const relative = faceIndex - selected;
      const x = relative * 106;
      const angle = clamp(relative, -1, 1) * 8 + direction * current.progress * 2;
      face.dataset.state = relative === 0 ? 'active' : Math.abs(relative) === 1 ? 'adjacent' : 'hidden';
      face.style.opacity = Math.abs(relative) > 1 ? '0' : relative === 0 ? '1' : '0.22';
      face.style.transform = current.fallback
        ? `translateX(${x.toFixed(2)}%)`
        : `translate3d(${x.toFixed(2)}%, 0, ${(-Math.abs(relative) * 12).toFixed(2)}px) rotateY(${angle.toFixed(2)}deg)`;
    });
  });
  const label = root.querySelector('.form-mixmatch__combination');
  label.textContent = `${String(combination + 1).padStart(3, '0')} / 125`;
  root.dataset.combination = String(combination + 1);
}

function applyPulltab(root, current) {
  const travel = current.progress;
  const ribbon = root.querySelector('.form-pulltab__ribbon');
  ribbon.style.setProperty('--pull-distance', travel.toFixed(3));
  ribbon.style.transform = `translateX(${(travel * 58).toFixed(2)}%)`;

  const parts = [...root.querySelectorAll('.form-pulltab__part')];
  parts.forEach((part, index) => {
    part.dataset.state = travel > 0.96 ? 'complete' : travel > 0.04 ? 'moving' : 'rest';
    part.style.setProperty('--linked-progress', travel.toFixed(3));
    if (index === 0) {
      part.style.transform = `translateX(${(travel * 72).toFixed(2)}%)`;
      part.style.opacity = (1 - travel * 0.56).toFixed(3);
    } else if (index === 1) {
      const angle = travel * 252 + current.turn * 5;
      part.style.transform = `rotate(${angle.toFixed(2)}deg) scale(${(0.9 + travel * 0.1).toFixed(3)})`;
    } else {
      const x = travel * 19;
      const scale = 0.72 + travel * 0.48;
      part.style.transform = current.fallback
        ? `translateX(${x.toFixed(2)}%) scale(${scale.toFixed(3)})`
        : `translate3d(${x.toFixed(2)}%, ${(-travel * 8).toFixed(2)}%, ${(travel * 42).toFixed(2)}px) scale(${scale.toFixed(3)})`;
    }
  });
  const path = root.querySelector('.form-pulltab__path');
  path.style.transform = `scaleX(${(0.14 + travel * 0.86).toFixed(3)})`;
  root.dataset.linked = travel >= 0.5 ? 'active' : 'rest';
}

function applyIris(root, current) {
  const open = current.progress;
  const blades = [...root.querySelectorAll('.form-iris__blade')];
  blades.forEach((blade, index) => {
    const originAngle = index * 45;
    const sweep = open * 58;
    const radialTravel = open * 46;
    const angle = originAngle + sweep;
    blade.dataset.state = open > 0.94 ? 'open' : open > 0.04 ? 'moving' : 'closed';
    blade.style.setProperty('--blade-angle', `${angle.toFixed(2)}deg`);
    blade.style.setProperty('--blade-travel', `${radialTravel.toFixed(2)}px`);
    blade.style.transform = current.fallback
      ? `rotate(${angle.toFixed(2)}deg) translateY(${(-radialTravel).toFixed(2)}px) scale(${(1 - open * 0.2).toFixed(3)})`
      : `rotate(${angle.toFixed(2)}deg) translate3d(0, ${(-radialTravel).toFixed(2)}px, ${(index % 2) * 2}px) rotate(${(-sweep * 0.22).toFixed(2)}deg)`;
  });
  const reveal = root.querySelector('.form-iris__reveal');
  const revealScale = 0.08 + open * 0.92;
  reveal.style.clipPath = `circle(${(4 + open * 46).toFixed(2)}% at 50% 50%)`;
  reveal.style.transform = `scale(${revealScale.toFixed(3)}) rotate(${(current.turn * 2).toFixed(2)}deg)`;
  reveal.style.opacity = clamp(open * 1.35).toFixed(3);
  root.querySelector('.form-iris__caption').textContent = `APERTURE · ${String(Math.round(open * 100)).padStart(2, '0')}%`;
}

function applyWaterfall(root, current) {
  const cards = [...root.querySelectorAll('.form-waterfall__card')];
  const travel = current.step + current.progress;
  cards.forEach((card, index) => {
    const local = clamp(travel - index);
    const flipped = local >= 0.98;
    const active = index === current.step && !flipped;
    const angle = -176 * local;
    const drop = local * (20 + index * 2);
    card.dataset.state = flipped ? 'flipped' : active ? 'active' : 'waiting';
    card.style.setProperty('--card-index', String(index));
    card.style.setProperty('--card-progress', local.toFixed(3));
    card.style.zIndex = String(flipped ? index + 1 : cards.length - index + 2);
    card.style.transform = current.fallback
      ? `translateY(${drop.toFixed(2)}%) scaleY(${(1 - local * 0.08).toFixed(3)})`
      : `translate3d(0, ${drop.toFixed(2)}%, ${((cards.length - index) * 4).toFixed(2)}px) rotateX(${angle.toFixed(2)}deg)`;
  });
  const ribbon = root.querySelector('.form-waterfall__ribbon');
  ribbon.style.transform = `translateY(${clamp(travel / Math.max(1, cards.length - 1)) * 56}%)`;
  root.dataset.activeCard = String(Math.min(current.step + 1, cards.length));
}

function applyVenetian(root, current) {
  const slats = [...root.querySelectorAll('.form-venetian__slat')];
  slats.forEach((slat, index) => {
    const waveOffset = Math.abs(index - (slats.length - 1) / 2) * 0.009;
    const local = clamp((current.progress - waveOffset) / Math.max(0.01, 1 - waveOffset));
    const angle = local * 180 + current.turn * (index % 2 === 0 ? 2 : -2);
    slat.dataset.face = local < 0.5 ? 'day' : 'night';
    slat.style.setProperty('--slat-progress', local.toFixed(3));
    slat.style.setProperty('--slat-angle', `${angle.toFixed(2)}deg`);
    slat.style.transform = current.fallback
      ? `translateY(${((index % 2 === 0 ? -1 : 1) * local * 4).toFixed(2)}%) scaleX(${(1 - local * 0.05).toFixed(3)})`
      : `rotateY(${angle.toFixed(2)}deg) translateZ(${(Math.sin(local * Math.PI) * 8).toFixed(2)}px)`;
  });
  const captionA = root.querySelector('.form-venetian__caption--a');
  const captionB = root.querySelector('.form-venetian__caption--b');
  captionA.style.opacity = (1 - current.progress).toFixed(3);
  captionB.style.opacity = current.progress.toFixed(3);
  root.dataset.visibleScene = current.progress < 0.5 ? 'day' : 'night';
}

function applyDosados(root, current) {
  const book = root.querySelector('.form-dosados__book');
  const angle = current.progress * 180 + current.turn * 5;
  book.style.setProperty('--whole-book-angle', `${angle.toFixed(2)}deg`);
  book.style.transform = current.fallback
    ? `translateX(${(-current.progress * 9).toFixed(2)}%) scale(${(1 - Math.sin(current.progress * Math.PI) * 0.08).toFixed(3)})`
    : `rotateY(${angle.toFixed(2)}deg) rotateZ(${(Math.sin(current.progress * Math.PI) * -2).toFixed(2)}deg)`;
  const entryA = root.querySelector('.form-dosados__entry--a');
  const entryB = root.querySelector('.form-dosados__entry--b');
  entryA.dataset.state = current.progress < 0.5 ? 'active' : 'reverse';
  entryB.dataset.state = current.progress >= 0.5 ? 'active' : 'reverse';
  const label = root.querySelector('.form-dosados__turn-label');
  label.textContent = `${current.progress < 0.5 ? 'ENTRY A' : 'ENTRY B'} · ${String(Math.round(angle)).padStart(3, '0')}°`;
  root.dataset.entry = current.progress < 0.5 ? 'a' : 'b';
}

function applyJacob(root, current) {
  const boards = [...root.querySelectorAll('.form-jacob__board')];
  const travel = current.step + current.progress;
  boards.forEach((board, index) => {
    const local = clamp(travel - index);
    const direction = index % 2 === 0 ? 1 : -1;
    const angle = direction * local * 180;
    const x = direction * Math.sin(local * Math.PI) * 16;
    const y = local * 8;
    board.dataset.state = local >= 0.98 ? 'turned' : local > 0.02 ? 'turning' : 'waiting';
    board.style.setProperty('--board-index', String(index));
    board.style.setProperty('--board-progress', local.toFixed(3));
    board.style.setProperty('--board-angle', `${angle.toFixed(2)}deg`);
    board.style.zIndex = String(local >= 0.98 ? index + 1 : boards.length - index + 2);
    board.style.transform = current.fallback
      ? `translate(${x.toFixed(2)}%, ${y.toFixed(2)}%) scaleY(${(1 - local * 0.06).toFixed(3)})`
      : `translate3d(${x.toFixed(2)}%, ${y.toFixed(2)}%, ${(Math.sin(local * Math.PI) * 28).toFixed(2)}px) rotateX(${angle.toFixed(2)}deg)`;
  });
  [...root.querySelectorAll('.form-jacob__ribbon')].forEach((ribbon, index) => {
    const direction = index === 0 ? -1 : 1;
    ribbon.style.transform = `translateX(${(direction * current.progress * 7).toFixed(2)}%) skewY(${(direction * current.progress * 5).toFixed(2)}deg)`;
  });
  root.dataset.activeBoard = String(Math.min(current.step + 1, boards.length));
}

function applyFlexagon(root, current) {
  const triangles = [...root.querySelectorAll('.form-flexagon__triangle')];
  const faceGroup = clamp(current.step, 0, INTERNAL_COPY.flexagon.length - 1);
  const fold = current.progress;
  triangles.forEach((triangle, index) => {
    const polar = index * 60;
    const direction = index % 2 === 0 ? 1 : -1;
    const foldAngle = direction * Math.sin(fold * Math.PI) * 38;
    const squeeze = Math.sin(fold * Math.PI) * 11;
    triangle.dataset.activeGroup = String(faceGroup);
    triangle.style.setProperty('--triangle-angle', `${polar.toFixed(2)}deg`);
    triangle.style.setProperty('--fold-angle', `${foldAngle.toFixed(2)}deg`);
    triangle.style.transform = current.fallback
      ? `rotate(${polar.toFixed(2)}deg) translateY(${(-64 + squeeze * 0.22).toFixed(2)}%) scale(${(1 - squeeze * 0.004).toFixed(3)})`
      : `rotate(${polar.toFixed(2)}deg) translateY(${(-64 + squeeze * 0.22).toFixed(2)}%) rotateX(${foldAngle.toFixed(2)}deg) rotateZ(${(direction * fold * 3).toFixed(2)}deg)`;
    [...triangle.querySelectorAll('.form-flexagon__face')].forEach((face, indexOfFace) => {
      const active = indexOfFace === faceGroup;
      face.dataset.state = active ? 'active' : 'hidden';
      face.style.opacity = active ? '1' : '0';
      face.style.transform = `rotateY(${active ? 0 : (indexOfFace - faceGroup) * 120}deg) translateZ(${active ? '2' : '-2'}px)`;
    });
  });
  const hubLabel = root.querySelector('.form-flexagon__hub-label');
  hubLabel.textContent = INTERNAL_COPY.flexagon[faceGroup];
  root.dataset.faceGroup = String(faceGroup);
}

const APPLIERS = Object.freeze({
  gatefold: applyGatefold,
  accordion: applyAccordion,
  popup: applyPopup,
  diecut: applyDiecut,
  layers: applyLayers,
  tunnel: applyTunnel,
  volvelle: applyVolvelle,
  flipbook: applyFlipbook,
  carousel: applyCarousel,
  infinite: applyInfinite,
  mixmatch: applyMixmatch,
  pulltab: applyPulltab,
  iris: applyIris,
  waterfall: applyWaterfall,
  venetian: applyVenetian,
  dosados: applyDosados,
  jacob: applyJacob,
  flexagon: applyFlexagon
});

export function createFormSurface(formName, { accent } = {}) {
  const definition = assertForm(formName);
  const root = node('div', `form-surface form-surface--${formName}`);
  root.dataset.form = formName;
  root.setAttribute('role', 'img');
  root.setAttribute('aria-label', `${definition.name}：${definition.title}`);
  root.style.setProperty('--form-accent', safeAccent(accent, definition.accent));
  BUILDERS[formName](root);
  applyFormState(root, formName, { progress: 0, step: 0, turn: 0, fallback: false });
  return root;
}

export function applyFormState(root, formName, state = {}) {
  assertForm(formName);
  if (!(root instanceof Element)) throw new TypeError('applyFormState requires a DOM Element root.');
  const current = normalizedState(formName, state);
  root.dataset.form = formName;
  writeRootState(root, current);
  APPLIERS[formName](root, current);
  return root;
}

export function formActionLabel(formName, state = {}) {
  const definition = assertForm(formName);
  const current = normalizedState(formName, state);
  const isOpen = current.progress >= 0.5;

  if (formName === 'gatefold') return isOpen ? '合上双门' : definition.action;
  if (formName === 'popup') return isOpen ? '收起立体结构' : definition.action;
  if (formName === 'flipbook') return current.playing ? '暂停翻动画面' : definition.action;
  if (formName === 'accordion') return current.step >= definition.maxStep ? '重新收拢六折' : `展开第 ${current.step + 2} 折`;
  if (formName === 'diecut') return current.step >= definition.maxStep ? '回到第一深度' : `查看深度 ${current.step + 2}`;
  if (formName === 'layers') return current.step >= definition.maxStep ? '分开透明页' : `叠加第 ${current.step + 2} 层`;
  if (formName === 'tunnel') return current.step >= definition.maxStep ? '返回隧道入口' : `深入第 ${current.step + 2} 景`;
  if (formName === 'volvelle') return current.step >= definition.maxStep ? '转回晨间刻度' : `旋转到${INTERNAL_COPY.volvelle[current.step + 1]}`;
  if (formName === 'carousel') return current.step >= definition.maxStep ? '转回序章' : `转到「${INTERNAL_COPY.carousel[current.step + 1]}」`;
  if (formName === 'infinite') return `进入「${INTERNAL_COPY.infinite[(current.step + 1) % INTERNAL_COPY.infinite.length]}」`;
  if (formName === 'mixmatch') return current.step >= definition.maxStep ? '回到组合 001' : `生成组合 ${String(current.step + 2).padStart(3, '0')}`;
  if (formName === 'pulltab') return isOpen ? '推回联动纸条' : definition.action;
  if (formName === 'iris') return isOpen ? '关闭虹膜窗口' : definition.action;
  if (formName === 'waterfall') return current.step >= definition.maxStep ? '收回全部翻片' : `翻下第 ${current.step + 2} 张卡`;
  if (formName === 'venetian') return isOpen ? '翻回日间画面' : definition.action;
  if (formName === 'dosados') return isOpen ? '翻回正向入口' : definition.action;
  if (formName === 'jacob') return current.step >= definition.maxStep ? '复位六块硬板' : `推动第 ${current.step + 2} 块硬板`;
  if (formName === 'flexagon') return current.step >= definition.maxStep ? '翻回「物质」面组' : `翻出「${INTERNAL_COPY.flexagon[current.step + 1]}」面组`;
  return definition.action;
}

export function formStatusText(formName, state = {}) {
  const definition = assertForm(formName);
  const current = normalizedState(formName, state);
  const percent = Math.round(current.progress * 100);

  if (formName === 'gatefold') return `${definition.name} · 双门已打开 ${percent}%`;
  if (formName === 'popup') return `${definition.name} · 纸构件已抬升 ${percent}%`;
  if (formName === 'accordion') return `${definition.name} · 第 ${current.step + 1} / 6 折 · 展开 ${percent}%`;
  if (formName === 'diecut') return `${definition.name} · 正在观察第 ${current.step + 1} / 4 个深度 · 窗口 ${percent}%`;
  if (formName === 'layers') return `${definition.name} · 第 ${current.step + 1} / 3 张透明页为${current.progress >= 0.98 ? '已叠合' : '活动层'}`;
  if (formName === 'tunnel') return `${definition.name} · 位于第 ${current.step + 1} / 5 层纸框 · 推进 ${percent}%`;
  if (formName === 'volvelle') return `${definition.name} · 指针指向「${INTERNAL_COPY.volvelle[current.step]}」 · 旋转 ${percent}%`;
  if (formName === 'flipbook') return `${definition.name} · FRAME ${String(current.step + 1).padStart(2, '0')} / 12${current.playing ? ' · 播放中' : ' · 已暂停'}`;
  if (formName === 'carousel') return `${definition.name} · 正面扇页「${INTERNAL_COPY.carousel[current.step]}」 · 转动 ${percent}%`;
  if (formName === 'infinite') return `${definition.name} · 循环节点 ${current.step + 1} / 6「${INTERNAL_COPY.infinite[current.step]}」`;
  if (formName === 'mixmatch') {
    const combination = clamp(current.step, 0, 124);
    const head = Math.floor(combination / 25) % 5;
    const body = Math.floor(combination / 5) % 5;
    const feet = combination % 5;
    return `${definition.name} · 组合 ${String(combination + 1).padStart(3, '0')} / 125 · ${INTERNAL_COPY.mixmatch.faces[0][head]} × ${INTERNAL_COPY.mixmatch.faces[1][body]} × ${INTERNAL_COPY.mixmatch.faces[2][feet]}`;
  }
  if (formName === 'pulltab') return `${definition.name} · 拉条行程 ${percent}% · ${current.progress >= 0.5 ? '三个部件联动中' : '机构等待触发'}`;
  if (formName === 'iris') return `${definition.name} · 八片叶片已打开 ${percent}% · ${current.progress >= 0.5 ? '真相进入视野' : '线索仍被遮蔽'}`;
  if (formName === 'waterfall') return `${definition.name} · 第 ${current.step + 1} / 6 张「${INTERNAL_COPY.waterfall[current.step]}」· 翻落 ${percent}%`;
  if (formName === 'venetian') return `${definition.name} · ${current.progress < 0.5 ? INTERNAL_COPY.venetian[0] : INTERNAL_COPY.venetian[1]} · 换面 ${percent}%`;
  if (formName === 'dosados') return `${definition.name} · ${current.progress < 0.5 ? INTERNAL_COPY.dosados[0] : INTERNAL_COPY.dosados[2]} · 整书翻转 ${percent}%`;
  if (formName === 'jacob') return `${definition.name} · 第 ${current.step + 1} / 6 块「${INTERNAL_COPY.jacob[current.step]}」· 级联 ${percent}%`;
  if (formName === 'flexagon') return `${definition.name} · 当前面组 ${current.step + 1} / 3「${INTERNAL_COPY.flexagon[current.step]}」· 折叠 ${percent}%`;
  return `${definition.name} · ${definition.progressLabel} ${percent}%`;
}
