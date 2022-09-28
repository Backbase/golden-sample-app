import { Pipe, PipeTransform } from '@angular/core';
import { TransactionItem } from '@backbase/data-ang/transactions';

@Pipe({
  name: 'filterTransactions',
})
export class FilterTransactionsPipe implements PipeTransform {
  transform(value: TransactionItem[], text: string): TransactionItem[] {
    if (text) {
      const lowerCaseText = text.toLocaleLowerCase();
      return value.filter(
        ({ merchant, type, counterPartyName = '' }: TransactionItem) =>
          merchant?.name.toLocaleLowerCase().includes(lowerCaseText) ||
          counterPartyName.toLocaleLowerCase().includes(lowerCaseText) ||
          type.toLocaleLowerCase().includes(lowerCaseText)
      );
    }

    return value;
  }
}
