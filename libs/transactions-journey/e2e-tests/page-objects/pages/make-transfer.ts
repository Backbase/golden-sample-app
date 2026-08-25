import { BasePage } from '@backbase/e2e-tests';
import { AmountComponent, AccountSelector } from '../ui-components';
import { Locator, test } from '@playwright/test';
import type { Transfer } from '../../data/transfer';

export class MakeTransferPage extends BasePage {
  rootLocator = this.locator('bb-transfer-journey');
  fromAccountLocator = this.rootLocator.getByRole('textbox', {
    name: 'From Account',
  });
  fromAccount = new AccountSelector(this.fromAccountLocator);
  toAccountLocator = this.rootLocator.getByRole('textbox', {
    name: 'To Account',
  });
  toAccount = new AccountSelector(this.toAccountLocator);
  amount = new AmountComponent(
    this.rootLocator.locator('bb-currency-input-ui')
  );
  submitButton = this.rootLocator.getByRole('button', { name: 'Submit' });
  noteTextarea = this.byTestId('note-textarea');
  continueButton = this.locator('continue-button');
  clearButton = this.locator('clear-button');

  async fillInTransferDetails(transfer: Transfer) {
    await test.step('Fill in transfer details', async () => {
      if (await this.fromAccountLocator.isEnabled()) {
        await this.fromAccount.select(transfer.fromAccount);
      }
      await this.toAccount.select(transfer.toAccount);
      await this.amount.fill(transfer.amount);
      await this.noteTextarea.fill(transfer.note);
    });
  }

  async submit() {
    await test.step('Submit Transfer', async () => {
      await this.continueButton.click();
    });
  }

  async clearForm() {
    await test.step('Clear transfer form', async () => {
      await this.clearButton.click();
    });
  }

  get element(): Locator {
    return this.rootLocator;
  }
}
