import { test, expect } from '@playwright/test';

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

test('Explorer Workbench — Streaming, Theme Toggle, Device Frames & Modal Sheet', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const stage = page.locator('.exp-stage');
  await expect(page.getByText('A2UI Lumina Explorer')).toBeVisible();
  await expect(stage.getByText('Promote Release v2.14.2 to 100% Production')).toBeVisible();
  await pause(700);

  // Demonstrate @checks gating on ApprovalCard
  const deployBtn = stage.getByRole('button', { name: /Approve Production Deploy/i });
  await expect(deployBtn).toBeDisabled();
  await stage.getByText('I verified staging telemetry & rollback readiness').click();
  await expect(deployBtn).toBeEnabled();
  await pause(500);
  await deployBtn.click();
  await expect(stage.getByText('Approved and dispatched to agent')).toBeVisible();
  await pause(600);

  // Switch to Data & Synthesis and trigger Simulate Stream
  await page.getByRole('button', { name: /KPI Bento Grid/i }).click();
  await expect(stage.getByText('Annual Recurring Revenue')).toBeVisible();
  await pause(500);
  await page.getByRole('button', { name: /Simulate Stream/i }).click();
  await pause(1200);

  // Hover across the area chart to showcase magnetic crosshair + live readout
  const chartCanvas = stage.locator('.lumina-chart-canvas').first();
  const box = await chartCanvas.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.5);
    await pause(350);
    await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.5);
    await pause(350);
    await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.5);
    await pause(350);
  }

  // Toggle Dark Mode (Obsidian)
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await pause(700);

  // Switch to Grounding & Code
  await page.getByRole('button', { name: /SourceList, CodeBlock/i }).click();
  await expect(stage.getByText('src/retry-policy.ts')).toBeVisible();
  await pause(600);

  // Switch to iPhone 15 Pro frame -> DiffViewer auto-reflows to unified!
  await page.getByRole('button', { name: 'iPhone' }).click();
  await pause(700);
  await expect(stage.locator('.lumina-diff-unified')).toBeVisible();

  // Switch to Tactile Inputs and open Modal -> renders as Mobile Bottom Sheet!
  await page.getByRole('button', { name: /SegmentedControl, Switch/i }).click();
  await expect(stage.getByText('Workspace Provisioning')).toBeVisible();
  await pause(500);
  await stage.getByRole('button', { name: /Preview Modal \/ Sheet/i }).click();
  await expect(page.locator('[data-lumina-sheet="mobile"]')).toBeVisible();
  await pause(900);
  await page.getByRole('button', { name: 'Close' }).click();
  await pause(400);

  // Switch to DataModel inspector tab and verify live bindings
  await page.getByRole('button', { name: /DataModel/i }).click();
  await stage.getByRole('button', { name: /Increase Team Seats/i }).click();
  await pause(500);
  await expect(page.locator('.exp-pre')).toContainText('"seats": 5');
  await pause(600);
});
