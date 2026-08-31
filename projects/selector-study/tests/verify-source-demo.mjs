import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const testRoot = dirname(fileURLToPath(import.meta.url));
const studyRoot = resolve(testRoot, "..");
const demoRoot = join(studyRoot, "showcase", "source-demo");
const runtimeRoot = join(demoRoot, "runtime");
const upstreamDist = join(studyRoot, "upstream", "selector", "dist", "assets");

const expected = {
  "selector-0.4.1.js": "8680cfcbf056f67f92a5ac253ef82b4c43b77827055710d94780c7b11526fb50",
  "selector-0.4.1.css": "09d2b376662642f9fdf468fe9cc0fdeead1005b7485e7eea3847a847ad45d0e5",
};

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

for (const [name, digest] of Object.entries(expected)) {
  const path = join(runtimeRoot, name);
  assert.ok(existsSync(path), `Missing locked upstream runtime: ${name}`);
  assert.equal(sha256(path), digest, `Unexpected bytes in locked upstream runtime: ${name}`);
}

const runtimeJs = readFileSync(join(runtimeRoot, "selector-0.4.1.js"), "utf8");
const runtimeCss = readFileSync(join(runtimeRoot, "selector-0.4.1.css"), "utf8");
assert.ok(runtimeJs.includes('const VERSION = "0.4.1"'), "Runtime must declare Selector 0.4.1");
assert.ok(runtimeJs.includes("assignAiIds(document.body)"), "Runtime must contain the upstream Light DOM initializer");
assert.ok(runtimeJs.includes("buildSharinganReport"), "Runtime must contain the upstream Sharingan report path");
assert.ok(runtimeCss.includes(".ai-editor-root"), "Runtime stylesheet must contain the upstream editor root");

const demoHtml = readFileSync(join(demoRoot, "index.html"), "utf8");
const demoJs = readFileSync(join(demoRoot, "app.js"), "utf8");
for (const marker of [
  "ACTUAL UPSTREAM BUILD",
  "启动真实 Selector",
  "SAFE LOCAL FIXTURE",
  "VERIFY THE OUTPUT",
  "WHAT THIS PROVES",
  "d88e9a6",
]) {
  assert.ok(demoHtml.includes(marker), `Source demo must explain: ${marker}`);
}
assert.ok(demoJs.includes('script.src = "runtime/selector-0.4.1.js"'), "Launcher must load the pinned local runtime");
assert.ok(demoJs.includes("MutationObserver"), "Launcher must expose actual runtime active/closed state");
assert.ok(demoJs.includes("setInterval(reconcileRuntimeState"), "Launcher must reconcile closure inside the upstream shadow surface");
assert.ok(demoJs.includes("mirrorCopiedText"), "Safe fixture must expose the actual upstream clipboard payload for inspection");
assert.equal([...demoHtml.matchAll(/<(?:script|link)[^>]+(?:src|href)=["']https?:\/\//g)].length, 0, "Source demo must not fetch external runtime assets");

let byteComparedWithLocalUpstream = false;
if (existsSync(join(upstreamDist, "editor.js")) && existsSync(join(upstreamDist, "editor.css"))) {
  assert.deepEqual(readFileSync(join(runtimeRoot, "selector-0.4.1.js")), readFileSync(join(upstreamDist, "editor.js")), "Committed JS must be byte-identical to the locked upstream build");
  assert.deepEqual(readFileSync(join(runtimeRoot, "selector-0.4.1.css")), readFileSync(join(upstreamDist, "editor.css")), "Committed CSS must be byte-identical to the locked upstream build");
  byteComparedWithLocalUpstream = true;
}

console.log(JSON.stringify({
  status: "passed",
  upstreamVersion: "0.4.1",
  upstreamCommit: "d88e9a6c3c10821a5cc6d87447693d9507a76b35",
  runtimeFiles: Object.keys(expected),
  runtimeHashes: expected,
  byteComparedWithLocalUpstream,
  externalRuntimeDependencies: 0,
  fixtureContainsRealData: false,
}, null, 2));
