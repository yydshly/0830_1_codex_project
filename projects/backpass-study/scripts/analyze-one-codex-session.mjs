#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const studyRoot = path.resolve(scriptDir, "..");
const repositoryRoot = path.resolve(studyRoot, "..", "..");
const upstreamRoot = path.join(studyRoot, "upstream", "backpass");

const codex = await import(pathToFileURL(path.join(upstreamRoot, "src", "discovery", "adapters", "codex.js")).href);
const { associate, passesStrict } = await import(
  pathToFileURL(path.join(upstreamRoot, "src", "discovery", "association.js")).href
);
const { readTranscript } = await import(pathToFileURL(path.join(upstreamRoot, "src", "discovery", "index.js")).href);
const { resolveRepo } = await import(pathToFileURL(path.join(upstreamRoot, "src", "repo.js")).href);
const { distill } = await import(pathToFileURL(path.join(upstreamRoot, "src", "distill.js")).href);
const { transcriptIdentity } = await import(pathToFileURL(path.join(upstreamRoot, "src", "transcript.js")).href);

const UPSTREAM_COMMIT = "d8cbdb68ca20a9ad6626810e0c24a576e43223c7";
const UPSTREAM_VERSION = "0.1.14";

const args = parseArgs(process.argv.slice(2));
if (!args.file || !args.artifact) {
  fail(
    "usage: node analyze-one-codex-session.mjs --file <rollout.jsonl> --artifact <safe.json> [--review-out <outside-repo.md>]",
  );
}

const inputPath = path.resolve(args.file);
const artifactPath = path.resolve(args.artifact);
const reviewPath = args.reviewOut ? path.resolve(args.reviewOut) : null;
configureProcessLocalSafeDirectory(repositoryRoot);
const repo = resolveRepo(repositoryRoot);

assertSingleCodexFile(inputPath);
assertOutputInsideStudy(artifactPath);
if (reviewPath) assertReviewOutsideRepository(reviewPath, repo.realRoot);

const stat = fs.statSync(inputPath);
const candidate = { key: inputPath, path: inputPath, mtimeMs: stat.mtimeMs, bytes: stat.size };
const descriptor = codex.classify(candidate);
if (!descriptor) fail("the selected file is not a recognized Codex session rollout");

const sessionMeta = readSessionMeta(inputPath);
if (sessionMeta.parent_thread_id != null) fail("refusing a child-agent session; parent_thread_id must be null");

const association = associate(
  { cwd: descriptor.cwd, remotes: descriptor.remotes ?? [], gitRoot: descriptor.gitRoot },
  repo,
);
if (!passesStrict(association, true)) fail("the selected session is not deterministically associated with this repository");

const exactCwdMatch = samePath(descriptor.cwd, repo.realRoot);
if (!exactCwdMatch) fail("this demo requires the session cwd to match the repository root exactly");

const recordedCommit = sessionMeta.git?.commit_hash ?? null;
const commitResolvable = recordedCommit ? gitCommitExists(recordedCommit, repo.root) : false;
if (!commitResolvable) fail("this demo requires a recorded Git commit that resolves in the current repository");

const transcript = {
  harness: "codex",
  id: `codex-${descriptor.id}`,
  nativeId: descriptor.id,
  path: inputPath,
  cwd: descriptor.cwd ?? null,
  gitBranch: descriptor.gitBranch ?? null,
  title: null,
  model: descriptor.model ?? null,
  startedAt: descriptor.startedAt ?? null,
  mtimeMs: stat.mtimeMs,
  bytes: stat.size,
  experimental: false,
  association,
  extra: {},
};
transcript.identity = transcriptIdentity(transcript);

const raw = await readTranscript(transcript);
const distilled = distill(
  raw.events,
  { ...transcript, model: raw.model, rawPath: "[withheld]" },
  { maxTraceTokens: Number(args.maxTraceTokens ?? 6000) },
);

const fingerprint = crypto.createHash("sha256").update(String(descriptor.id), "utf8").digest("hex").slice(0, 12);
const safeTrace = sanitizeLocalReview(distilled.trace, {
  inputPath,
  repoRoot: repo.realRoot,
  cwd: descriptor.cwd,
  nativeId: descriptor.id,
  fingerprint,
});
const distilledBytes = Buffer.byteLength(safeTrace, "utf8");
const compressionPercent = Number(((1 - distilledBytes / stat.size) * 100).toFixed(1));
const redactionMarkers = (safeTrace.match(/\[redacted(?::[^\]]+)?\]/g) ?? []).length;

