import { chromium } from '@playwright/test';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const ARTIFACT_DIR =
  process.env.ARTIFACT_DIR ||
  '/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p_devbox/ddd0ce16-ab87-405f-9cc5-ce224002b961';
const MANIFEST_PATH = '/tmp/lumina-openai-sxs-narration/manifest.json';

const VIEWPORT = { width: 1600, height: 920 };
const IS_DRY_RUN = process.env.DRY_RUN === '1';
const rawSleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sleep = (ms) => rawSleep(IS_DRY_RUN ? Math.min(ms, 40) : ms);

async function waitForUrl(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // retry
    }
    await rawSleep(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function startStudioPreview() {
  return spawn(
    'pnpm',
    ['--filter', '@a2ui-catalog/studio', 'exec', 'vite', 'preview', '--port', '5188', '--strictPort'],
    {
      cwd: REPO_ROOT,
      env: { ...process.env },
      stdio: 'ignore',
    },
  );
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
        bottom: 12px;
        transform: translateX(-50%);
        z-index: 99999;
        width: min(1060px, calc(100vw - 48px));
        padding: 10px 18px;
        border-radius: 15px;
        background: rgba(14, 15, 21, 0.90);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.16);
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
        color: #F5F5F7;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, sans-serif;
        pointer-events: none;
      }
      #lumina-narrator-hud .hud-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 4px;
      }
      #lumina-narrator-hud .hud-title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 680;
        letter-spacing: -0.01em;
        color: #FFFFFF;
      }
      #lumina-narrator-hud .hud-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #10A37F;
        box-shadow: 0 0 10px #10A37F;
      }
      #lumina-narrator-hud .hud-props {
        font-family: "SF Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 11px;
        color: #93C5FD;
        background: rgba(41, 151, 255, 0.16);
        border: 1px solid rgba(41, 151, 255, 0.30);
        padding: 2px 9px;
        border-radius: 999px;
      }
      #lumina-narrator-hud .hud-speech {
        font-size: 12.8px;
        line-height: 1.42;
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

