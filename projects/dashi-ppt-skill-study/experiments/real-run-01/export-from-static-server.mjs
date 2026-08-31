import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(
  here,
  '../../upstream/dashi-ppt-skill/skills/dashi-ppt/project',
);
const requireFromProject = createRequire(path.join(projectRoot, 'package.json'));
const { chromium } = requireFromProject('playwright-core');
const { launchExportBrowser } = await import(pathToFileURL(
  path.join(projectRoot, 'scripts/preview/launch-export-browser.mjs'),
).href);
const { exportEditablePptxFromUrl } = await import(pathToFileURL(
  path.join(projectRoot, 'packages/html-deck-to-pptx/src/editable.mjs'),
).href);
const { exportScreenshotPdfFromUrl } = await import(pathToFileURL(
  path.join(projectRoot, 'packages/html-deck-to-pptx/src/screenshot.mjs'),
).href);

const args = process.argv.slice(2);
const pdf = args.includes('--pdf');
const selectedOnly = args.includes('--selected');
const positional = args.filter(value => value !== '--pdf' && value !== '--selected');
const [url, outFileArg, reportFileArg] = positional;

if (!url || !outFileArg || !reportFileArg) {
  console.error('Usage: node export-from-static-server.mjs <url> <out-file> <report-json> [--pdf] [--selected]');
  process.exit(2);
}

const outFile = path.resolve(outFileArg);
const reportFile = path.resolve(reportFileArg);
mkdirSync(path.dirname(outFile), { recursive: true });
mkdirSync(path.dirname(reportFile), { recursive: true });

const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Deck URL is not available: ${url} status=${response.status}`);
}

const browser = await launchExportBrowser(chromium, {
  fallbackTmpDirs: [path.join(here, '.browser-tmp')],
  log: message => console.warn(message),
});

try {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  const result = pdf
    ? await exportScreenshotPdfFromUrl(browser, url, {
        outFile,
        title: selectedOnly
          ? 'Dashi PPT Skill 真实采用研究精选稿'
          : 'Dashi PPT Skill 真实采用研究 3+1 比较稿',
      variantOutputMode: selectedOnly ? 'selected-only' : 'comparison',
    })
    : await exportEditablePptxFromUrl(browser, url, {
        outFile,
        title: selectedOnly
          ? 'Dashi PPT Skill 真实采用研究精选稿'
          : 'Dashi PPT Skill 真实采用研究 3+1 比较稿',
        variantOutputMode: selectedOnly ? 'selected-only' : 'comparison',
      });
  const report = {
    format: pdf ? 'pdf' : 'pptx',
    url,
    outFile,
    startedAt,
    finishedAt: new Date().toISOString(),
    durationMs: Date.now() - startedMs,
    variantOutputMode: selectedOnly ? 'selected-only' : 'comparison',
    result,
    note: 'Research harness bypassed the upstream HTTPS wrapper after its OpenSSL executable preflight failed. The actual upstream html-deck-to-pptx export engine and browser launcher were used unchanged against the same loopback deck URL.',
  };
  writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
