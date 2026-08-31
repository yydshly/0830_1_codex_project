import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(here, 'goal.json');
const outputPath = path.join(here, 'goal.selected-v4.json');
const goal = JSON.parse(readFileSync(sourcePath, 'utf8'));

goal.variantOutputMode = 'selected-only';
goal.slides.forEach(slide => {
  slide.selectedVariant = 'v4';
});

writeFileSync(outputPath, `${JSON.stringify(goal, null, 2)}\n`);
console.log(JSON.stringify({ outputPath, slideCount: goal.slides.length, selectedVariant: 'v4' }, null, 2));
