import {
  cssDegrees,
  curveGeometry,
  formatDegrees,
  normalizeStripCount,
  progressFromDrag,
  shouldCommit
} from './page-turn-model.mjs';

const SVG_W = 1200;
const SVG_H = 700;
const MAGNIFICATION = 2.2;
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const params = new URLSearchParams(window.location.search);

const PAGES = [
  {
    title: '结构差异',
    kicker: 'BASELINE / CURL',
    leftTitle: '一张硬页',
    leftBody: '单个平面围绕书脊旋转。\n稳定、清楚、适合阅读。',
    rightTitle: '十八段切线',
    rightBody: '把同一个翻角分给条带链。\n纸张开始拥有宽度方向的曲率。',
    accent: '#e7593f',
    motif: 'arc'
  },
  {
    title: '几何模型',
    kicker: 'THETA / BETA / DELTA',
    leftTitle: '进度控制位置',
    leftBody: 'θ = πt\n从 0° 平稳走向 180°。',
    rightTitle: '隆起控制柔软',
    rightBody: 'β = 0.60 sin(πt)\n只在翻页中段出现。',
    accent: '#2f7771',
    motif: 'wave'
  },
  {
    title: '适用场景',
    kicker: 'CONTEXT / INTENT',
    leftTitle: '值得使用',
    leftBody: '作品集 · 数字展览\n品牌档案 · 儿童故事',
    rightTitle: '谨慎使用',
    rightBody: '长文阅读 · 数据后台\n高频工具 · 低性能设备',
    accent: '#cc8b32',
    motif: 'tiles'
  },
  {
    title: '扩展路线',
    kicker: 'SYSTEM / SCALE',
    leftTitle: '先变成模块',
    leftBody: 'Controller / Renderer\nContent / Quality Budget',
    rightTitle: '再变得真实',
    rightBody: '二维抓取 · 自适应条带\nWebGL 网格 · 编辑器',
    accent: '#6d63a8',
    motif: 'nodes'
  }
];

const refs = {
  root: document.documentElement,
  stage: document.querySelector('#stage'),
  bookShell: document.querySelector('#book-shell'),
  book: document.querySelector('#book'),
  modeButtons: [...document.querySelectorAll('[data-mode]')],
  stripSelect: document.querySelector('#strip-count'),
  magnifierToggle: document.querySelector('#magnifier-toggle'),
  magnifier: document.querySelector('#magnifier'),
  magnifierContent: document.querySelector('#magnifier-content'),
  zoomOut: document.querySelector('#zoom-out'),
  zoomIn: document.querySelector('#zoom-in'),
  zoomReadout: document.querySelector('#zoom-readout'),
  autoDemo: document.querySelector('#auto-demo'),
  resetButton: document.querySelector('#reset-button'),
  themeToggle: document.querySelector('#theme-toggle'),
  themeLabel: document.querySelector('.theme-label'),
  prevButton: document.querySelector('#prev-button'),
  nextButton: document.querySelector('#next-button'),
  pageNumber: document.querySelector('#page-number'),
  pageTotal: document.querySelector('#page-total'),
  pageTitle: document.querySelector('#page-title'),
  status: document.querySelector('#turn-status'),
  modelLabel: document.querySelector('#model-label'),
  progress: document.querySelector('#metric-progress'),
  theta: document.querySelector('#metric-theta'),
  beta: document.querySelector('#metric-beta'),
  faces: document.querySelector('#metric-faces'),
  curvePath: document.querySelector('#curve-path'),
  dragHint: document.querySelector('#drag-hint')
};

