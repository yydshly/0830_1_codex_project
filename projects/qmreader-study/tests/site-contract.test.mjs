import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const testDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(testDirectory, '..');
const siteRoot = join(projectRoot, 'site');
const readSiteFile = (name) => readFileSync(join(siteRoot, name), 'utf8');

test('the study page contains every user-requested research section', () => {
  const html = readSiteFile('index.html');
  assert.match(html, /R-005/);
  assert.match(html, /第 5 个研究子项目/);
  for (const id of ['demo', 'capabilities', 'architecture', 'scenarios', 'roadmap', 'meaning', 'evidence']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /把订阅流/);
  assert.match(html, /用网页方式|交互式研究展览|运行完整演示/);
  assert.match(html, /尚未证明/);
});

test('the scenario lab exposes three selectable five-stage demonstrations', () => {
  const html = readSiteFile('index.html');
  const script = readSiteFile('app.js');

  assert.equal([...html.matchAll(/data-scenario-select=/g)].length, 3);
  assert.equal([...html.matchAll(/data-scenario-card=/g)].length, 8);
  assert.match(html, /直接适用/);
  assert.match(html, /轻量扩展/);
  assert.match(html, /深度改造/);
  assert.match(html, /data-demo-toggle/);
  assert.match(html, /data-demo-reset/);
  assert.match(html, /aria-live=["']polite["']/);
  assert.match(script, /'ai-intel'/);
  assert.match(script, /'paper-radar'/);
  assert.match(script, /'product-signals'/);
  assert.match(script, /buildStages/);
  assert.match(script, /idle/);
  assert.match(script, /running/);
  assert.match(script, /paused/);
  assert.match(script, /complete/);
  assert.match(script, /STRUCTURED TRANSLATION/);
  assert.match(script, /PUBLIC READING ASSET/);
  assert.match(script, /PUBLISHED PAPER CARD/);
  assert.match(script, /PUBLISHED SIGNAL CARD/);
  assert.match(script, /aria-pressed/);
});

test('the visual system declares desktop, tablet, phone, theme and reduced-motion behavior', () => {
  const html = readSiteFile('index.html');
  const css = readSiteFile('styles.css');

  assert.match(html, /data-theme-toggle/);
  assert.match(css, /html\[data-theme="dark"\]/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible/);
});

test('the page remains a self-contained static artifact without external frontend dependencies', () => {
  const html = readSiteFile('index.html');
  const server = readSiteFile('server.mjs');

  assert.doesNotMatch(html, /<(?:script|link)[^>]+(?:https?:)?\/\//i);
  assert.match(html, /<noscript>/);
  assert.match(server, /QMREADER_SITE_PORT/);
  assert.match(server, /127\.0\.0\.1/);
});
