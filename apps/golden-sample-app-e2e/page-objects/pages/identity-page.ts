import { expect, test } from '@playwright/test';
import { BasePage, PAGE_TO_LOAD } from '@backbase-gsa/e2e-tests';
import { User } from '../../data/data-types/user';
import { defaultUser } from '../../data/credentials';

export class IdentityPage extends BasePage {
  userName = this.locator('#username');
  password = this.locator('#password');
  errorMessage = this.locator('div[data-role="login-template__alert"]');
  loginButton = this.locator('.btn[name="login"]');

  async fillInUserCredentials(user: User = defaultUser) {
    await this.userName.fill(user.username);
    await this.password.fill(user.password);
  }

  async login(user: User = defaultUser) {
    await test.step(`When Login to the Bank as user: ${user.username}`, async () => {
      await this.fillInUserCredentials(user);
      await this.loginToBankingApp();
    });
  }

  async loginToBankingApp() {
    await test.step('And Try to login to the banking app', async () => {
      await this.loginButton.click();
      await expect(this.pageHeader).toHaveText('Dashboard', {
        timeout: PAGE_TO_LOAD,
      });
    });
  }

  async tryToLogin() {
    await test.step('And Try to login to the banking app', async () => {
      await this.loginButton.click();
    });
  }
}
