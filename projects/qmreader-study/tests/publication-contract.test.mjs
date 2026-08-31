import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const testDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(testDirectory, '..');
const repositoryRoot = resolve(projectRoot, '..', '..');
const readProjectFile = (name) => readFileSync(join(projectRoot, name), 'utf8');

const RESEARCH_ID = 'R-005';
const LOCKED_SOURCE_URL = 'https://github.com/joeseesun/qmreader/tree/95efab925273924963d2fdb474a67890261402e3';
const GITHUB_DIRECTORY_URL = 'https://github.com/yydshly/0830_1_codex_project/tree/main/projects/qmreader-study';
const ONLINE_RESEARCH_URL = 'https://yydshly.github.io/0830_1_codex_project/projects/qmreader-study/';
const ONLINE_SHOWCASE_URL = `${ONLINE_RESEARCH_URL}site/`;

test('every public surface uses the stable research identity', () => {
  const projectReadme = readProjectFile('README.md');
  const projectIndex = readProjectFile('index.md');
  const siteHtml = readProjectFile(join('site', 'index.html'));

  for (const surface of [projectReadme, projectIndex, siteHtml]) {
    assert.ok(surface.includes(RESEARCH_ID), `${RESEARCH_ID} must identify every public project surface`);
  }
  assert.match(projectReadme, /第 5 项/);
  assert.match(projectIndex, /第 5 个研究子项目/);
  assert.match(siteHtml, /第 5 个研究子项目/);
});

test('the external README indexes source, GitHub and both online entry points', () => {
  const projectReadme = readProjectFile('README.md');

  for (const url of [LOCKED_SOURCE_URL, GITHUB_DIRECTORY_URL, ONLINE_RESEARCH_URL, ONLINE_SHOWCASE_URL]) {
    assert.ok(projectReadme.includes(url), `Project README must index ${url}`);
  }
  assert.match(projectReadme, /不是供其他程序调用的通用 RSS 库/);
});

test('the repository research index contains the concise published summary', () => {
  const rootReadme = readFileSync(join(repositoryRoot, 'README.md'), 'utf8');

  for (const value of [RESEARCH_ID, LOCKED_SOURCE_URL, ONLINE_RESEARCH_URL, ONLINE_SHOWCASE_URL]) {
    assert.ok(rootReadme.includes(value), `Root research index must include ${value}`);
  }
  assert.match(rootReadme, /不是通用 RSS SDK/);
});
