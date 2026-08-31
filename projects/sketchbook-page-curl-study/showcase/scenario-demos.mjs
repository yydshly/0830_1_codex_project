import { cssDegrees, curveGeometry } from './page-turn-model.mjs';

const SVG_W = 1200;
const SVG_H = 700;
const STRIPS = 12;
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const SCENES = {
  portfolio: {
    index: 'SCENE 01',
    kicker: 'CURATED PORTFOLIO',
    title: '作品集与视觉画册',
    fit: '高适配',
    summary: '让一件作品占据一个完整展开页；柔性翻页负责建立节奏、期待和物理记忆。',
    benefit: '强叙事 / 强记忆',
    risk: '固定比例内容',
    behavior: '策展注记',
    action: '显示策展注记',
    activeAction: '隐藏策展注记',
    accent: '#df5b43',
    pages: [
      { no: '01', label: 'FORM STUDY', title: '轻盈与重量', body: '一组关于日常器物的形态研究', motif: 'orb' },
      { no: '02', label: 'COLOR FIELD', title: '海岸之后', body: '颜色不是背景，而是作品的气候', motif: 'coast' },
      { no: '03', label: 'MATERIAL NOTE', title: '纸上建筑', body: '折线、阴影与可触摸的结构', motif: 'blocks' }
    ]
  },
  atlas: {
    index: 'SCENE 02',
    kicker: 'LEARNING ATLAS',
    title: '教学图鉴与探索故事',
    fit: '高适配',
    summary: '用翻页保存章节边界，再用局部观察镜把探索动作留在当前展开页。',
    benefit: '探索感 / 章节感',
    risk: '需补可读文本层',
    behavior: '移动观察镜',
    action: '开启观察镜',
    activeAction: '关闭观察镜',
    accent: '#318274',
    pages: [
      { no: '01', label: 'BOTANICAL ATLAS', title: '叶脉如何分流', body: '拖动观察镜，寻找叶片的输送网络', motif: 'leaf' },
      { no: '02', label: 'TIDAL FIELD', title: '潮池的一小时', body: '从海藻、贝壳到不断变化的水线', motif: 'tide' },
      { no: '03', label: 'NIGHT MAP', title: '昆虫的导航灯', body: '光、距离与夜间飞行路径', motif: 'flight' }
    ]
  },
  launch: {
    index: 'SCENE 03',
    kicker: 'PRODUCT REVEAL',
    title: '品牌叙事与产品发布',
    fit: '条件适配',
    summary: '把关键卖点安排成连续揭晓；翻页提供舞台转场，悬浮面板补上产品信息。',
    benefit: '高仪式感 / 高聚焦',
    risk: '不适合高频购买',
    behavior: '特性叠层',
    action: '展开产品特性',
    activeAction: '收起产品特性',
    accent: '#705cc1',
    pages: [
      { no: '01', label: 'OBJECT 01', title: '一体成形', body: '从轮廓开始，而不是从参数表开始', motif: 'product' },
      { no: '02', label: 'MATERIAL 02', title: '触感有了颜色', body: '柔光表面回应纸张自身的阴影', motif: 'material' },
      { no: '03', label: 'SYSTEM 03', title: '回到日常', body: '最后一页再交付完整的功能结构', motif: 'system' }
    ]
  },
  kiosk: {
    index: 'SCENE 04',
    kicker: 'EXHIBITION KIOSK',
    title: '展览导览与空间装置',
    fit: '条件适配',
    summary: '在大屏或展台中用自动翻页维持生命感；触摸时暂停，把控制权交还给观众。',
    benefit: '远距吸引 / 空间节奏',
    risk: '需防烧屏与误触',
    behavior: '自动导览',
    action: '开始自动导览',
    activeAction: '暂停自动导览',
    accent: '#ce8b30',
    pages: [
      { no: '01', label: 'ROOM A', title: '风从哪里来', body: '入口展厅 · 声音与悬挂装置', motif: 'wind' },
      { no: '02', label: 'ROOM B', title: '城市的切片', body: '主展厅 · 影像与档案材料', motif: 'city' },
      { no: '03', label: 'ROOM C', title: '把光带走', body: '出口展厅 · 观众共同完成的作品', motif: 'light' }
    ]
  }
};

