import { chromium } from '@playwright/test';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const ARTIFACT_DIR =
  process.env.ARTIFACT_DIR ||
  '/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/2d2c0acc-a0bf-492a-a951-551fed7a66a8';
const MANIFEST_PATH = '/tmp/lumina-narration/manifest.json';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForUrl(url, timeoutMs = 25000) {
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

function startServer(cmd, args, env = {}) {
  const child = spawn(cmd, args, {
    cwd: REPO_ROOT,
    env: { ...process.env, ...env },
    stdio: 'ignore',
  });
  return child;
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
        width: min(900px, calc(100vw - 48px));
        padding: 11px 16px;
        border-radius: 15px;
        background: rgba(15, 16, 22, 0.88);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.36);
        color: #F5F5F7;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, sans-serif;
        pointer-events: none;
        transition: left 220ms ease, width 220ms ease, transform 220ms ease;
      }
      /* Keep HUD inside center stage in Explorer 41-Components view so sidebar & Properties pane stay 100% clear */
      #lumina-narrator-hud.layout-explorer {
        left: 238px;
        width: 756px;
        transform: none;
      }
      /* Keep HUD inside left Web column in Studio SxS view so right Mobile phone frame stays 100% clear */
      #lumina-narrator-hud.layout-sxs {
        left: 20px;
        width: 968px;
        transform: none;
      }
      #lumina-narrator-hud .hud-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 5px;
      }
      #lumina-narrator-hud .hud-title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 660;
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
        background: rgba(41, 151, 255, 0.14);
        border: 1px solid rgba(41, 151, 255, 0.28);
        padding: 2px 8px;
        border-radius: 999px;
      }
      #lumina-narrator-hud .hud-speech {
        font-size: 13px;
        line-height: 1.44;
        color: rgba(245, 245, 247, 0.94);
      }
      .lumina-spotlight {
        outline: 2.5px solid #2997FF !important;
        outline-offset: 4px !important;
        box-shadow: 0 0 0 7px rgba(41, 151, 255, 0.16) !important;
        border-radius: 14px;
        transition: outline 180ms ease, box-shadow 180ms ease;
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
  await page.evaluate(({ title, props, speech, hudLayout }) => {
    const hud = document.getElementById('lumina-narrator-hud');
    if (!hud) return;
    hud.className = hudLayout === 'explorer' ? 'layout-explorer' : hudLayout === 'sxs' ? 'layout-sxs' : '';
    hud.querySelector('.hud-title-text').textContent = title;
    hud.querySelector('.hud-props').textContent = props;
    hud.querySelector('.hud-speech').textContent = speech;
  }, { ...cue, hudLayout: layout });
}

