import { expect, test } from '@playwright/test';

test.describe('Layer 3 Isolated Preview Harness — All 49 Component Fixtures', () => {
  test('mounts all 49 vertical-slice examples in light and dark mode with zero runtime errors', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    await page.goto('/?mode=all&theme=light&viewport=desktop');

    const mainCanvas = page.getByRole('main', { name: 'Component preview canvas' });
    await expect(mainCanvas).toBeVisible();

    const fixtureCards = page.locator('[data-slice-slug]');
    await expect(fixtureCards).toHaveCount(49);

    await page.getByRole('button', { name: 'Dark', exact: true }).click();
    await expect(page.locator('.lumina-root').first()).toHaveAttribute('data-lumina-theme', 'dark');

    await page.goto('/?component=comparison-matrix&theme=light&viewport=mobile');
    await expect(mainCanvas).toBeVisible();
    await expect(page.locator('.lumina-compare-mobile-rail')).toBeVisible();

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
});
