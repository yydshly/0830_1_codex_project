import { clamp, qualityForBudget } from './page-turn-model.mjs';

const refs = {
  qualityOutput: document.querySelector('#quality-output'),
  qualityFan: document.querySelector('#quality-fan'),
  budget: document.querySelector('#budget-slider'),
  budgetReadout: document.querySelector('#budget-readout'),
  qualityNote: document.querySelector('#quality-note'),
  cornerOutput: document.querySelector('#corner-output'),
  cornerSurface: document.querySelector('#corner-surface'),
  cornerSheet: document.querySelector('#corner-sheet'),
  cornerGrip: document.querySelector('#corner-grip'),
  cornerReset: document.querySelector('#corner-reset'),
  adapterOutput: document.querySelector('#adapter-output'),
  adapterButtons: [...document.querySelectorAll('[data-adapter]')],
  adapterPreview: document.querySelector('#adapter-preview'),
  adapterNote: document.querySelector('#adapter-note')
};

const adapters = {
  illustration: {
    output: 'SVG illustration',
    note: '策略：原生 SVG 直接作为可切片背景；适合固定比例、视觉优先的页稿。',
    left: ['FIELD NOTES', '沿海植物', '颜色、轮廓与季节性的观察。'],
    right: ['PLATE 01', '盐地碱蓬', 'SVG / 双页裁切']
  },
  editorial: {
    output: 'DOM snapshot',
    note: '策略：语义 DOM 保留在可读层，同时生成快照供翻页面使用。',
    left: ['ESSAY 04', '纸张仍有未来吗？', '一篇关于数字界面与物理隐喻的短文。'],
    right: ['CONTINUED', '阅读层独立', 'DOM / snapshot / a11y']
  },
  product: {
    output: 'Component capture',
    note: '策略：把受控产品组件捕获为稳定纹理；交易控件留在翻页完成后的页面。',
    left: ['OBJECT 07', '柔光随行灯', '一体成形 · 12 小时续航'],
    right: ['LILAC', '¥ 680', 'component / texture']
  },
  data: {
    output: 'Canvas texture',
    note: '策略：图表先绘制到 Canvas 纹理；详细数值与筛选仍使用标准界面。',
    left: ['SIGNAL 08', '潮汐与风速', '过去十二小时的沿岸观测。'],
    right: ['LIVE SUMMARY', '+18% 流速', 'canvas / data layer']
  }
};

const corner = { x: 20, y: 20, drag: null };

function renderQuality() {
  const quality = qualityForBudget(refs.budget.value);
  refs.budgetReadout.textContent = `${Math.round(quality.hz)} Hz`;
  refs.qualityOutput.textContent = `${quality.strips} strips`;
  refs.qualityNote.textContent = `${quality.tier}：${quality.strips} 条带，${quality.lighting ? '保留逐带光照。' : '关闭动态光照以优先保证输入响应。'}`;
  refs.qualityFan.replaceChildren();
  for (let index = 0; index < quality.strips; index += 1) {
    const strip = document.createElement('i');
    const amount = quality.strips === 1 ? 0.5 : index / (quality.strips - 1);
    strip.style.setProperty('--fan-angle', `${-54 + amount * 108}deg`);
    strip.style.setProperty('--fan-depth', `${Math.sin(amount * Math.PI) * -18}px`);
    strip.style.opacity = quality.lighting ? String(0.48 + amount * 0.5) : '0.62';
    refs.qualityFan.append(strip);
  }
}

function renderCorner() {
  refs.cornerSheet.style.setProperty('--fold-x', `${corner.x}%`);
  refs.cornerSheet.style.setProperty('--fold-y', `${corner.y}%`);
  refs.cornerOutput.textContent = `x ${Math.round(corner.x)} · y ${Math.round(corner.y)}`;
  refs.cornerGrip.setAttribute('aria-valuetext', `水平折入 ${Math.round(corner.x)}%，垂直折入 ${Math.round(corner.y)}%`);
}

function beginCornerDrag(event) {
  if (event.button !== 0) return;
  refs.cornerGrip.setPointerCapture(event.pointerId);
  refs.cornerGrip.classList.add('is-dragging');
  corner.drag = { pointerId: event.pointerId };
  event.preventDefault();
}

function moveCorner(event) {
  if (!corner.drag || corner.drag.pointerId !== event.pointerId) return;
  const rect = refs.cornerSurface.getBoundingClientRect();
  corner.x = clamp(((rect.right - event.clientX) / rect.width) * 100, 8, 66);
  corner.y = clamp(((rect.bottom - event.clientY) / rect.height) * 100, 8, 66);
  renderCorner();
}

function endCornerDrag(event) {
  if (!corner.drag || corner.drag.pointerId !== event.pointerId) return;
  corner.drag = null;
  refs.cornerGrip.classList.remove('is-dragging');
}

function renderAdapter(name) {
  const adapter = adapters[name] || adapters.illustration;
  refs.adapterPreview.dataset.adapter = name;
  refs.adapterOutput.textContent = adapter.output;
  refs.adapterNote.textContent = adapter.note;
  refs.adapterPreview.innerHTML = `<div class="adapter-spread">
    <div class="adapter-page"><small>${adapter.left[0]}</small><h4>${adapter.left[1]}</h4><p>${adapter.left[2]}</p></div>
    <div class="adapter-page"><small>${adapter.right[0]}</small><h4>${adapter.right[1]}</h4><p>${adapter.right[2]}</p></div>
  </div>`;
  refs.adapterButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.adapter === name)));
}

refs.budget.addEventListener('input', renderQuality);
refs.cornerGrip.addEventListener('pointerdown', beginCornerDrag);
refs.cornerGrip.addEventListener('pointermove', moveCorner);
refs.cornerGrip.addEventListener('pointerup', endCornerDrag);
refs.cornerGrip.addEventListener('pointercancel', endCornerDrag);
refs.cornerGrip.addEventListener('keydown', (event) => {
  const key = event.key;
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return;
  event.preventDefault();
  if (key === 'ArrowLeft') corner.x = clamp(corner.x + 3, 8, 66);
  if (key === 'ArrowRight') corner.x = clamp(corner.x - 3, 8, 66);
  if (key === 'ArrowUp') corner.y = clamp(corner.y + 3, 8, 66);
  if (key === 'ArrowDown') corner.y = clamp(corner.y - 3, 8, 66);
  renderCorner();
});
refs.cornerReset.addEventListener('click', () => {
  corner.x = 20;
  corner.y = 20;
  renderCorner();
  refs.cornerGrip.focus();
});
refs.adapterButtons.forEach((button) => button.addEventListener('click', () => renderAdapter(button.dataset.adapter)));

renderQuality();
renderCorner();
renderAdapter('illustration');

if (document.documentElement.classList.contains('is-fallback')) {
  refs.budget.disabled = true;
  refs.cornerGrip.disabled = true;
  refs.cornerReset.disabled = true;
  refs.adapterButtons.forEach((button) => { button.disabled = true; });
}