const state = {
  index: Math.max(0, Math.min(PAGES.length - 1, Number(params.get('page')) || 0)),
  mode: params.get('mode') === 'rigid' ? 'rigid' : 'curved',
  strips: normalizeStripCount(params.get('strips')),
  turn: null,
  drag: null,
  animationFrame: null,
  magnifierOn: params.get('magnifier') === '1',
  loupeX: null,
  loupeY: null,
  loupeDrag: null,
  view: { zoom: 1, tiltX: 1.5, tiltY: 0 },
  demoTimer: null,
  demoCount: 0,
  demoDirection: 'next',
  fallback: params.get('fallback') === '1' || !CSS.supports('transform-style', 'preserve-3d')
};

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function textLines(text, x, y, size, weight, fill, anchor) {
  const lines = String(text).split('\n');
  return lines.map(function (line, index) {
    return '<text x="' + x + '" y="' + (y + index * size * 1.45) + '" fill="' + fill +
      '" font-family="ui-sans-serif, system-ui, sans-serif" font-size="' + size +
      '" font-weight="' + weight + '" text-anchor="' + (anchor || 'start') + '">' +
      escapeXml(line) + '</text>';
  }).join('');
}

function motifMarkup(page) {
  if (page.motif === 'wave') {
    return '<path d="M650 470 C760 270 900 580 1140 335" fill="none" stroke="' + page.accent +
      '" stroke-width="5"/><path d="M650 505 C800 335 920 610 1140 405" fill="none" stroke="' +
      page.accent + '" stroke-opacity=".26" stroke-width="2"/>';
  }
  if (page.motif === 'tiles') {
    return '<g fill="none" stroke="' + page.accent + '" stroke-width="3">' +
      '<rect x="700" y="390" width="110" height="110"/><rect x="830" y="340" width="110" height="160"/>' +
      '<rect x="960" y="300" width="110" height="200"/></g>';
  }
  if (page.motif === 'nodes') {
    return '<g stroke="' + page.accent + '" stroke-width="3" fill="#f7efdc">' +
      '<path d="M690 450H1110M800 450V350M1000 450V550"/>' +
      '<circle cx="690" cy="450" r="18"/><circle cx="800" cy="350" r="18"/>' +
      '<circle cx="900" cy="450" r="18"/><circle cx="1000" cy="550" r="18"/>' +
      '<circle cx="1110" cy="450" r="18"/></g>';
  }
  return '<path d="M640 565 C750 270 990 235 1165 100" fill="none" stroke="' + page.accent +
    '" stroke-width="8"/><circle cx="1030" cy="210" r="145" fill="none" stroke="' +
    page.accent + '" stroke-opacity=".28" stroke-width="2"/>';
}

function spreadUrl(page, index) {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">',
    '<defs><pattern id="grain" width="36" height="36" patternUnits="userSpaceOnUse">',
    '<circle cx="4" cy="8" r="1" fill="#4a3924" opacity=".045"/>',
    '<circle cx="26" cy="26" r=".8" fill="#4a3924" opacity=".035"/></pattern></defs>',
    '<rect width="1200" height="700" fill="#f7efdc"/><rect width="1200" height="700" fill="url(#grain)"/>',
    '<path d="M600 0V700" stroke="#7c674b" stroke-opacity=".14"/>',
    '<text x="66" y="70" fill="#7e715f" font-family="ui-monospace, monospace" font-size="15" letter-spacing="3">',
    escapeXml(page.kicker), '</text>',
    '<text x="1134" y="70" fill="#7e715f" font-family="ui-monospace, monospace" font-size="15" text-anchor="end">0',
    String(index + 1).padStart(2, '0'), '</text>',
    textLines(page.leftTitle, 66, 260, 58, 520, '#1c3337'),
    textLines(page.leftBody, 70, 350, 20, 430, '#647071'),
    textLines(page.rightTitle, 666, 260, 58, 520, '#1c3337'),
    textLines(page.rightBody, 670, 350, 20, 430, '#647071'),
    motifMarkup(page),
    '<circle cx="85" cy="600" r="26" fill="none" stroke="' + page.accent + '" stroke-width="3"/>',
    '<path d="M70 600H100M85 585V615" stroke="' + page.accent + '" stroke-width="2"/>',
    '</svg>'
  ].join('');
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const pageUrls = PAGES.map(spreadUrl);

function createElement(tag, className) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
}

