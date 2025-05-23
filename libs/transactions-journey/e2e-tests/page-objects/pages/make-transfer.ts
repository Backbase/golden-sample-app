import { BasePage } from '@backbase/e2e-tests';
import { AmountComponent, AccountSelector } from '../ui-components';
import { test } from '@playwright/test';
import type { Transfer } from '../../data/transfer';

export class MakeTransferPage extends BasePage {
  fromAccount = new AccountSelector(this.byTestId('from-account'));
  toAccount = new AccountSelector(this.byTestId('to-account'));
  amount = new AmountComponent(this.locator('bb-currency-input-ui'));
  noteTextarea = this.byTestId('note-textarea');
  continueButton = this.locator('continue-button');
  clearButton = this.locator('clear-button');

  async fillInTransferDetails(transfer: Transfer) {
    await test.step('Fill in transfer details', async () => {
      await this.fromAccount.select(transfer.fromAccount);
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
}
