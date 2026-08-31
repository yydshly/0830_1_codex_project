import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const expectedCommit = "05a48943878312d88fe5a016c12a9654940ecc43";
const testRoot = dirname(fileURLToPath(import.meta.url));
const upstreamRoot = resolve(process.env.VIMAX_UPSTREAM || join(testRoot, "..", "upstream", "ViMax"));

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

function walk(directory) {
  const output = [];
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    const info = statSync(path);
    if (info.isDirectory()) output.push(...walk(path));
    else output.push(path);
  }
  return output;
}

const pyproject = source("pyproject.toml");
includesAll(pyproject, ['version = "1.2.0"', 'requires-python = ">=3.12"', '"faiss-cpu'], "pyproject");

const license = source("LICENSE");
assert.match(license, /MIT License/);

const ideaPipeline = source("pipelines/idea2video_pipeline.py");
includesAll(
  ideaPipeline,
  ["class Idea2VideoPipeline", "develop_story", "extract_characters", "write_script_based_on_story", "Script2VideoPipeline", "final_video.mp4"],
  "Idea2Video pipeline",
);

const scriptPipeline = source("pipelines/script2video_pipeline.py");
includesAll(
  scriptPipeline,
  ["class Script2VideoPipeline", "design_storyboard", "decompose_visual_descriptions", "construct_camera_tree", "generate_transition_video", "generate_single_image", "generate_single_video", "concatenate_videoclips"],
  "Script2Video pipeline",
);

const novelPipeline = source("pipelines/novel2movie_pipeline.py");
includesAll(
  novelPipeline,
  ["class Novel2MoviePipeline", "split", "compress", "FAISS.from_texts", "similarity_search", "rerank_model", "scene_extractor", "global_information_planner"],
  "Novel2Video pipeline",
);

const cameraAgent = source("agents/camera_image_generator.py");
includesAll(cameraAgent, ["construct_camera_tree", "parent_cam_idx", "parent_shot_idx", "generate_transition_video", "get_new_camera_image"], "camera dependency agent");

const protocols = source("tools/protocols.py");
includesAll(protocols, ["class ImageGenerator", "generate_single_image", "class VideoGenerator", "generate_single_video"], "render protocols");

source("agent_runtime/loop.py");
source("main_agent.py");
source("web/src/App.tsx");

const toolFiles = readdirSync(join(upstreamRoot, "tools"));
const imageAdapters = toolFiles.filter((name) => name.startsWith("image_generator_") && name.endsWith(".py"));
const videoAdapters = toolFiles.filter((name) => name.startsWith("video_generator_") && name.endsWith(".py"));
assert.ok(imageAdapters.length >= 4, "Expected at least four image generator adapters");
assert.ok(videoAdapters.length >= 5, "Expected at least five video generator adapters");

const bestSelector = source("agents/best_image_selector.py");
includesAll(bestSelector, ["class BestImageSelector", "candidate_image_paths", "best_image_index"], "VLM best-image selector");

const productionPythonFiles = [join(upstreamRoot, "pipelines"), join(upstreamRoot, "agents")]
  .flatMap(walk)
  .filter((path) => path.endsWith(".py") && !path.endsWith("best_image_selector.py"));
const selectorCallSites = productionPythonFiles.filter((path) => readFileSync(path, "utf8").includes("BestImageSelector"));
assert.equal(selectorCallSites.length, 0, "Locked commit unexpectedly wires BestImageSelector into a production pipeline; update the audit");

const allProductionNames = [join(upstreamRoot, "pipelines"), join(upstreamRoot, "agents"), join(upstreamRoot, "tools")]
  .flatMap(walk)
  .map((path) => path.toLowerCase());
const dedicatedAudioModules = allProductionNames.filter((path) => /(?:tts|lip.?sync|voice.?clone|dubbing)/.test(path));
assert.equal(dedicatedAudioModules.length, 0, "Locked commit unexpectedly contains a dedicated TTS/lip-sync/dubbing module; update the audit");

console.log(JSON.stringify({
  status: "passed",
  upstream: upstreamRoot,
  commit: head,
  capabilities: {
    idea2video: true,
    script2video: true,
    novel2video: true,
    cameraDependencyGraph: true,
    transitionVideoAnchoring: true,
    agentLoop: true,
    tui: true,
    webUi: true,
  },
  adapters: {
    image: imageAdapters.sort(),
    video: videoAdapters.sort(),
  },
  implementationGaps: {
    bestImageSelectorWiredIntoMainPipeline: false,
    dedicatedTtsLipSyncOrDubbingPipeline: false,
  },
}, null, 2));
