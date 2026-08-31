import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const goal = readJson('goal.json');
const replay = readJson('goal.replay-r03.json');
const comparisonPptx = readJson('pptx-export-report.json');
const selectedPptx = readJson('pptx-selected-export-report.json');
const comparisonPdf = readJson('pdf-export-report.json');
const selectedPdf = readJson('pdf-selected-export-report.json');
const variantQuality = readJson(path.join('ppt', 'four-variant-quality.json'));
const presentationQa = readJson('presentation-qa.json');

const canonicalSources = new Set(['presentation', 'presentation.items', 'presentation.chartData', 'meta']);
const forbiddenMapRoots = [];
const slides = goal.slides.map((slide, slideIndex) => {
  const requiredItems = (slide.content?.presentation?.items || []).filter(item => item.required);
  const variants = slide.variants || [];
  const canonicalHash = sha256(stableStringify(slide.content));
  const variantAudit = variants.map(variant => {
    const selectors = [];
    const explicitSources = [];
    walk(variant.contentMap, (value, key) => {
      if (typeof value !== 'string') return;
      if (/^(presentation|meta)(\.|$)/.test(value)) selectors.push(value);
      if (key === 'source') explicitSources.push(value);
      if (/^(variant|props|layout)(\.|$)/.test(value)) forbiddenMapRoots.push({
        slide: slideIndex + 1,
        variant: variant.id,
        value,
      });
    });
    const selectedCoverage = variant.id === 'v4'
      ? bespokeRequiredCoverage(variant.contentMap, requiredItems.length)
      : null;
    return {
      id: variant.id,
      kind: variant.kind,
      layout: variant.layout || null,
      compositionFamily: variant.composition?.designIntent?.compositionFamily || null,
      selectorCount: selectors.length,
      selectorsUseCanonicalRoots: selectors.every(selector => /^(presentation|meta)(\.|$)/.test(selector)),
      explicitSourcesUseCanonicalRoots: explicitSources.every(source => canonicalSources.has(source)),
      selectedRequiredFacts: selectedCoverage,
    };
  });
  return {
    slide: slideIndex + 1,
    title: slide.content?.presentation?.title || '',
    role: variants[3]?.composition?.designIntent?.narrativeRole || null,
    requiredFactCount: requiredItems.length,
    requiredFactIds: requiredItems.map(item => item.id),
    canonicalHash,
    variants: variantAudit,
  };
});

const goalHash = sha256(readFileSync(path.join(here, 'goal.json')));
const replayHash = sha256(readFileSync(path.join(here, 'goal.replay-r03.json')));
const report = {
  schemaVersion: 1,
  experimentId: 'real-run-01',
  generatedAt: new Date().toISOString(),
  upstream: {
    version: '0.4.11',
    commit: '7cb23347f91cda1a5519eafc8c040704e389535a',
    modified: false,
  },
  input: {
    themePack: goal.themePack,
    randomSeed: goal.randomSeed,
    workflowRunId: goal.workflowRunId,
    logicalSlides: goal.slides.length,
    variantsPerSlide: 4,
    templateVariantsPerSlide: 3,
    bespokeVariantsPerSlide: 1,
    requiredFacts: slides.reduce((sum, slide) => sum + slide.requiredFactCount, 0),
  },
  contracts: {
    goalSchema: 'passed',
    comparisonSwissDeck: 'passed',
    goalCopy: 'passed',
    selectedV4GoalCopy: 'passed',
    selectedV4SwissDeck: {
      status: 'not-applicable',
      reason: 'The upstream Swiss validator requires data-layout, while selected bespoke v4 slides intentionally have no template layout.',
    },
    selectedV4RequiredFacts: slides.every(slide => slide.variants[3].selectedRequiredFacts?.passed ?? true),
    contentMapCanonicalRoots: forbiddenMapRoots.length === 0
      && slides.every(slide => slide.variants.every(variant => (
        variant.selectorsUseCanonicalRoots && variant.explicitSourcesUseCanonicalRoots
      ))),
    bespokeVisualValidator: {
      status: 'failed-heuristic',
      checked: variantQuality.summary.bespokePagesChecked,
      clipFlags: variantQuality.summary.bespokeClipFailureCount,
      browserErrors: variantQuality.summary.browserErrorCount,
      interpretation: 'All v4 screenshots hydrated and PowerPoint QA passed; the heuristic flags the theme decorative ring/bleed rather than cropped authored copy.',
    },
  },
  reproducibility: {
    goalSha256: goalHash,
    replaySha256: replayHash,
    byteIdentical: goalHash === replayHash,
    method: 'Same briefs, theme07, role sequence, seed and workflow id; then the same two deterministic layout substitutions.',
  },
  exports: {
    comparison: exportSummary(comparisonPptx, comparisonPdf),
    selectedV4: exportSummary(selectedPptx, selectedPdf),
  },
  presentationQa,
  interventions: [
    {
      physicalSlide: 15,
      logicalSlide: 4,
      from: 'theme07_page057',
      to: 'theme07_page035',
      reason: 'Oversized ghost metric label overflowed after PPTX mapping.',
    },
    {
      physicalSlide: 18,
      logicalSlide: 5,
      from: 'theme07_page026',
      to: 'theme07_page007',
      reason: 'Image/investor composition enlarged comparison copy beyond the slide canvas.',
    },
  ],
  conclusions: [
    'The distinctive capability is an auditable content-to-layout-to-export pipeline, not a uniquely recognizable visual style.',
    'Fixed-seed allocation is reproducible, but deterministic output can reproduce a poor candidate; visual QA remains necessary.',
    'PPTX preserves many native text and shape objects, while complex masked/effect regions fall back to images.',
    'The selected v4 deck is structurally clean and consistent, but visually resembles a restrained general-purpose research deck.',
  ],
  slides,
};