function setSpreadSlice(element, pageIndex, fullWidth, fullHeight, sourceX) {
  element.style.backgroundImage = 'url("' + pageUrls[pageIndex] + '")';
  element.style.backgroundSize = fullWidth + 'px ' + fullHeight + 'px';
  element.style.backgroundPosition = (-sourceX) + 'px 0';
}

function createHalf(side, pageIndex, fullWidth, fullHeight) {
  const half = createElement('div', 'book-half book-half--' + side);
  setSpreadSlice(half, pageIndex, fullWidth, fullHeight, side === 'left' ? 0 : fullWidth / 2);
  half.setAttribute('aria-hidden', 'true');
  return half;
}

function createRigidLeaf(turn, fullWidth, fullHeight) {
  const leaf = createElement('div', 'turn-rigid ' + turn.direction);
  const front = createElement('div', 'rigid-face front');
  const back = createElement('div', 'rigid-face back');
  const frontX = turn.direction === 'next' ? fullWidth / 2 : 0;
  const backX = turn.direction === 'next' ? 0 : fullWidth / 2;
  setSpreadSlice(front, turn.from, fullWidth, fullHeight, frontX);
  setSpreadSlice(back, turn.to, fullWidth, fullHeight, backX);
  front.append(createElement('div', 'rigid-shade'));
  back.append(createElement('div', 'rigid-shade'));
  leaf.append(front, back);
  return leaf;
}

function createCurvedLeaf(turn, fullWidth, fullHeight) {
  const curl = createElement('div', 'turn-curved ' + turn.direction);
  const stripWidth = fullWidth / 2 / state.strips;
  let host = curl;
  turn.stripElements = [];

  for (let index = 0; index < state.strips; index += 1) {
    const strip = createElement('div', 'strip');
    strip.style.width = (stripWidth + 0.45) + 'px';

    const front = createElement('div', 'strip-face front');
    const back = createElement('div', 'strip-face back');
    let frontX;
    let backX;

    if (turn.direction === 'next') {
      frontX = fullWidth / 2 + index * stripWidth;
      backX = fullWidth / 2 - (index + 1) * stripWidth;
    } else {
      frontX = fullWidth / 2 - (index + 1) * stripWidth;
      backX = fullWidth / 2 + index * stripWidth;
    }

    setSpreadSlice(front, turn.from, fullWidth, fullHeight, frontX);
    setSpreadSlice(back, turn.to, fullWidth, fullHeight, backX);
    front.append(createElement('div', 'strip-light'));
    back.append(createElement('div', 'strip-light'));
    strip.append(front, back);
    host.append(strip);
    host = strip;
    turn.stripElements.push(strip);
  }
  return curl;
}

function canTurn(direction) {
  return direction === 'next' ? state.index < PAGES.length - 1 : state.index > 0;
}

function cancelAnimation() {
  if (state.animationFrame !== null) {
    cancelAnimationFrame(state.animationFrame);
    state.animationFrame = null;
  }
}

function applyView() {
  refs.book.style.setProperty('--book-zoom', state.view.zoom.toFixed(2));
  refs.book.style.setProperty('--tilt-x', state.view.tiltX.toFixed(2) + 'deg');
  refs.book.style.setProperty('--tilt-y', state.view.tiltY.toFixed(2) + 'deg');
  refs.zoomReadout.textContent = Math.round(state.view.zoom * 100) + '%';
  refs.zoomOut.disabled = state.fallback || state.view.zoom <= 0.82;
  refs.zoomIn.disabled = state.fallback || state.view.zoom >= 1.22;
}

function updateNavigation() {
  refs.prevButton.disabled = state.index === 0 && !state.turn;
  refs.nextButton.disabled = state.index === PAGES.length - 1 && !state.turn;
  refs.pageNumber.textContent = String(state.index + 1).padStart(2, '0');
  refs.pageTotal.textContent = String(PAGES.length).padStart(2, '0');
  refs.pageTitle.textContent = state.turn ? PAGES[state.turn.to].title : PAGES[state.index].title;
}

