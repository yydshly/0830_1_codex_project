import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptRoot, "..");
const mediaRoot = join(projectRoot, "showcase", "media");
const artifactsRoot = join(projectRoot, "artifacts");
const moduleRoot = process.env.WORKSPACE_NODE_MODULES;
const targetUrl = process.env.SHOWCASE_STAGE_URL || "http://127.0.0.1:4192/video-stage.html";
const fps = 20;
const frameCount = 640;
const outputPath = join(mediaRoot, "solo-skills-real-demo.mp4");
const posterPath = join(mediaRoot, "solo-skills-real-demo-poster.jpg");
const contactSheetPath = join(artifactsRoot, "solo-skills-real-demo-contact-sheet.jpg");
const evidencePath = join(artifactsRoot, "solo-skills-real-demo-evidence.json");
const publicEvidencePath = join(mediaRoot, "solo-skills-real-demo-evidence.json");
const smokeOnly = process.argv.includes("--smoke");

if (!moduleRoot || !existsSync(join(moduleRoot, "playwright", "index.mjs"))) {
  throw new Error("Set WORKSPACE_NODE_MODULES to a node_modules directory containing Playwright.");
}

mkdirSync(mediaRoot, { recursive: true });
mkdirSync(artifactsRoot, { recursive: true });
const renderRoot = mkdtempSync(join(tmpdir(), "solo-skills-real-demo-"));
const framesRoot = join(renderRoot, "frames");
mkdirSync(framesRoot);

const { chromium } = await import(pathToFileURL(join(moduleRoot, "playwright", "index.mjs")).href);
const browser = await chromium.launch({ headless: true });
const checkpoints = {};
const errors = [];
const checkpointFrames = new Set([0, 104, 244, 350, 430, 530, 639]);

try {
  const context = await browser.newContext({
    viewport: { width: 960, height: 540 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));

  await page.goto(targetUrl, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__stageReady === true);
  const stageMeta = await page.evaluate(() => window.__stageMeta);
  assert.deepEqual(stageMeta, { fps: 20, frames: 640, duration: 32, size: [960, 540], deviceScaleFactor: 2 });

  const framesToCapture = smokeOnly ? [...checkpointFrames] : Array.from({ length: frameCount }, (_, index) => index);
  for (const frame of framesToCapture) {
    const state = await page.evaluate((value) => window.__tick(value), frame);
    if (checkpointFrames.has(frame)) checkpoints[frame] = state;
    if (!smokeOnly) {
      await page.screenshot({
        path: join(framesRoot, `f${String(frame).padStart(4, "0")}.png`),
        type: "png",
        animations: "disabled"
      });
      if (frame % 100 === 0) process.stdout.write(`captured ${frame}/${frameCount - 1}\n`);
    }
  }

  assert.equal(errors.length, 0, errors.join("\n"));
  assert.equal(checkpoints[104].selectedFilter, "script");
  assert.equal(checkpoints[244].selectedMechanic, "guardrails");
  assert.equal(checkpoints[350].selectedCase, "video");
  assert.equal(checkpoints[530].selectedStage, "5");
  await context.close();
} finally {
  await browser.close();
}

if (smokeOnly) {
  rmSync(resolve(renderRoot), { recursive: true, force: true });
  console.log(JSON.stringify({ status: "passed", mode: "smoke", targetUrl, checkpoints, errors }, null, 2));
  process.exit(0);
}

execFileSync("ffmpeg", [
  "-y",
  "-framerate", String(fps),
  "-i", join(framesRoot, "f%04d.png"),
  "-c:v", "libx264",
  "-preset", "medium",
  "-crf", "22",
  "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  "-r", String(fps),
  "-an",
  outputPath
], { stdio: "inherit" });

execFileSync("ffmpeg", [
  "-y", "-ss", "00:00:21.5", "-i", outputPath,
  "-frames:v", "1", "-q:v", "2", posterPath
], { stdio: "ignore" });

execFileSync("ffmpeg", [
  "-y", "-framerate", String(fps), "-i", join(framesRoot, "f%04d.png"),
  "-vf", "select='eq(n,0)+eq(n,104)+eq(n,244)+eq(n,350)+eq(n,530)+eq(n,639)',scale=640:360,tile=3x2",
  "-frames:v", "1", "-q:v", "2", contactSheetPath
], { stdio: "ignore" });

const probe = JSON.parse(execFileSync("ffprobe", [
  "-v", "error", "-show_streams", "-show_format", "-of", "json", outputPath
], { encoding: "utf8" }));
const video = probe.streams.find((stream) => stream.codec_type === "video");
const audio = probe.streams.find((stream) => stream.codec_type === "audio");
assert.ok(video, "Rendered file must contain a video stream");
assert.equal(video.codec_name, "h264");
assert.equal(video.width, 1920);
assert.equal(video.height, 1080);
assert.equal(video.pix_fmt, "yuv420p");
assert.equal(audio, undefined, "The default deliverable must not contain audio");
assert.ok(Math.abs(Number(probe.format.duration) - 32) <= 0.05, `Unexpected duration: ${probe.format.duration}`);

const evidence = {
  generatedAt: new Date().toISOString(),
  targetUrl: "http://127.0.0.1:4192/",
  stageUrl: targetUrl,
  upstreamSkills: ["web-demo-video", "measured-ui-callouts"],
  render: { fps, frameCount, deterministicEntry: "window.__tick(frameIndex)", deviceScaleFactor: 2 },
  interaction: { sameOriginIframe: true, coordinates: "getBoundingClientRect()", events: "iframe MouseEvent" },
  output: {
    relativePath: "showcase/media/solo-skills-real-demo.mp4",
    poster: "showcase/media/solo-skills-real-demo-poster.jpg",
    contactSheet: "artifacts/solo-skills-real-demo-contact-sheet.jpg",
    bytes: Number(probe.format.size),
    durationSeconds: Number(probe.format.duration),
    video: {
      codec: video.codec_name,
      profile: video.profile,
      pixelFormat: video.pix_fmt,
      width: video.width,
      height: video.height,
      frameRate: video.avg_frame_rate,
      frames: Number(video.nb_frames)
    },
    audioStreams: 0
  },
  checkpoints,
  browserErrors: errors
};
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
writeFileSync(publicEvidencePath, `${JSON.stringify(evidence, null, 2)}\n`);

const outputHeader = readFileSync(outputPath).subarray(4, 12).toString("ascii");
assert.match(outputHeader, /ftyp/, "Output is not an MP4 container");
const resolvedRenderRoot = resolve(renderRoot);
assert.ok(resolvedRenderRoot.startsWith(resolve(tmpdir())), "Refusing to remove a non-temporary render directory");
rmSync(resolvedRenderRoot, { recursive: true, force: true });

console.log(JSON.stringify({ status: "passed", outputPath, posterPath, contactSheetPath, evidencePath, publicEvidencePath, probe: evidence.output }, null, 2));
