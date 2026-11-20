import { test, expect } from '@playwright/test';

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

test('Studio Desktop Showcase — All 4 Live Multi-Turn Hero Agent Workflows', async ({ page }) => {
  await page.goto('http://localhost:5174');
  await expect(page.getByText('What can Lumina build for you?')).toBeVisible();
  await pause(800);

  // ---- HERO 1: Executive Tokyo Concierge (3-turn flow + Canvas drawer) ----
  await page.getByRole('button', { name: /Executive Tokyo Concierge/i }).click();
  await expect(page.getByText('Nonstop Business Class')).toBeVisible();
  await pause(800);

  // Expand ThoughtTrace to inspect reasoning
  await page.locator('.lumina-thought-trigger').first().click();
  await pause(600);

  // Turn 2: Select ANA NH 105
  await page.getByRole('button', { name: /Select ANA NH 105/i }).click();
  await expect(page.getByText('Customize Itinerary Preferences')).toBeVisible();
  await pause(700);

  // Interact with SegmentedControl, StepperInput, and confirm booking
  await page.getByRole('radio', { name: /First Suite/i }).click();
  await pause(350);
  await page.getByRole('button', { name: /Increase Travelers/i }).click();
  await pause(400);
  await page.getByRole('button', { name: /Confirm & Issue Pass/i }).click();

  // Turn 3: Apple Wallet Pass + Copy PNR + Open Canvas Drawer
  await expect(page.getByText('LUM-8842K')).toBeVisible();
  await pause(600);
  await page.getByRole('button', { name: /Copy Confirmation PNR/i }).click();
  await expect(page.getByRole('status')).toContainText('LUM-8842K');
  await pause(600);
  await page.locator('.lumina-artifact-card').first().click();
  await expect(page.locator('.studio-canvas-pane')).toBeVisible();
  await pause(1000);
  await page.getByRole('button', { name: 'Close canvas' }).click();
  await pause(400);

  // ---- HERO 2: AI Semiconductor Deep Research (Obsidian Dark Mode) ----
  await page.getByRole('button', { name: /New Chat/i }).click();
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await pause(600);
  await page.getByRole('button', { name: /AI Semiconductor Deep Research/i }).click();
  await expect(page.getByText('Quarterly AI Silicon Revenue by Layer')).toBeVisible();
  await page.locator('.lumina-stat').first().scrollIntoViewIfNeeded();
  await pause(900);

  // Scrub across interactive area chart
  const areaChart = page.locator('.lumina-chart-canvas').first();
  await areaChart.scrollIntoViewIfNeeded();
  await pause(400);
  const box = await areaChart.boundingBox();
  if (box) {
    for (const frac of [0.2, 0.5, 0.8]) {
      await page.mouse.move(box.x + box.width * frac, box.y + box.height * 0.5);
      await pause(350);
    }
  }

  // Sort DataTable by clicking YoY Growth header
  const yoyHeader = page.getByRole('button', { name: /YoY Growth/i });
  await yoyHeader.scrollIntoViewIfNeeded();
  await yoyHeader.click();
  await pause(500);

  // Open Executive Memo in split-screen Canvas
  await page.locator('.lumina-artifact-card').first().click();
  await expect(page.getByText('Executive Summary & Strategic Outlook')).toBeVisible();
  await pause(1100);
  await page.getByRole('button', { name: 'Close canvas' }).click();

  // ---- HERO 3: Production Incident & Hotfix Copilot ----
  await page.getByRole('button', { name: /New Chat/i }).click();
  await pause(400);
  await page.getByRole('button', { name: /Production Incident & Hotfix Copilot/i }).click();
  await expect(page.getByText('Approve Production Hotfix Rollout')).toBeVisible();
  await page.locator('.lumina-diff').first().scrollIntoViewIfNeeded();
  await pause(900);

  const deployBtn = page.getByRole('button', { name: /Deploy Hotfix to Production/i });
  await deployBtn.scrollIntoViewIfNeeded();
  await expect(deployBtn).toBeDisabled();
  await page.getByText('I verified staging canary metrics').click();
  await expect(deployBtn).toBeEnabled();
  await pause(500);
  await deployBtn.click();
  await expect(page.getByText('Healthy · p99 42ms')).toBeVisible();
  await page.getByText('Healthy · p99 42ms').scrollIntoViewIfNeeded();
  await pause(1000);

  // ---- HERO 4: Wealth & Subscription Optimizer (Back to Alabaster Light) ----
  await page.getByRole('button', { name: /New Chat/i }).click();
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await pause(400);
  await page.getByRole('button', { name: /Wealth & Subscription Optimizer/i }).click();
  await expect(page.getByText('Monthly Cashflow Breakdown')).toBeVisible();
  await page.locator('.lumina-donut-layout').first().scrollIntoViewIfNeeded();
  await pause(800);

  // Adjust reactive Slider and observe live StatMetric update!
  const slider = page.locator('input[type="range"].lumina-slider').first();
  await slider.scrollIntoViewIfNeeded();
  await slider.fill('950');
  await slider.dispatchEvent('change');
  await expect(page.getByText('$950.00')).toBeVisible();
  await pause(700);
  await page.getByRole('button', { name: /Apply Optimization Plan/i }).click();
  await expect(page.getByText('Wealth Plan Active')).toBeVisible();
  await page.getByText('Wealth Plan Active').scrollIntoViewIfNeeded();
  await pause(600);

  // Open Protocol X-Ray briefly to showcase live A2UI v1.0 JSON-RPC frames
  await page.getByRole('button', { name: /X-Ray/i }).click();
  await expect(page.locator('.studio-xray-pane')).toBeVisible();
  await pause(500);

  // Toggle Web x Mobile Side-by-Side mode and verify synchronized Mobile Surface pane
  await page.getByRole('button', { name: /Web × Mobile/i }).click();
  await expect(page.locator('.studio-sxs-pane')).toBeVisible();
  await expect(page.locator('.studio-sxs-pane').getByText('Wealth Plan Active')).toBeVisible();
  await pause(600);
});