async function spotlight(page, selector, index = 0) {
  await page.evaluate(({ sel, idx }) => {
    document.querySelectorAll('.lumina-spotlight').forEach((el) => el.classList.remove('lumina-spotlight'));
    if (!sel) return;
    const nodes = document.querySelectorAll(sel);
    const el = nodes[idx];
    if (el) {
      el.classList.add('lumina-spotlight');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, { sel: selector, idx: index });
}

async function spotlightSxs(page, selector, index = 0) {
  await page.evaluate(({ sel, idx }) => {
    document.querySelectorAll('.lumina-spotlight').forEach((el) => el.classList.remove('lumina-spotlight'));
    if (!sel) return;
    const webRoot = document.querySelector('.studio-web-workspace');
    const mobRoot = document.querySelector('.studio-sxs-pane');
    for (const root of [webRoot, mobRoot]) {
      if (!root) continue;
      const nodes = root.querySelectorAll(sel);
      const el = nodes[idx];
      if (el) {
        el.classList.add('lumina-spotlight');
        const scroller = el.closest('.studio-thread-scroll, .studio-mobile-scroll');
        if (scroller) {
          const elRect = el.getBoundingClientRect();
          const scRect = scroller.getBoundingClientRect();
          const targetTop =
            scroller.scrollTop + (elRect.top - scRect.top) - scRect.height / 2 + elRect.height / 2;
          scroller.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
        }
      }
    }
  }, { sel: selector, idx: index });
}

function muxNarratedMp4(rawWebmPath, timeline, outputMp4Path) {
  const args = ['-y', '-i', rawWebmPath];
  const filterParts = [];
  const mixInputs = [];

  timeline.forEach((entry, idx) => {
    args.push('-i', entry.audioFile);
    const inputIdx = idx + 1;
    const delayMs = Math.max(0, Math.round(entry.startMs));
    filterParts.push(`[${inputIdx}:a]adelay=${delayMs}|${delayMs},volume=1.08[a${idx}]`);
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

async function recordComponentsTour(browser, cues) {
  const tempDir = '/tmp/lumina-narration/video-components';
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: tempDir, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  const videoStart = Date.now();
  const timeline = [];
  const cueById = Object.fromEntries(cues.map((c) => [c.id, c]));

  const selectComp = async (name) => {
    await page.locator(`[data-comp-nav="${name}"]`).click();
    await page.evaluate(() => {
      document.querySelector('.exp-stage')?.scrollTo({ top: 0, behavior: 'instant' });
      document.querySelector('.exp-props-pane')?.scrollTo({ top: 0, behavior: 'instant' });
    });
  };

  const runCue = async (id, hudLayout, fn) => {
    const cue = cueById[id];
    const startMs = Date.now() - videoStart;
    timeline.push({ id, startMs, audioFile: cue.audioFile });
    await setHud(page, cue, hudLayout);
    const t0 = Date.now();
    if (fn) await fn();
    const elapsed = Date.now() - t0;
    const remaining = Math.max(240, cue.durationMs + 380 - elapsed);
    await sleep(remaining);
  };

  await page.goto('http://localhost:5173/?mode=components', { waitUntil: 'networkidle' });
  const stage = page.locator('.exp-stage');
  await page.locator('.exp-props-pane').waitFor({ state: 'visible' });

  // Chapter 1: Intro — spotlight visual Properties Definition & Device/Theme controls
  await runCue('intro', 'explorer', async () => {
    await sleep(2600);
    await spotlight(page, '.exp-props-pane', 0);
    await sleep(3400);
    await spotlight(page, '.exp-toolbar', 0);
    await sleep(3000);
    await spotlight(page, null);
  });

  // Chapter 2: 01 Row, 02 Column, 03 Grid (Desktop -> iPad -> iPhone!), 04 List
  await runCue('layout_1_to_4', 'explorer', async () => {
    await selectComp('Row');
    await spotlight(page, '.exp-frame-outer', 0);
    await sleep(2800);

    await selectComp('Column');
    await sleep(2600);

    await selectComp('Grid');
    await sleep(1600);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPad' }).click();
    await sleep(1600);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPhone' }).click();
    await sleep(1600);

    await page.locator('.exp-toolbar').getByRole('button', { name: 'Desktop' }).click();
    await selectComp('List');
    await sleep(900);
    await stage.locator('button[role="switch"]').first().click();
  });

  // Chapter 3: 05 Carousel, 06 Card (Light -> Dark Mode!), 07 Divider
  await runCue('layout_5_to_7', 'explorer', async () => {
    await selectComp('Carousel');
    await sleep(3400);

    await selectComp('Card');
    await sleep(2000);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'Toggle theme' }).click();
    await sleep(2400);

    await selectComp('Divider');
  });

  // Chapter 4: 08 Tabs, 09 Accordion, 10 Modal (iPad Dialog -> iPhone Bottom Sheet!)
  await runCue('layout_8_to_10', 'explorer', async () => {
    await selectComp('Tabs');
    await sleep(1400);
    await stage.getByRole('tab', { name: /Budget/i }).click();
    await sleep(1600);

    await selectComp('Accordion');
    await sleep(1300);
    await stage.getByText('Baggage Allowance').click();
    await sleep(1500);

    await selectComp('Modal');
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPad' }).click();
    await sleep(700);
    await stage.getByRole('button', { name: /Inspect Security Details/i }).click();
    await sleep(1500);
    await page.getByRole('button', { name: 'Close' }).click();
    await sleep(400);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPhone' }).click();
    await sleep(600);
    await stage.getByRole('button', { name: /Inspect Security Details/i }).click();
    await sleep(1800);
    await page.getByRole('button', { name: 'Close' }).click();
  });

  // Chapter 5: Back to Desktop + Light Mode -> 11 Text, 12 Image (zoom!), 13 Icon
  await page.locator('.exp-toolbar').getByRole('button', { name: 'Desktop' }).click();
  await page.locator('.exp-toolbar').getByRole('button', { name: 'Toggle theme' }).click();

  await runCue('media_11_to_13', 'explorer', async () => {
    await selectComp('Text');
    await sleep(3400);

    await selectComp('Image');
    await sleep(1500);
    await stage.locator('.lumina-image-wrap').click();
    await sleep(1500);
    await page.getByRole('button', { name: 'Close' }).click();
    await sleep(600);

    await selectComp('Icon');
  });

  // Chapter 6: 14 Avatar, 15 StatusBadge, 16 Video, 17 AudioPlayer
  await runCue('media_14_to_17', 'explorer', async () => {
    await selectComp('Avatar');
    await sleep(3000);

    await selectComp('StatusBadge');
    await sleep(3000);

    await selectComp('Video');
    await sleep(3000);

    await selectComp('AudioPlayer');
  });

  // Chapter 7: 18 Button, 19 TextField, 20 CheckBox, 21 Switch (+ Dark Mode!)
  await runCue('inputs_18_to_21', 'explorer', async () => {
    await selectComp('Button');
    await sleep(3000);

    await selectComp('TextField');
    await sleep(3000);

    await selectComp('CheckBox');
    await sleep(2500);

    await selectComp('Switch');
    await sleep(1000);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'Toggle theme' }).click();
    await sleep(1100);
    await stage.locator('button[role="switch"]').first().click();
  });

  // Chapter 8: 22 SegmentedControl, 23 ChoicePicker, 24 Slider, 25 StepperInput, 26 DateTimeInput (Desktop/iPad/iPhone)
  await runCue('inputs_22_to_26', 'explorer', async () => {
    await selectComp('SegmentedControl');
    await sleep(1200);
    await stage.getByRole('radio', { name: /First Suite/i }).click();
    await sleep(1400);

    await selectComp('ChoicePicker');
    await sleep(1200);
    await stage.getByText('EU West (Frankfurt)').click();
    await sleep(1400);

    await selectComp('Slider');
    const slider = stage.locator('input[type="range"].lumina-slider').first();
    await slider.fill('1250');
    await slider.dispatchEvent('change');
    await sleep(2200);

    await selectComp('StepperInput');
    await sleep(900);
    await stage.getByRole('button', { name: /Increase Hotel Nights/i }).click();
    await sleep(1600);

    await selectComp('DateTimeInput');
    await sleep(900);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPad' }).click();
    await sleep(1000);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPhone' }).click();
  });

  // Chapter 9: Desktop + Light Mode -> 27 ThoughtTrace, 28 StepTimeline, 29 ApprovalCard (Desktop -> iPhone + check unlock!), 30 ProgressIndicator
  await page.locator('.exp-toolbar').getByRole('button', { name: 'Desktop' }).click();
  await page.locator('.exp-toolbar').getByRole('button', { name: 'Toggle theme' }).click();

  await runCue('thinking_27_to_30', 'explorer', async () => {
    await selectComp('ThoughtTrace');
    await sleep(3200);

    await selectComp('StepTimeline');
    await sleep(3000);

    await selectComp('ApprovalCard');
    await sleep(1600);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPhone' }).click();
    await sleep(1400);
    await stage.getByText('I verified warehouse return scan #RT-9042').click();
    await sleep(1500);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'Desktop' }).click();
    await sleep(600);

    await selectComp('ProgressIndicator');
  });

  // Chapter 10: Dark Mode -> 31 SourceList, 32 CodeBlock, 33 DiffViewer (Desktop -> iPad -> iPhone!)
  await page.locator('.exp-toolbar').getByRole('button', { name: 'Toggle theme' }).click();

  await runCue('sources_31_to_33', 'explorer', async () => {
    await selectComp('SourceList');
    await sleep(3400);

    await selectComp('CodeBlock');
    await sleep(3200);

    await selectComp('DiffViewer');
    await sleep(1600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'narrated_preview_codeblock.png') });
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPad' }).click();
    await sleep(1400);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPhone' }).click();
    await sleep(1800);
  });

  // Chapter 11: 34 ArtifactCard (Desktop / iPad / iPhone bottom sheet!), 35 Callout (Dark -> Light!)
  await page.locator('.exp-toolbar').getByRole('button', { name: 'Desktop' }).click();

  await runCue('docs_34_to_35', 'explorer', async () => {
    await selectComp('ArtifactCard');
    await sleep(1600);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPhone' }).click();
    await sleep(700);
    await stage.locator('.lumina-artifact-card').click();
    await sleep(1800);
    await page.getByRole('button', { name: 'Close' }).click();
    await sleep(500);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'Desktop' }).click();

    await selectComp('Callout');
    await sleep(1800);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'Toggle theme' }).click();
  });

  // Chapter 12: 36 StatMetric, 37 Chart (Hover + iPad + iPhone!)
  await runCue('data_36_to_37', 'explorer', async () => {
    await selectComp('StatMetric');
    await sleep(4000);

    await selectComp('Chart');
    await sleep(1000);
    const canvas = stage.locator('.lumina-chart-canvas').first();
    const box = await canvas.boundingBox();
    if (box) {
      for (const frac of [0.2, 0.5, 0.85]) {
        await page.mouse.move(box.x + box.width * frac, box.y + box.height * 0.5, { steps: 8 });
        await sleep(550);
      }
    }
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPad' }).click();
    await sleep(1300);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPhone' }).click();
    await sleep(1300);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'Desktop' }).click();
  });

  // Chapter 13: 38 DataTable, 39 KeyValueList, 40 ComparisonMatrix (Desktop -> iPad -> iPhone!), 41 FollowUpSuggestions
  await runCue('data_38_to_41', 'explorer', async () => {
    await selectComp('DataTable');
    await sleep(1300);
    await stage.getByRole('button', { name: /Annual Revenue/i }).click();
    await sleep(1800);

    await selectComp('KeyValueList');
    await sleep(2800);

    await selectComp('ComparisonMatrix');
    await sleep(1500);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPad' }).click();
    await sleep(1200);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'iPhone' }).click();
    await sleep(1600);
    await page.locator('.exp-toolbar').getByRole('button', { name: 'Desktop' }).click();

    await selectComp('FollowUpSuggestions');
  });

  // Chapter 14: Practical Playbook Guide
  await spotlight(page, null);
  await page.getByRole('tab', { name: 'Playbook' }).click();
  await page.locator('.exp-playbook-grid').waitFor({ state: 'visible' });

  await runCue('tl_playbook', 'center', async () => {
    await spotlight(page, '.exp-playbook-grid', 0);
    await sleep(8500);
    await spotlight(page, '.exp-adapt-banner', 0);
  });

  await spotlight(page, null);
  await sleep(450);

  const rawVideoPath = await page.video().path();
  await context.close();

  const outMp4 = path.join(ARTIFACT_DIR, 'lumina_components_deep_dive_narrated.mp4');
  muxNarratedMp4(rawVideoPath, timeline, outMp4);
  console.log(`[showcase] Rendered -> ${outMp4}`);
}

