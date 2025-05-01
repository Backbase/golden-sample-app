import { expect } from '@playwright/test';
import { test } from '../../test-runner/test-runner';
import { wrongUser } from '../../data/credentials';
import { i18n } from '../../data/localization/login-page-data';

test.describe(
  'Login tests',
  { tag: ['@feature', '@i18n', '@e2e', '@ephemeral'] },
  () => {
    test.beforeEach(async ({ identityPage }) => {
      await identityPage.open();
    });
    test('Login as user with wrong credentials', async ({
      identityPage,
      visual,
    }) => {
      await visual.step(
        `When User has entered credentials: "${wrongUser.username} / ${wrongUser.password}"`,
        async () => {
          await identityPage.userName.fill(wrongUser.username);
          await identityPage.password.fill(wrongUser.password);
        }
      );
      await test.step('And Try to login to the banking app', async () => {
        await identityPage.tryToLogin();
      });
      await visual.step(
        'Then User should see the failed login error message ${i18n.identity.error}',
        async () => {
          await expect(
            identityPage.errorMessage,
            `Expect error message: "${i18n.identity.error}"`
          ).toHaveText(i18n.identity.error);
        }
      );
    });
  }
);
