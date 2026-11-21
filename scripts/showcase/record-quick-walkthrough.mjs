import { chromium } from '@playwright/test';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const MANIFEST_PATH = '/tmp/lumina-quick-narration/manifest.json';
const VIEWPORT = { width: 1440, height: 900 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForUrl(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // retry
    }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function startProc(cmd, args, env = {}) {
  return spawn(cmd, args, {
    cwd: REPO_ROOT,
    env: { ...process.env, ...env },
    stdio: 'ignore',
  });
}

async function installNarratorHud(page) {
  await page.evaluate(() => {
    if (document.getElementById('lumina-narrator-hud')) return;
    const style = document.createElement('style');
    style.id = 'lumina-narrator-style';
    style.textContent = `
      #lumina-narrator-hud {
        position: fixed;
        left: 50%;
        bottom: 14px;
        transform: translateX(-50%);
        z-index: 99999;
        width: min(920px, calc(100vw - 48px));
        padding: 11px 18px;
        border-radius: 15px;
        background: rgba(14, 15, 21, 0.90);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.16);
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.38);
        color: #F5F5F7;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, sans-serif;
        pointer-events: none;
        transition: left 220ms ease, width 220ms ease, transform 220ms ease;
      }
      #lumina-narrator-hud.layout-sxs {
        left: 20px;
        width: 920px;
        transform: none;
      }
      #lumina-narrator-hud .hud-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 4px;
      }
      #lumina-narrator-hud .hud-title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 670;
        letter-spacing: -0.01em;
        color: #FFFFFF;
      }
      #lumina-narrator-hud .hud-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #2997FF;
        box-shadow: 0 0 10px #2997FF;
      }
      #lumina-narrator-hud .hud-props {
        font-family: "SF Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 11px;
        color: #93C5FD;
        background: rgba(41, 151, 255, 0.15);
        border: 1px solid rgba(41, 151, 255, 0.28);
        padding: 2px 9px;
        border-radius: 999px;
      }
      #lumina-narrator-hud .hud-speech {
        font-size: 13px;
        line-height: 1.44;
        color: rgba(245, 245, 247, 0.95);
      }
    `;
    document.head.appendChild(style);

    const hud = document.createElement('div');
    hud.id = 'lumina-narrator-hud';
    hud.innerHTML = `
      <div class="hud-top">
        <span class="hud-title"><span class="hud-dot"></span><span class="hud-title-text"></span></span>
        <span class="hud-props"></span>
      </div>
      <div class="hud-speech"></div>
    `;
    document.body.appendChild(hud);
  });
}

async function setHud(page, cue, layout = 'center') {
  await installNarratorHud(page);
  await page.evaluate(
    ({ title, props, speech, hudLayout }) => {
      const hud = document.getElementById('lumina-narrator-hud');
      if (!hud) return;
      hud.className = hudLayout === 'sxs' ? 'layout-sxs' : '';
      hud.querySelector('.hud-title-text').textContent = title;
      hud.querySelector('.hud-props').textContent = props;
      hud.querySelector('.hud-speech').textContent = speech;
    },
    { ...cue, hudLayout: layout },
  );
}

async function setRangeInput(locator, valueStr) {
  await locator.evaluate((el, val) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    if (setter) {
      setter.call(el, val);
    } else {
      el.value = val;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, String(valueStr));
}

function muxNarratedMp4(rawWebmPath, timeline, outputMp4Path) {
  const args = ['-y', '-i', rawWebmPath];
  const filterParts = [];
  const mixInputs = [];

  timeline.forEach((entry, idx) => {
    args.push('-i', entry.audioFile);
    const inputIdx = idx + 1;
    const delayMs = Math.max(0, Math.round(entry.startMs));
    filterParts.push(`[${inputIdx}:a]adelay=${delayMs}|${delayMs},volume=1.10[a${idx}]`);
    mixInputs.push(`[a${idx}]`);
  });

  const filterComplex =
    filterParts.join(';') +
    `;${mixInputs.join('')}amix=inputs=${timeline.length}:duration=longest:normalize=0,alimiter=limit=0.95[aout]`;

  args.push(
    '-filter_complex',
    filterComplex,
    '-map',
    '0:v:0',
    '-map',
    '[aout]',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-crf',
    '19',
    '-c:a',
    'aac',
    '-ar',
    '24000',
    '-b:a',
    '160k',
    '-movflags',
    '+faststart',
    outputMp4Path,
  );

  execFileSync('ffmpeg', args, { stdio: 'inherit' });
}

function formatDurationLabel(totalSeconds) {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

async function recordQuickWalkthrough(browser, cues) {
  const tempDir = '/tmp/lumina-quick-narration/video';
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: tempDir, size: VIEWPORT },
  });
  const page = await context.newPage();
  const videoStart = Date.now();
  const timeline = [];
  const cueById = Object.fromEntries(cues.map((c) => [c.id, c]));

  const runCue = async (id, layout, actionFn) => {
    const cue = cueById[id];
    const startMs = Date.now() - videoStart;
    await setHud(page, cue, layout);
    timeline.push({
      id,
      audioFile: cue.audioFile,
      startMs,
      durationMs: cue.durationMs,
    });
    const actionStart = Date.now();
    await actionFn();
    const elapsed = Date.now() - actionStart;
    const targetMs = cue.durationMs + 420;
    if (elapsed < targetMs) {
      await sleep(targetMs - elapsed);
    }
  };

  // Preload Home Page before first spoken cue
  await page.goto('http://localhost:5187', { waitUntil: 'networkidle' });
  await sleep(300);

  // ---- CUE 1: Beyond Plain Text (Hero -> Split a Dinner Bill) ----
  await runCue('beyond_text', 'center', async () => {
    await sleep(2400);
    await page.evaluate(() => {
      const scroller = document.querySelector('.home-page');
      const target = document.getElementById('home-playground');
      if (scroller && target) {
        scroller.scrollTo({
          top: Math.max(0, scroller.scrollTop + target.getBoundingClientRect().top - 76),
          behavior: 'smooth',
        });
      }
    });
    await sleep(1500);
    const tip22 = page.getByRole('button', { name: '22%' }).first();
    if (await tip22.isVisible()) {
      await tip22.click();
    }
    await sleep(1200);
  });

  // ---- CUE 2: Tap & Drag Live (Plan Monthly Savings + Poster Capture) ----
  const rawPosterPath = '/tmp/lumina-quick-narration/poster-raw.png';
  await runCue('tap_and_drag', 'center', async () => {
    await page.getByRole('tab', { name: /Plan Monthly Savings/i }).click();
    await sleep(900);
    // Capture clean side-by-side Plain Text vs Live Lumina Calculator frame for poster
    await page.screenshot({ path: rawPosterPath });
    const sliders = page.locator('[data-home-live-demo="savings"] input[type="range"]');
    await setRangeInput(sliders.nth(0), 650);
    await sleep(900);
    await setRangeInput(sliders.nth(0), 800);
    await sleep(900);
    await setRangeInput(sliders.nth(2), 7);
    await sleep(1200);
  });

  // ---- CUE 3: Cited Sources, Charts & Side Reports (Studio Research) ----
  await page.goto('http://localhost:5188', { waitUntil: 'networkidle' });
  await runCue('maps_and_docs', 'center', async () => {
    await page.getByRole('button', { name: /AI Semiconductor Deep Research/i }).click();
    await page.getByText('Quarterly AI Silicon Revenue by Layer').waitFor({ timeout: 12000 });
    await sleep(900);
    const chart = page.locator('.lumina-chart-canvas').first();
    await chart.scrollIntoViewIfNeeded();
    await sleep(500);
    const box = await chart.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.5);
      await sleep(450);
      await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.5);
      await sleep(450);
    }
    await page.locator('.lumina-artifact-card').first().click();
    await sleep(1400);
  });

  // ---- CUE 4: Built-In Human Sign-Off (Approve a Booking) ----
  await page.goto('http://localhost:5187', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const scroller = document.querySelector('.home-page');
    const target = document.getElementById('home-playground');
    if (scroller && target) {
      scroller.scrollTop = Math.max(0, scroller.scrollTop + target.getBoundingClientRect().top - 76);
    }
  });
  await page.getByRole('tab', { name: /Approve a Booking/i }).click();
  await runCue('human_signoff', 'center', async () => {
    await sleep(1400);
    await page.getByText('I verified the May 12–15 dates and non-refundable rate').click();
    await sleep(1100);
    await page.getByRole('button', { name: /Approve & Book/i }).click();
    await sleep(1400);
  });

  // ---- CUE 5: One Reply Fits Computer, Tablet & Phone (Studio Web x Mobile SxS + Dark Mode) ----
  await page.goto('http://localhost:5188/?sxs=1', { waitUntil: 'networkidle' });
  await runCue('every_screen', 'sxs', async () => {
    await page.getByRole('button', { name: /Executive Tokyo Concierge/i }).first().click();
    await page.getByText('Nonstop Business Class').first().waitFor({ timeout: 12000 });
    await sleep(1800);
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await sleep(1800);
  });

  await sleep(450);
  const totalSec = (Date.now() - videoStart) / 1000;
  const rawVideoPath = await page.video().path();
  await context.close();

  const repoMp4 = path.join(REPO_ROOT, 'docs/media/lumina-quick-walkthrough-narrated.mp4');
  const repoPoster = path.join(REPO_ROOT, 'docs/media/poster-quick-walkthrough.png');
  muxNarratedMp4(rawVideoPath, timeline, repoMp4);

  const durLabel = formatDurationLabel(totalSec);
  execFileSync(
    'python3',
    [
      path.join(__dirname, 'make-poster.py'),
      rawPosterPath,
      repoPoster,
      `Watch Quick Walkthrough · Plain-English Overview (${durLabel})`,
    ],
    { stdio: 'inherit' },
  );

  const chapterSummary = timeline.map((t) => ({
    id: t.id,
    startSec: Math.floor(t.startMs / 1000),
    timeLabel: formatDurationLabel(Math.floor(t.startMs / 1000)),
  }));
  fs.writeFileSync(
    '/tmp/lumina-quick-narration/chapters-out.json',
    JSON.stringify({ durationLabel: durLabel, chapters: chapterSummary }, null, 2),
  );
  console.log('[quick-walkthrough] Chapter summary:', JSON.stringify({ durationLabel: durLabel, chapters: chapterSummary }));
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const agentProc = startProc(
    'pnpm',
    ['--filter', '@a2ui-catalog/agent', 'start'],
    { LUMINA_AGENT_MODE: 'replay' },
  );
  const explorerProc = startProc('pnpm', [
    '--filter',
    '@a2ui-catalog/explorer',
    'exec',
    'vite',
    'preview',
    '--port',
    '5187',
    '--strictPort',
  ]);
  const studioProc = startProc('pnpm', [
    '--filter',
    '@a2ui-catalog/studio',
    'exec',
    'vite',
    'preview',
    '--port',
    '5188',
    '--strictPort',
  ]);

  try {
    await Promise.all([
      waitForUrl('http://localhost:10002/health'),
      waitForUrl('http://localhost:5187'),
      waitForUrl('http://localhost:5188'),
    ]);
    const browser = await chromium.launch({ headless: true });
    try {
      await recordQuickWalkthrough(browser, manifest.quick_walkthrough);
    } finally {
      await browser.close();
    }
  } finally {
    agentProc.kill('SIGTERM');
    explorerProc.kill('SIGTERM');
    studioProc.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
