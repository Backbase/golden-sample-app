import { Pipe, PipeTransform } from '@angular/core';
import { TransactionItem } from '@backbase/data-ang/transactions';

@Pipe({
  name: 'filterTransactions',
})
export class FilterTransactionsPipe implements PipeTransform {
  transform(
    value: TransactionItem[],
    text: string,
    accountId?: string | null
  ): TransactionItem[] {
    if (text) {
      const lowerCaseText = text.toLocaleLowerCase();
      return value.filter(
        ({ merchant, type }: TransactionItem) =>
          merchant?.name.toLocaleLowerCase().includes(lowerCaseText) ||
          type.toLocaleLowerCase().includes(lowerCaseText)
      );
    }

    if (accountId) {
      return value.filter((item) => item.arrangementId === accountId);
    }

    return value;
  }
}