function render() {
  const width = Math.max(320, refs.book.clientWidth || refs.bookShell.clientWidth);
  const height = width / (SVG_W / SVG_H);
  refs.book.replaceChildren();
  refs.book.classList.add('is-rendered');

  if (!state.turn) {
    refs.book.append(
      createHalf('left', state.index, width, height),
      createHalf('right', state.index, width, height)
    );
  } else {
    const leftIndex = state.turn.direction === 'next' ? state.turn.from : state.turn.to;
    const rightIndex = state.turn.direction === 'next' ? state.turn.to : state.turn.from;
    refs.book.append(
      createHalf('left', leftIndex, width, height),
      createHalf('right', rightIndex, width, height)
    );
    state.turn.element = state.mode === 'rigid'
      ? createRigidLeaf(state.turn, width, height)
      : createCurvedLeaf(state.turn, width, height);
    refs.book.append(state.turn.element);
  }

  updateControls();
  updateNavigation();
  applyProgress(state.turn ? state.turn.progress : 0);
}

function updateControls() {
  refs.modeButtons.forEach(function (button) {
    button.setAttribute('aria-pressed', String(button.dataset.mode === state.mode));
  });
  refs.stripSelect.value = String(state.strips);
  refs.stripSelect.disabled = state.mode === 'rigid' || state.fallback;
  refs.magnifierToggle.setAttribute('aria-pressed', String(state.magnifierOn));
  refs.magnifier.setAttribute('aria-hidden', String(!state.magnifierOn));
  refs.magnifier.tabIndex = state.magnifierOn ? 0 : -1;
  refs.autoDemo.setAttribute('aria-pressed', String(state.demoTimer !== null));
  refs.autoDemo.innerHTML = state.demoTimer === null
    ? '<span aria-hidden="true">▶</span> 播放演示'
    : '<span aria-hidden="true">■</span> 停止演示';
  refs.modelLabel.textContent = state.mode === 'curved'
    ? 'CURVED · ' + state.strips + ' STRIPS'
    : 'RIGID · 1 PLANE';
  applyView();
}

function updateTelemetry(progress) {
  const geometry = curveGeometry(progress, state.strips);
  const activeBeta = state.mode === 'curved' ? geometry.beta : 0;
  refs.progress.textContent = geometry.progress.toFixed(2);
  refs.theta.textContent = formatDegrees(geometry.theta);
  refs.beta.textContent = formatDegrees(activeBeta);
  refs.faces.textContent = state.mode === 'curved' ? String(state.strips * 2) : '2';

  const lift = state.mode === 'curved' ? (activeBeta / 0.6) * 35 : 0;
  refs.curvePath.setAttribute(
    'd',
    'M2 50 C66 50 82 ' + (50 - lift).toFixed(1) + ' 130 ' + (50 - lift).toFixed(1) +
    ' S215 50 258 50'
  );
}

function applyProgress(progress) {
  const geometry = curveGeometry(progress, state.strips);
  if (state.turn && state.turn.element) {
    state.turn.progress = geometry.progress;
    const directionSign = state.turn.direction === 'next' ? -1 : 1;
    state.turn.element.style.setProperty('--signed-root-angle', cssDegrees(directionSign * geometry.rootAngle));
    state.turn.element.style.setProperty('--signed-segment-angle', cssDegrees(-directionSign * geometry.segmentAngle));
    state.turn.element.style.setProperty('--shade', (Math.sin(Math.PI * geometry.progress) * 0.78).toFixed(3));

    if (state.mode === 'curved' && state.turn.stripElements) {
      state.turn.stripElements.forEach(function (strip, index) {
        const tangent = geometry.rootAngle - index * geometry.segmentAngle;
        const facing = Math.abs(Math.cos(tangent));
        strip.style.setProperty('--shade-a', ((1 - facing) * 0.58).toFixed(3));
        strip.style.setProperty('--glow', (facing * 0.18).toFixed(3));
      });
    }
  }
  updateTelemetry(geometry.progress);
  scheduleLoupeSync();
}

