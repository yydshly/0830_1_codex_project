import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readProject = (name) => readFile(resolve(projectRoot, name), "utf8");

test("单条真实历史证据只保存不可逆派生结果", async () => {
  const text = await readProject("artifacts/real-codex-session-analysis.json");
  const evidence = JSON.parse(text);

  assert.deepEqual(evidence.source, {
    library: "backpass",
    version: "0.1.14",
    commit: "d8cbdb68ca20a9ad6626810e0c24a576e43223c7",
    harness: "codex",
  });
  assert.equal(evidence.scope.selectedSessions, 1);
  assert.match(evidence.scope.fingerprint, /^sha256:[0-9a-f]{12}$/);
  assert.equal(evidence.scope.rawTranscriptCommitted, false);
  assert.equal(evidence.scope.externalModelCalled, false);
  assert.equal(evidence.scope.backpassStateCreated, false);
  assert.equal(evidence.scope.agentRulesModified, false);

  assert.deepEqual(evidence.association, {
    strict: true,
    tier: 1,
    confidence: "exact",
    exactRepositoryCwd: true,
    topLevelUserSession: true,
    recordedCommitResolvable: true,
  });
  assert.equal(evidence.deterministicPipeline.normalizedEvents, 175);
  assert.equal(evidence.deterministicPipeline.rawBytes, 5282189);
  assert.equal(evidence.deterministicPipeline.distilledBytes, 26455);
  assert.equal(evidence.deterministicPipeline.compressionPercent, 99.5);
  assert.equal(evidence.deterministicPipeline.toolCalls, 147);

  assert.equal(evidence.analysisBoundary.upstreamLlmAnalysisRun, false);
  assert.equal(evidence.analysisBoundary.interpretationOwner, "researcher");
  assert.deepEqual(evidence.evidenceGate, {
    candidateSessions: 1,
    defaultMinimumForNewGap: 2,
    comparison: "1 < 2",
    status: "hold",
    proposalGenerated: false,
  });
  assert.equal(evidence.researchInterpretation.candidateMemoryGap.proposedRule, false);
  assert.ok(evidence.researchInterpretation.observations.every((item) => item.upstreamVerdict === false));

  assert.doesNotMatch(text, /[A-Z]:\\/i, "artifact 不得含本机绝对路径");
  assert.doesNotMatch(text, /rollout-20\d{2}/i, "artifact 不得含原始会话文件名");
  assert.doesNotMatch(text, /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i);
  for (const forbiddenKey of ["rawPath", "trace", "messages", "rawText", "sessionId", "repositoryUrl"]) {
    assert.equal(Object.hasOwn(evidence, forbiddenKey), false, `不应存在顶层字段 ${forbiddenKey}`);
  }
});

test("单文件研究脚本停在本地确定性阶段", async () => {
  const script = await readProject("scripts/analyze-one-codex-session.mjs");
  for (const symbol of ["codex.classify", "associate", "passesStrict", "readTranscript", "distill"]) {
    assert.match(script, new RegExp(symbol.replace(".", "\\.")), `缺少 ${symbol}`);
  }
  assert.match(script, /rawPath:\s*"\[withheld\]"/);
  assert.match(script, /assertReviewOutsideRepository/);
  assert.doesNotMatch(script, /analyzeTranscripts|execOneShot|acpx\.js/);
  assert.doesNotMatch(script, /\.backpass[\\/]/);
});
