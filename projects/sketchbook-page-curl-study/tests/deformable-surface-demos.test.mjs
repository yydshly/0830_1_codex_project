import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

class TestStyle {
  constructor() {
    this.properties = new Map();
  }

  setProperty(name, value) {
    this.properties.set(name, String(value));
  }

  getPropertyValue(name) {
    return this.properties.get(name) ?? '';
  }
}

class TestElement {
  constructor(tagName) {
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.dataset = {};
    this.attributes = new Map();
    this.style = new TestStyle();
    this.textContent = '';
    this._className = '';
    this.classList = {
      contains: (name) => this.classNames().includes(name),
      toggle: (name, force) => {
        const classes = new Set(this.classNames());
        const enabled = force === undefined ? !classes.has(name) : Boolean(force);
        if (enabled) classes.add(name);
        else classes.delete(name);
        this._className = [...classes].join(' ');
        return enabled;
      }
    };
  }

  get className() {
    return this._className;
  }

  set className(value) {
    this._className = String(value ?? '');
  }

  classNames() {
    return this._className.split(/\s+/).filter(Boolean);
  }

  append(...children) {
    for (const child of children) {
      child.parentNode = this;
      this.children.push(child);
    }
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    assert.match(selector, /^\.[a-z0-9_-]+$/i, `test DOM only supports a single class selector: ${selector}`);
    const className = selector.slice(1);
    const matches = [];
    const visit = (element) => {
      for (const child of element.children) {
        if (child.classNames().includes(className)) matches.push(child);
        visit(child);
      }
    };
    visit(this);
    return matches;
  }
}

globalThis.Element = TestElement;
globalThis.document = {
  createElement(tagName) {
    return new TestElement(tagName);
  }
};

const {
  applyStripChainState,
  createStripChain,
  stripCurveState
} = await import('../demo/strip-surface-engine.mjs');

const {
  MATERIAL_DEFINITIONS,
  MATERIAL_ORDER,
  SURFACE_DEFINITIONS,
  SURFACE_ORDER,
  applyDeformableSurfaceState,
  createDeformableSurface,
  surfaceActionLabel,
  surfaceStatusText
} = await import('../demo/deformable-surface-demos.mjs');

const EXPECTED_SURFACES = [
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
];

const EXPECTED_MATERIALS = ['paper', 'card', 'vellum', 'textile', 'foil'];

const GEOMETRY = {
  'label-peel': ['.surface-label__strip', 14],
  'fold-map': ['.surface-map__panel', 8],
  'split-curtain': ['.surface-curtain__strip', 20],
  'comparison-blind': ['.surface-blind__slat', 18],
  'accordion-timeline': ['.surface-timeline__event', 7],
  'material-wall': ['.surface-material__sample', 8],
  'box-net': ['.surface-box__panel', 6],
  portal: ['.surface-portal__frame', 6],
  'rollup-poster': ['.surface-rollup__band', 12],
  'radial-fan': ['.surface-fan__wedge', 10],
  'tearoff-coupon': ['.surface-coupon__ticket', 1],
  'data-ribbon': ['.surface-ribbon__node', 8]
};

const STATE_GEOMETRY = {
  'label-peel': '.surface-label__strip',
  'fold-map': '.surface-map__panel',
  'split-curtain': '.surface-curtain__strip',
  'comparison-blind': '.surface-blind__slat',
  'accordion-timeline': '.surface-timeline__event',
  'material-wall': '.surface-material__sample',
  'box-net': '.surface-box__panel',
  portal: '.surface-portal__frame',
  'rollup-poster': '.surface-rollup__band',
  'radial-fan': '.surface-fan__wedge',
  'tearoff-coupon': '.surface-coupon__ticket',
  'data-ribbon': '.surface-ribbon__node'
};

