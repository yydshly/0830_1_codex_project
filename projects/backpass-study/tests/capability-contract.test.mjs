import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const LOCKED_COMMIT = "d8cbdb68ca20a9ad6626810e0c24a576e43223c7";
const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const upstreamRoot = join(projectRoot, "upstream", "backpass");

function upstreamFile(relativePath) {
  const absolute = join(upstreamRoot, relativePath);
  assert.ok(
    existsSync(absolute),
    `missing ${relativePath}; run projects/backpass-study/scripts/fetch-upstream.ps1 first`,
  );
  return readFileSync(absolute, "utf8");
}

function git(...args) {
  const safeRoot = upstreamRoot.replace(/\\/g, "/");
  return execFileSync("git", ["-c", `safe.directory=${safeRoot}`, "-C", upstreamRoot, ...args], {
    encoding: "utf8",
  }).trim();
}

test("upstream identity, runtime and license are pinned", () => {
  assert.equal(git("rev-parse", "HEAD"), LOCKED_COMMIT);

  const pkg = JSON.parse(upstreamFile("package.json"));
  assert.equal(pkg.name, "backpass");
  assert.equal(pkg.version, "0.1.14");
  assert.equal(pkg.license, "MIT");
  assert.equal(pkg.engines.node, ">=22.5.0");
  assert.match(upstreamFile("LICENSE"), /^MIT License/m);
});

test("the pipeline discovers, analyzes, folds and synthesizes before apply", () => {
  const run = upstreamFile("src/commands/run.js");
  assert.match(run, /runAnalysis/);
  assert.match(run, /runProposal/);

  const config = upstreamFile("src/config.js");
  for (const harness of ["claude", "codex", "pi", "opencode", "grok", "cursor", "hermes"]) {
    assert.match(config, new RegExp(`"${harness}"`));
  }

  const cli = upstreamFile("src/cli.js");
  for (const command of ["scan", "analyze", "propose", "apply", "status", "init"]) {
    assert.match(cli, new RegExp(`\\b${command}\\b`));
  }
});

test("evidence and proposal gates are implemented in code", () => {
  const analyze = upstreamFile("src/analyze.js");
  assert.match(analyze, /NEGATIVE_CLASSES = \["harm", "non-compliance", "irrelevant"\]/);
  assert.match(analyze, /verbatim quote/i);

  const fold = upstreamFile("src/fold.js");
  assert.match(fold, /minGapEvidence = 2/);
  assert.match(fold, /harmSessions/);

  const proposal = upstreamFile("src/proposal.js");
  assert.match(proposal, /carries no verbatim evidence quote/);
  assert.match(proposal, /non-compliance never counts/);
  assert.match(proposal, /budgetGateKind/);
});

test("sampling, redaction and guarded writes form explicit safety boundaries", () => {
  const sample = upstreamFile("src/sample.js");
  assert.match(sample, /Math\.pow\(2, -age \/ halfLifeMs\)/);
  assert.match(sample, /-Math\.log\(u\) \/ recencyWeight/);

  const redact = upstreamFile("src/redact.js");
  for (const marker of ["OPENAI_KEY", "GITHUB_TOKEN", "AWS_ACCESS_KEY_ID", "PRIVATE_KEY"]) {
    assert.match(redact, new RegExp(marker));
  }

  const writer = upstreamFile("src/apply/writer.js");
  assert.match(writer, /The only place in backpass that writes to the repo/);
  assert.match(writer, /memoryFileSnapshot/);
  assert.match(writer, /rollbackCommitted/);
});

test("project skills are part of the improvable memory surface", () => {
  const analysisPrompt = upstreamFile("src/prompts/analysis.md");
  const synthesisPrompt = upstreamFile("src/prompts/synthesis.md");
  assert.match(analysisPrompt, /Project skills \(load-on-trigger\)/);
  assert.match(analysisPrompt, /failed trigger/);
  assert.match(synthesisPrompt, /Skill descriptions are weights too/);
});
