import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const LOCKED_COMMIT = "d5789f592af17980054052fc7c05fe8a8e46be79";
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const upstreamRoot = process.env.SOLO_SKILLS_UPSTREAM
  ? resolve(process.env.SOLO_SKILLS_UPSTREAM)
  : join(projectRoot, "upstream", "solo-skills");

function listFiles(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

test("upstream checkout is pinned to the researched commit", () => {
  assert.ok(existsSync(join(upstreamRoot, ".git")), "run scripts/fetch-upstream.ps1 first");
  const actualCommit = execFileSync("git", ["-C", upstreamRoot, "rev-parse", "HEAD"], {
    encoding: "utf8"
  }).trim();
  assert.equal(actualCommit, LOCKED_COMMIT);
});

test("upstream license is MIT", () => {
  const license = readFileSync(join(upstreamRoot, "LICENSE"), "utf8");
  assert.match(license, /^MIT License/m);
  assert.match(license, /Copyright \(c\) 2026 Ahn Taehyun/);
});

test("all 26 skills expose discoverable frontmatter", () => {
  const skillsRoot = join(upstreamRoot, "skills");
  const skillDirectories = readdirSync(skillsRoot)
    .filter((name) => statSync(join(skillsRoot, name)).isDirectory())
    .sort();

  assert.equal(skillDirectories.length, 26);

  for (const directory of skillDirectories) {
    const skillPath = join(skillsRoot, directory, "SKILL.md");
    assert.ok(existsSync(skillPath), `${directory} is missing SKILL.md`);

    const source = readFileSync(skillPath, "utf8");
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert.ok(frontmatter, `${directory} is missing YAML frontmatter`);
    assert.match(frontmatter[1], /^name:\s*[a-z0-9-]+\s*$/m, `${directory} has no valid name`);
    assert.match(frontmatter[1], /^description:\s*\S+/m, `${directory} has no description`);
  }
});

test("bundled executable source files match the locked baseline", () => {
  const codeExtensions = new Set([".mjs", ".py", ".sh"]);
  const codeFiles = listFiles(join(upstreamRoot, "skills"))
    .filter((path) => codeExtensions.has(extname(path)))
    .map((path) => path.slice(upstreamRoot.length + 1).replaceAll("\\", "/"))
    .sort();

  assert.equal(codeFiles.length, 9);
  assert.ok(codeFiles.includes("skills/book-pdf/scripts/html-to-pdf.py"));
  assert.ok(codeFiles.includes("skills/threads-reply/scripts/publish-thread.mjs"));
  assert.ok(codeFiles.includes("skills/notion-delete/notion_archive.py"));
});