function announce(message) {
  refs.status.textContent = message;
}

function beginTurn(direction, progress) {
  cancelAnimation();
  if (!canTurn(direction)) {
    announce(direction === 'next' ? '已经是最后一页' : '已经是第一页');
    return false;
  }
  state.turn = {
    direction: direction,
    from: state.index,
    to: state.index + (direction === 'next' ? 1 : -1),
    progress: progress || 0,
    element: null,
    stripElements: []
  };
  if (state.magnifierOn) {
    const width = refs.book.clientWidth || 800;
    const height = refs.book.clientHeight || 460;
    state.loupeX = width * (direction === 'next' ? 0.84 : 0.16);
    state.loupeY = height * 0.24;
  }
  render();
  announce('正在' + (direction === 'next' ? '向后' : '向前') + '翻页');
  return true;
}

function finishTurn(target) {
  if (!state.turn) return;
  const destination = state.turn.to;
  if (target === 1) state.index = destination;
  state.turn = null;
  render();
  announce(target === 1 ? '已翻到第 ' + (state.index + 1) + ' 页' : '未越过阈值 · 已回弹');
}

function settleTurn(target, initialVelocity) {
  if (!state.turn) return;
  cancelAnimation();
  if (motionQuery.matches) {
    applyProgress(target);
    finishTurn(target);
    return;
  }

  let velocity = Number(initialVelocity) || 0;
  let lastTime = performance.now();
  const stiffness = target === 1 ? 170 : 150;
  const damping = target === 1 ? 26 : 24;

  function frame(now) {
    if (!state.turn) return;
    const dt = Math.min(0.032, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;
    const distance = state.turn.progress - target;
    velocity += (-stiffness * distance - damping * velocity) * dt;
    state.turn.progress += velocity * dt;
    state.turn.progress = Math.max(-0.035, Math.min(1.035, state.turn.progress));
    applyProgress(state.turn.progress);

    if (Math.abs(state.turn.progress - target) < 0.002 && Math.abs(velocity) < 0.025) {
      applyProgress(target);
      state.animationFrame = null;
      finishTurn(target);
      return;
    }
    state.animationFrame = requestAnimationFrame(frame);
  }
  state.animationFrame = requestAnimationFrame(frame);
}

function step(direction) {
  if (state.turn) {
    const target = state.turn.progress >= 0.5 ? 1 : 0;
    finishTurn(target);
  }
  if (beginTurn(direction, 0)) settleTurn(1, 0);
}

function stopAutoDemo(message) {
  if (state.demoTimer !== null) {
    clearInterval(state.demoTimer);
    state.demoTimer = null;
  }
  state.demoCount = 0;
  refs.book.classList.remove('is-demoing');
  updateControls();
  if (message) announce(message);
}

function autoDemoStep() {
  if (state.turn) return;
  if (!canTurn(state.demoDirection)) {
    state.demoDirection = state.demoDirection === 'next' ? 'prev' : 'next';
  }
  step(state.demoDirection);
  state.demoCount += 1;
  if (state.demoCount >= 6) stopAutoDemo('自动演示完成 · 现在可以自己拖动纸页');
}

function startAutoDemo() {
  if (motionQuery.matches) {
    announce('系统偏好减少动态 · 自动演示未启动');
    return;
  }
  if (state.demoTimer !== null) {
    stopAutoDemo('自动演示已停止');
    return;
  }
  state.demoDirection = canTurn('next') ? 'next' : 'prev';
  state.demoCount = 0;
  refs.book.classList.add('is-demoing');
  state.demoTimer = window.setInterval(autoDemoStep, 1350);
  updateControls();
  announce('自动演示中 · 观察曲面、背面与光影');
  autoDemoStep();
}

let loupeSyncFrame = null;
function scheduleLoupeSync() {
  if (!state.magnifierOn || loupeSyncFrame !== null) return;
  loupeSyncFrame = requestAnimationFrame(function () {
    loupeSyncFrame = null;
    syncLoupe();
  });
}

function syncLoupe() {
  refs.magnifier.classList.toggle('is-on', state.magnifierOn);
  if (!state.magnifierOn) {
    refs.magnifierContent.replaceChildren();
    return;
  }

  const bookRect = refs.book.getBoundingClientRect();
  const shellRect = refs.bookShell.getBoundingClientRect();
  const width = refs.book.clientWidth;
  const height = refs.book.clientHeight;
  if (!width || !height) return;

  if (state.loupeX === null) {
    state.loupeX = width * 0.73;
    state.loupeY = height * 0.35;
  }
  state.loupeX = Math.max(0, Math.min(width, state.loupeX));
  state.loupeY = Math.max(0, Math.min(height, state.loupeY));

  const clone = refs.book.cloneNode(true);
  clone.removeAttribute('id');
  clone.removeAttribute('tabindex');
  clone.setAttribute('aria-hidden', 'true');
  clone.style.width = width + 'px';
  clone.style.height = height + 'px';
  refs.magnifierContent.replaceChildren(clone);

  const lensSize = refs.magnifier.querySelector('.magnifier__glass').clientWidth || 140;
  const radius = lensSize / 2;
  const shellX = bookRect.left - shellRect.left + state.loupeX;
  const shellY = bookRect.top - shellRect.top + state.loupeY;
  refs.magnifier.style.transform =
    'translate3d(' + (shellX - radius).toFixed(1) + 'px,' + (shellY - radius).toFixed(1) + 'px,0) rotate(-12deg)';
  refs.magnifierContent.style.width = width + 'px';
  refs.magnifierContent.style.height = height + 'px';
  refs.magnifierContent.style.transform =
    'translate(' + (radius - state.loupeX * MAGNIFICATION).toFixed(1) + 'px,' +
    (radius - state.loupeY * MAGNIFICATION).toFixed(1) + 'px) scale(' + MAGNIFICATION + ')';
}

function setTheme(theme, persist) {
  const next = theme === 'dark' ? 'dark' : 'light';
  refs.root.dataset.theme = next;
  const isDark = next === 'dark';
  refs.themeToggle.setAttribute('aria-pressed', String(isDark));
  refs.themeToggle.setAttribute('aria-label', isDark ? '切换浅色主题' : '切换深色主题');
  refs.themeLabel.textContent = isDark ? '浅色' : '深色';
  if (persist) {
    try { localStorage.setItem('page-curl-theme', next); } catch { /* storage is optional */ }
  }
}

function initializeTheme() {
  let stored = null;
  try { stored = localStorage.getItem('page-curl-theme'); } catch { /* storage is optional */ }
  setTheme(params.get('theme') || stored || 'light', false);
}

function setFallback() {
  state.fallback = true;
  refs.root.classList.add('is-fallback');
  refs.modeButtons.forEach(function (button) { button.disabled = true; });
  refs.stripSelect.disabled = true;
  refs.magnifierToggle.disabled = true;
  refs.zoomOut.disabled = true;
  refs.zoomIn.disabled = true;
  refs.autoDemo.disabled = true;
  refs.resetButton.disabled = true;
  refs.prevButton.disabled = true;
  refs.nextButton.disabled = true;
  refs.modelLabel.textContent = 'STATIC · FALLBACK';
  refs.faces.textContent = '0';
  announce('静态降级视图');
}

refs.modeButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    if (state.mode === button.dataset.mode) return;
    if (state.demoTimer !== null) stopAutoDemo();
    cancelAnimation();
    state.turn = null;
    state.mode = button.dataset.mode;
    render();
    announce(state.mode === 'curved' ? '已切换柔性条带' : '已切换刚性页');
  });
});