const refs = {
  tabs: [...document.querySelectorAll('.scenario-tabs [data-scene]')],
  stage: document.querySelector('#scenario-stage'),
  book: document.querySelector('#scene-book'),
  kicker: document.querySelector('#scene-kicker'),
  counter: document.querySelector('#scene-counter'),
  prev: document.querySelector('#scene-prev'),
  next: document.querySelector('#scene-next'),
  status: document.querySelector('#scene-status'),
  fit: document.querySelector('#scene-fit'),
  index: document.querySelector('#scene-index'),
  title: document.querySelector('#scene-title'),
  summary: document.querySelector('#scene-summary'),
  benefit: document.querySelector('#scene-benefit'),
  risk: document.querySelector('#scene-risk'),
  behavior: document.querySelector('#scene-behavior'),
  action: document.querySelector('#scene-action'),
  inspector: document.querySelector('#scene-inspector'),
  feature: document.querySelector('#scene-feature-panel'),
  curation: document.querySelector('#scene-curation-note'),
  autoplay: document.querySelector('#scene-autoplay-indicator')
};

const state = {
  scene: 'portfolio',
  page: 0,
  turn: null,
  frame: null,
  actionOn: false,
  kioskTimer: null
};

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function motifMarkup(kind, accent) {
  const ink = '#17383a';
  if (kind === 'orb') return `<circle cx="870" cy="355" r="180" fill="${accent}"/><circle cx="990" cy="245" r="105" fill="#f3b35d" fill-opacity=".84"/><path d="M670 560C820 450 1020 490 1150 330" fill="none" stroke="${ink}" stroke-width="5"/>`;
  if (kind === 'coast') return `<path d="M600 520C720 320 810 590 930 355S1100 260 1200 175V700H600Z" fill="#9ccbc5"/><circle cx="970" cy="200" r="95" fill="${accent}"/><path d="M625 540C790 430 960 555 1170 350" fill="none" stroke="${ink}" stroke-width="4"/>`;
  if (kind === 'blocks') return `<g transform="translate(690 210)"><path d="M0 240L145 145 290 230 145 330Z" fill="${accent}"/><path d="M145 145V330L290 230V60Z" fill="#e7a55a"/><path d="M290 230L420 140V330L290 420Z" fill="${ink}" opacity=".78"/></g>`;
  if (kind === 'leaf') return `<path d="M645 545C660 225 880 155 1125 145 1080 420 900 585 645 545Z" fill="#b7d9bf" stroke="${accent}" stroke-width="5"/><path d="M665 530C790 400 905 295 1085 170M810 395L775 245M905 305L1015 375" fill="none" stroke="${accent}" stroke-width="4"/>`;
  if (kind === 'tide') return `<g fill="none" stroke="${accent}"><path d="M620 390C735 260 815 510 925 365S1080 290 1180 370" stroke-width="9"/><path d="M625 450C750 330 850 570 960 430S1100 350 1180 420" stroke-width="3" opacity=".5"/></g><g fill="#df8b67"><circle cx="760" cy="250" r="45"/><circle cx="1030" cy="510" r="28"/></g>`;
  if (kind === 'flight') return `<g fill="none" stroke="${accent}" stroke-width="3"><circle cx="920" cy="350" r="185"/><circle cx="920" cy="350" r="120"/><path d="M650 500C780 440 720 220 895 330S1080 460 1150 200" stroke-dasharray="9 12"/></g><circle cx="920" cy="350" r="34" fill="#efbd62"/>`;
  if (kind === 'product') return `<path d="M820 155C925 120 1025 175 1050 285V520H745V285C760 220 780 175 820 155Z" fill="${accent}"/><ellipse cx="897" cy="288" rx="86" ry="105" fill="#d8d1fa"/><path d="M690 555H1120" stroke="${ink}" stroke-width="4"/>`;
  if (kind === 'material') return `<defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d9d1ff"/><stop offset=".48" stop-color="${accent}"/><stop offset="1" stop-color="#30255c"/></linearGradient></defs><path d="M650 540C710 150 880 125 1140 205L1080 570Z" fill="url(#m)"/><circle cx="845" cy="300" r="105" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="3"/>`;
  if (kind === 'system') return `<g stroke="${accent}" fill="#f7efdc" stroke-width="4"><path d="M700 350H1110M810 350V220M990 350V500"/><circle cx="700" cy="350" r="35"/><circle cx="810" cy="220" r="55"/><circle cx="900" cy="350" r="45"/><circle cx="990" cy="500" r="55"/><circle cx="1110" cy="350" r="35"/></g>`;
  if (kind === 'wind') return `<g fill="none" stroke="${accent}" stroke-linecap="round"><path d="M650 300C780 180 890 420 1125 235" stroke-width="12"/><path d="M630 410C820 300 930 520 1170 345" stroke-width="5" opacity=".55"/></g><circle cx="1010" cy="180" r="70" fill="#e9b853"/>`;
  if (kind === 'city') return `<g fill="${accent}"><path d="M670 540V330H770V540ZM790 540V190H900V540ZM920 540V285H1010V540ZM1030 540V140H1140V540Z"/></g><g stroke="#f7efdc" opacity=".7"><path d="M815 240H875M815 285H875M1055 195H1115M1055 240H1115"/></g>`;
  return `<defs><radialGradient id="l"><stop stop-color="#fff"/><stop offset=".22" stop-color="#f6cb72"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs><circle cx="900" cy="350" r="265" fill="url(#l)"/><path d="M650 520L900 205 1150 520Z" fill="none" stroke="${accent}" stroke-width="4"/>`;
}