const artifact = {
  schemaVersion: 1,
  source: {
    library: "backpass",
    version: UPSTREAM_VERSION,
    commit: UPSTREAM_COMMIT,
    harness: "codex",
  },
  scope: {
    selectedSessions: 1,
    fingerprint: `sha256:${fingerprint}`,
    rawTranscriptCommitted: false,
    externalModelCalled: false,
    backpassStateCreated: false,
    agentRulesModified: false,
  },
  association: {
    strict: true,
    tier: association.tier,
    confidence: association.confidence,
    exactRepositoryCwd: exactCwdMatch,
    topLevelUserSession: sessionMeta.parent_thread_id == null,
    recordedCommitResolvable: commitResolvable,
  },
  deterministicPipeline: {
    stages: ["codex.classify", "associate", "readTranscript", "distill+redact"],
    normalizedEvents: raw.events.length,
    rawBytes: stat.size,
    distilledBytes,
    compressionPercent,
    userTurns: distilled.stats.userTurns,
    assistantTurns: distilled.stats.assistantTurns,
    toolCalls: distilled.stats.toolCalls,
    traceElided: distilled.stats.elided,
    estimatedTraceTokens: distilled.stats.distilledTokens,
    redactionMarkers,
  },
  analysisBoundary: {
    upstreamLlmAnalysisRun: false,
    reason: "The upstream semantic evidence classifier requires acpx/LLM access; this privacy-preserving demo stops before that call.",
    interpretationOwner: "researcher",
  },
  evidenceGate: {
    candidateSessions: 1,
    defaultMinimumForNewGap: 2,
    comparison: "1 < 2",
    status: "hold",
    proposalGenerated: false,
  },
  researchInterpretation: {
    status: "pending-local-review",
    observations: [],
  },
};

fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
fs.writeFileSync(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");

if (reviewPath) {
  fs.mkdirSync(path.dirname(reviewPath), { recursive: true });
  fs.writeFileSync(reviewPath, safeTrace, "utf8");
}

console.log(
  JSON.stringify(
    {
      artifact: path.relative(repositoryRoot, artifactPath),
      fingerprint: artifact.scope.fingerprint,
      association: `tier ${association.tier} (${association.confidence})`,
      events: raw.events.length,
      compressionPercent,
      gate: artifact.evidenceGate.comparison,
      reviewTraceWritten: Boolean(reviewPath),
    },
    null,
    2,
  ),
);

function parseArgs(argv) {
  const out = {};
  const names = new Map([
    ["--file", "file"],
    ["--artifact", "artifact"],
    ["--review-out", "reviewOut"],
    ["--max-trace-tokens", "maxTraceTokens"],
  ]);
  for (let index = 0; index < argv.length; index += 1) {
    const key = names.get(argv[index]);
    if (!key) fail(`unknown argument: ${argv[index]}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) fail(`missing value for ${argv[index]}`);
    out[key] = value;
    index += 1;
  }
  return out;
}

function assertSingleCodexFile(file) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) fail("selected session file does not exist");
  if (!/^rollout-.*\.jsonl$/i.test(path.basename(file))) fail("selected file must be one Codex rollout JSONL");
}

function assertOutputInsideStudy(file) {
  if (!isInside(file, studyRoot)) fail("the safe artifact must stay inside projects/backpass-study");
}

function assertReviewOutsideRepository(file, root) {
  if (isInside(file, root)) fail("the local review trace must be outside the repository so it cannot be committed");
}

function isInside(child, parent) {
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function readSessionMeta(file) {
  const handle = fs.openSync(file, "r");
  try {
    const buffer = Buffer.alloc(128 * 1024);
    const bytes = fs.readSync(handle, buffer, 0, buffer.length, 0);
    const newline = buffer.subarray(0, bytes).indexOf(0x0a);
    if (newline < 0) fail("session metadata line exceeds the 128 KiB safety limit");
    const firstLine = buffer.subarray(0, newline).toString("utf8").trim();
    const entry = JSON.parse(firstLine);
    if (entry.type !== "session_meta" || !entry.payload) fail("first JSONL record is not session_meta");
    return entry.payload;
  } finally {
    fs.closeSync(handle);
  }
}

function gitCommitExists(commit, cwd) {
  try {
    execFileSync("git", ["cat-file", "-e", `${commit}^{commit}`], {
      cwd,
      stdio: ["ignore", "ignore", "ignore"],
    });
    return true;
  } catch {
    return false;
  }
}

function configureProcessLocalSafeDirectory(root) {
  // The shared research workspace can be owned by another sandbox identity. Keep the
  // exception process-local instead of mutating the user's global Git configuration.
  const index = Number(process.env.GIT_CONFIG_COUNT ?? 0);
  process.env.GIT_CONFIG_COUNT = String(index + 1);
  process.env[`GIT_CONFIG_KEY_${index}`] = "safe.directory";
  process.env[`GIT_CONFIG_VALUE_${index}`] = path.resolve(root).replace(/\\/g, "/");
}

function samePath(left, right) {
  if (!left || !right) return false;
  const normalize = (value) => {
    try {
      return fs.realpathSync.native(value).replace(/[\\/]+$/, "").toLowerCase();
    } catch {
      return path.resolve(value).replace(/[\\/]+$/, "").toLowerCase();
    }
  };
  return normalize(left) === normalize(right);
}

function sanitizeLocalReview(trace, values) {
  let output = String(trace);
  for (const value of [values.inputPath, values.repoRoot, values.cwd, values.nativeId]) {
    if (!value) continue;
    output = output.replaceAll(String(value), value === values.nativeId ? values.fingerprint : "[local-path]");
  }
  return output.replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "[session-id]");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