refs.stripSelect.addEventListener('change', function () {
  if (state.demoTimer !== null) stopAutoDemo();
  state.strips = normalizeStripCount(refs.stripSelect.value);
  if (state.turn) render();
  else updateControls();
  updateTelemetry(state.turn ? state.turn.progress : 0);
  announce('条带数已设为 ' + state.strips);
});

refs.magnifierToggle.addEventListener('click', function () {
  if (state.demoTimer !== null) stopAutoDemo();
  state.magnifierOn = !state.magnifierOn;
  updateControls();
  syncLoupe();
  announce(state.magnifierOn ? '放大镜已开启 · 可直接拖动，方向键可微调' : '放大镜已关闭');
});

refs.resetButton.addEventListener('click', function () {
  stopAutoDemo();
  cancelAnimation();
  state.index = 0;
  state.mode = 'curved';
  state.strips = 18;
  state.turn = null;
  state.magnifierOn = false;
  state.loupeX = null;
  state.loupeY = null;
  state.loupeDrag = null;
  state.view = { zoom: 1, tiltX: 1.5, tiltY: 0 };
  render();
  announce('实验已重置');
});

refs.prevButton.addEventListener('click', function () {
  if (state.demoTimer !== null) stopAutoDemo();
  step('prev');
});
refs.nextButton.addEventListener('click', function () {
  if (state.demoTimer !== null) stopAutoDemo();
  step('next');
});
refs.zoomOut.addEventListener('click', function () {
  if (state.demoTimer !== null) stopAutoDemo();
  state.view.zoom = Math.max(0.82, state.view.zoom - 0.1);
  applyView();
  announce('书本缩放 ' + Math.round(state.view.zoom * 100) + '%');
});
refs.zoomIn.addEventListener('click', function () {
  if (state.demoTimer !== null) stopAutoDemo();
  state.view.zoom = Math.min(1.22, state.view.zoom + 0.1);
  applyView();
  announce('书本缩放 ' + Math.round(state.view.zoom * 100) + '%');
});
refs.autoDemo.addEventListener('click', startAutoDemo);
refs.themeToggle.addEventListener('click', function () {
  setTheme(refs.root.dataset.theme === 'dark' ? 'light' : 'dark', true);
});