function spreadUrl(scene, page) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_W} ${SVG_H}">
    <rect width="1200" height="700" fill="#f7efdc"/><path d="M600 0V700" stroke="#725f49" stroke-opacity=".16"/>
    <text x="66" y="72" fill="#657476" font-family="monospace" font-size="15" letter-spacing="4">${escapeXml(page.label)}</text>
    <text x="1134" y="72" fill="#657476" font-family="monospace" font-size="15" text-anchor="end">${page.no} / 03</text>
    <text x="66" y="270" fill="#17383a" font-family="Georgia,serif" font-size="64">${escapeXml(page.title)}</text>
    <text x="70" y="330" fill="#657476" font-family="Arial,sans-serif" font-size="20">${escapeXml(page.body)}</text>
    <rect x="70" y="530" width="118" height="34" rx="17" fill="${scene.accent}"/><text x="129" y="552" text-anchor="middle" fill="#fff" font-family="monospace" font-size="12">OPEN STUDY</text>
    ${motifMarkup(page.motif, scene.accent)}
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function currentScene() { return SCENES[state.scene]; }
function pageUrls() { const scene = currentScene(); return scene.pages.map((page) => spreadUrl(scene, page)); }

function element(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function setSlice(node, url, width, height, x) {
  node.style.backgroundImage = `url("${url}")`;
  node.style.backgroundSize = `${width}px ${height}px`;
  node.style.backgroundPosition = `${-x}px 0`;
}

function half(side, url, width, height) {
  const node = element('div', `scene-half ${side}`);
  setSlice(node, url, width, height, side === 'left' ? 0 : width / 2);
  node.setAttribute('aria-hidden', 'true');
  return node;
}

function curvedLeaf(turn, urls, width, height) {
  const curl = element('div', `scene-turn-curved ${turn.direction}`);
  const stripWidth = width / 2 / STRIPS;
  let host = curl;
  turn.strips = [];
  for (let index = 0; index < STRIPS; index += 1) {
    const strip = element('div', 'scene-strip');
    strip.style.width = `${stripWidth + 0.5}px`;
    const front = element('div', 'scene-face front');
    const back = element('div', 'scene-face back');
    const frontX = turn.direction === 'next'
      ? width / 2 + index * stripWidth
      : width / 2 - (index + 1) * stripWidth;
    const backX = turn.direction === 'next'
      ? width / 2 - (index + 1) * stripWidth
      : width / 2 + index * stripWidth;
    setSlice(front, urls[turn.from], width, height, frontX);
    setSlice(back, urls[turn.to], width, height, backX);
    front.append(element('i', 'scene-strip-light'));
    back.append(element('i', 'scene-strip-light'));
    strip.append(front, back);
    host.append(strip);
    host = strip;
    turn.strips.push(strip);
  }
  return curl;
}

function updatePanel() {
  const scene = currentScene();
  refs.stage.dataset.scene = state.scene;
  refs.kicker.textContent = scene.kicker;
  refs.counter.textContent = `${String(state.page + 1).padStart(2, '0')} / ${String(scene.pages.length).padStart(2, '0')}`;
  refs.fit.textContent = scene.fit;
  refs.index.textContent = scene.index;
  refs.title.textContent = scene.title;
  refs.summary.textContent = scene.summary;
  refs.benefit.textContent = scene.benefit;
  refs.risk.textContent = scene.risk;
  refs.behavior.textContent = scene.behavior;
  refs.action.textContent = state.actionOn ? scene.activeAction : scene.action;
  refs.action.setAttribute('aria-pressed', String(state.actionOn));
  refs.prev.disabled = Boolean(state.turn) || state.page === 0;
  refs.next.disabled = Boolean(state.turn) || state.page === scene.pages.length - 1;
  refs.tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.scene === state.scene)));
  refs.curation.setAttribute('aria-hidden', String(!(state.scene === 'portfolio' && state.actionOn)));
  refs.inspector.setAttribute('aria-hidden', String(!(state.scene === 'atlas' && state.actionOn)));
  refs.feature.setAttribute('aria-hidden', String(!(state.scene === 'launch' && state.actionOn)));
  refs.autoplay.setAttribute('aria-hidden', String(!(state.scene === 'kiosk' && state.actionOn)));
  refs.stage.classList.toggle('is-curated', state.scene === 'portfolio' && state.actionOn);
  refs.stage.classList.toggle('is-inspecting', state.scene === 'atlas' && state.actionOn);
  refs.stage.classList.toggle('is-featured', state.scene === 'launch' && state.actionOn);
  refs.stage.classList.toggle('is-playing', state.scene === 'kiosk' && state.actionOn);
}

