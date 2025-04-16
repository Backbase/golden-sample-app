import { Route } from '@playwright/test';
import { BasePage } from './_base-page';

export class TransactionsListPage extends BasePage{
  transactionsSearchInput = this.$('bb-transactions-view bb-input-text-ui input');
  transactionSelector = 'bb-transactions-view bb-transaction-item';
  transaction = this.$(this.transactionSelector);


  async searchTransactions(searchTerm: string) {
    await this.transactionsSearchInput.fill(searchTerm);
  }

  async getTransactionsNumber() {
    await this.waitForVisibleTransactions();

    return this.transaction.count();
  }

  async getTransactionListError() {
    await this.page.route(
      '**/transaction-manager/client-api/v2/transactions',
      async (route: Route) => {
        await route.fulfill({
          status: 500,
        });
      }
    );
  }

  async waitForVisibleTransactions() {
    await this.page.waitForSelector(this.transactionSelector);
  }
}
