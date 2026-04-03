import { expect, test } from '@playwright/test';

test.describe('smoke', () => {
  test('home page loads', async ({ page }) => {
    const res = await page.goto('/', { waitUntil: 'load' });
    expect(res?.ok()).toBeTruthy();
    await expect(page).toHaveTitle(/Two X/i, { timeout: 45_000 });
  });
});
