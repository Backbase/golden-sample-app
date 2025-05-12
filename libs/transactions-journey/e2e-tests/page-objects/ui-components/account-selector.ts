import { expect } from '@playwright/test';
import { BaseComponent } from '@backbase-gsa/e2e-tests';
import type { Account } from '../../data/account';

export class AccountSelector extends BaseComponent {
  label = this.childByTestId('label');
  value = this.childByTestId('product-item');
  item = (accountId: number) => this.child(`account-item[id="${accountId}"]`);

  async select(account: Account) {
    await this.value.click();
    await this.item(account.id).click();
    await expect(this.value).toHaveText(new RegExp(account.name));
  }
}
