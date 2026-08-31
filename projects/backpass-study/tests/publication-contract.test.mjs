import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(testDirectory, "..");
const repositoryRoot = resolve(projectRoot, "..", "..");
const readProjectFile = (name) => readFileSync(join(projectRoot, name), "utf8");

const RESEARCH_ID = "R-002";
const ORDINAL = "第 2 个研究子项目";
const LOCKED_SOURCE_URL =
  "https://github.com/kunchenguid/backpass/tree/d8cbdb68ca20a9ad6626810e0c24a576e43223c7";
const GITHUB_DIRECTORY_URL =
  "https://github.com/yydshly/0830_1_codex_project/tree/main/projects/backpass-study";
const ONLINE_RESEARCH_URL =
  "https://yydshly.github.io/0830_1_codex_project/projects/backpass-study/";
const ONLINE_WEB_URL = `${ONLINE_RESEARCH_URL}demo/`;

test("every public surface uses the stable R-002 identity", () => {
  const surfaces = [
    readProjectFile("README.md"),
    readProjectFile("index.md"),
    readProjectFile(join("demo", "index.html")),
  ];

  for (const surface of surfaces) {
    assert.ok(surface.includes(RESEARCH_ID), `${RESEARCH_ID} must identify every public surface`);
    assert.ok(surface.includes(ORDINAL), `${ORDINAL} must identify every public surface`);
  }
});

test("project README indexes the fixed source and all public entry points", () => {
  const projectReadme = readProjectFile("README.md");

  for (const url of [LOCKED_SOURCE_URL, GITHUB_DIRECTORY_URL, ONLINE_RESEARCH_URL, ONLINE_WEB_URL]) {
    assert.ok(projectReadme.includes(url), `Project README must index ${url}`);
  }
  assert.match(projectReadme, /项目记忆优化器/);
  assert.match(projectReadme, /不是模型训练框架/);
  assert.match(projectReadme, /1 < 2/);
  assert.match(projectReadme, /HOLD/);
});

test("root research index publishes the concise R-002 summary", () => {
  const rootReadme = readFileSync(join(repositoryRoot, "README.md"), "utf8");

  for (const value of [RESEARCH_ID, LOCKED_SOURCE_URL, ONLINE_RESEARCH_URL, ONLINE_WEB_URL]) {
    assert.ok(rootReadme.includes(value), `Root research index must include ${value}`);
  }
  assert.ok(rootReadme.includes(ORDINAL), `Root research index must include ${ORDINAL}`);
  assert.match(rootReadme, /不是模型训练/);
  assert.match(rootReadme, /99\.5%/);
  assert.match(rootReadme, /保持 HOLD/);
});

test("interactive Web exposes online research, GitHub and fixed upstream indexes", () => {
  const html = readProjectFile(join("demo", "index.html"));

  for (const value of [RESEARCH_ID, ORDINAL, GITHUB_DIRECTORY_URL, LOCKED_SOURCE_URL]) {
    assert.ok(html.includes(value), `Interactive Web must expose ${value}`);
  }
  assert.match(html, /<title>R-002/);
  assert.match(html, /href="\.\.\/">在线研究页<\/a>/);
});
