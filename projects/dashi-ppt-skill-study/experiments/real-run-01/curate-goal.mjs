import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const sourceName = process.argv[2] || 'goal.candidate-r03.json';
const outputName = process.argv[3] || 'goal.json';
const sourcePath = path.resolve(here, sourceName);
const outputPath = path.resolve(here, outputName);

if (outputName === 'goal.json') {
  const existing = path.resolve(here, 'goal.json');
  try {
    copyFileSync(existing, path.resolve(here, 'goal.failed-r01.json'));
  } catch {}
}

const goal = JSON.parse(readFileSync(sourcePath, 'utf8'));

// PowerPoint render QA found that theme07_page057 converts the first metric
// label into an oversized ghost word. Keep the same canonical facts, but use a
// compatible four-row evidence table from the same theme.
goal.slides[3].variants[0] = {
  id: 'v1',
  kind: 'template',
  layout: 'theme07_page035',
  props: {
    rowCount: 4,
    showShare: false,
    showJudgment: true,
    focusEnabled: true,
    focusIndex: 1,
  },
  contentMap: {
    title: 'presentation.titleShort',
    lead: 'presentation.summary',
    rows: {
      source: 'presentation',
      derive: 'template-items',
      includeTextFallback: true,
      filter: 'value-bearing',
      limit: 4,
      fields: {
        dim: 'label',
        tier: 'unit',
        val: 'displayValue',
        note: 'detail',
      },
    },
    eyebrow: 'meta.panelTitle',
    marker: 'meta.pageLabel',
    segment: 'presentation.summaryShort',
    titleTail: 'presentation.titleShort',
    statLine: 'presentation.takeaway',
    anchorValue: 'presentation.items[1].displayValue',
    anchorUnit: 'presentation.items[1].unit',
    anchorLabel: 'presentation.items[1].label',
    closing: 'presentation.summaryShort',
    'colHeads.dim': 'meta.panelTitle',
    'colHeads.val': 'presentation.items[0].unit',
    'colHeads.share': 'presentation.items[1].unit',
    'colHeads.note': 'presentation.summaryShort',
  },
};

// theme07_page026 is an image/investor composition; with media suppressed it
// enlarged comparison copy beyond the PPTX canvas. Use the same theme's
// breakdown layout and retain all three format facts.
goal.slides[4].variants[1] = {
  id: 'v2',
  kind: 'template',
  layout: 'theme07_page007',
  props: {
    cardCount: 3,
    columns: 3,
    focusEnabled: true,
    focusIndex: 2,
  },
  contentMap: {
    title: 'presentation.titleShort',
    lead: 'presentation.summary',
    sub: 'presentation.takeaway',
    chapters: {
      source: 'presentation',
      derive: 'template-items',
      includeTextFallback: true,
      limit: 3,
      fields: {
        no: 'projectionOrdinal',
        zh: 'label',
        en: 'projectionLabel',
      },
    },
    eyebrow: 'meta.panelTitle',
    closing: 'presentation.summaryShort',
  },
};

writeFileSync(outputPath, JSON.stringify(goal));
console.log(JSON.stringify({ sourcePath, outputPath, curated: ['slide-4::v1', 'slide-5::v2'] }, null, 2));
