import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const rawPath = path.join(here, 'goal.raw.json');
const fillPath = path.join(here, 'goal.raw.fill-plan.json');
const outPath = path.join(here, 'goal.json');
const mediaPath = 'assets/user-media/gridwise-energy-control-room.png';

const goal = JSON.parse(readFileSync(rawPath, 'utf8'));
const fillPlan = JSON.parse(readFileSync(fillPath, 'utf8'));

// The upstream scaffold selects media-capable layouts but deliberately leaves
// actual media binding to the agent. Bind the same staged asset to each of the
// three alternatives for logical slide 2, respecting each layout's real slot.
const slide2 = goal.slides[1];
const slide2Plan = fillPlan.slides[1];
slide2.content.presentation.mediaAlt = '工业园区能源中控室模拟主视觉';
for (const variant of slide2.variants.filter(item => item.kind === 'template')) {
  const plan = slide2Plan.variants.find(item => item.id === variant.id);
  const slot = plan?.fillPlan?.media?.find(item => item.write?.startsWith('props.'));
  if (!slot) throw new Error(`No preset media slot for slide 2 ${variant.id}`);
  variant.props ||= {};
  variant.props[slot.key] = [mediaPath];
  if (slot.countKey) variant.props[slot.countKey] = 1;
  delete variant.plannedImages;
}

// Art-direct the bespoke media page: the photo is the evidence surface, while
// the three baseline facts stay editable in the adjacent list.
const v4Media = slide2.variants.find(item => item.id === 'v4');
v4Media.composition.designIntent.compositionFamily = 'split';
v4Media.composition.designIntent.rationale = '以真实场景图建立业务语境，右侧保留三项可审计基线';
v4Media.composition.background = 'dark';
v4Media.composition.elements = [
  {
    id: 'page-kicker', type: 'text',
    grid: { column: 1, row: 1, width: 5, height: 1 },
    role: 'kicker', tone: 'accent', align: 'left', text: '',
  },
  {
    id: 'page-label', type: 'text',
    grid: { column: 11, row: 1, width: 2, height: 1 },
    role: 'label', tone: 'muted', align: 'right', text: '',
  },
  {
    id: 'page-title', type: 'text',
    grid: { column: 1, row: 2, width: 11, height: 2 },
    role: 'title', tone: 'default', align: 'left', text: '',
  },
  {
    id: 'control-room', type: 'media',
    grid: { column: 1, row: 4, width: 7, height: 5 },
    src: '', alt: '', fit: 'cover',
  },
  {
    id: 'baseline-facts', type: 'list',
    grid: { column: 8, row: 4, width: 5, height: 5 },
    ordered: false, tone: 'accent', items: [],
  },
];
v4Media.contentMap = {
  'elements[0].text': 'meta.panelTitle',
  'elements[1].text': 'meta.pageLabel',
  'elements[2].text': 'presentation.title',
  'elements[3].src': 'media[0]',
  'elements[3].alt': 'presentation.mediaAlt',
  'elements[4].items': {
    source: 'presentation.items',
    fields: { title: 'labelWithValue', body: 'detail' },
    limit: 3,
  },
};

// Make the selected data page visibly chart-led instead of another quote grid.
const slide4 = goal.slides[3];
const v4Chart = slide4.variants.find(item => item.id === 'v4');
v4Chart.composition.designIntent.compositionFamily = 'chart-led';
v4Chart.composition.designIntent.rationale = '以负荷占比图为主视觉，结论和行动含义置于右侧';
v4Chart.composition.elements = [
  {
    id: 'page-kicker', type: 'text',
    grid: { column: 1, row: 1, width: 5, height: 1 },
    role: 'kicker', tone: 'accent', align: 'left', text: '',
  },
  {
    id: 'page-label', type: 'text',
    grid: { column: 11, row: 1, width: 2, height: 1 },
    role: 'label', tone: 'muted', align: 'right', text: '',
  },
  {
    id: 'page-title', type: 'text',
    grid: { column: 1, row: 2, width: 10, height: 2 },
    role: 'title', tone: 'default', align: 'left', text: '',
  },
  {
    id: 'main-chart', type: 'chart',
    grid: { column: 1, row: 4, width: 8, height: 5 },
    tone: 'accent', chartType: 'bar', data: [], showValues: true,
  },
  {
    id: 'chart-summary', type: 'text',
    grid: { column: 9, row: 4, width: 4, height: 2 },
    role: 'subtitle', tone: 'default', align: 'left', text: '',
  },
  {
    id: 'chart-takeaway', type: 'text',
    grid: { column: 9, row: 7, width: 4, height: 2 },
    role: 'body', tone: 'accent', align: 'left', text: '',
  },
];
v4Chart.contentMap = {
  'elements[0].text': 'meta.panelTitle',
  'elements[1].text': 'meta.pageLabel',
  'elements[2].text': 'presentation.title',
  'elements[3].data': {
    source: 'presentation.chartData',
    fields: { label: 'label', value: 'value', displayValue: 'displayValue', unit: 'unit' },
  },
  'elements[4].text': 'presentation.summary',
  'elements[5].text': 'presentation.takeaway',
};

