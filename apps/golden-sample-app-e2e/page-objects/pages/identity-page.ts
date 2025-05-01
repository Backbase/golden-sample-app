import { expect } from '@playwright/test';
import { BasePage } from '@backbase-gsa/e2e-tests';
import { User } from '../../data/data-types/user';
import { defaultUser } from '../../data/credentials';

export class IdentityPage extends BasePage {
  userName = this.locator('#username');
  userNameLabel = this.locator('label[for="username"]');
  password = this.locator('#password');
  passwordLabel = this.locator('label[for="password"]');
  errorMessage = this.locator('div[data-role="login-template__alert"]');
  loginButton = this.locator('.btn[name="login"]');
  loginForm = this.locator('.identity-container__panel');

  async login(user: User = defaultUser) {
    await this.open();
    await this.userName.fill(user.username);
    await this.password.fill(user.password);
    await this.loginButton.click();
  }

  async tryToLogin() {
    await this.loginButton.click();
    await expect(this.errorMessage).toBeVisible();
  }
}