function render() {
  const scene = currentScene();
  const urls = pageUrls();
  const width = Math.max(320, refs.book.clientWidth);
  const height = width / (SVG_W / SVG_H);
  refs.book.replaceChildren();
  if (!state.turn) {
    refs.book.append(half('left', urls[state.page], width, height), half('right', urls[state.page], width, height));
  } else {
    const left = state.turn.direction === 'next' ? state.turn.from : state.turn.to;
    const right = state.turn.direction === 'next' ? state.turn.to : state.turn.from;
    refs.book.append(half('left', urls[left], width, height), half('right', urls[right], width, height));
    state.turn.element = curvedLeaf(state.turn, urls, width, height);
    refs.book.append(state.turn.element);
  }
  updatePanel();
  if (state.turn) applyTurn(state.turn.progress);
  refs.book.setAttribute('aria-label', `${scene.title}，第 ${state.page + 1} 页；点击左右半页或使用方向键翻页`);
}

function applyTurn(progress) {
  if (!state.turn?.element) return;
  const geometry = curveGeometry(progress, STRIPS);
  const sign = state.turn.direction === 'next' ? -1 : 1;
  state.turn.progress = geometry.progress;
  state.turn.element.style.setProperty('--scene-root', cssDegrees(sign * geometry.rootAngle));
  state.turn.element.style.setProperty('--scene-segment', cssDegrees(-sign * geometry.segmentAngle));
  state.turn.strips.forEach((strip, index) => {
    const tangent = geometry.rootAngle - index * geometry.segmentAngle;
    const facing = Math.abs(Math.cos(tangent));
    strip.style.setProperty('--scene-shade', ((1 - facing) * 0.52).toFixed(3));
    strip.style.setProperty('--scene-glow', (facing * 0.13).toFixed(3));
  });
}

function finishTurn() {
  if (!state.turn) return;
  state.page = state.turn.to;
  state.turn = null;
  render();
  refs.status.textContent = `${currentScene().pages[state.page].title} · 第 ${state.page + 1} 页`;
}