// Make the execution slide an explicit left-to-right process.
const slide6 = goal.slides[5];
const v4Roadmap = slide6.variants.find(item => item.id === 'v4');
v4Roadmap.composition.designIntent.compositionFamily = 'process';
v4Roadmap.composition.designIntent.rationale = '以四阶段路径呈现 12 周的检查点与可回退机制';
v4Roadmap.composition.elements = [
  {
    id: 'page-kicker', type: 'text',
    grid: { column: 1, row: 1, width: 5, height: 1 },
    role: 'kicker', tone: 'accent', align: 'left', text: '',
  },
  {
    id: 'page-label', type: 'text',
    grid: { column: 11, row: 1, width: 2, height: 1 },
    role: 'label', tone: 'muted', align: 'right', text: '',
  },
  {
    id: 'page-title', type: 'text',
    grid: { column: 1, row: 2, width: 10, height: 2 },
    role: 'title', tone: 'default', align: 'left', text: '',
  },
  {
    id: 'process-items', type: 'list',
    grid: { column: 1, row: 4, width: 12, height: 5 },
    ordered: true, tone: 'accent', items: [],
  },
];
v4Roadmap.contentMap = {
  'elements[0].text': 'meta.panelTitle',
  'elements[1].text': 'meta.pageLabel',
  'elements[2].text': 'presentation.title',
  'elements[3].items': {
    source: 'presentation.items',
    fields: { title: 'labelWithValue', body: 'detail' },
    limit: 4,
  },
};

// Avoid an empty fourth quadrant on the three-item governance slide.
const slide7 = goal.slides[6];
const v4Guardrails = slide7.variants.find(item => item.id === 'v4');
v4Guardrails.composition.designIntent.compositionFamily = 'split';
v4Guardrails.composition.designIntent.rationale = '左侧列出三条护栏，右侧解释上线原则与最终控制权';
v4Guardrails.composition.elements = [
  {
    id: 'page-kicker', type: 'text',
    grid: { column: 1, row: 1, width: 5, height: 1 },
    role: 'kicker', tone: 'accent', align: 'left', text: '',
  },
  {
    id: 'page-label', type: 'text',
    grid: { column: 11, row: 1, width: 2, height: 1 },
    role: 'label', tone: 'muted', align: 'right', text: '',
  },
  {
    id: 'page-title', type: 'text',
    grid: { column: 1, row: 2, width: 10, height: 2 },
    role: 'title', tone: 'default', align: 'left', text: '',
  },
  {
    id: 'guardrail-list', type: 'list',
    grid: { column: 1, row: 4, width: 8, height: 5 },
    ordered: true, tone: 'accent', items: [],
  },
  {
    id: 'guardrail-summary', type: 'text',
    grid: { column: 9, row: 4, width: 4, height: 2 },
    role: 'subtitle', tone: 'default', align: 'left', text: '',
  },
  {
    id: 'guardrail-takeaway', type: 'text',
    grid: { column: 9, row: 7, width: 4, height: 2 },
    role: 'body', tone: 'accent', align: 'left', text: '',
  },
];
v4Guardrails.contentMap = {
  'elements[0].text': 'meta.panelTitle',
  'elements[1].text': 'meta.pageLabel',
  'elements[2].text': 'presentation.title',
  'elements[3].items': {
    source: 'presentation.items',
    fields: { title: 'labelWithValue', body: 'detail' },
    limit: 3,
  },
  'elements[4].text': 'presentation.summary',
  'elements[5].text': 'presentation.takeaway',
};

writeFileSync(outPath, `${JSON.stringify(goal, null, 2)}\n`);
console.log(JSON.stringify({ outPath, mediaBound: 4, artDirectedSlides: [2, 4, 6, 7] }, null, 2));
