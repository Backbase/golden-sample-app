import { expect } from '@playwright/test';
import { test } from '../../test-runner/test-runner';
import { wrongUser } from '../../data/credentials';
import { i18n } from '../../data/localization/locale';

test.describe(
  'Login tests',
  { tag: ['@feature', '@i18n', '@e2e', '@ephemeral'] },
  () => {
    test.beforeEach(async ({ identityPage }) => {
      await identityPage.open();
    });

    test('Login as user with wrong credentials', async ({ identityPage }) => {
      await identityPage.fillInUserCredentials(wrongUser);
      await identityPage.tryToLogin();
      await expect(
        identityPage.errorMessage,
        `Expect error message: "${i18n.identity.error}"`
      ).toHaveText(i18n.identity.error);
    });

    test('[Steps] Login as user with wrong credentials', async ({
      identityPage,
    }) => {
      await test.step(`When User has entered credentials: "${wrongUser.username} / ${wrongUser.password}"`, async () => {
        await identityPage.userName.fill(wrongUser.username);
        await identityPage.password.fill(wrongUser.password);
      });
      await identityPage.tryToLogin();
      await expect(
        identityPage.errorMessage,
        `Expect error message: "${i18n.identity.error}"`
      ).toHaveText(i18n.identity.error);
    });
  }
);
