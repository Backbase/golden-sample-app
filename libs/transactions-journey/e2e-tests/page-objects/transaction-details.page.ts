import { BasePage } from './_base-page';

export class TransactionDetailsPage extends BasePage {
  transactionsItemSelector = 'bb-transaction-details dl > div';
  transactionsItem = this.$(this.transactionsItemSelector);

  async getDetails() {
    await this.waitForVisibleDetails();

    const details: Record<string, string> = {};
    const items = await this.transactionsItem.all();

    for (const item of items) {
      const title = await this.transactionsItem.innerText();
      const value = await this.transactionsItem.innerText();
      details[title] = value;
    }

    return details;
  }

  async waitForVisibleDetails() {
    await this.page.waitForSelector(this.transactionsItemSelector);
  }
}
