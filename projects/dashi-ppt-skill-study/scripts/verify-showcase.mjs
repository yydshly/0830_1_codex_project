import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(here, '../upstream/dashi-ppt-skill/skills/dashi-ppt/project');
const requireFromProject = createRequire(path.join(project, 'package.json'));
const { chromium } = requireFromProject('playwright-core');
const { getExportBrowserPath } = await import(pathToFileURL(path.join(project, 'scripts/chrome-path.mjs')).href);
const url = process.argv[2] || 'http://127.0.0.1:4175/projects/dashi-ppt-skill-study/showcase/';
const evidenceDir = path.resolve(here, '../artifacts/frontend-evidence');
mkdirSync(evidenceDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: getExportBrowserPath() });
const results = [];

try {
  for (const [name, viewport] of [['desktop-r003-release', { width: 1440, height: 1000 }], ['tablet-r003-release', { width: 768, height: 1024 }], ['mobile-r003-release', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(error.message));
    if (name.startsWith('mobile')) await page.emulateMedia({ reducedMotion: 'reduce' });
    const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-example-scenario="training"]').click();
    await page.locator('[data-run02-route="dashi"]').focus();
    await page.keyboard.press('ArrowRight');
    await page.locator('[data-run02-page="4"]').click();
    await page.waitForFunction(() => document.querySelector('[data-run02-image]')?.getAttribute('src')?.includes('direct-programmatic-baseline/slide-4.png'));
    const downloadLinks = await page.locator('.run02-downloads a').evaluateAll(links => links.map(link => link.href));
    const downloadStatuses = [];
    for (const href of downloadLinks) {
      const downloadResponse = await page.request.head(href);
      downloadStatuses.push({ href, status: downloadResponse.status() });
    }
    const snapshot = await page.evaluate(() => ({
      researchId: document.querySelector('.brand strong')?.textContent,
      exampleCount: document.querySelectorAll('.example-card').length,
      selectedScenario: document.querySelector('[data-scenario][aria-selected="true"]')?.dataset.scenario,
      route: document.querySelector('[data-run02-route][aria-selected="true"]')?.dataset.run02Route,
      image: document.querySelector('[data-run02-image]')?.getAttribute('src'),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    }));
    await page.evaluate(() => {
      const examples = document.querySelector('#examples');
      const header = document.querySelector('.site-header');
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({ top: examples.offsetTop - (header?.offsetHeight || 0), behavior: 'instant' });
    });
    await page.waitForTimeout(50);
    await page.screenshot({ path: path.join(evidenceDir, `${name}.png`), fullPage: false });
    results.push({ name, status: response?.status(), errors, downloadStatuses, ...snapshot });
    await page.close();
  }
} finally {
  await browser.close();
}

const passed = results.every(result => result.status === 200
  && !result.errors.length
  && !result.overflow
  && result.researchId?.includes('R-003')
  && result.exampleCount === 6
  && result.selectedScenario === 'training'
  && result.route === 'direct'
  && result.image?.includes('direct-programmatic-baseline/slide-4.png')
  && result.downloadStatuses.every(item => item.status === 200));
const report = { generatedAt: new Date().toISOString(), url, passed, results };
writeFileSync(path.join(evidenceDir, 'real-run-browser-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exit(1);
