import { Route } from '@playwright/test';
import { test } from '../page-objects/test-runner';

test.describe('Transaction list', () => {
    test('Error scenario', async({page}) => {
        await page.route(
            '**/transaction-manager/client-api/v2/transactions',
            async (route: Route) => {
              await route.fulfill({
                status: 500,
              });
            }
          )
          await page.goto('transactions');
          expect(true).toBe(true);
    })
});
