/**
 * Shared CSS 3D strip primitive used by the Revision 7 deformable surfaces.
 *
 * The engine intentionally models a developable, one-axis strip surface. It is
 * not a cloth solver and it does not attempt self-collision. Renderers provide
 * the surrounding topology while this module owns strip creation, curvature,
 * two-sided state and per-strip lighting.
 */

export function clampStripValue(value, min = 0, max = 1) {
  const number = Number(value);
  const safe = Number.isFinite(number) ? number : 0;
  return Math.min(max, Math.max(min, safe));
}

function integerInRange(value, min, max, fallback) {
  const number = Math.round(Number(value));
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function safeToken(value, fallback) {
  const token = String(value ?? '').trim();
  return /^[a-z][a-z0-9-]*$/i.test(token) ? token : fallback;
}

function node(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function setAriaHidden(element) {
  element.setAttribute('aria-hidden', 'true');
  return element;
}

/**
 * Creates sibling strips with explicit front/back faces.
 *
 * `axis=x` produces vertical strips (a surface bends around Y); `axis=y`
 * produces horizontal bands (a surface bends around X).
 */
export function createStripChain(options = {}) {
  const prefix = safeToken(options.prefix, 'surface-strip');
  const count = integerInRange(options.count, 2, 48, 12);
  const axis = options.axis === 'y' ? 'y' : 'x';
  const anchor = safeToken(options.anchor, axis === 'x' ? 'left' : 'top');
  const root = node('div', `strip-surface-chain ${prefix}__chain`);
  root.dataset.stripPrefix = prefix;
  root.dataset.stripCount = String(count);
  root.dataset.axis = axis;
  root.dataset.anchor = anchor;
  root.style.setProperty('--strip-count', String(count));

  for (let index = 0; index < count; index += 1) {
    const strip = node('div', `strip-surface-chain__strip ${prefix}__strip`);
    strip.dataset.strip = String(index);
    strip.style.setProperty('--strip-index', String(index));
    strip.style.setProperty('--strip-position', (index / Math.max(1, count - 1)).toFixed(4));
    if (axis === 'x') {
      strip.style.left = `${((index / count) * 100).toFixed(4)}%`;
      strip.style.top = '0%';
      strip.style.width = `${(100 / count + 0.08).toFixed(4)}%`;
      strip.style.height = '100%';
    } else {
      strip.style.left = '0%';
      strip.style.top = `${((index / count) * 100).toFixed(4)}%`;
      strip.style.width = '100%';
      strip.style.height = `${(100 / count + 0.08).toFixed(4)}%`;
    }

    const front = setAriaHidden(node('span', `strip-surface-chain__face strip-surface-chain__face--front ${prefix}__face ${prefix}__face--front`));
    const back = setAriaHidden(node('span', `strip-surface-chain__face strip-surface-chain__face--back ${prefix}__face ${prefix}__face--back`));
    front.dataset.face = 'front';
    back.dataset.face = 'back';
    if (index === 0 && options.frontLabel) front.textContent = String(options.frontLabel);
    if (index === count - 1 && options.backLabel) back.textContent = String(options.backLabel);
    strip.append(front, back);
    root.append(strip);
  }
  return root;
}

export function stripCurveState(progress, options = {}) {
  const value = clampStripValue(progress);
  const count = integerInRange(options.count, 2, 48, 12);
  const direction = Number(options.direction) < 0 ? -1 : 1;
  const stiffness = clampStripValue(options.stiffness ?? 0.62, 0.08, 1.4);
  const maxAngle = clampStripValue(options.maxAngle ?? 154, 0, 210);
  const curvature = (1.35 - stiffness) * Math.sin(Math.PI * value);
  const rootAngle = direction * (maxAngle * value + curvature * 34);
  const segmentAngle = direction * ((curvature * 68) / count);
  return Object.freeze({
    progress: value,
    count,
    direction,
    stiffness,
    maxAngle,
    curvature,
    rootAngle,
    segmentAngle
  });
}

/**
 * Applies a continuous progress value to a chain.
 *
 * Modes:
 * - peel/roll: face transition plus curved travel;
 * - gather: mirrored pleat motion for curtain wings;
 * - flip: a restrained front/back comparison.
 */
export function applyStripChainState(root, state = {}, options = {}) {
  if (!(root instanceof Element)) throw new TypeError('applyStripChainState requires a DOM Element root.');
  const strips = [...root.querySelectorAll('.strip-surface-chain__strip')];
  const axis = options.axis === 'y' || root.dataset.axis === 'y' ? 'y' : 'x';
  const mode = ['peel', 'roll', 'gather', 'flip'].includes(options.mode) ? options.mode : 'peel';
  const progress = clampStripValue(state.progress);
  const turn = clampStripValue(state.turn, -1, 1);
  const fallback = Boolean(state.fallback);
  const lighting = clampStripValue(options.lighting ?? 0.72);
  const direction = Number(options.direction) < 0 ? -1 : 1;
  const stiffness = clampStripValue(options.stiffness ?? 0.62, 0.08, 1.4);
  const maxAngle = mode === 'gather'
    ? clampStripValue(options.maxAngle ?? 54, 0, 110)
    : mode === 'flip'
      ? clampStripValue(options.maxAngle ?? 180, 0, 210)
      : clampStripValue(options.maxAngle ?? 154, 0, 210);
  const curve = stripCurveState(progress, { count: strips.length, direction, stiffness, maxAngle });
  const travel = Number.isFinite(Number(options.travel)) ? Number(options.travel) : mode === 'gather' ? 72 : 18;
  const stagger = clampStripValue(options.stagger ?? (mode === 'gather' ? 0.16 : 0), 0, 0.72);

  root.dataset.progress = progress.toFixed(3);
  root.dataset.turn = turn.toFixed(3);
  root.dataset.fallback = String(fallback);
  root.dataset.mode = mode;
  root.style.setProperty('--strip-progress', progress.toFixed(3));
  root.style.setProperty('--strip-curvature', curve.curvature.toFixed(4));

  strips.forEach((strip, index) => {
    const position = index / Math.max(1, strips.length - 1);
    const wavePosition = direction > 0 ? position : 1 - position;
    const local = clampStripValue((progress - wavePosition * stagger) / Math.max(0.001, 1 - stagger));
    const wave = Math.sin(Math.PI * local);
    let angle;
    let offset;

    if (mode === 'gather') {
      const pleat = index % 2 === 0 ? 1 : -1;
      angle = direction * pleat * (12 + maxAngle * local) + turn * pleat * 4;
      offset = direction * travel * local;
    } else {
      angle = curve.rootAngle - index * curve.segmentAngle + turn * direction * 5;
      offset = direction * travel * local;
    }

    const radians = (angle * Math.PI) / 180;
    const facing = Math.abs(Math.cos(radians));
    const depth = fallback ? 0 : wave * (mode === 'gather' ? 18 : 34) * (1.25 - stiffness * 0.3);
    const shade = (1 - facing) * 0.66 * lighting;
    const glow = facing * 0.2 * lighting;
    strip.dataset.face = Math.abs(angle) < 90 ? 'front' : 'back';
    strip.dataset.state = local <= 0.001 ? 'rest' : local >= 0.999 ? 'settled' : 'moving';
    strip.style.setProperty('--strip-local-progress', local.toFixed(3));
    strip.style.setProperty('--strip-angle', `${angle.toFixed(3)}deg`);
    strip.style.setProperty('--strip-depth', `${depth.toFixed(3)}px`);
    strip.style.setProperty('--strip-shade', shade.toFixed(3));
    strip.style.setProperty('--strip-glow', glow.toFixed(3));
    strip.style.setProperty('--strip-offset', `${offset.toFixed(3)}%`);

    if (fallback) {
      strip.style.transform = axis === 'x'
        ? `translateX(${offset.toFixed(3)}%) scaleX(${(1 - local * 0.08).toFixed(3)})`
        : `translateY(${offset.toFixed(3)}%) scaleY(${(1 - local * 0.08).toFixed(3)})`;
    } else if (axis === 'x') {
      strip.style.transform = `translate3d(${offset.toFixed(3)}%, 0, ${depth.toFixed(3)}px) rotateY(${angle.toFixed(3)}deg)`;
    } else {
      strip.style.transform = `translate3d(0, ${offset.toFixed(3)}%, ${depth.toFixed(3)}px) rotateX(${(-angle).toFixed(3)}deg)`;
    }
  });
  return root;
}
