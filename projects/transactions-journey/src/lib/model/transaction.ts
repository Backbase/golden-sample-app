export interface Transaction {
  categoryCode: string;
  dates: {
    valueDate: number;
  };
  transaction: {
    amountCurrency: {
      amount: number;
      currencyCode: string;
    };
    type: string;
    creditDebitIndicator: string;
  };
  merchant: {
    name: string;
    accountNumber: string;
  };
}
