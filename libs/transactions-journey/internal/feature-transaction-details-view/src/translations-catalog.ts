export interface TransactionsJourneyTransactionDetailsViewTranslations {
  'transactions.details.recepient': string;
  'transactions.details.date': string;
  'transactions.details.amount': string;
  'transactions.details.category': string;
  'transactions.details.description': string;
  'transactions.details.status': string;
  'transaction-details.repeat': string;
  'transactions-journey.unknown-recipient': string;
  'transactions-journey.unknown-status': string;
  'transactions-journey.uncategorized-category': string;
}

export const transactionsJourneyTransactionDetailsViewTranslations: TransactionsJourneyTransactionDetailsViewTranslations =
  {
    'transactions.details.recepient': $localize`:Recepient label for Transaction Details - 'Recepient'|This
                  string is used as the label for the recipient field in the
                  transaction details view. It is presented to the user when they
                  view the details of a transaction. This label is located in the
                  transaction details view
                  component.@@transactions.details.recepient:Recipient`,
    'transactions.details.date': $localize`:Date label for Transaction Details - 'Date'|This string is used
                  as the label for the date field in the transaction details view.
                  It is presented to the user when they view the details of a
                  transaction. This label is located in the transaction details
                  view component.@@transactions.details.date:Date`,
    'transactions.details.amount': $localize`:Amount label for Transaction Amount - 'Amount'|This string is
                  used as the label for the amount field in the transaction
                  details view. It is presented to the user when they view the
                  details of a transaction. This label is located in the
                  transaction details view component.@@transactions.details.amount:Amount`,
    'transactions.details.category': $localize`:Category label for Transaction Details - 'Category'|This string
                  is used as the label for the category field in the transaction
                  details view. It is presented to the user when they view the
                  details of a transaction. This label is located in the
                  transaction details view
                  component.@@transactions.details.category:Category`,
    'transactions.details.description': $localize`:Description label for Transaction Details - 'Description'|This
                  string is used as the label for the description field in the
                  transaction details view. It is presented to the user when they
                  view the details of a transaction. This label is located in the
                  transaction details view
                  component.@@transactions.details.description:Description`,
    'transactions.details.status': $localize`:Status label for Transaction Details - 'Status'|This string is
                  used as the label for the status field in the transaction
                  details view. It is presented to the user when they view the
                  details of a transaction. This label is located in the
                  transaction details view component.@@transactions.details.status:Status`,
    'transaction-details.repeat': $localize`:Label for Repeat Transaction - 'Repeat transaction'|This string is
                used as a label for the 'Repeat transaction' button. It is
                presented to the user in the transaction details view when they
                want to repeat a previous transaction. This label is located
                within the transaction details section of the
                layout.@@transaction-details.repeat:Repeat`,
    'transactions-journey.unknown-recipient': $localize`:Unknown Recipient - 'Unknown'|This string is used as a 
                placeholder for the recipient field in the transaction details view when the recipient's name is 
                not available. It is presented to the user when they view the details of a transaction that does 
                not have a recipient's name. This placeholder is located in the transaction details view 
                component.@@transactions-journey.unknown-recipient:Unknown`,
    'transactions-journey.unknown-status': $localize`:Unknown Status - 'UNKNOWN'|This string is used as a 
                placeholder for the status field in the transaction details view when the transaction's 
                billing status is not available. It is presented to the user when they view the details of 
                a transaction that does not have a billing status. This placeholder is located in the 
                transaction details view component.@@transactions-journey.unknown-status:UNKNOWN`,
    'transactions-journey.uncategorized-category': $localize`:Uncategorized Category - 'Uncategorized'|This string 
                is used as a placeholder for the category field in the transaction details view when the transaction's 
                category is not available. It is presented to the user when they view the details of a transaction 
                that does not have a category. This placeholder is located in the transaction details view 
                component.@@transactions-journey.uncategorized-category:Uncategorized`,
  };

export const getStatusTextFromErrorMessage = (id: string) => {
  return $localize`:Transaction Not Found Status Text - 'Transaction \${id} not found'|This string is used as the status text for an HTTP error response when a transaction with the specified ID is not found. It is presented to the user when they attempt to view a transaction that does not exist. This status text is located in the transaction details view component.@@transactions-journey.transaction-not-found-status-text:Transaction ${id} not found`;
};
