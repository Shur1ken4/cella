// Renders the explainer tracks to MP4 by capturing /render frame-by-frame.
// Usage: start the app (e.g. `npm run build && npx next start -p 3100`), then
//   node scripts/render-video.mjs [idea|howTo|all]
// Env: BASE_URL (default http://localhost:3100), FPS (30), SCENE_SECONDS (7), CHROME_PATH.
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import ffmpegPath from "ffmpeg-static";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3100";
const FPS = Number(process.env.FPS ?? 30);
const SCENE_SECONDS = Number(process.env.SCENE_SECONDS ?? 7);
const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const OUTPUTS = {
  idea: "cella-explainer.mp4",
  howTo: "cella-how-to-use.mp4",
};

async function renderTrack(browser, track) {
  const outDir = join(root, "public", "video");
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, OUTPUTS[track]);

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.goto(`${BASE_URL}/render?track=${track}`, { waitUntil: "networkidle0" });
  await page.waitForFunction(() => window.__renderReady === true, { timeout: 30_000 });
  await new Promise((r) => setTimeout(r, 500)); // let the page-transition fade finish
  const scenes = await page.evaluate(() => window.__sceneCount);

  const ffmpeg = spawn(
    ffmpegPath,
    [
      "-y", "-loglevel", "error",
      "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
      "-c:v", "libx264", "-preset", "slow", "-crf", "20",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      out,
    ],
    { stdio: ["pipe", "inherit", "inherit"] }
  );
  const done = new Promise((resolve, reject) =>
    ffmpeg.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))))
  );

  const framesPerScene = FPS * SCENE_SECONDS;
  const total = scenes * framesPerScene;
  const started = Date.now();
  for (let s = 0; s < scenes; s++) {
    for (let f = 0; f < framesPerScene; f++) {
      const progress = f / (framesPerScene - 1);
      await page.evaluate((a, b) => window.__setFrame(a, b), s, progress);
      const jpg = await page.screenshot({ type: "jpeg", quality: 92 });
      if (!ffmpeg.stdin.write(jpg)) await new Promise((r) => ffmpeg.stdin.once("drain", r));
      const n = s * framesPerScene + f + 1;
      if (n % FPS === 0 || n === total) {
        process.stdout.write(`\r${track}: ${n}/${total} frames (${Math.round((Date.now() - started) / 1000)}s)`);
      }
    }
  }
  ffmpeg.stdin.end();
  await done;
  await page.close();
  process.stdout.write(`\n✓ ${out}\n`);
}

const which = process.argv[2] ?? "all";
const tracks = which === "all" ? ["idea", "howTo"] : [which];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--hide-scrollbars"] });
try {
  for (const t of tracks) await renderTrack(browser, t);
} finally {
  await browser.close();
}
