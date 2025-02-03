export interface TransactionsJourneyTransactionViewTranslations {
  'transactions.filters.label': string;
  'transactions.account-filter.remove': string;
  [key: string]: string;
}
export const transactionsJourneyTransactionViewTranslations: TransactionsJourneyTransactionViewTranslations =
  {
    'transactions.filters.label': $localize`:Label for filtered by - 'filtered by:'|This string is used as the
              label for the filter section in the transactions view. It is
              presented to the user to indicate the criteria by which the
              transactions are filtered. This label is located in the transactions
              view component.@@transactions.filters.label:filtered by`,
    'transactions.account-filter.remove': $localize`:Remove account label for Account Badge - 'Remove account
              filter'|This string is used as the title for the remove account
              filter button in the transactions view. It is presented to the user
              as a tooltip when they hover over the button to remove the account
              filter. This title is located in the transactions view
              component.@@transactions.account-filter.remove:Remove account filter`,
  };