test('Revision 7 defines twelve non-book surfaces with an explicit public contract', () => {
  assert.deepEqual([...SURFACE_ORDER], EXPECTED_SURFACES);
  assert.equal(Object.keys(SURFACE_DEFINITIONS).length, 12);

  for (const surfaceId of EXPECTED_SURFACES) {
    const selected = SURFACE_DEFINITIONS[surfaceId];
    assert.ok(selected, `${surfaceId} has a definition`);
    for (const key of [
      'name', 'kicker', 'title', 'dek', 'accent', 'action', 'kind', 'progressLabel',
      'release', 'dragAxis', 'gesture', 'anchor', 'slicing', 'deformation', 'topology', 'boundary'
    ]) {
      assert.equal(typeof selected[key], 'string', `${surfaceId}.${key} is public copy`);
      assert.ok(selected[key].length > 0, `${surfaceId}.${key} is not empty`);
    }
    assert.match(selected.accent, /^#[0-9a-f]{6}$/i);
    assert.ok(['toggle', 'cycle', 'release'].includes(selected.kind));
    assert.ok(['x', 'y', 'diagonal', 'split'].includes(selected.dragAxis));
    assert.ok([-1, 1].includes(selected.dragDirection));
    assert.ok(selected.fallbackProgress > 0 && selected.fallbackProgress <= 1);
    if (selected.kind === 'cycle') assert.ok(Number.isInteger(selected.maxStep) && selected.maxStep > 0);
  }
});

test('Revision 7 defines five truthful material presets with different response variables', () => {
  assert.deepEqual([...MATERIAL_ORDER], EXPECTED_MATERIALS);
  assert.equal(Object.keys(MATERIAL_DEFINITIONS).length, 5);

  const stiffness = new Set();
  const reflection = new Set();
  for (const materialId of EXPECTED_MATERIALS) {
    const material = MATERIAL_DEFINITIONS[materialId];
    for (const key of ['name', 'englishName', 'texture', 'boundary']) {
      assert.equal(typeof material[key], 'string');
      assert.ok(material[key].length > 0);
    }
    for (const key of ['thickness', 'opacity', 'stiffness', 'curl', 'reflection', 'translucency']) {
      assert.equal(typeof material[key], 'number');
      assert.ok(Number.isFinite(material[key]));
    }
    stiffness.add(material.stiffness);
    reflection.add(material.reflection);
  }
  assert.equal(stiffness.size, 5);
  assert.equal(reflection.size, 5);
  assert.match(MATERIAL_DEFINITIONS.textile.boundary, /不是布料|仿真/);
  assert.match(MATERIAL_DEFINITIONS.foil.boundary, /不是 PBR|视觉近似/);
});

test('shared strip engine creates two-sided geometry and applies curvature plus lighting', () => {
  const chain = createStripChain({ prefix: 'test-chain', count: 12, axis: 'y', anchor: 'top' });
  assert.equal(chain.querySelectorAll('.strip-surface-chain__strip').length, 12);
  assert.equal(chain.querySelectorAll('.strip-surface-chain__face').length, 24);
  assert.equal(chain.dataset.axis, 'y');
  assert.equal(chain.dataset.anchor, 'top');

  const first = chain.querySelector('.strip-surface-chain__strip');
  const before = first.style.transform ?? '';
  const returned = applyStripChainState(chain, { progress: 0.73, turn: 0.25 }, {
    axis: 'y', mode: 'roll', direction: -1, stiffness: 0.4, lighting: 0.8
  });
  assert.equal(returned, chain);
  assert.equal(chain.dataset.progress, '0.730');
  assert.notEqual(first.style.transform ?? '', before);
  assert.match(first.style.getPropertyValue('--strip-angle'), /deg$/);
  assert.notEqual(first.style.getPropertyValue('--strip-shade'), '');

  const curve = stripCurveState(9, { count: 12, direction: -1, stiffness: 0.5 });
  assert.equal(curve.progress, 1);
  assert.equal(curve.count, 12);
  assert.equal(curve.direction, -1);
});

test('every surface builder creates the contracted observable geometry', () => {
  for (const surfaceId of EXPECTED_SURFACES) {
    const [selector, expectedCount] = GEOMETRY[surfaceId];
    const root = createDeformableSurface(surfaceId, {
      accent: '#123456',
      material: 'foil',
      context: { id: 'launch', title: '中央产品', front: '产品外层', back: '内部结构', detail: '隐藏卖点' }
    });
    assert.ok(root instanceof Element);
    assert.equal(root.dataset.surface, surfaceId);
    assert.equal(root.dataset.material, 'foil');
    assert.equal(root.dataset.context, 'launch');
    assert.ok(root.classNames().includes('deformable-surface'));
    assert.ok(root.classNames().includes(`deformable-surface--${surfaceId}`));
    assert.equal(root.getAttribute('role'), 'img');
    assert.match(root.getAttribute('aria-label'), new RegExp(SURFACE_DEFINITIONS[surfaceId].name));
    assert.equal(root.style.getPropertyValue('--surface-accent'), '#123456');
    assert.equal(root.querySelectorAll(selector).length, expectedCount, `${surfaceId} geometry count`);
  }

  assert.equal(createDeformableSurface('label-peel').querySelectorAll('.strip-surface-chain__face').length, 28);
  assert.ok(createDeformableSurface('label-peel').querySelector('.surface-label__grip'));
  assert.ok(createDeformableSurface('label-peel').querySelector('.surface-label__underlay'));
  assert.ok(createDeformableSurface('fold-map').querySelector('.surface-map__route'));
  assert.equal(createDeformableSurface('fold-map').querySelectorAll('.surface-map__stop').length, 5);
  assert.equal(createDeformableSurface('rollup-poster').querySelectorAll('.strip-surface-chain__face').length, 24);
  assert.equal(createDeformableSurface('tearoff-coupon').querySelectorAll('.surface-coupon__hole').length, 16);
  assert.equal(createDeformableSurface('data-ribbon').querySelectorAll('.surface-ribbon__segment').length, 7);
});

test('every surface applier writes normalized state and changes live geometry', () => {
  for (const surfaceId of EXPECTED_SURFACES) {
    const selected = SURFACE_DEFINITIONS[surfaceId];
    const root = createDeformableSurface(surfaceId);
    const geometry = root.querySelector(STATE_GEOMETRY[surfaceId]);
    const initialTransform = geometry.style.transform ?? '';
    const returned = applyDeformableSurfaceState(root, surfaceId, {
      progress: 0.73,
      step: selected.maxStep ?? 2,
      turn: 0.35,
      material: 'textile',
      fallback: false,
      detached: selected.kind === 'release'
    });

    assert.equal(returned, root);
    assert.equal(root.dataset.progress, '0.730');
    assert.equal(root.dataset.step, String(selected.maxStep ?? 2));
    assert.equal(root.dataset.turn, '0.350');
    assert.equal(root.dataset.material, 'textile');
    assert.equal(root.dataset.fallback, 'false');
    assert.equal(root.dataset.detached, String(selected.kind === 'release'));
    assert.equal(root.style.getPropertyValue('--surface-progress'), '0.730');
    assert.notEqual(geometry.style.transform ?? '', initialTransform, `${surfaceId} geometry responds to state`);
  }
});

test('surface state clamps unsafe values, applies materials, and rejects invalid targets', () => {
  const map = createDeformableSurface('fold-map', { accent: 'red;display:none', material: 'card' });
  assert.equal(map.style.getPropertyValue('--surface-accent'), SURFACE_DEFINITIONS['fold-map'].accent);
  assert.equal(map.dataset.material, 'card');
  const cardThickness = map.style.getPropertyValue('--material-thickness');

  applyDeformableSurfaceState(map, 'fold-map', {
    progress: 12,
    step: 99,
    turn: -9,
    material: 'unknown',
    fallback: true,
    detached: 1
  });
  assert.equal(map.dataset.progress, '1.000');
  assert.equal(map.dataset.step, String(SURFACE_DEFINITIONS['fold-map'].maxStep));
  assert.equal(map.dataset.turn, '-1.000');
  assert.equal(map.dataset.material, 'paper');
  assert.equal(map.dataset.fallback, 'true');
  assert.equal(map.dataset.detached, 'true');
  assert.notEqual(map.style.getPropertyValue('--material-thickness'), cardThickness);
  assert.equal(map.style.getPropertyValue('--material-opacity'), MATERIAL_DEFINITIONS.paper.opacity.toFixed(3));

  assert.throws(() => createDeformableSurface('unknown'), /Unknown deformable surface/);
  assert.throws(() => applyDeformableSurfaceState({}, 'fold-map'), /DOM Element/);
  assert.throws(() => applyStripChainState({}, { progress: 0.5 }), /DOM Element/);
});

test('release, toggle, and cycle actions expose concrete action and status copy', () => {
  assert.equal(surfaceActionLabel('label-peel', { progress: 0 }), '揭开标签');
  assert.match(surfaceActionLabel('label-peel', { progress: 1 }), /吸附/);
  assert.match(surfaceActionLabel('label-peel', { detached: true }), /重新贴/);
  assert.match(surfaceActionLabel('fold-map', { step: 0 }), /第 2 折/);
  assert.match(surfaceActionLabel('fold-map', { step: 7 }), /重新折叠/);
  assert.equal(surfaceActionLabel('split-curtain', { progress: 1 }), '合上幕布');
  assert.match(surfaceActionLabel('tearoff-coupon', { detached: true }), /放回/);
  assert.match(surfaceActionLabel('data-ribbon', { step: 7 }), /第一个数据点/);

  for (const surfaceId of EXPECTED_SURFACES) {
    const status = surfaceStatusText(surfaceId, {
      progress: 0.56,
      step: Math.min(2, SURFACE_DEFINITIONS[surfaceId].maxStep ?? 2),
      material: 'vellum',
      detached: surfaceId === 'tearoff-coupon'
    });
    assert.match(status, new RegExp(SURFACE_DEFINITIONS[surfaceId].name));
    assert.match(status, /透明胶片/);
    assert.ok(status.length > SURFACE_DEFINITIONS[surfaceId].name.length + MATERIAL_DEFINITIONS.vellum.name.length);
  }
  assert.match(surfaceStatusText('split-curtain', { progress: 0.5, material: 'textile' }), /20 条褶带/);
  assert.match(surfaceStatusText('portal', { progress: 0.8, material: 'foil' }), /背面场景/);
  assert.match(surfaceStatusText('tearoff-coupon', { detached: true }), /已脱离/);
});

test('surface module exports the controller contract and visibly reuses the strip engine', async () => {
  const source = await readFile(new URL('../demo/deformable-surface-demos.mjs', import.meta.url), 'utf8');
  const stripSource = await readFile(new URL('../demo/strip-surface-engine.mjs', import.meta.url), 'utf8');
  for (const exportedName of [
    'SURFACE_ORDER',
    'SURFACE_DEFINITIONS',
    'MATERIAL_ORDER',
    'MATERIAL_DEFINITIONS',
    'createDeformableSurface',
    'applyDeformableSurfaceState',
    'surfaceActionLabel',
    'surfaceStatusText'
  ]) {
    assert.match(source, new RegExp(`export (?:const|function) ${exportedName}\\b`));
  }
  assert.match(source, /createStripChain\(/);
  assert.match(source, /applyStripChainState\(/);
  assert.match(stripSource, /strip-surface-chain__face--front/);
  assert.match(stripSource, /strip-surface-chain__face--back/);
});

test('Revision 7 page controller exposes one surface radio set and preserves deep-linkable orthogonal state', async () => {
  const html = await readFile(new URL('../demo/index.html', import.meta.url), 'utf8');
  const app = await readFile(new URL('../demo/app.mjs', import.meta.url), 'utf8');
  const css = await readFile(new URL('../demo/deformable-surfaces.css', import.meta.url), 'utf8');

  assert.equal((html.match(/<button[^>]+data-surface="[^"]+"/g) || []).length, 12);
  assert.equal((html.match(/<button[^>]+data-material="[^"]+"/g) || []).length, 5);
  assert.equal((html.match(/role="radiogroup" aria-label="可变表面形态"/g) || []).length, 1);
  assert.doesNotMatch(html, /class="surface-spec"[^>]+aria-live/);
  assert.match(app, /surfaceStep = Math\.round\(state\.surfaceProgress/);
  assert.match(app, /function syncPanelUrl\(/);
  assert.match(app, /function surfacePointerDelta\(/);
  assert.match(app, /bindRadioNavigation\(refs\.surfaceButtons/);
  assert.match(app, /surfaceStatusText\(state\.surface, surfaceState\).*内容：/);
  for (const selector of ['surface-blind__face', 'surface-material__sample', 'surface-portal__frame', 'surface-ribbon__segment']) {
    assert.match(css, new RegExp(`\\.${selector}[^\\n]*var\\(--surface-fill`));
  }
});
