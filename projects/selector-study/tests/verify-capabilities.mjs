import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const expectedCommit = "d88e9a6c3c10821a5cc6d87447693d9507a76b35";
const testRoot = dirname(fileURLToPath(import.meta.url));
const upstreamRoot = resolve(process.env.SELECTOR_UPSTREAM || join(testRoot, "..", "upstream", "selector"));

assert.ok(existsSync(upstreamRoot), `Upstream is missing: ${upstreamRoot}. Run scripts/fetch-upstream.ps1 first.`);

const head = execFileSync("git", ["-C", upstreamRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
assert.equal(head, expectedCommit, "Upstream HEAD must match the locked commit");

function source(relativePath) {
  const path = join(upstreamRoot, relativePath);
  assert.ok(existsSync(path), `Missing expected upstream file: ${relativePath}`);
  return readFileSync(path, "utf8");
}

function includesAll(text, fragments, label) {
  for (const fragment of fragments) {
    assert.ok(text.includes(fragment), `${label} is missing evidence: ${fragment}`);
  }
}

const packageJson = JSON.parse(source("package.json"));
assert.equal(packageJson.name, "selector");
assert.equal(packageJson.version, "0.4.1");
assert.equal(packageJson.private, true);
assert.equal(packageJson.scripts?.check, "npm run build");
assert.equal(Object.keys(packageJson.dependencies || {}).length, 0);
assert.equal(Object.keys(packageJson.devDependencies || {}).length, 0);

const readme = source("README.md");
includesAll(readme, ["A bookmarklet for selecting web elements", "Sharingan mode", "## License", "MIT"], "README");
assert.equal(existsSync(join(upstreamRoot, "LICENSE")), false, "Locked commit unexpectedly added a LICENSE file; update the license audit");

const build = source("scripts/build.js");
includesAll(build, ["editorPayloadParts", "payload-05.css", "new Function(joined)", "editor.js"], "build pipeline");

const installer = source("index.html");
includesAll(installer, ["decodePayload", "javascript:", "assets/payload-00.css", "assets/payload-06.css"], "bookmarklet installer");

const core = source("src/core.js");
includesAll(core, ["const VERSION = \"0.4.1\"", "assignAiIds(document.body)", "MutationObserver", "data-ai-id"], "editor core");

const selection = source("src/selection.js");
includesAll(
  selection,
  ["elementsFromPoint", "rectsIntersect", "navigateToParent", "navigateToChild", "navigateToSibling", "togglePaused"],
  "selection",
);

const context = source("src/context.js");
includesAll(
  context,
  ["getReactFiber", "sourceFromDebugStack", "getVueComponent", "buildElementContext", "bestDirectSelector", "buildLocator", "isUniqueSelector"],
  "context compiler",
);

const prompt = source("src/prompt.js");
includesAll(prompt, ["buildPromptText", "selector:", "locator:", "instruction:"], "prompt output");

const sharingan = source("src/sharingan.js");
includesAll(
  sharingan,
  [
    "buildSharinganReport",
    '"DOM Snapshot"',
    '"Geometry"',
    '"Effective Style"',
    '"Matched Rules"',
    '"Runtime State"',
    '"Font Usage"',
    '"Animation Runtime"',
    '"Media Assets"',
    "maskSensitiveText",
    "isSensitiveName",
  ],
  "Sharingan report",
);

const exportSource = source("src/export.js");
includesAll(
  exportSource,
  ["copyAsMarkdown", "captureScreenshot", "getDisplayMedia", "ClipboardItem", "SHARINGAN_CLIPBOARD_CHAR_LIMIT"],
  "export paths",
);

const sourceBundle = [core, selection, context, prompt, sharingan, exportSource].join("\n");
assert.equal(sourceBundle.includes("shadowRoot"), false, "Locked commit unexpectedly added Shadow DOM traversal; update the boundary audit");
assert.equal(/contentDocument\s*\.(?:querySelector|addEventListener)/.test(sourceBundle), false, "Locked commit unexpectedly added iframe traversal; update the boundary audit");
assert.ok(sharingan.includes("Inaccessible stylesheets (cross-origin CSS, cannot read text)"), "Cross-origin CSS limitation must be explicit");

console.log(JSON.stringify({
  status: "passed",
  upstream: upstreamRoot,
  commit: head,
  version: packageJson.version,
  capabilities: {
    visualSelection: true,
    compactPrompt: true,
    reactDebugContext: true,
    vueDebugContext: true,
    sharinganReport: true,
    markdownExport: true,
    screenshotCapture: true,
    spaMutationTracking: true,
  },
  observedBoundaries: {
    generalShadowDomTraversal: false,
    generalIframeTraversal: false,
    bookmarkletCrossOriginStylesheetRead: false,
    standaloneLicenseFile: false,
    upstreamCheckIsBuildOnly: true,
  },
}, null, 2));
