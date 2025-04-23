import { test } from '../../test-runner/test-runner';
import { expect } from '@backbase-gsa/e2e-tests';

test.describe(
  'Transaction Page A11y tests',
  { tag: ['@a11y', '@e2e', '@mocks'] },
  () => {
    test.beforeEach(async ({ transactionsPage }) => {
      await transactionsPage.open();
    });

    test('Validate Transaction page accessibility with disabled rules', async ({
      page,
      visual,
    }, testInfo) => {
      await visual.step('Validate Transaction page accessibility', async () => {
        await expect({ page, testInfo }).toBeAccessible({
          disableRules: ['color-contrast', 'link-name'],
        });
      });
    });

    test('Validate Transaction page accessibility for locale dropdown menu', async ({
      page,
      visual,
    }, testInfo) => {
      await visual.step(
        'Validate Transaction page accessibility for locale dropdown menu',
        async () => {
          const localeDropdown = `[data-role="locale-dropdown"]`;
          await expect({ page, testInfo }).toBeAccessible({
            include: localeDropdown,
            disableRules: ['color-contrast'],
          });
        }
      );
    });
  }
);