refs.book.addEventListener('pointerdown', function (event) {
  if (state.fallback || event.button !== 0) return;
  if (state.demoTimer !== null) stopAutoDemo();
  if (state.turn) finishTurn(state.turn.progress >= 0.5 ? 1 : 0);
  const rect = refs.book.getBoundingClientRect();
  const direction = event.clientX < rect.left + rect.width / 2 ? 'prev' : 'next';
  if (!beginTurn(direction, 0)) return;

  refs.book.setPointerCapture(event.pointerId);
  state.drag = {
    pointerId: event.pointerId,
    direction: direction,
    startX: event.clientX,
    width: rect.width,
    moved: 0,
    velocity: 0,
    previousProgress: 0,
    previousTime: performance.now()
  };
  refs.book.classList.add('is-dragging');
  refs.dragHint.hidden = true;
  event.preventDefault();
});

refs.book.addEventListener('pointermove', function (event) {
  if (!state.drag || !state.turn || event.pointerId !== state.drag.pointerId) return;

  const deltaX = event.clientX - state.drag.startX;
  const progress = progressFromDrag(deltaX, state.drag.width, state.drag.direction);
  const now = performance.now();
  const elapsed = Math.max(0.001, (now - state.drag.previousTime) / 1000);
  state.drag.velocity = (progress - state.drag.previousProgress) / elapsed;
  state.drag.previousProgress = progress;
  state.drag.previousTime = now;
  state.drag.moved = Math.max(state.drag.moved, Math.abs(deltaX));
  applyProgress(progress);
  announce('拖动中 · ' + Math.round(progress * 100) + '%');
});

function endDrag(event) {
  if (!state.drag || !state.turn || event.pointerId !== state.drag.pointerId) return;
  const drag = state.drag;
  state.drag = null;
  refs.book.classList.remove('is-dragging');
  const commit = drag.moved < 5 || shouldCommit(state.turn.progress, drag.velocity);
  announce(commit ? '越过阈值 · 正在提交' : '未越过阈值 · 正在回弹');
  settleTurn(commit ? 1 : 0, drag.velocity);
}

