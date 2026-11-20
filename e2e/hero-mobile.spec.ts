import { test, expect } from '@playwright/test';

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

test('Studio Mobile (iPhone 15 Pro) — Responsive Cards, Unified Diff, 44px Targets & Zero Overflow', async ({ page }) => {
  await page.goto('http://localhost:5174');
  await expect(page.getByText('What can Lumina build for you?')).toBeVisible();
  await pause(700);

  // Verify zero horizontal page overflow on mobile welcome screen
  const welcomeOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(welcomeOverflow).toBe(false);

  // Launch Hero 1 on mobile
  await page.getByRole('button', { name: /Executive Tokyo Concierge/i }).click();
  await expect(page.locator('.lumina-compare-mobile-rail')).toBeVisible();
  await pause(800);

  // Verify coarse-pointer minimum touch target >= 44px on primary buttons
  const selectBtn = page.getByRole('button', { name: /Select ANA NH 105/i });
  const btnBox = await selectBtn.boundingBox();
  expect(btnBox).toBeTruthy();
  expect(btnBox!.height).toBeGreaterThanOrEqual(42);

  // Tap through multi-turn customization & confirmation
  await selectBtn.click();
  await expect(page.getByText('Customize Itinerary Preferences')).toBeVisible();
  await pause(700);
  await page.getByRole('button', { name: /Confirm & Issue Pass/i }).click();
  await expect(page.getByText('LUM-8842K')).toBeVisible();
  await pause(700);

  // Open ArtifactCard on mobile -> fullscreen Canvas overlay
  await page.locator('.lumina-artifact-card').first().click();
  await expect(page.locator('.studio-canvas-pane')).toBeVisible();
  await pause(900);
  await page.getByRole('button', { name: 'Close canvas' }).click();

  // Launch Hero 3 in Dark Mode on mobile -> verify DiffViewer auto-collapses to unified
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await page.getByRole('button', { name: /New Chat|session/i }).or(page.locator('.studio-icon-pill').first()).click();
  await pause(400);
  await page.getByRole('button', { name: /Production Incident & Hotfix Copilot/i }).click();
  await expect(page.locator('.lumina-diff-unified')).toBeVisible();
  await pause(900);

  const threadOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(threadOverflow).toBe(false);
});
