import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const LOCKED_COMMIT = '95efab925273924963d2fdb474a67890261402e3';
const testDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(testDirectory, '..');
const upstreamRoot = join(projectRoot, 'upstream', 'qmreader');

function upstreamFile(relativePath) {
  try {
    return readFileSync(join(upstreamRoot, relativePath), 'utf8');
  } catch (error) {
    error.message = `${error.message}\nRun scripts/fetch-upstream.ps1 before this test.`;
    throw error;
  }
}

test('the checkout is pinned to the reviewed MIT-licensed upstream commit', () => {
  assert.ok(existsSync(upstreamRoot), 'Run scripts/fetch-upstream.ps1 before this test.');
  const actualCommit = execFileSync(
    'git',
    ['-C', upstreamRoot, 'rev-parse', 'HEAD'],
    { encoding: 'utf8' }
  ).trim();
  const packageJson = JSON.parse(upstreamFile('package.json'));
  const license = upstreamFile('LICENSE');

  assert.equal(actualCommit, LOCKED_COMMIT);
  assert.equal(packageJson.license, 'MIT');
  assert.match(license, /^MIT License/m);
});

test('the source layer supports feeds, RSSHub candidates, sitemaps and WordPress JSON', () => {
  const sources = upstreamFile(join('lib', 'sources.js'));
  const fetcher = upstreamFile(join('lib', 'fetcher.js'));

  assert.match(sources, /\{rsshub\}/);
  assert.match(sources, /sitemap:/);
  assert.match(sources, /wpjson:/);
  assert.match(fetcher, /async function parseFeedUrl/);
  assert.match(fetcher, /async function parseSitemapFeed/);
  assert.match(fetcher, /async function parseWpJsonFeed/);
});

test('fetch and AI post-processing run as separately identified workers', () => {
  const server = upstreamFile('server.js');
  const jobs = upstreamFile(join('lib', 'background-jobs.js'));

  assert.match(server, /QMREADER_WORKER_KIND: 'fetch'/);
  assert.match(server, /QMREADER_WORKER_KIND: 'ai'/);
  assert.match(server, /queueAutoRewriteForRefresh/);
  assert.match(server, /freshnessCandidates/);
  assert.match(jobs, /async function translateMissingTitles/);
  assert.match(jobs, /async function autoRewriteEntries/);
});

test('translation is chunked and rejects structurally incomplete model output', () => {
  const ai = upstreamFile(join('lib', 'deepseek.js'));

  assert.match(ai, /function chunkTranslationBlocks/);
  assert.match(ai, /function translationHtmlPreservesResources/);
  assert.match(ai, /function translationHtmlPreservesStructure/);
  assert.match(ai, /function translationTextHasCoverage/);
  assert.match(ai, /漏译.*未保存不完整结果/);
  assert.match(ai, /translationInputHash/);
});

test('Article Agent is bounded single-entry context rather than vector retrieval', () => {
  const ai = upstreamFile(join('lib', 'deepseek.js'));
  const packageJson = upstreamFile('package.json');

  assert.match(ai, /function articleContext/);
  assert.match(ai, /slice\(0, 8000\)/);
  assert.match(ai, /slice\(-12\)/);
  assert.doesNotMatch(`${ai}\n${packageJson}`, /\b(?:embedding|pgvector|chromadb|vectorStore)\b/i);
});

test('reading outputs are persisted as assets with contribution and interaction data', () => {
  const store = upstreamFile(join('lib', 'store.js'));

  for (const table of [
    'entry_translations',
    'entry_rewrites',
    'entry_ai_asset_contributions',
    'commentaries',
    'text_annotations',
    'chat_messages',
    'entry_asset_reactions',
  ]) {
    assert.match(store, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`));
  }
});

test('public assets are distributed through pages, RSS, contributors and sitemap routes', () => {
  const server = upstreamFile('server.js');

  assert.match(server, /app\.get\('\/assets\.xml'/);
  assert.match(server, /app\.get\('\/assets\/:type\.xml'/);
  assert.match(server, /app\.get\('\/contributors\/:id\.xml'/);
  assert.match(server, /app\.get\('\/sitemap\.xml'/);
  assert.match(server, /app\.get\('\/llms\.txt'/);
});

test('outbound content fetching validates and pins public DNS targets', () => {
  const fetcher = upstreamFile(join('lib', 'fetcher.js'));

  assert.match(fetcher, /function isNonPublicIpAddress/);
  assert.match(fetcher, /async function resolvePublicTarget/);
  assert.match(fetcher, /function createPinnedLookup/);
  assert.match(fetcher, /async function fetchPublicBuffer/);
});