async function setHud(page, cue) {
  await installNarratorHud(page);
  await page.evaluate(({ title, props, speech }) => {
    const hud = document.getElementById('lumina-narrator-hud');
    if (!hud) return;
    hud.querySelector('.hud-title-text').textContent = title;
    hud.querySelector('.hud-props').textContent = props;
    hud.querySelector('.hud-speech').textContent = speech;
  }, cue);
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

async function scrollPane(page, side, topPx) {
  await page.evaluate(
    ({ s, top }) => {
      const el = document.querySelector(`[data-sxs-scroll="${s}"]`);
      if (el) el.scrollTo({ top, behavior: 'smooth' });
    },
    { s: side, top: topPx },
  );
}

function muxNarratedMp4(rawWebmPath, timeline, outputMp4Path) {
  const args = ['-y', '-i', rawWebmPath];
  const filterParts = [];
  const mixInputs = [];

  timeline.forEach((entry, idx) => {
    args.push('-i', entry.audioFile);
    const inputIdx = idx + 1;
    const delayMs = Math.max(0, Math.round(entry.startMs));
    filterParts.push(`[${inputIdx}:a]adelay=${delayMs}|${delayMs},volume=1.12[a${idx}]`);
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

async function recordOpenAiSxsTour(browser, cues) {
  const tempDir = '/tmp/lumina-openai-sxs-narration/video-raw';
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });
  fs.mkdirSync(path.join(ARTIFACT_DIR, 'frames'), { recursive: true });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    ...(IS_DRY_RUN ? {} : { recordVideo: { dir: tempDir, size: VIEWPORT } }),
  });
  const page = await context.newPage();
  const videoStart = Date.now();
  const timeline = [];
  const cueById = Object.fromEntries(cues.map((c) => [c.id, c]));

  const selectExample = async (id) => {
    await page.locator(`[data-sxs-example="${id}"]`).click();
    await scrollPane(page, 'left', 0);
    await scrollPane(page, 'right', 0);
    await sleep(350);
  };

  const runCue = async (id, fn) => {
    const cue = cueById[id];
    const startMs = Date.now() - videoStart;
    timeline.push({ id, startMs, audioFile: cue.audioFile });
    await setHud(page, cue);
    const t0 = Date.now();
    if (fn) await fn();
    const elapsed = Date.now() - t0;
    const remaining = Math.max(320, cue.durationMs + 450 - elapsed);
    await sleep(remaining);
  };

  await page.goto('http://localhost:5188/?view=openai-sxs&example=roth-ira', {
    waitUntil: 'networkidle',
  });
  await page.locator('[data-testid="lumina-right-pane"]').waitFor({ state: 'visible' });
  await sleep(600);

  const left = page.locator('[data-testid="openai-left-pane"]');
  const right = page.locator('[data-testid="lumina-right-pane"]');

  // -------------------------------------------------------------------------
  // 01. ROTH IRA GROWTH CALCULATOR
  // -------------------------------------------------------------------------
  await runCue('roth_ira', async () => {
    const leftFrame = page.frameLocator('[data-testid="openai-left-pane"] iframe');
    await leftFrame.locator('#monthly').waitFor({ state: 'visible' });
    await sleep(2200);

    // Save hero poster screenshot before slider changes!
    await page.screenshot({ path: path.join(REPO_ROOT, 'docs/media/poster-openai-sxs.png') });

    // Raise Monthly Contribution to $600 on BOTH Left OpenAI & Right Lumina
    await setRangeInput(leftFrame.locator('#monthly'), 600);
    await setRangeInput(right.locator('input.lumina-slider').nth(0), 600);
    await sleep(2400);

    // Raise Annual Return to 8% on BOTH Left OpenAI & Right Lumina
    await setRangeInput(leftFrame.locator('#rate'), 8);
    await setRangeInput(right.locator('input.lumina-slider').nth(2), 8);
    await sleep(2400);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'frames/01-roth-ira-sxs.png') });
  });

  // -------------------------------------------------------------------------
  // 02. THE DINNER LEDGER (PARTY OF FIVE CLIPBOARD)
  // -------------------------------------------------------------------------
  await selectExample('dinner-ledger');
  await runCue('dinner_ledger', async () => {
    const leftFrame = page.frameLocator('[data-testid="openai-left-pane"] iframe');
    await leftFrame.locator('text=The Check, Please.').waitFor({ state: 'visible' });
    await sleep(1800);

    // Scroll both clipboards down to Tax & Gratuity
    await leftFrame.locator('[data-tip="20"]').scrollIntoViewIfNeeded();
    await right.locator('.lumina-ledger-presets').scrollIntoViewIfNeeded();
    await sleep(1400);

    // Select 20% tip preset on BOTH sides
    await leftFrame.locator('[data-tip="20"]').click();
    await right.getByRole('button', { name: '20%' }).click();
    await sleep(1500);

    // Click Split the check on BOTH sides!
    await leftFrame.locator('#split').scrollIntoViewIfNeeded();
    await leftFrame.locator('#split').click();
    await right.locator('.lumina-ledger-split-cta').scrollIntoViewIfNeeded();
    await right.locator('.lumina-ledger-split-cta').click();
    await sleep(900);
    await leftFrame.locator('#receipt').scrollIntoViewIfNeeded();
    await right.locator('.lumina-ledger-receipt').scrollIntoViewIfNeeded();
    await sleep(1600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'frames/02-dinner-ledger-sxs.png') });
  });

  // -------------------------------------------------------------------------
  // 03. PIXEL PALACE RETRO ARCADE & DRUM LAB 01
  // -------------------------------------------------------------------------
  await selectExample('pixel-palace');
  await runCue('pixel_palace', async () => {
    const leftFrame = page.frameLocator('[data-testid="openai-left-pane"] iframe');
    const rightFrame = page.frameLocator('[data-testid="lumina-right-pane"] iframe');
    await leftFrame.getByRole('button', { name: /START GAME/i }).waitFor({ state: 'visible' });
    await rightFrame.locator('#startBtn').waitFor({ state: 'visible' });
    await sleep(1300);

    // Start Snake on BOTH consoles
    await rightFrame.locator('#startBtn').click();
    await leftFrame.locator('#r-play').click();
    await sleep(2200);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'frames/03a-pixel-palace-sxs.png') });

    // Switch cartridge to BREAKOUT on both
    await rightFrame.locator('.mbtn[data-m="breakout"]').click();
    await leftFrame.locator('button[data-mode="breakout"]').click();
    await sleep(1400);

    // Switch BOTH sides to Drum Lab 01 16-step sequencer!
    await left.locator('[data-oai-drum-tab="1"]').click();
    await right.getByRole('tab', { name: /Drum Lab 01/i }).click();
    await sleep(900);
    await rightFrame.locator('#playBtn').click();
    await left.locator('.oai-drum-cell').nth(2).click();
    await rightFrame.locator('.cell').nth(2).click();
    await sleep(2200);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'frames/03b-drum-lab-sxs.png') });
  });

  // -------------------------------------------------------------------------
  // 04. 7-SPEED BICYCLE SCHEMATIC
  // -------------------------------------------------------------------------
  await selectExample('bicycle-7speed');
  await runCue('bicycle_7speed', async () => {
    await sleep(1500);
    await left.locator('.oai-pill-tab', { hasText: 'Drivetrain' }).click();
    await right.locator('.lumina-diagram-pill', { hasText: 'Drivetrain' }).click();
    await sleep(1600);

    await left.locator('.oai-pill-tab', { hasText: 'All systems' }).click();
    await right.locator('.lumina-diagram-pill', { hasText: 'All systems' }).click();
    await scrollPane(page, 'left', 260);
    await scrollPane(page, 'right', 260);
    await sleep(900);

    // Shift to Gear 7 on both sides
    await setRangeInput(left.locator('[data-oai-gear-slider="1"]'), 7);
    await setRangeInput(right.locator('input.lumina-slider').nth(0), 7);
    await sleep(1800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'frames/04-bicycle-7speed-sxs.png') });
  });

  // -------------------------------------------------------------------------
  // 05. SAN FRANCISCO IN ONE DAY + DARK MODE
  // -------------------------------------------------------------------------
  await selectExample('sf-one-day');
  await runCue('sf_route', async () => {
    await sleep(1600);
    await scrollPane(page, 'left', 220);
    await scrollPane(page, 'right', 240);
    await sleep(1200);

    await left.locator('.oai-map-pin').nth(1).click();
    await right.locator('.lumina-map-pin').nth(1).click();
    await sleep(1400);

    await left.locator('.oai-map-pin').nth(5).click();
    await right.locator('.lumina-map-pin').nth(5).click();
    await sleep(1300);

    // Toggle synchronized Dark Mode across BOTH OpenAI & Lumina surfaces!
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await sleep(2200);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'frames/05-sf-route-dark-sxs.png') });
  });

  // -------------------------------------------------------------------------
  // 06. MEDITERRANEAN SUNDAY LAMB ROAST
  // -------------------------------------------------------------------------
  await selectExample('lamb-roast');
  await runCue('lamb_roast', async () => {
    await sleep(1400);
    // Return to crisp Light Mode so viewers see both themes clearly
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await sleep(1000);

    await scrollPane(page, 'left', 200);
    await scrollPane(page, 'right', 200);
    await sleep(800);

    // Increment Total guests from 6 -> 8 on BOTH sides!
    await left.locator('[data-oai-inc-guests="1"]').click();
    await right.getByRole('button', { name: 'Increase Total guests' }).click();
    await sleep(600);
    await left.locator('[data-oai-inc-guests="1"]').click();
    await right.getByRole('button', { name: 'Increase Total guests' }).click();
    await sleep(1600);

    // Check off steps 3 & 4 on both checklists
    await scrollPane(page, 'left', 520);
    await scrollPane(page, 'right', 520);
    await sleep(700);
    await left.locator('.oai-check-row').nth(2).click();
    await right.locator('.lumina-checklist-row').nth(2).click();
    await sleep(600);
    await left.locator('.oai-check-row').nth(3).click();
    await right.locator('.lumina-checklist-row').nth(3).click();
    await sleep(1400);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'frames/06-lamb-roast-sxs.png') });
  });

  // -------------------------------------------------------------------------
  // 07. FUNCTIONAL DOG VEST MOODBOARD
  // -------------------------------------------------------------------------
  await selectExample('dog-vest');
  await runCue('dog_vest', async () => {
    await sleep(1500);
    // Switch gallery card to 02 · Urban minimal on BOTH sides!
    await left.locator('[data-oai-vibe="urban"]').click();
    await right.locator('.lumina-choice-item.is-gallery-card').nth(1).click();
    await sleep(1800);

    await scrollPane(page, 'left', 260);
    await scrollPane(page, 'right', 260);
    await sleep(900);

    // Pick Rust & Slate color swatches on BOTH sides!
    await left.locator('[data-oai-swatch="Rust"]').click();
    await right.locator('.lumina-swatch-btn').nth(3).click();
    await sleep(1100);
    await left.locator('[data-oai-swatch="Slate"]').click();
    await right.locator('.lumina-swatch-btn').nth(4).click();
    await sleep(1500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'frames/07-dog-vest-sxs.png') });
  });

  // -------------------------------------------------------------------------
  // 08. GDP, CENTRAL LIMIT THEOREM & COMPREHENSION QUIZ + A2UI JSON
  // -------------------------------------------------------------------------
  await selectExample('gdp-clt-quiz');
  await runCue('gdp_clt_quiz', async () => {
    await sleep(1200);
    // Drag Net Exports NX negative (-$75B) on BOTH sides
    await setRangeInput(left.locator('[data-oai-nx="1"]'), -75);
    await setRangeInput(right.locator('input.lumina-slider').nth(3), -75);
    await sleep(1600);

    // Switch BOTH sides to Central Limit Theorem & draw +100 Monte Carlo samples twice!
    await left.locator('[data-oai-tab-clt="1"]').click();
    await right.getByRole('tab', { name: /Central Limit Theorem/i }).click();
    await sleep(700);
    await left.locator('[data-oai-draw="1"]').click();
    await right.getByRole('button', { name: /Draw \+100 samples/i }).click();
    await sleep(600);
    await left.locator('[data-oai-draw="1"]').click();
    await right.getByRole('button', { name: /Draw \+100 samples/i }).click();
    await sleep(1300);

    // Answer comprehension quiz Option B on BOTH sides!
    await scrollPane(page, 'left', 340);
    await scrollPane(page, 'right', 420);
    await sleep(700);
    await left.locator('[data-oai-quiz="b"]').click();
    await right.locator('.lumina-quiz-option').nth(1).click();
    await sleep(1400);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'frames/08-stem-quiz-sxs.png') });

    // Open A2UI v1.0 JSON & Live DataModel inspector
    await page.locator('[data-testid="sxs-json-btn"]').click();
    await sleep(1600);
  });

  await sleep(500);
  if (IS_DRY_RUN) {
    await context.close();
    console.log('[openai-sxs] DRY_RUN=1 passed across all 8 examples!');
    return;
  }
  const rawVideoPath = await page.video().path();
  await context.close();

  const repoMp4 = path.join(REPO_ROOT, 'docs/media/lumina-openai-intelligent-ui-sxs-narrated.mp4');
  const artifactMp4 = path.join(ARTIFACT_DIR, 'lumina-openai-intelligent-ui-sxs-narrated.mp4');

  muxNarratedMp4(rawVideoPath, timeline, repoMp4);
  fs.copyFileSync(repoMp4, artifactMp4);
  fs.copyFileSync(
    path.join(REPO_ROOT, 'docs/media/poster-openai-sxs.png'),
    path.join(ARTIFACT_DIR, 'poster-openai-sxs.png'),
  );
  console.log(`[openai-sxs] Saved narrated MP4 -> ${repoMp4}`);
  console.log(`[openai-sxs] Copied narrated MP4 -> ${artifactMp4}`);
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const studioProc = startStudioPreview();

  try {
    await waitForUrl('http://localhost:5188');
    const browser = await chromium.launch({ headless: true });
    try {
      await recordOpenAiSxsTour(browser, manifest.openai_sxs_tour);
    } finally {
      await browser.close();
    }
  } finally {
    studioProc.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