async function recordHeroStudioTour(browser, cues) {
  const tempDir = '/tmp/lumina-narration/video-studio';
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: tempDir, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  const web = page.locator('.studio-web-workspace');
  const videoStart = Date.now();
  const timeline = [];
  const cueById = Object.fromEntries(cues.map((c) => [c.id, c]));

  const runCue = async (id, fn) => {
    const cue = cueById[id];
    const startMs = Date.now() - videoStart;
    timeline.push({ id, startMs, audioFile: cue.audioFile });
    await setHud(page, cue, 'sxs');
    const t0 = Date.now();
    if (fn) await fn();
    const elapsed = Date.now() - t0;
    const remaining = Math.max(260, cue.durationMs + 380 - elapsed);
    await sleep(remaining);
  };

  await page.goto('http://localhost:5174/?sxs=1', { waitUntil: 'networkidle' });
  await web.getByText('What can Lumina build for you?').waitFor({ state: 'visible' });

  await runCue('studio_intro', async () => {
    await sleep(1600);
    await spotlight(page, '.studio-sxs-pane .studio-phone-bezel', 0);
    await sleep(3400);
    await spotlight(page, null);
  });

  await runCue('hero1_turn1', async () => {
    await web.getByRole('button', { name: /Executive Tokyo Concierge/i }).click();
    await web.getByText('Nonstop Business Class').waitFor({ state: 'visible' });
    await sleep(900);
    await spotlightSxs(page, '.lumina-thought', 0);
    await web.locator('.lumina-thought-trigger').first().click();
    await sleep(1800);
    await spotlightSxs(page, '.lumina-compare', 0);
    await sleep(2600);
    await spotlightSxs(page, '.lumina-carousel', 0);
  });

  await runCue('hero1_turn2', async () => {
    await spotlight(page, null);
    await web.getByRole('button', { name: /Select ANA NH 105/i }).click();
    await web.getByText('Customize Itinerary Preferences').waitFor({ state: 'visible' });
    await sleep(900);
    await spotlightSxs(page, '.lumina-segmented', 0);
    await web.getByRole('radio', { name: /First Suite/i }).click();
    await sleep(1200);
    await spotlightSxs(page, '.lumina-stepper-field', 0);
    await web.getByRole('button', { name: /Increase Travelers/i }).click();
    await sleep(1200);
    await spotlightSxs(page, '.lumina-approval', 0);
  });

  await runCue('hero1_turn3', async () => {
    await spotlight(page, null);
    await web.getByRole('button', { name: /Confirm & Issue Pass/i }).click();
    await web.getByText('LUM-8842K').waitFor({ state: 'visible' });
    await sleep(1000);
    await web.getByRole('button', { name: /Copy Confirmation PNR/i }).click();
    await sleep(1400);
    await spotlightSxs(page, '.lumina-artifact-card', 0);
    await sleep(900);
    await web.locator('.lumina-artifact-card').first().click();
    await web.locator('.studio-canvas-pane').waitFor({ state: 'visible' });
    await sleep(2800);
    await web.getByRole('button', { name: 'Close canvas' }).click();
  });

  await spotlight(page, null);
  await page.getByRole('button', { name: /New Chat/i }).click();
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await sleep(300);

  await runCue('hero2_research', async () => {
    await web.getByRole('button', { name: /AI Semiconductor Deep Research/i }).click();
    await web.getByText('Quarterly AI Silicon Revenue by Layer').waitFor({ state: 'visible' });
    await sleep(900);
    await spotlightSxs(page, '.lumina-sources', 0);
    await sleep(1800);
    await spotlightSxs(page, '.lumina-grid', 0);
    await sleep(2200);
    await spotlightSxs(page, '.lumina-chart-card', 0);
    const box = await web.locator('.lumina-chart-canvas').first().boundingBox();
    if (box) {
      for (const frac of [0.2, 0.55, 0.85]) {
        await page.mouse.move(box.x + box.width * frac, box.y + box.height * 0.5, { steps: 8 });
        await sleep(450);
      }
    }
    await spotlightSxs(page, '.lumina-table-card', 0);
    await web.getByRole('button', { name: /YoY Growth/i }).click();
  });

  await spotlight(page, null);
  await page.getByRole('button', { name: /New Chat/i }).click();
  await sleep(300);

  await runCue('hero3_devops', async () => {
    await web.getByRole('button', { name: /Production Incident & Hotfix Copilot/i }).click();
    await web.getByText('Approve Production Hotfix Rollout').waitFor({ state: 'visible' });
    await sleep(900);
    await spotlightSxs(page, '.lumina-callout', 0);
    await sleep(1700);
    await spotlightSxs(page, '.lumina-codeblock', 0);
    await sleep(1700);
    await spotlightSxs(page, '.lumina-diff', 0);
    await sleep(2400);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'narrated_preview_studio_xray.png') });
    await spotlightSxs(page, '.lumina-approval', 0);
    await sleep(1600);
    await web.getByText('I verified staging canary metrics').click();
    await sleep(1200);
    await web.getByRole('button', { name: /Deploy Hotfix to Production/i }).click();
    await web.getByText('Healthy · p99 42ms').waitFor({ state: 'visible' });
    await spotlightSxs(page, '.lumina-progress', 0);
  });

  await spotlight(page, null);
  await page.getByRole('button', { name: /New Chat/i }).click();
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await sleep(300);

  await runCue('hero4_wealth', async () => {
    await web.getByRole('button', { name: /Wealth & Subscription Optimizer/i }).click();
    await web.getByText('Monthly Cashflow Breakdown').waitFor({ state: 'visible' });
    await sleep(900);
    await spotlightSxs(page, '.lumina-chart-card', 0);
    await sleep(2200);
    await spotlightSxs(page, '.lumina-list', 0);
    await sleep(1700);
    await spotlightSxs(page, '.lumina-slider-field', 0);
    const slider = web.locator('input[type="range"].lumina-slider').first();
    await slider.fill('950');
    await slider.dispatchEvent('change');
    await sleep(1600);
    await web.getByRole('button', { name: /Apply Optimization Plan/i }).click();
    await web.getByText('Wealth Plan Active').waitFor({ state: 'visible' });
    await sleep(1100);
    await page.getByRole('button', { name: /X-Ray/i }).click();
    await spotlight(page, '.studio-xray-pane', 0);
  });

  await spotlight(page, null);
  await sleep(450);

  const rawVideoPath = await page.video().path();
  await context.close();

  const outMp4 = path.join(ARTIFACT_DIR, 'lumina_hero_agent_studio_narrated.mp4');
  muxNarratedMp4(rawVideoPath, timeline, outMp4);
  console.log(`[showcase] Rendered -> ${outMp4}`);
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  const agentProc = startServer('pnpm', ['--filter', '@a2ui-catalog/agent', 'start'], {
    LUMINA_AGENT_MODE: 'replay',
  });
  const expProc = startServer('pnpm', ['--filter', '@a2ui-catalog/explorer', 'preview']);
  const studioProc = startServer('pnpm', ['--filter', '@a2ui-catalog/studio', 'preview']);

  try {
    await Promise.all([
      waitForUrl('http://localhost:10002/health'),
      waitForUrl('http://localhost:5173'),
      waitForUrl('http://localhost:5174'),
    ]);

    const onlyArg = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];
    const browser = await chromium.launch({ headless: true });
    try {
      if (!onlyArg || onlyArg === 'components') {
        await recordComponentsTour(browser, manifest.components_tour);
      }
      if (!onlyArg || onlyArg === 'studio') {
        await recordHeroStudioTour(browser, manifest.hero_studio_tour);
      }
    } finally {
      await browser.close();
    }
  } finally {
    agentProc.kill('SIGTERM');
    expProc.kill('SIGTERM');
    studioProc.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
