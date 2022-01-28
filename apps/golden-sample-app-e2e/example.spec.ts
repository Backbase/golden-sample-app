import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:4200');
  const title = page.locator('[data-role="headings"]');
  await expect(title).toHaveText('Welcome to golden sample application');
});
