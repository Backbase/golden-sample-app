import { expect } from '@playwright/test';
import { test } from '../../test-runner/test-runner';
import { wrongUser } from '../../data/credentials';
import { i18n } from '../../data/localization/login-page-data';

// IMPORTANT: to run Login test you should run app without mocks: `npm run start`
test.describe('Login tests', { tag: ['@feature', '@i18n', '@e2e', '@identity'] }, () => {
  test('Empty user name', async ({ identityPage, visual }) => {
    await identityPage.open();
    await visual.step('Then validate Login form fields labels', async () => {
      await expect
        .soft(identityPage.userNameLabel, `Expect Username label: "${i18n.identity.username}"`)
        .toHaveText(i18n.identity.username);
      await expect
        .soft(identityPage.passwordLabel, `Expect Password label: "${i18n.identity.password}"`)
        .toHaveText(i18n.identity.password);
    });
    await visual.step(`When User fill in credentials: "${wrongUser.username}/${wrongUser.password}"`, async () => {
      await identityPage.userName.fill(wrongUser.username);
      await identityPage.password.fill(wrongUser.password);
    });
    await test.step('And Try to login', async () => {
      await identityPage.loginButton.click();
    });
    await visual.step('Then validate failed login error message', async () => {
      await expect(identityPage.errorMessage, `Expect error message: "${i18n.identity.error}"`)
        .toHaveText(i18n.identity.error);
    });
  });
});
