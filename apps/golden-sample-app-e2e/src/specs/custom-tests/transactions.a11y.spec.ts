import { test } from '../../fixtures/test';
import { expect } from '@playwright/test';

test.describe(
  'Transaction Page A11y tests',
  { tag: ['@a11y', '@e2e', '@mocks'] },
  () => {
    test.beforeEach(async ({ transactionsPage }) => {
      await transactionsPage.open();
    });

    test('Validate Transactions page accessibility with disabled rules', async ({
      page,
    }, testInfo) => {
      await test.step('Validate Transaction page accessibility', async () => {
        await expect({ page, testInfo }).toBeAccessible({
          disableRules: ['color-contrast', 'link-name'],
        });
      });
    });

    test('Validate Transactions page accessibility with disabled rules via Page Object method', async ({
      transactionsPage,
    }) => {
      await transactionsPage.toBeAccessible({
        disableRules: ['color-contrast', 'link-name'],
      });
    });

    test('Validate Transactions element accessibility', async ({
      page,
    }, testInfo) => {
      await test.step('Validate Transaction element accessibility', async () => {
        await expect({ page, testInfo }).toBeAccessible({
          include: 'bb-transaction-item',
          disableRules: ['color-contrast'],
        });
      });
    });

    test('Validate Transactions element accessibility via Component method', async ({
      transactionsPage,
    }) => {
      await transactionsPage.transactions.toBeAccessible({
        disableRules: ['color-contrast'],
      });
    });
  }
);