refs.book.addEventListener('pointerup', endDrag);
refs.book.addEventListener('pointercancel', endDrag);
refs.book.addEventListener('dragstart', function (event) { event.preventDefault(); });

refs.magnifier.addEventListener('pointerdown', function (event) {
  if (!state.magnifierOn || state.fallback || event.button !== 0) return;
  if (state.demoTimer !== null) stopAutoDemo();
  if (state.loupeX === null) syncLoupe();
  refs.magnifier.setPointerCapture(event.pointerId);
  refs.magnifier.classList.add('is-dragging');
  state.loupeDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    loupeX: state.loupeX,
    loupeY: state.loupeY
  };
  event.preventDefault();
  event.stopPropagation();
});

refs.magnifier.addEventListener('pointermove', function (event) {
  if (!state.loupeDrag || event.pointerId !== state.loupeDrag.pointerId) return;
  state.loupeX = state.loupeDrag.loupeX + event.clientX - state.loupeDrag.startX;
  state.loupeY = state.loupeDrag.loupeY + event.clientY - state.loupeDrag.startY;
  syncLoupe();
  event.stopPropagation();
});

function endLoupeDrag(event) {
  if (!state.loupeDrag || event.pointerId !== state.loupeDrag.pointerId) return;
  state.loupeDrag = null;
  refs.magnifier.classList.remove('is-dragging');
  announce('观察位置已固定 · 继续翻页可对照局部曲率');
  event.stopPropagation();
}

refs.magnifier.addEventListener('pointerup', endLoupeDrag);
refs.magnifier.addEventListener('pointercancel', endLoupeDrag);
refs.magnifier.addEventListener('keydown', function (event) {
  const offsets = {
    ArrowLeft: [-12, 0],
    ArrowRight: [12, 0],
    ArrowUp: [0, -12],
    ArrowDown: [0, 12]
  };
  if (offsets[event.key]) {
    event.preventDefault();
    state.loupeX = (state.loupeX || refs.book.clientWidth * 0.73) + offsets[event.key][0];
    state.loupeY = (state.loupeY || refs.book.clientHeight * 0.35) + offsets[event.key][1];
    syncLoupe();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    state.magnifierOn = false;
    updateControls();
    syncLoupe();
    refs.magnifierToggle.focus();
    announce('放大镜已关闭');
  }
});

refs.stage.addEventListener('pointermove', function (event) {
  if (state.fallback || state.drag || state.loupeDrag || event.pointerType === 'touch') return;
  const rect = refs.book.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  state.view.tiltX = 1.5 - y * 5;
  state.view.tiltY = x * 7;
  applyView();
});

refs.stage.addEventListener('pointerleave', function () {
  if (state.drag || state.loupeDrag) return;
  state.view.tiltX = 1.5;
  state.view.tiltY = 0;
  applyView();
});

refs.book.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    if (state.demoTimer !== null) stopAutoDemo();
    step(event.key === 'ArrowRight' ? 'next' : 'prev');
  } else if (event.key === 'Escape') {
    if (state.turn) {
      cancelAnimation();
      finishTurn(0);
    } else if (state.magnifierOn) {
      state.magnifierOn = false;
      updateControls();
      syncLoupe();
      announce('放大镜已关闭');
    }
  }
});

window.addEventListener('resize', function () {
  if (!state.fallback) render();
});

initializeTheme();
refs.pageTotal.textContent = String(PAGES.length).padStart(2, '0');

if (state.fallback) {
  setFallback();
} else {
  render();
  const previewProgress = Math.max(0, Math.min(0.98, Number(params.get('progress')) || 0));
  if (previewProgress > 0 && canTurn('next')) {
    beginTurn('next', previewProgress);
    applyProgress(previewProgress);
    announce('固定观察状态 · ' + Math.round(previewProgress * 100) + '%');
  }
  syncLoupe();
}
