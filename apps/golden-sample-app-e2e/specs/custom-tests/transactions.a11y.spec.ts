import { test } from '../../test-runner/test-runner';
import { expect } from '@backbase-gsa/e2e-tests';

test.describe('@a11y Transaction Page A11y tests', () => {
  test.beforeEach(async ({ transactionsPage }) => {
    await transactionsPage.open();
  });

  test('Validate Transaction page accessibility with disabled rules',
    async ({ page }, testInfo) => {
      await expect({ page, testInfo })
        .toBeAccessible({ disableRules: ['color-contrast', 'link-name'] });
    });

  test('Validate Transaction page accessibility for locale dropdown menu',
    async ({ page }, testInfo) => {
      const transactionListEntry = `[data-role="transactions-view__item-container"]`;
      await expect({ page, testInfo }).toBeAccessible({
        include: transactionListEntry,
        disableRules: ['color-contrast'],
      });
    });
});
