import { expect } from '@playwright/test';
import { test } from '../page-objects/test-runner';
import { wrongUser } from '../data/users';
import { Screen } from '../page-objects/screen';

const i18n = {
  identity: {
    username: 'Username or email',
    password: 'Password',
    loginButton: 'Log in',
    error:
      'Incorrect username or passwordPlease check your credentials and try again.',
  },
};

// TODO Remove or update while using on project
test.describe.configure({ mode: 'parallel' });

test.describe('@feature @i18n Login tests', () => {
  test.use({ startFrom: Screen.loggedOut });
  test('Empty user name', async ({ identityPage }) => {
    await test.step('Validate Input fields labels', async () => {
      await expect.soft(identityPage.userNameLabel, { message: `Expect Username label: "${i18n.identity.username}"` })
        .toHaveText(i18n.identity.username);
      await expect.soft(identityPage.passwordLabel, { message: `Expect Password label: "${i18n.identity.password}"` })
        .toHaveText(i18n.identity.password);
    });
    // await test.step('Validate Login Form visual layout', async () => {
    //   await expect(identityPage.loginForm)
    //     .toHaveScreenshot(`en-translation.png`);
    // });
    await test.step(
      `Fill in credentials: "${wrongUser.username}/${wrongUser.password}"`,
      async () => {
        await identityPage.userName.fill(wrongUser.username);
        await identityPage.password.fill(wrongUser.password);
      },
    );
    await test.step('Try to login"', async () => {
      await identityPage.loginButton.click();
    });
    await test.step('Validate Failed login error message', async () => {
      await expect(identityPage.errorMessage, { message: `Expect error message: "${i18n.identity.error}"` })
        .toHaveText(i18n.identity.error);
    });
    // await test.step('Validate Failed login error visual layout', async () => {
    //   await expect(identityPage.errorMessage)
    //     .toHaveScreenshot(`en-error.png`);
    // });
  });

});