function turnPage(direction) {
  if (state.turn) return false;
  const to = state.page + (direction === 'next' ? 1 : -1);
  if (to < 0 || to >= currentScene().pages.length) {
    refs.status.textContent = direction === 'next' ? '已经是本场景最后一页' : '已经是本场景第一页';
    return false;
  }
  state.turn = { direction, from: state.page, to, progress: 0, element: null, strips: [] };
  render();
  refs.status.textContent = direction === 'next' ? '正在揭晓下一页' : '正在返回上一页';
  if (motionQuery.matches) {
    applyTurn(1);
    finishTurn();
    return true;
  }
  const started = performance.now();
  function frame(now) {
    if (!state.turn) return;
    const raw = Math.min(1, (now - started) / 760);
    const eased = 1 - Math.pow(1 - raw, 3);
    applyTurn(eased);
    if (raw >= 1) {
      state.frame = null;
      finishTurn();
    } else {
      state.frame = requestAnimationFrame(frame);
    }
  }
  state.frame = requestAnimationFrame(frame);
  return true;
}

function stopKiosk() {
  if (state.kioskTimer !== null) clearInterval(state.kioskTimer);
  state.kioskTimer = null;
  if (state.scene === 'kiosk') state.actionOn = false;
}

function selectScene(name) {
  if (!SCENES[name] || name === state.scene) return;
  if (state.frame !== null) cancelAnimationFrame(state.frame);
  stopKiosk();
  state.turn = null;
  state.scene = name;
  state.page = 0;
  state.actionOn = false;
  render();
  refs.status.textContent = `${currentScene().title}已就绪 · 点击纸页开始`;
}

function toggleAction() {
  const scene = currentScene();
  if (state.scene === 'kiosk') {
    if (state.actionOn) {
      stopKiosk();
      refs.status.textContent = '自动导览已暂停';
    } else if (motionQuery.matches) {
      refs.status.textContent = '系统偏好减少动态 · 请手动翻页';
    } else {
      state.actionOn = true;
      state.kioskTimer = window.setInterval(() => {
        if (!turnPage('next') && !state.turn) {
          state.page = 0;
          render();
          refs.status.textContent = '自动导览循环回到入口';
        }
      }, 1850);
      refs.status.textContent = '自动导览中 · 触摸纸页会暂停';
    }
  } else {
    state.actionOn = !state.actionOn;
    refs.status.textContent = `${scene.behavior}${state.actionOn ? '已开启' : '已关闭'}`;
  }
  updatePanel();
}

refs.tabs.forEach((tab, tabIndex) => {
  tab.addEventListener('click', () => selectScene(tab.dataset.scene));
  tab.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const target = refs.tabs[(tabIndex + offset + refs.tabs.length) % refs.tabs.length];
    selectScene(target.dataset.scene);
    target.focus();
  });
});

refs.prev.addEventListener('click', () => turnPage('prev'));
refs.next.addEventListener('click', () => turnPage('next'));
refs.action.addEventListener('click', toggleAction);
refs.book.addEventListener('click', (event) => {
  if (state.scene === 'kiosk' && state.actionOn) {
    stopKiosk();
    updatePanel();
    refs.status.textContent = '观众已接管 · 自动导览暂停';
  }
  const rect = refs.book.getBoundingClientRect();
  turnPage(event.clientX < rect.left + rect.width / 2 ? 'prev' : 'next');
});
refs.book.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    turnPage(event.key === 'ArrowRight' ? 'next' : 'prev');
  }
});
refs.stage.addEventListener('pointermove', (event) => {
  if (state.scene !== 'atlas' || !state.actionOn) return;
  const shell = refs.book.parentElement.getBoundingClientRect();
  const left = Math.max(8, Math.min(92, ((event.clientX - shell.left) / shell.width) * 100));
  const top = Math.max(10, Math.min(88, ((event.clientY - shell.top) / shell.height) * 100));
  refs.inspector.style.left = `${left}%`;
  refs.inspector.style.top = `${top}%`;
});
window.addEventListener('resize', () => { if (!state.turn) render(); });

render();
refs.status.textContent = '作品集已就绪 · 点击右页开始';

if (document.documentElement.classList.contains('is-fallback')) {
  [...refs.tabs, refs.prev, refs.next, refs.action].forEach((control) => { control.disabled = true; });
  refs.status.textContent = '静态降级视图 · 场景交互不可用';
}
