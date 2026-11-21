import { test, expect } from '@playwright/test';

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

test('Home Page & Explorer Workbench — Plain-English Tour, Live Playground, Streaming & Device Frames', async ({
  page,
}) => {
  await page.goto('http://localhost:5173');
  await expect(page.getByText('A2UI Lumina Explorer')).toBeVisible();

  // ---- 1. Non-Technical Home Page (Default Landing View) ----
  await expect(
    page.getByRole('heading', {
      name: /Turn long AI text replies into clear cards, charts, and tap-friendly controls/i,
    }),
  ).toBeVisible();
  await expect(page.getByText('Visual Building Blocks', { exact: true })).toBeVisible();
  await expect(page.getByRole('tab', { name: /1\. Beyond Plain Text/i })).toBeVisible();

  // Exercise live "Try the Difference Yourself" playground (Plain Text vs. Live Lumina Surface)
  await expect(page.getByText('Table for Three')).toBeVisible();
  await page.getByRole('tab', { name: /Plan Monthly Savings/i }).click();
  await expect(
    page.locator('[data-home-live-demo="savings"]').getByText('$416,129'),
  ).toBeVisible();

  await page.getByRole('tab', { name: /Approve a Booking/i }).click();
  const bookBtn = page.getByRole('button', { name: /Approve & Book \(\$1,240\)/i });
  await expect(bookBtn).toBeDisabled();
  await page.getByText('I verified the May 12–15 dates and non-refundable rate').click();
  await expect(bookBtn).toBeEnabled();
  await bookBtn.click();

  // Exercise 6-job 49-component catalog browser & jump into live component workbench
  await page.getByText('Show developer component names').click();
  await expect(page.locator('.home-item-dev', { hasText: 'StatMetric' })).toBeVisible();
  await page.getByRole('button', { name: /Headline Metric Card/i }).click();
  const stage = page.locator('.exp-stage');
  await expect(stage.getByRole('heading', { name: 'StatMetric' })).toBeVisible();

  // ---- 2. Interactive Showcases Workbench ----
  await page.getByRole('tab', { name: /^Showcases$/i }).click();
  await expect(stage.getByText('Promote Release v2.14.2 to 100% Production')).toBeVisible();
  await pause(400);

  // Demonstrate @checks gating on ApprovalCard
  const deployBtn = stage.getByRole('button', { name: /Approve Production Deploy/i });
  await expect(deployBtn).toBeDisabled();
  await stage.getByText('I verified staging telemetry & rollback readiness').click();
  await expect(deployBtn).toBeEnabled();
  await pause(300);
  await deployBtn.click();
  await expect(stage.getByText('Approved and dispatched to agent')).toBeVisible();
  await pause(400);

  // Switch to Data & Synthesis and trigger Simulate Stream
  await page.getByRole('button', { name: /KPI Bento Grid/i }).click();
  await expect(stage.getByText('Annual Recurring Revenue')).toBeVisible();
  await pause(400);
  await page.getByRole('button', { name: /Simulate Stream/i }).click();
  await pause(1200);

  // Hover across the area chart to showcase magnetic crosshair + live readout
  const chartCanvas = stage.locator('.lumina-chart-canvas').first();
  const box = await chartCanvas.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.5);
    await pause(250);
    await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.5);
    await pause(250);
    await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.5);
    await pause(250);
  }

  // Toggle Dark Mode (Obsidian)
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await pause(500);

  // Switch to Grounding & Code
  await page.getByRole('button', { name: /SourceList, CodeBlock/i }).click();
  await expect(stage.getByText('src/retry-policy.ts')).toBeVisible();
  await pause(400);

  // Switch to iPhone 15 Pro frame -> DiffViewer auto-reflows to unified!
  await page.getByRole('button', { name: 'iPhone' }).click();
  await pause(500);
  await expect(stage.locator('.lumina-diff-unified')).toBeVisible();

  // Switch to Tactile Inputs and open Modal -> renders as Mobile Bottom Sheet!
  await page.getByRole('button', { name: /SegmentedControl, Switch/i }).click();
  await expect(stage.getByText('Workspace Provisioning')).toBeVisible();
  await pause(400);
  await stage.getByRole('button', { name: /Preview Modal \/ Sheet/i }).click();
  await expect(page.locator('[data-lumina-sheet="mobile"]')).toBeVisible();
  await pause(600);
  await page.getByRole('button', { name: 'Close' }).click();
  await pause(300);

  // Switch to DataModel inspector tab and verify live bindings
  await page.getByRole('button', { name: /DataModel/i }).click();
  await stage.getByRole('button', { name: /Increase Team Seats/i }).click();
  await pause(400);
  await expect(page.locator('.exp-pre')).toContainText('"seats": 5');
  await pause(400);
});
