import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const LOCKED_COMMIT = '7cb23347f91cda1a5519eafc8c040704e389535a';
const testDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(testDirectory, '..');
const upstreamRoot = join(projectRoot, 'upstream', 'dashi-ppt-skill');

function upstreamFile(relativePath) {
  try {
    return readFileSync(join(upstreamRoot, relativePath), 'utf8');
  } catch (error) {
    error.message = `${error.message}\nRun scripts/fetch-upstream.ps1 before this test.`;
    throw error;
  }
}

function projectFile(relativePath) {
  return upstreamFile(join('skills', 'dashi-ppt', 'project', relativePath));
}

test('the checkout is pinned to the reviewed upstream version and split license boundary', () => {
  assert.ok(existsSync(upstreamRoot), 'Run scripts/fetch-upstream.ps1 before this test.');
  const actualCommit = execFileSync(
    'git',
    ['-C', upstreamRoot, 'rev-parse', 'HEAD'],
    { encoding: 'utf8' }
  ).trim();
  const runtimePackage = JSON.parse(projectFile('package.json'));
  const rootLicense = upstreamFile('LICENSE');
  const exporterLicense = projectFile(join('packages', 'html-deck-to-pptx', 'LICENSE'));

  assert.equal(actualCommit, LOCKED_COMMIT);
  assert.equal(runtimePackage.version, '0.4.11');
  assert.match(rootLicense, /GNU AFFERO GENERAL PUBLIC LICENSE/);
  assert.match(exporterLicense, /proprietary software/i);
  assert.match(exporterLicense, /SOLELY as an integrated\s+component/);
});

test('the checked-in manifest contains the advertised layout and control inventory', () => {
  const manifest = JSON.parse(projectFile('layout-manifest.json'));
  const layouts = Object.values(manifest.layouts || {});
  const controlCount = layouts.reduce(
    (total, layout) => total + (Array.isArray(layout.controls) ? layout.controls.length : 0),
    0
  );
  const themes = new Set(layouts.map((layout) => layout.themePack));

  assert.equal(layouts.length, 1020);
  assert.equal(controlCount, 8576);
  assert.equal(themes.size, 12);
});

test('schema v2 separates canonical content from three template variants and one bespoke variant', () => {
  const skill = upstreamFile(join('skills', 'dashi-ppt', 'SKILL.md'));
  const schema = JSON.parse(upstreamFile(join('skills', 'dashi-ppt', 'references', 'goal-spec.schema.json')));
  const schemaText = JSON.stringify(schema);

  assert.match(skill, /3 个模板方案和 1 个 Agent 定制方案/);
  assert.match(skill, /slide\.content\.presentation/);
  assert.match(skill, /contentMap/);
  assert.match(schemaText, /schemaVersion/);
  assert.match(schemaText, /bespoke/);
});

test('the runtime exposes deterministic scaffold, validation, render, preview and export commands', () => {
  const packageJson = JSON.parse(projectFile('package.json'));
  const requiredScripts = [
    'layout:query',
    'inspect:layout',
    'goal:scaffold',
    'validate:goal-spec',
    'render:goal',
    'validate:swiss',
    'validate:goal-copy',
    'validate:four-variant-quality',
    'export:pptx',
    'export:pdf',
  ];

  for (const script of requiredScripts) {
    assert.equal(typeof packageJson.scripts?.[script], 'string', `missing npm script ${script}`);
  }
  assert.equal(packageJson.engines, undefined);
  assert.equal(packageJson.dependencies?.react, '^18.3.1');
  assert.equal(packageJson.dependencies?.pptxgenjs, '^4.0.1');
});

test('layout allocation scores deck-wide diversity and penalizes repeated structures', () => {
  const allocation = projectFile(join('scripts', 'workflow', 'layout-allocation.mjs'));

  assert.match(allocation, /selectDiverseLayouts/);
  assert.match(allocation, /DEFAULT_BEAM_WIDTH/);
  assert.match(allocation, /layoutReuse/);
  assert.match(allocation, /tripletUsage/);
  assert.match(allocation, /rebalanceDuplicateLayouts/);
});

test('the browser artifact supports inline editing, local draft fallback and server autosave', () => {
  const template = projectFile(join('assets', 'template-swiss.html'));

  assert.match(template, /contenteditable/);
  assert.match(template, /indexedDB\.open/);
  assert.match(template, /localStorage\.setItem/);
  assert.match(template, /\/api\/save-deck-state/);
  assert.match(template, /draggable/);
});

test('PPTX export is DOM-driven and its distributed implementation remains proprietary', () => {
  const exporterReadme = projectFile(join('packages', 'html-deck-to-pptx', 'README.md'));
  const exporterSource = projectFile(join('packages', 'html-deck-to-pptx', 'src', 'editable.mjs'));

  assert.match(exporterReadme, /实时 DOM/);
  assert.match(exporterReadme, /文字重新抽回来保持可编辑/);
  assert.match(exporterSource, /专有组件/);
  assert.match(exporterSource, /dist\/editable\.min\.mjs/);
});

test('the default preview binding is LAN-reachable and must be treated as a privacy boundary', () => {
  const server = projectFile(join('scripts', 'serve-preview-https.mjs'));
  const startServer = projectFile(join('scripts', 'start-preview-server.mjs'));

  assert.match(server, /process\.env\.HOST \|\| '0\.0\.0\.0'/);
  assert.match(startServer, /DASHI_PPT_PREVIEW_HOST/);
  assert.match(startServer, /127\.0\.0\.1/);
});
