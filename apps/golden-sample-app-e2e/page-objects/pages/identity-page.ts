import { User } from '../../data/data-types/user';
import { BasePage } from './_base-page';
import { defaultUser } from '../../data/credentials';

export class IdentityPage extends BasePage {
  userName = this.$('#username');
  userNameLabel = this.$('label[for="username"]');
  password = this.$('#password');
  passwordLabel = this.$('label[for="password"]');
  errorMessage = this.$('#input-error');
  loginButton = this.$('.btn[value="Log in"]');
  loginForm = this.$('.identity-container__panel');

  async login(user: User = defaultUser) {
    await this.open();
    await this.userName.fill(user.username);
    await this.password.fill(user.password);
    await this.loginButton.click();
  }
}
