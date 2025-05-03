import { BaseComponent, PageInfo, formatData } from '@backbase-gsa/e2e-tests';
import { TransactionDetailsDataType } from '../../model';
import { LabeledData } from './labeled-data';
import {
  getTransactionAmountValue,
  getTransactionDate,
} from './transaction-details';

type TransactionPropertyName =
  | 'recipient'
  | 'date'
  | 'amount'
  | 'category'
  | 'description'
  | 'status';
type TransactionDetailsData = Pick<
  TransactionDetailsDataType,
  TransactionPropertyName
>;

// NOT Recommended to use generic methods for Page Objects as validations in such classes are unpredictable and hard to maintain better to describe explicitly which fields to use as it is shown in example of TransactionDetails class
export class TransactionDetailsGeneric extends BaseComponent {
  constructor(pageObject: PageInfo) {
    super(pageObject.page.locator('bb-transaction-details'), pageObject);
  }

  async toHaveDetails(transaction: Partial<TransactionDetailsData>) {
    await this.toHaveData<Partial<TransactionDetailsData>>(
      {
        actual: () => this.getTransactionDetails(transaction),
        expected: this.formatTransactionData(transaction),
      },
      {
        stepName: `Then validate Transactions details: ${JSON.stringify(
          transaction
        )}`,
      }
    );
  }

  isTransactionProperty = (key: string): key is TransactionPropertyName => {
    return key in this;
  };

  async getTransactionDetails(
    transaction: Partial<TransactionDetailsData>
  ): Promise<Partial<TransactionDetailsData>> {
    const testIds = Object.keys(transaction)
      .filter(
        (key) => transaction[key as keyof TransactionDetailsData] !== undefined
      )
      .filter((key) => this.isTransactionProperty(key));
    const contents = await Promise.all(
      testIds.map((testId) =>
        new LabeledData(this.childByTestId(testId)).getText()
      )
    );
    return Object.fromEntries(
      testIds.map((testId, i) => [testId, contents[i]?.trim()])
    ) as Partial<TransactionDetailsData>;
  }

  formatTransactionData(
    transaction: Partial<TransactionDetailsData>
  ): Partial<TransactionDetailsData> {
    const transactionDetails = Object.fromEntries(
      Object.entries(transaction).filter(([key]) =>
        this.isTransactionProperty(key)
      )
    );
    const transactionFormatters = new Map<string, (value: any) => string>([
      ['date', getTransactionDate],
      ['amount', getTransactionAmountValue],
    ]);
    return formatData(transactionDetails, transactionFormatters);
  }
}