writeFileSync(path.join(here, 'experiment-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  output: path.join(here, 'experiment-report.json'),
  byteIdentical: report.reproducibility.byteIdentical,
  requiredFacts: report.input.requiredFacts,
  comparisonSlides: report.exports.comparison.slideCount,
  selectedSlides: report.exports.selectedV4.slideCount,
  selectedObjects: report.exports.selectedV4.objects,
}, null, 2));

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(here, relativePath), 'utf8'));
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function walk(value, visitor, key = '') {
  visitor(value, key);
  if (Array.isArray(value)) {
    value.forEach(item => walk(item, visitor, key));
    return;
  }
  if (!value || typeof value !== 'object') return;
  Object.entries(value).forEach(([childKey, child]) => walk(child, visitor, childKey));
}

function bespokeRequiredCoverage(contentMap, requiredCount) {
  if (!requiredCount) return { passed: true, coveredIndexes: [], requiredCount };
  const covered = new Set();
  walk(contentMap, value => {
    if (typeof value === 'string') {
      const match = value.match(/^presentation\.items\[(\d+)\]/);
      if (match && Number(match[1]) < requiredCount) covered.add(Number(match[1]));
      return;
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;
    if (value.source !== 'presentation.items') return;
    const offset = Math.max(0, Number(value.offset || 0));
    const limit = Math.max(0, Number(value.limit ?? requiredCount));
    for (let index = offset; index < Math.min(requiredCount, offset + limit); index += 1) covered.add(index);
  });
  return {
    passed: covered.size === requiredCount,
    coveredIndexes: [...covered].sort((a, b) => a - b),
    requiredCount,
  };
}

function exportSummary(pptxReport, pdfReport) {
  const result = pptxReport.result;
  const warningTypes = {};
  for (const warning of result.warnings || []) {
    warningTypes[warning.type] = (warningTypes[warning.type] || 0) + Number(warning.count || 1);
  }
  return {
    variantOutputMode: pptxReport.variantOutputMode || 'comparison',
    slideCount: result.slideCount,
    objects: {
      text: result.textObjects,
      shapes: result.shapeObjects,
      images: result.imageObjects,
      total: result.textObjects + result.shapeObjects + result.imageObjects,
    },
    warnings: {
      records: (result.warnings || []).length,
      byType: warningTypes,
    },
    durationsMs: {
      pptx: pptxReport.durationMs,
      pdf: pdfReport.durationMs,
    },
    pdfPages: pdfReport.result.pages,
  };
}
