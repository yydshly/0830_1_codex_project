export const DEFAULTS = Object.freeze({
  peakCurl: 0.6,
  progressThreshold: 0.42,
  velocityThreshold: 1.1,
  dragSpan: 0.62,
  strips: 18
});

export function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeStripCount(value) {
  const count = Math.round(Number(value));
  return [8, 12, 18, 24].includes(count) ? count : DEFAULTS.strips;
}

export function qualityForBudget(refreshRate) {
  const hz = clamp(Number(refreshRate) || 60, 30, 120);
  if (hz < 45) return { hz, strips: 8, tier: '省电档', lighting: false };
  if (hz < 70) return { hz, strips: 12, tier: '均衡档', lighting: true };
  if (hz < 100) return { hz, strips: 18, tier: '精细档', lighting: true };
  return { hz, strips: 24, tier: '高刷档', lighting: true };
}

export function curveGeometry(progress, stripCount = DEFAULTS.strips, peakCurl = DEFAULTS.peakCurl) {
  const t = clamp(Number(progress) || 0);
  const strips = normalizeStripCount(stripCount);
  const theta = Math.PI * t;
  const beta = peakCurl * Math.sin(Math.PI * t);

  return {
    progress: t,
    strips,
    theta,
    beta,
    rootAngle: theta + beta,
    segmentAngle: (2 * beta) / strips,
    totalCurvature: 2 * beta
  };
}

export function segmentTangents(progress, stripCount = DEFAULTS.strips, peakCurl = DEFAULTS.peakCurl) {
  const geometry = curveGeometry(progress, stripCount, peakCurl);
  return Array.from({ length: geometry.strips }, (_, index) =>
    geometry.rootAngle - index * geometry.segmentAngle
  );
}

export function progressFromDrag(deltaX, bookWidth, direction, dragSpan = DEFAULTS.dragSpan) {
  const safeWidth = Math.max(1, Number(bookWidth) || 1);
  const signedDelta = direction === "prev" ? deltaX : -deltaX;
  return clamp(signedDelta / (safeWidth * dragSpan));
}

export function shouldCommit(progress, velocity, options = {}) {
  const progressThreshold = options.progressThreshold ?? DEFAULTS.progressThreshold;
  const velocityThreshold = options.velocityThreshold ?? DEFAULTS.velocityThreshold;
  return Number(progress) > progressThreshold || Number(velocity) > velocityThreshold;
}

export function formatDegrees(radians, digits = 1) {
  return `${((radians * 180) / Math.PI).toFixed(digits)}°`;
}

export function cssDegrees(radians, digits = 3) {
  return `${((radians * 180) / Math.PI).toFixed(digits)}deg`;
}
